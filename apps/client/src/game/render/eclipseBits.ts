// 이클립스 그리기 도우미: 색 · 태양 직각 검격(한 자루 날, 안쪽 빨강·바깥 노랑) · 일식 초승달 날(안쪽 검보라·바깥 분홍 보라) · 블랙홀 · 연기
// 모든 검격은 날 하나에 두 색만 (겹겹이 싸지 않음)
import type { PlayerState } from "@pixel-rogue/shared";
import { ECLIPSE, sunCutPoints } from "@pixel-rogue/shared";
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";

export const TAU = Math.PI * 2;
/** 태양: 바깥 노랑 · 안쪽 빨강 */
export const S_GOLD = "#ffd84a";
export const S_RED = "#ff3a10";
/** 일식: 안쪽 검정에 가까운 검보라 · 바깥 분홍 보라 */
export const N_VOID = "#16052a";
export const N_PINK = "#e85cff";
export const SMOKE = "#6a6470";

/** 일식 낙하로 몸이 뜨는 높이 (뛰어올라 잠깐 머물다 내리꽂힘) */
export function eclipseLift(p: PlayerState): number {
  if (!p.ecAir) return 0;
  const u = 1 - p.ecAir / ECLIPSE.jumpTicks;
  return u < 0.6 ? 38 * (1 - (1 - u / 0.6) ** 3) : 38 * (1 - ((u - 0.6) / 0.4) ** 3);
}

type Pt = readonly [number, number];

/**
 * 꺾인 날 하나: 점들을 잇는 길을 따라, 바깥쪽(가운데 cx·cy에서 먼 쪽)으로 두께를 붙임
 * 두께는 양 끝이 바늘처럼 0, 꺾이는 점(peak 번째)에서 가장 두꺼움 · upTo(0~1): 앞에서부터 그 길이까지만
 */
function blade(ctx: Ctx, pts: readonly Pt[], peak: number, w: number, cx: number, cy: number, upTo: number): void {
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i]![0], q[1] - pts[i]![1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const peakAt = segs.slice(0, peak).reduce((a, b) => a + b, 0);
  const width = (d: number) => w * (d <= peakAt ? (d / peakAt) ** 0.7 : ((total - d) / (total - peakAt)) ** 0.55);
  // 마디마다 바깥쪽(가운데에서 먼 쪽) 법선
  const norms = segs.map((len, i) => {
    const [ax, ay] = pts[i]!;
    const [bx, by] = pts[i + 1]!;
    const n: Pt = [-(by - ay) / len, (bx - ax) / len];
    return n[0] * ((ax + bx) / 2 - cx) + n[1] * ((ay + by) / 2 - cy) < 0 ? ([-n[0], -n[1]] as Pt) : n;
  });
  // 길을 잘게 나눠 안쪽 줄·바깥쪽 줄 (꺾이는 점은 두 법선을 더해 뾰족한 모서리)
  const inner: Pt[] = [];
  const outer: Pt[] = [];
  let d0 = 0;
  const end = total * upTo;
  segs.forEach((len, i) => {
    const [ax, ay] = pts[i]!;
    const [bx, by] = pts[i + 1]!;
    const steps = Math.max(2, Math.ceil(len / 3));
    for (let k = i ? 1 : 0; k <= steps; k++) {
      const d = d0 + (len * k) / steps;
      if (d > end + 0.01) break;
      const x = ax + ((bx - ax) * k) / steps;
      const y = ay + ((by - ay) * k) / steps;
      const corner = k === steps && i < segs.length - 1;
      // 꺾이는 점: 두 법선 사이 (각이 클수록 멀리 → 90°면 뾰족한 모서리, 둥근 길은 매끈하게)
      const n0 = norms[i]!;
      const n1 = corner ? norms[i + 1]! : n0;
      const k1 = 1 + n0[0] * n1[0] + n0[1] * n1[1];
      const n = [(n0[0] + n1[0]) / k1, (n0[1] + n1[1]) / k1];
      inner.push([x, y]);
      outer.push([x + n[0]! * width(d), y + n[1]! * width(d)]);
    }
    d0 += len;
  });
  if (inner.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(inner[0]![0], inner[0]![1]);
  for (const q of outer) ctx.lineTo(q[0], q[1]);
  for (let k = inner.length - 1; k >= 0; k--) ctx.lineTo(inner[k]![0], inner[k]![1]);
  ctx.closePath();
  ctx.fill();
}

/**
 * 날 하나 칠하기: 바깥 색으로 은은하게 번지는 반투명 빛 → 바깥 색 날 → 안쪽 색 (draw(k): 두께 배율 k로 날 모양 채우기)
 * 겹겹이 테두리를 두르지 않고, 날 하나가 빛나 보이게
 */
export function paintBlade(ctx: Ctx, draw: (k: number) => void, outer: string, inner: string, al: number): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor = alpha(outer, 0.9 * al);
  ctx.shadowBlur = 14;
  ctx.fillStyle = alpha(outer, 0.3 * al);
  draw(1.35);
  ctx.restore();
  ctx.fillStyle = alpha(outer, 0.82 * al);
  draw(1);
  ctx.fillStyle = alpha(inner, 0.88 * al);
  draw(0.55);
}

