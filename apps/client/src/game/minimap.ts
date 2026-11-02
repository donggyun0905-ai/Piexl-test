import { LANES, MAX_LAYERS, type FloorMap, type RoomInfo, type RoomType, type RunState } from "@pixel-rogue/shared";

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
  /** 여신의 선물 (라스트 보스 층, 하얀 방) */
  golden: "#f6f4ff",
  /** 단련의 방 (4층부터) */
  gym: "#c86aff",
  /** 시련의 방 (4층부터, 새빨간 방) */
  trial: "#ff2a3a",
  /** 제단의 방 (3층부터, 푸른 바다) */
  altar: "#3ab8ff",
  /** 비밀의 방 (금 간 벽 너머, 노선도에는 안 그림): 악마 · 도박꾼 · 경매장 · 히든 상점 */
  devil: "#7a1020",
  gamble: "#2e9a5a",
  auction: "#b88a2a",
  hidden: "#8a6ad8",
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
  golden: ["##.##", ".#.#.", "#####", "#.#.#", "#####"],
  gym: ["#...#", "##.##", "#####", "##.##", "#...#"],
  trial: [".###.", ".#.#.", ".###.", ".#.#.", "#####"],
  altar: ["#.#.#", ".###.", "##.##", ".###.", "#.#.#"],
  devil: ["#...#", "##.##", ".###.", ".#.#.", ".###."],
  gamble: ["#.#.#", ".....", "#####", "#.#.#", "#####"],
  auction: ["####.", "####.", ".##..", "..#..", ".###."],
  hidden: [".###.", "#...#", "..##.", ".....", "..#.."],
};

export function drawGlyph(ctx: CanvasRenderingContext2D, type: RoomType, x: number, y: number, color: string, px = 1): void {
  ctx.fillStyle = color;
  ROOM_GLYPHS[type].forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] === "#") ctx.fillRect(x + i * px, y + j * px, px, px);
  });
}

/** 방 칸 색·글자색: 천상의 방(여신의 선물·천상의 상점)은 하얀 바탕에 금빛 표시 */
export function roomLook(r: Pick<RoomInfo, "type" | "heaven">): { color: string; ink: string } {
  if (r.heaven) return { color: "#f6f4ff", ink: "#c89a2a" };
  return { color: ROOM_COLORS[r.type], ink: r.type === "golden" ? "#c89a2a" : "#1a1622" };
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
  // 비밀의 방(layer -1)은 노선도에 없음
  const rooms = map.rooms.filter((r) => r.layer >= 0);
  for (const r of rooms) {
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
  for (const r of rooms) {
    const { x, y } = routeNodePos(map, r.layer, r.lane);
    ctx.globalAlpha = lit(r.id) || r.id === current ? 1 : 0.5;
    const look = roomLook(r);
    ctx.fillStyle = look.color;
    ctx.fillRect(x, y, NODE_W, NODE_H);
    drawGlyph(ctx, r.type, x + 2, y + 1, look.ink);
    ctx.globalAlpha = 1;
    if (r.id === current) {
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(x - 0.5, y - 0.5, NODE_W + 1, NODE_H + 1);
    }
  }
}

/** 게임 중 노선도 창 크기: 칸 10개 층 크기로 고정 (칸이 더 많은 층은 창을 키우지 않고 안에서 줄여 그림) */
const BOX_LAYERS = 10;
/** 줄여 그려도 뭉개지지 않게 창 캔버스를 4배 촘촘하게 */
const BOX_RES = 4;
export const MINIMAP_BOX_W = MINIMAP_WIDTH * BOX_RES;
export const MINIMAP_BOX_H = routeHeight(BOX_LAYERS) * BOX_RES;

/** 게임 중 노선도 (창 가운데에, 넘치면 줄여서) */
export function drawMinimap(ctx: CanvasRenderingContext2D, s: RunState): void {
  const h = routeHeight(s.map.layers);
  const k = BOX_RES * Math.min(1, routeHeight(BOX_LAYERS) / h);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(k, 0, 0, k, (ctx.canvas.width - MINIMAP_WIDTH * k) / 2, (ctx.canvas.height - h * k) / 2);
  drawRoute(ctx, s.map, (id) => s.rooms[id]?.visited === true, s.roomId);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
