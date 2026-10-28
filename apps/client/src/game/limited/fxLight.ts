// 스킨 효과 공용 빛 조각 (테마·범·여름이 같이 씀): 섬광(빛 덩이 + 네 갈래 빛살) · 빛 베기(초승달). 겹치면 밝아지게 그림
import { additive, crescent, glow } from "../render/pwFxBits";
import type { Part } from "./tigerFx";

type Ctx = CanvasRenderingContext2D;

/** 빛 조각이면 그리고 true (아니면 false) */
export function drawLight(ctx: Ctx, p: Part): boolean {
  const f = p.life / p.max;
  if (p.kind === "flash") {
    const r = p.size * (1.3 - 0.5 * f);
    ctx.save();
    ctx.globalAlpha = 1;
    additive(ctx, () => {
      glow(ctx, p.x, p.y, r, p.color, f, 1.4);
      ctx.strokeStyle = `rgba(255,255,255,${f})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const l = r * 1.4 * f;
      ctx.moveTo(p.x - l, p.y);
      ctx.lineTo(p.x + l, p.y);
      ctx.moveTo(p.x, p.y - l * 0.8);
      ctx.lineTo(p.x, p.y + l * 0.8);
      ctx.stroke();
    });
    ctx.restore();
    return true;
  }
  if (p.kind === "slash") {
    ctx.save();
    ctx.globalAlpha = 1;
    additive(ctx, () => crescent(ctx, p.x, p.y, p.size, p.rot, 0.9 + 0.3 * (1 - f), 3.5 * f + 0.5, p.color, f));
    ctx.restore();
    return true;
  }
  return false;
}
