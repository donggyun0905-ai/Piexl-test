// 광야의 새벽 맵 5개 · 난이도 3단계 (계산은 sim/swarmTerrain). 들판 크기는 SWARM.cols × rows (64 × 40칸)
// 칸 좌표 [열, 행, 너비, 높이]. 가운데(32, 20) 둘레는 비워 둠 (시작 자리)

export type SwarmMapId = "plains" | "ruins" | "fort" | "swamp" | "volcano";
export const SWARM_MAP_IDS: readonly SwarmMapId[] = ["plains", "ruins", "fort", "swamp", "volcano"];

type Rect = readonly [number, number, number, number];

export interface SwarmMapDef {
  /** 막는 벽(건물) · 낮은 바위(기둥) · 물웅덩이(구덩이: 사람·적 모두 못 지나감) */
  walls: readonly Rect[];
  rocks: readonly Rect[];
  ponds: readonly Rect[];
  /** 나를 돕는 미사일 타워 자리 [열, 행] */
  towers: readonly (readonly [number, number])[];
  /** 밟으면 느려지는 진흙 · 밟으면 데는 용암 */
  mud: readonly Rect[];
  lava: readonly Rect[];
  /** 맵 자체의 세기 (적 체력·나오는 수에 곱함) · 이벤트 코인 배율 */
  power: number;
  coinMul: number;
}

const NONE: readonly never[] = [];

export const SWARM_MAPS: Record<SwarmMapId, SwarmMapDef> = {
  /** 탁 트인 들판 */
  plains: { walls: NONE, rocks: NONE, ponds: NONE, towers: NONE, mud: NONE, lava: NONE, power: 1, coinMul: 1 },
  /** 폐허 도시: 무너진 건물 사이 좁은 골목 */
  ruins: {
    walls: [[6, 5, 7, 5], [18, 4, 5, 6], [40, 5, 6, 5], [52, 4, 6, 7], [6, 28, 6, 6], [19, 30, 7, 5], [40, 29, 5, 6], [51, 28, 7, 6], [26, 10, 3, 4], [36, 26, 3, 4], [10, 16, 4, 3], [50, 18, 4, 3]],
    rocks: [[30, 6, 1, 1], [33, 33, 1, 1], [45, 15, 1, 1], [16, 24, 1, 1]],
    ponds: NONE,
    towers: NONE,
    mud: NONE,
    lava: NONE,
    power: 1.1,
    coinMul: 1.2,
  },
  /** 변경 요새: 돌벽과 나를 돕는 미사일 타워 넷 */
  fort: {
    walls: [[14, 8, 12, 1], [38, 8, 12, 1], [14, 31, 12, 1], [38, 31, 12, 1], [14, 9, 1, 7], [49, 9, 1, 7], [14, 24, 1, 7], [49, 24, 1, 7]],
    rocks: [[8, 19, 2, 2], [54, 19, 2, 2], [31, 3, 2, 2], [31, 35, 2, 2]],
    ponds: NONE,
    towers: [[20, 14], [44, 14], [20, 26], [44, 26]],
    mud: NONE,
    lava: NONE,
    power: 1.25,
    coinMul: 1.4,
  },
  /** 독 늪: 물웅덩이가 길을 막고 진흙이 발을 잡음 */
  swamp: {
    walls: NONE,
    rocks: [[12, 12, 1, 1], [50, 26, 1, 1], [40, 8, 1, 1], [22, 30, 1, 1]],
    ponds: [[4, 4, 9, 6], [48, 5, 10, 5], [5, 29, 8, 7], [47, 30, 11, 6], [24, 2, 6, 3], [33, 35, 7, 3]],
    towers: NONE,
    mud: [[16, 12, 10, 6], [38, 22, 10, 6], [20, 25, 8, 5], [37, 10, 8, 5]],
    lava: NONE,
    power: 1.35,
    coinMul: 1.6,
  },
  /** 화산 지대: 바위가 흩어지고 곳곳에 용암 */
  volcano: {
    walls: [[8, 8, 4, 4], [52, 8, 4, 4], [8, 28, 4, 4], [52, 28, 4, 4]],
    rocks: [[20, 6, 2, 2], [42, 6, 2, 2], [20, 32, 2, 2], [42, 32, 2, 2], [15, 19, 2, 2], [47, 19, 2, 2]],
    ponds: NONE,
    towers: NONE,
    mud: NONE,
    lava: [[24, 10, 6, 4], [36, 26, 6, 4], [4, 17, 6, 6], [54, 17, 6, 6], [28, 30, 4, 3], [33, 6, 4, 3]],
    power: 1.5,
    coinMul: 2,
  },
};

/** 난이도: 보통 · 어려움 · 지옥 (적 체력·나오는 수·받는 피해 배율 · 처음 깨면 이벤트 코인, 다시 깨면 repeat) */
export const SWARM_LEVELS = [
  { hp: 1, spawn: 1, taken: 1, coins: 5, repeat: 1 },
  { hp: 1.6, spawn: 1.3, taken: 1.35, coins: 10, repeat: 2 },
  { hp: 2.4, spawn: 1.7, taken: 1.8, coins: 20, repeat: 4 },
] as const;

/** 깼을 때 받는 이벤트 코인 (처음이면 coins, 다시면 repeat, 맵 배율) */
export const swarmCoins = (map: SwarmMapId, level: number, first: boolean) => {
  const l = SWARM_LEVELS[level] ?? SWARM_LEVELS[0];
  return Math.round((first ? l.coins : l.repeat) * SWARM_MAPS[map].coinMul);
};

/** 타워: 쏘는 간격(틱) · 사거리 · 피해(1분마다 +15%) · 폭발 범위 · 탄 빠르기 · 진흙 속 빠르기 배율 · 용암 피해(0.5초마다) */
export const SWARM_TERRAIN = { towerEvery: 45, towerRange: 170, towerDamage: 14, towerBlast: 22, missileSpeed: 3.2, mudSlow: 0.5, lavaDamage: 6 };
