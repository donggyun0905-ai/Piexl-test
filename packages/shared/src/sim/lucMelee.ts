// 루시퍼 근접 견제 (몸에 붙어 때리는 사람): 가까이 있으면 번갈아
// ① 회전 베기: 몸 둘레 큰 원을 검으로 한 바퀴 (감속) ② 앞뒤 휘두르기: 가까운 사람 쪽 부채꼴 → 곧바로 반대쪽 (기절)
import { addShape } from "./hazards";
import { lucPose, lucTargets, near } from "./lucKit";
import type { LucFight } from "./lucTypes";
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 이 거리(몸 반지름 더함) 안에 사람이 있으면 · 다음 견제까지 틱 */
  NEAR: 150,
  GAP: 170,
  /** 회전 베기: 반지름 · 경고 틱 · 피해 */
  SPIN_R: 170,
  SPIN_WARN: 48,
  SPIN_DMG: 46,
  /** 앞뒤 휘두르기: 반지름 · 부채꼴 cos · 경고 틱 · 반대쪽까지 더 · 피해 */
  SWEEP_R: 220,
  SWEEP_ARC: 0.35,
  SWEEP_WARN: 42,
  SWEEP_BACK: 26,
  SWEEP_DMG: 54,
};
export { R as LUC_MELEE_RULES };

export function lucMelee(s: RunState, f: LucFight, e: EnemyState): void {
  if (s.tick < (f.nextMelee ?? 0)) return;
  const close = lucTargets(s).filter(([, p]) => near(p, e.x, e.y, R.NEAR + e.r));
  if (close.length === 0) return;
  f.nextMelee = s.tick + R.GAP;
  f.meleeN = (f.meleeN ?? 0) + 1;
  if (f.meleeN % 2 === 1) {
    lucPose(s, f, 4, R.SPIN_WARN + 10);
    addShape(s, R.SPIN_WARN, { x: e.x, y: e.y, radius: R.SPIN_R + e.r, damage: R.SPIN_DMG, fx: "lucFx", from: "spin", by: "lucifer" });
    return;
  }
  const [, p] = close[0]!;
  const d = Math.sqrt((p.x - e.x) ** 2 + (p.y - e.y) ** 2) || 1;
  const dx = (p.x - e.x) / d;
  const dy = (p.y - e.y) / d;
  lucPose(s, f, 3, R.SWEEP_WARN + R.SWEEP_BACK);
  addShape(s, R.SWEEP_WARN, { x: e.x, y: e.y, radius: R.SWEEP_R + e.r, dirX: dx, dirY: dy, arc: R.SWEEP_ARC, damage: R.SWEEP_DMG, fx: "lucFx", from: "sweep", by: "lucifer" });
  addShape(s, R.SWEEP_WARN + R.SWEEP_BACK, { x: e.x, y: e.y, radius: R.SWEEP_R + e.r, dirX: -dx, dirY: -dy, arc: R.SWEEP_ARC, damage: R.SWEEP_DMG, fx: "lucFx", from: "sweep", by: "lucifer" }, R.SWEEP_WARN);
}
