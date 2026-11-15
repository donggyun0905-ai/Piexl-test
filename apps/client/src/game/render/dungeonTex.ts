// 던전 바닥·벽 그림 (사용자 그림, scripts/art/dungeon_art.py): 바닥은 8×8칸에 그림 하나, 위쪽 벽은 3칸에 그림 하나 · 받기 전·그림 없는 방은 색으로 (floorThemes)
// 끝과 처음이 안 이어지는 바닥 그림은 8칸 묶음마다 거울처럼 뒤집어 붙임 (이음매가 늘 맞음) · 눈이 아픈 바닥(용암·진한 빛)은 채도·밝기를 낮춤 (render/room이 미리 그린 한 장에)
import { TILE_SIZE } from "@pixel-rogue/shared";
import { imageLoader } from "../lazyImage";
import { DUNGEON_TEX } from "./dungeonTexList";

const load = imageLoader((name) => (DUNGEON_TEX.has(name.split("-")[0]!) ? `${import.meta.env.BASE_URL}dungeon/${name}.webp` : null));
/** 바닥 그림 한 장이 덮는 칸 수 · 벽 그림 한 장이 덮는 칸 수 */
const FLOOR_SPAN = 8;
const WALL_SPAN = 3;
/** 끝과 처음이 안 이어지는 바닥 (2026-11-16 이음매 검사 · 뒤집어도 자연스러운 판자·쇠판만, plight는 뒤집으면 대칭 무늬가 생겨 그림을 다시 그려야 함) */
const MIRROR = new Set(["swordgod", "hulk"]);
/** 눈이 아픈 바닥: [채도 줄임 0~1, 어둡게 0~1] (2026-11-16 사용자: 용암지대 눈 아픔) */
const CALM: Readonly<Record<string, readonly [number, number]>> = {
  dragon: [0.45, 0.3],
  salamander: [0.45, 0.3],
  cerberus: [0.35, 0.22],
  gatekeeper: [0.35, 0.22],
  godeater: [0.35, 0.22],
  asmodeus: [0.4, 0.15],
  plant: [0.2, 0.15],
};

/** 바닥 칸 하나를 그림으로 (그림이 없거나 받는 중이면 false) */
export function drawFloorTex(ctx: CanvasRenderingContext2D, key: string | undefined, col: number, row: number, x: number, y: number): boolean {
  const img = key ? load(`${key}-floor`) : undefined;
  if (!img) return false;
  const s = img.width / FLOOR_SPAN;
  const fx = MIRROR.has(key!) && Math.floor(col / FLOOR_SPAN) % 2 === 1;
  const fy = MIRROR.has(key!) && Math.floor(row / FLOOR_SPAN) % 2 === 1;
  const sc = fx ? FLOOR_SPAN - 1 - (col % FLOOR_SPAN) : col % FLOOR_SPAN;
  const sr = fy ? FLOOR_SPAN - 1 - (row % FLOOR_SPAN) : row % FLOOR_SPAN;
  if (!fx && !fy) {
    ctx.drawImage(img, sc * s, sr * s, s, s, x, y, TILE_SIZE, TILE_SIZE);
    return true;
  }
  ctx.save();
  ctx.translate(x + (fx ? TILE_SIZE : 0), y + (fy ? TILE_SIZE : 0));
  ctx.scale(fx ? -1 : 1, fy ? -1 : 1);
  ctx.drawImage(img, sc * s, sr * s, s, s, 0, 0, TILE_SIZE, TILE_SIZE);
  ctx.restore();
  return true;
}

/** 눈이 아픈 바닥이면 그 영역의 채도·밝기를 낮춤 (미리 그린 방 한 장에 한 번) */
export function calmFloor(ctx: CanvasRenderingContext2D, key: string | undefined, x: number, y: number, w: number, h: number): void {
  const c = key ? CALM[key] : undefined;
  if (!c) return;
  ctx.save();
  ctx.globalCompositeOperation = "saturation";
  ctx.globalAlpha = c[0];
  ctx.fillStyle = "#808080";
  ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = c[1];
  ctx.fillStyle = "#0c0a10";
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

/** 벽 칸 하나를 그림으로 (위쪽 벽은 가로로 이어지게, 옆 벽은 같은 그림을 칸마다) */
export function drawWallTex(ctx: CanvasRenderingContext2D, key: string | undefined, col: number, x: number, y: number): boolean {
  const img = key ? load(`${key}-wall`) : undefined;
  if (!img) return false;
  const s = img.width / WALL_SPAN;
  ctx.drawImage(img, (col % WALL_SPAN) * s, 0, s, img.height, x, y, TILE_SIZE, TILE_SIZE);
  return true;
}
