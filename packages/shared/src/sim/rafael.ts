// 라파엘(성국, 폭풍의 사수): 누르고 있으면 3연격 (화살 둘 → 저격: 표적을 향해 모든 적을 꿰뚫는 굵은 화살)
// 화살은 바로 닿는 줄 판정 · 멀리 있는 적일수록 피해 증가 · 방에서 가장 강한 적에 표적 (sim/rafaelKit) · 스킬 넷은 숫자 키(sim/rafaelSkills)
import { TICK_RATE } from "../constants";
import { RAFAEL_PERKS as K } from "../itemsRafael";
import { RAFAEL as F } from "../weaponsRafael";
import { aimAt, onRay, pickMarks, rfHit } from "./rafaelKit";
import { chargeTick, rfSkill, stepTick, stormTick } from "./rafaelSkills";
import { roomKey } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 1·2타 화살: 앞으로 곧게 날아가 처음 닿은 적 (관통 화살촉: 하나 더) */
function arrow(s: RunState): void {
  const p = s.player;
  const [dx, dy] = hasPerk(p, "rfSpotter") ? aimAt(s, K.rfSpotter.cos) : [p.faceX, p.faceY];
  const len = F.arrowLen * (hasPerk(p, "rfReach") ? K.rfReach.len : 1);
  const hits = onRay(s, dx, dy, len, F.arrowW).slice(0, 1 + (hasPerk(p, "rfPierce") ? K.rfPierce.more : 0));
  const feather = hasPerk(p, "rfFeather");
  for (const e of hits) {
    rfHit(s, e, F.arrowMul, feather ? K.rfFeather.push : 0);
    if (feather) e.slowTicks = Math.max(e.slowTicks ?? 0, K.rfFeather.slow);
  }
  const end = hits[hits.length - 1];
  const reach = end ? (end.x - p.x) * dx + (end.y - p.y) * dy : len;
  addEffect(s, { kind: "rfArrowFx", x: p.x, y: p.y - 6, dirX: dx, dirY: dy, size: 3, style: 0, toX: p.x + dx * reach, toY: p.y - 6 + dy * reach, maxTicks: 12 });
}

/** 3타 저격: 표적을 향해 모든 적을 꿰뚫는 굵은 화살 (에테르 스코프 중 더 세고 멀리) */
function snipe(s: RunState): void {
  const p = s.player;
  const scope = (p.rfScope ?? 0) > 0;
  const [dx, dy] = aimAt(s, F.snipeAimCos);
  const len = F.snipeLen * (scope ? F.scopeLen : 1) * (hasPerk(p, "rfReach") ? K.rfReach.len : 1);
  const mul = F.snipeMul * (scope ? F.scopeMul : 1) * (hasPerk(p, "rfHead") ? K.rfHead.mul : 1);
  for (const e of onRay(s, dx, dy, len, F.snipeW)) {
    rfHit(s, e, mul, F.snipePush);
    if (hasPerk(p, "rfThunder") && e.hp > 0) rfHit(s, e, K.rfThunder.mul);
  }
  addEffect(s, { kind: "rfArrowFx", x: p.x, y: p.y - 6, dirX: dx, dirY: dy, size: 6, style: 1, toX: p.x + dx * len, toY: p.y - 6 + dy * len, maxTicks: 18 });
}

/** 방이 바뀌면 화살비·표적·모으기를 거둠 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.rfRoom === key) return;
  p.rfRoom = key;
  for (const k of ["rfStorms", "rfMarks", "rfMarkAt", "rfCharge", "rfAim"] as const) delete p[k];
}

/** 시간 재기: 대기 · 스코프 · 가만히 선 틱 */
function timers(s: RunState): void {
  const p = s.player;
  const cd = (p.rfCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  if ((p.rfScope ?? 0) > 0 && --p.rfScope! <= 0) delete p.rfScope;
  const moved = !p.rfLast || p.rfLast.x !== p.x || p.rfLast.y !== p.y;
  p.rfStill = moved ? 0 : (p.rfStill ?? 0) + 1;
  p.rfLast = { x: p.x, y: p.y };
}

/** 틱마다 (활을 들었을 때 player에서) */
export function rafaelTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  timers(s);
  pickMarks(s);
  stepTick(s);
  stormTick(s);
  chargeTick(s);
  if (p.trKey && p.trKey >= 1 && p.trKey <= 4) rfSkill(s, p.trKey - 1);
  // 공격 대기가 끝난 뒤부터 잼 (공격 속도가 느려도 3타까지 이어지게)
  p.rfGap = (p.rfGap ?? 0) + (p.attackCooldown <= 0 ? 1 : 0);
  if (p.rfGap > F.comboGap) p.rfStep = 0;
  if (!want || p.attackCooldown > 0 || p.s2Rush || (p.rfCharge ?? 0) > 0) return;
  const k = p.rfStep ?? 0;
  // 바람 걸음 뒤 · 에테르 스코프 중에는 모든 공격이 저격
  if (k === 2 || p.rfEmp || (p.rfScope ?? 0) > 0) snipe(s);
  else arrow(s);
  delete p.rfEmp;
  p.rfStep = (k + 1) % 3;
  p.rfGap = 0;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * (F.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetRafael(p: RunState["player"]): void {
  for (const k of ["rfStep", "rfGap", "rfCd", "rfMarks", "rfMarkAt", "rfEmp", "rfStorms", "rfScope", "rfCharge", "rfAim", "rfStill", "rfLast", "rfRoom"] as const) delete p[k];
}

export { isRafael, rafaelSkills } from "./rafaelKit";
