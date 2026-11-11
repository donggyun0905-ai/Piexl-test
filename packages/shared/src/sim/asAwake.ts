// 아수라 각성(필살기): 공격마다 확률로 각성 · 각성 동안 누를 때마다 1·2타 → 1·2타 → 3타(바닥 연속 강타 n번) → 4타(기절·큰 피해) 차례로
// 그림은 모두 4칸 · 공격 사이 틱 = 그림 길이라 계속 누르면 그림이 이어짐
import { ASURA_PERKS as K } from "../itemsAsura";
import { ASURA_AWAKE as A } from "../weaponsAsura";
import { asArea } from "./asHit";
import { fistSize, hasAs } from "./asKit";
import { afterAttack } from "./asMoves";
import type { RunState } from "./types";
import { addEffect } from "./util";

/** 각성 시작 (귀문 개방이면 더 오래) */
export function startAwake(s: RunState): void {
  const p = s.player;
  p.asAwake = hasAs(p, "asGate") ? K.asGate.ticks : A.ticks;
  p.asAwakeAt = s.tick;
  p.asStep = 0;
}

/** 공격 속도로 짧아진 틱 */
const fast = (t: number, speed: number) => Math.max(3, Math.round(t / Math.max(0.3, speed)));

/** 3타 바닥 강타 한 번 (몸 둘레) */
function pound(s: RunState, gap: number): void {
  const p = s.player;
  const r = A.r3 * fistSize(p);
  const n = asArea(s, p.x, p.y, r, p.stats.damage * A.mul3, { split: true, dx: p.faceX, dy: p.faceY });
  addEffect(s, { kind: "asAwk3", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: gap });
  afterAttack(s, p.x, p.y, fistSize(p), n);
}

/** 각성 공격 한 번 (누를 때) · 다음 공격까지 틱 */
export function awakeStrike(s: RunState, speed: number): number {
  const p = s.player;
  const step = p.asStep ?? 0;
  p.asStep = (step + 1) % 4;
  const k = fistSize(p);
  if (step <= 1) {
    const x = p.x + p.faceX * A.reach12 * k;
    const y = p.y + p.faceY * A.reach12 * k;
    const r = A.r12 * k;
    const cd = fast(A.cd12, speed);
    const n = asArea(s, x, y, r, p.stats.damage * A.mul12, { split: true, dx: p.faceX, dy: p.faceY });
    addEffect(s, { kind: "asAwk12", x, y, dirX: p.faceX, dirY: p.faceY, size: r, style: step, maxTicks: cd });
    afterAttack(s, x, y, k, n);
    return cd;
  }
  if (step === 2) {
    const gap = fast(A.gap3, speed);
    p.asPound = A.n3 - 1;
    p.asPoundCd = gap;
    pound(s, gap);
    return gap * A.n3;
  }
  const weight = hasAs(p, "asWeight");
  const r = A.r4 * k * (weight ? K.asWeight.size : 1);
  const cd = fast(A.cd4, speed);
  const n = asArea(s, p.x, p.y, r, p.stats.damage * A.mul4, { split: true, stun: weight ? K.asWeight.stun : A.stun4, dx: p.faceX, dy: p.faceY });
  addEffect(s, { kind: "asAwk4", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: cd });
  afterAttack(s, p.x, p.y, k, n);
  return cd;
}

/** 틱마다: 각성 시간 · 3타 남은 강타 */
export function awakeTick(s: RunState, speed: number): void {
  const p = s.player;
  if ((p.asAwake ?? 0) > 0) {
    p.asAwake = (p.asAwake ?? 0) - 1;
    if (!p.asAwake) delete p.asStep;
  }
  if (!(p.asPound ?? 0)) return;
  p.asPoundCd = (p.asPoundCd ?? 0) - 1;
  if (p.asPoundCd > 0) return;
  const gap = fast(A.gap3, speed);
  p.asPound = (p.asPound ?? 0) - 1;
  p.asPoundCd = gap;
  pound(s, gap);
}
