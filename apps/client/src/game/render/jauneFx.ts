// 존 효과: 시트 4칸 그림 16종 (기본 공격 1~4단계 · 추가 공격 1~4단계 · 스킬 4개와 강화판, render/jauneArt ROW)
// + 빛으로만: 번개 터짐 · 황금 번개 찌릿 (추가 타격)
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import { JN, jnPic, ROW } from "./jauneArt";
import { JN_SKILLS } from "@pixel-rogue/shared";
import { sheetLoop, type Frame } from "./sheetLoop";

const KINDS = new Set<string>([...Object.keys(ROW), "jnPop", "jnZap"]);
/** 반복 칸 (없으면 가운데 두 칸): 황금 뇌구는 마지막 칸과 그 좌우 반전 · 천둥의 발자취는 지그재그 길 → 연쇄 폭발 */
const LOOP: Partial<Record<string, readonly Frame[]>> = {
  jnOrb: [[3, false], [3, true]],
  jnStep: [[1, false], [2, false], [3, false], [2, false]],
  jnEnd: [[2, false], [2, true]],
  jnHand: [[2, false], [3, false]],
  // 빔은 좌우 반전하면 뒤로 향하므로 다 뻗은 칸 하나로 유지
  jnBeam: [[2, false]],
  jnFrenzy: [[2, false], [3, false], [2, true], [3, true]],
};
/** 바라보는 쪽으로 돌려 그리는 그림 (원본이 오른쪽을 봄) */
const TURN = new Set<string>(["jnClaw", "jnFlash", "jnFist", "jnZig", "jnClone", "jnBeam", "jnHand", "jnThousand"]);
/** 그림 크기 배율 (반지름 → 그림 너비) */
const SCALE: Partial<Record<string, number>> = { jnFlash: 2.3, jnFist: 2.3, jnZig: 2.3, jnBeam: 2.4, jnClaw: 2.6, jnStep: 1, jnEnd: 2.4, jnThousand: 1.1 };

export function drawJauneFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  // 맨 끝 5틱만 흐려짐 (마지막 그림이 다 보이게)
  const a = Math.min(1, fx.ticks / 5);
  if (fx.kind === "jnPop") {
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * (0.6 + f * 0.5), JN.gold, 0.7 * (1 - f), 0.45);
      shock(ctx, x, y, fx.size * easeOut(f), JN.light, 0.7 * (1 - f), 3);
      sparks(ctx, x, y, 14, fx.size, f, JN.light, fx.x + fx.y, 1);
    });
    return true;
  }
  if (fx.kind === "jnZap") {
    additive(ctx, () => sparks(ctx, x, y, 5, fx.size, f, JN.gold, fx.x * 3 + fx.y, 1));
    return true;
  }
  const left = fx.dirX < 0;
  const ang = Math.atan2(fx.dirY, fx.dirX);
  const w = fx.size * (SCALE[fx.kind] ?? 2.2);
  if (fx.kind === "jnChaos") return chaos(ctx, fx, x, y, w), true;
  // 천둥의 발자취: 그림 아래쪽(지그재그가 나아가는 쪽)을 돌진 방향으로 (sim/jnSkills zigPath와 같은 회전)
  const spin = fx.kind === "jnOrb" ? (fx.maxTicks - fx.ticks) * 0.04 : 0;
  const rot = spin + (fx.kind === "jnStep" ? ang - Math.PI / 2 : TURN.has(fx.kind) ? (left ? ang + Math.PI : ang) : 0);
  sheetLoop(ctx, jnPic, ROW[fx.kind as keyof typeof ROW], fx.ticks, fx.maxTicks, x, y, w, a, rot, TURN.has(fx.kind) && left, LOOP[fx.kind], fx.kind === "jnOrb" ? 5 : 7);
  return true;
}

/** 혼돈의 낙뢰: 한 대마다 낙뢰가 2→3→4칸으로 내려치고 자리·좌우가 바뀜 · 마지막 강타 3번은 크게 · 끝나면 마지막 칸을 잠시 보여 주고 사라짐 */
function chaos(ctx: Ctx, fx: EffectState, x: number, y: number, w: number): void {
  const every = JN_SKILLS.chaos.every;
  const e = fx.maxTicks - fx.ticks;
  const strong = fx.style ?? 0;
  const end = strong + JN_SKILLS.chaos.fin * every;
  const k = Math.floor(e / every);
  const within = (e % every) / every;
  const fade = fx.ticks < 10 ? fx.ticks / 10 : 1;
  // 바닥의 예고 고리 (첫 칸)는 내내 은은하게
  jnPic(ctx, ROW.jnChaos, 0, x, y, w, 0.45 * fade);
  if (e >= end) return jnPic(ctx, ROW.jnChaos, 3, x, y, w * 1.25, fade);
  const big = e >= strong;
  const j = big ? 0.08 : 0.22;
  const ox = ((((k * 37) % 7) - 3) / 3) * fx.size * j;
  const oy = ((((k * 53) % 5) - 2) / 2) * fx.size * j * 0.6;
  const col = big ? 3 : 1 + Math.min(2, Math.floor(within * 3));
  jnPic(ctx, ROW.jnChaos, col, x + ox, y + oy, w * (big ? 1.25 : 1), 1, 0, k % 2 === 1);
  if (big) additive(ctx, () => glow(ctx, x, y, fx.size, JN.light, 0.7 * (1 - within), 0.4));
}
