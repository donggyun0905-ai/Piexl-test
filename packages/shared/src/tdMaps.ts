// 타워 디펜스 맵 8개 (지도 크기·길·꾸밈 종류, 마지막 심연의 균열은 별 7개로 가장 어려움). 길은 칸 [열, 행]을 가로·세로로 잇는 꺾은선, 마지막 점이 지킬 곳
// 테두리 한 칸은 울타리(길이 들어오고 나가는 곳만 열림), 타워는 안쪽 빈 칸에만 세움

/** 지도 크기 (칸) */
export const TD_COLS = 20;
export const TD_ROWS = 12;

export type TdTheme = "meadow" | "desert" | "frost" | "swamp" | "volcano" | "crystal" | "sky" | "abyss";

export interface TdMapDef {
  /** 기본 맵은 테마 이름 · 관리자가 만든 맵은 "c-이름표" */
  id: TdMapId;
  /** 그림 테마 (없으면 id) · 화면에 보이는 이름 (관리자가 만든 맵) */
  theme?: TdTheme;
  name?: string;
  /** 타워를 못 세우는 칸 [열, 행] (관리자가 만든 맵의 바위·물) */
  blocks?: readonly (readonly [number, number])[];
  /** 길 (여러 개면 적이 차례로 나눠 옴). 점은 [열, 행] */
  paths: readonly (readonly (readonly [number, number])[])[];
  /** 적 체력 배율 (어려운 맵일수록 큼) */
  hpMul: number;
  /** 꾸밈(나무·바위 등)이 놓이는 비율 (타워를 못 세우는 칸) */
  decor: number;
  /** 일반 적 수 배율 · 시작 목숨 (없으면 TD_RULES) · 시작 돈 배율 */
  countMul?: number;
  lives?: number;
  goldMul?: number;
}

export const TD_MAPS: readonly TdMapDef[] = [
  // 초록 들판: S자 한 길
  { id: "meadow", hpMul: 1, decor: 0.13, paths: [[[0, 2], [15, 2], [15, 6], [4, 6], [4, 9], [19, 9]]] },
  // 모래 협곡: 위에서 내려와 지그재그
  { id: "desert", hpMul: 1, decor: 0.1, paths: [[[2, 0], [2, 8], [6, 8], [6, 3], [10, 3], [10, 8], [14, 8], [14, 3], [17, 3], [17, 11]]] },
  // 얼음 호수: 바깥에서 안으로 도는 소용돌이
  { id: "frost", hpMul: 1.05, decor: 0.15, paths: [[[0, 1], [18, 1], [18, 10], [2, 10], [2, 4], [14, 4], [14, 7], [6, 7]]] },
  // 안개 늪: 두 입구가 가운데서 합쳐짐
  {
    id: "swamp",
    hpMul: 1.1,
    decor: 0.12,
    paths: [
      [[0, 2], [8, 2], [8, 6], [19, 6]],
      [[0, 10], [8, 10], [8, 6], [19, 6]],
    ],
  },
  // 용암 화산: 길게 구불구불
  { id: "volcano", hpMul: 1.1, decor: 0.1, paths: [[[0, 5], [3, 5], [3, 1], [8, 1], [8, 10], [12, 10], [12, 1], [16, 1], [16, 8], [19, 8]]] },
  // 수정 동굴: 두 길이 엇갈림
  {
    id: "crystal",
    hpMul: 1.2,
    decor: 0.1,
    paths: [
      [[0, 3], [13, 3], [13, 10], [19, 10]],
      [[0, 8], [6, 8], [6, 1], [19, 1]],
    ],
  },
  // 하늘 성채: 위에서 내려와 성벽을 한 바퀴 돌고 가운데 제단으로
  { id: "sky", hpMul: 1.25, decor: 0.12, paths: [[[9, 0], [9, 2], [2, 2], [2, 10], [17, 10], [17, 2], [12, 2], [12, 7], [7, 7], [7, 5]]] },
  // 심연의 균열 (별 7개): 세 갈래 길이 얽히며 가운데 균열로 모임 · 적 체력 2.4배 · 적 수 1.6배 · 목숨 10 · 시작 돈 80%
  {
    id: "abyss",
    hpMul: 2.4,
    decor: 0.16,
    countMul: 1.6,
    lives: 10,
    goldMul: 0.8,
    paths: [
      [[0, 2], [5, 2], [5, 4], [2, 4], [2, 9], [7, 9], [7, 5], [10, 5]],
      [[19, 2], [14, 2], [14, 4], [17, 4], [17, 9], [12, 9], [12, 6], [10, 6], [10, 5]],
      [[9, 11], [9, 10], [16, 10], [16, 8], [11, 8], [11, 5], [10, 5]],
    ],
  },
];

export type TdMapId = TdTheme | `c-${string}`;

/** 관리자가 만든 타워 디펜스 맵 (customMapUse가 채움) */
export const CUSTOM_TD: TdMapDef[] = [];

/** 맵 찾기 (모르는 맵은 첫 맵) · 그림 테마 */
export const tdMapDef = (id: TdMapId): TdMapDef => TD_MAPS.find((m) => m.id === id) ?? CUSTOM_TD.find((m) => m.id === id) ?? TD_MAPS[0]!;
export const tdThemeOf = (id: TdMapId): TdTheme => tdMapDef(id).theme ?? (tdMapDef(id).id as TdTheme);

/** 칸 종류: 0 빈 땅(타워 가능) · 1 길 · 2 꾸밈 · 3 울타리(테두리) */
export const TD_GROUND: number = 0;
export const TD_PATH: number = 1;
export const TD_DECOR: number = 2;
export const TD_EDGE: number = 3;

/** 칸마다 같은 값이 나오는 작은 해시 (꾸밈 자리) */
export function tileHash(col: number, row: number, salt: number): number {
  let h = (col * 374761393 + row * 668265263 + salt * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** 맵의 칸 배열 (행마다 열) */
export function tdTiles(map: TdMapDef): number[][] {
  const tiles = Array.from({ length: TD_ROWS }, (_row, r) =>
    Array.from({ length: TD_COLS }, (_col, c) => (r === 0 || c === 0 || r === TD_ROWS - 1 || c === TD_COLS - 1 ? TD_EDGE : TD_GROUND)),
  );
  for (const path of map.paths) {
    for (let i = 1; i < path.length; i++) {
      const [c0, r0] = path[i - 1]!;
      const [c1, r1] = path[i]!;
      const n = Math.max(Math.abs(c1 - c0), Math.abs(r1 - r0));
      for (let k = 0; k <= n; k++) tiles[r0 + Math.sign(r1 - r0) * k]![c0 + Math.sign(c1 - c0) * k] = TD_PATH;
    }
  }
  for (const [c, r] of map.blocks ?? []) if (tiles[r]?.[c] === TD_GROUND) tiles[r]![c] = TD_DECOR;
  const salt = TD_MAPS.indexOf(map) + 1;
  for (let r = 1; r < TD_ROWS - 1; r++) {
    for (let c = 1; c < TD_COLS - 1; c++) {
      // 길 바로 옆은 비워 둠 (근접 타워 자리)
      const nearPath = [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dc, dr]) => tiles[r + dr!]?.[c + dc!] === TD_PATH);
      if (tiles[r]![c] === TD_GROUND && !nearPath && tileHash(c, r, salt) < map.decor * 2.2) tiles[r]![c] = TD_DECOR;
    }
  }
  return tiles;
}
