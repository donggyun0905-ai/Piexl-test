// 보스 그리기: 위험 표시(원·부채꼴·선, 검기는 반짝임) · 보스 공격 효과(베기·찌르기·덩굴·검기·빛기둥·불기둥·메테오). 적 탄 모양·보스 생김새는 bossLook
import { ROOM_HEIGHT, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, ROOM_WIDTH, type EffectState, type Hazard, type RunState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";

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
      drawLineHazard(ctx, h, x, y, snap(h.toX), snap(h.toY), f, s.tick);
      continue;
    }
    const tint = h.fx === "holy" ? "255, 220, 120" : h.fx === "pillar" || h.fx === "meteor" ? "255, 140, 40" : h.fx === "fake" ? "170, 90, 255" : h.fx === "dark" || h.fx === "scythe" || h.fx === "spike" ? "120, 60, 160" : "230, 70, 70";
    ctx.fillStyle = `rgba(${tint}, ${0.14 + 0.22 * f})`;
    wedge(ctx, x, y, h.arc === undefined ? Math.max(1, h.radius * f) : h.radius, h.dirX ?? 1, h.dirY ?? 0, h.arc ?? -1);
    ctx.fill();
    ctx.strokeStyle = blink ? `rgba(${h.fx === "holy" ? "255, 220, 120" : "255, 90, 90"}, 0.9)` : "rgba(255, 220, 220, 0.9)";
    ctx.lineWidth = 1;
    wedge(ctx, x, y, h.radius, h.dirX ?? 1, h.dirY ?? 0, h.arc ?? -1);
    ctx.stroke();
  }
}

