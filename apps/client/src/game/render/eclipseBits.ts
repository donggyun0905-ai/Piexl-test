// 이클립스 그리기 도우미: 색 · 태양 검격(두꺼운 빨강 날 · 앞쪽 테두리 노랑 불꽃 무늬) · 일식 초승달 날(안쪽 검보라·바깥 분홍 보라 · 끝 하나 도끼날) · 블랙홀 · 연기
// 일식 날은 두 색만 (겹겹이 싸지 않음)
import type { PlayerState } from "@pixel-rogue/shared";
import { ECLIPSE, sunCutPoints } from "@pixel-rogue/shared";
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";

export const TAU = Math.PI * 2;
/** 태양: 바깥 노랑 · 안쪽 빨강 */
export const S_GOLD = "#ffd84a";
export const S_RED = "#ff3a10";
/** 태양 빨강 몸통 안쪽 짙은 빨강 */
const S_DEEP = "#b8120a";
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

/** 날 길 위 한 점: 자리 · 바깥쪽 법선 · 앞에서부터 거리 · 그 자리 두께 */
type Sample = { x: number; y: number; nx: number; ny: number; d: number; w: number };

/**
 * 꺾인 날 길: 점들을 잇는 길을 잘게 나눠, 바깥쪽(가운데 cx·cy에서 먼 쪽 = 앞쪽 테두리) 법선과 두께를 붙임
 * 두께는 양 끝이 0, 꺾이는 점(peak 번째)에서 가장 두꺼움 · upTo(0~1): 앞에서부터 그 길이까지만
 */
function bladePath(pts: readonly Pt[], peak: number, w: number, cx: number, cy: number, upTo: number): Sample[] {
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i]![0], q[1] - pts[i]![1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const peakAt = segs.slice(0, peak).reduce((a, b) => a + b, 0);
  const width = (d: number) => w * (d <= peakAt ? (d / peakAt) ** 0.6 : ((total - d) / (total - peakAt)) ** 0.5);
  const norms = segs.map((len, i) => {
    const [ax, ay] = pts[i]!;
    const [bx, by] = pts[i + 1]!;
    const n: Pt = [-(by - ay) / len, (bx - ax) / len];
    return n[0] * ((ax + bx) / 2 - cx) + n[1] * ((ay + by) / 2 - cy) < 0 ? ([-n[0], -n[1]] as Pt) : n;
  });
  const out: Sample[] = [];
  let d0 = 0;
  const end = total * upTo;
  segs.forEach((len, i) => {
    const [ax, ay] = pts[i]!;
    const [bx, by] = pts[i + 1]!;
    const steps = Math.max(2, Math.ceil(len / 2));
    for (let k = i ? 1 : 0; k <= steps; k++) {
      const d = d0 + (len * k) / steps;
      if (d > end + 0.01) break;
      // 꺾이는 점: 두 법선 사이 (각이 클수록 멀리 → 뾰족한 모서리)
      const n0 = norms[i]!;
      const n1 = k === steps && i < segs.length - 1 ? norms[i + 1]! : n0;
      const k1 = 1 + n0[0] * n1[0] + n0[1] * n1[1];
      out.push({ x: ax + ((bx - ax) * k) / steps, y: ay + ((by - ay) * k) / steps, nx: (n0[0] + n1[0]) / k1, ny: (n0[1] + n1[1]) / k1, d, w: width(d) });
    }
    d0 += len;
  });
  return out;
}

/** 길 따라 두 줄(법선 방향 거리 a(q) · b(q)) 사이를 채움 */
function strip(ctx: Ctx, path: readonly Sample[], a: (q: Sample) => number, b: (q: Sample) => number): void {
  ctx.beginPath();
  for (const q of path) ctx.lineTo(q.x + q.nx * a(q), q.y + q.ny * a(q));
  for (let k = path.length - 1; k >= 0; k--) {
    const q = path[k]!;
    ctx.lineTo(q.x + q.nx * b(q), q.y + q.ny * b(q));
  }
  ctx.closePath();
  ctx.fill();
}

/** 태양 불꽃 혀: 앞쪽 테두리에 뾰족하게 솟는 불꽃 무늬 높이 (0~1, d: 길 위 거리 · ph: 일렁임) */
function flame(d: number, ph: number): number {
  const u = (d / 9 + ph) % 1;
  const tri = 1 - Math.abs(u * 2 - 1);
  return tri ** 2.2 * (0.65 + 0.35 * Math.sin(d * 0.37 + ph * 9));
}

/**
 * 날 하나 칠하기: 바깥 색으로 은은하게 번지는 반투명 빛 → 바깥 색 날 → 안쪽 색 (draw(k): 두께 배율 k로 날 모양 채우기)
 * 겹겹이 테두리를 두르지 않고, 날 하나가 빛나 보이게
 */
export function paintBlade(ctx: Ctx, draw: (k: number) => void, outer: string, inner: string, al: number, strong = 1): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor = alpha(outer, 0.9 * al);
  ctx.shadowBlur = 14;
  ctx.fillStyle = alpha(outer, Math.min(1, 0.3 * strong) * al);
  draw(1.35);
  ctx.restore();
  ctx.fillStyle = alpha(outer, Math.min(1, 0.82 * strong) * al);
  draw(1);
  ctx.fillStyle = alpha(inner, Math.min(1, 0.88 * strong) * al);
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

/** 태양 검격을 몸 가까이 붙여 그리는 크기 배율 · 몸 뒤로 당기는 거리(크기 배율) — 날이 몸에서 바로 뻗어 나가 보이게 */
const SUN_PULL = 0.8;
const SUN_BACK = 0.07;

