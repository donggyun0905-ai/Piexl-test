// 인형술사 왕관 쓴 아군 (p.ppAllies): 조종을 마친 적이 적 목록에서 빠져 아군이 됨 (원래 그림 + 머리 위 나무 왕관)
// 내 둘레를 따라다니다 보는 거리 안 적에게 걸어가 때림 (피해 = 내 공격력 × 배율). 적 몸에 닿으면 그 적의 몸 피해를 받음 · 방을 옮기면 같이 옴
// 공용 몸 움직임(bodyStep·bodyHurt)은 인형 친구·분신(puppetFriends)도 씀
import { srcCb, srcRun } from "./dmgSrc";
import { ENEMIES } from "../enemyDefs";
import { PUPPET_PERKS as K } from "../itemsPuppet";
import { PUPPET_HAND as H } from "../weaponsPuppet";
import { healPlayer } from "./combat";
import type { PuppetAlly, PuppetBody } from "./ppTypes";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import { ignite } from "./status";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid } from "./util";

/** (x, y)에서 range 안 가장 가까운 적 */
export function foeNear(s: RunState, x: number, y: number, range: number): EnemyState | null {
  let best: EnemyState | null = null;
  let bd = range * range;
  for (const e of s.enemies) {
    if (!alive(e)) continue;
    const d = (e.x - x) ** 2 + (e.y - y) ** 2;
    if (d < bd) {
      bd = d;
      best = e;
    }
  }
  return best;
}

/** 범위 피해 + 터지는 그림(fx, style) · 묶음·불·밀기·당기기·느려짐 (보스는 밀리거나 끌리지 않음) · 맞힌 적 */
export function ppArea(s: RunState, x: number, y: number, r: number, dmg: number, fx: "ppDollPop" | "ppCorpsePop" | "ppBlackPop" | "ppSlam", style: number, opt: { stun?: number; burn?: number; push?: number; slow?: number } = {}): EnemyState[] {
  const hit: EnemyState[] = [];
  const g = roomGrid(s);
  for (const e of s.enemies) {
    if (!alive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (r + e.r) ** 2) continue;
    const d = normalize(e.x - x, e.y - y) ?? [0, 0];
    damageEnemyLite(s, e, dmg, d[0], d[1]);
    if (opt.stun) e.stunTicks = Math.max(e.stunTicks ?? 0, opt.stun);
    if (opt.burn) ignite(e, dmg * opt.burn);
    if (opt.slow) e.slowTicks = Math.max(e.slowTicks ?? 0, opt.slow);
    if (opt.push && !ENEMIES[e.kind].boss) {
      e.x += d[0] * opt.push;
      e.y += d[1] * opt.push;
      keepInRoom(e, g);
    }
    hit.push(e);
  }
  addEffect(s, { kind: fx, x, y, dirX: 0, dirY: 0, size: r, style, maxTicks: 26 });
  return hit;
}

/** 몸 한 걸음 (tx, ty 쪽으로) */
export function bodyStep(s: RunState, b: PuppetBody, tx: number, ty: number, speed: number): void {
  const d = normalize(tx - b.x, ty - b.y);
  if (!d) return;
  b.x += d[0] * speed;
  b.y += d[1] * speed;
  if (Math.abs(d[0]) > 0.2) b.face = d[0] < 0 ? -1 : 1;
  keepInRoom(b, roomGrid(s));
}

/** 적 몸에 닿으면 그 적의 몸 피해 (간격마다) · 쓰러졌으면 true */
export function bodyHurt(s: RunState, b: PuppetBody): boolean {
  if (b.hurt > 0) b.hurt--;
  else {
    for (const e of s.enemies) {
      if (!alive(e) || (e.x - b.x) ** 2 + (e.y - b.y) ** 2 > (e.r + b.r) ** 2) continue;
      b.hp -= ENEMIES[e.kind].contactDamage;
      b.hurt = H.allyHurtCd;
      break;
    }
  }
  return b.hp <= 0;
}

