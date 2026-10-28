// 패왕전 스킬 그림 도우미 (pwSkillFx가 씀): 고정 난수 · 고리 · 빛 · 예고 · 부채꼴 · 줄 띠
import type { EffectState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;

/** 꾸밈용 고정 난수 (같은 효과는 늘 같은 모양) */
export const rnd = (a: number, b: number) => {
  const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

export function ring(ctx: Ctx, x: number, y: number, r: number, color: string, w: number): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
  ctx.stroke();
}

export function glow(ctx: Ctx, x: number, y: number, r: number, color: string, a: number): void {
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, r));
  g.addColorStop(0, `${color}${Math.round(a * 255).toString(16).padStart(2, "0")}`);
  g.addColorStop(1, `${color}00`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(1, r), 0, Math.PI * 2);
  ctx.fill();
}

/** 예고: 범위가 안쪽부터 차오름 (다 차면 터짐) */
export function warn(ctx: Ctx, fx: EffectState, c: string, f: number): void {
  ctx.globalAlpha = 0.25 + f * 0.35;
  if (fx.toX !== undefined && fx.toY !== undefined) {
    ctx.strokeStyle = c;
    ctx.lineCap = "round";
    ctx.lineWidth = fx.size * 2;
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.moveTo(fx.x, fx.y);
    ctx.lineTo(fx.toX, fx.toY);
    ctx.stroke();
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = fx.size * 2 * f;
    ctx.beginPath();
    ctx.moveTo(fx.x, fx.y);
    ctx.lineTo(fx.x + (fx.toX - fx.x) * f, fx.y + (fx.toY - fx.y) * f);
    ctx.stroke();
    ctx.lineCap = "butt";
  } else {
    ctx.fillStyle = c;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(fx.x, fx.y, fx.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(fx.x, fx.y, fx.size * f, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.9;
    ring(ctx, fx.x, fx.y, fx.size, c, 1.5);
  }
  ctx.globalAlpha = 1;
  ctx.lineWidth = 1;
}


/** 부채꼴 빛 */
export function cone(ctx: Ctx, x: number, y: number, a: number, arc: number, r: number, c: string, t: number): void {
  ctx.globalAlpha = 0.5 * t;
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, r, a - arc, a + arc);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = t;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r, a - arc, a + arc);
  ctx.stroke();
}

/** 줄을 따라 퍼지는 빛 띠 + 앞으로 달려가는 밝은 머리 */
export function lineBand(ctx: Ctx, x: number, y: number, tx: number, ty: number, r: number, c: string, t: number, f: number): void {
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.35 * t;
  ctx.strokeStyle = c;
  ctx.lineWidth = r * 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  const hx = x + (tx - x) * Math.min(1, f * 1.4);
  const hy = y + (ty - y) * Math.min(1, f * 1.4);
  ctx.globalAlpha = t;
  ctx.lineWidth = Math.max(2, r * 0.8);
  ctx.beginPath();
  ctx.moveTo(x + (hx - x) * 0.6, y + (hy - y) * 0.6);
  ctx.lineTo(hx, hy);
  ctx.stroke();
  glow(ctx, hx, hy, r * 1.4, c, 0.8 * t);
  ctx.lineCap = "butt";
  ctx.lineWidth = 1;
}
