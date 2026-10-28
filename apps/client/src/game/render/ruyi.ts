// 제천대성 여의봉 그리기: 금빛 기운 · 검붉은 쇠 봉(빛 줄·그늘) · 새긴 금 고리 · 가운데 금 띠 · 골 진 금테 마개와 빛나는 끝 · 친 순간(속도선·섬광)·돌리기(잔상)·하늘에서 내리꽂기
import type { EffectState } from "@pixel-rogue/shared";

const TAU = Math.PI * 2;

/** 여의봉: 금빛 기운 · 검붉은 쇠 봉(빛 줄·그늘) · 새긴 금 고리 · 가운데 금 띠 · 양 끝 골 진 금테 마개와 빛나는 끝 (w = 굵기, glow 0~1) */
export function drawRuyi(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, w: number, glow = 0.5): void {
  const len = Math.hypot(x1 - x0, y1 - y0);
  if (len < 1) return;
  const ux = (x1 - x0) / len;
  const uy = (y1 - y0) / len;
  const nx = -uy;
  const ny = ux;
  const at = (d: number, side = 0): [number, number] => [x0 + ux * d + nx * side, y0 + uy * d + ny * side];
  ctx.lineCap = "round";
  // 금빛 기운
  if (glow > 0) {
    ctx.strokeStyle = `rgba(255, 210, 90, ${0.18 * glow})`;
    ctx.lineWidth = w * 3.2;
    line(ctx, x0, y0, x1, y1);
    ctx.strokeStyle = `rgba(255, 230, 140, ${0.3 * glow})`;
    ctx.lineWidth = w * 1.9;
    line(ctx, x0, y0, x1, y1);
  }
  ctx.lineCap = "butt";
  // 쇠 봉: 테두리 · 바탕 · 그늘 · 빛 줄
  ctx.strokeStyle = "#240407";
  ctx.lineWidth = w + 2;
  line(ctx, x0, y0, x1, y1);
  ctx.strokeStyle = "#8e1418";
  ctx.lineWidth = w;
  line(ctx, x0, y0, x1, y1);
  ctx.strokeStyle = "#560a0e";
  ctx.lineWidth = Math.max(1, w * 0.3);
  line(ctx, ...at(0, w * 0.3), ...at(len, w * 0.3));
  ctx.strokeStyle = "#e24a50";
  ctx.lineWidth = Math.max(1, w * 0.18);
  line(ctx, ...at(0, -w * 0.25), ...at(len, -w * 0.25));
  const cap = Math.min(len * 0.2, Math.max(6, w * 3));
  // 새긴 금 고리 (봉을 따라 일정하게)
  ctx.strokeStyle = "rgba(240, 200, 80, 0.8)";
  ctx.lineWidth = 1;
  const step = Math.max(6, w * 2.2);
  for (let d = cap + step; d < len - cap - 2; d += step) line(ctx, ...at(d, -w / 2), ...at(d, w / 2));
  // 가운데 금 띠
  band(ctx, at, len / 2 - w, len / 2 + w, w);
  // 양 끝 금테 마개 (골 셋) · 빛나는 끝
  band(ctx, at, 0, cap, w * 1.25);
  band(ctx, at, len - cap, len, w * 1.25);
  for (const d of [0, len]) {
    const [cx, cy] = at(d);
    ctx.fillStyle = "#fff6c8";
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1.5, w * 0.45), 0, TAU);
    ctx.fill();
    ctx.fillStyle = `rgba(255, 255, 220, ${0.5 * glow})`;
    ctx.fillRect(cx - w * 1.4, cy - 0.5, w * 2.8, 1);
    ctx.fillRect(cx - 0.5, cy - w * 1.4, 1, w * 2.8);
  }
}

/** 여의봉 굵기: 위험 범위의 굵기를 따르되 너무 뭉툭하지 않게 */
export const staffW = (width?: number) => Math.max(5, Math.min(12, (width ?? 6) * 0.9));
/** 수직 내려찍기 (짧은 세로 줄) · 하늘에서 내려오는 여의봉 길이 */
export const PLUNGE = 230;
export const plunge = (x: number, y: number, tx: number, ty: number) => x === tx && ty > y && ty - y < 100;

