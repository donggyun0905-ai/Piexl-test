// 이클립스 그리기 도우미: 색 · 태양 직각 검격(붉은 속·노란 겉) · 일식 초승달 띠(검보라 속·분홍 보라 겉 + 잿빛 연기) · 블랙홀 · 불꽃 혀 · 연기
import type { PlayerState } from "@pixel-rogue/shared";
import { ECLIPSE } from "@pixel-rogue/shared";
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";

export const TAU = Math.PI * 2;
/** 태양: 노란 겉 · 주황 · 붉은 속 · 흰 빛 */
export const S_GOLD = "#ffd24a";
export const S_AMBER = "#ff9a1a";
export const S_RED = "#e8280e";
export const S_CORE = "#8a0a06";
export const S_WHITE = "#fff6c8";
/** 일식: 검정에 가까운 검보라 속 · 보라 · 분홍 보라 겉 · 잿빛 연기 */
export const N_VOID = "#12041c";
export const N_DEEP = "#3a0a5a";
export const N_VIO = "#9a2ae8";
export const N_PINK = "#ff5af0";
export const N_LIGHT = "#ffc8ff";
export const SMOKE = "#5a5560";

/** 일식 낙하로 몸이 뜨는 높이 (뛰어올라 잠깐 머물다 내리꽂힘) */
export function eclipseLift(p: PlayerState): number {
  if (!p.ecAir) return 0;
  const u = 1 - p.ecAir / ECLIPSE.jumpTicks;
  return u < 0.6 ? 38 * (1 - (1 - u / 0.6) ** 3) : 38 * (1 - ((u - 0.6) / 0.4) ** 3);
}

/** 한쪽 팔: 꼭짓점(vx,vy)에서 ang 쪽으로 길이 len, 꼭짓점에서 두께 thick → 끝은 바늘처럼 */
function arm(ctx: Ctx, vx: number, vy: number, ang: number, len: number, thick: number): void {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const nx = -s;
  const ny = c;
  ctx.moveTo(vx + nx * thick, vy + ny * thick);
  ctx.lineTo(vx + c * len * 0.55 + nx * thick * 0.55, vy + s * len * 0.55 + ny * thick * 0.55);
  ctx.lineTo(vx + c * len, vy + s * len);
  ctx.lineTo(vx + c * len * 0.55 - nx * thick * 0.35, vy + s * len * 0.55 - ny * thick * 0.35);
  ctx.lineTo(vx - nx * thick * 0.6, vy - ny * thick * 0.6);
  ctx.closePath();
}

/**
 * 직각 검격: 꼭짓점(x,y)이 a 쪽을 향한 'ㄱ'자 날 두 개(사이 90도) · 겉은 노란 빛, 속은 붉은 날
 * len: 팔 길이 · thick: 꼭짓점 두께 · tilt: 비대칭으로 비튼 각 · fade: 투명도
 */
export function chevron(ctx: Ctx, x: number, y: number, a: number, len: number, thick: number, tilt: number, fade: number): void {
  if (fade <= 0) return;
  const back = a + Math.PI;
  const arms = [back - Math.PI / 4 + tilt, back + Math.PI / 4 + tilt];
  const lens = [len * (1 + tilt * 0.8), len * (1 - tilt * 0.8)];
  const layer = (w: number, l: number, fill: string) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    arms.forEach((ang, i) => arm(ctx, x, y, ang, lens[i]! * l, thick * w));
    ctx.fill();
  };
  additive(ctx, () => {
    glow(ctx, x - Math.cos(a) * len * 0.3, y - Math.sin(a) * len * 0.3, len * 0.9, S_AMBER, 0.45 * fade);
    layer(2.1, 1.12, alpha(S_GOLD, 0.55 * fade));
  });
  layer(1.45, 1.04, alpha(S_GOLD, 0.95 * fade));
  layer(0.95, 0.9, alpha(S_RED, 0.95 * fade));
  layer(0.45, 0.7, alpha(S_CORE, 0.85 * fade));
  // 꼭짓점에서 번쩍
  additive(ctx, () => glow(ctx, x, y, thick * 2.4, S_WHITE, 0.8 * fade, 1));
}

