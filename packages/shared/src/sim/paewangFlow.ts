// 패왕전 진행: 쓰러짐(나·내 편·상대) · 토너먼트 다음 차례 · 데스매치 레벨·다시 살아나기 · 숲 함정 · 대난투 아이템 · 승패
import { TILE_SIZE } from "../constants";
import { PW, PW_MODE, PW_TIERS } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { createRng, deriveSeed } from "../rng";
import { damagePlayer } from "./combat";
import { inRect, spotXY } from "./paewangGrid";
import { gunSwap } from "./paewangKit";
import { foeHp, makeBrain, spawnAlly, spawnFoe, units } from "./paewangUnits";
import { addPickup, passivePool, usePool, weaponPool } from "./loot";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2 } from "./util";

/** 경기장 자리 중 다른 사람들과 가장 먼 곳 (다시 살아날 때) */
export function farSpot(s: RunState): [number, number] {
  const def = PW_ARENAS[s.pw!.arena];
  const spots = def.spots.length ? def.spots : [...def.teamA, ...def.teamB];
  const list = units(s);
  let best: [number, number] = spotXY(spots[0]!);
  let bd = -1;
  for (const sp of spots) {
    const at = spotXY(sp);
    const pt = { x: at[0], y: at[1] };
    let near = Infinity;
    for (const u of list) near = Math.min(near, dist2(u.b, pt));
    if (near > bd) {
      bd = near;
      best = at;
    }
  }
  return best;
}

function end(s: RunState, won: boolean): void {
  s.over = true;
  s.won = won;
}

/** 상대 AI가 쓰러짐. byMe: 내가 쓰러뜨림 (투사체·근접 계산이 이미 목록에서 뺌) */
export function foeDown(s: RunState, e: EnemyState, byMe: boolean): void {
  const pw = s.pw!;
  const br = e.pw!;
  if (byMe) pw.kills++;
  else addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 14, maxTicks: 14 });
  if (pw.mode === "tourney" && pw.benchB.length > 0) pw.waiting.push({ at: s.tick + PW.nextFoe, char: pw.benchB.shift()!, team: 1, tag: pw.tags++ });
  if (pw.mode !== "gungame") return;
  // 데스매치: 쓰러뜨린 쪽이 다음 레벨(더 약한 캐릭터) · 21레벨에서 쓰러뜨리면 승리
  if (byMe) {
    if (++pw.lv > PW.gunLevels) return end(s, true);
    gunSwap(s, PW_TIERS[pw.lv - 1]!);
  } else {
    const k = s.enemies.find((o) => o.id === e.pwBy && o.pw);
    if (k) levelUp(s, k);
  }
  // 쓰러진 AI는 잠시 뒤 같은 레벨로 다시
  pw.waiting.push({ at: s.tick + PW.respawn, char: br.char, team: br.team, lv: br.lv, tag: br.tag });
}

function levelUp(s: RunState, k: EnemyState): void {
  const br = k.pw!;
  const lv = (br.lv ?? 1) + 1;
  if (lv > PW.gunLevels) return end(s, false);
  const ratio = k.hp / k.maxHp;
  k.pw = { ...makeBrain(s, PW_TIERS[lv - 1]!, br.team, br.tag, lv), cd: br.cd };
  // 새 캐릭터 체력으로 (남은 비율 그대로)
  k.maxHp = foeHp(s, k.pw.char);
  k.hp = Math.max(1, Math.round(k.maxHp * ratio));
}

/** 내가 쓰러짐: 데스매치는 다시 살아남 · 팀 대결은 내 편을 지켜봄 · 그 밖에는 패배 */
export function meDown(s: RunState): void {
  const pw = s.pw!;
  const p = s.player;
  if (pw.mode === "gungame") {
    // 가장 가까운 AI가 쓰러뜨린 것으로 침
    let k: EnemyState | null = null;
    for (const e of s.enemies) if (e.pw && e.hp > 0 && (!k || dist2(e, p) < dist2(k, p))) k = e;
    if (k) levelUp(s, k);
    if (s.over) return;
    const [x, y] = farSpot(s);
    p.x = p.prevX = x;
    p.y = p.prevY = y;
    p.hp = p.stats.maxHp;
    p.invulnTicks = PW.spawnGuard;
    return;
  }
  if (pw.mode === "brawl") pw.place = s.enemies.filter((e) => e.pw && e.hp > 0).length + 1;
  if (pw.mode === "tourney" && pw.benchA.length > 0) pw.waiting.push({ at: s.tick + PW.nextFoe, char: pw.benchA.shift()!, team: 0, tag: pw.tags++ });
  if (pw.allies.some((a) => a.hp > 0) || pw.waiting.some((w) => w.team === 0)) {
    pw.down = true;
    return;
  }
  end(s, false);
}

