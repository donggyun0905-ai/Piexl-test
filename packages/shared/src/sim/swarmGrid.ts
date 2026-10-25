// 광야의 새벽 맵 칸: 테두리 벽 + 맵의 건물(벽) · 바위(기둥) · 물웅덩이(구덩이). 맵마다 한 번 만들어 둠 (util.roomGrid가 씀)
import { SWARM } from "../swarmDefs";
import { SWARM_MAPS, type SwarmMapId } from "../swarmMaps";
import { TILE_FLOOR, TILE_PILLAR, TILE_PIT, TILE_WALL, type TileGrid } from "./layout";

const cache = new Map<SwarmMapId, TileGrid>();

export function swarmGrid(map: SwarmMapId): TileGrid {
  const hit = cache.get(map);
  if (hit) return hit;
  const C = SWARM.cols;
  const R = SWARM.rows;
  const g = new Uint8Array(C * R).fill(TILE_FLOOR);
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (r === 0 || c === 0 || r === R - 1 || c === C - 1) g[r * C + c] = TILE_WALL;
  const def = SWARM_MAPS[map];
  for (const [list, tile] of [[def.walls, TILE_WALL], [def.rocks, TILE_PILLAR], [def.ponds, TILE_PIT]] as const) {
    for (const [c0, r0, w, h] of list) for (let r = r0; r < r0 + h; r++) for (let c = c0; c < c0 + w; c++) if (c > 0 && r > 0 && c < C - 1 && r < R - 1) g[r * C + c] = tile;
  }
  cache.set(map, g);
  return g;
}
