// 세계 지도 나무: 그림 몇 장을 처음에 코드로 만들어 두고(둥근 나무·뾰족 나무 × 색 2) 매 장면 사람과 발 y 순서로 그림
// 칸보다 커서 옆 나무와 겹쳐 숲이 됨 · 윗부분이 바람에 살짝 흔들림 · 그림자는 땅에(worldArt)
import { hash2, vnoise } from "./worldGround";
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { WT } from "./worldTiles";
import type { View } from "../lobby/walker";

const TW = 30;
const TH = 36;
/** 줄기 시작 줄 (이 아래는 안 흔들림) · 줄기 밑 = 발 */
const TRUNK_Y = 27;
const FOOT_X = 15;
const FOOT_Y = 34;

type Rgb = readonly [number, number, number];
/** 잎 색: 외곽선 · 어둠 · 중간 · 밝음 · 반짝 */
const LEAVES: readonly (readonly Rgb[])[] = [
  [[22, 52, 30], [38, 92, 44], [58, 124, 56], [92, 160, 70], [150, 204, 104]],
  [[18, 42, 34], [30, 76, 50], [44, 104, 62], [70, 136, 74], [120, 180, 100]],
];

interface Blob {
  x: number;
  y: number;
  r: number;
}
const OAK: readonly Blob[] = [
  { x: 15, y: 14, r: 11 },
  { x: 8, y: 18, r: 7 },
  { x: 22, y: 18, r: 7 },
  { x: 15, y: 6, r: 7 },
  { x: 15, y: 21, r: 7 },
];

function inPine(x: number, y: number): number {
  // 세 단 삼각형: 안이면 그 단 안의 세로 비율(0 = 꼭대기), 밖이면 -1
  for (const [top, bot, half] of [[2, 13, 7], [8, 20, 10], [14, 28, 13]] as const) {
    if (y < top || y > bot) continue;
    const k = (y - top) / (bot - top);
    if (Math.abs(x - 15) <= 1 + half * k) return k;
  }
  return -1;
}

function makeTree(kind: number, pal: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TW;
  c.height = TH;
  const g = c.getContext("2d")!;
  const img = g.createImageData(TW, TH);
  const L = LEAVES[pal]!;
  const inside = (x: number, y: number): number => {
    if (x < 0 || y < 0 || x >= TW || y >= TH) return -2;
    if (kind === 1) {
      const k = inPine(x, y);
      return k < 0 ? -2 : 0.25 + k * 0.75 - (15 - x) * 0.035;
    }
    let best = -2;
    for (const b of OAK) {
      const dx = x - b.x;
      const dy = y - b.y;
      const d = Math.hypot(dx, dy) / b.r;
      // 위·왼쪽이 밝음 (공 모양 빛)
      if (d <= 1) best = Math.max(best, 0.55 + (dx * 0.5 + dy * 0.8) / b.r * 0.55 - (1 - d) * 0.25);
    }
    return best;
  };
  const put = (x: number, y: number, rgb: Rgb) => {
    const i = (y * TW + x) * 4;
    [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]] = [rgb[0], rgb[1], rgb[2], 255];
  };
  // 줄기
  for (let y = TRUNK_Y - 6; y <= FOOT_Y; y++) for (let x = FOOT_X - 2; x <= FOOT_X + 1; x++) {
    put(x, y, x === FOOT_X - 2 ? [56, 34, 20] : x === FOOT_X + 1 ? [70, 44, 24] : [110, 72, 40]);
  }
  put(FOOT_X - 3, FOOT_Y, [70, 44, 24]);
  put(FOOT_X + 2, FOOT_Y, [70, 44, 24]);
  for (let y = 0; y < TH; y++) {
    for (let x = 0; x < TW; x++) {
      const v = inside(x, y);
      if (v === -2) {
        // 바로 옆이 잎이면 외곽선
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => inside(x + dx!, y + dy!) !== -2)) put(x, y, L[0]!);
        continue;
      }
      // 잎 덩이 무늬로 밝기 흔들기 → 4단계
      const n = v + (vnoise(x / 3 + pal * 9, y / 3 + kind * 5) - 0.5) * 0.45;
      put(x, y, n > 0.92 ? L[1]! : n > 0.62 ? L[2]! : n > 0.3 ? L[3]! : L[4]!);
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

let sprites: HTMLCanvasElement[] | null = null;
const treeSprites = (): HTMLCanvasElement[] => (sprites ??= [makeTree(0, 0), makeTree(0, 1), makeTree(1, 0), makeTree(1, 1)]);

export interface Drawable {
  y: number;
  draw: () => void;
}

/** 화면에 걸친 나무들 (아래로 삐져나온 것까지) → 앞뒤 순서 목록에 넣음 */
export function pushTrees(ctx: CanvasRenderingContext2D, m: WorldMap, v: View, t: number, out: Drawable[]): void {
  const sp = treeSprites();
  const x0 = Math.max(0, Math.floor(v.x / WTILE) - 1);
  const x1 = Math.min(m.cols - 1, Math.ceil((v.x + v.w) / WTILE) + 1);
  const y0 = Math.max(0, Math.floor(v.y / WTILE));
  const y1 = Math.min(m.rows - 1, Math.ceil((v.y + v.h) / WTILE) + 2);
  for (let cy = y0; cy <= y1; cy++) {
    for (let cx = x0; cx <= x1; cx++) {
      if (tileAt(m, cx, cy) !== WT.tree) continue;
      const h = hash2(cx, cy);
      // 숲 속(둘레가 다 나무)은 뾰족 나무가 많게
      const deep = tileAt(m, cx, cy - 1) === WT.tree && tileAt(m, cx - 1, cy) === WT.tree && tileAt(m, cx + 1, cy) === WT.tree;
      const s = sp[((deep ? h % 3 !== 0 : h % 4 === 0) ? 2 : 0) + ((h >>> 5) & 1)]!;
      const fx = (cx + 0.5) * WTILE + ((h >>> 9) % 5) - 2;
      const fy = (cy + 1) * WTILE - 2 - ((h >>> 13) % 3);
      const sway = Math.round(Math.sin(t * 1.3 + (h % 628) / 100) * 0.8);
      const left = Math.round(fx - FOOT_X);
      const top = Math.round(fy - FOOT_Y);
      out.push({
        y: fy,
        draw: () => {
          ctx.drawImage(s, 0, TRUNK_Y, TW, TH - TRUNK_Y, left, top + TRUNK_Y, TW, TH - TRUNK_Y);
          ctx.drawImage(s, 0, 0, TW, TRUNK_Y, left + sway, top, TW, TRUNK_Y);
        },
      });
    }
  }
}
