// 관리자가 직접 만든 맵 (관리자 '맵 만들기'에서 칸을 드래그로 깔아 만들고 서버에 저장 → 판을 시작할 때 화면이 받아 씀)
// 종류: 던전 방 모양(13×7, 연습장에서도 고를 수 있음) · 광야의 새벽 맵(64×40) · 타워 디펜스 맵(20×12)
// 칸은 글자 한 줄씩: "." 바닥 · "#" 벽 · "o" 기둥·바위 · "~" 깊은 물(구덩이) · "w" 얕은 물 · "m" 진흙 · "l" 용암 · "x" 가시 함정 · "T" 미사일 타워(광야) · "p" 길 · "g" 지킬 곳(타워 디펜스)
// 게임에 넣는 곳: 던전 방은 sim/layout(방 모양)·sim/terrain(지형) · 광야의 새벽은 swarmMaps · 타워 디펜스는 tdMaps
import { SWARM } from "./swarmDefs";
import { TD_COLS, TD_ROWS } from "./tdMaps";

export type MapKind = "room" | "swarm" | "td";
export const MAP_KINDS: readonly MapKind[] = ["room", "swarm", "td"];

/** 종류마다 크기 (칸) */
export const MAP_SIZE: Record<MapKind, { cols: number; rows: number }> = {
  room: { cols: 13, rows: 7 },
  swarm: { cols: SWARM.cols, rows: SWARM.rows },
  td: { cols: TD_COLS, rows: TD_ROWS },
};

/** 칸 글자와 쓸 수 있는 종류 */
export const MAP_TILES: Record<string, readonly MapKind[]> = {
  ".": ["room", "swarm", "td"],
  "#": ["room", "swarm"],
  o: ["room", "swarm", "td"],
  "~": ["room", "swarm", "td"],
  w: ["room"],
  m: ["room", "swarm"],
  l: ["room", "swarm"],
  x: ["room"],
  T: ["swarm"],
  p: ["td"],
  g: ["td"],
};

export interface CustomMap {
  /** 짧은 이름표 (영문·숫자, 저장소 안에서 겹치지 않게) */
  id: string;
  kind: MapKind;
  /** 화면에 보이는 이름 */
  name: string;
  /** 줄마다 칸 글자 */
  tiles: string[];
}

/** 저장할 수 있는 맵 수 */
export const MAP_LIMIT = 60;

/** 빈 맵 (모두 바닥) */
export function blankMap(kind: MapKind, id: string, name: string): CustomMap {
  const { cols, rows } = MAP_SIZE[kind];
  return { id, kind, name, tiles: Array.from({ length: rows }, () => ".".repeat(cols)) };
}

/** 받은 값 다듬기: 모르는 종류·크기 틀린 맵은 버리고, 그 종류에 없는 칸 글자는 바닥으로 */
export function cleanMaps(raw: unknown): CustomMap[] {
  if (!Array.isArray(raw)) return [];
  const out: CustomMap[] = [];
  const ids = new Set<string>();
  for (const m of raw.slice(0, MAP_LIMIT)) {
    if (!m || typeof m !== "object") continue;
    const { id, kind, name, tiles } = m as Partial<CustomMap>;
    if (typeof id !== "string" || !/^[a-z0-9-]{1,24}$/.test(id) || ids.has(id) || !MAP_KINDS.includes(kind as MapKind) || !Array.isArray(tiles)) continue;
    const { cols, rows } = MAP_SIZE[kind as MapKind];
    if (tiles.length !== rows) continue;
    const clean = tiles.map((row) => {
      const s = typeof row === "string" ? row.slice(0, cols).padEnd(cols, ".") : ".".repeat(cols);
      return [...s].map((ch) => (MAP_TILES[ch]?.includes(kind as MapKind) ? ch : ".")).join("");
    });
    ids.add(id);
    out.push({ id, kind: kind as MapKind, name: typeof name === "string" ? name.slice(0, 30) : id, tiles: clean });
  }
  return out;
}

let current: CustomMap[] = [];
const listeners: ((maps: readonly CustomMap[]) => void)[] = [];

/** 서버에서 받은 맵 넣기 (판을 시작하기 전에) */
export function setCustomMaps(raw: unknown): void {
  current = cleanMaps(raw);
  for (const f of listeners) f(current);
}

/** 맵이 바뀔 때 부를 것 (광야의 새벽·타워 디펜스 맵 목록에 넣기) */
export function onCustomMaps(f: (maps: readonly CustomMap[]) => void): void {
  listeners.push(f);
  f(current);
}

/** 그 종류의 직접 만든 맵 */
export const customMaps = (kind: MapKind): CustomMap[] => current.filter((m) => m.kind === kind);

/** 맵에서 그 글자인 칸 [열, 행] 목록 */
export function cellsOf(tiles: readonly string[], ch: string): [number, number][] {
  const out: [number, number][] = [];
  tiles.forEach((row, r) => [...row].forEach((c, col) => c === ch && out.push([col, r])));
  return out;
}

/** 그 글자인 칸을 가로로 이어 묶은 네모 [열, 행, 너비, 1] */
export function tileRuns(tiles: readonly string[], ch: string): [number, number, number, number][] {
  const out: [number, number, number, number][] = [];
  tiles.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] !== ch) continue;
      let e = c;
      while (row[e + 1] === ch) e++;
      out.push([c, r, e - c + 1, 1]);
      c = e;
    }
  });
  return out;
}
