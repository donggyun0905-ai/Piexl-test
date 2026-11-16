// 성탄 눈꽃 그리기: 바닥(장화 발자국·대기 장면: 눈밭·반짝이는 나무·선물) · 위(탄 지팡이 사탕 꼬리·눈꽃·반짝 별·색종이·별 기둥·글자·MERRY! 도장·머리 위 금종) (피해 숫자는 xmasNumber)
import type { RunState } from "@pixel-rogue/shared";
import type { Snap } from "../render/palette";
import { drawLight } from "./fxLight";
import { drawMap } from "./tigerArt";
import { idleLevel } from "./tigerDraw";
import type { Part, TigerFx } from "./tigerFx";
import { BELL, BELL_COLORS, BOOT, FLAKE, GIFT, ICE, NIGHT, PINE, RED, SNOW, STAR, TREE, TREE_COLORS } from "./xmasArt";

type Ctx = CanvasRenderingContext2D;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const LIGHTS = [RED, STAR, ICE, "#ff8ad8"];

/** 대기 장면: 발밑 눈밭 · 옆에 작은 나무(불빛이 차례로 깜빡) · 선물 상자 둘 · 다 차면 나무 꼭대기 별이 빛남 */
function drawRest(ctx: Ctx, px: number, py: number, k: number, tick: number): void {
  const y0 = py + 6;
  ctx.globalAlpha = k * 0.7;
  ctx.fillStyle = SNOW;
  ctx.beginPath();
  ctx.ellipse(px, y0, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = k * 0.35;
  ctx.fillStyle = ICE;
  ctx.beginPath();
  ctx.ellipse(px + 4, y0 + 2, 22, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = k;
  const tx = px + 24;
  const ty = y0 - 8;
  drawMap(ctx, TREE, TREE_COLORS, tx, ty, 1);
  // 불빛: 나무 위 자리 여섯 군데가 차례로
  const spots = [[-2, -3], [1, -1], [-3, 1], [2, 2], [-1, 3], [3, -2]] as const;
  spots.forEach(([dx, dy], i) => {
    if (((tick >> 3) + i) % 3 === 0) return;
    ctx.fillStyle = LIGHTS[i % 4]!;
    ctx.fillRect(Math.round(tx + dx), Math.round(ty + dy), 1, 1);
  });
  drawMap(ctx, GIFT, { b: RED, r: STAR }, px - 22, y0 - 3, 1);
  drawMap(ctx, GIFT, { b: PINE, r: SNOW }, px - 15, y0 - 1, 1);
  if (k >= 1) {
    const f = 0.5 + 0.5 * Math.sin(tick * 0.15);
    ctx.globalAlpha = 0.4 + 0.5 * f;
    ctx.fillStyle = STAR;
    ctx.fillRect(Math.round(tx) - 3, Math.round(ty - 6), 7, 1);
    ctx.fillRect(Math.round(tx), Math.round(ty - 9), 1, 7);
  }
  ctx.globalAlpha = 1;
}

/** 바닥: 장화 발자국 · 대기 장면 (적·플레이어보다 아래) */
export function drawXmasUnder(ctx: Ctx, fx: TigerFx, s: RunState, alpha: number, snap: Snap, tick: number): void {
  ctx.save();
  for (const p of fx.parts) {
    if (p.kind !== "foot") continue;
    ctx.globalAlpha = 0.7 * (p.life / p.max);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot + Math.PI / 2);
    drawMap(ctx, BOOT, { o: p.color }, 0, 0, 1);
    ctx.restore();
  }
  const k = fx.on.idle ? idleLevel(fx) : 0;
  if (k > 0 && fx.on.rest) drawRest(ctx, snap(lerp(s.player.prevX, s.player.x, alpha)), snap(lerp(s.player.prevY, s.player.y, alpha)), k, tick);
  fx.sleepReady = false;
  ctx.restore();
}

/** 대기 장면에서 몸을 숨기지 않음 */
export const xmasResting = (_fx: TigerFx): boolean => false;

/** 보스 처치 도장: 리본을 두른 빨간 띠 + MERRY! */
function drawStamp(ctx: Ctx, p: Part): void {
  const t = 1 - p.life / p.max;
  const pop = t < 0.1 ? 2 - t * 10 : 1;
  ctx.save();
  ctx.globalAlpha = Math.min(1, (p.life / p.max) * 3);
  ctx.translate(p.x, p.y);
  ctx.scale(pop, pop);
  ctx.fillStyle = RED;
  ctx.fillRect(-22, -6, 44, 12);
  ctx.fillStyle = STAR;
  ctx.fillRect(-22, -6, 44, 1);
  ctx.fillRect(-22, 5, 44, 1);
  for (const sx of [-1, 1]) {
    ctx.fillRect(sx * 22 - 1, -9, 3, 3);
    ctx.fillRect(sx * 25 - 1, -8, 3, 2);
  }
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = NIGHT;
  ctx.fillText(p.text ?? "", 1, 1);
  ctx.fillStyle = SNOW;
  ctx.fillText(p.text ?? "", 0, 0);
  ctx.restore();
}

function drawPart(ctx: Ctx, p: Part): void {
  const f = p.life / p.max;
  if (drawLight(ctx, p)) return;
  switch (p.kind) {
    case "dust":
      ctx.globalAlpha = f;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.ceil(p.size), Math.ceil(p.size));
      break;
    case "spark": {
      // 반짝 별: 네 갈래 십자
      const l = f > 0.5 ? 2 : 1;
      ctx.globalAlpha = f;
      ctx.fillStyle = p.color;
      const x = Math.round(p.x);
      const y = Math.round(p.y);
      ctx.fillRect(x - l, y, l * 2 + 1, 1);
      ctx.fillRect(x, y - l, 1, l * 2 + 1);
      break;
    }
    case "glint":
      ctx.globalAlpha = Math.min(1, f * 2);
      drawMap(ctx, FLAKE[p.size ? 1 : 0]!, { o: p.color, O: STAR }, Math.round(p.x), Math.round(p.y), 1);
      break;
    case "petal":
      // 함박눈 (둥근 눈송이)
      ctx.globalAlpha = Math.min(1, f * 3);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size > 0.6 ? 2 : 1, p.size > 0.6 ? 2 : 1);
      break;
    case "drop":
      // 색종이 (돌며 납작해짐)
      ctx.globalAlpha = Math.min(1, f * 3);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, Math.abs(Math.sin(p.life * 0.3 + p.rot)) > 0.5 ? 2 : 1);
      break;
    case "ring":
      // 눈꽃 고리: 원 + 여섯 방향 가시
      ctx.globalAlpha = f;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5 * f + 0.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - f) + 3, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const r = p.size * (1 - f) + 3;
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x + Math.cos(a) * (r + 2)), Math.round(p.y + Math.sin(a) * (r + 2)), 1, 1);
      }
      break;
    case "pillar": {
      // 금빛 별 기둥 + 위로 오르는 눈꽃 빛
      const w = p.size * f;
      const g = ctx.createLinearGradient(0, p.y - 72, 0, p.y + 6);
      g.addColorStop(0, "rgba(255, 216, 96, 0)");
      g.addColorStop(1, "rgba(255, 216, 96, 0.7)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(p.x - w / 2, p.y - 72, w, 78);
      ctx.fillStyle = `rgba(244, 248, 255, ${0.9 * f})`;
      for (let i = 0; i < 4; i++) ctx.fillRect(p.x - w / 2 + ((i * 5) % Math.max(1, w)), p.y - ((p.life * 2 + i * 17) % 72), 1, 1);
      break;
    }
    case "text":
      ctx.globalAlpha = Math.min(1, f * 3);
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 3;
      ctx.strokeStyle = NIGHT;
      ctx.strokeText(p.text ?? "", p.x, p.y);
      ctx.fillStyle = RED;
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

/** 위: 내 탄 지팡이 사탕 꼬리 · 조각 · 대기 때 머리 위에 흔들리는 금종 */
export function drawXmasOver(ctx: Ctx, fx: TigerFx, s: RunState, alpha: number, snap: Snap, tick: number): void {
  ctx.save();
  for (const pr of s.projectiles) {
    if (!pr.fromPlayer || !fx.on.hit) continue;
    const x = lerp(pr.prevX, pr.x, alpha);
    const y = lerp(pr.prevY, pr.y, alpha);
    const v = Math.hypot(pr.vx, pr.vy) || 1;
    ctx.globalAlpha = 0.75;
    for (let i = 1; i <= 4; i++) {
      ctx.fillStyle = i % 2 ? RED : SNOW;
      ctx.fillRect(snap(x - (pr.vx / v) * i * 2.5), snap(y - (pr.vy / v) * i * 2.5), 1, 1);
    }
  }
  for (const p of fx.parts) if (p.kind !== "foot") drawPart(ctx, p);
  const k = fx.on.rest ? idleLevel(fx) : 0;
  if (k > 0) {
    const px = snap(lerp(s.player.prevX, s.player.x, alpha));
    const py = snap(lerp(s.player.prevY, s.player.y, alpha));
    ctx.globalAlpha = k;
    ctx.save();
    ctx.translate(px, py - 30);
    ctx.rotate(Math.sin(tick * 0.1) * (k >= 1 ? 0.35 : 0.12));
    drawMap(ctx, BELL, BELL_COLORS, 0, 3, 1);
    ctx.restore();
  }
  ctx.restore();
}
