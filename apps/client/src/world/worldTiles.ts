// 세계 지도 땅 종류 (docs/WORLD_MAP.md): 지도 그림(PNG) 한 픽셀 = 한 칸, 픽셀 색(key)으로 땅 종류를 고름
// 지도 그림 생성기 scripts/art/world_map.py의 색표와 같아야 함 · 그리기 색은 worldArt

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
} as const;
export type WorldTile = (typeof WT)[keyof typeof WT];

export interface TileDef {
  /** 지도 그림의 픽셀 색 */
  key: readonly [number, number, number];
  /** 못 지나감 */
  solid: boolean;
  /** 그리기: 바탕색 · 점 색 둘 */
  base: string;
  dots: readonly [string, string];
}

/** 순서 = WT 번호 */
export const TILE_DEFS: readonly TileDef[] = [
  { key: [0, 0, 0], solid: true, base: "#0c0a12", dots: ["#0c0a12", "#0c0a12"] },
  { key: [80, 168, 72], solid: false, base: "#4f9a46", dots: ["#5cae50", "#43863c"] },
  { key: [200, 168, 112], solid: false, base: "#c4a46c", dots: ["#d2b47c", "#b0905a"] },
  { key: [56, 120, 216], solid: true, base: "#3a78d0", dots: ["#5a96e6", "#2f68ba"] },
  { key: [24, 56, 144], solid: true, base: "#1f3c8e", dots: ["#2a4ca4", "#18307a"] },
  { key: [232, 216, 152], solid: false, base: "#e2d294", dots: ["#ecdfa8", "#d0be7c"] },
  { key: [24, 96, 40], solid: true, base: "#4f9a46", dots: ["#5cae50", "#43863c"] },
  { key: [120, 112, 128], solid: true, base: "#7a7284", dots: ["#8c8496", "#645e6e"] },
  { key: [176, 160, 144], solid: false, base: "#a89a8a", dots: ["#b8aa9a", "#968878"] },
  { key: [104, 88, 72], solid: true, base: "#6a5a4a", dots: ["#7c6a58", "#56483a"] },
  { key: [152, 104, 56], solid: false, base: "#956434", dots: ["#a87442", "#7c5228"] },
  { key: [240, 244, 252], solid: false, base: "#e8eef8", dots: ["#ffffff", "#ccd6e8"] },
  { key: [232, 120, 168], solid: false, base: "#4f9a46", dots: ["#f08ab4", "#ffe066"] },
  { key: [216, 192, 72], solid: false, base: "#c8b04a", dots: ["#dcc45a", "#b09838"] },
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
