// 사멸 그리기: 은빛 독침(끝이 비취빛) · 바닥의 독가스 · 죽음이 걸린 적 위 보랏빛 기운 · 독가스 피어남 · 사방 침 섬광
import type { EffectState, ProjectileState, RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const PIN = "#e8ecf4";
const TIP = "#3ad87a";
const DOOM = "#a86ad8";

/** 탄: 독침 */
export function drawNeedleShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "smNeedle") return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  ctx.strokeStyle = PIN;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - dx * 6, y - dy * 6);
  ctx.lineTo(x + dx * 2, y + dy * 2);
  ctx.stroke();
  ctx.fillStyle = TIP;
  ctx.fillRect(Math.round(x + dx * 2), Math.round(y + dy * 2), 1, 1);
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = TIP;
  ctx.fillRect(Math.round(x - dx * 9), Math.round(y - dy * 9), 1, 1);
  ctx.globalAlpha = 1;
  return true;
}

/** 바닥: 독가스 (비취·보랏빛 구름이 천천히 꿈틀, 끝나 갈수록 옅어짐) */
export function drawSamyeolGround(ctx: Ctx, s: RunState, snap: Snap): void {
  for (const g of s.player.smGas ?? []) {
    const fade = Math.min(1, g.t / 40);
    for (let i = 0; i < 6; i++) {
      const a = i * 1.05 + s.tick * 0.012 * (i % 2 ? 1 : -1);
      const d = g.r * (0.3 + (i % 3) * 0.15);
      ctx.globalAlpha = 0.2 * fade;
      ctx.fillStyle = i % 3 === 0 ? "#3a8a5a" : i % 3 === 1 ? "#6ac87a" : "#5a2a6a";
      ctx.beginPath();
      ctx.arc(snap(g.x + Math.cos(a) * d), snap(g.y + Math.sin(a) * d * 0.7), g.r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.8 * fade;
    for (let i = 0; i < 4; i++) {
      const k = (s.tick * 0.4 + i * 11) % 36;
      ctx.fillStyle = i % 2 ? "#8aff9a" : DOOM;
      ctx.fillRect(Math.round(g.x + Math.sin(i * 2.1) * g.r * 0.6), Math.round(g.y + Math.cos(i * 1.3) * g.r * 0.4 - k * 0.4), 1, 1);
    }
  }
  ctx.globalAlpha = 1;
}

/** 몸 위: 죽음이 걸린 적 머리 위로 피어오르는 보랏빛 */
export function drawDoomMarks(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  if (s.player.characterId !== "samyeol") return;
  for (const e of s.enemies) {
    if ((e.smDeath ?? 0) <= 0 || e.hp <= 0) continue;
    const x = snap(lerp(e.prevX, e.x, alpha));
    const y = snap(lerp(e.prevY, e.y, alpha));
    for (let i = 0; i < 3; i++) {
      const k = (s.tick * 0.5 + i * 8) % 24;
      ctx.globalAlpha = 1 - k / 24;
      ctx.fillStyle = i % 2 ? DOOM : "#5a2a6a";
      ctx.fillRect(Math.round(x + (i - 1) * 3), Math.round(y - e.r - 2 - k * 0.5), 1, 2);
    }
  }
  ctx.globalAlpha = 1;
}

export function drawSamyeolFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "smGas") {
    // 독가스가 피어남: 퍼지는 고리 + 솟는 거품
    ctx.globalAlpha = (1 - t) * 0.7;
    ctx.strokeStyle = "#6ac87a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x, y, fx.size * (0.3 + t * 0.8), fx.size * (0.2 + t * 0.5), 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (fx.kind === "smBurst") {
    // 사방 침: 몸 둘레에 은빛 섬광 열둘
    ctx.globalAlpha = 1 - t;
    ctx.fillStyle = PIN;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.fillRect(Math.round(x + Math.cos(a) * fx.size * (0.5 + t)), Math.round(y + Math.sin(a) * fx.size * (0.5 + t)), 1, 1);
    }
  } else return false;
  ctx.globalAlpha = 1;
  return true;
}
