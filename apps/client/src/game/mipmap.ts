// 촘촘한(고해상도) 그림을 줄여 그릴 때 흐려지지 않게: 화면에 그려질 크기에 딱 맞춘 그림을 미리 만들어 둠 (절반씩 줄인 뒤 마지막에 고품질로 맞추고 살짝 또렷하게)
// 패왕전처럼 화면을 줄여 보면 특히 (한 번에 크게 줄이면 몇 픽셀만 골라 써서 뭉개지고, 브라우저 기본 줄임은 무름)

type Src = HTMLImageElement | HTMLCanvasElement;
/** 그림마다 배율별로 만든 것 (배율은 1/64 단위로 묶음, 그림마다 최대 8개) */
const made = new WeakMap<Src, Map<number, HTMLCanvasElement>>();
const STEP = 64;
const KEEP = 8;

/** 지금 화면 배율 (ctx 변환의 가로 크기) */
export const screenScale = (ctx: CanvasRenderingContext2D): number => Math.abs(ctx.getTransform().a) || 1;

function half(prev: Src): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(prev.width / 2));
  c.height = Math.max(1, Math.round(prev.height / 2));
  const g = c.getContext("2d")!;
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = "high";
  g.drawImage(prev, 0, 0, c.width, c.height);
  return c;
}

/** 살짝 또렷하게 (언샤프: 이웃 평균과의 차이를 조금 더함, 투명한 곳은 그대로) */
function sharpen(c: HTMLCanvasElement, amount = 0.45): void {
  const g = c.getContext("2d")!;
  const img = g.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  const src = new Uint8ClampedArray(d);
  const w = c.width;
  const h = c.height;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      if (src[i + 3]! < 8) continue;
      for (let k = 0; k < 3; k++) {
        const avg = (src[i - 4 + k]! + src[i + 4 + k]! + src[i - w * 4 + k]! + src[i + w * 4 + k]!) / 4;
        d[i + k] = src[i + k]! + (src[i + k]! - avg) * amount;
      }
    }
  }
  g.putImageData(img, 0, 0);
}

/** shrink = 원본 픽셀 ÷ 화면 픽셀 → [쓸 그림, 원본 대비 배율]. 1.15배 이하로 줄이면 원본 그대로 */
export function mipFor(img: Src, shrink: number): [Src, number] {
  if (shrink <= 1.15 || !img.width) return [img, 1];
  const t = Math.max(1 / STEP, Math.round(STEP / shrink) / STEP);
  let list = made.get(img);
  if (!list) made.set(img, (list = new Map()));
  let out = list.get(t);
  if (!out) {
    let cur: Src = img;
    while (cur.width * 0.5 >= img.width * t * 1.01) cur = half(cur);
    out = document.createElement("canvas");
    out.width = Math.max(1, Math.round(img.width * t));
    out.height = Math.max(1, Math.round(img.height * t));
    const g = out.getContext("2d")!;
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = "high";
    g.drawImage(cur, 0, 0, out.width, out.height);
    sharpen(out);
    if (list.size >= KEEP) list.delete(list.keys().next().value!);
    list.set(t, out);
  }
  return [out, out.width / img.width];
}
