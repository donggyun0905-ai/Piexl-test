// 변희 각성 효과: 공중 습격 선(흰 선이 열 번 반짝이며 꿰뚫음, 불사조는 불꽃) · 각성 기술 빛
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 동물 순번(sim/morphEvo) → 각성 빛 */
const EVO_GLOW = ["#6ad8ff", "#ff6a2a", "#a8e8ff", "#c88aff", "#ffd040", "#ffb040", "#ff3a5a", "#e8c080", "#d86aff", "#ffe080"];

export function drawMorphFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  if (fx.kind === "mRaid") {
    const x0 = snap(fx.x);
    const y0 = snap(fx.y);
    const x1 = snap(fx.toX ?? fx.x);
    const y1 = snap(fx.toY ?? fx.y);
    const fire = fx.dirX === 1;
    const len = Math.hypot(x1 - x0, y1 - y0) || 1;
    const nx = -(y1 - y0) / len;
    const ny = (x1 - x0) / len;
    // 열 줄이 번갈아 반짝이며 사라짐
    for (let i = 0; i < 10; i++) {
      const off = (i - 4.5) * (fx.size / 5);
      const on = (fx.ticks + i) % 3 !== 0;
      if (!on) continue;
      ctx.globalAlpha = (1 - t) * (0.5 + 0.5 * ((i * 7) % 3) / 2);
      ctx.strokeStyle = fire ? (i % 2 ? "#ffb040" : "#fff0a0") : "#ffffff";
      ctx.lineWidth = i === 4 || i === 5 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(x0 + nx * off, y0 + ny * off);
      ctx.lineTo(x1 + nx * off, y1 + ny * off);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "mEvo") {
    const c = EVO_GLOW[fx.dirX] ?? "#ffffff";
    const x = snap(fx.x);
    const y = snap(fx.y);
    ctx.globalAlpha = (1 - t) * 0.3;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, fx.size * (0.5 + t * 0.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1 - t;
    ctx.strokeStyle = c;
    ctx.lineWidth = 2;
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + t * 3;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(Math.round(x + Math.cos(a) * fx.size * t), Math.round(y + Math.sin(a) * fx.size * t), 2, 2);
    }
    ctx.globalAlpha = 1;
    return true;
  }
  return false;
}
