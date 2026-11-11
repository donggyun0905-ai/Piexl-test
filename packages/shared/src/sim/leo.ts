// 레오(아스칼론, 영물): 뇌전의 사자. 발톱으로 앞을 할퀴고(세 번째마다 번개 물기) 맞힌 적에 뇌인(번개 표식)을 새김
// 맞힐 때마다 전하가 차고, 가득하면 사자후: 방 안 모든 적에게 낙뢰(뇌인 겹마다 더 아픔) + 기절
// 머리 가운데 보석이 몇 초마다 가장 먼 적에게 낙뢰 (방 전체 장악). 수치는 weaponsLeo.LEO, 아이템은 itemsLeo·sim/leoPerks
import { srcRun } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { LEO_PERKS as K } from "../itemsLeo";
import { LEO as L } from "../weaponsLeo";
import { leoDash, leoMane, leoStorm } from "./leoPerks";
import { alive, inCircle, inCone, strike, stun } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize } from "./util";

export const isLeo = (p: PlayerState) => p.characterId === "leo";

/** 뇌인 최대 겹 · 사자후에 필요한 전하 */
const markMax = (p: PlayerState) => (hasPerk(p, "leKing") ? K.leKing.marks : L.markMax);
export const voltNeed = (p: PlayerState) => L.voltMax * (hasPerk(p, "leKing") ? K.leKing.volt : 1);
/** 화면용: 지금 전하 0~1 */
export const leoVolt = (p: PlayerState) => Math.min(1, (p.leVolt ?? 0) / voltNeed(p));

/** 지금 공격력 (사자의 긍지: 둘레 적 하나마다 +) */
export function leoPower(s: RunState): number {
  const p = s.player;
  if (!hasPerk(p, "lePride")) return p.stats.damage;
  const n = alive(s).filter((e) => dist2(e, p) <= K.lePride.r ** 2).length;
  return p.stats.damage * (1 + Math.min(K.lePride.max, n * K.lePride.per));
}

/** 뇌인 한 겹 새김 */
export function addMark(p: PlayerState, e: EnemyState): void {
  e.leMark = Math.min(markMax(p), (e.leMark ?? 0) + 1);
  e.leMarkT = L.markTicks;
}

/** 전하 + (가득하면 사자후) */
export function charge(s: RunState, n: number): void {
  const p = s.player;
  p.leVolt = (p.leVolt ?? 0) + n;
  if (p.leVolt >= voltNeed(p)) roar(s);
}

/** 하늘에서 적 하나에게 낙뢰 (tint: 화면 색 이름) */
export function skyBolt(s: RunState, e: EnemyState, dmg: number, tint: string, mark = true): void {
  strike(s, e, dmg, 0, "shock");
  if (mark) addMark(s.player, e);
  addEffect(s, { kind: "leBolt", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 10, maxTicks: 22, tint });
}

/** 사자후: 방 안 모든 적에게 낙뢰 (뇌인을 모두 터뜨림) · 기절 · (우레 포효) 적 탄 지움 */
function roar(s: RunState): void {
  const p = s.player;
  p.leVolt = 0;
  p.leRoars = (p.leRoars ?? 0) + 1;
  const big = hasPerk(p, "leRoar");
  const dmg = leoPower(s);
  for (const e of alive(s)) {
    const m = e.leMark ?? 0;
    e.leMark = 0;
    skyBolt(s, e, dmg * (L.roarMul + L.roarPerMark * m), "roar", false);
    stun(e, L.roarStun * (big ? K.leRoar.stun : 1));
  }
  if (big) s.projectiles = s.projectiles.filter((pr) => pr.fromPlayer);
  addEffect(s, { kind: "leRoar", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: 150, maxTicks: 36, width: big ? 1 : 0 });
}

