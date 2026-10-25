import { LANES, MAX_LAYERS, type FloorMap, type RoomType, type RunState } from "@pixel-rogue/shared";

// ───────── 노선도 (층 갈림길 지도) ─────────
// 아래 시작 방 → 위 보스방. 방 종류는 처음부터 다 보이고, 지나온 길은 밝게

export const ROOM_COLORS: Record<RoomType, string> = {
  start: "#9a90b0",
  combat: "#6a6284",
  elite: "#e0805a",
  rest: "#6ec6e8",
  treasure: "#f2c14e",
  shop: "#7ed67e",
  /** 보스방 (계단) */
  exit: "#e05a5a",
  /** 황금방 (라스트 보스 층) */
  golden: "#ffd84a",
};

/** 방 종류 표시 (5×5 점 그림, # = 칠함) */
export const ROOM_GLYPHS: Record<RoomType, readonly string[]> = {
  start: ["..#..", ".###.", "#####", ".#.#.", ".###."],
  combat: ["....#", "...#.", "#.#..", ".##..", "#.#.."],
  elite: ["#...#", ".#.#.", "..#..", ".#.#.", "#...#"],
  rest: ["..#..", ".###.", "#####", "#####", ".###."],
  treasure: [".###.", "#####", "#.#.#", "#####", "#####"],
  shop: [".###.", "#.#.#", ".###.", "#.#.#", ".###."],
  exit: ["#.#.#", "#####", "#####", "#...#", "#####"],
  golden: ["#.#.#", ".###.", "#####", ".###.", "#.#.#"],
};

export function drawGlyph(ctx: CanvasRenderingContext2D, type: RoomType, x: number, y: number, color: string, px = 1): void {
  ctx.fillStyle = color;
  ROOM_GLYPHS[type].forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] === "#") ctx.fillRect(x + i * px, y + j * px, px, px);
  });
}

const NODE_W = 9;
const NODE_H = 7;
const GAP_X = 3;
const GAP_Y = 5;

/** 지금 방 테두리가 잘리지 않게 둘레에 두는 여백 */
const PAD = 1;

/** 칸 수만큼의 노선도 높이 (가장 긴 층 = MAX_LAYERS) */
export function routeHeight(layers: number): number {
  return layers * (NODE_H + GAP_Y) - GAP_Y + PAD * 2;
}
export const MINIMAP_WIDTH = LANES * (NODE_W + GAP_X) - GAP_X + PAD * 2;
export const MINIMAP_HEIGHT = routeHeight(MAX_LAYERS);

/** 방 칸의 왼쪽 위 (시작 방이 맨 아래) */
export function routeNodePos(map: FloorMap, layer: number, lane: number): { x: number; y: number } {
  return { x: PAD + lane * (NODE_W + GAP_X), y: PAD + (map.layers - 1 - layer) * (NODE_H + GAP_Y) };
}
export const ROUTE_NODE_W = NODE_W;
export const ROUTE_NODE_H = NODE_H;

/** 노선도 그리기. visited가 없으면 모든 방을 밝게 (관전 지도) */
export function drawRoute(ctx: CanvasRenderingContext2D, map: FloorMap, visited?: (id: number) => boolean, current = -1): void {
  const lit = (id: number) => !visited || visited(id);
  // 길 (지나온 길은 밝게)
  for (const r of map.rooms) {
    const a = routeNodePos(map, r.layer, r.lane);
    for (const n of r.exits) {
      if (n < 0) continue;
      const to = map.rooms[n]!;
      const b = routeNodePos(map, to.layer, to.lane);
      ctx.strokeStyle = visited && lit(r.id) && lit(n) ? "#d8d0f0" : "#4a4262";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x + NODE_W / 2, a.y);
      ctx.lineTo(b.x + NODE_W / 2, b.y + NODE_H);
      ctx.stroke();
    }
  }
  for (const r of map.rooms) {
    const { x, y } = routeNodePos(map, r.layer, r.lane);
    ctx.globalAlpha = lit(r.id) || r.id === current ? 1 : 0.5;
    ctx.fillStyle = ROOM_COLORS[r.type];
    ctx.fillRect(x, y, NODE_W, NODE_H);
    drawGlyph(ctx, r.type, x + 2, y + 1, "#1a1622");
    ctx.globalAlpha = 1;
    if (r.id === current) {
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(x - 0.5, y - 0.5, NODE_W + 1, NODE_H + 1);
    }
  }
}

/** 게임 중 노선도 (캔버스 높이를 이 층 칸 수에 맞춤) */
export function drawMinimap(ctx: CanvasRenderingContext2D, s: RunState): void {
  const h = routeHeight(s.map.layers);
  if (ctx.canvas.height !== h) ctx.canvas.height = h;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawRoute(ctx, s.map, (id) => s.rooms[id]?.visited === true, s.roomId);
}
