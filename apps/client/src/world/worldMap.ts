// 세계 지도 데이터: 나라 지도 그림(public/world/*.png, 한 픽셀 = 한 칸)을 읽어 칸 배열로 · 부딪힘 · 칸 좌표
// 그림은 그 나라에 들어갈 때 받음 (처음 로딩에 안 넣음)
import { isSolid, tileFromRgb, WT, type WorldTile } from "./worldTiles";

/** 한 칸 크기 (픽셀) */
export const WTILE = 16;

export interface WorldMap {
  cols: number;
  rows: number;
  /** 칸 종류 (y * cols + x) */
  tiles: Uint8Array;
}

/** RGBA 픽셀 → 지도 */
export function parseMap(rgba: ArrayLike<number>, cols: number, rows: number): WorldMap {
  const tiles = new Uint8Array(cols * rows);
  for (let i = 0; i < cols * rows; i++) {
    tiles[i] = rgba[i * 4 + 3]! < 128 ? WT.none : tileFromRgb(rgba[i * 4]!, rgba[i * 4 + 1]!, rgba[i * 4 + 2]!);
  }
  return { cols, rows, tiles };
}

export const tileAt = (m: WorldMap, cx: number, cy: number): WorldTile =>
  (cx < 0 || cy < 0 || cx >= m.cols || cy >= m.rows ? WT.none : m.tiles[cy * m.cols + cx]!) as WorldTile;

/** (x, y)에 반지름 r 몸(발 쪽 네모)이 설 수 있는지 */
export function canStandWorld(m: WorldMap, x: number, y: number, r: number): boolean {
  for (const [dx, dy] of [
    [-r, -r / 2],
    [r, -r / 2],
    [-r, r / 2],
    [r, r / 2],
  ] as const) {
    if (isSolid(tileAt(m, Math.floor((x + dx) / WTILE), Math.floor((y + dy) / WTILE)))) return false;
  }
  return true;
}

/** 지도 그림 받기 → 지도 */
export function loadWorldMap(url: string): Promise<WorldMap> {
  return new Promise((ok, fail) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext("2d", { willReadFrequently: true })!;
      g.drawImage(img, 0, 0);
      ok(parseMap(g.getImageData(0, 0, c.width, c.height).data, c.width, c.height));
    };
    img.onerror = () => fail(new Error(`world map ${url}`));
    img.src = url;
  });
}