/** 쓰러진 AI 정리 (AI끼리·내 편이 쓰러뜨림) · 기다리는 AI 나오기 · 승패 */
export function settle(s: RunState): void {
  const pw = s.pw!;
  const dead = s.enemies.filter((e) => e.pw && e.hp <= 0);
  if (dead.length) {
    s.enemies = s.enemies.filter((e) => !dead.includes(e));
    for (const e of dead) if (!s.over) foeDown(s, e, e.pwBy === undefined);
  }
  for (const a of pw.allies) if (a.hp <= 0) addEffect(s, { kind: "burst", x: a.x, y: a.y, dirX: 0, dirY: 0, size: 14, maxTicks: 14 });
  const lost = pw.allies.some((a) => a.hp <= 0);
  pw.allies = pw.allies.filter((a) => a.hp > 0);
  if (lost && pw.mode === "tourney" && pw.benchA.length > 0) pw.waiting.push({ at: s.tick + PW.nextFoe, char: pw.benchA.shift()!, team: 0, tag: pw.tags++ });
  const due = pw.waiting.filter((w) => w.at <= s.tick);
  pw.waiting = pw.waiting.filter((w) => w.at > s.tick);
  for (const w of due) {
    const def = PW_ARENAS[pw.arena];
    const [x, y] = pw.mode === "gungame" ? farSpot(s) : spotXY((w.team === 0 ? def.teamA : def.teamB)[0]!);
    if (w.team === 0) spawnAlly(s, w.char, x, y, w.tag);
    else spawnFoe(s, w.char, w.team, x, y, w.tag, w.lv);
  }
  if (s.over || pw.mode === "gungame") return;
  const foes = s.enemies.some((e) => e.pw && e.hp > 0) || pw.waiting.some((w) => w.team !== 0) || pw.benchB.length > 0;
  if (!foes) return end(s, true);
  const mine = !pw.down || pw.allies.length > 0 || pw.waiting.some((w) => w.team === 0);
  if (!mine) end(s, false);
}

/** 숲 함정: 간격마다 가시가 튀어나와 위에 선 모두를 찌름 (튀어나온 처음과 0.3초 뒤) */
export const trapUp = (s: RunState): boolean => s.tick % PW.trapEvery < PW.trapUp;

export function updateTraps(s: RunState): void {
  const traps = PW_ARENAS[s.pw!.arena].traps;
  const ph = s.tick % PW.trapEvery;
  if (!traps.length || (ph !== 1 && ph !== 20)) return;
  for (const u of units(s)) {
    if (!traps.some((t) => inRect(u.b.x, u.b.y, t))) continue;
    if (u.kind === "me") damagePlayer(s, PW.trapDmg);
    else u.b.hp -= PW.trapDmg * PW_MODE[s.pw!.mode].diff.hp;
  }
}

/** 대난투: 간격마다 들판 아무 곳에 무기·패시브·사용 아이템이 떨어짐 */
export function updateDrops(s: RunState): void {
  if (s.pw!.mode !== "brawl" || s.tick % PW.dropEvery !== 0) return;
  const room = s.rooms[s.roomId]!;
  if (room.pickups.length >= PW.dropMax) return;
  const def = PW_ARENAS[s.pw!.arena];
  const rng = createRng(deriveSeed(s.seed, "pwDrop", s.tick));
  const x = (3 + rng.nextFloat() * (def.cols - 6)) * TILE_SIZE;
  const y = (3 + rng.nextFloat() * (def.rows - 6)) * TILE_SIZE;
  const r = rng.nextFloat();
  const weapons = weaponPool(s, true);
  if (r < 0.2 && weapons.length) addPickup(s, s.roomId, "weapon", rng.pick(weapons), x, y);
  else if (r < 0.5) addPickup(s, s.roomId, "use", rng.pick(usePool(s)), x, y);
  else addPickup(s, s.roomId, "passive", rng.pick(passivePool(s)), x, y);
  addEffect(s, { kind: "burst", x, y, dirX: 0, dirY: 0, size: 16, maxTicks: 20 });
}
