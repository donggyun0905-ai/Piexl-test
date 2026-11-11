// 패왕전 세계 한 틱: 자리(나·친구·AI)마다 '그림자 적'(proxy, kind "fighter")을 하나씩 두고,
// 그 자리를 꺼내 놓을 때 s.enemies = 상대 쪽 그림자 적 목록 → 기존 캐릭터 공격 계산이 그대로 상대를 때림.
// 틱 끝에 그림자 적이 받은 피해·기절·느려짐을 그 사람에게 옮김 (보호막·회피·무적은 damagePlayer가 처리)
import { PW_CHAR } from "../paewangBalance";
import { PW, PW_MODE } from "../paewangDefs";
import { PW_GIGA } from "../pwRules";
import { warEarly, warRole } from "./pwWarBot";
import { damagePlayer as damagePlayer_, removeDead as removeDead_ } from "./combat";
import { updatePending as updatePending_ } from "./pending";
import { allPlayers, eachSeat, isAlive, seatNo, useSeat } from "./party";
import { updateProjectiles as updateProjectiles_ } from "./projectiles";
import { updateEffects } from "./run";
import { tickDots } from "./status";
import { updateCharms } from "./talisman";
import type { EnemyState, RunState } from "./types";
import { dist2, makeEnemy } from "./util";
import { fogAt, inBush } from "./paewangGrid";
import { buffMul, pwHidden } from "./pwSkillHit";
import { practiceSafe } from "./pvpPractice";
import { recapTake } from "./pvpRecap";
import { gearHits } from "./pwGear";
import { srcFn } from "./dmgSrc";
const damagePlayer = srcFn("pvpWorld", () => damagePlayer_), removeDead = srcFn("pvpWorld", () => removeDead_), updatePending = srcFn("pvpWorld", () => updatePending_), updateProjectiles = srcFn("pvpWorld", () => updateProjectiles_);

/** 경기장에 나와 살아 있는 자리인지 */
export function inPlay(s: RunState, i: number): boolean {
  return !!s.pvp?.seats[i]?.on && isAlive(allPlayers(s)[i]!);
}

/** 자리마다 그림자 적 하나 (처음 한 번) */
export function makeProxies(s: RunState): void {
  s.pvp!.proxies = allPlayers(s).map((p) => {
    const e = makeEnemy(s, "fighter", p.x, p.y, 1, 0);
    e.noGold = false;
    return e;
  });
}

/** 자리마다 상대 쪽 그림자 적 목록을 s.enemies에 둠 */
export function assignFoes(s: RunState): void {
  const pv = s.pvp!;
  const live = pv.proxies.filter((_, j) => inPlay(s, j));
  eachSeat(s, (i) => {
    const team = pv.seats[i]!.team;
    // 상대 쪽 사람 + 상대가 소환한 것 (부술 수 있음)
    const mins = (pv.mins ?? []).filter((m) => m.body && m.body.hp > 0 && m.t > 0 && pv.seats[m.seat]!.team !== team).map((m) => m.body!);
    // 성장 대결: 상대 편·중립 병사·포탑·보스
    // 중립(정글·거인·도깨비)은 가까이 있을 때만 (큰 맵에서 계산을 줄임)
    const p = s.player;
    // 기간토마키아 AI: 레벨이 되는 거인만 · 가까운 상대 캐릭터만
    const giga = PW_MODE[pv.mode].rule === "giganto" && !pv.seats[i]!.human;
    const near = (e: { x: number; y: number }, r: number) => (e.x - p.x) ** 2 + (e.y - p.y) ** 2 < r * r;
    // 전쟁의 서막 10분 전: 길에 선 AI(정글 빼고)는 자기를 쫓는 정글 몬스터만 (길을 벗어나 정글로 새지 않게)
    const laner = PW_MODE[pv.mode].rule === "war" && !pv.seats[i]!.human && warEarly(s) && warRole(s, i) !== "jungle";
    const units = (pv.grow?.units ?? []).filter((u) => u.team !== team && u.body.hp > 0 && (u.team !== 2 || (near(u.body, 500) && (!laner || u.foe === i) && (!giga || (p.pwLv ?? 1) >= (PW_GIGA.botLv[u.kind] ?? 1))))).map((u) => u.body);
    // 처음 botCalm 동안은 맞았을 때만 싸움 (먼저 흩어져 파밍), 그 뒤로는 보이는 상대와 싸움 (도망은 pwGiga.gigaSteer)
    const calm = giga && s.tick - (pv.readyAt ?? 0) < PW_GIGA.botCalm;
    s.enemies = live
      .filter((e) => {
        const j = pv.proxies.indexOf(e);
        return pv.seats[j]!.team !== team && (!giga || (near(e, PW_GIGA.botSight) && (!calm || pv.seats[i]!.by === j)));
      })
      .concat(mins, units);
  });
}

/** 지금 자리(s.player) 눈에 안 보이는 상대 표시: 수풀 안이면 가까이서만 보임 · 투명 스킬 */
export function markHidden(s: RunState): void {
  const pv = s.pvp!;
  const players = allPlayers(s);
  for (const e of s.enemies) {
    const who = players[pv.proxies.indexOf(e)];
    // 전쟁의 서막 안개: 같은 안개 안에 있어야 보임
    const fog = fogAt(pv.arena, e.x, e.y);
    e.pwHid = (inBush(pv.arena, e.x, e.y) && dist2(e, s.player) > PW.hideNear * PW.hideNear) || (!!who && pwHidden(who)) || (fog >= 0 && fog !== fogAt(pv.arena, s.player.x, s.player.y));
  }
}

