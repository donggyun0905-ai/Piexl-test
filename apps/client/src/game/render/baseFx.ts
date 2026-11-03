// 공용 효과 그리기 (캐릭터 전용 그림이 없을 때): 휘두르기(빛 베기 + 잔상) · 맞음(섬광 + 튀는 불똥) · 마법 폭발(충격파 + 빛) · 그 밖의 터짐 · 기본 탄(빛나는 구슬 + 꼬리)
import type { EffectState, ProjectileState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, glow, shock, sparks } from "./pwFxBits";
import { C, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 휘두르기: 두 겹 빛 초승달(앞쪽 흰 날) + 뒤로 남는 잔상 · 한 바퀴면 고리 베기 */
export function drawSwing(ctx: Ctx, fx: EffectState, px: number, py: number, t: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  const spin = fx.dirX === 0 && fx.dirY === 0;
  const grow = 1 - t;
  additive(ctx, () => {
    if (spin) {
      shock(ctx, px, py, fx.size * (0.8 + 0.25 * grow), "#fff0c8", t, 5);
      return;
    }
    // 휘두른 쪽으로 빛이 쓸고 지나감 (처음엔 가늘게 → 활짝)
    const sweep = a - 0.9 + 1.8 * Math.min(1, grow * 2.2);
    crescent(ctx, px, py, fx.size, (a + sweep) / 2, 0.55 + 0.5 * Math.min(1, grow * 2.2), 5 * t + 1, "#ffe8b0", t);
    crescent(ctx, px, py, fx.size * 0.82, a - 0.25, 0.6, 3 * t, "#ffb860", t * 0.5);
    glow(ctx, px + Math.cos(a) * fx.size * 0.7, py + Math.sin(a) * fx.size * 0.7, fx.size * 0.5, "#fff0c8", t * 0.5);
  });
}

/** 맞음: 짧은 흰 섬광 + 네 갈래 빛살 + 튀는 불똥 (작은 것도 또렷하게) */
export function drawHit(ctx: Ctx, fx: EffectState, snap: Snap, t: number): void {
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = Math.max(3, fx.size) * (1.4 - 0.5 * t);
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.6, "#ffe8a0", t, 1.6);
    ctx.strokeStyle = `rgba(255,255,255,${t})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const l = r * (0.8 + 1.2 * (1 - t));
    ctx.moveTo(x - l, y);
    ctx.lineTo(x + l, y);
    ctx.moveTo(x, y - l * 0.7);
    ctx.lineTo(x, y + l * 0.7);
    ctx.stroke();
    sparks(ctx, x, y, 5, r * 1.8, 1 - t, "#ffd070", fx.x * 7 + fx.y);
  });
  ctx.fillStyle = C.hit;
  ctx.globalAlpha = t;
  ctx.fillRect(x - 1, y - 1, 2, 2);
  ctx.globalAlpha = 1;
}

/** 마법탄 폭발: 보랏빛 충격파 + 안쪽 빛 + 흩어지는 별빛 */
export function drawBlast(ctx: Ctx, fx: EffectState, snap: Snap, t: number): void {
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = Math.max(4, fx.size) * (1.25 - t * 0.55);
  additive(ctx, () => {
    glow(ctx, x, y, r, C.shotMagic, t * 0.9, 1.2);
    shock(ctx, x, y, r, C.shotMagic, t, 5);
    sparks(ctx, x, y, 8, r * 1.3, 1 - t, "#f0d8ff", fx.x + fx.y * 3);
  });
}

/** 그 밖의 터짐: 흰 충격파 + 빛 */
/** 터짐 (t: 1 → 0) · 처치(from "kill")면 처음 몇 틱 하얗게 번쩍 + 사방으로 튀는 불똥·조각 */
export function drawBurst(ctx: Ctx, fx: EffectState, t: number): void {
  const size = Math.max(4, fx.size);
  const r = size * (1.5 - t);
  const f = 1 - t;
  const seed = Math.round(fx.x * 7 + fx.y * 13);
  const kill = fx.from === "kill";
  additive(ctx, () => {
    if (kill && t > 0.75) glow(ctx, fx.x, fx.y, size * 0.9, "#ffffff", (t - 0.75) * 4, 2);
    glow(ctx, fx.x, fx.y, r * 0.9, "#fff4d0", t * 0.7, 1);
    shock(ctx, fx.x, fx.y, r, "#ffe8b0", t, 4);
    if (kill) sparks(ctx, fx.x, fx.y, 10, size * 2.2, f, "#ffd890", seed);
  });
  if (!kill) return;
  // 조각: 작은 네모가 튀었다가 떨어짐
  ctx.fillStyle = `rgba(255,236,200,${t})`;
  for (let i = 0; i < 6; i++) {
    const a = ((seed * 37 + i * 61) % 360) * (Math.PI / 180);
    const d = size * (0.6 + f * 1.6) * (0.6 + ((seed + i * 13) % 5) / 10);
    ctx.fillRect(Math.round(fx.x + Math.cos(a) * d), Math.round(fx.y + Math.sin(a) * d * 0.7 + f * f * 6), 2, 2);
  }
}

/** 기본 탄: 빛 번짐 + 밝은 속 + 지나온 쪽 꼬리 (내 탄 노랑 · 적 탄 붉은 · 마법탄 보라) */
export function drawBaseShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): void {
  const c = pr.blast ? C.shotMagic : pr.fromPlayer ? C.shotPlayer : C.shotEnemy;
  const r = pr.r + (pr.blast ? 1 + Math.sin(tick / 3 + pr.id) * 0.6 : 0);
  const v = Math.hypot(pr.vx, pr.vy) || 1;
  const ux = pr.vx / v;
  const uy = pr.vy / v;
  additive(ctx, () => {
    const len = r * 4 + 4;
    const g = ctx.createLinearGradient(x, y, x - ux * len, y - uy * len);
    g.addColorStop(0, alpha(c, 0.7));
    g.addColorStop(1, alpha(c, 0));
    ctx.strokeStyle = g;
    ctx.lineWidth = r * 1.6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - ux * len, y - uy * len);
    ctx.stroke();
    ctx.lineCap = "butt";
    glow(ctx, x, y, r * 2.6, c, 0.8);
  });
  // 적 탄은 어두운 테두리로 바닥에서도 잘 보이게
  if (!pr.fromPlayer) {
    ctx.fillStyle = "#3a0a18";
    ctx.beginPath();
    ctx.arc(x, y, r + 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x - 1, y - 1, 2, 2);
}
