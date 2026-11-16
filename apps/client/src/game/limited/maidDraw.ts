// 벨벳 티타임 그리기: 바닥(구두 굽 자국·대기 장면: 체크무늬 바닥·찻잔과 김) · 위(탄 리본 꼬리·꽃잎·하트·금빛 반짝·레이스 고리·금빛 기둥·글자·SERVED! 도장·머리 위 리본) (피해 숫자는 maidNumber)
import type { RunState } from "@pixel-rogue/shared";
import type { Snap } from "../render/palette";
import { drawLight } from "./fxLight";
import { drawMap } from "./tigerArt";
import { idleLevel } from "./tigerDraw";
import type { Part, TigerFx } from "./tigerFx";
import { BLUSH, BOW, BOW_COLORS, CREAM, CUP, GILT, HEART, HEEL, INKM, PLUM, ROSE } from "./maidArt";

type Ctx = CanvasRenderingContext2D;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 대기 장면: 발밑에 체크무늬 바닥(마름모) · 옆 작은 탁자에 찻잔과 오르는 김 · 다 차면 김이 하트로 */
function drawRest(ctx: Ctx, px: number, py: number, k: number, tick: number): void {
  const y0 = py + 6;
  for (let i = -3; i <= 3; i++) {
    for (let j = -1; j <= 1; j++) {
      const d = Math.abs(i) / 3 + Math.abs(j) / 1.5;
      if (d > 1.2) continue;
      ctx.globalAlpha = k * 0.55 * (1.2 - d);
      ctx.fillStyle = (i + j) % 2 ? INKM : CREAM;
      const cx = px + i * 8;
      const cy = y0 + j * 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 2);
      ctx.lineTo(cx + 4, cy);
      ctx.lineTo(cx, cy + 2);
      ctx.lineTo(cx - 4, cy);
      ctx.fill();
    }
  }
  // 탁자 (금 다리 · 자주 보) + 찻잔
  const tx = px + 24;
  ctx.globalAlpha = k;
  ctx.fillStyle = GILT;
  ctx.fillRect(tx - 1, y0 - 8, 2, 8);
  ctx.fillStyle = PLUM;
  ctx.fillRect(tx - 7, y0 - 11, 14, 3);
  ctx.fillStyle = ROSE;
  ctx.fillRect(tx - 7, y0 - 9, 14, 1);
  drawMap(ctx, CUP, { c: CREAM, g: GILT, t: "#a0603a" }, tx, y0 - 15, 1);
  // 김: 위로 흔들리며 오름 (다 차면 하트)
  for (let i = 0; i < 3; i++) {
    const t = ((tick * 0.6 + i * 14) % 40) / 40;
    const sx = Math.round(tx - 1 + Math.sin(t * 6 + i) * 2);
    const sy = Math.round(y0 - 19 - t * 16);
    ctx.globalAlpha = k * (1 - t) * 0.8;
    if (k >= 1 && i === 1) drawMap(ctx, HEART[0]!, { o: BLUSH }, sx, sy, 1);
    else {
      ctx.fillStyle = CREAM;
      ctx.fillRect(sx, sy, 1, 2);
    }
  }
  ctx.globalAlpha = 1;
}

/** 바닥: 구두 굽 자국 · 대기 장면 (적·플레이어보다 아래) */
export function drawMaidUnder(ctx: Ctx, fx: TigerFx, s: RunState, alpha: number, snap: Snap, tick: number): void {
  ctx.save();
  for (const p of fx.parts) {
    if (p.kind !== "foot") continue;
    ctx.globalAlpha = 0.6 * (p.life / p.max);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot + Math.PI / 2);
    drawMap(ctx, HEEL, { o: p.color }, 0, 0, 1);
    ctx.restore();
  }
  const k = fx.on.idle ? idleLevel(fx) : 0;
  if (k > 0 && fx.on.rest) drawRest(ctx, snap(lerp(s.player.prevX, s.player.x, alpha)), snap(lerp(s.player.prevY, s.player.y, alpha)), k, tick);
  fx.sleepReady = false;
  ctx.restore();
}

/** 대기 장면에서 몸을 숨기지 않음 */
export const maidResting = (_fx: TigerFx): boolean => false;

/** 보스 처치 도장: 금테 자주 명패 + SERVED! */
function drawStamp(ctx: Ctx, p: Part): void {
  const t = 1 - p.life / p.max;
  const pop = t < 0.1 ? 2 - t * 10 : 1;
  ctx.save();
  ctx.globalAlpha = Math.min(1, (p.life / p.max) * 3);
  ctx.translate(p.x, p.y);
  ctx.scale(pop, pop);
  ctx.fillStyle = GILT;
  ctx.fillRect(-25, -7, 50, 14);
  ctx.fillStyle = PLUM;
  ctx.fillRect(-24, -6, 48, 12);
  ctx.fillStyle = ROSE;
  for (const sx of [-21, 20]) ctx.fillRect(sx, -1, 2, 2);
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = ROSE;
  ctx.fillText(p.text ?? "", 1, 1);
  ctx.fillStyle = CREAM;
  ctx.fillText(p.text ?? "", 0, 0);
  ctx.restore();
}

