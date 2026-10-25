// 도트 편집: 코드로 그리던 그림(아이콘·효과·탄)을 지금 게임 모습 그대로 그려 처음 그림으로 씀
import type { EffectKind, EffectState, ProjectileState, RunState } from "@pixel-rogue/shared";
import { customArt } from "../game/customArt";
import { drawIcon, ICON_SIZE, type IconItem } from "../game/iconArt";
import { FX_CELL, FX_FRAMES, fxBase, SHOT_CELL, SHOT_R } from "../game/render/customFx";
import { drawEffects, drawProjectiles } from "../game/render/shots";

function paint(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void): ImageData {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  customArt.off = true;
  try {
    draw(ctx);
  } catch {
    // 이 모양은 게임 상태가 더 있어야 그려짐: 빈 그림에서 시작
  }
  customArt.off = false;
  return ctx.getImageData(0, 0, w, h);
}

export const iconImage = (item: IconItem) => paint(ICON_SIZE, ICON_SIZE, (ctx) => drawIcon(ctx, item));

/** 그리기만 하는 가짜 게임 상태 (플레이어는 칸 가운데) */
function fakeRun(x: number, y: number, extra: Partial<RunState>): RunState {
  const player = { x, y, prevX: x, prevY: y, faceX: 1, faceY: 0, r: 5, characterId: "warden", stats: { range: 40 }, passives: [] };
  return { tick: 0, player, enemies: [], projectiles: [], effects: [], ...extra } as unknown as RunState;
}

/** 효과: 장면 4개 (시간이 지난 순서) */
export function fxImage(kind: string): ImageData {
  const c = FX_CELL / 2;
  const size = fxBase(kind);
  return paint(FX_CELL * FX_FRAMES, FX_CELL, (ctx) => {
    for (let f = 0; f < FX_FRAMES; f++) {
      const maxTicks = 20;
      const fx: EffectState = { kind: kind as EffectKind, x: c, y: c, dirX: 1, dirY: 0, size, ticks: Math.round(maxTicks * (1 - (f + 0.5) / FX_FRAMES)), maxTicks, toX: c + size, toY: c, width: 4 };
      ctx.save();
      ctx.beginPath();
      ctx.rect(f * FX_CELL, 0, FX_CELL, FX_CELL);
      ctx.clip();
      ctx.translate(f * FX_CELL, 0);
      drawEffects(ctx, fakeRun(c, c, { effects: [fx] }), 1, (v) => v);
      ctx.restore();
    }
  });
}

/** 탄 하나 (오른쪽으로 날아감) */
export function shotImage(kind: string): ImageData {
  const c = SHOT_CELL / 2;
  const pr = { id: 1, fromPlayer: kind !== "enemy", x: c, y: c, prevX: c, prevY: c, r: SHOT_R, vx: 1, vy: 0, damage: 1, ticksLeft: 10, pierce: 0, hitIds: [], ...(kind === "magic" ? { blast: 10 } : {}) } as unknown as ProjectileState;
  return paint(SHOT_CELL, SHOT_CELL, (ctx) => drawProjectiles(ctx, fakeRun(c, c, { projectiles: [pr] }), 1, (v) => v));
}
