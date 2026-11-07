// 헬피스트 효과 — 적혈의 주먹. 찌르기(앞으로 뻗는 붉은 주먹 잔상 · 끝에 터지는 충격) · 내려찍기(악마 왼팔 손바닥 자국 · 앞 부채꼴 충격파 · 갈라지는 땅 · 튀는 돌)
// 검지 가리킴(나 → 적으로 뻗는 가는 붉은 선 · 손끝 빛) · 허공 검격(적 자리 공중에 비스듬한 검은·붉은 칼자국이 한 줄씩 그어지고 흰 속 · 잘린 자리 불똥)
// 적혈 각성(붉은 충격파 두 겹 · 솟는 지옥불 기둥 · 올라가는 불티). style 1 = 각성 중 (더 붉고 밝게)
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, cone, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

export const HF = { red: "#ff2a2a", deep: "#8a0a12", black: "#1a0608", ember: "#ff8a3a", white: "#ffffff" };
const HF_FX = new Set(["hfJabFx", "hfSmashFx", "hfPointFx", "hfClawFx", "hfAwakeFx"]);

/** 찌르기: 주먹 잔상이 앞으로 뻗고 끝에서 충격 */
function jab(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const reach = fx.size * easeOut(Math.min(1, f * 2.2));
  const tx = x + fx.dirX * reach;
  const ty = y + fx.dirY * reach;
  const al = 1 - f;
  additive(ctx, () => {
    beam(ctx, x + fx.dirX * 6, y + fx.dirY * 6, tx, ty, 5 * al + 1, fx.style ? HF.red : HF.deep, al);
    glow(ctx, tx, ty, 10 + 8 * f, HF.red, al, 0.8);
    if (f > 0.3) shock(ctx, tx, ty, 6 + 14 * easeOut((f - 0.3) / 0.7), HF.red, al, 4);
  });
  // 주먹 (검붉은 네모 · 흰 마디)
  ctx.fillStyle = alpha(HF.black, al);
  ctx.fillRect(Math.round(tx) - 3, Math.round(ty) - 3, 6, 6);
  ctx.fillStyle = alpha(HF.red, al);
  ctx.fillRect(Math.round(tx) - 2, Math.round(ty) - 2, 4, 4);
  ctx.fillStyle = alpha(HF.white, al);
  ctx.fillRect(Math.round(tx + fx.dirX * 2) - 1, Math.round(ty + fx.dirY * 2) - 1, 2, 2);
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
    cone(ctx, x, y, a, arc, r * (0.6 + 0.4 * easeOut(f)), fx.style ? HF.red : HF.deep, al * 0.8);
    shock(ctx, hx, hy, r * 0.6 * easeOut(f), HF.red, al, 8);
    glow(ctx, hx, hy, r * 0.5, HF.red, al * 0.8, 0.6);
  });
  // 갈라지는 땅: 손바닥 자리에서 뻗는 검은 금 (끝은 붉게)
  ctx.lineWidth = 2;
  for (let k = 0; k < 6; k++) {
    const ang = a + (rnd(k, 3) - 0.5) * arc * 2.2;
    const len = r * (0.3 + rnd(k, 7) * 0.35) * easeOut(Math.min(1, f * 2));
    const mx = hx + Math.cos(ang + 0.3) * len * 0.5;
    const my = hy + Math.sin(ang + 0.3) * len * 0.5;
    ctx.strokeStyle = alpha(HF.black, al);
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(mx, my);
    ctx.lineTo(hx + Math.cos(ang) * len, hy + Math.sin(ang) * len);
    ctx.stroke();
  }
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

/** 검지 가리킴: 손끝에서 적까지 가는 붉은 선이 빠르게 뻗었다 사라짐 */
function point(ctx: Ctx, fx: EffectState, x: number, y: number, tx: number, ty: number, f: number): void {
  const head = easeOut(Math.min(1, f * 3));
  const ex = x + (tx - x) * head;
  const ey = y + (ty - y) * head;
  const al = (1 - f) * 0.9;
  additive(ctx, () => {
    beam(ctx, x, y, ex, ey, 1, HF.red, al);
    glow(ctx, x, y, 6, HF.red, al, 1);
    glow(ctx, ex, ey, 5, HF.red, al, 0.6);
  });
}

/** 허공 검격: 적 자리 공중에 비스듬한 칼자국이 한 줄씩 그어짐 (size = 줄 수, width = 크기) */
function claw(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const n = Math.max(1, Math.round(fx.size));
  const w = (fx.width ?? 10) + 8;
  const yy = y - 6;
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * 0.45;
    if (f < t0) continue;
    const g = Math.min(1, (f - t0) / 0.18);
    const al = Math.max(0, 1 - (f - t0) / (1 - t0));
    // 줄마다 조금씩 어긋난 대각선 (번갈아 기울기)
    const off = (i - (n - 1) / 2) * 7;
    const tilt = i % 2 ? -1 : 1;
    const ax = x - w + off;
    const ay = yy - w * 0.8 * tilt;
    const bx = ax + (w * 2) * g;
    const by = ay + w * 1.6 * tilt * g;
    ctx.strokeStyle = alpha(HF.black, al);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.lineCap = "butt";
    additive(ctx, () => beam(ctx, ax, ay, bx, by, 2, fx.style ? HF.red : "#d8202a", al));
    if (g >= 1 && f - t0 < 0.3) sparks(ctx, (ax + bx) / 2, (ay + by) / 2, 4, 12, (f - t0) / 0.3, HF.ember, i * 7 + Math.round(x), al);
  }
  if (f < 0.2) additive(ctx, () => glow(ctx, x, yy, w, HF.red, (0.2 - f) * 3, 0.4));
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
  else if (fx.kind === "hfPointFx") point(ctx, fx, x, y, snapPx(fx.toX ?? fx.x), snapPx(fx.toY ?? fx.y), f);
  else if (fx.kind === "hfClawFx") claw(ctx, fx, x, y, f);
  else awake(ctx, fx, x, y, f);
  return true;
}
