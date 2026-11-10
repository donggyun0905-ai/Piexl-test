// 인시전 효과 — 붉은 피빛 (사용자 그림 8프레임, sprites/incision_* ← scripts/art/incision_fx.py)
// 1·2타 초승달 참격 (조준한 쪽으로 돌림, 왼 도끼는 위아래 뒤집기) · 3타 X 베기 · 4타 소용돌이 · 돌진 연참 · 도약 뜀(앞 4칸)·착지(뒤 4칸) · 광란 각성 쌍도끼 강타
// 도륙 폭발 · 피의 길 · 학살 · 콤보 단계 오름 (코드 그림)
import type { EffectState } from "@pixel-rogue/shared";
import { frame, img } from "./lunaticFx";
import { additive, beam, crescent, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

export const IC = { red: "#ff2a2a", deep: "#a00010", blood: "#c81e1e", hot: "#ffd0c0", white: "#ffffff" };

const IC_FX = new Set(["icSlashFx", "icCrossFx", "icWhirlFx", "icRushFx", "icJumpFx", "icLandFx", "icAwakeFx", "icBurstFx", "icTrailFx", "icCarnageFx", "icTierFx"]);
const SLASH = img("incision_slash");
const CROSS = img("incision_cross");
const WHIRL = img("incision_whirl");
const RUSH = img("incision_rush");
const LEAP = img("incision_leap");
const AWAKE = img("incision_awake");

/** 터지는 피 (도륙 폭발 · 학살): 붉은 빛 · 충격파 · 튀는 핏방울 */
function bloodBurst(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const al = 1 - f;
  additive(ctx, () => {
    glow(ctx, x, y, fx.size * (0.6 + 0.4 * f), IC.blood, 0.55 * al, 0.2);
    shock(ctx, x, y, fx.size * easeOut(f), IC.red, al, 3);
    sparks(ctx, x, y - 2, 10, fx.size * 0.9, f, IC.red, Math.round(fx.x * 5 + fx.y), al);
  });
}

export function drawIncisionFx(ctx: Ctx, fx: EffectState, snapPx: Snap): boolean {
  if (!IC_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const k = Math.floor(f * 8);
  const x = snapPx(fx.x);
  const y = snapPx(fx.y);
  const al = 1 - f;
  const a = Math.atan2(fx.dirY, fx.dirX);
  if (fx.kind === "icSlashFx") {
    // 초승달이 조준한 쪽 앞에서 휘어 지나감 (왼 도끼 = 뒤집기)
    const d = fx.size * 0.45;
    frame(ctx, SLASH, k, x + fx.dirX * d, y + fx.dirY * d, fx.size * 1.7, a, 0.5, 1, fx.width ? -1 : 1);
  } else if (fx.kind === "icCrossFx") {
    if (f < 0.3) additive(ctx, () => glow(ctx, x, y, fx.size * 0.5, IC.hot, 0.7 * (1 - f / 0.3), 0.6));
    frame(ctx, CROSS, k, x, y, fx.size * 1.6, a + Math.PI / 2, 0.5);
  } else if (fx.kind === "icWhirlFx") {
    additive(ctx, () => {
      for (let i = 0; i < 2; i++) crescent(ctx, x, y - 4, fx.size * (0.9 - i * 0.2), a + f * Math.PI * 2 + i * Math.PI, 1.4, 6 - i * 2, IC.red, al);
    });
    frame(ctx, WHIRL, k, x, y - 4, fx.size * 2.4, 0, 0.5);
  } else if (fx.kind === "icRushFx") {
    // 대시하는 쪽으로 뻗는 붉은 연참 (시작 자리 기준)
    frame(ctx, RUSH, k, x, y - 4, 96, a, 0.12);
  } else if (fx.kind === "icJumpFx") {
    // 뛰어오르는 자리: 앞 4칸
    frame(ctx, LEAP, Math.min(3, Math.floor(f * 4)), x, y - fx.size * 0.4, fx.size * 1.6, 0, 0.5, al * 0.6 + 0.4);
  } else if (fx.kind === "icLandFx") {
    // 착지: 뒤 4칸 (빛기둥 → 폭발 → 갈라진 땅 → 연기) · 충격파
    additive(ctx, () => {
      if (f < 0.25) glow(ctx, x, y, fx.size * 0.9, IC.hot, 0.9 * (1 - f * 4), 0.8);
      shock(ctx, x, y, fx.size * easeOut(Math.min(1, f * 1.6)), IC.red, al, 4);
    });
    frame(ctx, LEAP, 4 + Math.min(3, Math.floor(f * 4)), x, y - fx.size * 0.55, fx.size * 2.4, 0, 0.5);
  } else if (fx.kind === "icAwakeFx") {
    additive(ctx, () => {
      glow(ctx, x, y - 8, 30 * al + 12, IC.red, 0.7 * al, 0.5);
      shock(ctx, x, y, fx.size * easeOut(f) * 1.2, IC.deep, al, 5);
      shock(ctx, x, y, fx.size * easeOut(f), IC.red, al, 2);
    });
    frame(ctx, AWAKE, k, x, y - fx.size * 0.35, fx.size * 2.2, 0, 0.5);
  } else if (fx.kind === "icBurstFx") {
    bloodBurst(ctx, fx, x, y, f);
    frame(ctx, WHIRL, Math.min(7, 3 + k), x, y - 4, fx.size * 2.2, 0, 0.5, al);
  } else if (fx.kind === "icCarnageFx") bloodBurst(ctx, fx, x, y, f);
  else if (fx.kind === "icTrailFx") {
    const tx = snapPx(fx.toX ?? fx.x);
    const ty = snapPx(fx.toY ?? fx.y);
    additive(ctx, () => {
      beam(ctx, x, y - 4, tx, ty - 4, fx.size * 0.8 * al, IC.red, al);
      sparks(ctx, (x + tx) / 2, (y + ty) / 2 - 4, 10, 26, f, IC.blood, Math.round(fx.x + fx.y * 7), al);
    });
  } else if (fx.kind === "icTierFx") {
    // 콤보 단계 오름: 몸 둘레 붉은 고리가 조여듦
    additive(ctx, () => {
      ring(ctx, x, y - 6, 26 - 14 * easeOut(f), IC.red, 2 * al + 0.5);
      glow(ctx, x, y - 8, 14, IC.red, 0.4 * al, 0.2);
    });
  }
  return true;
}
