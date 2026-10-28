// 패왕전 진행: 쓰러짐(처치·데스) · 토너먼트 다음 차례 · 데스매치 레벨·다시 나오기 · 숲 함정 · 승패 (떨어지는 물건은 pvpExtras)
import { PW, PW_TIERS } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { checkDeath } from "./run";
import { damagePlayer } from "./combat";
import { inRect, spotXY } from "./paewangGrid";
import { gunSwap } from "./paewangKit";
import { allPlayers, eachSeat, useSeat } from "./party";
import { inPlay } from "./pvpWorld";
import { nextRound } from "./pvpRounds";
import { recapEnv, recapReset } from "./pvpRecap";
import { clearSkills } from "./pwSkill";
import type { RunState } from "./types";
import { addEffect } from "./util";

/** 전투에 나설 때: 체력 가득 + 보호막 */
export function freshStart(s: RunState): void {
  const p = s.player;
  p.hp = p.stats.maxHp;
  p.shieldPts = PW.shield;
  p.invulnTicks = PW.spawnGuard;
  p.pwStand = undefined;
}

/** 풋내기 패시브: 쓰러질 때 한 번 체력 1로 3초 버팀 (그동안 안 쓰러짐), 끝나면 쓰러짐. 버티는 중이면 true */
function lastStand(s: RunState): boolean {
  const p = s.player;
  if (p.characterId !== "novice" || p.pwStand === -1) return false;
  if (p.pwStand === undefined) {
    if (p.hp >= 0.5) return false;
    p.pwStand = s.tick + PW.standTicks;
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 22, maxTicks: 20 });
  }
  if (s.tick < p.pwStand) {
    p.hp = Math.max(p.hp, 1);
    return true;
  }
  p.pwStand = -1;
  p.hp = 0;
  return false;
}

/** 경기장 자리 중 살아 있는 사람들과 가장 먼 곳 */
export function farSpot(s: RunState, me: number): [number, number] {
  const def = PW_ARENAS[s.pvp!.arena];
  const spots = def.spots.length ? def.spots : [...def.teamA, ...def.teamB];
  const players = allPlayers(s);
  let best = spotXY(spots[0]!);
  let bd = -1;
  for (const sp of spots) {
    const [x, y] = spotXY(sp);
    let near = Infinity;
    players.forEach((p, j) => {
      if (j !== me && inPlay(s, j)) near = Math.min(near, (p.x - x) ** 2 + (p.y - y) ** 2);
    });
    if (near > bd) {
      bd = near;
      best = [x, y];
    }
  }
  return best;
}

/** 쓰러진 사람 정리 (되살아나는 아이템이 있으면 버팀) */
export function settleDeaths(s: RunState): void {
  const pv = s.pvp!;
  eachSeat(s, (i) => {
    const seat = pv.seats[i]!;
    // 화면에 0으로 보이는 체력(0.5 미만)은 쓰러짐
    if (seat.on && lastStand(s)) return;
    if (seat.on && s.player.hp > 0 && s.player.hp < 0.5) s.player.hp = 0;
    if (!seat.on || s.player.hp > 0 || !checkDeath(s)) return;
    seat.on = false;
    seat.fell = true;
    // 쓰러지면 스킬 장판·예고·소환·버프·돌진도 끝
    clearSkills(s, i);
    s.player.pwBuffs = s.player.pwDash = undefined;
    seat.silence = 0;
    seat.push = undefined;
    seat.deaths++;
    // 쓰러지면 그 사람이 쏜 탄도 바로 사라짐
    s.projectiles = s.projectiles.filter((pr) => !pr.fromPlayer || pr.shooter !== i);
    addEffect(s, { kind: "burst", x: s.player.x, y: s.player.y, dirX: 0, dirY: 0, size: 16, maxTicks: 16 });
    const k = seat.by !== undefined ? pv.seats[seat.by] : undefined;
    if (k && seat.by !== i) k.kills++;
    if (i === 0 && pv.mode === "brawl") pv.place = pv.seats.filter((x, j) => j !== i && inPlay(s, j)).length + 1;
    if (pv.mode === "gungame") {
      seat.back = s.tick + PW.respawn;
      if (k && seat.by !== undefined) levelUp(s, seat.by);
    } else if (pv.mode === "tourney") {
      // 같은 편 다음 사람이 잠시 뒤 나옴
      const next = pv.seats.findIndex((x, j) => j !== i && x.team === seat.team && !x.on && !x.fell && x.back === undefined);
      if (next >= 0) pv.seats[next]!.back = s.tick + PW.nextFoe;
    }
    seat.by = undefined;
  });
}

