// 여름 파도 그리기: 바닥(맨발 자국·대기 장면) · 위(탄 거품 꼬리·물방울·물결 자국·파동·물기둥·글자·구명튜브 K.O·갈매기) (피해 숫자는 summerNumber)
import type { RunState } from "@pixel-rogue/shared";
import type { Snap } from "../render/palette";
import { drawMap } from "./tigerArt";
import { idleLevel } from "./tigerDraw";
import type { Part, TigerFx } from "./tigerFx";
import { CORAL, FOAM, SEA } from "./summerFx";
import { FOOT, FOOT_COLORS, GULL, GULL_COLORS } from "./summerArt";
import { drawSummerRest } from "./summerRest";

type Ctx = CanvasRenderingContext2D;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 바닥: 맨발 자국 · 대기 장면 (적·플레이어보다 아래) */
export function drawSummerUnder(ctx: Ctx, fx: TigerFx, s: RunState, alpha: number, snap: Snap, tick: number): void {
  ctx.save();
  for (const p of fx.parts) {
    if (p.kind !== "foot") continue;
    ctx.globalAlpha = 0.7 * (p.life / p.max);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot + Math.PI / 2);
    drawMap(ctx, FOOT, FOOT_COLORS, 0, 0, 1);
    // 발가락 끝 작은 물거품 (자리마다 조금씩 다르게)
    ctx.fillStyle = FOAM;
    ctx.fillRect(((p.x * 7) | 0) % 2 ? 4 : -1, ((p.y * 3) | 0) % 2 ? 0 : 1, 1, 1);
    ctx.restore();
  }
  const k = fx.on.idle ? idleLevel(fx) : 0;
  if (k > 0) {
    const px = snap(lerp(s.player.prevX, s.player.x, alpha));
    const py = snap(lerp(s.player.prevY, s.player.y, alpha));
    fx.sleepReady = fx.on.rest && drawSummerRest(ctx, s, px, py, k, tick);
  }
  ctx.restore();
}

/** 다 차면 서 있던 캐릭터 대신 파라솔 아래 누운 모습 */
export const summerResting = (fx: TigerFx): boolean => idleLevel(fx) >= 1 && !!fx.sleepReady;

/** 물결 자국: 흰 거품 테두리가 있는 휘어진 파도 (그어지듯 커지고 흐려짐) */
function drawWave(ctx: Ctx, p: Part): void {
  const t = 1 - p.life / p.max;
  const grow = Math.min(1, t * 3.5);
  const r = p.size * 0.6;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  if (p.flip) ctx.scale(1, -1);
  ctx.globalAlpha = 0.9 * (1 - t);
  ctx.lineCap = "round";
  for (const [c, w, off] of [[p.color, 4, 0], [SEA, 2.5, 0], [FOAM, 1, -1.5]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(-r * 0.4, off, r, -1.3, -1.3 + 2.6 * grow);
    ctx.stroke();
  }
  // 파도 끝 말림
  if (grow >= 1) {
    ctx.fillStyle = FOAM;
    const a = 1.3;
    ctx.fillRect(Math.cos(a) * r - r * 0.4 - 1, Math.sin(a) * r - 1, 2, 2);
  }
  ctx.restore();
}

/** 보스 처치 도장: 빨강·흰 구명튜브 위 K.O */
function drawBuoy(ctx: Ctx, p: Part): void {
  const t = 1 - p.life / p.max;
  const pop = t < 0.1 ? 2 - t * 10 : 1;
  ctx.save();
  ctx.globalAlpha = Math.min(1, (p.life / p.max) * 3);
  ctx.translate(p.x, p.y);
  ctx.scale(pop, pop);
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = i % 2 ? "#ffffff" : CORAL;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 10, (i / 8) * Math.PI * 2, ((i + 1) / 8) * Math.PI * 2);
    ctx.stroke();
  }
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#0a2a4a";
  ctx.strokeText(p.text ?? "", 0, 1);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(p.text ?? "", 0, 1);
  ctx.restore();
}

function drawPart(ctx: Ctx, p: Part): void {
  const f = p.life / p.max;
  switch (p.kind) {
    case "drop":
    case "dust":
      ctx.globalAlpha = f;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, Math.ceil(p.size), Math.ceil(p.size) + (p.kind === "drop" ? 1 : 0));
      break;
    case "bubble":
      ctx.globalAlpha = Math.min(1, f * 2) * 0.85;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, 1, 1);
      break;
    case "glint": {
      // 반짝: 십자 빛이 커졌다 작아짐
      const s = Math.sin(f * Math.PI) * 2.5 * p.size;
      ctx.globalAlpha = 1;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - s, p.y - 0.5, s * 2, 1);
      ctx.fillRect(p.x - 0.5, p.y - s, 1, s * 2);
      break;
    }
    case "wave":
      drawWave(ctx, p);
      break;
    case "ring":
      ctx.globalAlpha = f;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2 * f + 0.5;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * (1 - f) + 2, (p.size * (1 - f) + 2) * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "pillar": {
      // 물기둥: 아래에서 솟는 물 + 흰 물보라 꼭대기
      const w = p.size * f;
      const g = ctx.createLinearGradient(0, p.y - 70, 0, p.y + 6);
      g.addColorStop(0, "rgba(232, 252, 255, 0)");
      g.addColorStop(1, "rgba(74, 216, 255, 0.8)");
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
      ctx.strokeStyle = "#0a2a4a";
      ctx.strokeText(p.text ?? "", p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text ?? "", p.x, p.y);
      break;
    case "seal":
      drawBuoy(ctx, p);
      break;
    default:
      break;
  }
}

/** 위: 내 탄 거품 꼬리 · 조각 · 대기 때 도는 갈매기 */
export function drawSummerOver(ctx: Ctx, fx: TigerFx, s: RunState, alpha: number, snap: Snap, tick: number): void {
  ctx.save();
  for (const pr of s.projectiles) {
    if (!pr.fromPlayer || !fx.on.hit) continue;
    const x = lerp(pr.prevX, pr.x, alpha);
    const y = lerp(pr.prevY, pr.y, alpha);
    const v = Math.hypot(pr.vx, pr.vy) || 1;
    for (let i = 1; i <= 4; i++) {
      ctx.globalAlpha = 0.8 - i * 0.16;
      ctx.strokeStyle = i % 2 ? FOAM : fx.accent;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(snap(x - (pr.vx / v) * i * 3 + Math.sin(tick * 0.3 + i) * 0.8), snap(y - (pr.vy / v) * i * 3), 1 + i * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  for (const p of fx.parts) if (p.kind !== "foot") drawPart(ctx, p);
  const k = fx.on.rest ? idleLevel(fx) : 0;
  if (k > 0) {
    const px = lerp(s.player.prevX, s.player.x, alpha);
    const py = lerp(s.player.prevY, s.player.y, alpha);
    const a = tick * 0.035;
    ctx.globalAlpha = k;
    drawMap(ctx, GULL[Math.floor(tick / 8) % 2]!, GULL_COLORS, snap(px + Math.cos(a) * 30), snap(py - 44 + Math.sin(a) * 6), 1, Math.sin(a) > 0);
  }
  ctx.restore();
}
