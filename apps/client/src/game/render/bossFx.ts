// 보스 그리기: 위험 표시(원·부채꼴·선, 검기는 반짝임) · 보스 공격 효과(베기·찌르기·덩굴·검기·빛기둥·불기둥·메테오). 적 탄 모양·보스 생김새는 bossLook
import { ROOM_HEIGHT, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, ROOM_WIDTH, type Hazard, type RunState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { drawBossHit } from "./bossHits";
import { s2HazardTint } from "./s2Bosses";
import { drawMortarShell } from "./s1Bosses";
import { additive, shock } from "./pwFxBits";

const TAU = Math.PI * 2;

/** 부채꼴 (cos = -1 이하면 한 바퀴) */
function wedge(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, dx: number, dy: number, cos: number): void {
  ctx.beginPath();
  if (cos <= -1) {
    ctx.arc(x, y, r, 0, TAU);
  } else {
    const a = Math.atan2(dy, dx);
    const half = Math.acos(cos);
    ctx.moveTo(x, y);
    ctx.arc(x, y, r, a - half, a + half);
    ctx.closePath();
  }
}

/** 네 갈래로 반짝이는 빛 */
function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.fillRect(Math.round(x - r), Math.round(y), Math.round(r * 2 + 1), 1);
  ctx.fillRect(Math.round(x), Math.round(y - r), 1, Math.round(r * 2 + 1));
}

