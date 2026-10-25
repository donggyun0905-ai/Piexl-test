// 도트 편집 도구 계산: 붓 굵기 · 직선 · 네모 · 동그라미 · 좌우 대칭 (칸 안 좌표, 그리기는 PixelApp)
export type Tool = "pen" | "erase" | "line" | "rect" | "rectFill" | "ellipse" | "fill" | "pick" | "replace";
export type Pt = readonly [number, number];

/** 붓 한 번 찍기: size×size 네모 (가운데 기준) */
export function brush(x: number, y: number, size: number): Pt[] {
  const out: Pt[] = [];
  const o = Math.floor((size - 1) / 2);
  for (let dy = 0; dy < size; dy++) for (let dx = 0; dx < size; dx++) out.push([x - o + dx, y - o + dy]);
  return out;
}

/** 두 점 사이 직선 (빈칸 없이) */
export function line(x0: number, y0: number, x1: number, y1: number): Pt[] {
  const out: Pt[] = [];
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let x = x0;
  let y = y0;
  for (;;) {
    out.push([x, y]);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
  return out;
}

/** 네모 (filled면 속까지) */
export function rect(x0: number, y0: number, x1: number, y1: number, filled: boolean): Pt[] {
  const out: Pt[] = [];
  const [l, r] = [Math.min(x0, x1), Math.max(x0, x1)];
  const [t, b] = [Math.min(y0, y1), Math.max(y0, y1)];
  for (let y = t; y <= b; y++) for (let x = l; x <= r; x++) if (filled || x === l || x === r || y === t || y === b) out.push([x, y]);
  return out;
}

/** 두 점이 만드는 네모 안에 꼭 맞는 동그라미 테두리 */
export function ellipse(x0: number, y0: number, x1: number, y1: number): Pt[] {
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const rx = Math.abs(x1 - x0) / 2;
  const ry = Math.abs(y1 - y0) / 2;
  const seen = new Set<string>();
  const out: Pt[] = [];
  const n = Math.max(16, Math.ceil((rx + ry) * 6));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const p: Pt = [Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * ry)];
    const k = `${p[0]},${p[1]}`;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(p);
    }
  }
  return out;
}

/** 모양 도구가 그릴 점들 (끌기 시작점 → 지금 점) */
export function shape(tool: Tool, a: Pt, b: Pt): Pt[] {
  if (tool === "line") return line(a[0], a[1], b[0], b[1]);
  if (tool === "rect" || tool === "rectFill") return rect(a[0], a[1], b[0], b[1], tool === "rectFill");
  if (tool === "ellipse") return ellipse(a[0], a[1], b[0], b[1]);
  return [];
}

/** 좌우 대칭: 칸 너비 w 기준으로 반대쪽 점을 더함 */
export const mirrored = (pts: readonly Pt[], w: number): Pt[] => [...pts, ...pts.map(([x, y]): Pt => [w - 1 - x, y])];

export const isShape = (t: Tool) => t === "line" || t === "rect" || t === "rectFill" || t === "ellipse";
