// 헬피스트 효과 — 적혈의 주먹. 후리기(부채꼴을 따라 옆으로 휘둘러지는 붉은 궤적 · 끝 충격) · 내려찍기(앞 부채꼴 충격파 · 손톱 자국 · 튀는 불티, 갈라진 땅은 hellfistCrack)
// 균열 파쇄(hellfistCrack: 금을 따라 붉은 유리가 깨짐) · 허공검격(사용자 그림 X자 8프레임) · 적혈 각성(붉은 충격파 · 지옥불 기둥 · 불티)
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, cone, crescent, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import { drawShatter } from "./hellfistCrack";
import type { Snap } from "./palette";

export const HF = { red: "#ff2a2a", deep: "#8a0a12", black: "#1a0608", ember: "#ff8a3a", white: "#ffffff" };
const HF_FX = new Set(["hfJabFx", "hfSmashFx", "hfShatterFx", "hfClawFx", "hfAwakeFx"]);
const XSHEET = new Image();
XSHEET.src = `${import.meta.env.BASE_URL}sprites/hellfist_x.png`;

/** 후리기: 주먹이 부채꼴을 따라 옆으로 크게 휘둘러지며 붉은 궤적 · 끝에서 충격 */
function jab(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  const half = Math.min(1.3, Math.acos(Math.max(-1, Math.min(1, fx.arc ?? 0.2))));
  const r = fx.size * 0.85;
  const u = easeOut(Math.min(1, f * 1.8));
  const from = a - half;
  const lead = from + 2 * half * u;
  const al = 1 - f;
  additive(ctx, () => {
    // 궤적: 지나온 자리일수록 옅게
    const mid = (from + lead) / 2;
    const span = Math.max(0.05, (lead - from) / 2);
    crescent(ctx, x, y, r + 4, mid, span, 12 * al + 3, HF.red, al);
    crescent(ctx, x, y, r - 6, mid, span * 0.8, 4, HF.red, al * 0.6);
    crescent(ctx, x, y, r - 14, mid, span * 0.6, 3, HF.red, al * 0.4);
  });
  // 궤적 안쪽 검붉은 결
  ctx.strokeStyle = alpha(HF.deep, al * 0.8);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, r - 2, Math.max(from, lead - 1), lead);
  ctx.stroke();
  // 궤적 맨 앞 충격
  const fx2 = x + Math.cos(lead) * r;
  const fy2 = y + Math.sin(lead) * r;
  if (u > 0.85) additive(ctx, () => shock(ctx, fx2, fy2, 6 + 30 * (f - 0.47), HF.red, al, 5));
}

/** 내려찍기: 손톱 셋 달린 큰 손바닥 자국 · 앞 부채꼴 충격 · 갈라진 땅 · 돌 조각 */
function smash(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  const arc = Math.acos(Math.max(-1, Math.min(1, fx.arc ?? 0.1)));
  const r = fx.size;
  const hx = x + fx.dirX * r * 0.55;
  const hy = y + fx.dirY * r * 0.55;
  const al = 1 - f;
  additive(ctx, () => {
    cone(ctx, x, y, a, arc, r * (0.6 + 0.4 * easeOut(f)), HF.red, al * 0.8);
    shock(ctx, hx, hy, r * 0.6 * easeOut(f), HF.red, al, 8);
    glow(ctx, hx, hy, r * 0.5, HF.red, al * 0.8, 0.6);
  });
  // 손톱 셋 자국 (손바닥 앞 · 바라보는 쪽으로 긁힘)
  const nx = -fx.dirY;
  const ny = fx.dirX;
  for (let k = -1; k <= 1; k++) {
    const sx = hx + nx * k * 7;
    const sy = hy + ny * k * 7;
    beam(ctx, sx, sy, sx + fx.dirX * 12, sy + fx.dirY * 12, 2.5 * al + 0.5, HF.red, al);
  }
  sparks(ctx, hx, hy, 8, r * 0.5, f, HF.ember, Math.round(x + y), al);
}

/** 허공검격: 적 자리 공중에 X자 검격 (사용자 그림 sprites/hellfist_x, 8프레임: 작게 → 크게 → 검게 터짐) · width = 크기 */
function claw(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const w = Math.max(44, ((fx.width ?? 10) + 8) * 2.4);
  if (XSHEET.complete && XSHEET.naturalWidth > 0) {
    const fr = Math.min(7, Math.floor(f * 8));
    const cell = XSHEET.naturalHeight;
    ctx.drawImage(XSHEET, fr * cell, 0, cell, cell, Math.round(x - w / 2), Math.round(y - 6 - w / 2), Math.round(w), Math.round(w));
  }
  if (f < 0.3) additive(ctx, () => glow(ctx, x, y - 6, w * 0.4, HF.red, (0.3 - f) * 2, 0.4));
}

/** 적혈 각성: 붉은 충격파 두 겹 · 솟는 지옥불 기둥 · 올라가는 불티 */
function awake(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const al = 1 - f;
  additive(ctx, () => {
    glow(ctx, x, y - 6, fx.size * 0.8, HF.red, 0.8 * al, 0.6);
    shock(ctx, x, y, fx.size * easeOut(f), HF.red, 0.9 * al, 12);
    shock(ctx, x, y, fx.size * 0.6 * easeOut(Math.min(1, f * 1.5)), HF.ember, 0.7 * al, 6);
    beam(ctx, x, y, x, y - 60 - 40 * f, 8 * al + 1, HF.red, 0.8 * al);
  });
  for (let k = 0; k < 10; k++) {
    const sx = x + (rnd(k, 5) - 0.5) * fx.size;
    const sy = y - fx.size * 0.8 * f * (0.5 + rnd(k, 9));
    ctx.fillStyle = alpha(k % 3 ? HF.red : HF.ember, al);
    ctx.fillRect(Math.round(sx), Math.round(sy), 2, 2);
  }
}

export function drawHellfistFx(ctx: Ctx, fx: EffectState, snapPx: Snap): boolean {
  if (!HF_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snapPx(fx.x);
  const y = snapPx(fx.y);
  if (fx.kind === "hfJabFx") jab(ctx, fx, x, y, f);
  else if (fx.kind === "hfSmashFx") smash(ctx, fx, x, y, f);
  else if (fx.kind === "hfShatterFx") drawShatter(ctx, { ...fx, x, y }, f);
  else if (fx.kind === "hfClawFx") claw(ctx, fx, x, y, f);
  else awake(ctx, fx, x, y, f);
  return true;
}
