// 패왕전 자기장 그리기: 원 밖은 옅은 푸른 막(눈 안 아프게 낮은 진하기) · 지금 원은 부드러운 흰 테두리 · 다음 원은 가는 흰 점선 (어디까지 줄어드는지)
import { pvpZone, ROOM_HEIGHT, ROOM_WIDTH, type RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;

export function drawPwZone(ctx: Ctx, s: RunState): void {
  const z = pvpZone(s);
  if (!z) return;
  ctx.save();
  // 원 밖 막: 바깥 큰 사각형에서 원을 뺀 곳 (evenodd)
  ctx.beginPath();
  ctx.rect(-200, -200, ROOM_WIDTH + 400, ROOM_HEIGHT + 400);
  ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(60, 110, 230, ${0.16 + Math.min(0.12, z.phase * 0.02)})`;
  ctx.fill("evenodd");
  // 지금 원 테두리
  ctx.beginPath();
  ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(170, 210, 255, 0.85)";
  ctx.stroke();
  // 다음 원 (줄어들 곳)
  if (z.r - z.tr > 1) {
    ctx.beginPath();
    ctx.arc(z.tx, z.ty, z.tr, 0, Math.PI * 2);
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.stroke();
  }
  ctx.restore();
}
