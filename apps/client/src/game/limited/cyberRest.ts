// 네온 펄스 대기 장면: 발밑에 원근 네온 격자 · 도는 홀로그램 고리 · 둘레를 도는 육각 패널 · 다 차면 충전 막대가 차오르고 "CHARGED" (화면 전용)
// 캐릭터는 그대로 서 있음 (눕지 않음) · 드론은 cyberDraw
import type { RunState } from "@pixel-rogue/shared";
import { CHROME, CYAN, PINK, VIOLET } from "./cyberFx";

type Ctx = CanvasRenderingContext2D;

/** 육각형 (가로로 납작) */
export function hexPath(ctx: Ctx, x: number, y: number, r: number, flat = 0.5): void {
  ctx.beginPath();
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r * flat;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
}

/** 대기 장면 (k: 기운 0~1). 서 있는 몸을 숨기지 않으니 false */
export function drawCyberRest(ctx: Ctx, s: RunState, px: number, py: number, k: number, tick: number): boolean {
  void s;
  const y0 = py + 6;
  // 원근 격자: 가로줄은 아래로 흘러감, 세로줄은 가운데로 모임
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const f = ((i + (tick * 0.02) % 1) / 5);
    const w = 18 + f * 34;
    ctx.globalAlpha = k * 0.5 * f;
    ctx.strokeStyle = i % 2 ? CYAN : VIOLET;
    ctx.beginPath();
    ctx.moveTo(px - w, y0 - 6 + f * 14);
    ctx.lineTo(px + w, y0 - 6 + f * 14);
    ctx.stroke();
  }
  ctx.globalAlpha = k * 0.35;
  ctx.strokeStyle = PINK;
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(px + i * 5, y0 - 6);
    ctx.lineTo(px + i * 16, y0 + 8);
    ctx.stroke();
  }
  // 도는 홀로그램 고리 두 겹 (끊긴 선)
  for (const [r, sp, c] of [[22, 0.03, CYAN], [30, -0.02, PINK]] as const) {
    ctx.globalAlpha = k * 0.75;
    ctx.strokeStyle = c;
    ctx.setLineDash([5, 4]);
    ctx.lineDashOffset = tick * sp * 40;
    ctx.beginPath();
    ctx.ellipse(px, y0, r, r * 0.38, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  // 둘레를 도는 작은 육각 패널 셋
  for (let i = 0; i < 3; i++) {
    const a = tick * 0.025 + (i / 3) * Math.PI * 2;
    const x = px + Math.cos(a) * 34;
    const y = py - 8 + Math.sin(a) * 12;
    ctx.globalAlpha = k * (Math.sin(a) > 0 ? 0.9 : 0.45);
    ctx.fillStyle = "rgba(60, 240, 255, 0.18)";
    hexPath(ctx, x, y, 5, 1);
    ctx.fill();
    ctx.strokeStyle = i === 1 ? PINK : CYAN;
    ctx.stroke();
  }
  // 다 차면 머리 위 충전 막대 + CHARGED
  if (k >= 1) {
    const full = Math.min(1, ((tick % 120) / 80));
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#0a0618";
    ctx.fillRect(px - 11, py - 30, 22, 4);
    ctx.fillStyle = full >= 1 ? CHROME : CYAN;
    ctx.fillRect(px - 10, py - 29, 20 * full, 2);
    if (full >= 1 && (tick >> 3) % 2 === 0) {
      ctx.font = "bold 5px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = PINK;
      ctx.fillText("CHARGED", px, py - 33);
    }
  }
  ctx.globalAlpha = 1;
  return false;
}
