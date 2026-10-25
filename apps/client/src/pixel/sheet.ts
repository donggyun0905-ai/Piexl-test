// 도트 편집: 그림(시트) 불러오기 · 칸 다루기 · PNG로 내보내기. 그림은 cw×ch 칸이 cols×rows로 놓임
export interface Grid {
  cw: number;
  ch: number;
  cols: number;
  rows: number;
}

export const OUTLINE = "#4e4262";

function toData(img: HTMLImageElement): ImageData {
  const cv = document.createElement("canvas");
  cv.width = img.naturalWidth;
  cv.height = img.naturalHeight;
  const ctx = cv.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, cv.width, cv.height);
}

export function loadImage(src: string): Promise<ImageData> {
  return new Promise((ok, fail) => {
    const img = new Image();
    img.onload = () => ok(toData(img));
    img.onerror = () => fail(new Error(src));
    img.src = src;
  });
}

export const copyData = (d: ImageData) => new ImageData(new Uint8ClampedArray(d.data), d.width, d.height);

export function getPx(d: ImageData, x: number, y: number): string | null {
  if (x < 0 || y < 0 || x >= d.width || y >= d.height) return null;
  const i = (y * d.width + x) * 4;
  if (d.data[i + 3]! < 128) return null;
  return `#${[0, 1, 2].map((k) => d.data[i + k]!.toString(16).padStart(2, "0")).join("")}`;
}

export function setPx(d: ImageData, x: number, y: number, hex: string | null): void {
  if (x < 0 || y < 0 || x >= d.width || y >= d.height) return;
  const i = (y * d.width + x) * 4;
  if (!hex) {
    d.data.fill(0, i, i + 4);
    return;
  }
  for (let k = 0; k < 3; k++) d.data[i + k] = parseInt(hex.slice(1 + k * 2, 3 + k * 2), 16);
  d.data[i + 3] = 255;
}

/** 칸(r, c) 안에서 같은 색 이어진 곳 채우기 */
export function fill(d: ImageData, g: Grid, r: number, c: number, x: number, y: number, hex: string | null): void {
  const x0 = c * g.cw;
  const y0 = r * g.ch;
  const from = getPx(d, x, y);
  if (from === hex) return;
  const stack = [[x, y]];
  while (stack.length) {
    const [px, py] = stack.pop()!;
    if (px! < x0 || py! < y0 || px! >= x0 + g.cw || py! >= y0 + g.ch || getPx(d, px!, py!) !== from) continue;
    setPx(d, px!, py!, hex);
    stack.push([px! + 1, py!], [px! - 1, py!], [px!, py! + 1], [px!, py! - 1]);
  }
}

/** 칸(r, c)의 픽셀 복사 · 붙이기 · 좌우 뒤집기 */
export function cellPixels(d: ImageData, g: Grid, r: number, c: number): (string | null)[] {
  const out: (string | null)[] = [];
  for (let y = 0; y < g.ch; y++) for (let x = 0; x < g.cw; x++) out.push(getPx(d, c * g.cw + x, r * g.ch + y));
  return out;
}

export function putCell(d: ImageData, g: Grid, r: number, c: number, px: readonly (string | null)[], flip = false): void {
  for (let y = 0; y < g.ch; y++) for (let x = 0; x < g.cw; x++) setPx(d, c * g.cw + x, r * g.ch + y, px[y * g.cw + (flip ? g.cw - 1 - x : x)] ?? null);
}

/** 그림에 쓰인 색 (많이 쓴 순서) */
export function usedColors(d: ImageData, max = 40): string[] {
  const n = new Map<string, number>();
  for (let y = 0; y < d.height; y++)
    for (let x = 0; x < d.width; x++) {
      const p = getPx(d, x, y);
      if (p) n.set(p, (n.get(p) ?? 0) + 1);
    }
  return [...n.entries()].sort((a, b) => b[1] - a[1]).slice(0, max).map(([c]) => c);
}

export function toCanvas(d: ImageData): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = d.width;
  cv.height = d.height;
  cv.getContext("2d")!.putImageData(d, 0, 0);
  return cv;
}

export function download(d: ImageData, file: string): void {
  toCanvas(d).toBlob((b) => {
    if (!b) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `${file}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, "image/png");
}

/** 칸 하나를 배율 z로 그리기 (투명은 체크무늬). guide: 가운데·발 기준선 [x, y] */
export function drawCell(ctx: CanvasRenderingContext2D, d: ImageData, g: Grid, r: number, c: number, z: number, grid: boolean, guide?: readonly [number, number]): void {
  for (let y = 0; y < g.ch; y++)
    for (let x = 0; x < g.cw; x++) {
      const p = getPx(d, c * g.cw + x, r * g.ch + y);
      ctx.fillStyle = p ?? ((x + y) % 2 ? "#3a3648" : "#45415a");
      ctx.fillRect(x * z, y * z, z, z);
    }
  if (!grid || z < 6) return;
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= g.cw; i++) {
    ctx.moveTo(i * z + 0.5, 0);
    ctx.lineTo(i * z + 0.5, g.ch * z);
  }
  for (let i = 0; i <= g.ch; i++) {
    ctx.moveTo(0, i * z + 0.5);
    ctx.lineTo(g.cw * z, i * z + 0.5);
  }
  ctx.stroke();
  if (!guide) return;
  ctx.strokeStyle = "rgba(255,210,80,0.3)";
  ctx.beginPath();
  ctx.moveTo(guide[0] * z + 0.5, 0);
  ctx.lineTo(guide[0] * z + 0.5, g.ch * z);
  ctx.moveTo(0, guide[1] * z + 0.5);
  ctx.lineTo(g.cw * z, guide[1] * z + 0.5);
  ctx.stroke();
}
