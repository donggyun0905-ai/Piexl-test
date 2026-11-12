// 매드퀸 그림 공용: 무기 그림(sprites/madQueen_arms: 줄 0 대포 · 1 터렛 · 2 날개 / 칸 = 함대 빛깔) · 빛깔 · 포탄 구슬
// 원본 그림은 모두 왼쪽을 봄 → 오른쪽을 볼 때는 뒤집어 그림 (scripts/art/madqueen_arms.py)
import { alpha, glow, type Ctx } from "./pwFxBits";
import { lazyImg } from "../lazyImage";

const CELL = 64;
const sheet = lazyImg(`${import.meta.env.BASE_URL}sprites/madQueen_arms.png`);

/** 함대 빛깔: 하늘 · 빨강 · 노랑 · 초록 (그림의 빛나는 부분과 같은 색) · 흰 거품 */
export const MQ_COLORS = ["#5af0ff", "#ff4a5a", "#ffe04a", "#5aff7a"] as const;
export const MQ_FOAM = "#f0fcff";
export const mqColor = (style?: number) => MQ_COLORS[style ?? 0] ?? MQ_COLORS[0];

/** 무기 그림 하나: row 0 대포 · 1 터렛 · 2 날개 · color 빛깔 · 가운데 x,y · 폭 size · ang 포구 방향 (tilt: false면 돌리지 않고 왼·오만 뒤집음) */
export function armSprite(ctx: Ctx, row: number, color: number, x: number, y: number, size: number, ang: number, tilt = true, a = 1): void {
  if (!sheet.complete || sheet.naturalWidth === 0 || a <= 0) return;
  const right = Math.cos(ang) >= 0;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(x, y);
  if (right) ctx.scale(-1, 1);
  if (tilt) ctx.rotate(right ? -ang : ang - Math.PI);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(sheet, color * CELL, row * CELL, CELL, CELL, -size / 2, -size / 2, size, size);
  ctx.restore();
}

/** 포탄 구슬: 빛깔 빛 + 흰 속 + 지나온 꼬리 (dx,dy 날아가는 쪽) */
export function shellOrb(ctx: Ctx, x: number, y: number, r: number, c: string, dx: number, dy: number, a = 1): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const tail = r * 4;
  const g = ctx.createLinearGradient(x, y, x - dx * tail, y - dy * tail);
  g.addColorStop(0, alpha(c, 0.75 * a));
  g.addColorStop(1, alpha(c, 0));
  ctx.strokeStyle = g;
  ctx.lineWidth = r * 1.6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - dx * tail, y - dy * tail);
  ctx.stroke();
  glow(ctx, x, y, r * 2.6, c, 0.8 * a, 1.2);
  ctx.fillStyle = `rgba(255,255,255,${0.95 * a})`;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(1, r * 0.55), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
