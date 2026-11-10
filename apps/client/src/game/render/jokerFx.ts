// 조커 효과: 카드가 벽에 튕김 · 한도를 넘어 사라짐 · 폭죽 · 뽑은 카드가 뒤집힘 · 달의 힘(히든 캐릭터마다 색·모양) · 세계수 회복 · 차원 균열
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { DRAW_COLORS, drawDrawCard, JK } from "./jokerArt";

const KINDS = new Set(["jkBounce", "jkPop", "jkFirework", "jkReveal", "jkMoon", "jkTree", "jkRift"]);
/** 달의 힘 색 (MOON_HEROES 차례: 별지기·오리·서기관·광부·여행자·제우스·순례자·몰락한 왕·빛의 사도) */
const MOON = ["#9ab8ff", "#ffd84a", "#b89aff", "#5ad8e8", "#e8b040", "#8ac8ff", "#7ad0f0", "#3ab8ff", "#ffb040"];

export function drawJokerFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  switch (fx.kind) {
    case "jkBounce": {
      // 튕길 때 번쩍 + 지금 피해가 클수록 큰 불꽃
      const big = Math.min(1, fx.size / 60);
      additive(ctx, () => {
        glow(ctx, x, y, 5 + big * 8, fx.style === 1 ? JK.neon : JK.edge, 0.7 * (1 - f), 0.5);
        sparks(ctx, x, y, 4 + Math.round(big * 4), 4 + big * 8, f, JK.neon, fx.x + fx.y);
      });
      return true;
    }
    case "jkPop":
      ctx.fillStyle = alpha(JK.paper, 1 - f);
      ctx.fillRect(x - 2, y - 3 - f * 6, 4, 6);
      return true;
    case "jkFirework":
      additive(ctx, () => {
        sparks(ctx, x, y, 12, fx.size * easeOut(f), f, JK.red, fx.x, 1 - f);
        sparks(ctx, x, y, 10, fx.size * 0.7 * easeOut(f), f, JK.gold, fx.y, 1 - f);
        glow(ctx, x, y, fx.size * 0.5, JK.neon, 0.5 * (1 - f), 0.4);
      });
      return true;
    case "jkReveal": {
      const c = DRAW_COLORS[fx.style ?? 0]!;
      additive(ctx, () => {
        glow(ctx, x, y - 18, fx.size * (0.6 + f), c, 0.6 * (1 - f), 0.4);
        shock(ctx, x, y, fx.size * easeOut(f) * 1.6, c, 1 - f, 2);
      });
      ctx.globalAlpha = Math.max(0, 1 - f * 1.2);
      drawDrawCard(ctx, x, y - 26 - f * 10, 28, fx.style ?? 0, true);
      ctx.globalAlpha = 1;
      return true;
    }
    case "jkMoon": {
      const c = MOON[fx.style ?? 0] ?? JK.edge;
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * (0.5 + f * 0.5), c, 0.6 * (1 - f), 0.4);
        shock(ctx, x, y, fx.size * easeOut(f), c, 1 - f, 2);
        // 별똥별·낙뢰는 위에서 떨어지는 줄
        if (fx.style === 0 || fx.style === 5) {
          ctx.strokeStyle = alpha("#ffffff", 1 - f);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + (fx.style === 0 ? -18 : 3), y - 60);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      });
      return true;
    }
    case "jkTree":
      additive(ctx, () => {
        glow(ctx, x, y, fx.size, "#7ae05a", 0.5 * (1 - f), 0.3);
        sparks(ctx, x, y - f * 20, 10, fx.size * 0.6, f, "#ffe08a", fx.x, 1 - f);
      });
      return true;
    case "jkRift": {
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      additive(ctx, () => {
        ctx.strokeStyle = alpha(MOON[6]!, 1 - f);
        ctx.lineWidth = (fx.width ?? 8) * (1 - f) + 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.strokeStyle = alpha("#ffffff", 1 - f);
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      return true;
    }
  }
  return false;
}
