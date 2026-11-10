// 인시전(새벽의 성흔, 쌍도끼의 도살자 · 광전사): 누르고 있으면 쌍도끼 네 박자
// 1 오른 도끼 베기 → 2 왼 도끼 베기 (앞 부채꼴) → 3 쌍도끼 교차 베기 (X자 · 날아가는 초승달) → 4 회오리 베기 (몸 둘레 · 피의 소용돌이)
// 맞힐수록 도륙 콤보 (단계마다 공격 속도·피해) · 콤보가 쌓이면 다음 공격이 도살 도약 (sim/incisionLeap) · 대시는 돌진 연참 (지나가는 적을 두 번 벰)
// 성흔이 가득 차면 광란 각성: 공격 속도·피해 · 콤보 두 배 · 안 끊김 (sim/incisionKit) · 수치 weaponsIncision.INCISION · 아이템 itemsIncision
import { TICK_RATE } from "../constants";
import { INCISION_PERKS as K } from "../itemsIncision";
import { INCISION as I } from "../weaponsIncision";
import { addCombo, addWave, addZone, comboSpeed, comboTick, icStrike, swingReach, vortexTick, wavesTick, whirlR, zonesTick } from "./incisionKit";
import { leapTick, startLeap } from "./incisionLeap";
import { rot } from "./orbit";
import { inCircle, inCone, roomKey } from "./s2Kit";
import { isAwake, stigmaTick } from "./stigma";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 네 박자 피해 배율 (무거운 도끼날) */
const beatMul = (s: RunState, mul: number) => mul * (hasPerk(s.player, "icHeavy") ? K.icHeavy.mul : 1);

/** 1·2타: 오른 도끼 / 왼 도끼로 앞 부채꼴 베기 (left = 왼 도끼, 그림을 뒤집음) */
function slash(s: RunState, left: boolean): number {
  const p = s.player;
  const r = I.slashR * swingReach(p);
  const hit = inCone(s, r, I.slashCos);
  for (const e of hit) icStrike(s, e, beatMul(s, I.slashMul), I.slashPush);
  addEffect(s, { kind: "icSlashFx", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 14, follow: true, ...(left ? { width: 1 } : {}) });
  return hit.length;
}

/** 3타: 쌍도끼 교차 베기 (X자, 앞 좁은 부채꼴 · 날아가는 초승달 둘) */
function cross(s: RunState): number {
  const p = s.player;
  const r = I.crossR * swingReach(p);
  const hit = inCone(s, r, I.crossCos);
  for (const e of hit) icStrike(s, e, beatMul(s, I.crossMul), I.crossPush);
  addEffect(s, { kind: "icCrossFx", x: p.x + p.faceX * r * 0.5, y: p.y - 4 + p.faceY * r * 0.5, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 18 });
  if (hasPerk(p, "icThrow")) {
    for (const a of [-K.icThrow.spread, K.icThrow.spread]) {
      const [c, sn] = rot(a);
      addWave(p, p.faceX * c - p.faceY * sn, p.faceX * sn + p.faceY * c);
    }
  }
  return hit.length;
}

/** 4타: 회오리 베기 (몸 둘레 한 바퀴 · 피의 소용돌이) */
function whirl(s: RunState): number {
  const p = s.player;
  const r = whirlR(p);
  const hit = inCircle(s, p.x, p.y, r);
  for (const e of hit) icStrike(s, e, beatMul(s, I.whirlMul), I.whirlPush);
  addEffect(s, { kind: "icWhirlFx", tint: "#ff2a2a", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 22, follow: true });
  if (hasPerk(p, "icVortex")) {
    p.icVortex = K.icVortex.ticks;
    p.icVortexT = K.icVortex.every;
  }
  return hit.length;
}

/** 돌진 연참 (대시): 대시 동안 몸 둘레 적을 간격마다 벰 (적마다 두 번) · 끝나면 피의 길 */
function dashTick(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  const pow = hasPerk(p, "icRushPow");
  if (dashing && !p.icDash) {
    p.icDashX = p.x;
    p.icDashY = p.y;
    p.icDashHit = {};
    p.icDashT = 0;
    addEffect(s, { kind: "icRushFx", x: p.x, y: p.y, dirX: p.dashDirX, dirY: p.dashDirY, size: 24, maxTicks: 20, follow: true });
  }
  if (dashing && --p.icDashT! <= 0) {
    p.icDashT = I.dashGap;
    const hits = pow ? K.icRushPow.hits : I.dashHits;
    const done = (p.icDashHit ??= {});
    let n = 0;
    for (const e of inCircle(s, p.x, p.y, I.dashR * swingReach(p))) {
      if ((done[e.id] ?? 0) >= hits) continue;
      done[e.id] = (done[e.id] ?? 0) + 1;
      icStrike(s, e, I.dashMul * (pow ? K.icRushPow.mul : 1), I.dashPush);
      n++;
    }
    addCombo(s, n);
  } else if (!dashing && p.icDash && hasPerk(p, "icTrail")) {
    const t = K.icTrail;
    addZone(p, { k: 0, x0: p.icDashX ?? p.x, y0: p.icDashY ?? p.y, x: p.x, y: p.y, t: t.delay, mul: t.mul, r: t.w });
  }
  p.icDash = dashing;
}

/** 틱마다 (도살자의 쌍도끼를 들었을 때 player에서) */
export function incisionTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.icRoom !== roomKey(s)) {
    for (const k of ["icWaves", "icZones", "icVortex", "icVortexT", "icLeap"] as const) delete p[k];
    p.icRoom = roomKey(s);
  }
  stigmaTick(p);
  comboTick(p);
  wavesTick(s);
  zonesTick(s);
  vortexTick(s);
  dashTick(s);
  if (leapTick(s)) return;
  // 공격 대기가 끝난 뒤부터 잼 (한참 안 치면 다시 1타부터)
  p.icGap = (p.icGap ?? 0) + (p.attackCooldown <= 0 ? 1 : 0);
  if (p.icGap > I.comboGap) p.icStep = 0;
  if (!want || p.attackCooldown > 0 || p.s2Rush || p.dashTicks > 0) return;
  const fast = speed * comboSpeed(p) * (isAwake(p) ? I.awakeSpeed : 1);
  const time = hasPerk(p, "icSwift") ? K.icSwift.time : 1;
  p.icGap = 0;
  p.attackCount++;
  if (p.icLeapReady) {
    startLeap(s);
    p.icLast = { k: 4, t: s.tick };
    p.attackCooldown = I.leapAir + Math.round((TICK_RATE / fast) * 0.5 * time);
    return;
  }
  const k = p.icStep ?? 0;
  const n = k === 3 ? whirl(s) : k === 2 ? cross(s) : slash(s, k === 1);
  addCombo(s, n);
  p.icLast = { k, t: s.tick };
  p.icStep = (k + 1) % 4;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / fast) * (I.stepTime[k] ?? 1) * time));
}

/** 연습장 등에서 다시 시작할 때 */
export function resetIncision(p: RunState["player"]): void {
  for (const k of ["sgGauge", "sgAwake", "sgAwakeMax", "icStep", "icGap", "icLast", "icCombo", "icIdle", "icNextLeap", "icLeapReady", "icHp", "icLeap", "icWaves", "icZones", "icVortex", "icVortexT", "icDash", "icDashX", "icDashY", "icDashHit", "icDashT", "icRoom"] as const) delete p[k];
}

export { isIncision, comboTier } from "./incisionKit";
