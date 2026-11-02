// 관리자가 만든 맵을 게임 맵으로 바꿔 넣기: 광야의 새벽(CUSTOM_SWARM) · 타워 디펜스(CUSTOM_TD, 길은 "p" 칸을 따라 찾음)
// 던전 방 모양은 판을 시작할 때 run.customRooms로 넣음 (sim/customRooms)
import { cellsOf, onCustomMaps, tileRuns, type CustomMap } from "./customMaps";
import { CUSTOM_SWARM, type SwarmMapDef } from "./swarmMaps";
import { CUSTOM_TD, TD_COLS, TD_ROWS, type TdMapDef } from "./tdMaps";

type Cell = readonly [number, number];

/** 광야의 새벽 맵: 칸 글자를 벽·바위·물웅덩이·진흙·용암·타워로 */
export function swarmFromTiles(tiles: readonly string[]): SwarmMapDef {
  return {
    walls: tileRuns(tiles, "#"),
    rocks: tileRuns(tiles, "o"),
    ponds: tileRuns(tiles, "~"),
    mud: tileRuns(tiles, "m"),
    lava: tileRuns(tiles, "l"),
    towers: cellsOf(tiles, "T"),
    power: 1,
    coinMul: 1,
  };
}

/** 가장자리에서 지킬 곳(g)까지 길(p) 칸을 따라가는 가장 짧은 길 (꺾이는 점만) */
function walk(start: Cell, goal: Cell, open: (c: number, r: number) => boolean): Cell[] | null {
  const key = (c: number, r: number) => r * TD_COLS + c;
  const from = new Map<number, number>([[key(...start), -1]]);
  const queue: Cell[] = [start];
  for (let i = 0; i < queue.length; i++) {
    const [c, r] = queue[i]!;
    if (c === goal[0] && r === goal[1]) break;
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nc = c + dc;
      const nr = r + dr;
      if (!open(nc, nr) || from.has(key(nc, nr))) continue;
      from.set(key(nc, nr), key(c, r));
      queue.push([nc, nr]);
    }
  }
  if (!from.has(key(...goal))) return null;
  const cells: Cell[] = [];
  for (let k = key(...goal); k >= 0; k = from.get(k)!) cells.unshift([k % TD_COLS, Math.floor(k / TD_COLS)]);
  // 곧게 이어지는 가운데 점은 뺌
  return cells.filter((p, i) => {
    const a = cells[i - 1];
    const b = cells[i + 1];
    return !a || !b || a[0] - p[0] !== p[0] - b[0] || a[1] - p[1] !== p[1] - b[1];
  });
}

/** 타워 디펜스 맵: 길(p)이 가장자리에서 시작해 지킬 곳(g)에 닿아야 함 (못 찾으면 null) */
export function tdFromTiles(id: string, name: string, tiles: readonly string[]): TdMapDef | null {
  const goal = cellsOf(tiles, "g")[0];
  if (!goal) return null;
  const open = (c: number, r: number) => tiles[r]?.[c] === "p" || tiles[r]?.[c] === "g";
  const edge = ([c, r]: Cell) => c === 0 || r === 0 || c === TD_COLS - 1 || r === TD_ROWS - 1;
  const paths = cellsOf(tiles, "p")
    .filter(edge)
    .map((s) => walk(s, goal, open))
    .filter((p): p is Cell[] => !!p && p.length > 1)
    .slice(0, 4);
  if (!paths.length) return null;
  const blocks = [...cellsOf(tiles, "o"), ...cellsOf(tiles, "~")];
  return { id: `c-${id}`, theme: "meadow", name, paths, blocks, hpMul: 1, decor: 0 };
}

function register(maps: readonly CustomMap[]): void {
  CUSTOM_SWARM.clear();
  CUSTOM_TD.length = 0;
  for (const m of maps) {
    if (m.kind === "swarm") CUSTOM_SWARM.set(`c-${m.id}`, { def: swarmFromTiles(m.tiles), name: m.name });
    if (m.kind === "td") {
      const def = tdFromTiles(m.id, m.name, m.tiles);
      if (def) CUSTOM_TD.push(def);
    }
  }
}

onCustomMaps(register);
