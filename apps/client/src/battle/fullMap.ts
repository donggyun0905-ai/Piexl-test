// 관전용 전체 지도: 시드로 층 노선도를 만들어 모든 방을 밝히고, 플레이어 위치를 점으로
import { generateFloor, parseSeed, type BattlePlayer, type FloorMap } from "@pixel-rogue/shared";
import { drawRoute, MINIMAP_HEIGHT, MINIMAP_WIDTH, routeNodePos, ROUTE_NODE_H } from "../game/minimap";

/** 노선도를 몇 배로 키워 그릴지 */
const SCALE = 2;
export const PLAYER_COLORS = ["#ffffff", "#6ec6e8", "#f2c14e", "#7ed67e", "#e0805a", "#c77ce0", "#ff80c0", "#a0d040", "#9aa4b8", "#ffd040"];

export const FULL_MAP_WIDTH = MINIMAP_WIDTH * SCALE;
export const FULL_MAP_HEIGHT = MINIMAP_HEIGHT * SCALE;
const cache = new Map<string, FloorMap>();
export function floorMap(seedText: string, floor: number): FloorMap {
  const key = `${seedText}/${floor}`;
  let map = cache.get(key);
  if (!map) {
    map = generateFloor(parseSeed(seedText), floor);
    cache.set(key, map);
  }
  return map;
}

/** 한 층 지도 + 그 층에 있는 플레이어 (색 = 순서) */
export function drawFullMap(
  ctx: CanvasRenderingContext2D,
  seedText: string,
  floor: number,
  players: readonly BattlePlayer[],
  order: readonly string[],
): void {
  const map = floorMap(seedText, floor);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.scale(SCALE, SCALE);
  drawRoute(ctx, map);
  ctx.restore();
  const here = players.filter((p) => p.floor === floor && p.state === "alive");
  const perRoom = new Map<number, number>();
  here.forEach((p) => {
    const r = map.rooms[p.roomId];
    if (!r) return;
    const i = perRoom.get(p.roomId) ?? 0;
    perRoom.set(p.roomId, i + 1);
    const k = order.indexOf(p.pid);
    const pos = routeNodePos(map, r.layer, r.lane);
    // 방 칸 아래쪽에 한 줄로 (넘치면 위로)
    const x = pos.x * SCALE + 1 + (i % 4) * 4;
    const y = (pos.y + ROUTE_NODE_H) * SCALE - 4 - Math.floor(i / 4) * 4;
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 1, y - 1, 5, 5);
    ctx.fillStyle = PLAYER_COLORS[k % PLAYER_COLORS.length]!;
    ctx.fillRect(x, y, 3, 3);
  });
}
