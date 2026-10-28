// 이벤트 상점 테마 효과 그리기: 바닥(걸음 자국 · 대기 발밑 빛) · 위(내 탄 꼬리 · 튀는 조각 · 자국 · 파동 · 글자). 모양은 작은 도트로
import type { RunState } from "@pixel-rogue/shared";
import type { Snap } from "../render/palette";
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
  ctx.globalAlpha = p.ground ? Math.min(0.9, 1.4 * f) : Math.min(1, f * 1.6);
  drawShape(ctx, p.shape ?? "dot", p.size, p.rot, p.color, p.flip);
  ctx.restore();
}

/** 바닥: 걸음 자국 · 대기 발밑 빛 */
export function drawThemeUnder(ctx: Ctx, fx: ThemeFx, s: RunState, alpha: number, snap: Snap): void {
  for (const p of fx.parts) if (p.ground) drawThemePart(ctx, p);
  const t = fx.themes.idle;
  const k = t ? idleLevel(fx) : 0;
  if (!t || k <= 0) return;
  const px = snap(lerp(s.player.prevX, s.player.x, alpha));
  const py = snap(lerp(s.player.prevY, s.player.y, alpha));
  const g = ctx.createRadialGradient(px, py + 5, 1, px, py + 5, 28);
  g.addColorStop(0, `${t.idle.glow}88`);
  g.addColorStop(1, `${t.idle.glow}00`);
  ctx.save();
  ctx.globalAlpha = k;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(px, py + 5, 28, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** 위: 내 탄 꼬리 · 조각 · 파동 · 글자 */
export function drawThemeOver(ctx: Ctx, fx: ThemeFx, s: RunState, alpha: number, snap: Snap): void {
  const t = fx.themes.hit;
  ctx.save();
  if (t) {
    for (const pr of s.projectiles) {
      if (!pr.fromPlayer) continue;
      const x = lerp(pr.prevX, pr.x, alpha);
      const y = lerp(pr.prevY, pr.y, alpha);
      const v = Math.hypot(pr.vx, pr.vy) || 1;
      for (let i = 1; i <= 5; i++) {
        ctx.globalAlpha = 0.8 - i * 0.14;
        ctx.fillStyle = t.colors[i % 3]!;
        const w = Math.max(1, 3 - i * 0.45);
        ctx.fillRect(snap(x - (pr.vx / v) * i * 2.4 - w / 2), snap(y - (pr.vy / v) * i * 2.4 - w / 2), w, w);
      }
    }
  }
  for (const p of fx.parts) {
    if (p.ground) continue;
    const f = p.life / p.max;
    if (p.kind === "theme") drawThemePart(ctx, p);
    else if (p.kind === "ring") {
      ctx.globalAlpha = f;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2 * f + 0.5;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * (1 - f) + 2, (p.size * (1 - f) + 2) * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.kind === "text") {
      ctx.globalAlpha = Math.min(1, f * 3);
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#1a1424";
      ctx.strokeText(p.text ?? "", p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text ?? "", p.x, p.y);
    }
  }
  ctx.restore();
}

/** 상점 미리 보기: 조각 모두 (바닥 자국 → 조각 · 파동) */
export function drawThemePreview(ctx: Ctx, fx: ThemeFx, idleGlow?: { x: number; y: number }): void {
  const t = fx.themes.idle;
  if (t && idleGlow) {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = `${t.idle.glow}66`;
    ctx.beginPath();
    ctx.ellipse(idleGlow.x, idleGlow.y, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  for (const p of fx.parts) if (p.ground) drawThemePart(ctx, p);
  for (const p of fx.parts) {
    if (p.ground) continue;
    if (p.kind === "theme") drawThemePart(ctx, p);
    else if (p.kind === "ring") {
      const f = p.life / p.max;
      ctx.save();
      ctx.globalAlpha = f;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2 * f + 0.5;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * (1 - f) + 2, (p.size * (1 - f) + 2) * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}
