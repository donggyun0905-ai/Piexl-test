// 로비 맵: 라스트 보스방 크기(21×13칸, 칸 16픽셀). 벽 · 게임기 8대 자리 · 꾸밈 자리 · 부딪히는 곳
export const LOBBY_COLS = 21;
export const LOBBY_ROWS = 13;
export const TILE = 16;
export const LOBBY_W = LOBBY_COLS * TILE;
export const LOBBY_H = LOBBY_ROWS * TILE;
/** 벽 두께 (위는 2칸 높이로 보임) */
export const WALL_TOP = TILE * 2;
export const WALL_SIDE = TILE;

export type GameId = "blackjack" | "tiles" | "apples" | "slots" | "dice" | "hilo" | "blocks" | "joker";
export const GAME_IDS: readonly GameId[] = ["blackjack", "tiles", "apples", "blocks", "joker", "slots", "dice", "hilo"];

export interface Machine {
  game: GameId;
  /** 게임기 가운데 아래(발 쪽) */
  x: number;
  y: number;
  /** 화면 색 */
  color: string;
}

/** 위 벽에 4대 · 왼쪽 벽 2대 · 오른쪽 벽 2대 (도박 3종은 오른쪽 아래 구석에 모아 둠) */
export const MACHINES: readonly Machine[] = [
  { game: "blackjack", x: 3.5 * TILE, y: 3.6 * TILE, color: "#5ad08a" },
  { game: "tiles", x: 7.5 * TILE, y: 3.6 * TILE, color: "#ffb84a" },
  { game: "apples", x: 13.5 * TILE, y: 3.6 * TILE, color: "#ff5a6a" },
  { game: "blocks", x: 17.5 * TILE, y: 3.6 * TILE, color: "#5ab8ff" },
  { game: "joker", x: 1.9 * TILE, y: 7.4 * TILE, color: "#c88aff" },
  { game: "slots", x: 19.1 * TILE, y: 6.4 * TILE, color: "#ffd84a" },
  { game: "dice", x: 19.1 * TILE, y: 9.0 * TILE, color: "#f4f4f4" },
  { game: "hilo", x: 16.6 * TILE, y: 11.4 * TILE, color: "#ff8a3a" },
];
export const MACHINE_W = 18;
export const MACHINE_H = 26;
/** 이 거리 안이면 F로 들어감 */
export const NEAR = 22;

/** 꾸밈 자리 (테마마다 다른 물건). solid = 부딪힘 */
export interface DecorSlot {
  x: number;
  y: number;
  solid: boolean;
  size: "big" | "small";
}
export const DECOR: readonly DecorSlot[] = [
  { x: 10.5 * TILE, y: 7 * TILE, solid: true, size: "big" },
  { x: 5.5 * TILE, y: 10.4 * TILE, solid: true, size: "big" },
  { x: 10.5 * TILE, y: 3.4 * TILE, solid: false, size: "small" },
  { x: 4.2 * TILE, y: 6.6 * TILE, solid: false, size: "small" },
  { x: 15.6 * TILE, y: 7.6 * TILE, solid: false, size: "small" },
  { x: 8.4 * TILE, y: 11.6 * TILE, solid: false, size: "small" },
  { x: 13.2 * TILE, y: 11.2 * TILE, solid: true, size: "big" },
  { x: 3 * TILE, y: 11.6 * TILE, solid: false, size: "small" },
  { x: 12.6 * TILE, y: 9.4 * TILE, solid: false, size: "small" },
  { x: 7.2 * TILE, y: 8.4 * TILE, solid: false, size: "small" },
  { x: 16 * TILE, y: 9.6 * TILE, solid: false, size: "small" },
  { x: 2 * TILE, y: 4.4 * TILE, solid: false, size: "small" },
];

/** 들어온 자리 (아래 가운데) */
export const START = { x: LOBBY_W / 2, y: LOBBY_H - TILE * 1.6 };

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** 부딪히는 상자들 (게임기 · 큰 꾸밈) */
const BLOCKS: Box[] = [
  ...MACHINES.map((m) => ({ x0: m.x - MACHINE_W / 2, y0: m.y - 8, x1: m.x + MACHINE_W / 2, y1: m.y })),
  ...DECOR.filter((d) => d.solid).map((d) => ({ x0: d.x - 12, y0: d.y - 6, x1: d.x + 12, y1: d.y + 2 })),
];

/** (x, y)에 반지름 r 몸이 설 수 있는지 */
export function canStand(x: number, y: number, r: number): boolean {
  if (x - r < WALL_SIDE || x + r > LOBBY_W - WALL_SIDE || y - r < WALL_TOP + 4 || y + r > LOBBY_H - 4) return false;
  return !BLOCKS.some((b) => x + r > b.x0 && x - r < b.x1 && y + r > b.y0 && y - r < b.y1);
}

/** 가장 가까운 게임기 (NEAR 안) */
export function nearMachine(x: number, y: number): Machine | null {
  let best: Machine | null = null;
  let bd = NEAR * NEAR;
  for (const m of MACHINES) {
    const d = (m.x - x) ** 2 + (m.y + 4 - y) ** 2;
    if (d < bd) {
      bd = d;
      best = m;
    }
  }
  return best;
}
