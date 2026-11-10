// 시저스 효과 — 단죄의 가위. 열기(가는 칼날 두 개가 축에서 벌어지며 지나간 자리에 옅은 부채꼴 결 · 날 끝 잔광)
// 닫기(칼날 두 개가 축을 중심으로 X자로 맞물림 → 맞물린 자리 네 갈래 '싹둑' 빛 · 끊긴 붉은 실 조각) · 실 끊김(실이 하얗게 번쩍 → 가운데서 끊겨 양쪽으로 감김 · 끊긴 자리 빛)
// 단죄(목 높이 가로 일섬 → 라벤더 X · 네 갈래 빛 · 빛 조각, 피 없음) · 실 묶임(붉은 고리가 조여 들며 매듭)
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, easeOut, glow, rnd, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

export const SX = { blade: "#f4f0fa", lav: "#c8b8e8", red: "#ff2a3a", thread: "#ff3a4a", moon: "#c8d8ff" };
const SX_FX = new Set(["sxOpenFx", "sxCloseFx", "sxCutFx", "sxExecFx", "sxTieFx"]);

/** 칼날 하나: 축(x, y)에서 a 방향 길이 len · 뿌리 쪽이 두껍고 끝이 뾰족 · 한쪽 날은 밝게 */
function blade(ctx: Ctx, x: number, y: number, a: number, len: number, w: number, c: string, al: number): void {
  if (al <= 0) return;
  const cx = Math.cos(a);
  const cy = Math.sin(a);
  const nx = -cy;
  const ny = cx;
  ctx.fillStyle = alpha(c, al);
  ctx.beginPath();
  ctx.moveTo(x + nx * w * 0.5, y + ny * w * 0.5);
  ctx.lineTo(x + cx * len * 0.3 + nx * w, y + cy * len * 0.3 + ny * w);
  ctx.lineTo(x + cx * len, y + cy * len);
  ctx.lineTo(x - nx * w * 0.4, y - ny * w * 0.4);
  ctx.closePath();
  ctx.fill();
  // 벼린 날 (한쪽 가장자리 흰 줄)
  ctx.strokeStyle = `rgba(255,255,255,${al})`;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x + cx * len * 0.3 + nx * w, y + cy * len * 0.3 + ny * w);
  ctx.lineTo(x + cx * len, y + cy * len);
  ctx.stroke();
}

/** 네 갈래 빛 (가운데 x, y · 크기 r) */
function gleam(ctx: Ctx, x: number, y: number, r: number, c: string, al: number): void {
  additive(ctx, () => {
    glow(ctx, x, y, r * 0.8, c, al * 0.8, 1);
    beam(ctx, x - r, y, x + r, y, 1, c, al);
    beam(ctx, x, y - r * 0.7, x, y + r * 0.7, 1, c, al);
  });
}

/** 열기: 두 칼날이 축에서 벌어지며 앞을 넓게 휘두름 · 지나간 부채꼴에 옅은 결 (style 1 = 각성 달빛) */
function open(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  const half = Math.acos(Math.max(-1, Math.min(1, fx.arc ?? 0))) * 0.72;
  const c = fx.style ? SX.moon : SX.lav;
  const sw = easeOut(Math.min(1, f * 2.4));
  const al = f < 0.5 ? 1 : 1 - (f - 0.5) / 0.5;
  const len = fx.size * 0.95;
  // 지나간 자리: 옅은 부채꼴 (안쪽은 투명 · 바깥 가장자리 쪽만)
  const g = ctx.createRadialGradient(x, y, len * 0.35, x, y, len);
  g.addColorStop(0, alpha(c, 0));
  g.addColorStop(0.85, alpha(c, 0.22 * al));
  g.addColorStop(1, alpha(c, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, len, a - half * sw, a + half * sw);
  ctx.closePath();
  ctx.fill();
  // 휘두른 자리 가장자리 가는 빛줄
  ctx.strokeStyle = alpha(c, 0.7 * al);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, len * 0.97, a - half * sw, a + half * sw);
  ctx.stroke();
  for (const sgn of [-1, 1]) {
    const ba = a + sgn * half * sw;
    blade(ctx, x, y, ba, len, 3, sgn > 0 ? c : SX.blade, al);
    // 날 끝 잔광
    additive(ctx, () => glow(ctx, x + Math.cos(ba) * len, y + Math.sin(ba) * len, 5, c, 0.7 * al));
  }
}

