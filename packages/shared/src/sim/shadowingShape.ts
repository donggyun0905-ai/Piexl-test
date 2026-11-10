// 쉐도잉 획 모양 계산: 길이 · 닫힌 원 · 곧은 줄 · 꺾인 자리 · 안에 있는지 · 선분까지 거리 (게임 계산, 삼각함수 없음)
import { SHADOW_INK as SD } from "../weaponsShadowing";

/** 점 a(x, y)에서 선분 (x1, y1)–(x2, y2)까지 거리의 제곱 */
export function segDist2(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  let t = l2 > 0 ? ((x - x1) * dx + (y - y1) * dy) / l2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const px = x1 + dx * t - x;
  const py = y1 + dy * t - y;
  return px * px + py * py;
}

/** 획 길이 */
export function strokeLen(pts: readonly number[]): number {
  let n = 0;
  for (let i = 2; i < pts.length; i += 2) n += Math.hypot(pts[i]! - pts[i - 2]!, pts[i + 1]! - pts[i - 1]!);
  return n;
}

/** 획 어딘가가 (x, y)에서 r 안인지 */
export function nearStroke(pts: readonly number[], x: number, y: number, r: number): boolean {
  const rr = r * r;
  if (pts.length === 2) return (pts[0]! - x) ** 2 + (pts[1]! - y) ** 2 <= rr;
  for (let i = 2; i < pts.length; i += 2) if (segDist2(x, y, pts[i - 2]!, pts[i - 1]!, pts[i]!, pts[i + 1]!) <= rr) return true;
  return false;
}

/** 가운데 (점 평균) · 반지름 (가운데에서 가장 먼 점) */
export function centerOf(pts: readonly number[]): { x: number; y: number; r: number } {
  const n = pts.length / 2;
  let x = 0;
  let y = 0;
  for (let i = 0; i < pts.length; i += 2) {
    x += pts[i]!;
    y += pts[i + 1]!;
  }
  x /= n;
  y /= n;
  let r = 0;
  for (let i = 0; i < pts.length; i += 2) r = Math.max(r, Math.hypot(pts[i]! - x, pts[i + 1]! - y));
  return { x, y, r };
}

/** 다 그린 획 모양: 1 봉인(닫힌 원) · 2 일필 베기(곧은 줄) · 0 그냥 획 */
export function shapeOf(pts: readonly number[]): number {
  if (pts.length < 6) return 0;
  const len = strokeLen(pts);
  const chord = Math.hypot(pts[pts.length - 2]! - pts[0]!, pts[pts.length - 1]! - pts[1]!);
  if (len >= SD.minLoop && chord <= SD.closeDist) return 1;
  if (len >= SD.minLine && chord >= len * SD.straight) return 2;
  return 0;
}

/** (x, y)가 닫힌 획 안인지 (반직선 세기) */
export function insideLoop(pts: readonly number[], x: number, y: number): boolean {
  let inside = false;
  const n = pts.length;
  for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
    const xi = pts[i]!;
    const yi = pts[i + 1]!;
    const xj = pts[j]!;
    const yj = pts[j + 1]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** 크게 꺾인 자리 (앞 두 점 → 뒤 두 점 방향의 cos가 bend 이하) · 가까이 붙은 꺾임은 하나로 */
export function cornersOf(pts: readonly number[], bend: number, max: number): [number, number][] {
  const out: [number, number][] = [];
  const n = pts.length / 2;
  for (let i = 2; i < n - 2 && out.length < max; i++) {
    const ax = pts[i * 2]! - pts[(i - 2) * 2]!;
    const ay = pts[i * 2 + 1]! - pts[(i - 2) * 2 + 1]!;
    const bx = pts[(i + 2) * 2]! - pts[i * 2]!;
    const by = pts[(i + 2) * 2 + 1]! - pts[i * 2 + 1]!;
    const la = Math.hypot(ax, ay);
    const lb = Math.hypot(bx, by);
    if (la <= 0 || lb <= 0 || (ax * bx + ay * by) / (la * lb) > bend) continue;
    out.push([pts[i * 2]!, pts[i * 2 + 1]!]);
    i += 3;
  }
  return out;
}
