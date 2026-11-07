// 네일러 스킬 넷 (sim/nailer에서 부름): 1 못 던지기(3번 눌러 단계마다 빨라짐 → 대기) · 2 붉은 실(1번 바닥에 못·돌진·고정 → 2번 망치 원·실 따라 돌아감)
// 3 저주의 도화선(내 자리에 못 → 못이 박힌 모든 적에게 도화선 → 못 하나마다 공격력 33%를 한 덩어리로) · 4 심판의 못비(제자리에서 한 적에게 못 셋씩 10번)
import { NAILER_PERKS as K } from "../itemsNailer";
import { NAILER as N } from "../weaponsNailer";
import { addNails, nlAfter, nlCooldown, nlDmg, nlGain, throwNail } from "./nailerKit";
import { alive, inCircle, rushTick, startRush, strike, stun } from "./s2Kit";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

const RED = "#ff2a3a";

/** 가장 가까운 적 (reach 안) */
function nearest(s: RunState, reach: number): EnemyState | undefined {
  const p = s.player;
  let best: EnemyState | undefined;
  let bd = reach * reach;
  for (const e of alive(s)) {
    const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
    if (d <= bd) {
      bd = d;
      best = e;
    }
  }
  return best;
}

/** 1 못 던지기: 1번 가볍게 · 2번 더 빠르게 · 3번 더 빠른 못이 연달아 → 대기 */
function throwSkill(s: RunState): void {
  const p = s.player;
  if ((p.nlLock ?? 0) > 0 || (p.nlBurst ?? 0) > 0) return;
  const k = p.nlStage ?? 0;
  if (k === 0 && (p.nlCd![0] ?? 0) > 0) return;
  if (k < 2) {
    throwNail(p, p.x, p.y - 4, p.faceX, p.faceY, N.throwSpeed[k]!, N.throwMul[k]!, k);
    p.nlStage = k + 1;
    p.nlStageT = N.throwWindow;
    p.nlLock = N.throwLock;
    return;
  }
  p.nlBurst = N.tripleN + (hasPerk(p, "nlSpread") ? K.nlSpread.add : 0);
  p.nlBurstT = 0;
  delete p.nlStage;
  delete p.nlStageT;
  p.nlCd![0] = nlCooldown(p, 0);
}

/** 1 못 던지기 시간: 막는 틱 · 다음 단계 시간이 지나면 대기 · 3단계 연달아 */
export function throwTick(s: RunState): void {
  const p = s.player;
  if ((p.nlLock ?? 0) > 0 && --p.nlLock! <= 0) delete p.nlLock;
  if ((p.nlStageT ?? 0) > 0 && --p.nlStageT! <= 0) {
    delete p.nlStage;
    delete p.nlStageT;
    p.nlCd![0] = nlCooldown(p, 0);
  }
  if (!(p.nlBurst ?? 0) || --p.nlBurstT! > 0) return;
  throwNail(p, p.x, p.y - 4, p.faceX, p.faceY, N.throwSpeed[2]!, N.throwMul[2]!, 2);
  p.nlBurstT = N.tripleGap;
  if (--p.nlBurst! <= 0) {
    delete p.nlBurst;
    delete p.nlBurstT;
  }
}

/** 실을 따라 (x, y)로 무적 돌진 (step: 한 틱 거리 · dmg: 지나며 맞힘) */
function rushTo(s: RunState, x: number, y: number, step: number, dmg: number): void {
  const p = s.player;
  const d = Math.hypot(x - p.x, y - p.y);
  if (d < 1) return;
  startRush(p, { t: Math.max(1, Math.ceil(d / step)), dx: (x - p.x) / d, dy: (y - p.y) / d, step: Math.min(step, d), dmg, push: 0, invuln: true, tint: RED });
}

