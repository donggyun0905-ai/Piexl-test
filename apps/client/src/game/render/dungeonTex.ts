// 던전 바닥·벽 그림 (사용자 그림, scripts/art/dungeon_art.py): 바닥은 8×8칸에 그림 하나, 위쪽 벽은 3칸에 그림 하나 · 받기 전·그림 없는 방은 색으로 (floorThemes)
import { TILE_SIZE } from "@pixel-rogue/shared";
import { imageLoader } from "../lazyImage";
import { DUNGEON_TEX } from "./dungeonTexList";

const load = imageLoader((name) => (DUNGEON_TEX.has(name.split("-")[0]!) ? `${import.meta.env.BASE_URL}dungeon/${name}.webp` : null));
/** 바닥 그림 한 장이 덮는 칸 수 · 벽 그림 한 장이 덮는 칸 수 */
const FLOOR_SPAN = 8;
const WALL_SPAN = 3;

/** 바닥 칸 하나를 그림으로 (그림이 없거나 받는 중이면 false) */
export function drawFloorTex(ctx: CanvasRenderingContext2D, key: string | undefined, col: number, row: number, x: number, y: number): boolean {
  const img = key ? load(`${key}-floor`) : undefined;
  if (!img) return false;
  const s = img.width / FLOOR_SPAN;
  ctx.drawImage(img, (col % FLOOR_SPAN) * s, (row % FLOOR_SPAN) * s, s, s, x, y, TILE_SIZE, TILE_SIZE);
  return true;
}

/** 벽 칸 하나를 그림으로 (위쪽 벽은 가로로 이어지게, 옆 벽은 같은 그림을 칸마다) */
export function drawWallTex(ctx: CanvasRenderingContext2D, key: string | undefined, col: number, x: number, y: number): boolean {
  const img = key ? load(`${key}-wall`) : undefined;
  if (!img) return false;
  const s = img.width / WALL_SPAN;
  ctx.drawImage(img, (col % WALL_SPAN) * s, 0, s, img.height, x, y, TILE_SIZE, TILE_SIZE);
  return true;
}
