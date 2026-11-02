// 방 모양: 전투방·강한 적 방 안에 벽·기둥·구덩이를 놓음.
// 손으로 만든 틀 중에서 시드로 고르고 좌우를 뒤집어 씀 (같은 시드면 화면·서버에서 같은 방).
// 벽·기둥: 몸과 탄을 모두 막음 · 구덩이: 몸만 막고 탄은 넘어감
import { ROOM_COLS, ROOM_ROWS, SHAPE_DX, SHAPE_DY, THIN_WALLS, TILE_SIZE } from "../constants";
import type { Rng } from "../rng";
import { BOSS_SHAPES, ROOM_SHAPES } from "./roomShapes";
import type { Body } from "./types";

export { ROOM_SHAPES };

export const TILE_FLOOR = 0;
export const TILE_WALL = 1;
export const TILE_PILLAR = 2;
export const TILE_PIT = 3;

const CODE: Record<string, number> = { ".": TILE_FLOOR, "#": TILE_WALL, o: TILE_PILLAR, "~": TILE_PIT };

export interface RoomShape {
  /** ROOM_SHAPES 번호 (-1이면 네모 방 · -2면 관리자가 만든 방, rows에 틀) */
  id: number;
  /** 좌우 뒤집기 */
  flip: boolean;
  /** 관리자가 만든 방 틀 (13×7, customMaps) */
  rows?: readonly string[];
}

export const PLAIN_SHAPE: RoomShape = { id: -1, flip: false };

/** 방 모양 고르기 (custom: 관리자가 만든 방 틀도 같이 고름 · 없으면 예전과 같은 결과) */
export function pickShape(rng: Rng, custom: readonly (readonly string[])[] = []): RoomShape {
  const id = rng.int(0, ROOM_SHAPES.length - 1 + custom.length);
  const flip = rng.nextFloat() < 0.5;
  return id < ROOM_SHAPES.length ? { id, flip } : { id: -2, flip: false, rows: custom[id - ROOM_SHAPES.length] };
}

/** 칸 배열 (ROOM_COLS × ROOM_ROWS, 테두리는 벽). 네모 방은 null */
export type TileGrid = Uint8Array;

const cache = new Map<string, TileGrid>();

export function shapeGrid(shape: RoomShape): TileGrid | null {
  if (shape.id < 0 && !shape.rows) return null;
  const key = `${shape.rows ? shape.rows.join("/") : shape.id}:${shape.flip ? 1 : 0}:${SHAPE_DX > 0 ? 1 : 0}:${THIN_WALLS ? 1 : 0}`;
  const hit = cache.get(key);
  if (hit) return hit;
  // 1000부터는 새 보스방 틀
  const rows = (shape.rows ?? (shape.id >= 1000 ? BOSS_SHAPES[shape.id - 1000] : ROOM_SHAPES[shape.id]))!;
  const g = new Uint8Array(ROOM_COLS * ROOM_ROWS);
  for (let row = 0; row < ROOM_ROWS; row++) {
    for (let col = 0; col < ROOM_COLS; col++) {
      // 얇은 벽 방은 위쪽 줄만 벽 (옆·아래 테두리 칸은 걸어 다닐 수 있음, 바깥 끝은 ROOM_MIN/MAX로 막음)
      const border = row === 0 || (!THIN_WALLS && (col === 0 || row === ROOM_ROWS - 1 || col === ROOM_COLS - 1));
      if (border) {
        g[row * ROOM_COLS + col] = TILE_WALL;
        continue;
      }
      // 큰 방이면 틀을 가운데에 놓고 둘레는 바닥
      const c = shape.flip ? ROOM_COLS - 2 - col - SHAPE_DX : col - 1 - SHAPE_DX;
      g[row * ROOM_COLS + col] = CODE[rows[row - 1 - SHAPE_DY]?.[c] ?? "."] ?? TILE_FLOOR;
    }
  }
  cache.set(key, g);
  return g;
}

export function tileAt(g: TileGrid, col: number, row: number): number {
  if (col < 0 || row < 0 || col >= ROOM_COLS || row >= ROOM_ROWS) return TILE_WALL;
  return g[row * ROOM_COLS + col]!;
}

/** 탄을 막는 칸 (벽·기둥) */
export function blocksShot(g: TileGrid, x: number, y: number): boolean {
  const t = tileAt(g, Math.floor(x / TILE_SIZE), Math.floor(y / TILE_SIZE));
  return t === TILE_WALL || t === TILE_PILLAR;
}

/** 몸이 못 들어가는 칸 (벽·기둥·구덩이) */
function blocksBody(t: number): boolean {
  return t !== TILE_FLOOR;
}

/** 몸이 막힌 칸과 겹치지 않는지 */
export function bodyFits(g: TileGrid, x: number, y: number, r: number): boolean {
  const c0 = Math.floor((x - r) / TILE_SIZE);
  const c1 = Math.floor((x + r) / TILE_SIZE);
  const r0 = Math.floor((y - r) / TILE_SIZE);
  const r1 = Math.floor((y + r) / TILE_SIZE);
  for (let row = r0; row <= r1; row++) {
    for (let col = c0; col <= c1; col++) {
      if (!blocksBody(tileAt(g, col, row))) continue;
      const nx = Math.max(col * TILE_SIZE, Math.min(x, (col + 1) * TILE_SIZE));
      const ny = Math.max(row * TILE_SIZE, Math.min(y, (row + 1) * TILE_SIZE));
      if ((x - nx) * (x - nx) + (y - ny) * (y - ny) < r * r) return false;
    }
  }
  return true;
}