/** 위험 표시: 원 안이 차오르다 터짐 · 부채꼴 · 선 (검기는 흰빛이 반짝이며 진해짐, 덩굴은 풀빛) */
export function drawHazards(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  // 시즌 2 층 보스 방: 위험 표시를 그 보스 색으로 (진흙·불·전기·바다)
  const s2 = s2HazardTint(s);
  for (const h of s.hazards ?? []) {
    // 아직 깔리지 않은 것 (기억력 선)
    if (s.tick < h.start) continue;
    const f = Math.min(1, (s.tick + alpha - h.start) / Math.max(1, h.tick - h.start));
    const blink = Math.floor(s.tick / 4) % 2 === 0 || f < 0.7;
    const x = snap(h.x);
    const y = snap(h.y);
    if (h.still) {
      // 심판: 방 전체가 검게(가만히) 또는 붉게(움직여야) 물들며 테두리가 깜빡임
      const black = h.still === "black";
      ctx.fillStyle = black ? `rgba(0, 0, 0, ${0.15 + 0.4 * f})` : `rgba(200, 30, 40, ${0.12 + 0.3 * f})`;
      ctx.fillRect(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
      ctx.strokeStyle = blink ? (black ? "rgba(180, 180, 200, 0.9)" : "rgba(255, 90, 90, 0.95)") : "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 3;
      ctx.strokeRect(ROOM_MIN_X + 2, ROOM_MIN_Y + 2, ROOM_MAX_X - ROOM_MIN_X - 4, ROOM_MAX_Y - ROOM_MIN_Y - 4);
      continue;
    }
    if (h.toX !== undefined && h.toY !== undefined) {
      drawLineHazard(ctx, h, x, y, snap(h.toX), snap(h.toY), f, s.tick, s2);
      continue;
    }
    drawMortarShell(ctx, h, f, s.tick);
    const tint = s2 ? s2 : h.fx === "holy" ? "255, 220, 120" : h.fx === "pillar" || h.fx === "meteor" ? "255, 140, 40" : h.fx === "fake" ? "170, 90, 255" : h.fx === "dark" || h.fx === "scythe" || h.fx === "spike" ? "120, 60, 160" : "230, 70, 70";
    // 바닥 전체는 옅게, 안쪽부터 진하게 차오름 (원·부채꼴 모두) · 테두리는 또렷하게 · 터지기 직전 밝게 번쩍임
    ctx.fillStyle = `rgba(${tint}, 0.1)`;
    wedge(ctx, x, y, h.radius, h.dirX ?? 1, h.dirY ?? 0, h.arc ?? -1);
    ctx.fill();
    ctx.fillStyle = `rgba(${tint}, ${0.16 + 0.24 * f})`;
    wedge(ctx, x, y, Math.max(1, h.radius * f), h.dirX ?? 1, h.dirY ?? 0, h.arc ?? -1);
    ctx.fill();
    ctx.strokeStyle = blink ? `rgba(${s2 ? s2 : h.fx === "holy" ? "255, 220, 120" : "255, 90, 90"}, 0.95)` : "rgba(255, 230, 230, 0.95)";
    ctx.lineWidth = 1.5;
    wedge(ctx, x, y, h.radius, h.dirX ?? 1, h.dirY ?? 0, h.arc ?? -1);
    ctx.stroke();
    if (f > 0.8 && (h.arc ?? -1) <= -1) additive(ctx, () => shock(ctx, x, y, h.radius, s2 ? `#${s2.split(", ").map((v) => Number(v).toString(16).padStart(2, "0")).join("")}` : `#${h.fx === "holy" ? "ffdc78" : "ff5a5a"}`, (f - 0.8) * 4, 6));
  }
}

function drawLineHazard(ctx: CanvasRenderingContext2D, h: Hazard, x: number, y: number, tx: number, ty: number, f: number, tick: number, s2: string | null): void {
  const w = h.width ?? 4;
  ctx.lineCap = "round";
  if (h.fx === "memory") {
    // 기억력: 진해지지 않는 흰 선 (어느 것이 먼저인지 기억해야 함)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = w * 2;
    line(ctx, x, y, tx, ty);
    ctx.lineCap = "butt";
    return;
  }
  if (h.fx === "gleam" || h.fx === "rgleam") {
    // 검기: 희미한 선이 점점 밝아지고 선을 따라 빛이 반짝임 (붉은 검기는 먼저 터짐)
    const red = h.fx === "rgleam";
    ctx.strokeStyle = red ? `rgba(255, 90, 90, ${0.2 + 0.4 * f})` : `rgba(200, 220, 255, ${0.15 + 0.35 * f})`;
    ctx.lineWidth = w * 2;
    line(ctx, x, y, tx, ty);
    ctx.strokeStyle = red ? `rgba(255, 200, 200, ${0.4 + 0.6 * f})` : `rgba(255, 255, 255, ${0.3 + 0.6 * f})`;
    ctx.lineWidth = 1;
    line(ctx, x, y, tx, ty);
    ctx.fillStyle = red ? `rgba(255, 140, 140, ${0.5 + 0.5 * f})` : `rgba(255, 255, 255, ${0.5 + 0.5 * f})`;
    const len = Math.hypot(tx - x, ty - y);
    for (let d = ((tick * 2 + h.x + h.y) % 24); d < len; d += 24) {
      const k = d / len;
      sparkle(ctx, x + (tx - x) * k, y + (ty - y) * k, 1 + Math.round(2 * f));
    }
  } else {
    const tint = s2 ?? (h.fx === "vine" ? "90, 200, 90" : h.fx === "fake" ? "160, 90, 255" : "230, 70, 70");
    ctx.strokeStyle = `rgba(${tint}, ${0.18 + 0.25 * f})`;
    ctx.lineWidth = w * 2;
    line(ctx, x, y, tx, ty);
    ctx.strokeStyle = `rgba(${h.fx === "vine" ? "140, 240, 120" : h.fx === "fake" ? "190, 140, 255" : "255, 90, 90"}, 0.8)`;
    ctx.lineWidth = 1;
    // 끝에서부터 차오르는 가운데 줄
    line(ctx, x, y, x + (tx - x) * f, y + (ty - y) * f);
  }
  ctx.lineCap = "butt";
}

function line(ctx: CanvasRenderingContext2D, x: number, y: number, tx: number, ty: number): void {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(tx, ty);
  ctx.stroke();
}

/** 보스 공격 효과면 그리고 true (그림은 bossHits) */
export const drawBossFx = drawBossHit;