/** 데스매치: 처치한 자리가 다음 레벨(더 약한 캐릭터, 무기·패시브·아이템 무작위) · 21레벨에서 처치하면 승리 */
function levelUp(s: RunState, k: number): void {
  const pv = s.pvp!;
  const seat = pv.seats[k]!;
  if (++seat.lv > PW.gunLevels) {
    pv.winner = seat.team;
    return;
  }
  const back = s.seat ?? 0;
  useSeat(s, k);
  const shield = s.player.shieldPts;
  gunSwap(s, PW_TIERS[seat.lv - 1]!);
  s.player.shieldPts = shield;
  useSeat(s, back);
}

/** 기다리던 사람 나오기 (토너먼트 다음 차례 · 데스매치 다시 살아나기) */
export function bringBack(s: RunState): void {
  const pv = s.pvp!;
  eachSeat(s, (i) => {
    const seat = pv.seats[i]!;
    if (seat.back === undefined || seat.back > s.tick) return;
    seat.back = undefined;
    seat.on = true;
    recapReset(seat);
    const def = PW_ARENAS[pv.arena];
    const [x, y] = pv.mode === "tourney" ? spotXY((seat.team === 0 ? def.teamA : def.teamB)[0]!) : farSpot(s, i);
    const p = s.player;
    p.x = p.prevX = x;
    p.y = p.prevY = y;
    // 토너먼트 다음 사람은 처음 체력 그대로 · 데스매치는 다시 가득
    freshStart(s);
  });
}

/** 쓰러진 사람(나·친구)은 살아 있는 같은 편을 따라다니며 지켜봄 */
export function watchTeam(s: RunState): void {
  const pv = s.pvp!;
  const players = allPlayers(s);
  pv.seats.forEach((seat, i) => {
    if (!seat.human || seat.on || seat.back !== undefined) return;
    const mate = players.findIndex((_, j) => pv.seats[j]!.team === seat.team && inPlay(s, j));
    if (mate < 0) return;
    const p = players[i]!;
    p.x = p.prevX = players[mate]!.x;
    p.y = p.prevY = players[mate]!.y;
  });
}

/** 이긴 편 정하기: 한 편만 남으면 (데스매치는 21레벨 처치로) */
export function decide(s: RunState): void {
  const pv = s.pvp!;
  if (pv.winner === undefined && pv.mode !== "gungame") {
    const alive = new Set(pv.seats.filter((x, j) => inPlay(s, j) || x.back !== undefined).map((x) => x.team));
    // 3판 2선승이면 다음 판으로 (시리즈를 이긴 편이 나오면 끝)
    const w = [...alive][0] ?? -1;
    if (alive.size <= 1 && !nextRound(s, w)) pv.winner = w;
  }
  if (pv.winner === undefined) return;
  s.over = true;
  s.won = pv.winner === pv.seats[s.seat ?? 0]!.team;
}

/** 숲 함정: 간격마다 가시가 튀어나와 위에 선 모두를 찌름 */
export const trapUp = (s: RunState): boolean => s.tick % PW.trapEvery < PW.trapUp;

export function updateTraps(s: RunState): void {
  const traps = PW_ARENAS[s.pvp!.arena].traps;
  const ph = s.tick % PW.trapEvery;
  if (!traps.length || (ph !== 1 && ph !== 20)) return;
  eachSeat(s, (i) => {
    if (inPlay(s, i) && traps.some((t) => inRect(s.player.x, s.player.y, t))) {
      const before = s.player.hp;
      damagePlayer(s, PW.trapDmg);
      recapEnv(s, before);
    }
  });
}