/** 초승달 띠 (가운데가 두껍고 양 끝이 가늘어짐 · sy: 세로 눌림) */
export function band(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, thick: number, sy = 1): void {
  const steps = 18;
  ctx.beginPath();
  for (let k = 0; k <= steps; k++) {
    const ang = a0 + ((a1 - a0) * k) / steps;
    ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r * sy);
  }
  for (let k = steps; k >= 0; k--) {
    const u = k / steps;
    const ang = a0 + (a1 - a0) * u;
    const rr = r - thick * Math.sin(u * Math.PI);
    ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr * sy);
  }
  ctx.closePath();
  ctx.fill();
}

/** 잿빛 연기 뭉치 (n개, 둘레 d, f: 진행) */
export function smoke(ctx: Ctx, x: number, y: number, n: number, d: number, f: number, seed: number, a = 1): void {
  for (let k = 0; k < n; k++) {
    const ang = rnd(seed, k) * TAU;
    const far = d * (0.4 + rnd(k, seed) * 0.7) * (0.6 + f * 0.6);
    const r = (2 + rnd(seed + 3, k) * 4) * (0.7 + f);
    ctx.fillStyle = alpha(k % 3 ? SMOKE : "#2a2530", 0.5 * a * (1 - f));
    ctx.beginPath();
    ctx.arc(x + Math.cos(ang) * far, y + Math.sin(ang) * far * 0.6 - f * 4, r, 0, TAU);
    ctx.fill();
  }
}

/**
 * 일식 초승달 참격: (x,y) 둘레 반지름 r, a0~a1을 sweep만큼 · 바깥 잿빛 연기 → 분홍 보라 빛 → 보라 → 검보라 속
 * (참고 그림처럼 겉은 분홍빛 보라, 안쪽은 거의 검정)
 */
export function voidArc(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, thick: number, fade: number, sy = 1): void {
  if (fade <= 0) return;
  ctx.fillStyle = alpha(SMOKE, 0.4 * fade);
  band(ctx, x, y, r * 1.14, a0 - 0.08, a1 + 0.08, thick * 1.9, sy);
  additive(ctx, () => {
    ctx.fillStyle = alpha(N_PINK, 0.5 * fade);
    band(ctx, x, y, r * 1.06, a0 - 0.03, a1 + 0.03, thick * 1.55, sy);
  });
  ctx.fillStyle = alpha(N_PINK, 0.95 * fade);
  band(ctx, x, y, r, a0, a1, thick * 1.2, sy);
  ctx.fillStyle = alpha(N_VIO, 0.95 * fade);
  band(ctx, x, y, r * 0.97, a0 + 0.04, a1 - 0.04, thick * 0.95, sy);
  ctx.fillStyle = alpha(N_VOID, 0.95 * fade);
  band(ctx, x, y, r * 0.93, a0 + 0.1, a1 - 0.1, thick * 0.6, sy);
  // 날 끝 하얀 분홍 줄
  ctx.fillStyle = alpha(N_LIGHT, 0.9 * fade);
  band(ctx, x, y, r * 1.0, a0 + 0.05, a1 - 0.05, Math.max(0.8, thick * 0.16), sy);
}

