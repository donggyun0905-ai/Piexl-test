// 네일러 효과 — 못 박는 심판관. 망치 내려치기(머리 위에서 앞으로 · 땅 충격) · 못이 박힘(붉은 불똥) · 붉은 실 망치 원(붉은 충격파·핏방울)
// 바닥에 박은 못(떨어져 꽂힘·먼지 고리) · 고정 못 다섯(적 둘레에 내리꽂힘) · 저주 터짐(못 수만큼 크게, 검붉은 빛·흩어지는 못) · 못비 망치질(나·양옆 번쩍)
import type { EffectState } from "@pixel-rogue/shared";
import { additive, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { hammer, nail, NL } from "./nailerArt";

const NL_FX = new Set(["nlSwingFx", "nlStickFx", "nlSmashFx", "nlAnchorFx", "nlPinFx", "nlCurseFx", "nlUltFx"]);

/** 망치 내려치기: 머리 위에서 앞으로 휘둘러 땅을 침 */
function swing(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  const side = fx.dirX >= 0 ? -1 : 1;
  const sw = Math.min(1, f * 2.5);
  const ha = a + side * (1.6 - 1.6 * easeOut(sw));
  hammer(ctx, x, y, ha, fx.size * 0.55);
  if (f < 0.4) return;
  const g = (f - 0.4) / 0.6;
  const ix = x + Math.cos(a) * fx.size * 0.6;
  const iy = y + 4 + Math.sin(a) * fx.size * 0.6;
  additive(ctx, () => {
    shock(ctx, ix, iy, 6 + fx.size * 0.4 * easeOut(g), NL.steel, 0.8 * (1 - g), 5);
    glow(ctx, ix, iy, 10, NL.steel, 0.6 * (1 - g), 0.8);
  });
  sparks(ctx, ix, iy, 6, 16, g, "#c8b8a0", Math.round(fx.x + fx.y));
}

/** 못이 박힘: 붉은 불똥 · 번쩍 */
function stick(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  additive(ctx, () => glow(ctx, x, y, 6 + fx.size * (1 - f), NL.red, 0.7 * (1 - f), 0.7));
  sparks(ctx, x, y, 5, 10, f, NL.red, Math.round(fx.x * 3 + fx.y));
}

/** 붉은 실 2번: 망치로 내려쳐 퍼지는 붉은 원 · 핏방울 */
function smash(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const r = fx.size * easeOut(Math.min(1, f * 1.6));
  ctx.fillStyle = `rgba(160,10,24,${0.35 * (1 - f)})`;
  ctx.beginPath();
  ctx.ellipse(x, y + 2, r, r * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  additive(ctx, () => {
    shock(ctx, x, y, r, NL.red, 0.95 * (1 - f), 9);
    glow(ctx, x, y, fx.size * 0.6, NL.red, 0.6 * (1 - f), 0.6);
  });
  sparks(ctx, x, y, 14, fx.size, f, NL.blood, Math.round(fx.x + fx.y * 5));
  if (f < 0.35) hammer(ctx, x - 6, y - 26 + 26 * (f / 0.35), Math.PI / 2, 18, "#c83040");
}

/** 바닥에 박은 못: 위에서 떨어져 꽂힘 · 먼지 고리 */
function anchor(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const drop = Math.max(0, 1 - f * 3);
  nail(ctx, x, y - 14 - drop * 30, Math.PI / 2, 16, 0.4 * (1 - f));
  if (drop > 0) return;
  additive(ctx, () => shock(ctx, x, y + 2, 4 + 14 * easeOut(f), NL.red, 0.8 * (1 - f), 4));
}

/** 고정 못 다섯: 적 둘레 다섯 곳에 내리꽂힘 */
function pin(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
    const r = fx.size + 6;
    const t = Math.max(0, Math.min(1, f * 3 - k * 0.25));
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r * 0.6;
    nail(ctx, px, py - 12 - (1 - t) * 24, Math.PI / 2, 13, 0.5 * (1 - f));
    if (t >= 1) additive(ctx, () => glow(ctx, px, py + 1, 5, NL.red, 0.6 * (1 - f)));
  }
}

/** 저주 터짐: 박혀 있던 못 수(size)만큼 크게 · 검붉은 빛 · 못이 흩어짐 */
function curse(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const big = Math.min(60, 14 + fx.size * 1.5);
  const seed = Math.round(fx.x * 7 + fx.y * 3);
  additive(ctx, () => {
    glow(ctx, x, y - 4, big * (0.5 + 0.5 * easeOut(f)), NL.curse, 0.85 * (1 - f), 0.6);
    shock(ctx, x, y, big * easeOut(f), NL.red, 0.9 * (1 - f), 10);
  });
  const n = Math.min(14, 4 + Math.floor(fx.size / 3));
  for (let k = 0; k < n; k++) {
    const a = rnd(seed, k) * Math.PI * 2;
    const d = big * 0.9 * easeOut(f);
    nail(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7, a, 8, 0);
  }
}

/** 못비 망치질: 나와 양옆(size 떨어진 곳)에서 망치가 번쩍 */
function ultHit(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  for (const off of [0, -fx.size, fx.size]) {
    const px = x - fx.dirY * off;
    const py = y - 4 + fx.dirX * off;
    if (off !== 0) hammer(ctx, px - Math.cos(a) * 12, py - Math.sin(a) * 12, a - 0.8 + 0.8 * easeOut(f), 12, "#d8d8e8");
    additive(ctx, () => glow(ctx, px, py, 9 * (1 - f) + 3, off === 0 ? NL.red : NL.steel, 0.8 * (1 - f), 0.8));
  }
}

export function drawNailerFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!NL_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "nlSwingFx") swing(ctx, fx, x, y, f);
  else if (fx.kind === "nlStickFx") stick(ctx, fx, x, y, f);
  else if (fx.kind === "nlSmashFx") smash(ctx, fx, x, y, f);
  else if (fx.kind === "nlAnchorFx") anchor(ctx, fx, x, y, f);
  else if (fx.kind === "nlPinFx") pin(ctx, fx, x, y, f);
  else if (fx.kind === "nlCurseFx") curse(ctx, fx, x, y, f);
  else ultHit(ctx, fx, x, y, f);
  return true;
}
