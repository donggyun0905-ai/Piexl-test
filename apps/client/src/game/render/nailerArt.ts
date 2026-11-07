// 네일러 그림 도구 (nailerFx·nailerBody가 씀): 색 · 못 하나 · 망치 · 적 체력 줄 위 못 마크(못 ×개수)
import { additive, glow, type Ctx } from "./pwFxBits";

export const NL = { iron: "#9aa0ae", steel: "#e0e4ee", dark: "#24262e", wood: "#5a3a22", red: "#ff2a3a", blood: "#8a1020", curse: "#c02aa0", moon: "#c8d8ff" };

/** 못 하나: 머리(x, y)에서 a 방향으로 길이 len (뾰족한 끝) */
export function nail(ctx: Ctx, x: number, y: number, a: number, len: number, lit = 0): void {
  const cx = Math.cos(a);
  const cy = Math.sin(a);
  ctx.lineCap = "butt";
  ctx.strokeStyle = NL.dark;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + cx * len, y + cy * len);
  ctx.stroke();
  ctx.strokeStyle = NL.iron;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + cx * (len - 1), y + cy * (len - 1));
  ctx.stroke();
  // 머리: 가로 판
  ctx.strokeStyle = NL.steel;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - cy * 3, y + cx * 3);
  ctx.lineTo(x + cy * 3, y - cx * 3);
  ctx.stroke();
  if (lit > 0) additive(ctx, () => glow(ctx, x + cx * len * 0.5, y + cy * len * 0.5, len * 0.7, NL.red, lit));
}

/** 망치: 자루 끝(x, y)에서 a 방향 (머리는 a에 직각) */
export function hammer(ctx: Ctx, x: number, y: number, a: number, len: number, head: string = NL.iron): void {
  const cx = Math.cos(a);
  const cy = Math.sin(a);
  ctx.strokeStyle = NL.wood;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + cx * len, y + cy * len);
  ctx.stroke();
  const hx = x + cx * len;
  const hy = y + cy * len;
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(a);
  ctx.fillStyle = NL.dark;
  ctx.fillRect(-4, -7, 9, 14);
  ctx.fillStyle = head;
  ctx.fillRect(-3, -6, 7, 12);
  ctx.fillStyle = NL.steel;
  ctx.fillRect(-3, -6, 7, 2);
  ctx.restore();
}

/** 적 체력 줄 위 못 마크: 작은 못 + ×개수 (많을수록 붉게 빛남) */
export function nailMark(ctx: Ctx, x: number, y: number, n: number, tick: number): void {
  const hot = n >= 15;
  if (hot) additive(ctx, () => glow(ctx, x - 3, y, 5, NL.red, 0.35 + 0.25 * Math.sin(tick * 0.3)));
  nail(ctx, x - 3, y - 4, Math.PI / 2, 8);
  const txt = `x${n}`;
  ctx.font = "bold 7px monospace";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000";
  ctx.strokeText(txt, x, y);
  ctx.fillStyle = hot ? "#ff6a74" : "#f0f0f6";
  ctx.fillText(txt, x, y);
}
