// 범 풍류 그리기: 바닥(발자국·백호 기운) · 위(탄 꼬리·불꽃·발톱·파동·기둥·글자·K.O 도장·까치) (화면 전용, 피해 숫자는 tigerNumber)
import type { RunState } from "@pixel-rogue/shared";
import type { Snap } from "../render/palette";
import { drawMap, FUR, GOLD, HEAD_COLORS, INK, MAGPIE, MAGPIE_COLORS, PAW, TIGER_HEAD } from "./tigerArt";
import { clawPath } from "./tigerNumber";
import { IDLE_FULL, IDLE_START, type Part, type TigerFx } from "./tigerFx";
import { drawTigerSprite } from "./tigerSprites";
import { drawTigerRest } from "./tigerRest";

type Ctx = CanvasRenderingContext2D;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const PAW_COLORS = { o: GOLD };

/** 대기 기운 0~1 */
export function idleLevel(fx: TigerFx): number {
  return Math.max(0, Math.min(1, (fx.idle - IDLE_START) / (IDLE_FULL - IDLE_START)));
}

function drawPaw(ctx: Ctx, p: Part): void {
  ctx.save();
  ctx.globalAlpha = 0.75 * (p.life / p.max);
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot + Math.PI / 2);
  if (!drawTigerSprite(ctx, "paw", 0, 0, p.size)) drawMap(ctx, PAW, PAW_COLORS, 0, 0, p.size);
  ctx.restore();
}

/** 바닥: 발자국 · 대기 때 백호 기운 (적·플레이어보다 아래) */
export function drawTigerUnder(ctx: Ctx, fx: TigerFx, s: RunState, alpha: number, snap: Snap, tick: number): void {
  for (const p of fx.parts) if (p.kind === "paw") drawPaw(ctx, p);
  const k = fx.on.idle ? idleLevel(fx) : 0;
  if (k <= 0) return;
  const px = snap(lerp(s.player.prevX, s.player.x, alpha));
  const py = snap(lerp(s.player.prevY, s.player.y, alpha));
  ctx.save();
  // 도트 그림이 있으면 발밑 기운은 그림으로 (금빛 점 타원 · 오르는 빛줄기)
  ctx.globalAlpha = k;
  ctx.translate(px, py + 5);
  const drawn = drawTigerSprite(ctx, "aura", (tick >> 3) % 4, 0, 1, 0.5, 38 / 48);
  ctx.translate(-px, -py - 5);
  if (!drawn) drawAuraCode(ctx, px, py, k, tick);
  // 자는 백호 · 기대어 앉아 자는 캐릭터 · 감싼 꼬리 · 둘레 풍악 악기 (tigerRest)
  fx.sleepReady = fx.on.rest && drawTigerRest(ctx, s, px, py, k, tick);
  if (!fx.sleepReady && fx.on.rest) {
    // 그림이 없으면 예전처럼 백호 머리가 뒤에서 숨 쉬듯 떠오름
    ctx.globalAlpha = 0.5 * k;
    drawMap(ctx, TIGER_HEAD, HEAD_COLORS, px, py - 36 - k * 6 + Math.sin(tick * 0.06) * 1.5, 3);
  }
  ctx.restore();
}

/** 다 차면 서 있던 캐릭터 대신 (게임 그리기에서 몸을 숨김) 백호에 기대어 앉은 모습 */
export const tigerResting = (fx: TigerFx): boolean => idleLevel(fx) >= 1 && !!fx.sleepReady;

/** 발밑 기운 (도트 그림이 없을 때): 금빛 원·도는 점·빛줄기 */
function drawAuraCode(ctx: Ctx, px: number, py: number, k: number, tick: number): void {
  // 발밑 금빛 원과 도는 점
  const glow = ctx.createRadialGradient(px, py + 4, 2, px, py + 4, 34);
  glow.addColorStop(0, `rgba(255, 216, 96, ${0.45 * k})`);
  glow.addColorStop(1, "rgba(255, 216, 96, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(px - 40, py - 30, 80, 70);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + tick * 0.03;
    ctx.globalAlpha = k * (i % 2 ? 0.9 : 0.5);
    ctx.fillStyle = i % 4 === 0 ? FUR : GOLD;
    ctx.fillRect(px + Math.cos(a) * 20 - 1, py + 5 + Math.sin(a) * 7 - 1, 2, 2);
  }
  // 하늘로 오르는 빛줄기
  for (let i = 0; i < 5; i++) {
    const x = px - 16 + i * 8 + Math.sin(tick * 0.05 + i) * 2;
    const h = 30 + Math.sin(tick * 0.08 + i * 2) * 8;
    const g = ctx.createLinearGradient(0, py + 4 - h, 0, py + 4);
    g.addColorStop(0, "rgba(255, 240, 180, 0)");
    g.addColorStop(1, `rgba(255, 220, 110, ${0.35 * k})`);
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(x, py + 4 - h, 2, h);
  }
}

