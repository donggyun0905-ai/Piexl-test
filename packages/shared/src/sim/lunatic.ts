// 루나틱(새벽의 성흔, 월광의 검사 · 리더): 누르고 있으면 새하얀 레이피어로 매우 빠르게 찌름 (앞으로 약간 돌진) · 달빛이 없어도 약점 공격 30% (sim/lunaticWeak)
// 대시: 지나가는 길의 적을 찌름 · 월광 표적(머리 위 조준점)에 약점이 터지면 확정 치명타 + 빠른 달빛 베기 (달빛 상태이상 피해, sim/lunaticKit)
// 성흔이 가득 차면 만월 각성: 공격 속도 증가 · 모든 적이 표적 · 수치 weaponsLunatic · 아이템 itemsLunatic (삼연 찌르기·월광 검기·잔상 찌르기·초승달 회전 베기 등)
import { TICK_RATE } from "../constants";
import { LUNATIC_PERKS as K } from "../itemsLunatic";
import { LUNATIC as L } from "../weaponsLunatic";
import { addWave, lnHit, marksTick, strikesTick, wavesTick } from "./lunaticKit";
import { rot } from "./orbit";
import { inCircle, inLine, roomKey } from "./s2Kit";
import { isAwake, stigmaTick } from "./stigma";
import type { RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, reachOf, roomGrid } from "./util";

/** 찌르기 길이 (사거리 증가·긴 칼날 따름) */
const lenOf = (s: RunState) => L.thrustLen * reachOf(s.player) * (hasPerk(s.player, "lnPierce") ? K.lnPierce.len : 1);

/** 앞으로 약간 돌진 (앞 적에게 닿기 전에 멈춤 · 벽 안) */
function lunge(s: RunState): void {
  const p = s.player;
  const len = lenOf(s);
  const dist = L.lunge * (hasPerk(p, "lnLunge") ? K.lnLunge.dist : 1);
  let go = dist;
  for (const e of inLine(s, len + dist, L.thrustW)) {
    const t = (e.x - p.x) * p.faceX + (e.y - p.y) * p.faceY;
    go = Math.min(go, Math.max(0, t - p.r - e.r - 1));
  }
  if (go <= 0) return;
  p.x += p.faceX * go;
  p.y += p.faceY * go;
  keepInRoom(p, roomGrid(s));
}

/** 한 방향 찌르기 (dx, dy) */
function thrustDir(s: RunState, dx: number, dy: number, mul: number): void {
  const p = s.player;
  const len = lenOf(s);
  for (const e of inLine(s, len, L.thrustW * reachOf(p), dx, dy)) lnHit(s, e, mul, L.thrustPush);
  addEffect(s, { kind: "lnThrustFx", x: p.x, y: p.y - 4, dirX: dx, dirY: dy, size: len, maxTicks: 12 });
  if (hasPerk(p, "lnWave")) addWave(p, p.x + dx * len * 0.6, p.y - 4 + dy * len * 0.6, dx, dy);
}

/** 기본 공격: 돌진 + 찌르기 · 삼연 찌르기 · 만월 각성 중 초승달 회전 베기 */
function thrust(s: RunState): void {
  const p = s.player;
  lunge(s);
  p.lnCount = (p.lnCount ?? 0) + 1;
  const mul = L.thrustMul * (hasPerk(p, "lnLunge") ? K.lnLunge.mul : 1);
  thrustDir(s, p.faceX, p.faceY, mul);
  if (hasPerk(p, "lnFlurry") && p.lnCount % K.lnFlurry.every === 0) {
    for (const a of [-0.38, 0.38]) {
      const [c, sn] = rot(a);
      thrustDir(s, p.faceX * c - p.faceY * sn, p.faceX * sn + p.faceY * c, mul * K.lnFlurry.mul);
    }
  }
  if (isAwake(p) && hasPerk(p, "lnCrescent") && p.lnCount % K.lnCrescent.every === 0) {
    const r = K.lnCrescent.r * reachOf(p);
    for (const e of inCircle(s, p.x, p.y, r)) lnHit(s, e, K.lnCrescent.mul, 4);
    addEffect(s, { kind: "lnCrescentFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 16, follow: true });
  }
}

/** 대시 찌르기: 대시 동안 몸 둘레 적을 한 번씩 찌름 · 끝나면 잔상 찌르기 */
function dashTick(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  if (dashing && !p.lnDash) {
    p.lnDashX = p.x;
    p.lnDashY = p.y;
    p.lnDashHit = [];
    addEffect(s, { kind: "lnDashFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: 20, maxTicks: 14, follow: true });
  }
  if (dashing) {
    const pow = hasPerk(p, "lnDashPow");
    const hit = (p.lnDashHit ??= []);
    for (const e of inCircle(s, p.x, p.y, L.dashR * reachOf(p) * (pow ? K.lnDashPow.r : 1))) {
      if (hit.includes(e.id)) continue;
      hit.push(e.id);
      lnHit(s, e, L.dashMul * (pow ? K.lnDashPow.mul : 1), L.dashPush);
      addEffect(s, { kind: "lnThrustFx", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: 24, maxTicks: 10 });
    }
  } else if (p.lnDash && hasPerk(p, "lnAfterimage")) {
    const a = K.lnAfterimage;
    (p.lnStrikes ??= []).push({ k: 2, x0: p.lnDashX ?? p.x, y0: p.lnDashY ?? p.y, x: p.x, y: p.y, t: a.delay, mul: a.mul, r: a.w });
  }
  p.lnDash = dashing;
}

/** 틱마다 (월광의 세검을 들었을 때 player에서) */
export function lunaticTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.lnRoom !== roomKey(s)) {
    for (const k of ["lnStrikes", "lnWaves", "lnMarkT"] as const) delete p[k];
    p.lnRoom = roomKey(s);
  }
  stigmaTick(p);
  marksTick(s);
  strikesTick(s);
  wavesTick(s);
  dashTick(s);
  if (!want || p.attackCooldown > 0 || p.s2Rush || p.dashTicks > 0) return;
  // 적이 없을 때도 조준한 쪽 허공을 찌름
  thrust(s);
  const fast = isAwake(p) ? L.awakeSpeed : 1;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / (speed * fast)) * L.thrustTime * (hasPerk(p, "lnSwift") ? K.lnSwift.time : 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetLunatic(p: RunState["player"]): void {
  for (const k of ["sgGauge", "sgAwake", "sgAwakeMax", "lnStrikes", "lnWaves", "lnMarkT", "lnCount", "lnDash", "lnDashX", "lnDashY", "lnDashHit", "lnRoom"] as const) delete p[k];
}

export { isLunatic } from "./lunaticWeak";
