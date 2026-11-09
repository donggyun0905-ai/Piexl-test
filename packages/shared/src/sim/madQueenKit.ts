// 매드퀸 공용 도우미 (sim/madQueen·madQueenArms·화면이 같이 씀): 함대 빛깔 · 대포 수 · 대포·날개 자리 · 폭발 · 받는 피해
import { MADQUEEN_PERKS as K, MQ_CANNON_PERKS } from "../itemsMadQueen";
import { MADQUEEN as Q, type FleetStyle } from "../weaponsMadQueen";
import { alive, isBoss, poison } from "./s2Kit";
import { ignite } from "./status";
import { statusHit } from "./statusHit";
import { damageEnemy } from "./combat";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, weaponOf } from "./util";

export const isMadQueen = (p: PlayerState) => p.characterId === "madQueen";

export const fleetOf = (p: PlayerState): FleetStyle => weaponOf(p).fleet ?? { color: 0 };

/** 머리 위 대포 수 (1 + 대포 아이템, 최대 4) */
export const cannonCount = (p: PlayerState) => Math.min(Q.cannonMax, 1 + MQ_CANNON_PERKS.filter((id) => hasPerk(p, id)).length);

/** 대포 i의 자리 (머리 위 포대: 1문 가운데 · 2문 나란히 · 3문 아래 둘 + 위 하나 · 4문 2×2) */
export function cannonPos(p: PlayerState, i: number, n = cannonCount(p)): [number, number] {
  const top = i >= 2;
  const pair = top ? n - 2 : Math.min(n, 2);
  const dx = pair === 1 ? 0 : (i % 2 === 0 ? -1 : 1) * Q.cannonGap * 0.5;
  return [p.x + dx, p.y - Q.cannonY - (top ? Q.cannonRow : 0)];
}

/** 날개 i의 자리: 짝수는 왼쪽 · 홀수는 오른쪽, 둘째 줄은 아래로 둥글게 감쌈 */
export function wingPos(p: PlayerState, i: number): [number, number] {
  const side = i % 2 === 0 ? -1 : 1;
  const tier = i >> 1;
  return [p.x + side * (22 - tier * 2), p.y - 10 + tier * 12];
}

/** 터렛·일제사격 포탄을 놓을 아무 곳 (방 끝에서 px·py 안쪽) · 패왕전은 나 둘레 Q.pwPlace 안만 */
export function mqSpot(s: RunState, rnd: () => number, px: number, py: number): [number, number] {
  const p = s.player;
  const r = s.pvp ? Q.pwPlace : Infinity;
  const x0 = Math.max(ROOM_MIN_X + px, p.x - r);
  const x1 = Math.min(ROOM_MAX_X - px, p.x + r);
  const y0 = Math.max(ROOM_MIN_Y + py, p.y - r);
  const y1 = Math.min(ROOM_MAX_Y - py, p.y + r);
  return [x0 + rnd() * Math.max(0, x1 - x0), y0 + rnd() * Math.max(0, y1 - y0)];
}

/** 폭발 반지름 (함대 · 고폭 탄두) */
export const boomR = (p: PlayerState, base: number) => base * (fleetOf(p).boom ?? 1) * (hasPerk(p, "mqWarhead") ? K.mqWarhead.boom : 1);

/** 터렛·날개가 나올 확률 (함대 · 아이템) */
export const turretChance = (p: PlayerState) => Q.turretChance + (fleetOf(p).chance ?? 0) + (hasPerk(p, "mqRig") ? K.mqRig.chance : 0);
export const wingChance = (p: PlayerState) => Q.wingChance + (fleetOf(p).chance ?? 0) + (hasPerk(p, "mqSquadron") ? K.mqSquadron.chance : 0);

/** 매드퀸 공격 한 번: (fx, fy)에서 밀려나는 쪽으로 · 함대 상태이상 */
export function mqHit(s: RunState, e: EnemyState, dmg: number, fx: number, fy: number, push = 0): void {
  const p = s.player;
  const [dx, dy] = normalize(e.x - fx, e.y - fy) ?? [p.faceX, p.faceY];
  const f = fleetOf(p);
  if (f.dot) statusHit(s, e, f.dot, dmg, dx, dy);
  else damageEnemy(s, e, dmg, dx, dy);
  if (f.dot === "burn") ignite(e, dmg * Q.burnMul);
  else if (f.dot === "poison") poison(e, dmg * Q.poisonMul, Q.poisonTicks);
  const pp = push + (f.push ?? 0);
  if (pp > 0 && !isBoss(e) && e.kind !== "dummy") {
    e.x += dx * pp;
    e.y += dy * pp;
  }
}

/** 폭발: 둘레 r 안 모두 · 등대 번개포는 바깥 가까운 적에게 번개가 튐 · 맞은 적 수 */
export function explode(s: RunState, x: number, y: number, r: number, dmg: number, push = 0): EnemyState[] {
  const p = s.player;
  const hits = alive(s).filter((e) => dist2(e, { x, y }) <= (r + e.r) ** 2);
  for (const e of hits) mqHit(s, e, dmg, x, y, push);
  addEffect(s, { kind: "mqBoom", x, y, dirX: 0, dirY: 0, size: r, maxTicks: 20, style: fleetOf(p).color });
  const n = fleetOf(p).chain ?? 0;
  if (n > 0) {
    const far = alive(s)
      .filter((e) => !hits.includes(e) && dist2(e, { x, y }) <= (r + Q.chainReach) ** 2)
      .sort((a, b) => dist2(a, { x, y }) - dist2(b, { x, y }) || a.id - b.id)
      .slice(0, n);
    for (const e of far) {
      mqHit(s, e, dmg * Q.chainMul, x, y);
      addEffect(s, { kind: "mqBolt", x, y, toX: e.x, toY: e.y, dirX: 0, dirY: 0, size: 5, maxTicks: 12, style: 2 });
    }
  }
  return hits;
}

/** 자유의 바다 (classTaken) */
export const madQueenTaken = (p: PlayerState) => (hasPerk(p, "mqFreedom") ? K.mqFreedom.taken : 1);
