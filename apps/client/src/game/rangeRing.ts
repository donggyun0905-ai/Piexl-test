import type { RunState } from "@pixel-rogue/shared";
import { ringCells } from "./aimMark";

// 공격 사거리 표시 (설정·G·위쪽 버튼으로 켜고 끔): 가장 가까운 적이 다가올수록 진해지는 도트 원. 적이 범위 안에 들어와 때릴 수 있으면 사라짐
// 패왕전은 늘 보이고 상대가 범위 안이면 빨간 원

/** 범위 바깥 이 거리(게임 픽셀)부터 보이기 시작 */
const FADE_DIST = 60;
const MAX_ALPHA = 0.35;

export function drawRangeRing(ctx: CanvasRenderingContext2D, s: RunState, x: number, y: number): void {
  const p = s.player;
  const range = p.stats.range;
  // 가장 가까운 적과 범위 끝 사이 거리 (0 이하 = 때릴 수 있음)
  let gap = Infinity;
  for (const e of s.enemies) gap = Math.min(gap, Math.hypot(e.x - p.x, e.y - p.y) - (range + e.r));
  // 패왕전: 늘 보임 (상대가 범위 안에 들어오면 빨갛게)
  if (s.pvp) ctx.globalAlpha = MAX_ALPHA;
  else if (gap <= 0 || gap >= FADE_DIST) return;
  else ctx.globalAlpha = MAX_ALPHA * (1 - gap / FADE_DIST);
  ctx.fillStyle = s.pvp && gap <= 0 ? "#ff6a6a" : "#ffecbe";
  const cx = Math.round(x);
  const cy = Math.round(y);
  for (const [px, py] of ringCells(Math.round(range))) ctx.fillRect(cx + px, cy + py, 1, 1);
  ctx.globalAlpha = 1;
}
