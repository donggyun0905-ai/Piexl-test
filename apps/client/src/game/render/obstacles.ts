// 방 안 장애물 그리기 (room.drawRoom이 부름): 안쪽 벽(벽돌 줄·윗면 빛·바닥에 그림자) · 돌기둥(받침 그림자·밝은 왼쪽/어두운 오른쪽·윗면·이음매·금·이끼) · 구덩이(안으로 갈수록 깊은 어둠·윗턱 돌·옆 그늘·먼지)
// 층 테마 색(floorThemes)을 그대로 쓰고 밝기만 덧칠 · 칸마다 고정된 무늬(spot)라 프레임마다 흔들리지 않음
import { TILE_PILLAR, TILE_PIT, TILE_SIZE, TILE_WALL, tileAt } from "@pixel-rogue/shared";
import type { FloorTheme } from "./floorThemes";

type Ctx = CanvasRenderingContext2D;
const T = TILE_SIZE;
const spot = (x: number, y: number, k: number) => ((x * 73856093) ^ (y * 19349663) ^ (k * 83492791)) >>> 0;
const dark = (a: number) => `rgba(0,0,0,${a})`;
const light = (a: number) => `rgba(255,255,255,${a})`;

function wall(ctx: Ctx, g: Uint8Array, th: FloorTheme, col: number, row: number, x: number, y: number): void {
  ctx.fillStyle = th.wall;
  ctx.fillRect(x, y, T, T);
  // 벽돌 줄 (한 줄씩 엇갈림)
  ctx.fillStyle = dark(0.22);
  for (let k = 0; k < T; k += 4) {
    ctx.fillRect(x, y + k, T, 1);
    const off = (k / 4 + row) % 2 ? 0 : T / 2;
    ctx.fillRect(x + ((off + 5) % T), y + k, 1, 4);
  }
  const up = tileAt(g, col, row - 1) === TILE_WALL;
  const down = tileAt(g, col, row + 1) === TILE_WALL;
  if (!up) {
    ctx.fillStyle = light(0.18);
    ctx.fillRect(x, y, T, 2);
  }
  if (!down) {
    ctx.fillStyle = th.wallTop;
    ctx.fillRect(x, y + T - 3, T, 3);
    // 바닥에 떨어지는 그림자
    ctx.fillStyle = dark(0.28);
    ctx.fillRect(x, y + T, T, 3);
  }
}

function pillar(ctx: Ctx, th: FloorTheme, x: number, y: number): void {
  // 바닥 그림자 · 받침
  ctx.fillStyle = dark(0.35);
  ctx.beginPath();
  ctx.ellipse(x + T / 2 + 1, y + T - 1, T / 2, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = th.pillarShade;
  ctx.fillRect(x + 1, y + T - 4, T - 2, 3);
  // 몸통: 가운데 · 밝은 왼쪽 · 어두운 오른쪽
  ctx.fillStyle = th.pillar;
  ctx.fillRect(x + 3, y + 2, T - 6, T - 5);
  ctx.fillStyle = light(0.16);
  ctx.fillRect(x + 3, y + 2, 2, T - 5);
  ctx.fillStyle = th.pillarShade;
  ctx.fillRect(x + T - 5, y + 2, 2, T - 5);
  // 이음매 두 줄 · 윗면
  ctx.fillStyle = dark(0.25);
  ctx.fillRect(x + 3, y + 7, T - 6, 1);
  ctx.fillRect(x + 3, y + 11, T - 6, 1);
  ctx.fillStyle = th.pillarTop;
  ctx.fillRect(x + 2, y, T - 4, 3);
  ctx.fillStyle = light(0.25);
  ctx.fillRect(x + 2, y, T - 4, 1);
  // 금 · 이끼 (칸마다 다름)
  const v = spot(x, y, 3);
  ctx.fillStyle = dark(0.4);
  const cx = x + 5 + (v % 5);
  ctx.fillRect(cx, y + 3 + ((v >> 3) % 3), 1, 3);
  ctx.fillRect(cx + 1, y + 6 + ((v >> 3) % 3), 1, 2);
  if (v % 3 === 0) {
    ctx.fillStyle = "rgba(96,150,80,0.7)";
    ctx.fillRect(x + 3, y + T - 6, 3, 2);
    ctx.fillRect(x + 4, y + T - 8, 1, 2);
  }
}

function pit(ctx: Ctx, g: Uint8Array, th: FloorTheme, col: number, row: number, x: number, y: number): void {
  const up = tileAt(g, col, row - 1) === TILE_PIT;
  const down = tileAt(g, col, row + 1) === TILE_PIT;
  const left = tileAt(g, col - 1, row) === TILE_PIT;
  const right = tileAt(g, col + 1, row) === TILE_PIT;
  ctx.fillStyle = th.pit;
  ctx.fillRect(x, y, T, T);
  // 위쪽 턱에서 멀수록 깊고 어두움
  const gr = ctx.createLinearGradient(0, y, 0, y + T);
  gr.addColorStop(0, dark(up ? 0.45 : 0.1));
  gr.addColorStop(1, dark(up ? 0.6 : 0.45));
  ctx.fillStyle = gr;
  ctx.fillRect(x, y, T, T);
  if (!up) {
    // 윗턱: 구덩이 벽면 + 돌 테
    ctx.fillStyle = th.pitEdge;
    ctx.fillRect(x, y, T, 5);
    ctx.fillStyle = dark(0.35);
    ctx.fillRect(x, y + 5, T, 1);
    ctx.fillStyle = light(0.2);
    for (let k = 0; k < T; k += 4) ctx.fillRect(x + k + (spot(x, y, k) % 2), y, 2, 1);
  }
  ctx.fillStyle = dark(0.35);
  if (!left) ctx.fillRect(x, y, 2, T);
  if (!right) ctx.fillRect(x + T - 2, y, 2, T);
  if (!down) {
    ctx.fillStyle = light(0.12);
    ctx.fillRect(x, y + T - 1, T, 1);
  }
  // 깊은 곳 먼지 (희미한 점)
  const v = spot(x, y, 9);
  if (v % 2 === 0) {
    ctx.fillStyle = light(0.08);
    ctx.fillRect(x + 3 + (v % 9), y + 7 + ((v >> 4) % 6), 1, 1);
  }
}

/** 방 모양 칸 (벽·기둥·구덩이) · [c0, r0, c1, r1] 그릴 칸 범위 */
export function drawShapeTiles(ctx: Ctx, g: Uint8Array, th: FloorTheme, [c0, r0, c1, r1]: readonly number[]): void {
  // 구덩이·벽 먼저, 기둥(바닥 그림자가 옆 칸에 걸침)은 나중에
  for (let row = r0!; row < r1!; row++) {
    for (let col = c0!; col < c1!; col++) {
      const t = tileAt(g, col, row);
      if (t === TILE_WALL) wall(ctx, g, th, col, row, col * T, row * T);
      else if (t === TILE_PIT) pit(ctx, g, th, col, row, col * T, row * T);
    }
  }
  for (let row = r0!; row < r1!; row++) for (let col = c0!; col < c1!; col++) if (tileAt(g, col, row) === TILE_PILLAR) pillar(ctx, th, col * T, row * T);
}
