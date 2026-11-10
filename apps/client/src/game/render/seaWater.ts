// 바다 공용 그리기 (숨은 시련 죽음의 바다 · 레비아탄): 깊은 물빛·빛줄기 · 비눗방울 · 머리 위 숨 게이지
import { ROOM_HEIGHT, ROOM_WIDTH, SEA_BUBBLE_R, type RunState } from "@pixel-rogue/shared";
import { hpBarTop } from "./hpTop";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 깊은 바다 물빛 · 내려오는 빛줄기 (죽음의 바다 · 레비아탄) */
export function drawDeepSea(ctx: Ctx, s: RunState): void {
  ctx.fillStyle = "rgba(6, 30, 70, 0.45)";
  ctx.fillRect(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
  ctx.fillStyle = "rgba(160, 220, 255, 0.07)";
  for (let i = 0; i < 4; i++) {
    const x = ((i * 90 + s.tick * 0.2) % (ROOM_WIDTH + 40)) - 20;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 14, 0);
    ctx.lineTo(x + 44, ROOM_HEIGHT);
    ctx.lineTo(x + 24, ROOM_HEIGHT);
    ctx.fill();
  }
}

/** 비눗방울 [x, y, 사라지는 틱] (죽음의 바다 · 레비아탄) */
export function drawBubbles(ctx: Ctx, s: RunState, list: readonly (readonly [number, number, number])[]): void {
  const r = SEA_BUBBLE_R();
  for (const [x, y, until] of list) {
    const left = until - s.tick;
    const a = Math.min(1, left / 30);
    const rr = r + Math.sin((s.tick + x) * 0.15);
    ctx.fillStyle = `rgba(170, 230, 255, ${0.22 * a})`;
    ctx.strokeStyle = `rgba(230, 250, 255, ${0.85 * a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * a})`;
    ctx.fillRect(Math.round(x - rr * 0.45), Math.round(y - rr * 0.55), 3, 2);
  }
}

/** 머리 위 숨 게이지 (k = 남은 숨 비율, 죽음의 바다 · 레비아탄) */
export function drawAirGauge(ctx: Ctx, s: RunState, k: number, alpha: number, snap: Snap): void {
  const p = s.player;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = hpBarTop(p, snap(lerp(p.prevY, p.y, alpha))) - 6;
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(x - 12, y - 1, 24, 4);
  ctx.fillStyle = k > 0.25 ? "#6ad8ff" : Math.floor(s.tick / 6) % 2 ? "#ff5050" : "#ffd0d0";
  ctx.fillRect(x - 11, y, Math.round(22 * k), 2);
  // 작은 방울 표시
  ctx.strokeStyle = "#d8f4ff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x - 15, y + 1, 2, 0, TAU);
  ctx.stroke();
}
