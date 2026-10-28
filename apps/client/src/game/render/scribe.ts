// 서기관(히든) 그리기: 잉크 탄(보랏빛 잉크 방울 + 꼬리) · 글자 효과(써진 한자가 빛나며 떠오름) · 적에게 새겨진 기록(잉크 점)
import type { EffectState, ProjectileState, RunState } from "@pixel-rogue/shared";
import { additive, glow, shock } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 글자 번호 → 한자 (sim/scribe.WORD_INDEX 순서) · 빛 색 */
const GLYPH = ["劍", "爆", "封", "雷", "氷", "炎", "再", "星", "滅", "源"];
const GLOW = ["#e8e4ff", "#ff8a3a", "#ff5a6a", "#ffe04a", "#8ae8ff", "#ff6a2a", "#b89aff", "#fff4a0", "#9a4aff", "#ffd040"];

export function drawScribeShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "ink") return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  // 꼬리 (점점 흐려지는 잉크 방울)
  for (let i = 1; i <= 4; i++) {
    ctx.globalAlpha = 0.6 - i * 0.12;
    ctx.fillStyle = i % 2 ? "#4a2a8a" : "#b89aff";
    ctx.fillRect(Math.round(x - dx * i * 2.5) - 1, Math.round(y - dy * i * 2.5) - 1, 2, 2);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#1e1430";
  ctx.beginPath();
  ctx.arc(x, y, pr.r + 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#b89aff";
  ctx.fillRect(Math.round(x - dx), Math.round(y - dy) - 1, 1, 1);
  return true;
}

/** 글자: 써진 한자가 빛나며 위로 떠오르다 사라짐 */
export function drawScribeFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "scWord") return false;
  const t = fx.ticks / fx.maxTicks;
  const i = fx.dirX;
  const x = snap(fx.x);
  const y = snap(fx.y - (1 - t) * 10);
  const pop = 1 + 0.6 * Math.max(0, t - 0.75) * 4;
  ctx.save();
  ctx.globalAlpha = Math.min(1, t * 1.6);
  // 뒤에 빛나는 원 + 회전하는 글자 고리
  const gc = GLOW[i] ?? "#b89aff";
  additive(ctx, () => {
    glow(ctx, x, y - 4, 16 * pop, gc, 0.8, t > 0.75 ? 1 : 0);
    shock(ctx, x, y - 4, 10 + (1 - t) * 14, gc, t, 3);
  });
  ctx.strokeStyle = GLOW[i] ?? "#b89aff";
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.arc(x, y - 4, 13 * pop, fx.ticks * 0.15, fx.ticks * 0.15 + Math.PI * 1.6);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = `bold ${Math.round(14 * pop)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#140e1e";
  ctx.strokeText(GLYPH[i] ?? "源", x, y - 4);
  ctx.fillStyle = GLOW[i] ?? "#b89aff";
  ctx.fillText(GLYPH[i] ?? "源", x, y - 4);
  ctx.restore();
  return true;
}

/** 기록(잉크)이 새겨진 적 머리 위에 잉크 점 (서기관일 때만) */
export function drawInkMarks(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  if (s.player.characterId !== "scribe") return;
  for (const e of s.enemies) {
    const n = Math.min(9, e.ink ?? 0);
    if (n <= 0 || e.hp <= 0) continue;
    const x = snap(lerp(e.prevX, e.x, alpha));
    const y = snap(lerp(e.prevY, e.y, alpha)) - e.r - 7;
    for (let k = 0; k < n; k++) {
      ctx.fillStyle = k % 3 === 2 ? "#ffd040" : "#b89aff";
      ctx.fillRect(Math.round(x - n * 1.5 + k * 3), y, 2, 2);
    }
  }
}
