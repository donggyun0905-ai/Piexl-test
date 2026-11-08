// 실버불렛 효과 — 은빛 쌍권총. 총구 불꽃(오른손·왼손 따로) · 은탄 맞음(은빛 불똥) · 성수 폭탄(푸른 물보라·빛 고리·물방울) · 연사 시작(적 둘레 은빛 조준 고리)
// 은빛 활(각성 순간 흰 빛, 활 몸은 silverBulletBody) · 각성 달빛 폭발 · 장애물 넘기(은빛 잔상) · 은빛 파열
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { SB } from "./silverBulletBody";

const SB_FX = new Set(["sbMuzzleFx", "sbHitFx", "sbBombFx", "sbBarrageFx", "sbBowFx", "sbAwakeFx", "sbVaultFx", "sbBurstFx"]);

/** 총구 불꽃: 앞으로 뻗는 흰 섬광 (왼손은 조금 푸르게) */
function muzzle(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const al = 1 - f;
  const len = fx.size * (1 + f);
  additive(ctx, () => {
    glow(ctx, x, y, 5 + 3 * f, fx.style ? SB.moon : "#ffffff", 0.7 * al, 0.6);
    ctx.strokeStyle = alpha(fx.style ? SB.moon : "#fff4d8", al);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + fx.dirX * len, y + fx.dirY * len);
    ctx.stroke();
  });
}

/** 성수 폭탄: 푸른 물보라 고리 · 하얀 빛 · 위로 튀는 물방울 */
function bomb(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const r = fx.size * easeOut(Math.min(1, f * 1.6));
  const al = 1 - f;
  additive(ctx, () => {
    glow(ctx, x, y, fx.size * 0.9, SB.holy, 0.35 * al, 0.4);
    shock(ctx, x, y, r, SB.holy, al, 4);
    shock(ctx, x, y, r * 0.6, "#ffffff", al * 0.7, 2);
    sparks(ctx, x, y - 4, 10, fx.size * 0.8, f, SB.light, Math.round(fx.x + fx.y), al);
  });
  ctx.fillStyle = alpha(SB.holy, al * 0.5);
  ctx.beginPath();
  ctx.ellipse(x, y + 2, r, r * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** 연사 시작: 적 둘레 은빛 조준 고리가 조여듦 · 네 갈래 십자 */
function barrage(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const r = fx.size + 14 * (1 - easeOut(f));
  const al = 1 - f;
  additive(ctx, () => {
    shock(ctx, x, y, r, "#ffffff", al, 2);
    ctx.strokeStyle = alpha(SB.silver, al);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      ctx.moveTo(x + dx * (r + 2), y + dy * (r + 2));
      ctx.lineTo(x + dx * (r + 7), y + dy * (r + 7));
    }
    ctx.stroke();
  });
}

/** 달빛 폭발 (각성 · 은빛 파열): 흰 충격파 두 겹 · 빛 */
function burst(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const al = 1 - f;
  additive(ctx, () => {
    glow(ctx, x, y, fx.size, SB.moon, 0.4 * al, 0.6);
    shock(ctx, x, y, fx.size * easeOut(f), "#ffffff", al, 5);
    shock(ctx, x, y, fx.size * 0.6 * easeOut(f), SB.moon, al * 0.7, 3);
    sparks(ctx, x, y, 12, fx.size, f, "#ffffff", Math.round(fx.x * 3 + fx.y), al);
  });
}

/** 장애물 넘기: 대시 방향 뒤로 은빛 잔상 셋 */
function vault(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const al = (1 - f) * 0.6;
  additive(ctx, () => {
    for (let i = 1; i <= 3; i++) glow(ctx, x - fx.dirX * i * 7, y - 6 - fx.dirY * i * 7 - 6 * Math.sin(f * Math.PI), 7, SB.silver, al / i);
  });
}

export function drawSilverBulletFx(ctx: Ctx, fx: EffectState, snapPx: Snap): boolean {
  if (!SB_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snapPx(fx.x);
  const y = snapPx(fx.y);
  if (fx.kind === "sbMuzzleFx") muzzle(ctx, fx, x, y, f);
  else if (fx.kind === "sbHitFx") additive(ctx, () => sparks(ctx, x, y, 4, fx.size, f, SB.light, Math.round(fx.x + fx.y * 7), 1 - f));
  else if (fx.kind === "sbBombFx") bomb(ctx, fx, x, y, f);
  else if (fx.kind === "sbBarrageFx") barrage(ctx, fx, x, y, f);
  else if (fx.kind === "sbBowFx") {
    if (f < 0.08) additive(ctx, () => glow(ctx, x + fx.dirX * 10, y - 4 + fx.dirY * 10, 24, "#ffffff", 0.6 * (1 - f / 0.08), 0.8));
  } else if (fx.kind === "sbVaultFx") vault(ctx, fx, x, y, f);
  else burst(ctx, fx, x, y, f);
  return true;
}