/** 발톱이 맞힌 적에서 가까운 적들에게 번개가 튐 (연쇄 뇌전) */
function chain(s: RunState, from: EnemyState, dmg: number): void {
  const others = alive(s)
    .filter((e) => e !== from && dist2(e, from) <= K.leChain.reach ** 2)
    .sort((a, b) => dist2(a, from) - dist2(b, from) || a.id - b.id)
    .slice(0, K.leChain.n);
  let at: EnemyState = from;
  for (const e of others) {
    strike(s, e, dmg * K.leChain.mul, 0, "shock");
    addEffect(s, { kind: "leChain", x: at.x, y: at.y, dirX: 0, dirY: 0, size: 3, toX: e.x, toY: e.y, maxTicks: 14 });
    at = e;
  }
}

/** 한 번 공격: 발톱(번갈아) · n번째마다 번개 물기 */
function swipe(s: RunState): void {
  const p = s.player;
  // 가까운 적 쪽을 봄
  const near = alive(s)
    .filter((e) => dist2(e, p) <= (p.stats.range + 24 + e.r) ** 2)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)[0];
  const d = near && normalize(near.x - p.x, near.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
  p.leHits = (p.leHits ?? 0) + 1;
  const fang = hasPerk(p, "leFang");
  const every = fang ? K.leFang.every : L.biteEvery;
  const dmg = leoPower(s);
  let hits = 0;
  if (p.leHits % every === 0) {
    const bx = p.x + p.faceX * L.biteAhead;
    const by = p.y + p.faceY * L.biteAhead;
    for (const e of inCircle(s, bx, by, L.biteR)) {
      strike(s, e, dmg * (L.biteMul + (fang ? K.leFang.mul : 0)) * (1 + L.markMul * (e.leMark ?? 0)), L.push, "shock");
      stun(e, L.biteStun);
      addMark(p, e);
      hits++;
    }
    addEffect(s, { kind: "leBite", x: bx, y: by, dirX: p.faceX, dirY: p.faceY, size: L.biteR, maxTicks: 18 });
  } else {
    for (const e of inCone(s, p.stats.range, L.arcCos)) {
      strike(s, e, dmg * (1 + L.markMul * (e.leMark ?? 0)));
      addMark(p, e);
      if (hasPerk(p, "leChain")) srcRun(s, "leChain", () => chain(s, e, dmg));
      hits++;
    }
    addEffect(s, { kind: "leClaw", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: p.stats.range, maxTicks: 12, width: p.leHits % 2 });
  }
  if (hits > 0) charge(s, L.voltHit + (hits - 1) * 2);
}

/** 보석 낙뢰: 몇 초마다 가장 먼 적(들)에게 (천뢰 보석: 더 자주, 두 갈래) */
function gem(s: RunState): void {
  const p = s.player;
  const sky = hasPerk(p, "leSky");
  const gap = Math.round(L.gemEvery * (sky ? K.leSky.gap : 1));
  p.leGem = (p.leGem ?? gap) - 1;
  if (p.leGem > 0) return;
  const far = alive(s).sort((a, b) => dist2(b, p) - dist2(a, p) || a.id - b.id).slice(0, sky ? K.leSky.n : 1);
  if (far.length === 0) {
    p.leGem = 1;
    return;
  }
  p.leGem = gap;
  for (const e of far) skyBolt(s, e, leoPower(s) * L.gemMul, "gem");
  addEffect(s, { kind: "leGem", x: p.x, y: p.y - 12, dirX: 0, dirY: 0, size: 10, maxTicks: 16 });
}

/** 틱마다 (뇌전 발톱을 들었을 때 player에서) */
export function leoTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  leoDash(s);
  leoMane(s);
  leoStorm(s);
  gem(s);
  if (p.leArmorCd) p.leArmorCd--;
  for (const e of s.enemies) if (e.leMarkT && --e.leMarkT <= 0) e.leMark = 0;
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  swipe(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetLeo(p: PlayerState): void {
  for (const k of ["leHits", "leVolt", "leGem", "leStorm", "leMane", "leDashing", "leArmorCd", "leRoars"] as const) delete p[k];
}