/** 근접·맞힘 발톱 자국: 끝이 날카로운 초승달 셋 (바깥 갈색 테두리 · 안쪽 노랑 · 한가운데 붉은 줄) */
function drawClaw(ctx: Ctx, p: Part): void {
  const t = 1 - p.life / p.max;
  const grow = Math.min(1, t * 3.5);
  const h = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  if (p.flip) ctx.scale(-1, 1);
  // 처음부터 조금 비쳐 보이고 서서히 흐려짐
  ctx.globalAlpha = 0.7 * (1 - t * 0.85);
  const n = p.claws ?? 3;
  if (drawTigerSprite(ctx, "claw", t * 4, n - 1, h / 16)) {
    ctx.restore();
    return;
  }
  for (let i = -1; i <= 1; i++) {
    if (n < 3 && i === 1) continue;
    if (n < 2 && i === -1) continue;
    const ox = i * h * 0.2;
    const w = (i === 0 ? 0.075 : 0.06) * h + 0.6;
    const args = [ox - h * 0.08, -h / 2, ox + h * 0.08, h / 2, h * 0.12] as const;
    clawPath(ctx, ...args, w + 1, grow);
    ctx.fillStyle = "#5a3010";
    ctx.fill();
    const mid = clawPath(ctx, ...args, w, grow);
    ctx.fillStyle = "#ffd040";
    ctx.fill();
    ctx.beginPath();
    mid.forEach((q, k) => (k === 0 ? ctx.moveTo(q.x, q.y) : ctx.lineTo(q.x, q.y)));
    ctx.strokeStyle = "#e0201a";
    ctx.lineWidth = Math.max(0.6, w * 0.32);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSeal(ctx: Ctx, p: Part): void {
  const t = 1 - p.life / p.max;
  const pop = t < 0.1 ? 2 - t * 10 : 1;
  ctx.save();
  ctx.globalAlpha = Math.min(1, (p.life / p.max) * 3);
  ctx.translate(p.x, p.y);
  ctx.rotate(-0.15);
  ctx.scale(pop, pop);
  if (drawTigerSprite(ctx, "seal", 0)) {
    ctx.restore();
    return;
  }
  ctx.fillStyle = INK;
  ctx.fillRect(-15, -8, 30, 16);
  ctx.fillStyle = p.color;
  ctx.fillRect(-14, -7, 28, 14);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1;
  ctx.strokeRect(-12.5, -5.5, 25, 11);
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff4e0";
  ctx.fillText(p.text ?? "", 0, 1);
  ctx.restore();
}

function drawPart(ctx: Ctx, p: Part): void {
  const f = p.life / p.max;
  switch (p.kind) {
    case "spark":
    case "dust":
    case "petal": {
      ctx.globalAlpha = p.kind === "petal" ? Math.min(1, f * 2) : f;
      ctx.fillStyle = p.color;
      const w = p.kind === "petal" ? 2 : p.kind === "dust" ? Math.round(p.size) : f > 0.5 ? 2 : 1;
      ctx.fillRect(p.x - w / 2, p.y - w / 2, w, p.kind === "petal" ? 1 : w);
      break;
    }
    case "claw":
      drawClaw(ctx, p);
      break;
    case "ring":
      ctx.globalAlpha = f;
      ctx.save();
      ctx.translate(p.x, p.y);
      if (drawTigerSprite(ctx, "ring", (1 - f) * 4, 0, Math.max(0.3, p.size / 23))) {
        ctx.restore();
        break;
      }
      ctx.restore();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2 * f + 0.5;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * (1 - f) + 2, (p.size * (1 - f) + 2) * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "pillar": {
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.translate(p.x, p.y + 6);
      const ok = drawTigerSprite(ctx, "pillar", (1 - f) * 4, 0, p.size / 16, 0.5, 1);
      ctx.restore();
      if (ok) break;
      const w = p.size * f;
      const g = ctx.createLinearGradient(0, p.y - 70, 0, p.y + 6);
      g.addColorStop(0, "rgba(255, 240, 170, 0)");
      g.addColorStop(1, "rgba(255, 216, 96, 0.8)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(p.x - w / 2, p.y - 70, w, 76);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * f})`;
      ctx.fillRect(p.x - w / 6, p.y - 70, w / 3, 76);
      break;
    }
    case "text":
      ctx.globalAlpha = Math.min(1, f * 3);
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#5a1010";
      ctx.strokeText(p.text ?? "", p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text ?? "", p.x, p.y);
      break;
    case "seal":
      drawSeal(ctx, p);
      break;
    case "paw":
      break;
  }
}

/** 위: 내 탄 꼬리 · 조각 · 대기 때 갓 쓴 까치 */
export function drawTigerOver(ctx: Ctx, fx: TigerFx, s: RunState, alpha: number, snap: Snap, tick: number): void {
  ctx.save();
  for (const pr of s.projectiles) {
    if (!pr.fromPlayer || !fx.on.hit) continue;
    const x = lerp(pr.prevX, pr.x, alpha);
    const y = lerp(pr.prevY, pr.y, alpha);
    const v = Math.hypot(pr.vx, pr.vy) || 1;
    const dx = -pr.vx / v;
    const dy = -pr.vy / v;
    // 호랑이 줄무늬 꼬리 (금·먹 번갈아)
    for (let i = 1; i <= 6; i++) {
      ctx.globalAlpha = 0.9 - i * 0.13;
      ctx.fillStyle = i % 2 ? GOLD : i === 2 ? fx.accent : INK;
      const w = Math.max(1, 3 - i * 0.4);
      ctx.fillRect(snap(x + dx * i * 2.4 - w / 2), snap(y + dy * i * 2.4 - w / 2), w, w);
    }
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.arc(x, y, pr.r + 2, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const p of fx.parts) if (p.kind !== "paw") drawPart(ctx, p);
  const k = fx.on.rest ? idleLevel(fx) : 0;
  if (k > 0) {
    const px = lerp(s.player.prevX, s.player.x, alpha);
    const py = lerp(s.player.prevY, s.player.y, alpha);
    const a = tick * 0.045;
    ctx.globalAlpha = k;
    drawMap(ctx, MAGPIE[Math.floor(tick / 6) % 2]!, MAGPIE_COLORS, snap(px + Math.cos(a) * 18), snap(py - 20 + Math.sin(a) * 5), 1, Math.sin(a) > 0);
  }
  ctx.restore();
}