/** 날을 따라 흩날리는 불티 (pts 길 위, f: 진행) */
export function embers(ctx: Ctx, pts: readonly Pt[], f: number, c: string, seed: number): void {
  if (f <= 0) return;
  for (let k = 0; k < 10; k++) {
    const q = pts[Math.floor(rnd(seed, k) * pts.length)]!;
    const ang = rnd(k, seed) * TAU;
    const d = 3 + f * 10 * rnd(seed + 1, k);
    ctx.fillStyle = alpha(k % 3 ? c : "#ffffff", (1 - f) * 0.9);
    ctx.fillRect(q[0] + Math.cos(ang) * d, q[1] + Math.sin(ang) * d - f * 4, 1.5, 1.5);
  }
}

/**
 * 태양 직각 검격 i(0~3): 꺾이는 점에서 90°로 꺾인 날 하나 (모양은 sim/eclipseCuts · 바깥 노랑 · 안쪽 빨강 · 은은한 빛)
 * grow(0~1): 위 팔 끝에서부터 그어 나간 만큼 · thin: 두께 배율 · al: 투명도 · spark: 불티 진행(0 = 없음)
 */
export function rightSlash(ctx: Ctx, x: number, y: number, fx: number, fy: number, r: number, i: number, grow: number, thin: number, al: number, spark = 0): void {
  if (al <= 0 || grow <= 0 || thin <= 0) return;
  const pts = sunCutPoints(x, y, fx, fy, r, i);
  const w = Math.max(2, r * (i === 3 ? 0.16 : 0.2)) * thin;
  paintBlade(ctx, (k) => blade(ctx, pts, 1, w * k, x, y, grow), S_GOLD, S_RED, al);
  embers(ctx, pts, spark, S_GOLD, Math.round(r * 10 + i));
}

/** 초승달 띠 (가운데가 두껍고 양 끝이 가늘어짐 · sy: 세로 눌림) */
export function band(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, thick: number, sy = 1): void {
  const steps = 24;
  ctx.beginPath();
  for (let k = 0; k <= steps; k++) {
    const ang = a0 + ((a1 - a0) * k) / steps;
    ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r * sy);
  }
  for (let k = steps; k >= 0; k--) {
    const u = k / steps;
    const ang = a0 + (a1 - a0) * u;
    const rr = r - thick * Math.sin(u * Math.PI) ** 0.8;
    ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr * sy);
  }
  ctx.closePath();
  ctx.fill();
}

/** 일식 초승달 날 하나: 바깥 분홍 보라 · 안쪽 검보라 · 은은한 분홍 빛 (a0~a1, 반지름 r, 두께 thick) */
export function voidArc(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, thick: number, al: number, sy = 1): void {
  if (al <= 0 || a1 <= a0) return;
  paintBlade(ctx, (k) => band(ctx, x, y, r + thick * (k - 1) * 0.3, a0, a1, thick * k, sy), N_PINK, N_VOID, al);
}

/** 잿빛 연기 몇 뭉치 (참고 그림의 회색 연기) */
export function smoke(ctx: Ctx, x: number, y: number, n: number, d: number, f: number, seed: number, a = 1): void {
  ctx.fillStyle = alpha(SMOKE, 0.35 * a * (1 - f));
  for (let k = 0; k < n; k++) {
    const ang = rnd(seed, k) * TAU;
    const far = d * (0.4 + rnd(k, seed) * 0.6) * (0.7 + f * 0.5);
    ctx.beginPath();
    ctx.arc(x + Math.cos(ang) * far, y + Math.sin(ang) * far * 0.6 - f * 5, (2.5 + rnd(seed + 3, k) * 3) * (0.8 + f), 0, TAU);
    ctx.fill();
  }
}

/** 블랙홀: 검은 구 · 분홍 보라 테 · 비스듬히 도는 고리 하나 (r: 반지름, life: 남은 비율) */
export function blackHole(ctx: Ctx, x: number, y: number, r: number, life: number, tick: number): void {
  const k = Math.min(1, (1 - life) * 6) * Math.min(1, life * 5);
  if (k <= 0) return;
  const R = r * 0.34 * k;
  const cy = y - 6;
  additive(ctx, () => glow(ctx, x, cy, R * 2.4, N_PINK, 0.35 * k));
  const ringHalf = (from: number, to: number) => {
    ctx.save();
    ctx.translate(x, cy);
    ctx.rotate(-0.4 + Math.sin(tick * 0.05) * 0.04);
    ctx.scale(1, 0.26);
    ctx.fillStyle = alpha(N_PINK, 0.9 * k);
    band(ctx, 0, 0, R * 2.1, from, to, R * 0.45);
    ctx.restore();
  };
  ringHalf(Math.PI, TAU);
  ctx.fillStyle = alpha(N_PINK, k);
  ctx.beginPath();
  ctx.arc(x, cy, R * 1.1, 0, TAU);
  ctx.fill();
  ctx.fillStyle = alpha("#000000", k);
  ctx.beginPath();
  ctx.arc(x, cy, R, 0, TAU);
  ctx.fill();
  ringHalf(0, Math.PI);
}
