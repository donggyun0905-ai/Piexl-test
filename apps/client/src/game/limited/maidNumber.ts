// 벨벳 티타임(한정 스킨) 피해 숫자: 보통은 크림 글자에 자주 테두리 · 치명타는 금빛 큰 숫자 + 밑에 장미 리본 + 옆 하트 (화면 전용)
import { BLUSH, CREAM, GILT, PLUM, ROSE } from "./maidArt";

type Ctx = CanvasRenderingContext2D;

/** 피해 숫자 (벨벳 티타임) */
export function drawMaidNumber(ctx: Ctx, text: string, x: number, y: number, age: number, crit: boolean): void {
  const pop = crit ? Math.max(1.3, 2 - age * 0.1) : 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  if (crit) {
    const fade = Math.max(0, 1 - Math.max(0, age - 12) / 14);
    const a0 = ctx.globalAlpha;
    const w = Math.min(14, age * 3);
    ctx.globalAlpha = a0 * fade;
    ctx.fillStyle = ROSE;
    ctx.fillRect(-w, 1, w * 2, 2);
    ctx.fillRect(-w - 2, 2, 2, 2);
    ctx.fillRect(w, 2, 2, 2);
    ctx.fillStyle = BLUSH;
    for (const sx of [-1, 1]) {
      const hx = sx * (12 + Math.min(4, age * 0.5));
      const hy = -10 - Math.min(4, age * 0.3);
      ctx.fillRect(hx - 1, hy, 1, 1);
      ctx.fillRect(hx + 1, hy, 1, 1);
      ctx.fillRect(hx - 1, hy + 1, 3, 1);
      ctx.fillRect(hx, hy + 2, 1, 1);
    }
    ctx.globalAlpha = a0;
  }
  ctx.scale(pop, pop);
  ctx.font = crit ? "900 9px serif" : "bold 6px monospace";
  ctx.lineJoin = "round";
  ctx.lineWidth = crit ? 3.5 : 2.5;
  ctx.strokeStyle = PLUM;
  ctx.strokeText(text, 0, 0);
  if (crit) {
    ctx.fillStyle = ROSE;
    ctx.fillText(text, 0.8, 0.8);
  }
  ctx.fillStyle = crit ? GILT : CREAM;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}
