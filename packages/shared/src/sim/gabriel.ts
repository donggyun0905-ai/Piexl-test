// 가브리엘(성국, 철옹의 방패): 누르고 있으면 3연격 (내려찍기 · 휘두르기 → 대지 강타: 빛의 망치가 내리꽂혀 기절·압박)
// 철옹: 받는 피해 절반 (sim/gabrielKit). 스킬 넷은 숫자 키(sim/gabrielSkills) · 궁극기 중 기본 공격마다 거대한 빛의 망치가 함께 휘둘러짐
import { srcRun, srcFn } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { GABRIEL_PERKS as K } from "../itemsGabriel";
import { GABRIEL as G } from "../weaponsGabriel";
import { dropHammer, gbHit as gbHit_, press } from "./gabrielKit";
import { miniTick, wellTick } from "./gabrielShield";
import { bashTick, dropsTick, gbSkill, ultHammer, ultTick } from "./gabrielSkills";
import { inCircle, inCone, roomKey, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";
const gbHit = srcFn("gabriel", () => gbHit_);

/** 1·2타: 앞 부채꼴을 망치로 (k 0 내려찍기 · 1 휘두르기) */
function swing(s: RunState, k: number): void {
  const p = s.player;
  const r = G.swingR * (hasPerk(p, "gbTitan") ? K.gbTitan.r : 1);
  const mul = G.swingMul * (hasPerk(p, "gbForge") ? K.gbForge.mul : 1);
  for (const e of inCone(s, r, G.swingCos[k] ?? 0)) gbHit(s, e, mul, G.swingPush);
  addEffect(s, { kind: "gbSwing", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: r, style: k, maxTicks: 16 });
}

/** 3타 대지 강타: 앞 땅을 내리쳐 빛의 망치가 꽂힘 (기절·압박) */
function slam(s: RunState): void {
  const p = s.player;
  const x = p.x + p.faceX * G.slamAt;
  const y = p.y + p.faceY * G.slamAt;
  const r = G.slamR * (hasPerk(p, "gbQuake") ? K.gbQuake.r : 1);
  const stunT = Math.round(G.slamStun * (hasPerk(p, "gbStun") ? K.gbStun.mul : 1));
  const mul = G.slamMul * (hasPerk(p, "gbForge") ? K.gbForge.mul : 1);
  for (const e of inCircle(s, x, y, r)) {
    gbHit(s, e, mul, G.slamPush);
    stun(e, stunT);
    press(s, e);
  }
  addEffect(s, { kind: "gbSlam", x, y, dirX: 0, dirY: 0, size: r, maxTicks: 26 });
  addEffect(s, { kind: "gbHammer", x, y, dirX: 0, dirY: 0, size: r, maxTicks: 22 });
  if (hasPerk(p, "gbAfter")) srcRun(s, "gbAfter", () => dropHammer(s, x, y, K.gbAfter.delay, r, p.stats.damage * mul * K.gbAfter.mul));
}

/** 방이 바뀌면 떨어지는 망치·영역을 거둠 · 수호자의 맹세 보호막 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.gbRoom === key) return;
  p.gbRoom = key;
  delete p.gbDrops;
  delete p.gbZone;
  delete p.gbUlt;
  delete p.gbWell;
  delete p.gbMini;
  if (hasPerk(p, "gbVow")) p.shieldPts = Math.max(p.shieldPts ?? 0, p.stats.maxHp * K.gbVow.shield);
}

/** 시간 재기: 대기 · 적 압박 */
function timers(s: RunState): void {
  const cd = (s.player.gbCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  for (const e of s.enemies) if ((e.gbPress ?? 0) > 0 && --e.gbPress! <= 0) delete e.gbPress;
}

/** 틱마다 (해머를 들었을 때 player에서) */
export function gabrielTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  timers(s);
  dropsTick(s);
  ultTick(s);
  bashTick(s);
  wellTick(s);
  miniTick(s);
  if (p.trKey && p.trKey >= 1 && p.trKey <= 4) gbSkill(s, p.trKey - 1);
  // 공격 대기가 끝난 뒤부터 잼 (공격 속도가 느려도 3타까지 이어지게)
  p.gbGap = (p.gbGap ?? 0) + (p.attackCooldown <= 0 ? 1 : 0);
  if (p.gbGap > G.comboGap) p.gbStep = 0;
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  const k = p.gbStep ?? 0;
  if (k < 2) swing(s, k);
  else slam(s);
  ultHammer(s, k);
  p.gbLast = { k, t: s.tick };
  p.gbStep = (k + 1) % 3;
  p.gbGap = 0;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * (G.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetGabriel(p: RunState["player"]): void {
  for (const k of ["gbStep", "gbGap", "gbLast", "gbCd", "gbUlt", "gbZone", "gbGrant", "gbDrops", "gbRoom", "gbWell", "gbMini"] as const) delete p[k];
}

export { gabrielSkills, gabrielTaken, isGabriel } from "./gabrielKit";
