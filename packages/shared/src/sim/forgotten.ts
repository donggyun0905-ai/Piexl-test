// 잊혀진 자(아스칼론, 시즌 2): 옛 신의 마지막 후손, 반신. 빛으로 싸움 (무기 10: 빛 탄·빛줄기·터짐·떨어지는 빛 십자가·빛 베기)
// 적을 맞힐 때마다 빛의 고리가 차고(맞으면 깎임), 가득 차면 10초 동안 신족: 공격 속도 2배 + 둘레 적을 빛기둥이 저절로 침 (공격력 30%)
// 수치는 weaponsForgotten.FORGOTTEN, 아이템은 itemsForgotten
import { srcRun, srcFn, srcEach } from "./dmgSrc";
import { PW_PASSIVE } from "../paewangPassive";
import { TICK_RATE } from "../constants";
import { FORGOTTEN_PERKS as K } from "../itemsForgotten";
import { createRng, deriveSeed } from "../rng";
import { FORGOTTEN as F, type LightStyle } from "../weaponsForgotten";
import { nearest } from "./brawlMoves";
import { dotDamage, healPlayer } from "./combat";
import { rot } from "./orbit";
import { alive, inCircle, inCone, inLine, shoot, strike as strike_ } from "./s2Kit";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, hasPerk, weaponOf } from "./util";
const strike = srcFn("forgotten", () => strike_);

const styleOf = (p: PlayerState): LightStyle => weaponOf(p).light ?? { pattern: "bolt", n: 2, spread: 0.12 };
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();
const isForgotten = (p: PlayerState) => p.characterId === "forgotten";

/** 빛의 고리를 채우는 데 드는 적중 수 (적을 맞힌 공격 한 번 = 1) */
export const ringNeed = (p: PlayerState) => (hasPerk(p, "fgMemory") ? K.fgMemory.kills : F.ringKills);
/** 신족 전체 틱 */
export const godTicks = (p: PlayerState) => (hasPerk(p, "fgEcho") ? K.fgEcho.ticks : F.godTicks);
/** 화면용: 고리 0~1 · 신족 남은 0~1 */
export const forgottenRing = (p: PlayerState) => ((p.fgGod ?? 0) > 0 ? (p.fgGod ?? 0) / godTicks(p) : Math.min(1, (p.fgRing ?? 0) / ringNeed(p)));

/** 신의 가호: 신족인 동안 받는 피해 (classTaken) */
export const forgottenTaken = (p: PlayerState) => (isForgotten(p) && (p.fgGod ?? 0) > 0 && hasPerk(p, "fgBless") ? K.fgBless.taken : 1);

/** 빛 공격이 맞았을 때: 광휘 */
function lit(s: RunState, e: EnemyState, dmg: number): void {
  if (!hasPerk(s.player, "fgShine") || e.hp <= 0) return;
  e.fgRadDmg = (e.fgRad ?? 0) > 0 ? Math.max(e.fgRadDmg ?? 0, dmg * K.fgShine.mul) : dmg * K.fgShine.mul;
  e.fgRad = K.fgShine.ticks;
}

/** 적을 맞힌 공격: 빛의 고리 +1 (한 공격은 한 번만, 신족인 동안은 안 셈) */
function fillRing(s: RunState): void {
  const p = s.player;
  if (!isForgotten(p) || (p.fgGod ?? 0) > 0 || p.fgCounted === p.attackCount) return;
  p.fgCounted = p.attackCount;
  p.fgRing = (p.fgRing ?? 0) + 1;
  if (p.fgRing >= ringNeed(p)) awaken(s);
}

/** 적에게 맞으면 빛의 고리가 깎임 (combat afterHurt) */
export function forgottenHurt(s: RunState): void {
  const p = s.player;
  if (isForgotten(p) && (p.fgGod ?? 0) <= 0) p.fgRing = Math.max(0, (p.fgRing ?? 0) - F.ringLoss);
}

function hit(s: RunState, e: EnemyState, dmg: number, slow?: number): void {
  strike(s, e, dmg);
  fillRing(s);
  if (slow) e.slowTicks = Math.max(e.slowTicks ?? 0, slow);
  lit(s, e, dmg);
}

/** 빛 탄이 맞았을 때 (s2Hits) */
export function lightBoltHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  if (!isForgotten(s.player)) return;
  lit(s, e, pr.damage);
  fillRing(s);
}

/** 빛 십자가 하나를 (x, y)에 예약 */
function dropCross(s: RunState, x: number, y: number, r: number, dmg: number, delay: number, slow?: number): void {
  const p = s.player;
  (p.fgFalls ??= []).push({ x, y, t: delay, r, dmg, slow });
  addEffect(s, { kind: "fgCross", x, y, dirX: 0, dirY: 0, size: r, maxTicks: delay });
}

/** 십자가가 떨어질 자리: 가까운 적부터 (모자라면 처음 적 둘레에 흩뿌림, 적이 없으면 앞쪽) */
function fallSpots(s: RunState, st: LightStyle): { x: number; y: number }[] {
  const p = s.player;
  const reach = (p.stats.range * 1.3) ** 2;
  const foes = alive(s).filter((e) => dist2(e, p) <= reach).sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
  const base = foes[0] ?? { x: p.x + p.faceX * p.stats.range * 0.6, y: p.y + p.faceY * p.stats.range * 0.6 };
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < st.n; i++) {
    const e = foes[i] ?? base;
    const sc = st.scatter ?? (foes[i] ? 0 : 20);
    out.push({ x: e.x + (roll(s, "fgx", i) - 0.5) * 2 * sc, y: e.y + (roll(s, "fgy", i) - 0.5) * 2 * sc });
  }
  return out;
}

