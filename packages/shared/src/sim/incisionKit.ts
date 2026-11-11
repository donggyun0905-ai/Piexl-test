// 인시전 공용 도우미: 도륙 콤보 (단계 · 끊김 · 맞으면 잃음 · 도약 준비 · 도륙 폭발) · 맞힘(성흔·회복) · 광란 각성 · 학살
// 날아가는 초승달 · 피의 길·갈라진 땅 · 피의 소용돌이 (도약은 sim/incisionLeap)
import { srcRun } from "./dmgSrc";
import { INCISION_PERKS as K } from "../itemsIncision";
import { INCISION as I } from "../weaponsIncision";
import { STIGMA } from "../weaponsDawn";
import { healPlayer } from "./combat";
import type { IcZone } from "./icTypes";
import { alive, inCircle, onSegment, strike } from "./s2Kit";
import { addStigma, awaken, isAwake } from "./stigma";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";

export const isIncision = (p: PlayerState) => p.characterId === "incision";

/** 콤보 최대 단계 */
const tierMax = (p: PlayerState) => (hasPerk(p, "icRampage") ? K.icRampage.max : I.tierMax);
/** 지금 콤보 단계 (10마다 하나, 최대까지) */
export const comboTier = (p: PlayerState) => Math.min(tierMax(p), Math.floor((p.icCombo ?? 0) / I.comboStep));
/** 콤보 공격 속도 배율 */
export const comboSpeed = (p: PlayerState) => 1 + I.tierSpeed * comboTier(p);
/** 도약 간격 콤보 */
export const leapEvery = (p: PlayerState) => (hasPerk(p, "icLeapOften") ? K.icLeapOften.every : I.leapEvery);

/** 공격력 × mul (콤보 단계 · 각성) */
export const icDmg = (p: PlayerState, mul: number) => p.stats.damage * mul * (1 + I.tierDmg * comboTier(p)) * (isAwake(p) ? I.awakeDmg : 1);

/** 성흔 채움 → 가득 차면 광란 각성 (둘레 쌍도끼 강타 · 잠깐 무적) */
export function icGain(s: RunState, n: number): void {
  const p = s.player;
  if (n <= 0 || !addStigma(p, n * (hasPerk(p, "icSense") ? K.icSense.gain : 1))) return;
  awaken(p, STIGMA.awakeTicks + (hasPerk(p, "icEndless") ? K.icEndless.more : 0));
  const r = I.awakeR * reachOf(p);
  for (const e of inCircle(s, p.x, p.y, r)) strike(s, e, p.stats.damage * I.awakeMul, 12, "bleed");
  p.invulnTicks = Math.max(p.invulnTicks, I.awakeInv);
  addEffect(s, { kind: "icAwakeFx", tint: "#ff2a2a", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 40, follow: true });
}

/** 학살: 각성 중 처치한 적 자리에서 피가 터짐 (터진 피로 죽은 적은 다시 안 터짐) */
let carnage = false;
function onKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (carnage || !isAwake(p) || !hasPerk(p, "icCarnage")) return; return srcRun(s, "icCarnage", () => {
  carnage = true;
  const r = K.icCarnage.r * reachOf(p);
  for (const f of inCircle(s, e.x, e.y, r)) strike(s, f, icDmg(p, K.icCarnage.mul), 4, "bleed");
  addEffect(s, { kind: "icCarnageFx", tint: "#ff2a2a", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: 20 });
  carnage = false;
}); }

/** 인시전 공격 맞힘: 피해 · 처치면 성흔·학살 */
export function icStrike(s: RunState, e: EnemyState, mul: number, push = 0): void {
  strike(s, e, icDmg(s.player, mul), push);
  if (e.hp <= 0) {
    icGain(s, I.gainKill);
    onKill(s, e);
  }
}

