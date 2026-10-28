// 패왕전 세계 한 틱: 자리(나·친구·AI)마다 '그림자 적'(proxy, kind "fighter")을 하나씩 두고,
// 그 자리를 꺼내 놓을 때 s.enemies = 상대 쪽 그림자 적 목록 → 기존 캐릭터 공격 계산이 그대로 상대를 때림.
// 틱 끝에 그림자 적이 받은 피해·기절·느려짐을 그 사람에게 옮김 (보호막·회피·무적은 damagePlayer가 처리)
import { PW_CHAR } from "../paewangBalance";
import { PW } from "../paewangDefs";
import { damagePlayer, removeDead, updatePending } from "./combat";
import { allPlayers, eachSeat, isAlive, seatNo, useSeat } from "./party";
import { updateProjectiles } from "./projectiles";
import { updateEffects } from "./run";
import { tickDots } from "./status";
import { updateCharms } from "./talisman";
import type { EnemyState, RunState } from "./types";
import { makeEnemy } from "./util";

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
    s.enemies = live.filter((e) => pv.seats[pv.proxies.indexOf(e)]!.team !== team);
  });
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
    // 넘친 피해까지 그대로 (잘라 넘기면 받는 피해가 줄어드는 캐릭터는 체력이 0에 끝없이 가까워지기만 함)
    // 한 틱에 받는 피해는 (최대 체력 + 처음 보호막)의 burstCap까지 (한 방에 쓰러지지 않게)
    // 캐릭터별 패왕전 받는 피해 보정 (paewangBalance)
    const dmg = Math.min((start[i]! - e.hp) * (PW_CHAR[s.player.characterId]?.taken ?? 1), (s.player.stats.maxHp + PW.shield) * PW.burstCap);
    if (e.lastHit !== undefined && e.lastHit !== i) seat.by = e.lastHit;
    if (dmg > 0) {
      // 맞을 수 있던 그림자 적이 받은 피해는 이번 틱에 다른 공격으로 생긴 무적에 막히지 않음
      const p = s.player;
      const keep = [p.invulnTicks, p.shieldTicks] as const;
      if (!e.immune) p.invulnTicks = p.shieldTicks = 0;
      damagePlayer(s, dmg);
      p.invulnTicks = Math.max(p.invulnTicks, keep[0]);
      p.shieldTicks = Math.max(p.shieldTicks, keep[1]);
    }
    seat.stun = Math.max(seat.stun, Math.min(90, e.stunTicks ?? 0));
    seat.slow = Math.max(seat.slow, Math.min(180, e.slowTicks ?? 0));
    seat.root = Math.max(seat.root, Math.min(120, e.rootTicks ?? 0));
    e.stunTicks = e.slowTicks = e.rootTicks = e.fearTicks = 0;
  });
}
