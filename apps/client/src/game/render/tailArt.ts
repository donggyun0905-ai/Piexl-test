// 테일 효과 그림 조각: 굵은 물 꼬리(밑동이 두껍고 끝이 가는 상어 꼬리 + 초승달 꼬리지느러미) · 물기둥 · 왕관 물보라 · 바깥으로 튀는 물살
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";
import { glint } from "./seaLight";
import { AQUA, FOAM, WATER } from "./tailShark";

const DEEP = "#0b4f86";

/** 밑동(x, y)에서 ang 쪽으로 len 길이 꼬리의 가운데 줄 (bend: 휘는 정도, 휘두르는 반대쪽으로) */
function spine(x: number, y: number, ang: number, len: number, bend: number): [number, number, number][] {
  const cx = x + Math.cos(ang - bend) * len * 0.55;
  const cy = y + Math.sin(ang - bend) * len * 0.55;
  const ex = x + Math.cos(ang) * len;
  const ey = y + Math.sin(ang) * len;
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 12; i++) {
    const u = i / 12;
    const px = (1 - u) ** 2 * x + 2 * (1 - u) * u * cx + u * u * ex;
    const py = (1 - u) ** 2 * y + 2 * (1 - u) * u * cy + u * u * ey;
    pts.push([px, py, u]);
  }
  return pts;
}

/** 가운데 줄을 따라 너비 w(u)로 칠할 길 (side: 가운데에서 옆으로 옮김, -1 ~ 1) */
function band(ctx: Ctx, pts: [number, number, number][], w: (u: number) => number, side = 0): void {
  const nrm = (i: number): [number, number] => {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(pts.length - 1, i + 1)]!;
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
  };
  ctx.beginPath();
  pts.forEach(([px, py, u], i) => {
    const [nx, ny] = nrm(i);
    const ww = w(u);
    ctx.lineTo(px + nx * ww * (1 + side), py + ny * ww * (1 + side));
  });
  for (let i = pts.length - 1; i >= 0; i--) {
    const [px, py, u] = pts[i]!;
    const [nx, ny] = nrm(i);
    const ww = w(u);
    ctx.lineTo(px - nx * ww * (1 - side), py - ny * ww * (1 - side));
  }
  ctx.closePath();
}

/** 굵은 물 꼬리: 내 쪽(밑동)은 두껍고 끝으로 갈수록 가늘어짐 · 짙은 등 · 밝은 물빛 몸 · 흰 배 줄 · 끝에 초승달 꼬리지느러미 */
export function tailShape(ctx: Ctx, x: number, y: number, ang: number, len: number, a: number, bend = 0.3, thick = 1): void {
  if (a <= 0.02) return;
  const pts = spine(x, y, ang, len, bend);
  const w = (u: number) => (7.5 * (1 - u) ** 0.85 + 1.3) * thick;
  ctx.save();
  ctx.globalAlpha *= a;
  // 물빛 번짐
  additive(ctx, () => {
    ctx.fillStyle = alpha(AQUA, 0.35);
    band(ctx, pts, (u) => w(u) * 1.7);
    ctx.fill();
  });
  ctx.fillStyle = DEEP;
  band(ctx, pts, (u) => w(u) * 1.12);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, w(0) * 1.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = WATER;
  band(ctx, pts, w);
  ctx.fill();
  // 밑동은 둥글게 (몸에 붙은 쪽)
  ctx.beginPath();
  ctx.arc(x, y, w(0), 0, Math.PI * 2);
  ctx.fill();
  // 배 쪽 흰 줄 · 등 쪽 반짝임
  ctx.fillStyle = alpha(FOAM, 0.75);
  band(ctx, pts, (u) => w(u) * 0.28, 1.6);
  ctx.fill();
  ctx.fillStyle = alpha("#c8faff", 0.6);
  band(ctx, pts, (u) => w(u) * 0.14, -2.2);
  ctx.fill();
  // 꼬리지느러미: 위 갈래가 큰 상어 꼬리 (끝 방향 기준 양옆으로)
  const [ex, ey] = pts[pts.length - 1]!;
  const [px, py] = pts[pts.length - 3]!;
  const ta = Math.atan2(ey - py, ex - px);
  const n = ta + Math.PI / 2;
  const at = (fw: number, side: number): [number, number] => [ex + Math.cos(ta) * fw + Math.cos(n) * side, ey + Math.sin(ta) * fw + Math.sin(n) * side];
  const s = 1.15 * thick;
  ctx.fillStyle = WATER;
  ctx.strokeStyle = alpha(AQUA, 0.95);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(...at(-3 * s, 0));
  ctx.quadraticCurveTo(...at(2 * s, 8 * s), ...at(10 * s, 14 * s));
  ctx.quadraticCurveTo(...at(4 * s, 5 * s), ...at(5 * s, 0));
  ctx.quadraticCurveTo(...at(3 * s, -4 * s), ...at(7 * s, -9 * s));
  ctx.quadraticCurveTo(...at(1 * s, -6 * s), ...at(-3 * s, 0));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = alpha(FOAM, 0.75);
  ctx.beginPath();
  ctx.moveTo(...at(0, 1 * s));
  ctx.quadraticCurveTo(...at(4 * s, 7 * s), ...at(9 * s, 12 * s));
  ctx.quadraticCurveTo(...at(3 * s, 4 * s), ...at(0, 1 * s));
  ctx.fill();
  ctx.restore();
  glint(ctx, ex, ey, 3 * a, FOAM, a);
}