/** 2 붉은 실: 1번 바닥에 못을 박고 적에게 돌진 · 2번 망치 원(출혈) → 실을 따라 박은 못으로 */
function tieSkill(s: RunState): void {
  const p = s.player;
  const tie = p.nlTie;
  if (!tie) {
    if ((p.nlCd![1] ?? 0) > 0) return;
    const e = nearest(s, N.tieReach);
    const chain = hasPerk(p, "nlChain") ? K.nlChain.mul : 1;
    p.nlTie = { ax: p.x, ay: p.y, t: N.tieWindow, ph: 0, ...(e ? { id: e.id } : {}) };
    addEffect(s, { kind: "nlAnchorFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 10, maxTicks: 24 });
    if (e) {
      const d = Math.max(1, Math.hypot(e.x - p.x, e.y - p.y));
      const stop = Math.max(0, d - e.r - p.r - 2);
      rushTo(s, p.x + ((e.x - p.x) / d) * stop, p.y + ((e.y - p.y) / d) * stop, N.tieStep, nlDmg(p, N.tieMul * chain));
    } else rushTo(s, p.x + p.faceX * N.tieEmpty, p.y + p.faceY * N.tieEmpty, N.tieStep, nlDmg(p, N.tieMul * chain));
    return;
  }
  if (tie.ph !== 1) return;
  const big = hasPerk(p, "nlBleed");
  const r = N.smashR * (big ? K.nlBleed.r : 1);
  for (const e of inCircle(s, p.x, p.y, r)) {
    const had = e.nlNails ?? 0;
    strike(s, e, nlDmg(p, N.smashMul), 6);
    if (e.hp > 0) strike(s, e, nlDmg(p, N.smashBleed * (big ? K.nlBleed.mul : 1)), 0, "bleed");
    nlGain(s, N.gainHit + nlAfter(s, e, had));
  }
  addEffect(s, { kind: "nlSmashFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 26 });
  tie.ph = 2;
  rushTo(s, tie.ax, tie.ay, N.backStep, 0);
}

/** 2 붉은 실 한 틱: 돌진 → 닿으면 못 다섯·고정 · 기다림 · 돌아감 */
export function tieTick(s: RunState): void {
  const p = s.player;
  const tie = p.nlTie;
  if (!tie) return;
  if (tie.ph === 1) {
    if (--tie.t > 0) return;
  } else if (p.s2Rush) {
    rushTick(s);
    if (p.s2Rush) return;
  }
  if (tie.ph === 0) {
    tie.ph = 1;
    const e = alive(s).find((f) => f.id === tie.id);
    if (!e) return;
    addNails(s, e, N.tieNails + (hasPerk(p, "nlChain") ? K.nlChain.add : 0));
    stun(e, Math.round(N.tieFix * (hasPerk(p, "nlBind") ? K.nlBind.mul : 1)));
    if (e.kind !== "dummy") e.slowTicks = Math.max(e.slowTicks ?? 0, N.tieFix);
    addEffect(s, { kind: "nlPinFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r, maxTicks: 30 });
    nlGain(s, N.gainNail * N.tieNails);
    return;
  }
  delete p.nlTie;
  p.nlCd![1] = nlCooldown(p, 1);
}

/** 3 저주의 도화선: 내 자리에 못 → 못이 박힌 모든 적에게 붉은 도화선 → 타고 간 끝에서 한 번에 */
function curseSkill(s: RunState): void {
  const p = s.player;
  if ((p.nlCd![2] ?? 0) > 0) return;
  p.nlCd![2] = nlCooldown(p, 2);
  for (const e of inCircle(s, p.x, p.y, N.plantR)) strike(s, e, nlDmg(p, N.plantMul), 4);
  addEffect(s, { kind: "kgPlant", x: p.x + p.faceX * 8, y: p.y, dirX: 0, dirY: 0, size: N.plantR, maxTicks: 24, tint: RED });
  const keep = hasPerk(p, "nlFuse") ? K.nlFuse.keep : 0;
  for (const e of alive(s)) {
    const n = e.nlNails ?? 0;
    if (n <= 0) continue;
    const left = Math.floor(n * keep);
    if (left > 0) e.nlNails = left;
    else delete e.nlNails;
    (p.nlDets ??= []).push({ id: e.id, t: N.fuseTicks, n });
    addEffect(s, { kind: "kgLine", x: p.x + p.faceX * 8, y: p.y, dirX: 0, dirY: 0, size: 3, toX: e.x, toY: e.y, maxTicks: N.fuseTicks, tint: RED });
    addEffect(s, { kind: "kgPillar", x: e.x, y: e.y, dirX: 0, dirY: N.fuseTicks, size: e.r + 10, maxTicks: N.fuseTicks + 30, tint: RED });
  }
}

/** 도화선이 다 타면: 박혀 있던 못 하나마다 공격력 33%를 한 덩어리 저주 피해로 */
export function detTick(s: RunState): void {
  const p = s.player;
  const list = p.nlDets;
  if (!list) return;
  const per = hasPerk(p, "nlCurse") ? K.nlCurse.perNail : N.perNail;
  for (const d of list) {
    if (--d.t > 0) continue;
    const e = alive(s).find((f) => f.id === d.id);
    if (!e) continue;
    strike(s, e, nlDmg(p, d.n * per), 0, "curse");
    addEffect(s, { kind: "nlCurseFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: d.n, maxTicks: 30 });
    nlGain(s, nlAfter(s, e, d.n));
  }
  p.nlDets = list.filter((d) => d.t > 0);
  if (p.nlDets.length === 0) delete p.nlDets;
}

/** 4 심판의 못비: 가장 가까운 적 하나를 노림 (없으면 안 씀) */
function ultSkill(s: RunState): void {
  const p = s.player;
  if ((p.nlCd![3] ?? 0) > 0) return;
  const e = nearest(s, N.ultReach);
  if (!e) return;
  p.nlCd![3] = nlCooldown(p, 3);
  p.nlUlt = { id: e.id, n: N.ultVolleys + (hasPerk(p, "nlRain") ? K.nlRain.add : 0), t: 0, ax: p.x, ay: p.y };
}

/** 못비 한 틱: 제자리 · 노린 적이 죽으면 끝 · 나와 양옆에서 못이 한꺼번에 */
export function ultTick(s: RunState): void {
  const p = s.player;
  const u = p.nlUlt;
  if (!u) return;
  p.x = u.ax;
  p.y = u.ay;
  const e = alive(s).find((f) => f.id === u.id);
  if (!e) {
    delete p.nlUlt;
    return;
  }
  if (--u.t > 0) return;
  const d = Math.max(1, Math.hypot(e.x - p.x, e.y - p.y));
  const dx = (e.x - p.x) / d;
  const dy = (e.y - p.y) / d;
  p.faceX = dx;
  p.faceY = dy;
  const mul = N.ultMul * (hasPerk(p, "nlFocus") ? K.nlFocus.mul : 1);
  for (const off of [0, -N.ultSide, N.ultSide]) throwNail(p, p.x - dy * off, p.y - 4 + dx * off, dx, dy, N.ultSpeed, mul, 3, e.id);
  addEffect(s, { kind: "nlUltFx", x: p.x, y: p.y, dirX: dx, dirY: dy, size: N.ultSide, maxTicks: N.ultGap + 4 });
  u.t = N.ultGap;
  if (--u.n <= 0) delete p.nlUlt;
}

/** 스킬 키 (1~4) · 돌진·못비 중에는 안 씀 */
export function nlSkill(s: RunState, i: number): void {
  const p = s.player;
  p.nlCd ??= [0, 0, 0, 0];
  if (p.s2Rush || p.nlUlt) return;
  if (i === 0) throwSkill(s);
  else if (i === 1) tieSkill(s);
  else if (i === 2) curseSkill(s);
  else ultSkill(s);
}
