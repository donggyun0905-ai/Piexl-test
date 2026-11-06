// 미카엘라 그림 도구: 은빛 검 · 금빛 투창 · 공허 포탈 (박힌 무기·떨어지는 무기·떠다니는 무기·효과가 같이 씀)
import { additive, alpha, glow, type Ctx } from "./pwFxBits";

export const MC = { silver: "#e8ecf8", steel: "#9aa4b8", gold: "#f2c14e", light: "#fff6c0", void: "#7a58d8", deep: "#2a1a58", violet: "#c8b0ff", orange: "#ff9a40" };

/** 무기 하나: (x,y) 끝(날 끝)에서 각 a 쪽으로 손잡이 · k 0 검 · 1 투창 · len 길이 */
export function blade(ctx: Ctx, x: number, y: number, a: number, k: number, len: number, al: number): void {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const hx = x + c * len;
  const hy = y + s * len;
  ctx.lineCap = "round";
  if (k === 0) {
    // 검: 넓은 은빛 날 + 금빛 코등이
    ctx.strokeStyle = alpha(MC.silver, al);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + c * len * 0.7, y + s * len * 0.7);
    ctx.stroke();
    ctx.strokeStyle = alpha(MC.gold, al);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + c * len * 0.7 - s * 3, y + s * len * 0.7 + c * 3);
    ctx.lineTo(x + c * len * 0.7 + s * 3, y + s * len * 0.7 - c * 3);
    ctx.moveTo(x + c * len * 0.72, y + s * len * 0.72);
    ctx.lineTo(hx, hy);
    ctx.stroke();
  } else {
    // 투창: 가는 금빛 자루 + 은빛 촉
    ctx.strokeStyle = alpha(MC.gold, al);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(hx, hy);
    ctx.stroke();
    ctx.fillStyle = alpha(MC.silver, al);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + c * 5 - s * 2, y + s * 5 + c * 2);
    ctx.lineTo(x + c * 5 + s * 2, y + s * 5 - c * 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.lineCap = "butt";
  ctx.fillStyle = `rgba(255,255,255,${al})`;
  ctx.fillRect(x - 0.5, y - 0.5, 1.5, 1.5);
}

/** 공허 포탈: 보라 소용돌이 + 금빛 테두리 (납작한 타원) */
export function portal(ctx: Ctx, x: number, y: number, r: number, spin: number, al: number): void {
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.6, MC.void, al * 0.8, 0.3);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.45);
    ctx.fillStyle = alpha(MC.deep, al * 0.9);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = alpha(i === 0 ? MC.gold : MC.violet, al * (1 - i * 0.25));
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * (1 - i * 0.28), spin + i, spin + i + 4.4);
      ctx.stroke();
    }
    ctx.restore();
  });
}
