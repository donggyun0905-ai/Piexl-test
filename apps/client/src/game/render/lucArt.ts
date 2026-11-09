// 레이드 보스 루시퍼 그림 불러오기 (public/raid/lucifer ← scripts/art/lucifer.py)
// · p1/p2: 가로 5칸(400px) 서기 + 공격 모션 4 · pillar 석화의 기둥 · sword 절망의 검
// · fx: 기본공격 모션 시트 (검은 바탕, 더하기로 그림) 왼쪽·오른쪽 반쪽 × 7줄 × 4칸 (docs/RAID_LUCIFER.md 0절 번호)

type Ctx = CanvasRenderingContext2D;
const cache = new Map<string, HTMLImageElement>();

/** 그림 (다 불러왔으면, 아니면 null) */
export function lucImg(name: string): HTMLImageElement | null {
  let im = cache.get(name);
  if (!im) {
    im = new Image();
    im.src = `${import.meta.env.BASE_URL}raid/lucifer/${name}`;
    cache.set(name, im);
  }
  return im.complete && im.naturalWidth > 0 ? im : null;
}

/** 시트 한 칸: side 0 왼쪽 · 1 오른쪽, row 0~6, frame 0~3 → (x, y) 가운데에 너비 w로 더하기 */
export function lucFx(ctx: Ctx, side: 0 | 1, row: number, frame: number, x: number, y: number, w: number, alpha = 1, angle = 0): void {
  const im = lucImg("fx.jpg");
  if (!im || alpha <= 0) return;
  const cw = im.naturalWidth / 8;
  const ch = im.naturalHeight / 7;
  const sx = (side * 4 + Math.max(0, Math.min(3, Math.floor(frame)))) * cw;
  const sy = Math.max(0, Math.min(6, row)) * ch;
  const h = (w * ch) / cw;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha *= Math.min(1, alpha);
  ctx.translate(x, y);
  if (angle) ctx.rotate(angle);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(im, sx, sy, cw, ch, -w / 2, -h / 2, w, h);
  ctx.restore();
}

/** 몸 그림 한 칸 (p1·p2 시트) → 아래쪽 가운데 (x, footY)에 높이 h */
export function lucBody(ctx: Ctx, sheet: "p1.png" | "p2.png", frame: number, x: number, footY: number, h: number, flip = false, alpha = 1): boolean {
  const im = lucImg(sheet);
  if (!im) return false;
  const cell = im.naturalHeight;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.imageSmoothingEnabled = true;
  ctx.translate(x, footY - h / 2);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(im, frame * cell, 0, cell, cell, -h / 2, -h / 2, h, h);
  ctx.restore();
  return true;
}

/** 한 장 그림 (기둥·검) → 아래쪽 가운데에 높이 h */
export function lucProp(ctx: Ctx, name: string, x: number, footY: number, h: number, alpha = 1): boolean {
  const im = lucImg(name);
  if (!im) return false;
  const w = (h * im.naturalWidth) / im.naturalHeight;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(im, x - w / 2, footY - h, w, h);
  ctx.restore();
  return true;
}
