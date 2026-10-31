// 촘촘한(고해상도) 그림을 많이 줄여 그릴 때 흐려지지 않게: 절반씩 미리 줄인 그림을 만들어 두고(밉맵) 화면 크기에 가장 가까운 것을 씀
// (한 번에 크게 줄이면 몇 픽셀만 골라 써서 뭉개지고 흐릿해짐 · 패왕전처럼 화면을 줄여 보면 특히)

type Src = HTMLImageElement | HTMLCanvasElement;
const levels = new WeakMap<Src, Src[]>();

/** 지금 화면 배율 (ctx 변환의 가로 크기) */
export const screenScale = (ctx: CanvasRenderingContext2D): number => Math.abs(ctx.getTransform().a) || 1;

/** shrink = 원본 픽셀 ÷ 화면 픽셀 (2 이상이면 절반씩 줄인 그림) → [쓸 그림, 원본 대비 배율] */
export function mipFor(img: Src, shrink: number): [Src, number] {
  const n = Math.min(4, Math.floor(Math.log2(Math.max(1, shrink))));
  if (n < 1 || !img.width) return [img, 1];
  let list = levels.get(img);
  if (!list) levels.set(img, (list = [img]));
  for (let i = list.length; i <= n; i++) {
    const prev = list[i - 1]!;
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(prev.width / 2));
    c.height = Math.max(1, Math.round(prev.height / 2));
    const g = c.getContext("2d")!;
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = "high";
    g.drawImage(prev, 0, 0, c.width, c.height);
    list.push(c);
  }
  const out = list[n]!;
  return [out, out.width / img.width];
}
