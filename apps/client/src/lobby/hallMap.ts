// 로비 전시장 지도: 라스트 보스방 크기(29×17칸). 로비 위 벽 가운데 문 ↔ 전시장 아래 벽 가운데 문 · 전시물 자리 · 부딪히는 곳
import { TILE, WALL_SIDE, WALL_TOP } from "./lobbyMap";
import type { ExhibitId } from "./exhibits";

export const HALL_COLS = 29;
export const HALL_ROWS = 17;
export const HALL_W = HALL_COLS * TILE;
export const HALL_H = HALL_ROWS * TILE;

/** 로비 위 벽 가운데 문 (가로 가운데 x · 폭) → 전시장 */
export const LOBBY_DOOR = { x: 10.5 * TILE, w: 22 };
/** 전시장 아래 벽 가운데 문 → 로비 */
export const HALL_DOOR = { x: HALL_W / 2, w: 26 };
/** 전시장에 들어와 서는 곳 · 로비로 돌아와 서는 곳 */
export const HALL_START = { x: HALL_W / 2, y: HALL_H - TILE * 1.6 };
export const LOBBY_BACK = { x: LOBBY_DOOR.x, y: WALL_TOP + 18 };

/** 전시물 자리 (가운데 아래 = 바닥에 닿는 곳) · 부딪히는 크기 (반폭 · 위로 높이) */
export interface ExhibitSpot {
  id: ExhibitId;
  x: number;
  y: number;
  hw: number;
  hh: number;
}
export const EXHIBIT_SPOTS: readonly ExhibitSpot[] = [
  /** 월계선: 가운데 위 큰 받침대 위 거대한 방주 */
  { id: "laurelShip", x: HALL_W / 2, y: 8.6 * TILE, hw: 7.6 * TILE, hh: 2.6 * TILE },
  /** 영혼 조각: 왼쪽 아래 유리 덮개 받침대 */
  { id: "soulShard", x: 5 * TILE, y: 12.4 * TILE, hw: 10, hh: 10 },
];

/** 가운데 기록집 (들어오자마자 보이는 책 받침대, F = 기록 보기) */
export const BOOK = { x: HALL_W / 2, y: 12 * TILE };
/** 가까이 가면 F로 기록 창이 열리는 것: 전시물 또는 기록집 */
export type HallSpot = ExhibitId | "book";

/** 아직 빈 받침대 (나중에 동상 등) */
export const EMPTY_PLINTHS: readonly { x: number; y: number }[] = [
  { x: 24 * TILE, y: 12.4 * TILE },
  { x: 5 * TILE, y: 5.4 * TILE },
  { x: 24 * TILE, y: 5.4 * TILE },
];

/** 기둥 (양옆 벽을 따라, 부딪힘) */
export const PILLARS: readonly { x: number; y: number }[] = [3, 7.5, 12].flatMap((r) => [
  { x: 2.2 * TILE, y: r * TILE + 26 },
  { x: HALL_W - 2.2 * TILE, y: r * TILE + 26 },
]);

/** (x, y)에 반지름 r 몸이 설 수 있는지 (shown = 놓인 전시물) */
export function canStandHall(x: number, y: number, r: number, shown: readonly ExhibitId[]): boolean {
  if (x - r < WALL_SIDE || x + r > HALL_W - WALL_SIDE || y - r < WALL_TOP + 4 || y + r > HALL_H - 4) return false;
  const boxes = [
    ...EXHIBIT_SPOTS.filter((e) => shown.includes(e.id)).map((e) => ({ x0: e.x - e.hw, y0: e.y - e.hh, x1: e.x + e.hw, y1: e.y })),
    ...[...EMPTY_PLINTHS, ...EXHIBIT_SPOTS.filter((e) => e.id === "soulShard")].map((p) => ({ x0: p.x - 10, y0: p.y - 8, x1: p.x + 10, y1: p.y })),
    ...PILLARS.map((p) => ({ x0: p.x - 6, y0: p.y - 6, x1: p.x + 6, y1: p.y })),
    { x0: BOOK.x - 8, y0: BOOK.y - 6, x1: BOOK.x + 8, y1: BOOK.y },
  ];
  return !boxes.some((b) => x + r > b.x0 && x - r < b.x1 && y + r > b.y0 && y - r < b.y1);
}

/** 가까운 전시물·기록집 (이름표 안내 · F) */
export function nearExhibit(x: number, y: number, shown: readonly ExhibitId[]): HallSpot | null {
  if (Math.hypot(x - BOOK.x, y - BOOK.y + 3) < 20) return "book";
  for (const e of EXHIBIT_SPOTS) {
    if (!shown.includes(e.id)) continue;
    const dx = Math.max(0, Math.abs(x - e.x) - e.hw);
    const dy = Math.max(0, e.y - e.hh - y, y - e.y);
    if (Math.hypot(dx, dy) < 22) return e.id;
  }
  return null;
}