/** 틱 시작: 그림자 적을 그 사람 자리·체력(+보호막)으로 맞춤. 맞춘 체력을 돌려줌 */
export function syncProxies(s: RunState): number[] {
  const pv = s.pvp!;
  const start = allPlayers(s).map((p, i) => {
    const e = pv.proxies[i]!;
    e.prevX = p.prevX;
    e.prevY = p.prevY;
    e.x = p.x;
    e.y = p.y;
    e.r = p.r;
    e.maxHp = p.stats.maxHp;
    e.hp = Math.max(0, p.hp) + (p.shieldPts ?? 0);
    e.dirX = p.faceX;
    e.lastHit = undefined;
    return e.hp;
  });
  guardProxies(s);
  assignFoes(s);
  return start;
}

/** 사람이 무적(맞은 뒤·대시·결계)이면 그림자 적도 맞지 않음 (안 죽는데 처치·영혼만 나오지 않게) */
function guardProxies(s: RunState): void {
  allPlayers(s).forEach((p, i) => {
    s.pvp!.proxies[i]!.immune = p.dashTicks > 0 || p.invulnTicks > 0 || p.shieldTicks > 0;
  });
}

/** 사람들이 움직인 뒤: 탄·부적·잠시 뒤 폭발 → 그림자 적 상태이상 피해 → 받은 것을 사람에게 */
export function pvpWorld(s: RunState, start: number[]): void {
  guardProxies(s);
  updateProjectiles(s, false);
  // 처치로 목록이 섞일 수 있어 단계마다 다시 나눔
  assignFoes(s);
  eachSeat(s, (i) => {
    updateCharms(s);
    updatePending(s);
    removeDead(s);
    for (const pr of s.projectiles) if (pr.fromPlayer && pr.shooter === undefined) pr.shooter = i;
  });
  assignFoes(s);
  // 모든 그림자 적 한 번씩: 불·독 피해 · 맞은 빛 (움직임·상태 시간은 사람 쪽, transfer)
  const back = seatNo(s);
  const own = s.enemies;
  s.enemies = s.pvp!.proxies.filter((_, j) => inPlay(s, j));
  tickDots(s);
  for (const e of s.enemies) if (e.hitFlash > 0) e.hitFlash--;
  removeDead(s);
  useSeat(s, back);
  s.enemies = own;
  updateEffects(s);
  transfer(s, start);
}

/** 그림자 적이 받은 피해·상태를 그 사람에게 */
function transfer(s: RunState, start: number[]): void {
  const pv = s.pvp!;
  eachSeat(s, (i) => {
    const e: EnemyState = pv.proxies[i]!;
    const seat = pv.seats[i]!;
    if (!inPlay(s, i)) return;
    if (practiceSafe(s, i)) {
      e.stunTicks = e.slowTicks = e.rootTicks = e.fearTicks = 0;
      return;
    }
    // 넘친 피해까지 그대로 (잘라 넘기면 받는 피해가 줄어드는 캐릭터는 체력이 0에 끝없이 가까워지기만 함)
    // 한 틱에 받는 피해는 (최대 체력 + 처음 보호막)의 burstCap까지 (한 방에 쓰러지지 않게)
    // 모두가 받는 피해 배율(PW.taken) × 캐릭터별 패왕전 받는 피해 보정 (paewangBalance) × 스킬 막기 버프
    const dmg = Math.min((start[i]! - e.hp) * PW.taken * (PW_CHAR[s.player.characterId]?.taken ?? 1) * buffMul(s.player, "taken"), (s.player.stats.maxHp + PW.shield) * PW.burstCap);
    if (e.lastHit !== undefined && e.lastHit !== i) seat.by = e.lastHit;
    if (dmg > 0) {
      // 맞을 수 있던 그림자 적이 받은 피해는 이번 틱에 다른 공격으로 생긴 무적에 막히지 않음
      const p = s.player;
      const keep = [p.invulnTicks, p.shieldTicks] as const;
      if (!e.immune) p.invulnTicks = p.shieldTicks = 0;
      const before = p.hp;
      damagePlayer(s, dmg);
      // 점수판: 받은 피해 · 마지막으로 때린 자리가 준 피해
      const lost = Math.max(0, before - Math.max(0, p.hp));
      seat.taken = (seat.taken ?? 0) + lost;
      if (e.lastHit !== undefined && e.lastHit !== i) pv.seats[e.lastHit]!.dealt = (pv.seats[e.lastHit]!.dealt ?? 0) + lost;
      recapTake(s, i, lost, e.lastHit);
      p.invulnTicks = Math.max(p.invulnTicks, keep[0]);
      p.shieldTicks = Math.max(p.shieldTicks, keep[1]);
    }
    seat.stun = Math.max(seat.stun, Math.min(90, e.stunTicks ?? 0));
    seat.slow = Math.max(seat.slow, Math.min(180, e.slowTicks ?? 0));
    seat.root = Math.max(seat.root, Math.min(120, e.rootTicks ?? 0));
    e.stunTicks = e.slowTicks = e.rootTicks = e.fearTicks = 0;
  });
  if (pv.grow && pv.hits) gearHits(s, pv.hits);
  pv.hits = undefined;
}
