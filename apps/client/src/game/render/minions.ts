// 졸개 그리기: 가디언 방패(앞쪽 판·남은 칸) · 가디언 휘두르기 예고·휘두르기 효과
import { GUARD_ARC, GUARD_REACH, GUARD_SWING_TICKS, type EffectState, type EnemyState, type RunState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";

/** 몸 위에 덧그리기 (가디언 방패. 날벌레 날개는 그림에 있음) */
export function drawMinionDetail(ctx: CanvasRenderingContext2D, s: RunState, e: EnemyState, x: number, y: number): void {
  if (e.kind !== "guardian" || (e.shield ?? 0) <= 0) return;
  // 바라보는 쪽 방패 판 + 남은 칸 (머리 위)
  const fx = e.dirX || 1;
  const fy = e.dirY;
  const px = x + fx * (e.r + 2);
  const py = y + fy * (e.r + 2);
  ctx.fillStyle = "#d8e4ff";
  ctx.fillRect(Math.round(px - 2 + (Math.abs(fx) > Math.abs(fy) ? 1 : 0)), Math.round(py - 3), Math.abs(fx) > Math.abs(fy) ? 2 : 5, Math.abs(fx) > Math.abs(fy) ? 6 : 2);
  for (let i = 0; i < (e.shield ?? 0); i++) {
    ctx.fillStyle = "#8ab8ff";
    ctx.fillRect(x - 5 + i * 4, y - e.r - 8, 3, 2);
  }
}

/** 가디언 휘두르기 예고: 멈춰서 휘두를 앞쪽 부채꼴이 점점 진해짐 */
export function drawGuardianWarn(ctx: CanvasRenderingContext2D, e: EnemyState, x: number, y: number): void {
  if (e.kind !== "guardian" || e.phase !== "swing") return;
  const k = 1 - Math.max(0, e.timer) / GUARD_SWING_TICKS;
  const a = Math.atan2(e.dirY, e.dirX);
  const half = Math.acos(GUARD_ARC);
  ctx.fillStyle = `rgba(255, 90, 90, ${0.12 + 0.3 * k})`;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, GUARD_REACH, a - half, a + half);
  ctx.closePath();
  ctx.fill();
}

/** 가디언 휘두르기 효과면 그리고 true */
export function drawCleaveFx(ctx: CanvasRenderingContext2D, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "cleave") return false;
  const t = fx.ticks / fx.maxTicks;
  const a = Math.atan2(fx.dirY, fx.dirX);
  const half = Math.acos(GUARD_ARC);
  ctx.strokeStyle = "#ffe0d0";
  ctx.globalAlpha = t;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(snap(fx.x), snap(fx.y), fx.size * (1.1 - 0.2 * t), a - half, a + half);
  ctx.stroke();
  ctx.globalAlpha = 1;
  return true;
}
