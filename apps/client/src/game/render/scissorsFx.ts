// 시저스 효과 — 단죄의 가위. 열기(두 날이 벌어지며 넓게 휘두르는 라벤더·흰 초승달 두 줄) · 닫기(두 날이 앞에서 맞물리는 X자 · 맞물린 자리 붉은 번쩍)
// 실 끊김(나 → 적 실이 하얗게 번쩍 → 가운데서 끊겨 양쪽으로 튕겨 감김 · 팽팽할수록 밝고 굵게) · 단죄(목 높이 가로 일섬 · 피 폭발 그림) · 실 묶임(붉은 매듭)
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, crescent, easeOut, glow, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { bloodBurst } from "./nailerFx";

export const SX = { blade: "#f4f0fa", lav: "#c8b8e8", red: "#ff2a3a", thread: "#ff3a4a", moon: "#c8d8ff" };
const SX_FX = new Set(["sxOpenFx", "sxCloseFx", "sxCutFx", "sxExecFx", "sxTieFx"]);

/** 열기: 두 날이 위·아래로 벌어지며 앞을 넓게 휘두름 (style 1 = 각성 달빛) */
function open(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  const half = Math.acos(Math.max(-1, Math.min(1, fx.arc ?? 0))) * 0.9;
  const c = fx.style ? SX.moon : SX.lav;
  const sw = easeOut(Math.min(1, f * 2.2));
  const al = 1 - f;
  additive(ctx, () => {
    crescent(ctx, x, y, fx.size * 0.92, a - half * 0.5 * sw, half * 0.5 * sw + 0.15, 4, c, al);
    crescent(ctx, x, y, fx.size * 0.92, a + half * 0.5 * sw, half * 0.5 * sw + 0.15, 4, c, al);
    crescent(ctx, x, y, fx.size * 0.8, a, half * sw, 1.5, SX.blade, al * 0.8);
  });
}

/** 닫기: 두 날이 양옆에서 앞으로 모여 X자로 맞물림 · 맞물린 자리 붉은 번쩍 */
function close(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  const shut = easeOut(Math.min(1, f * 3));
  const al = f < 0.4 ? 1 : 1 - (f - 0.4) / 0.6;
  const mx = x + Math.cos(a) * fx.size * 0.62;
  const my = y + Math.sin(a) * fx.size * 0.62;
  const len = fx.size * 0.55;
  const c = fx.style ? SX.moon : SX.blade;
  for (const sgn of [-1, 1]) {
    // 날이 열린 각에서 X자(±0.7)로 닫힘
    const t = a + Math.PI / 2 + sgn * (1.5 - 0.8 * shut);
    const dx = Math.cos(t) * len;
    const dy = Math.sin(t) * len;
    additive(ctx, () => beam(ctx, mx - dx, my - dy, mx + dx, my + dy, 3, sgn > 0 ? c : SX.lav, al));
  }
  if (shut < 1) return;
  const g = (f - 1 / 3) / (2 / 3);
  additive(ctx, () => glow(ctx, mx, my, 10 + 10 * (1 - g), SX.red, 0.9 * (1 - g), 0.9));
  sparks(ctx, mx, my, 8, 16, g, "#ff8a94", Math.round(fx.x + fx.y));
}

/** 실 끊김: 실이 하얗게 번쩍 → 가운데서 끊겨 양쪽으로 튕겨 감김 (size = 팽팽함 0~1) */
function snap(ctx: Ctx, fx: EffectState, x: number, y: number, tx: number, ty: number, f: number): void {
  const taut = fx.size;
  const mx = (x + tx) / 2;
  const my = (y + ty) / 2 - 4;
  if (f < 0.25) {
    additive(ctx, () => beam(ctx, x, y - 4, tx, ty - 4, 1 + taut * 2, taut > 0.6 ? "#ffffff" : SX.thread, 1));
    return;
  }
  const g = (f - 0.25) / 0.75;
  const back = easeOut(g);
  ctx.strokeStyle = alpha(SX.thread, 1 - g);
  ctx.lineWidth = 1;
  for (const [ex, ey] of [[x, y - 4], [tx, ty - 4]] as const) {
    // 끊긴 쪽 실이 끝 쪽으로 감기며 물결침
    const sx = mx + (ex - mx) * back;
    const sy = my + (ey - my) * back;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.quadraticCurveTo((ex + sx) / 2 + Math.sin(g * 9) * 6, (ey + sy) / 2 - 6 * (1 - g), sx, sy);
    ctx.stroke();
  }
  additive(ctx, () => glow(ctx, mx, my, 8 + 12 * taut, SX.red, (0.6 + 0.4 * taut) * (1 - g), 0.8));
  sparks(ctx, mx, my, 6 + Math.round(taut * 6), 12 + 10 * taut, g, taut > 0.6 ? "#ffffff" : "#ff8a94", Math.round(tx + ty));
}

/** 단죄: 목 높이를 가로지르는 흰 일섬 · 피 폭발 */
function exec(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const ny = y - fx.size - 2;
  const w = 26 + fx.size * 2;
  const slash = easeOut(Math.min(1, f * 4));
  if (f < 0.5) additive(ctx, () => beam(ctx, x - w / 2, ny, x - w / 2 + w * slash, ny, 2.5, SX.blade, 1 - f * 2));
  bloodBurst(ctx, x, y + 4, 40 + fx.size * 3, f);
}

/** 실 묶임: 붉은 매듭 고리가 조여 듦 */
function tie(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  ctx.strokeStyle = alpha(SX.thread, 1 - f);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x, y, (fx.size + 6) * (1.4 - 0.4 * easeOut(f)), (fx.size + 6) * 0.6 * (1.4 - 0.4 * easeOut(f)), 0, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawScissorsFx(ctx: Ctx, fx: EffectState, snapPx: Snap): boolean {
  if (!SX_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snapPx(fx.x);
  const y = snapPx(fx.y);
  if (fx.kind === "sxOpenFx") open(ctx, fx, x, y, f);
  else if (fx.kind === "sxCloseFx") close(ctx, fx, x, y, f);
  else if (fx.kind === "sxCutFx") snap(ctx, fx, x, y, snapPx(fx.toX ?? fx.x), snapPx(fx.toY ?? fx.y), f);
  else if (fx.kind === "sxExecFx") exec(ctx, fx, x, y, f);
  else tie(ctx, fx, x, y, f);
  return true;
}
