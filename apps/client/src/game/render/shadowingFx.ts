// 쉐도잉 효과: 그림 줄 한 번 터짐(패시브 기술마다 쉐도잉·레이드 잔패턴 그림) · 봉인 번쩍(먹 번짐 + 원 · 사슬) · 일필 베기(검격 그림을 줄 따라)
import { SD_ROW, type EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { SD, sdFx } from "./shadowingArt";

const KINDS = new Set(["sdBurst", "sdSeal", "sdSlash", "sdInk"]);

export function drawShadowingFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.7 ? (1 - f) / 0.3 : 1;
  switch (fx.kind) {
    case "sdBurst": {
      const row = fx.style ?? SD_ROW.ink;
      // 시계는 머리 위에서 바늘이 돌 듯 프레임을 되풀이
      const frame = row === SD_ROW.clock ? (fx.ticks >> 3) % 4 : f * 4;
      sdFx(ctx, row, frame, x, y, Math.max(26, fx.size * 2.6), a);
      return true;
    }
    case "sdSeal": {
      const r = Math.max(16, fx.size);
      additive(ctx, () => glow(ctx, x, y, r * (1 + easeOut(f) * 0.4), SD.lilac, 0.7 * (1 - f), 0.5));
      sdFx(ctx, SD_ROW.ink, f * 4, x, y, r * 2.8, a * 0.8);
      if (fx.style === 1) sdFx(ctx, SD_ROW.chain, f * 4, x, y, r * 2.4, a);
      ctx.strokeStyle = alpha(SD.pale, 0.9 * (1 - f));
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r * (0.6 + easeOut(f) * 0.6), 0, Math.PI * 2);
      ctx.stroke();
      return true;
    }
    case "sdSlash": {
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const len = Math.hypot(tx - x, ty - y);
      const ang = Math.atan2(ty - y, tx - x);
      sdFx(ctx, SD_ROW.sword, 1 + f * 2.9, (x + tx) / 2, (y + ty) / 2, Math.max(40, len * 1.3), a, ang);
      additive(ctx, () => {
        ctx.strokeStyle = alpha("#ffffff", 0.9 * (1 - f));
        ctx.lineWidth = 3 * (1 - f) + 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      });
      return true;
    }
    default:
      sdFx(ctx, SD_ROW.ink, f * 4, x, y, Math.max(20, fx.size * 2), a);
      return true;
  }
}