/** 블랙홀: 검은 원 · 분홍 테 · 비스듬히 도는 강착 고리 · 빨려 드는 빛 가루 (r: 반지름, life: 0~1 남은 비율) */
export function blackHole(ctx: Ctx, x: number, y: number, r: number, pull: number, life: number, tick: number, seed: number): void {
  const grow = Math.min(1, (1 - life) * 6);
  const end = Math.min(1, life * 5);
  const k = grow * end;
  if (k <= 0) return;
  const R = r * 0.34 * k;
  // 끌어당기는 둘레: 바닥에 희미하게 도는 소용돌이 줄
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.55);
  for (let i = 0; i < 6; i++) {
    const a0 = tick * 0.05 + (i / 6) * TAU;
    ctx.strokeStyle = alpha(i % 2 ? N_VIO : N_PINK, 0.28 * k);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let t = 0; t <= 1; t += 0.1) {
      const rr = pull * (1 - t * 0.8);
      ctx.lineTo(Math.cos(a0 + t * 2.4) * rr, Math.sin(a0 + t * 2.4) * rr);
    }
    ctx.stroke();
  }
  ctx.restore();
  // 빨려 드는 가루
  for (let i = 0; i < 14; i++) {
    const u = (tick * 0.025 + rnd(seed, i)) % 1;
    const ang = rnd(i, seed) * TAU + u * 3;
    const d = pull * (1 - u) * 0.9 + R;
    ctx.fillStyle = alpha(i % 3 ? N_PINK : N_LIGHT, k * u);
    ctx.fillRect(x + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.55 - 4, 1.5, 1.5);
  }
  const cy = y - 6;
  additive(ctx, () => glow(ctx, x, cy, R * 2.6, N_VIO, 0.7 * k));
  // 뒤쪽 강착 고리 → 검은 구 → 앞쪽 고리 (비스듬히 기울어 돌아감)
  const tilt = -0.42;
  const ringBand = (from: number, to: number) => {
    ctx.save();
    ctx.translate(x, cy);
    ctx.rotate(tilt);
    ctx.scale(1, 0.28);
    additive(ctx, () => {
      ctx.fillStyle = alpha(N_PINK, 0.85 * k);
      band(ctx, 0, 0, R * 2.2, from, to, R * 0.55);
      ctx.fillStyle = alpha(N_LIGHT, 0.9 * k);
      band(ctx, 0, 0, R * 2.05, from, to, R * 0.18);
    });
    ctx.restore();
  };
  ringBand(Math.PI, TAU);
  ctx.fillStyle = alpha(N_PINK, 0.95 * k);
  ctx.beginPath();
  ctx.arc(x, cy, R * 1.12, 0, TAU);
  ctx.fill();
  ctx.fillStyle = alpha("#000000", k);
  ctx.beginPath();
  ctx.arc(x, cy, R, 0, TAU);
  ctx.fill();
  ringBand(0, Math.PI);
  // 테두리에서 튀는 번개 줄
  ctx.strokeStyle = alpha(N_PINK, 0.8 * k);
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    if (rnd(seed + i, Math.floor(tick / 4)) < 0.5) continue;
    const ang = rnd(Math.floor(tick / 4), i + seed) * TAU;
    let px = x + Math.cos(ang) * R * 1.2;
    let py = cy + Math.sin(ang) * R * 1.2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    for (let j = 0; j < 3; j++) {
      px += Math.cos(ang) * 4 + (rnd(i, j + tick) - 0.5) * 5;
      py += Math.sin(ang) * 4 + (rnd(j, i + tick) - 0.5) * 5;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
}

/** 불꽃 혀: (x,y) 바닥에서 위로 일렁이는 불 한 가닥 (h: 높이, night: 보라 불) */
export function flameTongue(ctx: Ctx, x: number, y: number, h: number, w: number, sway: number, a: number, night: boolean): void {
  if (a <= 0 || h <= 0) return;
  const g = ctx.createLinearGradient(0, y, 0, y - h);
  g.addColorStop(0, alpha(night ? N_VOID : S_RED, a));
  g.addColorStop(0.45, alpha(night ? N_VIO : S_AMBER, a * 0.9));
  g.addColorStop(1, alpha(night ? N_PINK : S_GOLD, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - w, y);
  ctx.quadraticCurveTo(x - w * 0.6 + sway * 0.5, y - h * 0.5, x + sway, y - h);
  ctx.quadraticCurveTo(x + w * 0.6 + sway * 0.5, y - h * 0.5, x + w, y);
  ctx.closePath();
  ctx.fill();
}
