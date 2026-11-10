// 네일러 그림 도구 (nailerFx·nailerBody가 씀): 색 · 못 하나 (온통 검은 못: 양끝이 뾰족한 머리 · 뾰족한 끝) · 핏방울 · 적 체력 줄 위 못 마크(못 ×개수)
import { additive, glow, type Ctx } from "./pwFxBits";

export const NL = { iron: "#121216", steel: "#5c5c6c", dark: "#050507", red: "#ff2a3a", blood: "#8a0a18", gore: "#c0101e", curse: "#c02aa0", moon: "#c8d8ff" };

/** 못 하나 (온통 검정): 머리(x, y)에서 a 방향으로 길이 len · 얇은 머리는 양끝이 뾰족 · 곧은 몸통이 끝으로 갈수록 가늘어져 뾰족 (lit: 붉은 빛)
 * 한 덩어리 윤곽으로 칠하고 둘레에 가는 옅은 테두리 (어두운 바닥에서도 보이게) · 몸통 한쪽에 가는 쇳빛 줄 */
export function nail(ctx: Ctx, x: number, y: number, a: number, len: number, lit = 0): void {
  const cx = Math.cos(a);
  const cy = Math.sin(a);
  const nx = -cy;
  const ny = cx;
  const at = (t: number, w: number): [number, number] => [x + cx * t + nx * w, y + cy * t + ny * w];
  const sw = Math.max(0.8, len * 0.065);
  const hw = Math.max(2.2, len * 0.24);
  const ht = Math.max(0.8, len * 0.06);
  const neck = len * 0.58;
  // 머리 뒤 끝 → 머리 한쪽 끝 → 몸통 → 끝 → 반대쪽 몸통 → 머리 다른 끝
  const pts = [at(-ht, 0), at(0, hw), at(ht, sw), at(neck, sw), at(len, 0), at(neck, -sw), at(ht, -sw), at(0, -hw)];
  ctx.beginPath();
  ctx.moveTo(pts[0]![0], pts[0]![1]);
  for (const q of pts.slice(1)) ctx.lineTo(q[0], q[1]);
  ctx.closePath();
  ctx.lineJoin = "miter";
  ctx.strokeStyle = "rgba(200,200,214,0.45)";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.fillStyle = NL.iron;
  ctx.fill();
  // 쇳빛 줄 (몸통 한쪽 · 머리 윗면)
  ctx.strokeStyle = NL.steel;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(...at(ht + 0.5, sw * 0.4));
  ctx.lineTo(...at(len * 0.8, sw * 0.2));
  ctx.moveTo(...at(0, hw * 0.75));
  ctx.lineTo(...at(-ht * 0.6, 0));
  ctx.stroke();
  if (lit > 0) additive(ctx, () => glow(ctx, x + cx * len * 0.5, y + cy * len * 0.5, len * 0.7, NL.red, lit));
}

/** 핏방울 하나 (작은 눈물 모양: 아래가 둥글고 위가 뾰족) */
export function drop(ctx: Ctx, x: number, y: number, r: number, c: string = NL.gore): void {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.moveTo(x, y - r * 2);
  ctx.quadraticCurveTo(x + r, y - r * 0.4, x, y + r);
  ctx.quadraticCurveTo(x - r, y - r * 0.4, x, y - r * 2);
  ctx.fill();
}

/** 적 체력 줄 위 못 마크: 작은 못 + ×개수 (많을수록 붉게 빛남) */
export function nailMark(ctx: Ctx, x: number, y: number, n: number, tick: number): void {
  const hot = n >= 15;
  if (hot) additive(ctx, () => glow(ctx, x - 3, y, 5, NL.red, 0.35 + 0.25 * Math.sin(tick * 0.3)));
  nail(ctx, x - 3, y - 4, Math.PI / 2, 9);
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
