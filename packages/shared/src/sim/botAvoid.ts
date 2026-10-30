// AI 이동 (기간토마키아): 가는 앞이 벽이면 45°씩 돌려 비켜 감 · 오래 제자리면 잠깐 옆으로 돌아감. 삼각함수 없이 정해진 각도만
import { TILE_SIZE } from "../constants";
import { tileAt, TILE_FLOOR, type TileGrid } from "./layout";
import type { PlayerState, TickInput } from "./types";

const R2 = Math.SQRT1_2;
/** 돌려 볼 각도 (cos, sin): 45° · 90° · 135° */
const TURNS: readonly [number, number][] = [
  [R2, R2],
  [0, 1],
  [-R2, R2],
];
/** 이만큼 틱마다 얼마나 갔는지 봄 (덜 갔으면 막힌 것) · 돌아가는 틱 */
const CHECK = 30;
const MIN_GO = 14;
const DETOUR = 40;

const free = (g: TileGrid, x: number, y: number) => tileAt(g, Math.floor(x / TILE_SIZE), Math.floor(y / TILE_SIZE)) === TILE_FLOOR;
const clear = (g: TileGrid, x: number, y: number, dx: number, dy: number) => free(g, x + dx * 10, y + dy * 10) && free(g, x + dx * 22, y + dy * 22);
const move = (input: TickInput, dx: number, dy: number): TickInput => ({ ...input, moveX: Math.round(dx * 100), moveY: Math.round(dy * 100) });

/** side: 비켜 갈 쪽 (1 · -1, 자리마다 달리 해 서로 엇갈리게) */
export function avoidWalls(g: TileGrid, p: PlayerState, tick: number, input: TickInput, side: number): TickInput {
  if (!input.moveX && !input.moveY) {
    p.bkN = undefined;
    return input;
  }
  // 돌아가는 중
  if (p.bkDir && tick < p.bkDir[2]) return move(input, p.bkDir[0], p.bkDir[1]);
  const len = Math.hypot(input.moveX, input.moveY);
  const dx = input.moveX / len;
  const dy = input.moveY / len;
  // CHECK 틱 동안 MIN_GO보다 덜 갔으면 막힘: 옆(번갈아 뒤쪽 옆)으로 잠깐 돌아감
  if (p.bkN === undefined || tick - p.bkN >= CHECK) {
    const stuck = p.bkN !== undefined && (p.x - p.bkX!) ** 2 + (p.y - p.bkY!) ** 2 < MIN_GO ** 2;
    [p.bkX, p.bkY, p.bkN] = [p.x, p.y, tick];
    if (stuck) {
      const [c, sn] = TURNS[1 + (Math.floor(tick / CHECK) & 1)]!;
      const k = Math.floor(tick / CHECK) & 2 ? side : -side;
      p.bkDir = [dx * c - dy * sn * k, dx * sn * k + dy * c, tick + DETOUR];
      return move(input, p.bkDir[0], p.bkDir[1]);
    }
  }
  if (clear(g, p.x, p.y, dx, dy)) return input;
  for (const [c, sn] of TURNS) {
    for (const k of [side, -side]) {
      const rx = dx * c - dy * sn * k;
      const ry = dx * sn * k + dy * c;
      if (clear(g, p.x, p.y, rx, ry)) return move(input, rx, ry);
    }
  }
  return input;
}