/** 닫기: 두 칼날이 앞쪽 축을 중심으로 X자로 맞물림 → '싹둑' 네 갈래 빛 · 끊긴 붉은 실 조각 */
function close(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  const shut = easeOut(Math.min(1, f * 3.2));
  const al = f < 0.45 ? 1 : 1 - (f - 0.45) / 0.55;
  const px = x + Math.cos(a) * fx.size * 0.25;
  const py = y + Math.sin(a) * fx.size * 0.25;
  const len = fx.size * 0.8;
  const c = fx.style ? SX.moon : SX.blade;
  // 열린 각(±0.9)에서 맞물림(±0.12)으로
  const open = 0.9 - 0.78 * shut;
  for (const sgn of [-1, 1]) blade(ctx, px, py, a + sgn * open, len, 3.4, sgn > 0 ? c : SX.lav, al);
  if (shut < 1) return;
  const g = (f - 1 / 3.2) / (1 - 1 / 3.2);
  const mx = px + Math.cos(a) * len * 0.62;
  const my = py + Math.sin(a) * len * 0.62;
  gleam(ctx, mx, my, 12 * (1 - g) + 4, SX.red, 1 - g);
  // 잘린 붉은 실 조각
  ctx.strokeStyle = alpha(SX.thread, 1 - g);
  ctx.lineWidth = 1;
  const seed = Math.round(fx.x + fx.y);
  for (let k = 0; k < 4; k++) {
    const t = rnd(seed, k) * Math.PI * 2;
    const d = 6 + 14 * easeOut(g);
    const ex = mx + Math.cos(t) * d;
    const ey = my + Math.sin(t) * d * 0.7 + 6 * g * g;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex + Math.cos(t + 1.2) * 4, ey + Math.sin(t + 1.2) * 4);
    ctx.stroke();
  }
}

/** 실 끊김: 실이 하얗게 번쩍 → 가운데서 끊겨 양쪽으로 감김 · 끊긴 자리 네 갈래 빛 (size = 팽팽함 0~1) */
function snap(ctx: Ctx, fx: EffectState, x: number, y: number, tx: number, ty: number, f: number): void {
  const taut = fx.size;
  const mx = (x + tx) / 2;
  const my = (y + ty) / 2 - 4;
  if (f < 0.22) {
    additive(ctx, () => beam(ctx, x, y - 4, tx, ty - 4, 0.8 + taut * 1.6, taut > 0.6 ? "#ffffff" : SX.thread, 1));
    return;
  }
  const g = (f - 0.22) / 0.78;
  const back = easeOut(g);
  ctx.strokeStyle = alpha(SX.thread, 1 - g);
  ctx.lineWidth = 1;
  for (const [ex, ey] of [[x, y - 4], [tx, ty - 4]] as const) {
    const sx = mx + (ex - mx) * back;
    const sy = my + (ey - my) * back;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.quadraticCurveTo((ex + sx) / 2 + Math.sin(g * 9) * 5, (ey + sy) / 2 - 5 * (1 - g), sx, sy);
    ctx.stroke();
  }
  gleam(ctx, mx, my, (8 + 10 * taut) * (1 - g) + 3, taut > 0.6 ? "#ffffff" : SX.red, 1 - g);
  sparks(ctx, mx, my, 4 + Math.round(taut * 6), 10 + 10 * taut, g, taut > 0.6 ? "#ffffff" : "#ff8a94", Math.round(tx + ty));
}

/** 단죄: 목 높이를 가로지르는 흰 일섬 → 라벤더 X · 네 갈래 빛 · 빛 조각 (피 없음) */
function exec(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const ny = y - fx.size - 2;
  const w = 26 + fx.size * 2;
  const slash = easeOut(Math.min(1, f * 4));
  if (f < 0.5) additive(ctx, () => beam(ctx, x - w / 2, ny, x - w / 2 + w * slash, ny, 2, SX.blade, 1 - f * 2));
  if (f < 0.15) return;
  const g = (f - 0.15) / 0.85;
  const r = 6 + 4 * (1 - g);
  additive(ctx, () => {
    beam(ctx, x - r, ny - r, x + r, ny + r, 1.2, SX.lav, 1 - g);
    beam(ctx, x - r, ny + r, x + r, ny - r, 1.2, SX.lav, 1 - g);
  });
  gleam(ctx, x, ny, 14 * (1 - g) + 4, SX.lav, 1 - g);
  sparks(ctx, x, ny, 10, 20, g, SX.lav, Math.round(fx.x + fx.y));
}

/** 실 묶임: 붉은 고리가 조여 들고 위에 작은 매듭 */
function tie(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const k = 1.5 - 0.5 * easeOut(f);
  const rx = (fx.size + 5) * k;
  ctx.strokeStyle = alpha(SX.thread, 1 - f);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, rx * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = alpha(SX.thread, 1 - f);
  ctx.fillRect(Math.round(x + rx * 0.7) - 1, Math.round(y - rx * 0.4) - 1, 3, 3);
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
