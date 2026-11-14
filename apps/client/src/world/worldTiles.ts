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
  /** 성채 (막힘): 돌로 지은 큰 건물, 앞 가운데 큰 문 → 안 지도 */
  keep: 16,
  /** 실내: 나무 바닥 · 벽(막힘, 아래가 바닥이면 앞면) · 카펫 */
  woodFloor: 17,
  innerWall: 18,
  carpet: 19,
  /** 테라코어: 철판 바닥 · 철길(걸을 수 있음) · 공장(막힘, 굴뚝) · 파이프(막힘) · 콜로세움 돌벽(막힘) */
  metal: 20,
  rail: 21,
  factory: 22,
  pipe: 23,
  arena: 24,
  /** 비르디아: 이끼 숲 바닥(걸음) · 거대 나무(막힘, 3칸 폭이면 나무 집 문) · 생울타리 성벽(막힘) */
  moss: 25,
  bigTree: 26,
  hedge: 27,
  /** 헬리오스: 대리석 광장 · 붉은 벽돌길 · 금빛 테 돌바닥(걸음) · 황금 궁전 · 제국 집(막힘, 앞 가운데 문) */
  marble: 28,
  redBrick: 29,
  goldStone: 30,
  palace: 31,
  villa: 32,
  /** 사막: 모래 언덕 · 자갈 · 갈라진 땅 · 묻힌 돌길(걸음) · 오아시스 물 · 사암 신전·옛 성벽(막힘) */
  dune: 33,
  gravel: 34,
  cracked: 35,
  buriedRoad: 36,
  oasis: 37,
  temple: 38,
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
  { key: [96, 96, 168], solid: true },
  { key: [184, 136, 88], solid: false },
  { key: [56, 44, 64], solid: true },
  { key: [168, 32, 48], solid: false },
  { key: [140, 150, 160], solid: false },
  { key: [90, 70, 60], solid: false },
  { key: [180, 90, 40], solid: true },
  { key: [60, 140, 140], solid: true },
  { key: [210, 190, 150], solid: true },
  { key: [60, 110, 70], solid: false },
  { key: [110, 70, 40], solid: true },
  { key: [40, 130, 90], solid: true },
  { key: [236, 232, 220], solid: false },
  { key: [150, 50, 40], solid: false },
  { key: [200, 180, 120], solid: false },
  { key: [230, 180, 40], solid: true },
  { key: [210, 120, 100], solid: true },
  { key: [226, 196, 120], solid: false },
  { key: [170, 130, 100], solid: false },
  { key: [200, 140, 90], solid: false },
  { key: [190, 170, 130], solid: false },
  { key: [60, 200, 190], solid: true },
  { key: [160, 110, 60], solid: true },
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