/** 한 번 휘두른 뒤: 맞힌 적 수만큼 콤보 (한 번에 최대 swingMax, 각성 중 두 배) · 성흔 · 피의 연타 · 단계 오름 · 도륙 폭발 · 도약 준비 */
export function addCombo(s: RunState, n: number): void {
  const p = s.player;
  if (n <= 0) return;
  const before = p.icCombo ?? 0;
  const add = Math.min(I.swingMax, n) * (isAwake(p) ? I.awakeCombo : 1);
  p.icCombo = before + add;
  p.icIdle = 0;
  icGain(s, n * I.gainHit);
  if (hasPerk(p, "icDrink") && p.icCombo >= K.icDrink.min) healPlayer(s, p.stats.maxHp * Math.min(K.icDrink.cap, K.icDrink.heal * n));
  if (Math.floor(p.icCombo / I.comboStep) > Math.floor(before / I.comboStep) && comboTier(p) > 0) {
    addEffect(s, { kind: "icTierFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: comboTier(p), maxTicks: 24, follow: true });
  }
  if (hasPerk(p, "icBurst") && Math.floor(p.icCombo / K.icBurst.every) > Math.floor(before / K.icBurst.every)) srcRun(s, "icBurst", () => {
    const r = K.icBurst.r * reachOf(p);
    for (const e of inCircle(s, p.x, p.y, r)) icStrike(s, e, K.icBurst.mul, 6);
    addEffect(s, { kind: "icBurstFx", tint: "#ff2a2a", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 22, follow: true });
  });
  p.icNextLeap ??= leapEvery(p);
  if (p.icCombo >= p.icNextLeap) {
    p.icLeapReady = true;
    p.icNextLeap = (Math.floor(p.icCombo / leapEvery(p)) + 1) * leapEvery(p);
  }
}

/** 콤보 한 틱: 한참 못 맞히면 끊김 (각성 중엔 안 끊김) · 맞으면 일부만 남음 */
export function comboTick(p: PlayerState): void {
  const hp = p.hp;
  if (p.icHp !== undefined && hp < p.icHp && (p.icCombo ?? 0) > 0) {
    p.icCombo = Math.floor(p.icCombo! * (hasPerk(p, "icIron") ? K.icIron.keep : I.hitKeep));
    p.icNextLeap = (Math.floor(p.icCombo / leapEvery(p)) + 1) * leapEvery(p);
  }
  p.icHp = hp;
  if (!p.icCombo || isAwake(p)) return;
  p.icIdle = (p.icIdle ?? 0) + 1;
  if (p.icIdle < I.comboHold * (hasPerk(p, "icKeep") ? K.icKeep.hold : 1)) return;
  for (const k of ["icCombo", "icIdle", "icNextLeap", "icLeapReady"] as const) delete p[k];
}

/** 날아가는 초승달 쏘기 */
export function addWave(p: PlayerState, dx: number, dy: number): void {
  const w = K.icThrow;
  (p.icWaves ??= []).push({ x: p.x + dx * 10, y: p.y - 4 + dy * 10, vx: dx * w.speed, vy: dy * w.speed, t: Math.round(w.ticks * reachOf(p)), hit: [] });
}

/** 날아가는 초승달 한 틱: 나아가며 닿은 적을 한 번씩 벰 (꿰뚫음) */
export function wavesTick(s: RunState): void {
  const p = s.player;
  if (!p.icWaves) return;
  const r = K.icThrow.r * reachOf(p);
  let n = 0;
  for (const w of p.icWaves) {
    w.x += w.vx;
    w.y += w.vy;
    w.t--;
    for (const e of inCircle(s, w.x, w.y, r)) {
      if (w.hit.includes(e.id)) continue;
      w.hit.push(e.id);
      icStrike(s, e, K.icThrow.mul, 2);
      n++;
    }
  }
  p.icWaves = p.icWaves.filter((w) => w.t > 0);
  if (p.icWaves.length === 0) delete p.icWaves;
  addCombo(s, n);
}

/** 피의 길·갈라진 땅 한 틱 */
export function zonesTick(s: RunState): void {
  const p = s.player;
  if (!p.icZones) return;
  let n = 0;
  for (const z of p.icZones) {
    z.t--;
    if (z.k === 0) {
      if (z.t > 0) continue;
      for (const e of onSegment(s, z.x0, z.y0, z.x, z.y, z.r)) {
        icStrike(s, e, z.mul, 4);
        n++;
      }
      addEffect(s, { kind: "icTrailFx", x: z.x0, y: z.y0, dirX: 0, dirY: 0, size: z.r, maxTicks: 18, toX: z.x, toY: z.y });
    } else if (--z.next! <= 0) {
      z.next = K.icQuake.every;
      for (const e of inCircle(s, z.x, z.y, z.r)) {
        icStrike(s, e, z.mul);
        n++;
      }
    }
  }
  p.icZones = p.icZones.filter((z) => z.t > 0);
  if (p.icZones.length === 0) delete p.icZones;
  addCombo(s, n);
}

/** 곧 터질 공격 하나 */
export const addZone = (p: PlayerState, z: IcZone) => (p.icZones ??= []).push(z);

/** 피의 소용돌이 한 틱: 남은 동안 몸 둘레를 간격마다 벰 */
export function vortexTick(s: RunState): void {
  const p = s.player;
  if (!p.icVortex) return;
  p.icVortex--;
  if (--p.icVortexT! <= 0) {
    p.icVortexT = K.icVortex.every;
    const hit = inCircle(s, p.x, p.y, whirlR(p));
    for (const e of hit) icStrike(s, e, K.icVortex.mul, 1);
    addCombo(s, hit.length);
  }
  if (p.icVortex <= 0) {
    delete p.icVortex;
    delete p.icVortexT;
  }
}

/** 박자 거리 배율 (사거리 증가 · 크게 휘두르기) */
export const swingReach = (p: PlayerState) => reachOf(p) * (hasPerk(p, "icWide") ? K.icWide.r : 1);
/** 회오리 반지름 */
export const whirlR = (p: PlayerState) => I.whirlR * swingReach(p);

/** 가장 가까운 적 (from에서 reach 안, skip 빼고) */
export function nearest(s: RunState, x: number, y: number, reach: number, skip = -1): EnemyState | undefined {
  return alive(s)
    .filter((e) => e.id !== skip && (e.x - x) ** 2 + (e.y - y) ** 2 <= reach * reach)
    .sort((a, b) => (a.x - x) ** 2 + (a.y - y) ** 2 - ((b.x - x) ** 2 + (b.y - y) ** 2) || a.id - b.id)[0];
}
