// 패왕전 경기장 칸: 테두리 벽 + 벽·나무(기둥)·물(구덩이). 수풀·함정·2층 발판은 막지 않음 (paewangField). 경기장마다 한 번 만들어 둠
import { TILE_SIZE } from "../constants";
import { PW_ARENAS, type PwArenaId } from "../paewangMaps";
import { TILE_FLOOR, TILE_PILLAR, TILE_PIT, TILE_WALL, type TileGrid } from "./layout";

const cache = new Map<PwArenaId, TileGrid>();

export function pwGrid(arena: PwArenaId): TileGrid {
  const hit = cache.get(arena);
  if (hit) return hit;
  const def = PW_ARENAS[arena];
  const C = def.cols;
  const R = def.rows;
  const g = new Uint8Array(C * R).fill(TILE_FLOOR);
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (r === 0 || c === 0 || r === R - 1 || c === C - 1) g[r * C + c] = TILE_WALL;
  for (const [list, tile] of [[def.walls, TILE_WALL], [def.rocks, TILE_PILLAR], [def.ponds, TILE_PIT]] as const) {
    for (const [c0, r0, w, h] of list) for (let r = r0; r < r0 + h; r++) for (let c = c0; c < c0 + w; c++) if (c > 0 && r > 0 && c < C - 1 && r < R - 1) g[r * C + c] = tile;
  }
  cache.set(arena, g);
  return g;
}

type Rect = readonly [number, number, number, number];

/** 칸 네모 안에 있는지 (픽셀 좌표) */
export const inRect = (x: number, y: number, [c, r, w, h]: Rect): boolean =>
  x >= c * TILE_SIZE && x < (c + w) * TILE_SIZE && y >= r * TILE_SIZE && y < (r + h) * TILE_SIZE;

/** 칸 [열, 행] 가운데 픽셀 */
export const spotXY = ([c, r]: readonly [number, number]): [number, number] => [(c + 0.5) * TILE_SIZE, (r + 0.5) * TILE_SIZE];

/** 수풀 안에 있는지 */
export const inBush = (arena: PwArenaId, x: number, y: number): boolean => PW_ARENAS[arena].bushes.some((b) => inRect(x, y, b));

/** 2층 발판 위에 있는지 */
export const onDeck = (arena: PwArenaId, x: number, y: number): boolean => PW_ARENAS[arena].decks.some((d) => inRect(x, y, d));