/** 금 띠 하나: 바탕 · 빛 · 골 셋 */
function band(ctx: CanvasRenderingContext2D, at: (d: number, side?: number) => [number, number], d0: number, d1: number, w: number): void {
  ctx.strokeStyle = "#2a1a04";
  ctx.lineWidth = w + 2;
  line(ctx, ...at(d0), ...at(d1));
  ctx.strokeStyle = "#e8c040";
  ctx.lineWidth = w;
  line(ctx, ...at(d0), ...at(d1));
  ctx.strokeStyle = "#fff0a0";
  ctx.lineWidth = Math.max(1, w * 0.22);
  line(ctx, ...at(d0, -w * 0.25), ...at(d1, -w * 0.25));
  ctx.strokeStyle = "#8a6010";
  ctx.lineWidth = 1;
  for (let k = 1; k <= 3; k++) {
    const d = d0 + ((d1 - d0) * k) / 4;
    line(ctx, ...at(d, -w / 2), ...at(d, w / 2));
  }
}

export function line(ctx: CanvasRenderingContext2D, x: number, y: number, tx: number, ty: number): void {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(tx, ty);
  ctx.stroke();
}

/** 여의봉이 친 순간: 번쩍이는 여의봉과 속도선 · 돌린 여의봉은 잔상을 남기며 한 바퀴 */
export function drawSageFx(ctx: CanvasRenderingContext2D, fx: EffectState, snap: (v: number) => number): boolean {
  if (fx.kind !== "staff" && fx.kind !== "staffSpin") return false;
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "staff") {
    const tx = snap(fx.toX ?? fx.x);
    const ty = snap(fx.toY ?? fx.y);
    const w = staffW(fx.width);
    if (plunge(x, y, tx, ty)) {
      // 꽂힌 여의봉 · 땅이 갈라지는 섬광
      drawRuyi(ctx, tx, ty - PLUNGE * t, tx, ty, w, 1);
      ctx.fillStyle = `rgba(255, 235, 170, ${0.85 * t})`;
      ctx.beginPath();
      ctx.ellipse(tx, ty, w * (5 - 3 * t), w * (2 - t), 0, 0, TAU);
      ctx.fill();
      return true;
    }
    ctx.globalAlpha = Math.min(1, t * 1.6);
    // 속도선
    const len = Math.hypot(tx - x, ty - y) || 1;
    const nx = -(ty - y) / len;
    const ny = (tx - x) / len;
    ctx.strokeStyle = "rgba(255, 240, 200, 0.7)";
    ctx.lineWidth = 1;
    for (const k of [-1.8, -1.2, 1.2, 1.8]) line(ctx, x + nx * w * k, y + ny * w * k, x + (tx - x) * 0.8 + nx * w * k, y + (ty - y) * 0.8 + ny * w * k);
    drawRuyi(ctx, x, y, tx, ty, w, 1);
    // 끝이 부딪힌 섬광
    ctx.fillStyle = `rgba(255, 245, 200, ${0.8 * t})`;
    ctx.beginPath();
    ctx.arc(tx, ty, w * (2.5 - 1.5 * t), 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    return true;
  }
  // 돌리기: 한 바퀴 돌며 잔상
  const a0 = (1 - t) * TAU;
  const r = fx.size;
  for (let k = 3; k >= 0; k--) {
    const a = a0 - k * 0.35;
    ctx.globalAlpha = t * (k === 0 ? 1 : 0.25 / k);
    drawRuyi(ctx, x - Math.cos(a) * r, y - Math.sin(a) * r, x + Math.cos(a) * r, y + Math.sin(a) * r, 7, k === 0 ? 1 : 0);
  }
  ctx.globalAlpha = t * 0.5;
  ctx.strokeStyle = "#fff0b0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, a0 - 1.2, a0);
  ctx.arc(x, y, r, a0 - 1.2 + Math.PI, a0 + Math.PI);
  ctx.stroke();
  ctx.globalAlpha = 1;
  return true;
}
