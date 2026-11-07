// 유리엘(성국, 단죄의 성녀): 누르고 있으면 3연격 (철퇴 휘두르기 둘 → 사슬 철퇴 한 바퀴: 맞힌 적 수만큼 회복)
// 맞힌 적에게 단죄가 쌓여 가득 차면 정화의 빛 (sim/yurielKit) · 스킬 넷은 숫자 키(sim/yurielSkills) · 결계 안에서 덜 맞고 회복
import { TICK_RATE } from "../constants";
import { YURIEL_PERKS as K } from "../itemsYuriel";
import { YURIEL as Y } from "../weaponsYuriel";
import { yrHeal, yrHit } from "./yurielKit";
import { maceTick, ultTick, wardTick, yrSkill } from "./yurielSkills";
import { inCircle, inCone, roomKey } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";

/** 1·2타: 앞 부채꼴을 철퇴로 (k 0 · 1 반대쪽으로) */
function swing(s: RunState, k: number): void {
  const p = s.player;
  const cos = hasPerk(p, "yrWrist") ? K.yrWrist.cos : Y.swingCos;
  const mul = Y.swingMul * (hasPerk(p, "yrHeavy") ? K.yrHeavy.mul : 1);
  const sr = Y.swingR * reachOf(p);
  for (const e of inCone(s, sr, cos)) yrHit(s, e, mul, Y.swingPush);
  addEffect(s, { kind: "yrSwingFx", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: sr, style: k, maxTicks: 16 });
}

/** 3타 사슬 철퇴 한 바퀴: 둘레 적을 모두 침 · 맞힌 적 수만큼 회복 (성수 세례: 단죄 하나 더) */
function spin(s: RunState): void {
  const p = s.player;
  const r = Y.spinR * (hasPerk(p, "yrChain") ? K.yrChain.r : 1) * reachOf(p);
  const hits = inCircle(s, p.x, p.y, r);
  const sin = 1 + (hasPerk(p, "yrBaptism") ? K.yrBaptism.more : 0);
  for (const e of hits) yrHit(s, e, Y.spinMul, Y.spinPush, sin);
  const n = Math.min(Y.spinHealMax, hits.length);
  if (n > 0) yrHeal(s, Y.spinHeal * n);
  addEffect(s, { kind: "yrSpinFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 20 });
}

/** 방이 바뀌면 결계·철퇴를 거둠 · 성국의 수호자 보호막 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.yrRoom === key) return;
  p.yrRoom = key;
  delete p.yrWard;
  delete p.yrMace;
  delete p.yrUlt;
  if (hasPerk(p, "yrGuard")) p.shieldPts = Math.max(p.shieldPts ?? 0, p.stats.maxHp * K.yrGuard.shield);
}

/** 틱마다 (철퇴를 들었을 때 player에서) */
export function yurielTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  const cd = (p.yrCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  wardTick(s);
  maceTick(s);
  ultTick(s);
  if (p.trKey && p.trKey >= 1 && p.trKey <= 4) yrSkill(s, p.trKey - 1);
  // 공격 대기가 끝난 뒤부터 잼 (공격 속도가 느려도 3타까지 이어지게)
  p.yrGap = (p.yrGap ?? 0) + (p.attackCooldown <= 0 ? 1 : 0);
  if (p.yrGap > Y.comboGap) p.yrStep = 0;
  if (!want || p.attackCooldown > 0 || p.s2Rush || (p.yrUlt ?? 0) > 0) return;
  const k = p.yrStep ?? 0;
  if (k < 2) swing(s, k);
  else spin(s);
  p.yrLast = { k, t: s.tick };
  p.yrStep = (k + 1) % 3;
  p.yrGap = 0;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * (Y.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetYuriel(p: RunState["player"]): void {
  for (const k of ["yrStep", "yrGap", "yrLast", "yrCd", "yrWard", "yrMace", "yrUlt", "yrSaint", "yrRoom"] as const) delete p[k];
}

export { isYuriel, yurielSkills, yurielTaken } from "./yurielKit";