function drawLineHazard(ctx: CanvasRenderingContext2D, h: Hazard, x: number, y: number, tx: number, ty: number, f: number, tick: number): void {
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
    const tint = h.fx === "vine" ? "90, 200, 90" : h.fx === "fake" ? "160, 90, 255" : "230, 70, 70";
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

/** 보스 공격 효과면 그리고 true */
export function drawBossFx(ctx: CanvasRenderingContext2D, fx: EffectState, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const tx = snap(fx.toX ?? fx.x);
  const ty = snap(fx.toY ?? fx.y);
  if (fx.kind === "bslash") {
    // 휘두른 칼날 자국: 두꺼운 흰 호가 바깥으로 번지며 사라짐
    ctx.globalAlpha = t;
    ctx.strokeStyle = "#fff4e8";
    ctx.lineWidth = 3;
    const r = fx.size * (1.05 - 0.15 * t);
    ctx.beginPath();
    if ((fx.width ?? -1) <= -1) ctx.arc(x, y, r, 0, TAU);
    else {
      const a = Math.atan2(fx.dirY, fx.dirX);
      const half = Math.acos(fx.width ?? 0);
      ctx.arc(x, y, r, a - half, a + half);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "stab") {
    drawStab(ctx, x, y, tx, ty, t, fx.width ?? 3);
    return true;
  }
  if (fx.kind === "vine") {
    // 바닥에서 솟아오른 덩굴: 굵은 초록 줄기 + 가시
    ctx.globalAlpha = Math.min(1, t * 2);
    ctx.lineCap = "round";
    ctx.strokeStyle = "#2a6a2a";
    ctx.lineWidth = (fx.width ?? 6) * 1.6;
    line(ctx, x, y, tx, ty);
    ctx.strokeStyle = "#6ad06a";
    ctx.lineWidth = (fx.width ?? 6) * 0.7;
    line(ctx, x, y, tx, ty);
    ctx.lineCap = "butt";
    ctx.fillStyle = "#c8f0a0";
    for (let k = 0.1; k < 1; k += 0.15) ctx.fillRect(Math.round(x + (tx - x) * k), Math.round(y + (ty - y) * k) - 3, 1, 2);
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "gleam" || fx.kind === "rgleam") {
    ctx.globalAlpha = t;
    ctx.strokeStyle = fx.kind === "rgleam" ? "#ff7070" : "#ffffff";
    ctx.lineWidth = 1 + 2 * t;
    line(ctx, x, y, tx, ty);
    ctx.fillStyle = "#ffffff";
    sparkle(ctx, (x + tx) / 2, (y + ty) / 2, 3 + 3 * t);
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "memory") {
    ctx.globalAlpha = t;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = (fx.width ?? 6) * 2;
    line(ctx, x, y, tx, ty);
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "parry") {
    // 받아 넘김: 흰 불꽃 + "막음" 느낌의 짧은 엇갈린 선
    ctx.globalAlpha = t;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    line(ctx, x - 5, y - 5, x + 5, y + 5);
    line(ctx, x - 5, y + 5, x + 5, y - 5);
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "dark" || fx.kind === "fake") {
    // 그림자 대검 찍기 · 거짓 공격 (보라 연기만)
    ctx.globalAlpha = t;
    ctx.fillStyle = fx.kind === "dark" ? "rgba(40, 20, 60, 0.75)" : "rgba(170, 90, 255, 0.35)";
    ctx.beginPath();
    ctx.arc(x, y, fx.size * (1.1 - 0.2 * t), 0, TAU);
    ctx.fill();
    if (fx.kind === "dark") {
      ctx.fillStyle = "#d8d0f0";
      ctx.fillRect(x - 1, y - fx.size, 2, fx.size * 1.4);
    }
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "spike") {
    // 바닥에서 솟은 검은 바늘
    ctx.globalAlpha = t;
    ctx.fillStyle = "#2a1a3a";
    for (const dx of [-3, 0, 3]) {
      ctx.beginPath();
      ctx.moveTo(x + dx - 2, y + 3);
      ctx.lineTo(x + dx, y - fx.size * (dx === 0 ? 1.4 : 1));
      ctx.lineTo(x + dx + 2, y + 3);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "scythe") {
    // 바닥에서 솟은 대낫: 휘어진 날
    ctx.globalAlpha = t;
    ctx.strokeStyle = "#e8e0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + fx.size * 0.4, fx.size, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.strokeStyle = "#6a5a7a";
    ctx.beginPath();
    ctx.moveTo(x, y + fx.size * 0.4);
    ctx.lineTo(x, y - fx.size * 0.6);
    ctx.stroke();
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "pillar" || fx.kind === "meteor") {
    // 불기둥: 솟아오른 불 · 메테오: 크게 번지는 불꽃
    ctx.globalAlpha = t;
    if (fx.kind === "pillar") {
      ctx.fillStyle = "rgba(255, 120, 40, 0.7)";
      ctx.fillRect(x - fx.size * 0.5, y - 50 * t, fx.size, 50 * t + 4);
      ctx.fillStyle = "rgba(255, 230, 140, 0.9)";
      ctx.fillRect(x - fx.size * 0.2, y - 40 * t, fx.size * 0.4, 40 * t + 2);
    } else {
      ctx.fillStyle = "rgba(255, 110, 30, 0.55)";
      ctx.beginPath();
      ctx.arc(x, y, fx.size * (1.2 - 0.3 * t), 0, TAU);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 230, 150, 0.8)";
      ctx.beginPath();
      ctx.arc(x, y, fx.size * 0.5 * t, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "holy") {
    // 하늘에서 내려온 빛기둥
    ctx.globalAlpha = t;
    ctx.fillStyle = "rgba(255, 236, 160, 0.55)";
    ctx.fillRect(x - fx.size * 0.6, y - 60, fx.size * 1.2, 60);
    ctx.fillStyle = "rgba(255, 250, 220, 0.9)";
    ctx.fillRect(x - fx.size * 0.25, y - 60, fx.size * 0.5, 60);
    ctx.beginPath();
    ctx.ellipse(x, y, fx.size, fx.size * 0.45, 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    return true;
  }
  return false;
}

/** 찌르기: 빠르게 뻗는 날 + 흰 줄 + 끝에서 네 갈래로 반짝이는 빛 (격투가·거너 찌르기도 같이 씀) */
export function drawStab(ctx: CanvasRenderingContext2D, x: number, y: number, tx: number, ty: number, t: number, width: number): void {
  const k = Math.min(1, (1 - t) * 4);
  const ex = x + (tx - x) * k;
  const ey = y + (ty - y) * k;
  ctx.lineCap = "round";
  ctx.globalAlpha = t * 0.6;
  ctx.strokeStyle = "#a8c8ff";
  ctx.lineWidth = width + 2;
  line(ctx, x, y, ex, ey);
  ctx.globalAlpha = t;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  line(ctx, x, y, ex, ey);
  ctx.lineCap = "butt";
  const r = 2 + 4 * Math.sin(t * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rr = i % 2 === 0 ? r : r * 0.3;
    if (i === 0) ctx.moveTo(ex + Math.cos(a) * rr, ey + Math.sin(a) * rr);
    else ctx.lineTo(ex + Math.cos(a) * rr, ey + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}
