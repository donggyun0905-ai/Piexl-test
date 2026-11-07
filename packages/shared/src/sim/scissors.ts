// 시저스(새벽의 성흔, 단죄의 가위): 누르고 있으면 가위질 두 박자 (열기: 넓게 휘두름 → 닫기: 두 날이 맞물리는 X자 절단 · 맞힌 적에게 운명의 실)
// 대시하면 묶인 운명의 실을 모두 끊어 벰 (팽팽할수록 셈 · 실이 지나는 적도) · 체력이 적은 적은 목을 잘라 단죄 (sim/scissorsKit)
// 맞힐수록 성흔이 차고 가득 차면 달빛 각성 (sim/stigma): 피해 1.3배 · 가위가 커짐 · 열기도 실을 묶음 · 실을 저절로 끊음. 수치 weaponsScissors.SCISSORS · 아이템 itemsScissors
import { TICK_RATE } from "../constants";
import { SCISSORS_PERKS as K } from "../itemsScissors";
import { SCISSORS as X } from "../weaponsScissors";
import { cut, cutThreads, sxDmg, sxGain, threadsTick, tie } from "./scissorsKit";
import { inCone, roomKey, strike } from "./s2Kit";
import { isAwake, stigmaTick } from "./stigma";
import type { RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";

/** 열기: 앞을 넓게 휘두름 (각성 중에는 실도 묶음) */
function open(s: RunState): void {
  const p = s.player;
  const aw = isAwake(p);
  const wide = hasPerk(p, "sxWide");
  const r = X.openR * (wide ? K.sxWide.r : 1) * (aw ? X.awakeReach : 1) * reachOf(p);
  const arc = wide ? K.sxWide.arc : X.openCos;
  let n = 0;
  for (const e of inCone(s, r, arc)) {
    n += cut(s, e, sxDmg(p, X.openMul), X.openPush) + X.gainOpen;
    if (aw) tie(s, e);
  }
  addEffect(s, { kind: "sxOpenFx", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: r, arc, style: aw ? 1 : 0, maxTicks: 14, follow: true });
  sxGain(s, n);
}

/** 닫기: 두 날이 앞에서 맞물리는 X자 절단 · 맞힌 적에게 운명의 실 (녹슨 날 · 쌍날) */
function close(s: RunState): void {
  const p = s.player;
  const aw = isAwake(p);
  const r = X.closeR * (aw ? X.awakeReach : 1) * reachOf(p);
  const dmg = sxDmg(p, X.closeMul * (hasPerk(p, "sxSnap") ? K.sxSnap.mul : 1));
  let n = 0;
  for (const e of inCone(s, r, X.closeCos)) {
    n += cut(s, e, dmg, X.closePush) + X.gainClose;
    if (e.hp <= 0) continue;
    tie(s, e);
    if (hasPerk(p, "sxRust")) strike(s, e, dmg * K.sxRust.mul, 0, "bleed");
    if (hasPerk(p, "sxTwin")) n += cut(s, e, dmg * K.sxTwin.mul);
  }
  addEffect(s, { kind: "sxCloseFx", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: r, style: aw ? 1 : 0, maxTicks: 16, follow: true });
  sxGain(s, n);
}

/** 방이 바뀌면 실을 거둠 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.sxRoom === key) return;
  p.sxRoom = key;
  delete p.sxThreads;
  delete p.sxSnip;
}

/** 대시 시작에 실을 끊음 · 각성 중에는 일정 틱마다 저절로 끊음 */
function snipTick(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  if (dashing && !p.sxDash) cutThreads(s);
  if (dashing) p.sxDash = true;
  else delete p.sxDash;
  if (!isAwake(p)) {
    delete p.sxSnip;
    return;
  }
  p.sxSnip = (p.sxSnip ?? 0) + 1;
  if (p.sxSnip < (hasPerk(p, "sxCrescent") ? K.sxCrescent.snip : X.awakeSnip)) return;
  p.sxSnip = 0;
  cutThreads(s);
}

/** 틱마다 (쌍가위를 들었을 때 player에서) */
export function scissorsTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  stigmaTick(p, hasPerk(p, "sxRemain") ? K.sxRemain.keep : 0);
  if (isAwake(p) && s.tick % 20 === 0) addEffect(s, { kind: "blMoonAura", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 26, maxTicks: 20, follow: true });
  threadsTick(s);
  snipTick(s);
  // 공격 대기가 끝난 뒤부터 잼 (한참 안 치면 다시 열기부터)
  p.sxGap = (p.sxGap ?? 0) + (p.attackCooldown <= 0 ? 1 : 0);
  if (p.sxGap > X.comboGap) p.sxStep = 0;
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  const k = p.sxStep ?? 0;
  if (k === 0) open(s);
  else close(s);
  p.sxLast = { k, t: s.tick };
  p.sxStep = (k + 1) % 2;
  p.sxGap = 0;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * (X.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetScissors(p: RunState["player"]): void {
  for (const k of ["sgGauge", "sgAwake", "sgAwakeMax", "sxStep", "sxGap", "sxLast", "sxThreads", "sxDash", "sxSnip", "sxRoom"] as const) delete p[k];
}

export { isScissors } from "./scissorsKit";
