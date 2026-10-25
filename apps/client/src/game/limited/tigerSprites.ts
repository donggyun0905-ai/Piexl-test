// 범 풍류 효과 도트 그림 (public/sprites/custom/tiger_*.png, 도트 편집 '한정 스킨 효과'에서 고침). 그림이 없으면 false → 원래 코드 그림
import { customImage } from "../customArt";

/** 그림 이름 → 한 칸 크기 [가로, 세로] · 장면 수 · 줄 수 (줄: 발톱 자국 줄 수 1~3) */
export const TIGER_SPRITES = {
  claw: { w: 24, h: 24, frames: 4, rows: 3 },
  crit: { w: 40, h: 40, frames: 4, rows: 1 },
  seal: { w: 32, h: 20, frames: 1, rows: 1 },
  ring: { w: 48, h: 28, frames: 4, rows: 1 },
  pillar: { w: 16, h: 80, frames: 4, rows: 1 },
  aura: { w: 64, h: 48, frames: 4, rows: 1 },
  sleep: { w: 80, h: 48, frames: 2, rows: 1 },
  tail: { w: 80, h: 48, frames: 2, rows: 1 },
  /** 악기 6종 (줄): 장구 · 꽹과리 · 북 · 소고 · 태평소 · 청사초롱 */
  band: { w: 20, h: 20, frames: 2, rows: 6 },
  /** 걸음 발자국 (위가 걷는 쪽) */
  paw: { w: 8, h: 8, frames: 1, rows: 1 },
} as const;
export type TigerSprite = keyof typeof TIGER_SPRITES;

/** 지금 좌표계의 (0, 0)에 칸 가운데를 맞춰 그림 (돌리기·뒤집기는 부르는 쪽에서). frame은 장면 번호 */
export function drawTigerSprite(ctx: CanvasRenderingContext2D, name: TigerSprite, frame: number, row = 0, scale = 1, ax = 0.5, ay = 0.5): boolean {
  const img = customImage(`tiger:${name}`);
  if (!img) return false;
  const s = TIGER_SPRITES[name];
  const f = Math.max(0, Math.min(s.frames - 1, Math.floor(frame)));
  ctx.drawImage(img, f * s.w, row * s.h, s.w, s.h, -s.w * ax * scale, -s.h * ay * scale, s.w * scale, s.h * scale);
  return true;
}
