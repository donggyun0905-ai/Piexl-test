// 패왕전 스킬 그림 도우미 (pwSkillFx·pwFxShapes가 씀): 고정 난수 · 색 투명도 · 겹치면 밝아지는 빛 · 충격파 · 불똥 · 바닥 문양 · 빛줄기 · 초승달 · 예고
import type { EffectState } from "@pixel-rogue/shared";

export type Ctx = CanvasRenderingContext2D;

/** 꾸밈용 고정 난수 (같은 효과는 늘 같은 모양) */
export const rnd = (a: number, b: number) => {
  const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

/** #rrggbb + 투명도 (0~1) */
export const alpha = (c: string, a: number) => `${c.slice(0, 7)}${Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0")}`;
/** 빨리 커졌다 천천히 (0~1) */
export const easeOut = (f: number) => 1 - (1 - f) ** 3;

/** 겹치면 밝아지는 칠하기 (fn 동안만) */
export function additive(ctx: Ctx, fn: () => void): void {
  const before = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter";
  fn();
  ctx.globalCompositeOperation = before;
}

export function ring(ctx: Ctx, x: number, y: number, r: number, color: string, w: number): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
  ctx.stroke();
}

/** 부드러운 빛 (가운데가 밝음, white: 가운데 흰 빛) */
export function glow(ctx: Ctx, x: number, y: number, r: number, color: string, a0: number, white = 0): void {
  // 큰 빛은 덜 진하게 (겹쳐 하얗게 타 버리지 않게)
  const a = a0 * Math.min(1, Math.max(0.35, 34 / Math.max(1, r)));
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, r));
  if (white > 0) g.addColorStop(0, `rgba(255,255,255,${Math.min(1, a * white)})`);
  g.addColorStop(white > 0 ? 0.25 : 0, alpha(color, a));
  g.addColorStop(1, alpha(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(1, r), 0, Math.PI * 2);
  ctx.fill();
}

/** 충격파: 안쪽은 흐리고 바깥 가장자리가 밝은 고리 */
export function shock(ctx: Ctx, x: number, y: number, r: number, color: string, a: number, width: number): void {
  if (r <= 1) return;
  const inner = Math.max(0, r - width);
  const g = ctx.createRadialGradient(x, y, inner, x, y, r);
  g.addColorStop(0, alpha(color, 0));
  g.addColorStop(0.7, alpha(color, a * 0.6));
  g.addColorStop(0.92, `rgba(255,255,255,${a})`);
  g.addColorStop(1, alpha(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x, y, inner, 0, Math.PI * 2, true);
  ctx.fill();
}

/** 불똥: 가운데서 튀어 나가며 꼬리를 남김 (n개, 퍼진 거리 d) */
export function sparks(ctx: Ctx, x: number, y: number, n: number, d: number, f: number, color: string, seed: number, a = 1): void {
  ctx.lineCap = "round";
  for (let k = 0; k < n; k++) {
    const ang = rnd(seed, k) * Math.PI * 2;
    const far = d * (0.5 + rnd(k, seed) * 0.6) * easeOut(f);
    const tail = Math.max(2, d * 0.25 * (1 - f));
    const cx = Math.cos(ang);
    const cy = Math.sin(ang);
    ctx.strokeStyle = k % 3 === 0 ? `rgba(255,255,255,${a * (1 - f)})` : alpha(color, a * (1 - f));
    ctx.lineWidth = k % 3 === 0 ? 1.5 : 1;
    ctx.beginPath();
    ctx.moveTo(x + cx * Math.max(0, far - tail), y + cy * Math.max(0, far - tail));
    ctx.lineTo(x + cx * far, y + cy * far);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
}

/** 바닥 문양: 두 겹 원 + 도는 눈금·별 모양 (spin: 돌아간 각) */
export function rune(ctx: Ctx, x: number, y: number, r: number, color: string, a: number, spin: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.55);
  ctx.globalAlpha *= a;
  ring(ctx, 0, 0, r, color, 1.5);
  ring(ctx, 0, 0, r * 0.78, alpha(color, 0.7), 1);
  ctx.rotate(spin);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let k = 0; k < 5; k++) {
    const a1 = (k / 5) * Math.PI * 2;
    const a2 = ((k + 2) / 5) * Math.PI * 2;
    ctx.moveTo(Math.cos(a1) * r * 0.78, Math.sin(a1) * r * 0.78);
    ctx.lineTo(Math.cos(a2) * r * 0.78, Math.sin(a2) * r * 0.78);
  }
  for (let k = 0; k < 16; k++) {
    const aa = (k / 16) * Math.PI * 2;
    ctx.moveTo(Math.cos(aa) * r * 0.86, Math.sin(aa) * r * 0.86);
    ctx.lineTo(Math.cos(aa) * r * 0.95, Math.sin(aa) * r * 0.95);
  }
  ctx.stroke();
  ctx.restore();
}

