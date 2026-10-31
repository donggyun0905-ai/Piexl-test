// 방 그리기: 바닥·테두리 벽 · 방 모양(벽·기둥·구덩이) · 바닥 아이템·가격 · 위험 표시
import { drawHazards } from "./bossFx";
import { mine, PICKUP_HOLD_TICKS, ROOM_COLS, ROOM_ROWS, roomGrid, THIN_WALLS, TILE_FLOOR, TILE_PILLAR, TILE_PIT, TILE_SIZE, TILE_WALL, tileAt, WALL_THIN, type RunState } from "@pixel-rogue/shared";
import { drawPickup } from "../drawPickup";
import { drawRoomFeatures } from "../roomFeatures";
import { C, type Snap } from "./palette";
import { drawDeco, themeFor, type FloorTheme } from "./floorThemes";

/** 보이는 칸 범위 (화면 밖 칸은 그리지 않음: 큰 경기장) · view = [왼쪽 x, 위 y, 너비, 높이] (게임 픽셀) */
type View = readonly [number, number, number, number];
const span = (v: View | undefined): [number, number, number, number] =>
  v ? [Math.max(0, Math.floor(v[0] / TILE_SIZE) - 1), Math.max(0, Math.floor(v[1] / TILE_SIZE) - 1), Math.min(ROOM_COLS, Math.ceil((v[0] + v[2]) / TILE_SIZE) + 1), Math.min(ROOM_ROWS, Math.ceil((v[1] + v[3]) / TILE_SIZE) + 1)] : [0, 0, ROOM_COLS, ROOM_ROWS];

export function drawRoom(ctx: CanvasRenderingContext2D, s: RunState, view?: View): void {
  // 방 모양 (태초의 빛과 어둠 방은 상자 벽)
  // 층 테마: 그 층 보스에 어울리는 색·바닥 꾸밈
  const grid = roomGrid(s);
  const th = themeFor(s);
  const [c0, r0, c1, r1] = span(view);
  for (let row = r0; row < r1; row++) {
    for (let col = c0; col < c1; col++) {
      const side = col === 0 || col === ROOM_COLS - 1 || row === ROOM_ROWS - 1;
      // 로그 던전 방: 위쪽 벽(출구)만 두껍고, 옆·아래 테두리 칸은 바닥 + 바깥 끝에 얇은 벽
      const wall = row === 0 || (side && !THIN_WALLS);
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;
      ctx.fillStyle = wall ? th.wall : (row + col) % 2 === 0 ? th.floorA : th.floorB;
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      if (!wall && (!grid || tileAt(grid, col, row) === TILE_FLOOR)) drawDeco(ctx, th, col, row, x, y, TILE_SIZE, s.floor * 31 + s.roomId);
      if (side && THIN_WALLS && row > 0) drawThinWall(ctx, th, x, y, col === 0, col === ROOM_COLS - 1, row === ROOM_ROWS - 1);
    }
  }
  if (grid) drawShapeTiles(ctx, grid, th, [Math.max(1, c0), Math.max(1, r0), Math.min(ROOM_COLS - 1, c1), Math.min(ROOM_ROWS - 1, r1)]);

  drawRoomFeatures(ctx, s);
}

/** 옆·아래 테두리 칸의 바깥 끝에 얇은 벽 (두께 WALL_THIN) + 방 쪽 밝은 선 */
function drawThinWall(ctx: CanvasRenderingContext2D, th: FloorTheme, x: number, y: number, left: boolean, right: boolean, bottom: boolean): void {
  const T = WALL_THIN;
  const strip = (sx: number, sy: number, w: number, h: number, lx: number, ly: number, lw: number, lh: number) => {
    ctx.fillStyle = th.wall;
    ctx.fillRect(sx, sy, w, h);
    ctx.fillStyle = th.wallTop;
    ctx.fillRect(lx, ly, lw, lh);
  };
  if (left) strip(x, y, T, TILE_SIZE, x + T - 1, y, 1, bottom ? TILE_SIZE - T : TILE_SIZE);
  if (right) strip(x + TILE_SIZE - T, y, T, TILE_SIZE, x + TILE_SIZE - T, y, 1, bottom ? TILE_SIZE - T : TILE_SIZE);
  if (bottom) strip(x, y + TILE_SIZE - T, TILE_SIZE, T, left ? x + T - 1 : x, y + TILE_SIZE - T, left || right ? TILE_SIZE - T + 1 : TILE_SIZE, 1);
}

/** 바닥 아이템·가격: 지형(진흙·용암·물·가시·독가스) 위에 그려서 가려지지 않게 */
export function drawPickups(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  for (const pk of s.rooms[s.roomId]?.pickups ?? []) {
    // 협동: 다른 사람 아이템은 보이지 않음
    if (!mine(s, pk)) continue;
    const hold = pk.id === s.holdPickupId ? s.holdTicks / PICKUP_HOLD_TICKS : 0;
    drawPickup(ctx, pk, s.tick, pk.id === s.nearPickupId, hold);
    if (pk.price > 0 && pk.kind !== "coin" && pk.kind !== "trash") drawPrice(ctx, pk.x, pk.y + 14, pk.price, s.gold >= pk.price);
  }

  // 위험 표시: 붉은 원 안이 차오르다 터짐 (밖으로 나가면 피할 수 있음) · 부채꼴 · 선
  drawHazards(ctx, s, alpha, snap);
}

/** 방 안 벽·기둥·구덩이 (테두리 벽은 위에서 그림) */
function drawShapeTiles(ctx: CanvasRenderingContext2D, g: Uint8Array, th: FloorTheme, [c0, r0, c1, r1]: readonly number[]): void {
  for (let row = r0!; row < r1!; row++) {
    for (let col = c0!; col < c1!; col++) {
      const t = tileAt(g, col, row);
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;
      if (t === TILE_WALL) {
        ctx.fillStyle = th.wall;
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        // 바닥과 닿은 아래쪽 모서리를 밝게 해 높이가 보이게
        if (tileAt(g, col, row + 1) !== TILE_WALL) {
          ctx.fillStyle = th.wallTop;
          ctx.fillRect(x, y + TILE_SIZE - 3, TILE_SIZE, 3);
        }
      } else if (t === TILE_PILLAR) {
        ctx.fillStyle = th.pillarShade;
        ctx.fillRect(x + 1, y + 3, TILE_SIZE - 2, TILE_SIZE - 3);
        ctx.fillStyle = th.pillar;
        ctx.fillRect(x + 2, y + 1, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.fillStyle = th.pillarTop;
        ctx.fillRect(x + 2, y + 1, TILE_SIZE - 4, 3);
      } else if (t === TILE_PIT) {
        ctx.fillStyle = th.pit;
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        // 위쪽 가장자리: 구덩이 벽면
        if (tileAt(g, col, row - 1) !== TILE_PIT) {
          ctx.fillStyle = th.pitEdge;
          ctx.fillRect(x, y, TILE_SIZE, 4);
        }
      }
    }
  }
}

/** 상점 가격 (작은 글자) */
function drawPrice(ctx: CanvasRenderingContext2D, x: number, y: number, price: number, afford: boolean): void {
  ctx.font = "6px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  ctx.fillText(`${price}G`, x + 0.5, y + 0.5);
  ctx.fillStyle = afford ? C.price : "#a06060";
  ctx.fillText(`${price}G`, x, y);
}
