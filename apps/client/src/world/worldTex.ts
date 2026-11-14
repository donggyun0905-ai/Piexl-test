// 세계 지도 그림 파일 (B안, docs/WORLD_ART.md): public/world/art.json 목록에 있는 것만 받음
// tex = 땅 결(빈틈없이 반복, 256픽셀 = 4칸) · obj = 물건 그림(나무·바위·집·동굴 등, 아래 가운데 = 발)
// 목록이 없거나 그림을 못 받으면 비어 있음 → 지금 코드 그림으로 그림 (그림 하나씩 따로 대신함)

/** 그림 파일 1픽셀 = 지도 1/4픽셀 (캐릭터 그림과 같은 선명도) */
export const ART_DENS = 4;

export interface Tex {
  w: number;
  h: number;
  /** RGBA (땅 바탕 픽셀 계산용) */
  data: Uint8ClampedArray;
  img: HTMLCanvasElement;
}

interface WorldArt {
  tex: Map<string, Tex>;
  obj: Map<string, HTMLImageElement>;
}

const art: WorldArt = { tex: new Map(), obj: new Map() };
let loading: Promise<void> | null = null;

/** 지역마다 바꿔 끼우는 그림 (Region.skin: 기본 이름 → 그 지역 그림 이름, 그림이 없으면 기본 그림) */
let skin: Readonly<Record<string, string>> = {};
export function setArtSkin(s: Readonly<Record<string, string>> | undefined): void {
  skin = s ?? {};
}
const pick = <T>(m: Map<string, T>, name: string): T | undefined => {
  const alt = skin[name];
  return (alt !== undefined && m.get(alt)) || m.get(name);
};

export const texOf = (name: string | undefined): Tex | undefined => (name ? pick(art.tex, name) : undefined);
export const objOf = (name: string): HTMLImageElement | undefined => pick(art.obj, name);
/** 땅 결이 하나라도 있으면 4배 해상도로 그림 */
export const artDens = (): number => (art.tex.size ? ART_DENS : 1);

function image(url: string): Promise<HTMLImageElement | null> {
  return new Promise((ok) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => ok(null);
    img.src = url;
  });
}

function toTex(img: HTMLImageElement): Tex {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(img, 0, 0);
  return { w: c.width, h: c.height, data: g.getImageData(0, 0, c.width, c.height).data, img: c };
}

/** 한 번만 받음 (실패해도 그냥 끝남) */
export function loadWorldArt(base: string): Promise<void> {
  loading ??= (async () => {
    try {
      const res = await fetch(`${base}world/art.json`, { cache: "no-cache" });
      if (!res.ok) return;
      const list = (await res.json()) as { tex?: string[]; obj?: string[] };
      await Promise.all([
        ...(list.tex ?? []).map(async (n) => {
          const img = await image(`${base}world/tex/${n}.png`);
          if (img) art.tex.set(n, toTex(img));
        }),
        ...(list.obj ?? []).map(async (n) => {
          const img = await image(`${base}world/obj/${n}.png`);
          if (img) art.obj.set(n, img);
        }),
      ]);
    } catch {
      // 목록 없음 = 코드 그림
    }
  })();
  return loading;
}

/** 땅 결 한 점 (그림 픽셀 좌표, 반복) → out RGB */
export function sampleTex(t: Tex, hx: number, hy: number, out: number[]): void {
  const x = ((hx % t.w) + t.w) % t.w;
  const y = ((hy % t.h) + t.h) % t.h;
  const i = (y * t.w + x) * 4;
  out[0] = t.data[i]!;
  out[1] = t.data[i + 1]!;
  out[2] = t.data[i + 2]!;
}

/** 지금 그리는 덩어리의 왼쪽 위 지도 좌표·해상도 (땅 결 무늬를 지도 전체에 이어지게) */
const origin = { x: 0, y: 0, dens: 1 };
export function setChunkOrigin(x: number, y: number, dens: number): void {
  [origin.x, origin.y, origin.dens] = [x, y, dens];
}

/** 덩어리 캔버스(지도 좌표로 늘린 상태)에 땅 결 그림을 반복해 채움 · 그림이 없거나 코드 해상도면 false (코드로 그림) */
export function fillTex(g: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number): boolean {
  const t = origin.dens > 1 ? texOf(name) : undefined;
  const p = t && g.createPattern(t.img, "repeat");
  if (!p) return false;
  p.setTransform(new DOMMatrix().translate(-origin.x, -origin.y).scale(1 / origin.dens));
  g.fillStyle = p;
  g.fillRect(x, y, w, h);
  return true;
}

/** 4배 해상도로 그리는 중이고 이 이름의 그림이 있음 */
export const hasTex = (name: string | undefined): boolean => origin.dens > 1 && !!texOf(name);
export const obj = (name: string): HTMLImageElement | undefined => (origin.dens > 1 ? objOf(name) : undefined);

/** 한 칸(64픽셀) 그림을 칸에 맞춰 그림 (벽 앞면·철길) · turn = 90도 돌림 (가로 철길) · 그림이 없으면 false */
export function tileTex(g: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number, turn = false): boolean {
  const t = origin.dens > 1 ? texOf(name) : undefined;
  if (!t) return false;
  if (!turn) g.drawImage(t.img, 0, 0, t.w, (t.h * h) / w, x, y, w, h);
  else {
    g.save();
    g.translate(x + w / 2, y + h / 2);
    g.rotate(Math.PI / 2);
    g.drawImage(t.img, -h / 2, -w / 2, h, w);
    g.restore();
  }
  return true;
}

/** 물건 그림을 발(아래 가운데) 기준으로, 지도 크기로 (1/dens) */
export function drawObj(g: CanvasRenderingContext2D, img: HTMLImageElement, footX: number, footY: number, scale = 1): void {
  const w = (img.naturalWidth / ART_DENS) * scale;
  const h = (img.naturalHeight / ART_DENS) * scale;
  g.drawImage(img, Math.round(footX - w / 2), Math.round(footY - h), w, h);
}

/** 건물 덩어리(x0~x1, y0~y1 칸)를 물건 그림 한 장으로 (덩어리 폭에 맞춤·너무 높으면 눌러 담음, 발 = 덩어리 아래, 위로 넘치는 지붕은 맨 위 칸이 그림)
 * 칸마다 자기 몫만 잘라 그려서 큰 건물이 덩어리 경계에 걸려도 끊기지 않음 · 그림이 없으면 false (코드 그림) */
export function blockObj(g: CanvasRenderingContext2D, name: string, b: readonly [number, number, number, number], cx: number, cy: number, px: number, py: number, S: number): boolean {
  const img = obj(name);
  if (!img) return false;
  const [x0, y0, x1, y1] = b;
  // 폭은 덩어리에 맞추고, 너무 높으면 덩어리 높이의 1.5배로 눌러 담음
  const kx = img.naturalWidth / ((x1 - x0 + 1) * S);
  const hb = (y1 + 1 - y0) * S;
  const ky = Math.max(kx, img.naturalHeight / (hb * 1.5));
  const imgTop = hb - img.naturalHeight / ky;
  const lx = (cx - x0) * S;
  const row = (cy - y0) * S;
  const top = Math.max(cy === y0 ? Math.min(imgTop, 0) : row, imgTop);
  const bot = row + S;
  if (bot > top) g.drawImage(img, lx * kx, (top - imgTop) * ky, S * kx, (bot - top) * ky, px, py + top - row, S, bot - top);
  return true;
}
