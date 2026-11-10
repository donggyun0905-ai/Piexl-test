// 블루 플레임 효과 — 푸른 불꽃 (사용자 그림 8프레임, sprites/blueFlame_* ← scripts/art/blueFlame_fx.py)
// 불꽃 감옥 (구슬이 차오르다 터져 흩어짐) · 불꽃 기둥 (땅에서 솟아 내리꽂힘) · 화살 박힘 (꽂힌 화살 · 푸른 불티) · 각성 폭격 (반구 폭발) · 화살비 떨어짐 · 각성 시작 (푸른 충격파)
// 활 쏘기·날개는 몸을 따라가서 render/blueFlameBody에서 그림
import type { EffectState } from "@pixel-rogue/shared";
import { arrowImg, BZ, BZ_IMG, frame } from "./blueFlameBody";
import { additive, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

const BZ_FX = new Set(["bzBowFx", "bzPrisonFx", "bzPillarFx", "bzArrowFx", "bzBombFx", "bzAwakeFx", "bzWingFx", "bzRainFx"]);

/** 화살 박힘: 비스듬히 꽂힌 화살 · 푸른 고리 · 불티 */
function stuck(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const al = 1 - f;
  const a = Math.atan2(fx.dirY || 0.4, fx.dirX || 1);
  additive(ctx, () => {
    glow(ctx, x, y, 10, BZ.blue, 0.6 * al, 0.5);
    shock(ctx, x, y, 3 + 9 * easeOut(f), BZ.light, al, 1.5);
    sparks(ctx, x, y, 5, 12, f, BZ.pale, Math.round(fx.x * 3 + fx.y), al);
  });
  arrowImg(ctx, x + Math.cos(a) * 3, y + Math.sin(a) * 3, a, 18, Math.min(1, al * 1.6));
}

export function drawBlueFlameFx(ctx: Ctx, fx: EffectState, snapPx: Snap): boolean {
  if (!BZ_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const k = Math.floor(f * 8);
  const x = snapPx(fx.x);
  const y = snapPx(fx.y);
  if (fx.kind === "bzPrisonFx") {
    additive(ctx, () => {
      glow(ctx, x, y - 4, fx.size * 1.3, BZ.deep, 0.35 * (1 - f));
      frame(ctx, BZ_IMG.prison, k, x, y - 4, fx.size * 2.6);
    });
  } else if (fx.kind === "bzPillarFx") {
    const h = fx.size * 4.4;
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * 1.2, BZ.blue, 0.4 * (1 - f));
      frame(ctx, BZ_IMG.pillar, k, x, y + 2 - h * 0.42, h);
    });
  } else if (fx.kind === "bzBombFx") {
    const h = fx.size * 2.8;
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * 1.4, BZ.blue, 0.5 * (1 - f), 0.4);
      shock(ctx, x, y, fx.size * easeOut(f) * 1.1, BZ.light, 1 - f, 3);
      frame(ctx, BZ_IMG.bomb, k, x, y - h * 0.22, h);
    });
  } else if (fx.kind === "bzArrowFx") stuck(ctx, fx, x, y, f);
  else if (fx.kind === "bzRainFx") {
    additive(ctx, () => {
      glow(ctx, x, y, fx.size, BZ.blue, 0.5 * (1 - f), 0.4);
      shock(ctx, x, y, fx.size * easeOut(f), BZ.light, 1 - f, 1.5);
      sparks(ctx, x, y, 4, fx.size, f, BZ.pale, Math.round(fx.x + fx.y * 5), 1 - f);
    });
  } else if (fx.kind === "bzAwakeFx") {
    // 각성 시작: 몸에서 푸른 충격파 두 겹 · 화면이 까매지기 전 번쩍
    additive(ctx, () => {
      glow(ctx, x, y - 8, 30 * (1 - f) + 10, BZ.pale, 0.7 * (1 - f), 0.7);
      shock(ctx, x, y, fx.size * easeOut(f) * 1.6, BZ.blue, 1 - f, 4);
      shock(ctx, x, y, fx.size * easeOut(f), BZ.light, 1 - f, 2);
    });
  }
  return true;
}