function drawPart(ctx: Ctx, p: Part): void {
  const f = p.life / p.max;
  if (drawLight(ctx, p)) return;
  switch (p.kind) {
    case "spark": {
      // 금빛 반짝: 작은 마름모
      ctx.globalAlpha = f;
      ctx.fillStyle = p.color;
      const x = Math.round(p.x);
      const y = Math.round(p.y);
      ctx.fillRect(x, y - 1, 1, 3);
      ctx.fillRect(x - 1, y, 3, 1);
      break;
    }
    case "glint":
      // 떠오르는 하트
      ctx.globalAlpha = Math.min(1, f * 2);
      drawMap(ctx, HEART[p.size ? 1 : 0]!, { o: p.color }, Math.round(p.x), Math.round(p.y), 1);
      break;
    case "petal":
      // 장미 꽃잎: 기울며 내려오는 작은 잎
      ctx.globalAlpha = Math.min(1, f * 3);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 1);
      if (p.size > 0.5) ctx.fillRect(Math.round(p.x) + (Math.sin(p.life * 0.2) > 0 ? 1 : 0), Math.round(p.y) + 1, 1, 1);
      break;
    case "ring":
      // 레이스 고리: 점으로 된 원
      ctx.globalAlpha = f;
      ctx.fillStyle = p.color;
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const r = p.size * (1 - f) + 3;
        ctx.fillRect(Math.round(p.x + Math.cos(a) * r), Math.round(p.y + Math.sin(a) * r * 0.7), i % 2 ? 1 : 2, 1);
      }
      break;
    case "pillar": {
      const w = p.size * f;
      const g = ctx.createLinearGradient(0, p.y - 72, 0, p.y + 6);
      g.addColorStop(0, "rgba(240, 200, 96, 0)");
      g.addColorStop(1, "rgba(240, 200, 96, 0.7)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(p.x - w / 2, p.y - 72, w, 78);
      ctx.fillStyle = `rgba(232, 64, 106, ${0.85 * f})`;
      for (let i = 0; i < 4; i++) ctx.fillRect(p.x - w / 2 + ((i * 5) % Math.max(1, w)), p.y - ((p.life * 2 + i * 17) % 72), 2, 1);
      break;
    }
    case "text":
      ctx.globalAlpha = Math.min(1, f * 3);
      ctx.font = "bold 8px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 3;
      ctx.strokeStyle = PLUM;
      ctx.strokeText(p.text ?? "", p.x, p.y);
      ctx.fillStyle = ROSE;
      ctx.fillText(p.text ?? "", p.x + 1, p.y + 1);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text ?? "", p.x, p.y);
      break;
    case "seal":
      drawStamp(ctx, p);
      break;
    default:
      break;
  }
}

/** 위: 내 탄 리본 꼬리 · 조각 · 대기 때 머리 위에 떠 있는 리본 */
export function drawMaidOver(ctx: Ctx, fx: TigerFx, s: RunState, alpha: number, snap: Snap, tick: number): void {
  ctx.save();
  for (const pr of s.projectiles) {
    if (!pr.fromPlayer || !fx.on.hit) continue;
    const x = lerp(pr.prevX, pr.x, alpha);
    const y = lerp(pr.prevY, pr.y, alpha);
    const v = Math.hypot(pr.vx, pr.vy) || 1;
    ctx.globalAlpha = 0.7;
    for (let i = 1; i <= 4; i++) {
      const w = Math.sin(tick * 0.4 + i) * 1.2;
      ctx.fillStyle = i % 2 ? ROSE : GILT;
      ctx.fillRect(snap(x - (pr.vx / v) * i * 2.5 - (pr.vy / v) * w), snap(y - (pr.vy / v) * i * 2.5 + (pr.vx / v) * w), 1, 1);
    }
  }
  for (const p of fx.parts) if (p.kind !== "foot") drawPart(ctx, p);
  const k = fx.on.rest ? idleLevel(fx) : 0;
  if (k > 0) {
    ctx.globalAlpha = k;
    drawMap(ctx, BOW, BOW_COLORS, snap(lerp(s.player.prevX, s.player.x, alpha)), snap(lerp(s.player.prevY, s.player.y, alpha) - 28 + Math.sin(tick * 0.08) * 1.5), 1);
  }
  ctx.restore();
}