/** 꼬리 끝에서 떨어지는 물방울 (가운데 x·y, 퍼짐 r, 진행 f) */
export function shed(ctx: Ctx, x: number, y: number, ang: number, len: number, f: number, seed: number, a: number): void {
  for (let i = 0; i < 6; i++) {
    const u = 0.45 + rnd(seed, i) * 0.55;
    const d = len * u;
    const off = (rnd(i, seed) - 0.5) * 10 + f * 8 * (i % 2 ? 1 : -1);
    const px = x + Math.cos(ang) * d + Math.cos(ang + Math.PI / 2) * off;
    const py = y + Math.sin(ang) * d + Math.sin(ang + Math.PI / 2) * off + f * 6;
    ctx.fillStyle = alpha(i % 2 ? FOAM : AQUA, a * (1 - f));
    ctx.fillRect(Math.round(px), Math.round(py), i % 3 ? 1 : 2, i % 3 ? 2 : 2);
  }
}

/** 솟구치는 물기둥 (아래에서 위로, 높이 h): 바깥 물빛 · 안쪽 밝은 심 · 꼭대기 거품 */
export function geyser(ctx: Ctx, x: number, y: number, w: number, h: number, a: number, seed = 0): void {
  if (a <= 0.02 || h < 1) return;
  const column = (ww: number) => {
    ctx.beginPath();
    ctx.moveTo(x - ww, y);
    ctx.quadraticCurveTo(x - ww * 0.45, y - h * 0.6, x - ww * 0.2, y - h);
    ctx.lineTo(x + ww * 0.2, y - h);
    ctx.quadraticCurveTo(x + ww * 0.45, y - h * 0.6, x + ww, y);
    ctx.closePath();
  };
  additive(ctx, () => {
    const g = ctx.createLinearGradient(x, y, x, y - h);
    g.addColorStop(0, alpha(WATER, 0.8 * a));
    g.addColorStop(0.6, alpha(AQUA, 0.55 * a));
    g.addColorStop(1, alpha(FOAM, 0.1 * a));
    ctx.fillStyle = g;
    column(w);
    ctx.fill();
    const c = ctx.createLinearGradient(x, y, x, y - h);
    c.addColorStop(0, alpha(FOAM, 0.6 * a));
    c.addColorStop(1, alpha(FOAM, 0));
    ctx.fillStyle = c;
    column(w * 0.3);
    ctx.fill();
    glow(ctx, x, y - h, w * 0.9, AQUA, 0.6 * a, 0.8);
  });
  // 꼭대기 거품 덩어리
  for (let i = 0; i < 6; i++) {
    const px = x + (rnd(seed, i) - 0.5) * w * 0.9;
    const py = y - h - rnd(i, seed) * w * 0.5;
    ctx.fillStyle = alpha(i % 2 ? FOAM : AQUA, a);
    ctx.beginPath();
    ctx.arc(px, py, 1 + rnd(i, 4) * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** 왕관 물보라: 둥글게 솟는 물 기둥들 끝에 물방울 (크기 r, 진행 f) */
export function crown(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, n = 11, aqua = AQUA, foam = FOAM): void {
  const up = Math.sin(Math.min(1, f * 1.5) * Math.PI);
  if (up <= 0.02) return;
  ctx.lineCap = "round";
  for (let i = 0; i < n; i++) {
    const a = -Math.PI + (i / (n - 1)) * Math.PI;
    const bx = x + Math.cos(a) * r * 0.45;
    const tx = x + Math.cos(a) * r * (0.7 + f * 0.6);
    const h = r * (0.6 + rnd(seed, i) * 0.7) * up;
    ctx.strokeStyle = alpha(i % 2 ? foam : aqua, 0.9 * (1 - f));
    ctx.lineWidth = 2.2 - f;
    ctx.beginPath();
    ctx.moveTo(bx, y);
    ctx.quadraticCurveTo((bx + tx) / 2, y - h * 1.1, tx, y - h);
    ctx.stroke();
    ctx.fillStyle = alpha(foam, 1 - f);
    ctx.beginPath();
    ctx.arc(tx, y - h - 1, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.lineCap = "butt";
}

/** 휘두른 자리 바깥으로 튀어 나가는 물살 줄 (from → at 사이, 반지름 reach) */
export function spray(ctx: Ctx, x: number, y: number, from: number, at: number, reach: number, f: number, seed: number, a: number): void {
  ctx.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const u = rnd(seed, i);
    const ang = from + (at - from) * u;
    const d0 = reach * (0.95 + f * 0.25);
    const d1 = d0 + 5 + rnd(i, seed) * 8;
    ctx.strokeStyle = alpha(i % 3 ? AQUA : FOAM, a * (1 - f) * (0.4 + u * 0.6));
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(ang) * d0, y + Math.sin(ang) * d0);
    ctx.lineTo(x + Math.cos(ang) * d1, y + Math.sin(ang) * d1);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
}
