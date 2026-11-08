// 블루 플레임(새벽의 성흔, 청염의 맹인): 누르고 있으면 푸른 불꽃 활 · 조준한 쪽 가장 가까운 적이 몸 둘레 세 겹 범위 중 어디냐에 따라
// 안쪽 불꽃 감옥(가둠) · 가운데 불꽃 기둥 · 바깥 화살 (범위에 적이 없으면 조준한 쪽으로 화살) · 모든 공격이 청염 상태이상 (sim/blueFlameKit)
// 성흔이 가득 차면 열화상 각성: 몸이 사라지고(무적·고정) 누른 곳에 거대한 화살 폭격 · 푸른 날개(전용 아이템): 확률로 날개가 돋고 머리 위 활들이 앞쪽 바닥에 화살비
// 수치 weaponsBlueFlame · 아이템 itemsBlueFlame
import { TICK_RATE } from "../constants";
import { BLUE_FLAME_PERKS as K } from "../itemsBlueFlame";
import { createRng, deriveSeed } from "../rng";
import { BLUE_FLAME as F } from "../weaponsBlueFlame";
import { addStrike, bzRings, flameTick, strikesTick } from "./blueFlameKit";
import { alive, roomKey } from "./s2Kit";
import { isAwake, stigmaTick } from "./stigma";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";

/** 조준한 쪽 부채꼴 안 적 (가까운 순) */
function aimed(s: RunState, reach: number): { e: EnemyState; d: number }[] {
  const p = s.player;
  return alive(s)
    .map((e) => ({ e, d: Math.hypot(e.x - p.x, e.y - p.y) }))
    .filter(({ e, d }) => d <= reach + e.r && (d < e.r + p.r || ((e.x - p.x) * p.faceX + (e.y - p.y) * p.faceY) / d >= F.aimCos))
    .sort((a, b) => a.d - b.d || a.e.id - b.e.id);
}

/** 범위 단계: 0 안쪽 · 1 가운데 · 2 바깥 */
const zoneOf = (d: number, r: [number, number, number]) => (d < r[0] ? 0 : d < r[1] ? 1 : 2);

/** 화살 한 발 (노린 적 · 없으면 조준한 쪽 바깥 끝) */
function arrow(s: RunState, e: EnemyState | undefined, reach: number): void {
  const p = s.player;
  const [x, y] = e ? [e.x, e.y] : [p.x + p.faceX * reach, p.y + p.faceY * reach];
  const t = Math.max(4, Math.ceil(Math.hypot(x - p.x, y - p.y) / F.arrowSpeed));
  const mul = F.arrowMul * (hasPerk(p, "bzFletch") ? K.bzFletch.mul : 1);
  addStrike(p, { x0: p.x, y0: p.y - 6, x, y, t, k: 2, mul, r: 6, ...(e ? { tg: e.id } : {}) });
}

