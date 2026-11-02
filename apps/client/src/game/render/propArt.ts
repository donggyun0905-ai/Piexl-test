// 새 방 소품 그림 (사용자 GPT 그림 → scripts/art/room_props.py → public/sprites/props/{이름}.webp, 게임 크기의 4배)
// 처음 그릴 때 불러오고, 다 불러오기 전에는 false를 돌려줘 예전 코드 그림을 그대로 씀. 효과(빛·문자·조각)는 각 그리기 파일이 그 위에 그림
import { mipFor, screenScale } from "../mipmap";

type Ctx = CanvasRenderingContext2D;

/** 이름 → 칸 수 (room_props.py의 PROPS와 같음) */
export const PROPS = {
  trialStone: 2,
  trialChest: 2,
  crack: 3,
  devilStatue: 1,
  devilAltar: 1,
  gambleTable: 1,
  cups: 3,
  gambler: 4,
  auctioneer: 4,
  throne: 2,
  guestChair: 1,
  lotStand: 3,
  stage: 1,
  paddle: 1,
  altarStand: 1,
  starWhale: 1,
  starTurtle: 1,
  starHawk: 1,
  starWind: 1,
  starSion: 1,
  starSylvester: 1,
  starWitch: 1,
  starUnknown: 1,
} as const;
export type PropName = keyof typeof PROPS;

const imgs = new Map<PropName, HTMLImageElement>();

function img(name: PropName): HTMLImageElement | null {
  let im = imgs.get(name);
  if (!im) {
    im = new Image();
    im.src = `${import.meta.env.BASE_URL}sprites/props/${name}.webp`;
    imgs.set(name, im);
  }
  return im.complete && im.naturalWidth > 0 ? im : null;
}

/** 한 칸의 게임 크기 (높이 h일 때 너비) · 아직 없으면 0 */
export function propWidth(name: PropName, h: number): number {
  const im = img(name);
  return im ? (im.naturalWidth / PROPS[name] / im.naturalHeight) * h : 0;
}

export interface PropOpts {
  /** 그릴 높이 (게임 픽셀) — 없으면 width로 */
  h?: number;
  w?: number;
  /** 기준점: 밑동 가운데(기본) · 가운데 */
  center?: boolean;
  alpha?: number;
  /** 검은 배경 그림을 더하기로 (별자리·균열) */
  add?: boolean;
  /** 돌림 (라디안, 기준점 둘레) */
  rot?: number;
}

/** 소품 한 칸을 (x, y)에 그림. 아직 불러오지 않았으면 false */
export function drawProp(ctx: Ctx, name: PropName, frame: number, x: number, y: number, o: PropOpts): boolean {
  const im = img(name);
  if (!im) return false;
  const n = PROPS[name];
  const fw = im.naturalWidth / n;
  const fh = im.naturalHeight;
  const h = o.h ?? ((o.w ?? fw / 4) / fw) * fh;
  const w = (fw / fh) * h;
  const k = screenScale(ctx);
  const [from, m] = mipFor(im, fh / (h * k));
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  if (o.add) ctx.globalCompositeOperation = "lighter";
  ctx.translate(x, y);
  if (o.rot) ctx.rotate(o.rot);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(from, (frame % n) * fw * m, 0, fw * m, fh * m, -w / 2, o.center ? -h / 2 : -h, w, h);
  ctx.restore();
  return true;
}

/** 그림을 다 불러왔는지 (다른 곳에서 그리는 것을 건너뛸 때) */
export const propReady = (name: PropName): boolean => img(name) !== null;
