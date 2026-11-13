// 존 효과: 시트 4칸 그림 16종 (기본 공격 1~4단계 · 추가 공격 1~4단계 · 스킬 4개와 강화판, render/jauneArt ROW)
// + 빛으로만: 번개 터짐 · 황금 번개 찌릿 (추가 타격)
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import { JN, jnPic, ROW } from "./jauneArt";
import { sheetPlay } from "./noirArt";

const KINDS = new Set<string>([...Object.keys(ROW), "jnPop", "jnZap"]);
/** 네 칸을 다 보여 주는 데 드는 틱 (효과가 이보다 길면 마지막 칸에서 머묾) */
const PLAY = 30;
/** 바라보는 쪽으로 돌려 그리는 그림 (원본이 오른쪽을 봄) */
const TURN = new Set<string>(["jnClaw", "jnFlash", "jnFist", "jnZig", "jnClone", "jnBeam", "jnHand", "jnThousand"]);
/** 그림 크기 배율 (반지름 → 그림 너비) */
const SCALE: Partial<Record<string, number>> = { jnFlash: 2.3, jnFist: 2.3, jnZig: 2.3, jnBeam: 2.4, jnClaw: 2.6, jnStep: 2.6, jnEnd: 2.4 };

export function drawJauneFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.85 ? (1 - f) / 0.15 : 1;
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
  const turn = TURN.has(fx.kind);
  const ang = Math.atan2(fx.dirY, fx.dirX);
  const w = fx.size * (SCALE[fx.kind] ?? 2.2);
  sheetPlay(ctx, jnPic, ROW[fx.kind as keyof typeof ROW], fx.ticks, fx.maxTicks, PLAY, x, y, w, a, turn ? (left ? ang + Math.PI : ang) : 0, turn && left);
  return true;
}
