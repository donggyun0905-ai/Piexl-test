// 이벤트 상점 테마 효과 그리기: 바닥(걸음 자국·빛 · 대기 발밑 문양) · 위(내 탄 빛 꼬리 · 튀는 조각(빛 번짐) · 섬광 · 베기 · 충격파 · 대기 때 도는 조각 · 글자)
import type { RunState } from "@pixel-rogue/shared";
import type { Snap } from "../render/palette";
import { additive, alpha, glow, shock } from "../render/pwFxBits";
import { drawLight } from "./fxLight";
import type { FxTheme } from "../../shop/fxThemes";
import type { ThemeFx } from "./themeFx";
import { idleLevel } from "./tigerDraw";
import type { Part } from "./tigerFx";
import { drawShape } from "./themeShapes";

type Ctx = CanvasRenderingContext2D;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function drawThemePart(ctx: Ctx, p: Part): void {
  const f = p.life / p.max;
  ctx.save();
  ctx.translate(p.x, p.y);
  if (p.ground) {
    // 바닥 자국: 둘레가 살짝 빛나고 천천히 사라짐
    ctx.globalAlpha = Math.min(0.5, f);
    glow(ctx, 0, 0, 6 * p.size, p.color, 0.5);
    ctx.globalAlpha = Math.min(0.9, 1.4 * f);
  } else {
    // 조각: 겹치면 밝아지는 빛 번짐 + 또렷한 모양
    ctx.globalAlpha = Math.min(0.5, f);
    additive(ctx, () => drawShape(ctx, p.shape ?? "dot", p.size * 1.9, p.rot, p.color, p.flip));
    ctx.globalAlpha = Math.min(1, f * 1.6);
  }
  drawShape(ctx, p.shape ?? "dot", p.size, p.rot, p.color, p.flip);
  ctx.restore();
}

/** 충격파 (바닥에 눕힌 고리) */
function drawRing(ctx: Ctx, p: Part): void {
  const f = p.life / p.max;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(1, 0.55);
  additive(ctx, () => shock(ctx, 0, 0, p.size * (1 - f * f) + 3, p.color, f, 6));
  ctx.restore();
}

function drawPart(ctx: Ctx, p: Part): void {
  const f = p.life / p.max;
  if (drawLight(ctx, p)) return;
  if (p.kind === "theme") drawThemePart(ctx, p);
  else if (p.kind === "ring") drawRing(ctx, p);
  else if (p.kind === "text") {
    ctx.globalAlpha = Math.min(1, f * 3);
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#1a1424";
    ctx.strokeText(p.text ?? "", p.x, p.y);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text ?? "", p.x, p.y);
    ctx.globalAlpha = 1;
  }
}

/** 대기 발밑 문양: 빛 웅덩이 + 서로 반대로 도는 점선 고리 두 개 + 위로 퍼지는 맥박 */
function idleGround(ctx: Ctx, t: FxTheme, x: number, y: number, k: number, tick: number): void {
  ctx.save();
  ctx.globalAlpha = k;
  ctx.translate(x, y + 5);
  ctx.scale(1, 0.5);
  glow(ctx, 0, 0, 30, t.idle.glow, 0.7);
  additive(ctx, () => {
    for (const [r, dir, c] of [[20, 1, t.colors[0]], [26, -1, t.colors[1]]] as const) {
      ctx.save();
      ctx.rotate((tick / 90) * dir);
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = alpha(c, 0.7 * k);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    const u = (tick % 80) / 80;
    shock(ctx, 0, 0, 8 + u * 24, t.colors[2], (1 - u) * 0.6 * k, 4);
  });
  ctx.restore();
}

/** 대기: 내 둘레를 천천히 도는 테마 조각 다섯 (앞뒤로 오르내림) */
function idleOrbit(ctx: Ctx, t: FxTheme, x: number, y: number, k: number, tick: number): void {
  for (let i = 0; i < 5; i++) {
    const a = tick / 50 + (i / 5) * Math.PI * 2;
    const ox = Math.cos(a) * 15;
    const oy = Math.sin(a) * 6 - 8 + Math.sin(tick / 20 + i) * 2;
    ctx.save();
    ctx.translate(x + ox, y + oy);
    ctx.globalAlpha = k * (0.55 + 0.45 * Math.sin(a));
    additive(ctx, () => drawShape(ctx, t.idle.bits, 1.6, a, t.colors[i % 3]!));
    drawShape(ctx, t.idle.bits, 0.8, a, t.colors[i % 3]!);
    ctx.restore();
  }
}

/** 바닥: 걸음 자국 · 대기 발밑 문양 */
export function drawThemeUnder(ctx: Ctx, fx: ThemeFx, s: RunState, a: number, snap: Snap): void {
  for (const p of fx.parts) if (p.ground) drawThemePart(ctx, p);
  const t = fx.themes.idle;
  const k = t ? idleLevel(fx) : 0;
  if (!t || k <= 0) return;
  idleGround(ctx, t, snap(lerp(s.player.prevX, s.player.x, a)), snap(lerp(s.player.prevY, s.player.y, a)), k, s.tick);
}

/** 내 탄 꼬리: 가늘어지는 빛줄기 (테마 색 + 흰 속) */
function trails(ctx: Ctx, t: FxTheme, s: RunState, a: number): void {
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (const pr of s.projectiles) {
      if (!pr.fromPlayer) continue;
      const x = lerp(pr.prevX, pr.x, a);
      const y = lerp(pr.prevY, pr.y, a);
      const v = Math.hypot(pr.vx, pr.vy) || 1;
      const ux = pr.vx / v;
      const uy = pr.vy / v;
      for (const [len, w, c, al] of [[14, 4, t.colors[0], 0.35], [10, 2.2, t.colors[1], 0.6], [6, 1, "#ffffff", 0.8]] as const) {
        const g = ctx.createLinearGradient(x, y, x - ux * len, y - uy * len);
        g.addColorStop(0, alpha(c, al));
        g.addColorStop(1, alpha(c, 0));
        ctx.strokeStyle = g;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - ux * len, y - uy * len);
        ctx.stroke();
      }
    }
    ctx.lineCap = "butt";
  });
}

/** 위: 내 탄 꼬리 · 조각 · 섬광 · 베기 · 파동 · 글자 · 대기 조각 */
export function drawThemeOver(ctx: Ctx, fx: ThemeFx, s: RunState, a: number, snap: Snap): void {
  ctx.save();
  if (fx.themes.hit) trails(ctx, fx.themes.hit, s, a);
  for (const p of fx.parts) if (!p.ground) drawPart(ctx, p);
  const t = fx.themes.idle;
  const k = t ? idleLevel(fx) : 0;
  if (t && k > 0) idleOrbit(ctx, t, snap(lerp(s.player.prevX, s.player.x, a)), snap(lerp(s.player.prevY, s.player.y, a)), k, s.tick);
  ctx.restore();
}

/** 상점 미리 보기: 조각 모두 (바닥 자국 → 조각 · 파동), 대기면 발밑 문양·도는 조각 */
export function drawThemePreview(ctx: Ctx, fx: ThemeFx, idleGlow?: { x: number; y: number }): void {
  const t = fx.themes.idle;
  if (t && idleGlow) idleGround(ctx, t, idleGlow.x, idleGlow.y - 5, 1, fx.tick);
  for (const p of fx.parts) if (p.ground) drawThemePart(ctx, p);
  ctx.save();
  for (const p of fx.parts) if (!p.ground) drawPart(ctx, p);
  ctx.restore();
  if (t && idleGlow) idleOrbit(ctx, t, idleGlow.x, idleGlow.y - 4, 1, fx.tick);
}