/** 빛줄기: 바깥 빛 · 색 · 흰 속 (w: 굵기) */
export function beam(ctx: Ctx, x: number, y: number, tx: number, ty: number, w: number, color: string, a: number): void {
  ctx.lineCap = "round";
  for (const [col, ww] of [[alpha(color, a * 0.25), w * 2.4], [alpha(color, a * 0.85), w], [`rgba(255,255,255,${a})`, Math.max(1, w * 0.35)]] as const) {
    ctx.strokeStyle = col;
    ctx.lineWidth = ww;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
}

/** 초승달 베기: 가운데가 두껍고 끝이 가는 칼자국 (a: 방향, arc: 반각) */
export function crescent(ctx: Ctx, x: number, y: number, r: number, a: number, arc: number, thick: number, color: string, al: number): void {
  const steps = 18;
  ctx.beginPath();
  for (let k = 0; k <= steps; k++) {
    const u = k / steps;
    const ang = a - arc + u * arc * 2;
    ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r);
  }
  for (let k = steps; k >= 0; k--) {
    const u = k / steps;
    const ang = a - arc + u * arc * 2;
    const rr = r - thick * Math.sin(u * Math.PI);
    ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr);
  }
  ctx.closePath();
  const g = ctx.createRadialGradient(x, y, Math.max(0, r - thick), x, y, r);
  g.addColorStop(0, alpha(color, 0));
  g.addColorStop(0.6, alpha(color, al));
  g.addColorStop(1, `rgba(255,255,255,${al})`);
  ctx.fillStyle = g;
  ctx.fill();
}

/** 예고: 또렷한 테두리 + 안쪽부터 차오르는 칠 + 다 차기 직전 깜빡임 (부채꼴·줄·원) */
export function warn(ctx: Ctx, fx: EffectState, c: string, f: number): void {
  const flash = f > 0.85 ? 0.5 + 0.5 * Math.sin(f * 60) : 0;
  ctx.save();
  if (fx.toX !== undefined && fx.toY !== undefined) {
    const len = Math.hypot(fx.toX - fx.x, fx.toY - fx.y);
    ctx.translate(fx.x, fx.y);
    ctx.rotate(Math.atan2(fx.toY - fx.y, fx.toX - fx.x));
    const w = fx.size * 2;
    ctx.fillStyle = alpha(c, 0.12);
    ctx.fillRect(0, -w / 2, len, w);
    ctx.fillStyle = alpha(c, 0.28 + flash * 0.3);
    ctx.fillRect(0, -w / 2, len * f, w);
    ctx.strokeStyle = alpha(c, 0.9);
    ctx.lineWidth = 1;
    ctx.strokeRect(0, -w / 2, len, w);
    // 앞으로 흐르는 화살 무늬
    ctx.strokeStyle = `rgba(255,255,255,${0.35 + flash * 0.5})`;
    const step = Math.max(10, w * 1.2);
    ctx.beginPath();
    for (let d = ((f * 40) % step); d < len - 2; d += step) {
      ctx.moveTo(d, -w * 0.3);
      ctx.lineTo(d + w * 0.3, 0);
      ctx.lineTo(d, w * 0.3);
    }
    ctx.stroke();
  } else {
    const r = fx.size;
    // 가장자리가 진한 바닥 · 안쪽부터 차오르는 빛 · 도는 점선 · 네 방향 눈금
    const g = ctx.createRadialGradient(fx.x, fx.y, r * 0.5, fx.x, fx.y, r);
    g.addColorStop(0, alpha(c, 0.06));
    g.addColorStop(1, alpha(c, 0.28 + flash * 0.2));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(fx.x, fx.y, r, 0, Math.PI * 2);
    ctx.fill();
    glow(ctx, fx.x, fx.y, r * f, c, 0.3 + flash * 0.3);
    ring(ctx, fx.x, fx.y, r, alpha(c, 0.95), 1.5);
    ctx.setLineDash([3, 4]);
    ctx.lineDashOffset = -f * 30;
    ring(ctx, fx.x, fx.y, r * 0.8, alpha(c, 0.6), 1);
    ctx.setLineDash([]);
    ring(ctx, fx.x, fx.y, Math.max(1, r * f), `rgba(255,255,255,${0.45 + flash * 0.55})`, 1.2);
    ctx.strokeStyle = alpha(c, 0.9);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let k = 0; k < 4; k++) {
      const aa = (k / 4) * Math.PI * 2 + Math.PI / 4;
      ctx.moveTo(fx.x + Math.cos(aa) * r * 1.02, fx.y + Math.sin(aa) * r * 1.02);
      ctx.lineTo(fx.x + Math.cos(aa) * r * 1.16, fx.y + Math.sin(aa) * r * 1.16);
    }
    ctx.stroke();
  }
  ctx.restore();
}

/** 부채꼴: 바깥 가장자리가 밝은 부채 (r: 반경) */
export function cone(ctx: Ctx, x: number, y: number, a: number, arc: number, r: number, c: string, t: number): void {
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, r));
  g.addColorStop(0, alpha(c, 0));
  g.addColorStop(0.7, alpha(c, 0.35 * t));
  g.addColorStop(1, alpha(c, 0.85 * t));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, r, a - arc, a + arc);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = `rgba(255,255,255,${t})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r, a - arc, a + arc);
  ctx.stroke();
}

/** 줄 모양 스킬: 빛나는 머리가 줄을 따라 날아가고 꼬리를 남김 */
export function lineBand(ctx: Ctx, x: number, y: number, tx: number, ty: number, r: number, c: string, t: number, f: number): void {
  const head = easeOut(Math.min(1, f * 1.3));
  const hx = x + (tx - x) * head;
  const hy = y + (ty - y) * head;
  const tail = Math.max(0, head - 0.35);
  beam(ctx, x + (tx - x) * tail, y + (ty - y) * tail, hx, hy, Math.max(2, r * 0.9) * t, c, t);
  glow(ctx, hx, hy, r * 2.2, c, 0.9 * t, 1.2);
}