/** 한 번 공격 */
function cast(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const dmg = p.stats.damage;
  switch (st.pattern) {
    case "bolt":
      for (let i = 0; i < st.n; i++) shoot(s, (i - (st.n - 1) / 2) * (st.spread ?? 0), { damage: dmg, spirit: "fgBolt", r: F.boltR, range: p.stats.range, slow: st.slow });
      break;
    case "beam":
      for (let i = 0; i < st.n; i++) {
        const [c, sn] = rot((i - (st.n - 1) / 2) * (st.spread ?? 0));
        const dx = p.faceX * c - p.faceY * sn;
        const dy = p.faceX * sn + p.faceY * c;
        const len = st.len ?? p.stats.range;
        for (const e of inLine(s, len, st.width ?? 5, dx, dy)) hit(s, e, dmg, st.slow);
        addEffect(s, { kind: "fgBeam", x: p.x, y: p.y - 3, dirX: dx, dirY: dy, size: st.width ?? 5, toX: p.x + dx * len, toY: p.y - 3 + dy * len, maxTicks: 14 });
      }
      break;
    case "nova":
      for (const e of inCircle(s, p.x, p.y, st.r ?? 40)) hit(s, e, dmg, st.slow);
      addEffect(s, { kind: "fgNova", x: p.x, y: p.y, dirX: 0, dirY: 0, size: st.r ?? 40, maxTicks: 16 });
      break;
    case "fall":
      for (const at of fallSpots(s, st)) dropCross(s, at.x, at.y, st.r ?? 20, dmg, st.delay ?? 20, st.slow);
      break;
    case "slash":
      for (const e of inCone(s, st.r ?? 50, F.slashCos)) hit(s, e, dmg, st.slow);
      addEffect(s, { kind: "fgSlash", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: st.r ?? 50, maxTicks: 12 });
      break;
  }
  if (st.ring) for (let i = 0; i < st.ring; i++) shoot(s, (i / st.ring) * Math.PI * 2, { damage: dmg * 0.6, spirit: "fgBolt", r: F.boltR, range: p.stats.range });
  // 성흔: 몇 번째 공격마다 가까운 적 위로 십자가
  p.fgCount = (p.fgCount ?? 0) + 1;
  if (hasPerk(p, "fgCross") && p.fgCount % K.fgCross.every === 0) srcRun(s, "fgCross", () => {
    const e = nearest(s, p.stats.range * 1.3);
    if (e) dropCross(s, e.x, e.y, K.fgCross.r, dmg * K.fgCross.mul, K.fgCross.delay);
  });
}

/** 신족이 됨 */
function awaken(s: RunState): void {
  const p = s.player;
  p.fgRing = 0;
  p.fgGod = s.pvp ? PW_PASSIVE.forgottenGod : godTicks(p);
  if (hasPerk(p, "fgHeal")) healPlayer(s, p.stats.maxHp * K.fgHeal.hp);
  addEffect(s, { kind: "fgAwaken", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 60, maxTicks: 40 });
}

/** 신족: 둘레 적을 빛기둥이 침 */
function pillars(s: RunState): void {
  const p = s.player;
  const n = F.pillarN + (hasPerk(p, "fgMany") ? K.fgMany.n : 0);
  const mul = hasPerk(p, "fgPillar") ? K.fgPillar.mul : F.pillarMul;
  const foes = inCircle(s, p.x, p.y, F.pillarReach).sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id).slice(0, n);
  for (const e of foes) {
    hit(s, e, p.stats.damage * mul);
    addEffect(s, { kind: "fgPillar", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 8, maxTicks: 14 });
  }
}

/** 틱마다: 신족 · 떨어지는 십자가 · 광휘 */
function update(s: RunState): void {
  const p = s.player;
  if ((p.fgGod ?? 0) > 0) {
    if ((p.fgGod ?? 0) % F.pillarGap === 0) pillars(s);
    p.fgGod = (p.fgGod ?? 0) - 1;
    if (p.fgGod <= 0 && hasPerk(p, "fgAfter")) srcRun(s, "fgAfter", () => {
      for (const e of inCircle(s, p.x, p.y, K.fgAfter.r)) hit(s, e, p.stats.damage * K.fgAfter.mul);
      addEffect(s, { kind: "fgNova", x: p.x, y: p.y, dirX: 0, dirY: 0, size: K.fgAfter.r, maxTicks: 24 });
    });
  }
  if (p.fgFalls?.length) {
    for (const f of srcEach(p.fgFalls)) {
      if (--f.t > 0) continue;
      for (const e of inCircle(s, f.x, f.y, f.r)) hit(s, e, f.dmg, f.slow);
      addEffect(s, { kind: "fgFlash", x: f.x, y: f.y, dirX: 0, dirY: 0, size: f.r, maxTicks: 14 });
    }
    p.fgFalls = p.fgFalls.filter((f) => f.t > 0);
  }
  for (const e of s.enemies) {
    if ((e.fgRad ?? 0) <= 0 || e.hp <= 0) continue;
    e.fgRad = (e.fgRad ?? 0) - 1;
    if (e.fgRad % TICK_RATE === 0) srcRun(s, "fgShine", () => dotDamage(s, e, "radiance", e.fgRadDmg ?? 0));
  }
}

/** 틱마다 (빛 무기를 들었을 때 player에서) */
export function forgottenTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  update(s);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  cast(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetForgotten(p: PlayerState): void {
  for (const k of ["fgRing", "fgSeen", "fgGod", "fgFalls", "fgCount", "fgCounted"] as const) delete p[k];
}