/**
 * 태양 검격 i(0~4): 몸 양옆에서 앞쪽 꼭짓점으로 모이는 '^' 날 (모양은 sim/eclipseCuts, 몸 쪽으로 당겨 그림)
 * 두꺼운 빨강 몸통(뒤쪽으로 더 두껍게) · 앞쪽 테두리에만 얇은 노랑 불꽃 무늬 · 붉은 빛 번짐
 * grow(0~1): 한쪽 끝에서부터 그어 나간 만큼 · thin: 두께 배율 · al: 투명도 · spark: 불티 진행
 */
export function rightSlash(ctx: Ctx, x: number, y: number, fx: number, fy: number, r: number, i: number, grow: number, thin: number, al: number, spark = 0): void {
  if (al <= 0 || grow <= 0 || thin <= 0) return;
  const pts = sunCutPoints(x - fx * r * SUN_BACK, y - fy * r * SUN_BACK, fx, fy, r * SUN_PULL, i);
  if (grow >= 1) {
    ctx.fillStyle = alpha(S_RED, 0.22 * al * thin);
    ctx.beginPath();
    for (const q of pts) ctx.lineTo(q[0], q[1]);
    ctx.closePath();
    ctx.fill();
  }
  const w = Math.max(2, r * SUN_PULL * (i === 0 ? 0.24 : i >= 3 ? 0.14 : 0.19)) * thin;
  const path = bladePath(pts, 1, w, x, y, grow);
  if (path.length < 2) return;
  const ph = (1 - thin) * 1.5 + i * 0.3;
  // 붉은 빛 번짐
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor = alpha(S_RED, 0.9 * al);
  ctx.shadowBlur = 12;
  ctx.fillStyle = alpha(S_RED, 0.3 * al);
  strip(ctx, path, (q) => -q.w * 0.8, (q) => q.w * 1.3);
  ctx.restore();
  // 빨강 몸통: 길 뒤쪽(몸 쪽)으로 더 두껍게
  ctx.fillStyle = alpha(S_RED, 0.95 * al);
  strip(ctx, path, (q) => -q.w * 0.65, (q) => q.w * 0.9);
  ctx.fillStyle = alpha(S_DEEP, 0.85 * al);
  strip(ctx, path, (q) => -q.w * 0.65, (q) => -q.w * 0.3);
  // 앞쪽 테두리: 얇은 노랑 띠 + 일렁이는 불꽃 혀
  ctx.fillStyle = alpha(S_GOLD, al);
  strip(ctx, path, (q) => q.w * 0.78, (q) => q.w * 0.95 + (q.w * 0.9 + 3) * flame(q.d, ph) * Math.min(1, q.w / 4) + 0.5);
  ctx.fillStyle = alpha("#fff6c0", 0.9 * al);
  strip(ctx, path, (q) => q.w * 0.84, (q) => q.w * 0.9 + 0.4);
  embers(ctx, pts, spark, S_GOLD, Math.round(r * 10 + i));
}

/** 도끼날 두께: 가는 꼬리(0)에서 점점 굵어져 머리(1)에서 가장 넓게 벌어지고 네모로 끊김 */
const axe = (u: number) => u ** 0.6 * (u > 0.72 ? 1 + 0.85 * ((u - 0.72) / 0.28) ** 1.3 : 1);

/**
 * 초승달 띠 (가운데가 두껍고 양 끝이 가늘어짐 · sy: 세로 눌림)
 * head: 0이면 a0 쪽, 1이면 a1 쪽 끝이 도끼날처럼 두껍고 네모남 (없으면 양 끝 뾰족)
 */
export function band(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, thick: number, sy = 1, head?: 0 | 1): void {
  const steps = 24;
  ctx.beginPath();
  for (let k = 0; k <= steps; k++) {
    const ang = a0 + ((a1 - a0) * k) / steps;
    ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r * sy);
  }
  for (let k = steps; k >= 0; k--) {
    const u = k / steps;
    const ang = a0 + (a1 - a0) * u;
    const rr = r - thick * (head === undefined ? Math.sin(u * Math.PI) ** 0.8 : axe(head ? u : 1 - u) * 0.75);
    ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr * sy);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * 일식 초승달 날 하나: 바깥 분홍 보라 · 안쪽 검보라 · 은은한 분홍 빛 (a0~a1, 반지름 r, 두께 thick)
 * head(0/1): 그 쪽 끝을 도끼날처럼 네모나고 두껍게 + 진하게 + 바깥 날에 밝은 줄
 */
export function voidArc(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, thick: number, al: number, sy = 1, head?: 0 | 1): void {
  if (al <= 0 || a1 <= a0) return;
  paintBlade(ctx, (k) => band(ctx, x, y, r + thick * (k - 1) * 0.3, a0, a1, thick * k, sy, head), N_PINK, N_VOID, al, head === undefined ? 1 : 1.25);
  if (head === undefined) return;
  // 바깥 날 끝을 따라 밝은 분홍 줄 (꼬리는 가늘게, 도끼 머리 쪽이 밝게)
  ctx.strokeStyle = alpha("#ffd2ff", 0.9 * al);
  ctx.lineWidth = Math.max(1, thick * 0.12);
  ctx.beginPath();
  const from = head ? 0.35 : 0;
  const to = head ? 1 : 0.65;
  for (let k = 0; k <= 16; k++) {
    const ang = a0 + (a1 - a0) * (from + ((to - from) * k) / 16);
    ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r * sy);
  }
  ctx.stroke();
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
