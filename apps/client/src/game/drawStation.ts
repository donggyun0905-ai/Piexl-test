// 바닥 작업대 그림 (drawPickup이 부름): 아티팩터 거대한 제작대 · 추적자 튜닝소. open = 창을 연 상태 (빛이 더 밝음)
import type { StationKind } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;

function rect(ctx: Ctx, c: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

export function drawStation(ctx: Ctx, kind: StationKind, x: number, y: number, tick: number, open: boolean): void {
  const pulse = 0.55 + 0.45 * Math.sin(tick * 0.12);
  // 그림자
  rect(ctx, "rgba(0,0,0,0.45)", x - 19, y + 10, 38, 3);
  if (kind === "bench") drawBench(ctx, x, y, tick, pulse, open);
  else drawTuneBay(ctx, x, y, tick, pulse, open);
}

/** 거대한 제작대: 두꺼운 나무 다리 · 쇠를 댄 상판 · 상판 위 푸른 문양 회로 · 집게·망치 · 가운데 떠오르는 빛 구슬 */
function drawBench(ctx: Ctx, x: number, y: number, tick: number, pulse: number, open: boolean): void {
  // 다리·가로대
  rect(ctx, "#3a2414", x - 16, y - 1, 4, 11);
  rect(ctx, "#3a2414", x + 12, y - 1, 4, 11);
  rect(ctx, "#5a3a20", x - 15, y, 2, 9);
  rect(ctx, "#5a3a20", x + 13, y, 2, 9);
  rect(ctx, "#4a2e18", x - 12, y + 5, 24, 2);
  // 상판 (나무 + 쇠 테두리)
  rect(ctx, "#1c1c26", x - 19, y - 7, 38, 7);
  rect(ctx, "#7a4e2a", x - 18, y - 6, 36, 5);
  rect(ctx, "#9a6a3a", x - 18, y - 6, 36, 1);
  rect(ctx, "#8a96a8", x - 19, y - 7, 3, 7);
  rect(ctx, "#8a96a8", x + 16, y - 7, 3, 7);
  // 상판 위 푸른 회로 문양 (숨 쉬듯 빛남)
  ctx.globalAlpha = (open ? 0.9 : 0.55) * pulse + 0.2;
  rect(ctx, "#6ab8ff", x - 14, y - 4, 10, 1);
  rect(ctx, "#6ab8ff", x - 5, y - 5, 1, 3);
  rect(ctx, "#6ab8ff", x + 4, y - 4, 10, 1);
  rect(ctx, "#6ab8ff", x + 4, y - 5, 1, 3);
  rect(ctx, "#c8ecff", x - 1, y - 4, 2, 1);
  ctx.globalAlpha = 1;
  // 집게 (왼쪽) · 망치 (오른쪽)
  rect(ctx, "#b8c0cc", x - 15, y - 10, 1, 4);
  rect(ctx, "#b8c0cc", x - 13, y - 10, 1, 4);
  rect(ctx, "#6a7080", x - 15, y - 11, 3, 1);
  rect(ctx, "#5a3a20", x + 12, y - 9, 1, 3);
  rect(ctx, "#8a96a8", x + 10, y - 11, 5, 2);
  // 가운데 떠오르는 빛 구슬 (제작 중인 문양)
  const bob = Math.round(Math.sin(tick * 0.08) * 1.5);
  const gy = y - 14 + bob;
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createRadialGradient(x, gy, 0, x, gy, open ? 11 : 8);
  g.addColorStop(0, `rgba(200,236,255,${0.9 * pulse})`);
  g.addColorStop(0.4, `rgba(106,184,255,${0.5 * pulse})`);
  g.addColorStop(1, "rgba(106,184,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, gy, open ? 11 : 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  rect(ctx, "#ffffff", x - 1, gy - 1, 2, 2);
  // 구슬 둘레를 도는 작은 빛 알갱이 둘
  for (let i = 0; i < 2; i++) {
    const a = tick * 0.1 + i * Math.PI;
    rect(ctx, "#c8ecff", Math.round(x + Math.cos(a) * 6), Math.round(gy + Math.sin(a) * 3), 1, 1);
  }
}

/** 튜닝소: 쇠 받침대 위 저격총 · 위에 매달린 작업등 · 옆 공구판 (렌치·드라이버) · 총신을 타고 흐르는 금빛 */
function drawTuneBay(ctx: Ctx, x: number, y: number, tick: number, pulse: number, open: boolean): void {
  // 받침대 (다리 둘 + 받침판)
  rect(ctx, "#2a2e3a", x - 14, y - 2, 3, 12);
  rect(ctx, "#2a2e3a", x + 11, y - 2, 3, 12);
  rect(ctx, "#4a5262", x - 18, y - 4, 36, 3);
  rect(ctx, "#6a7486", x - 18, y - 4, 36, 1);
  // 저격총 (개머리판 · 몸통 · 긴 총열 · 조준경 · 탄창)
  rect(ctx, "#4a3020", x - 17, y - 9, 6, 4);
  rect(ctx, "#2a2a32", x - 11, y - 9, 12, 3);
  rect(ctx, "#1c1c22", x + 1, y - 8, 16, 1);
  rect(ctx, "#1c1c22", x + 16, y - 9, 2, 3);
  rect(ctx, "#3a3e4a", x - 7, y - 13, 9, 3);
  rect(ctx, "#8ad8ff", x + 2, y - 12, 1, 1);
  rect(ctx, "#3a3e4a", x - 5, y - 6, 3, 3);
  // 총신을 타고 흐르는 금빛 (튜닝 중)
  const run = ((tick * 0.6) % 34) - 17;
  ctx.globalAlpha = (open ? 0.95 : 0.6) * pulse;
  rect(ctx, "#ffd56a", Math.round(x + run), y - 8, 3, 1);
  ctx.globalAlpha = 1;
  // 작업등 (위에서 비추는 빛 원뿔)
  rect(ctx, "#5a6272", x - 1, y - 24, 2, 5);
  rect(ctx, "#8a96a8", x - 4, y - 19, 8, 2);
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createLinearGradient(x, y - 17, x, y - 4);
  g.addColorStop(0, `rgba(255,236,180,${(open ? 0.45 : 0.28) * pulse})`);
  g.addColorStop(1, "rgba(255,236,180,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 4, y - 17);
  ctx.lineTo(x + 4, y - 17);
  ctx.lineTo(x + 14, y - 4);
  ctx.lineTo(x - 14, y - 4);
  ctx.closePath();
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  // 옆 공구판 (렌치 · 드라이버)
  rect(ctx, "#3a2a1a", x + 19, y - 12, 5, 12);
  rect(ctx, "#b8c0cc", x + 20, y - 11, 1, 5);
  rect(ctx, "#b8c0cc", x + 19, y - 11, 3, 1);
  rect(ctx, "#d84a3a", x + 22, y - 8, 1, 3);
  rect(ctx, "#b8c0cc", x + 22, y - 11, 1, 3);
}