/** 방을 옮기면 내 곁으로 */
export function bringNear(s: RunState, b: PuppetBody, i: number): void {
  const p = s.player;
  b.x = b.prevX = p.x + ((i % 3) - 1) * 14;
  b.y = b.prevY = p.y + 12 + Math.floor(i / 3) * 10;
  keepInRoom(b, roomGrid(s));
}

/** 조종 게이지가 가득 찬 적 → 왕관 쓴 아군 */
export function crownFoe(s: RunState, e: EnemyState): void {
  const p = s.player;
  s.enemies = s.enemies.filter((f) => f !== e);
  if (s.autoTargetId === e.id) s.autoTargetId = -1;
  const id = (p.ppNext ?? 0) + 1;
  p.ppNext = id;
  const maxHp = Math.round(e.maxHp * H.allyHp * (hasPerk(p, "ppCrown") ? K.ppCrown.hp : 1));
  (p.ppAllies ??= []).push({ id, kind: e.kind, x: e.x, y: e.y, prevX: e.x, prevY: e.y, hp: maxHp, maxHp, r: e.r, cd: 20, hurt: 30, face: e.dirX < 0 ? -1 : 1, swing: 0 });
  p.ppCrowned = (p.ppCrowned ?? 0) + 1;
  delete p.ppTarget;
  if (hasPerk(p, "ppStitch")) healPlayer(s, K.ppStitch.crown);
  addEffect(s, { kind: "ppCrown", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r, maxTicks: 40 });
}

/** 아군 공격 간격·피해 (꼭두각시 춤) */
export const allyRate = (s: RunState, base: number) => Math.round(base * (hasPerk(s.player, "ppDance") ? K.ppDance.rate : 1));
export const allyDmg = (s: RunState, mul: number) => s.player.stats.damage * mul * (hasPerk(s.player, "ppDance") ? K.ppDance.mul : 1);

/** 때려서 처치하면 바느질 회복 */
export function friendHit(s: RunState, e: EnemyState, dmg: number, from: PuppetBody): void {
  const d = normalize(e.x - from.x, e.y - from.y) ?? [0, 0];
  damageEnemyLite(s, e, dmg, d[0], d[1]);
  if (e.hp <= 0 && hasPerk(s.player, "ppStitch")) healPlayer(s, K.ppStitch.kill);
}

function allyTick(s: RunState, a: PuppetAlly): boolean {
  const p = s.player;
  a.prevX = a.x;
  a.prevY = a.y;
  if (a.cd > 0) a.cd--;
  if (a.swing > 0) a.swing--;
  const speed = Math.max(H.minSpeed, ENEMIES[a.kind].speed * H.allySpeed);
  const e = foeNear(s, a.x, a.y, H.allySight);
  if (e) {
    const reach = a.r + e.r + 3;
    if ((e.x - a.x) ** 2 + (e.y - a.y) ** 2 > reach * reach) bodyStep(s, a, e.x, e.y, speed);
    else if (a.cd <= 0) {
      a.cd = allyRate(s, H.allyRate);
      a.swing = 10;
      a.face = e.x < a.x ? -1 : 1;
      friendHit(s, e, allyDmg(s, H.allyMul), a);
    }
  } else if ((p.x - a.x) ** 2 + (p.y - a.y) ** 2 > H.allyFollow ** 2) bodyStep(s, a, p.x, p.y, speed);
  if (!bodyHurt(s, a)) return true;
  // 마지막 인사: 쓰러진 자리에서 터짐
  if (hasPerk(p, "ppBow")) srcRun(s, "ppBow", () => { ppArea(s, a.x, a.y, K.ppBow.r, p.stats.damage * K.ppBow.mul, "ppCorpsePop", 1, { push: 8 }); });
  else addEffect(s, { kind: "ppCrown", x: a.x, y: a.y, dirX: 0, dirY: 0, size: a.r, style: 1, maxTicks: 30 });
  return false;
}

/** 틱마다: 왕관 쓴 아군 */
export function alliesTick(s: RunState, moved: boolean): void {
  const p = s.player;
  if (!p.ppAllies?.length) return;
  if (moved) p.ppAllies.forEach(srcCb((a, i) => bringNear(s, a, i)));
  p.ppAllies = p.ppAllies.filter(srcCb((a) => allyTick(s, a)));
}
