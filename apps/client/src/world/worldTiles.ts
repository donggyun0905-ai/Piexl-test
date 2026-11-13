// 세계 지도 땅 종류 (docs/WORLD_MAP.md): 지도 그림(PNG) 한 픽셀 = 한 칸, 픽셀 색(key)으로 땅 종류를 고름
// 지도 그림 생성기 scripts/art/world_map.py의 색표와 같아야 함 · 그리기 색은 worldGround(땅)·worldArt(꾸밈)

export const WT = {
  /** 지도 밖·빈 곳 (막힘) */
  none: 0,
  grass: 1,
  path: 2,
  water: 3,
  deep: 4,
  sand: 5,
  tree: 6,
  wall: 7,
  floor: 8,
  rock: 9,
  bridge: 10,
  snow: 11,
  flower: 12,
  field: 13,
  /** 나무 울타리 (막힘) */
  fence: 14,
  /** 집 (막힘): 이어진 덩어리를 지붕·앞벽으로 그림 */
  house: 15,
} as const;
export type WorldTile = (typeof WT)[keyof typeof WT];

export interface TileDef {
  /** 지도 그림의 픽셀 색 */
  key: readonly [number, number, number];
  /** 못 지나감 */
  solid: boolean;
}

/** 순서 = WT 번호 */
export const TILE_DEFS: readonly TileDef[] = [
  { key: [0, 0, 0], solid: true },
  { key: [80, 168, 72], solid: false },
  { key: [200, 168, 112], solid: false },
  { key: [56, 120, 216], solid: true },
  { key: [24, 56, 144], solid: true },
  { key: [232, 216, 152], solid: false },
  { key: [24, 96, 40], solid: true },
  { key: [120, 112, 128], solid: true },
  { key: [176, 160, 144], solid: false },
  { key: [104, 88, 72], solid: true },
  { key: [152, 104, 56], solid: false },
  { key: [240, 244, 252], solid: false },
  { key: [232, 120, 168], solid: false },
  { key: [216, 192, 72], solid: false },
  { key: [168, 72, 40], solid: true },
  { key: [200, 64, 120], solid: true },
];

/** 픽셀 색 → 땅 종류 (딱 맞는 색이 없으면 가장 가까운 색) */
export function tileFromRgb(r: number, g: number, b: number): WorldTile {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < TILE_DEFS.length; i++) {
    const [kr, kg, kb] = TILE_DEFS[i]!.key;
    const d = (kr - r) ** 2 + (kg - g) ** 2 + (kb - b) ** 2;
    if (d === 0) return i as WorldTile;
    if (d < bestD) [best, bestD] = [i, d];
  }
  return best as WorldTile;
}

export const isSolid = (t: number): boolean => TILE_DEFS[t]?.solid ?? true;
