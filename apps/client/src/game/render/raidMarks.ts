// 레이드: 내 캐릭터 표시 (패왕전처럼 머리 위 초록 화살표 + 발밑 고리, 늘 보임) · 레이드 방은 화면을 줄여 보니 2배로 크게
import { RAID_ROOM, type RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;

export function drawRaidMe(ctx: Ctx, s: RunState, x: number, y: number, r: number, top: number): void {
  if (!s.raidBoss) return;
  const k = s.roomId === RAID_ROOM.boss ? 2 : 1;
  const t = s.tick;
  // 발밑 고리: 초록 타원 + 도는 점선
  ctx.save();
  ctx.strokeStyle = "rgba(90, 232, 106, 0.85)";
  ctx.lineWidth = 1.5 * k;
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.6, r + 4 * k, (r + 4 * k) * 0.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([3 * k, 3 * k]);
  ctx.lineDashOffset = -t * 0.4;
  ctx.strokeStyle = "rgba(200, 255, 204, 0.7)";
  ctx.lineWidth = k;
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.6, r + 8 * k, (r + 8 * k) * 0.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  // 머리 위 화살표 (위아래로 흔들림)
  const ay = top - 6 * k + Math.sin(t / 6) * 2.5 * k;
  for (const [col, g] of [["#0a2010", 1.5], ["#5ae86a", 0]] as const) {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x - (7 + g) * k, ay - (9 + g) * k);
    ctx.lineTo(x + (7 + g) * k, ay - (9 + g) * k);
    ctx.lineTo(x, ay + g * 1.4 * k);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "#c8ffcc";
  ctx.fillRect(x - 4 * k, ay - 8 * k, 5 * k, k);
}