/** 범위마다 공격 하나 (감옥·기둥은 그 적 자리에 그림이 먼저 뜨고 조금 뒤 피해) */
function zoneHit(s: RunState, e: EnemyState, zone: number, reach: number): void {
  const p = s.player;
  const rm = reachOf(p);
  if (zone === 2) return arrow(s, e, reach);
  if (zone === 0) {
    const r = F.prisonR * rm * (hasPerk(p, "bzImplode") ? K.bzImplode.r : 1);
    addStrike(p, { x0: p.x, y0: p.y, x: e.x, y: e.y, t: F.prisonDelay, k: 0, mul: F.prisonMul * (hasPerk(p, "bzPrison") ? K.bzPrison.mul : 1), r });
    addEffect(s, { kind: "bzPrisonFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: 34 });
    return;
  }
  const r = F.pillarR * rm * (hasPerk(p, "bzBlaze") ? K.bzBlaze.r : 1);
  addStrike(p, { x0: p.x, y0: p.y, x: e.x, y: e.y, t: F.pillarDelay, k: 1, mul: F.pillarMul * (hasPerk(p, "bzPillar") ? K.bzPillar.mul : 1), r });
  addEffect(s, { kind: "bzPillarFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: 32 });
}

/** 기본 공격: 불꽃 활을 당겨 범위별 공격 · 갈래 화살·쌍기둥은 같은 범위 다른 적에게 하나 더 · 푸른 날개 확률 */
function fire(s: RunState): void {
  const p = s.player;
  const rings = bzRings(p);
  const list = aimed(s, rings[2]);
  const first = list[0];
  const zone = first ? zoneOf(first.d - first.e.r * 0.5, rings) : 2;
  if (first) zoneHit(s, first.e, zone, rings[2]);
  else arrow(s, undefined, rings[2]);
  const more = zone === 2 && hasPerk(p, "bzSplit") ? K.bzSplit.add : zone === 1 && hasPerk(p, "bzTwin") ? K.bzTwin.add : 0;
  if (first && more > 0) {
    const others = alive(s).filter((e) => e !== first.e && zoneOf(Math.hypot(e.x - p.x, e.y - p.y) - e.r * 0.5, rings) === zone && Math.hypot(e.x - p.x, e.y - p.y) <= rings[2] + e.r);
    for (const e of others.slice(0, more)) zoneHit(s, e, zone, rings[2]);
  }
  const [dx, dy] = first ? [first.e.x - p.x, first.e.y - p.y] : [p.faceX, p.faceY];
  const n = Math.hypot(dx, dy) || 1;
  addEffect(s, { kind: "bzBowFx", x: p.x, y: p.y, dirX: dx / n, dirY: dy / n, size: 16, maxTicks: 20, follow: true });
  if (!p.bzWing && hasPerk(p, "bzWing") && createRng(deriveSeed(s.seed, "bzWing", s.tick)).nextFloat() < K.bzWing.chance) {
    p.bzWing = F.wingTicks;
    p.bzRain = F.rainCount;
    addEffect(s, { kind: "bzWingFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: 20, maxTicks: F.wingTicks, follow: true });
  }
}

/** 푸른 날개: 머리 위 활들이 생긴 뒤 하나씩 앞쪽 바닥으로 화살비 (머리 위에서 비스듬히 떨어짐) */
function wingTick(s: RunState): void {
  const p = s.player;
  if (!p.bzWing) return;
  const gone = F.wingTicks - p.bzWing;
  if ((p.bzRain ?? 0) > 0 && gone >= F.rainWait && (gone - F.rainWait) % F.rainGap === 0) {
    const i = F.rainCount - p.bzRain!;
    const rng = createRng(deriveSeed(s.seed, "bzRain", s.tick, i));
    const rm = reachOf(p);
    const fwd = (F.rainNear + (F.rainFar - F.rainNear) * rng.nextFloat()) * rm;
    const side = (rng.nextFloat() * 2 - 1) * F.rainSpread * rm;
    const x = p.x + p.faceX * fwd - p.faceY * side;
    const y = p.y + p.faceY * fwd + p.faceX * side;
    const ox = (i - (F.rainCount - 1) / 2) * 7;
    addStrike(p, { x0: p.x - p.faceY * ox, y0: p.y - 30 + p.faceX * ox * 0.3, x, y, t: F.rainFly, k: 3, mul: F.rainMul, r: F.rainR * rm });
    p.bzRain!--;
  }
  if (--p.bzWing > 0) return;
  delete p.bzWing;
  delete p.bzRain;
}

/** 열화상 각성: 몸이 사라지고 고정·무적 · 누른 곳(자동 조준이면 가까운 적)에 거대한 화살 폭격 · 끝나면 다시 보이고 잠깐 무적 */
function ultTick(s: RunState, want: boolean, speed: number): boolean {
  const p = s.player;
  if (!p.bzUlt) return false;
  if (!isAwake(p)) {
    delete p.bzUlt;
    p.rootTicks = 0;
    p.invulnTicks = Math.max(p.invulnTicks, F.ultInv);
    return false;
  }
  p.rootTicks = 1;
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  if (!want || p.attackCooldown > 0) return true;
  const near = alive(s).sort((a, b) => (a.x - p.x) ** 2 + (a.y - p.y) ** 2 - ((b.x - p.x) ** 2 + (b.y - p.y) ** 2) || a.id - b.id)[0];
  const [x, y] = p.aimDist !== undefined ? [p.x + p.faceX * p.aimDist, p.y + p.faceY * p.aimDist] : near ? [near.x, near.y] : [p.x + p.faceX * 80, p.y + p.faceY * 80];
  const great = hasPerk(p, "bzGreat");
  addStrike(p, { x0: x, y0: p.y + 160, x, y, t: F.ultFly, k: 4, mul: F.ultMul * (great ? K.bzGreat.mul : 1), r: F.ultR * reachOf(p) * (great ? K.bzGreat.r : 1) });
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * F.ultTime));
  p.attackCount++;
  return true;
}

/** 틱마다 (청염의 활을 들었을 때 player에서) */
export function blueFlameTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.bzRoom !== roomKey(s)) {
    for (const k of ["bzStrikes", "bzWing", "bzRain"] as const) delete p[k];
    p.bzRoom = roomKey(s);
  }
  stigmaTick(p);
  flameTick(s);
  strikesTick(s);
  wingTick(s);
  if (ultTick(s, want, speed)) return;
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  fire(s);
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * F.shotTime * (hasPerk(p, "bzDraw") ? K.bzDraw.time : 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetBlueFlame(p: RunState["player"]): void {
  for (const k of ["sgGauge", "sgAwake", "sgAwakeMax", "bzStrikes", "bzWing", "bzRain", "bzUlt", "bzRoom", "rootTicks"] as const) delete p[k];
}

export { bzRings, isBlueFlame } from "./blueFlameKit";
