// 벚꽃 그리기: 날아가는 벚꽃잎 흩날림(연한 분홍) · 만개(벚꽃 부적 추가 효과: 꽃이 둥글게 피어나고 꽃잎이 흩날림)
import type { EffectState } from "@pixel-rogue/shared";

/** 진한 핫핑크 · 밝은 분홍 · 꽃잎 끝 하이라이트 · 꽃술 */
const PINK = "#ff2d8f";
const LIGHT = "#ff7cbc";
const TIP = "#ffd0e6";
const CORE = "#ffe066";
const FIVE = (Math.PI * 2) / 5;

/** 벚꽃 한 송이: size = 꽃잎 끝까지 거리 (픽셀), turn = 돌아간 각도 */
export function drawSakura(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, turn: number): void {
  const petal = Math.max(2, Math.round(size * 0.55));
  for (let k = 0; k < 5; k++) {
    const a = turn + k * FIVE;
    const cx = Math.cos(a);
    const cy = Math.sin(a);
    // 꽃잎: 안쪽 진한 핫핑크 → 바깥 밝은 분홍, 끝에 하이라이트 한 점
    ctx.fillStyle = PINK;
    ctx.fillRect(Math.round(x + cx * size * 0.45 - petal / 2), Math.round(y + cy * size * 0.45 - petal / 2), petal, petal);
    ctx.fillStyle = LIGHT;
    ctx.fillRect(Math.round(x + cx * size * 0.8 - petal / 2), Math.round(y + cy * size * 0.8 - petal / 2), petal, petal);
    ctx.fillStyle = TIP;
    ctx.fillRect(Math.round(x + cx * size), Math.round(y + cy * size), 1, 1);
  }
  ctx.fillStyle = CORE;
  ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
}

/** 연한 분홍 꽃잎 (날아가는 벚꽃 부적) */
const SOFT = ["#ffc8de", "#ffe0ec", "#fff4f8", "#ffb0cf"];

/** 날아가는 벚꽃 부적: 한 송이 대신 둘레로 꽃잎이 흩날리며 지나감 (r = 퍼지는 반경, seed = 탄마다 다르게) */
export function drawBlossomFlurry(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, tick: number, seed: number): void {
  for (let i = 0; i < 12; i++) {
    const a = i * 2.4 + seed + tick * (0.02 + (i % 3) * 0.01);
    const d = r * (0.35 + ((i * 7 + seed) % 5) * 0.16);
    const px = x + Math.cos(a) * d + Math.sin(tick * 0.08 + i) * 1.5;
    const py = y + Math.sin(a) * d * 0.8 + ((tick * 0.15 + i * 3) % 6) - 3;
    ctx.globalAlpha = 0.55 + 0.45 * Math.abs(Math.sin(tick * 0.05 + i));
    ctx.fillStyle = SOFT[i % SOFT.length]!;
    ctx.fillRect(Math.round(px), Math.round(py), 2, i % 3 === 0 ? 1 : 2);
  }
  ctx.globalAlpha = 1;
}

/** 만개: 가운데 큰 꽃이 피고, 둘레로 여섯 송이가 퍼지며, 꽃잎이 흩날리다 사라짐 */
export function drawBloom(ctx: CanvasRenderingContext2D, fx: EffectState, tick: number): void {
  const life = fx.ticks / fx.maxTicks; // 1 → 0
  const grow = 1 - life; // 0 → 1
  const open = 1 - (1 - grow) * (1 - grow) * (1 - grow); // 빠르게 피었다가 천천히 멈춤
  const r = fx.size;
  ctx.globalAlpha = Math.min(1, life * 2.2);
  // 은은한 분홍 빛
  ctx.fillStyle = "rgba(255, 45, 143, 0.18)";
  ctx.beginPath();
  ctx.arc(fx.x, fx.y, r * open, 0, Math.PI * 2);
  ctx.fill();
  // 흩날리는 꽃잎: 바깥으로 퍼지며 천천히 떨어짐
  for (let i = 0; i < 14; i++) {
    const a = i * 0.45 + (i % 3) * 0.2;
    const d = r * (0.5 + 0.9 * open) * (0.7 + (i % 4) * 0.12);
    const px = fx.x + Math.cos(a) * d + Math.sin(tick * 0.1 + i) * 1.5;
    const py = fx.y + Math.sin(a) * d + grow * 10;
    ctx.fillStyle = i % 2 === 0 ? LIGHT : PINK;
    ctx.fillRect(Math.round(px), Math.round(py), 2, i % 3 === 0 ? 1 : 2);
  }
  // 둘레 여섯 송이
  for (let i = 0; i < 6; i++) {
    const a = i * (Math.PI / 3) + grow * 0.6;
    drawSakura(ctx, fx.x + Math.cos(a) * r * 0.7 * open, fx.y + Math.sin(a) * r * 0.7 * open, 2 + 3 * open, a + tick * 0.04);
  }
  // 가운데 큰 꽃
  drawSakura(ctx, fx.x, fx.y, 3 + 6 * open, tick * 0.03);
  ctx.globalAlpha = 1;
}