/** 막힌 칸에서 몸을 밀어냄 (벽을 따라 미끄러짐) */
export function pushOutOfTiles(g: TileGrid, b: Body): void {
  for (let pass = 0; pass < 2; pass++) {
    const c0 = Math.floor((b.x - b.r) / TILE_SIZE);
    const c1 = Math.floor((b.x + b.r) / TILE_SIZE);
    const r0 = Math.floor((b.y - b.r) / TILE_SIZE);
    const r1 = Math.floor((b.y + b.r) / TILE_SIZE);
    for (let row = r0; row <= r1; row++) {
      for (let col = c0; col <= c1; col++) {
        if (!blocksBody(tileAt(g, col, row))) continue;
        const left = col * TILE_SIZE;
        const top = row * TILE_SIZE;
        const nx = Math.max(left, Math.min(b.x, left + TILE_SIZE));
        const ny = Math.max(top, Math.min(b.y, top + TILE_SIZE));
        const dx = b.x - nx;
        const dy = b.y - ny;
        const d2 = dx * dx + dy * dy;
        if (d2 >= b.r * b.r) continue;
        if (d2 > 0) {
          const d = Math.sqrt(d2);
          b.x = nx + (dx / d) * b.r;
          b.y = ny + (dy / d) * b.r;
        } else {
          // 가운데가 칸 안에 들어간 경우: 옆 칸이 열린 변 중 가장 가까운 쪽으로
          const outs = [b.x - left, left + TILE_SIZE - b.x, b.y - top, top + TILE_SIZE - b.y];
          const open = [
            !blocksBody(tileAt(g, col - 1, row)),
            !blocksBody(tileAt(g, col + 1, row)),
            !blocksBody(tileAt(g, col, row - 1)),
            !blocksBody(tileAt(g, col, row + 1)),
          ];
          let k = -1;
          for (let i = 0; i < 4; i++) if (open[i] && (k < 0 || outs[i]! < outs[k]!)) k = i;
          if (k < 0) for (let i = 0; i < 4; i++) if (k < 0 || outs[i]! < outs[k]!) k = i;
          if (k === 0) b.x = left - b.r;
          else if (k === 1) b.x = left + TILE_SIZE + b.r;
          else if (k === 2) b.y = top - b.r;
          else b.y = top + TILE_SIZE + b.r;
        }
      }
    }
  }
}

/** 두 점 사이를 걸어서 곧장 갈 수 있는지 (반 칸 간격으로 확인) */
function walkLine(g: TileGrid, x0: number, y0: number, x1: number, y1: number): boolean {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.ceil(Math.sqrt(dx * dx + dy * dy) / (TILE_SIZE / 2));
  for (let i = 1; i <= steps; i++) {
    const x = x0 + (dx * i) / steps;
    const y = y0 + (dy * i) / steps;
    if (blocksBody(tileAt(g, Math.floor(x / TILE_SIZE), Math.floor(y / TILE_SIZE)))) return false;
  }
  return true;
}

/** 두 점 사이를 벽이 가로막는지 (보이는지, 기둥·구덩이는 안 막음) */
export function wallBetween(g: TileGrid, x0: number, y0: number, x1: number, y1: number): boolean {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.ceil(Math.sqrt(dx * dx + dy * dy) / (TILE_SIZE / 2));
  for (let i = 1; i < steps; i++) if (tileAt(g, Math.floor((x0 + (dx * i) / steps) / TILE_SIZE), Math.floor((y0 + (dy * i) / steps) / TILE_SIZE)) === TILE_WALL) return true;
  return false;
}

/** 목표 칸까지 걸어서 몇 칸인지 (막힌 칸·못 가는 칸은 -1) */
export function distanceField(g: TileGrid, x: number, y: number): Int16Array {
  const dist = new Int16Array(ROOM_COLS * ROOM_ROWS).fill(-1);
  const start = Math.floor(y / TILE_SIZE) * ROOM_COLS + Math.floor(x / TILE_SIZE);
  if (start < 0 || start >= dist.length) return dist;
  const queue = [start];
  dist[start] = 0;
  for (let qi = 0; qi < queue.length; qi++) {
    const i = queue[qi]!;
    const col = i % ROOM_COLS;
    const row = (i - col) / ROOM_COLS;
    for (const [ox, oy] of NEIGHBORS) {
      const nc = col + ox;
      const nr = row + oy;
      if (blocksBody(tileAt(g, nc, nr))) continue;
      const ni = nr * ROOM_COLS + nc;
      if (dist[ni] !== -1) continue;
      dist[ni] = dist[i]! + 1;
      queue.push(ni);
    }
  }
  return dist;
}

const NEIGHBORS: readonly (readonly [number, number])[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

/** 목표 쪽으로 걸어갈 방향: 곧장 갈 수 있으면 목표로, 막혔으면 거리 지도에서 더 가까운 옆 칸 가운데로. 길이 1, 없으면 null */
export function walkToward(g: TileGrid, field: Int16Array, b: Body, tx: number, ty: number): [number, number] | null {
  let gx = tx;
  let gy = ty;
  if (!walkLine(g, b.x, b.y, tx, ty)) {
    const col = Math.floor(b.x / TILE_SIZE);
    const row = Math.floor(b.y / TILE_SIZE);
    let best = field[row * ROOM_COLS + col] ?? -1;
    if (best < 0) best = 1 << 14;
    for (const [ox, oy] of NEIGHBORS) {
      const nc = col + ox;
      const nr = row + oy;
      if (blocksBody(tileAt(g, nc, nr))) continue;
      const d = field[nr * ROOM_COLS + nc]!;
      if (d >= 0 && d < best) {
        best = d;
        gx = (nc + 0.5) * TILE_SIZE;
        gy = (nr + 0.5) * TILE_SIZE;
      }
    }
  }
  const dx = gx - b.x;
  const dy = gy - b.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  return len === 0 ? null : [dx / len, dy / len];
}
