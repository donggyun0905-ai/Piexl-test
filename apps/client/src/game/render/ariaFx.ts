// 아리아 효과: 여덟 음표 터짐(빛 폭죽: 번쩍 → 빛 줄기 퍼짐 → 반짝이 흩어짐) · 악보 완성 폭죽 · 앙코르 · 작은 북 울림 · 음표 맞음 불똥 · 바이올린 활 휘감기 · 악기 놓임 · 악보 완성 시작(8색 고리)
import type { EffectState } from "@pixel-rogue/shared";
import { AR, AR_COLORS } from "./ariaArt";
import type { Snap } from "./palette";
import { additive, alpha, crescent, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";

const KINDS = new Set(["arBurst", "arBoom", "arEncore", "arEcho", "arPop", "arSweep", "arPlace", "arFinale"]);

export function drawAriaFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const col = AR_COLORS[(fx.style ?? 0) & 7]!;
  switch (fx.kind) {
    case "arBurst":
    case "arBoom":
    case "arEncore": {
      // 빛 폭죽 (그림 없이 빛만 · 맞는 범위만큼): 번쩍 → 빛 줄기가 퍼짐 → 반짝이가 흩어지며 사라짐
      const r = fx.size * (fx.kind === "arBoom" ? 0.9 : 1);
      const seed = fx.x * 7 + fx.y * 3;
      additive(ctx, () => {
        if (f < 0.35) glow(ctx, x, y, r * (0.3 + f), col, 0.7 * (1 - f / 0.35), 0.6);
        sparks(ctx, x, y, 14, r, f, col, seed, 0.95);
        if (f > 0.3) sparks(ctx, x, y + (f - 0.3) * 8, 8, r * 1.1, (f - 0.3) / 0.7, AR.pale, seed + 1, 0.7);
      });
      if (fx.kind === "arBurst" && f < 0.5) shock(ctx, x, y, r * easeOut(f * 2), col, 0.6 * (1 - f * 2), 2);
      if (fx.kind === "arEncore") ring(ctx, x, y, r * (0.5 + f * 0.5), alpha(AR.pale, 0.5 * (1 - f)), 1.5);
      return true;
    }
    case "arEcho": {
      // 작은 북 울림: 금빛 고리 둘이 퍼짐
      additive(ctx, () => {
        ring(ctx, x, y, fx.size * easeOut(f), alpha(AR.gold, 0.8 * (1 - f)), 2);
        ring(ctx, x, y, fx.size * easeOut(f) * 0.6, alpha(col, 0.6 * (1 - f)), 1.5);
      });
      return true;
    }
    case "arPop": {
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * 1.2, col, 0.5 * (1 - f), 0.4);
        sparks(ctx, x, y, 6, fx.size * 2, f, col, fx.ticks + fx.x, 1);
      });
      return true;
    }
    case "arSweep": {
      // 바이올린 활: 둘레를 휘감는 금빛 초승달 둘
      const spin = f * Math.PI * 1.6;
      additive(ctx, () => {
        crescent(ctx, x, y, fx.size * (0.7 + f * 0.3), spin, 2.2, 7, AR.soul, 0.85 * (1 - f));
        crescent(ctx, x, y, fx.size * (0.5 + f * 0.3), spin + Math.PI, 1.8, 5, AR.gold, 0.7 * (1 - f));
      });
      return true;
    }
    case "arPlace": {
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * (1 + f), AR.gold, 0.6 * (1 - f), 0.4);
        sparks(ctx, x, y, 10, fx.size * 1.6, f, AR.pale, fx.ticks + fx.y, 1);
      });
      ring(ctx, x, y, fx.size * (0.4 + easeOut(f)), alpha(AR.pale, 0.7 * (1 - f)), 1.5);
      return true;
    }
    case "arFinale": {
      // 악보 완성 시작: 8색 고리가 차례로 크게 퍼짐
      additive(ctx, () => {
        for (let k = 0; k < 8; k++) {
          const g = Math.max(0, f * 1.6 - k * 0.07);
          if (g <= 0 || g >= 1) continue;
          ring(ctx, x, y, 20 + easeOut(g) * 260, alpha(AR_COLORS[k]!, 0.75 * (1 - g)), 3);
        }
        glow(ctx, x, y, 80, AR.gold, 0.5 * (1 - f), 0.5);
      });
      return true;
    }
  }
  return false;
}
