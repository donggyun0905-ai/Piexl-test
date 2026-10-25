// 도트 편집(/pixel/)에서 고친 효과·탄 그림 그리기 (game/customArt). 없으면 false → 원래대로 도형
import type { EffectState, ProjectileState } from "@pixel-rogue/shared";
import { customImage } from "../customArt";
import type { Snap } from "./palette";

/** 효과 그림: 가로로 장면 FX_FRAMES칸, 한 칸 FX_CELL. 칸 가운데가 효과 자리, 오른쪽을 봄, 크기 fxBase일 때 1배 */
export const FX_FRAMES = 4;
export const FX_CELL = 48;
export const fxBase = (kind: string) => (kind === "hit" || kind === "mark" ? 6 : 18);
/** 탄 그림: 한 칸 SHOT_CELL, 가운데가 탄 자리, 오른쪽으로 날아감, 반지름 SHOT_R일 때 1배 */
export const SHOT_CELL = 16;
export const SHOT_R = 3;
/** 플레이어 자리에서 그리는 효과 */
const AT_PLAYER = new Set(["swing"]);

export function drawCustomFx(ctx: CanvasRenderingContext2D, fx: EffectState, px: number, py: number, snap: Snap): boolean {
  // 한 바퀴 베기(방향 없음)·채찍(width 2)은 원래 그림
  if (fx.kind === "swing" && ((!fx.dirX && !fx.dirY) || fx.width === 2)) return false;
  const img = customImage(`fx:${fx.kind}`);
  if (!img) return false;
  const t = fx.ticks / fx.maxTicks;
  const f = Math.min(FX_FRAMES - 1, Math.floor((1 - t) * FX_FRAMES));
  const k = Math.max(0.25, fx.size / fxBase(fx.kind));
  ctx.save();
  ctx.translate(snap(AT_PLAYER.has(fx.kind) ? px : fx.x), snap(AT_PLAYER.has(fx.kind) ? py : fx.y));
  if (fx.dirX || fx.dirY) ctx.rotate(Math.atan2(fx.dirY, fx.dirX));
  ctx.scale(k, k);
  ctx.drawImage(img, f * FX_CELL, 0, FX_CELL, FX_CELL, -FX_CELL / 2, -FX_CELL / 2, FX_CELL, FX_CELL);
  ctx.restore();
  return true;
}

export function drawCustomShot(ctx: CanvasRenderingContext2D, id: string, pr: ProjectileState, x: number, y: number): boolean {
  const img = customImage(id);
  if (!img) return false;
  const k = Math.max(0.5, pr.r / SHOT_R);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.atan2(pr.vy, pr.vx));
  ctx.scale(k, k);
  ctx.drawImage(img, -SHOT_CELL / 2, -SHOT_CELL / 2);
  ctx.restore();
  return true;
}
