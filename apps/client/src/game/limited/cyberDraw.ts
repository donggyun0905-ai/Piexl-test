// 네온 펄스 그리기: 바닥(네온 발자국·대기 장면) · 위(탄 네온 꼬리·전기 불꽃·글리치 막대·육각 파동·데이터 기둥·글자·DELETED 도장·코드 조각·드론) (피해 숫자는 cyberNumber)
import type { RunState } from "@pixel-rogue/shared";
import { additive } from "../render/pwFxBits";
import type { Snap } from "../render/palette";
import { drawLight } from "./fxLight";
import { drawMap } from "./tigerArt";
import { idleLevel } from "./tigerDraw";
import type { Part, TigerFx } from "./tigerFx";
import { BITS, DRONE, DRONE_COLORS, FOOT } from "./cyberArt";
import { CHROME, CYAN, NIGHT, PINK, VIOLET } from "./cyberFx";
import { drawCyberRest, hexPath } from "./cyberRest";

type Ctx = CanvasRenderingContext2D;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 바닥: 네온 발자국 · 대기 장면 (적·플레이어보다 아래) */
export function drawCyberUnder(ctx: Ctx, fx: TigerFx, s: RunState, alpha: number, snap: Snap, tick: number): void {
  ctx.save();
  for (const p of fx.parts) {
    if (p.kind !== "foot") continue;
    ctx.globalAlpha = 0.8 * (p.life / p.max);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot + Math.PI / 2);
    drawMap(ctx, FOOT, { o: p.color, l: CHROME }, 0, 0, 1);
    ctx.restore();
  }
  const k = fx.on.idle ? idleLevel(fx) : 0;
  if (k > 0) {
    const px = snap(lerp(s.player.prevX, s.player.x, alpha));
    const py = snap(lerp(s.player.prevY, s.player.y, alpha));
    fx.sleepReady = fx.on.rest && drawCyberRest(ctx, s, px, py, k, tick);
  }
  ctx.restore();
}

/** 대기 장면에서 몸을 숨기지 않음 (서서 충전) */
export const cyberResting = (_fx: TigerFx): boolean => false;

/** 글리치 막대: 분홍·청록으로 갈라진 가로 줄 몇 개가 떨리며 사라짐 */
function drawGlitch(ctx: Ctx, p: Part): void {
  const f = p.life / p.max;
  const w = p.size;
  ctx.save();
  ctx.globalAlpha = f;
  additive(ctx, () => {
    for (let i = 0; i < 3; i++) {
      const y = p.y + (i - 1) * 3 + (p.flip ? 1 : 0);
      const jit = ((p.life * 7 + i * 13) % 5) - 2;
      const ww = w * (0.5 + ((i * 37 + p.life) % 5) / 10);
      ctx.fillStyle = PINK;
      ctx.fillRect(p.x - ww / 2 + jit - 1.5, y, ww, 1);
      ctx.fillStyle = CYAN;
      ctx.fillRect(p.x - ww / 2 + jit + 1.5, y, ww, 1);
    }
  });
  ctx.fillStyle = p.color;
  ctx.fillRect(p.x - w * 0.25, p.y, w * 0.5, 1);
  ctx.restore();
}

/** 보스 처치 도장: 경고 줄무늬 테두리 + DELETED */
function drawStamp(ctx: Ctx, p: Part): void {
  const t = 1 - p.life / p.max;
  const pop = t < 0.1 ? 2 - t * 10 : 1;
  const shake = t < 0.25 ? ((p.life % 3) - 1) : 0;
  ctx.save();
  ctx.globalAlpha = Math.min(1, (p.life / p.max) * 3);
  ctx.translate(p.x + shake, p.y);
  ctx.scale(pop, pop);
  ctx.fillStyle = NIGHT;
  ctx.fillRect(-22, -6, 44, 12);
  for (let i = -22; i < 22; i += 4) {
    ctx.fillStyle = (i / 4) % 2 ? PINK : "#ffd040";
    ctx.fillRect(i, -7, 2, 1);
    ctx.fillRect(i + 2, 6, 2, 1);
  }
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = CYAN;
  ctx.fillText(p.text ?? "", 1, 1);
  ctx.fillStyle = p.color;
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
    case "spark":
      // 전기 불꽃: 꺾인 짧은 선
      ctx.globalAlpha = f;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - Math.cos(p.rot) * 2 + Math.sin(p.rot) * 1.5, p.y - Math.sin(p.rot) * 2 - Math.cos(p.rot) * 1.5);
      ctx.lineTo(p.x - Math.cos(p.rot) * 4, p.y - Math.sin(p.rot) * 4);
      ctx.stroke();
      break;
    case "glint":
      // 떠오르는 코드 조각 0·1
      ctx.globalAlpha = Math.min(1, f * 2);
      drawMap(ctx, BITS[p.size ? 1 : 0]!, { o: p.color }, Math.round(p.x), Math.round(p.y), 1);
      break;
    case "wave":
      drawGlitch(ctx, p);
      break;
    case "ring":
      // 육각 파동
      ctx.globalAlpha = f;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5 * f + 0.5;
      hexPath(ctx, p.x, p.y, p.size * (1 - f) + 3);
      ctx.stroke();
      break;
    case "pillar": {
      // 데이터 기둥: 청록 빛 기둥 + 위로 흐르는 밝은 줄
      const w = p.size * f;
      const g = ctx.createLinearGradient(0, p.y - 72, 0, p.y + 6);
      g.addColorStop(0, "rgba(60, 240, 255, 0)");
      g.addColorStop(1, "rgba(60, 240, 255, 0.75)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(p.x - w / 2, p.y - 72, w, 78);
      ctx.fillStyle = `rgba(255, 60, 224, ${0.8 * f})`;
      for (let i = 0; i < 4; i++) ctx.fillRect(p.x - w / 2 + ((i * 5) % Math.max(1, w)), p.y - ((p.life * 3 + i * 17) % 72), 1, 4);
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
      ctx.fillStyle = PINK;
      ctx.fillText(p.text ?? "", p.x + 1, p.y);
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

/** 위: 내 탄 네온 꼬리 · 조각 · 대기 때 따라다니는 드론 */
export function drawCyberOver(ctx: Ctx, fx: TigerFx, s: RunState, alpha: number, snap: Snap, tick: number): void {
  ctx.save();
  for (const pr of s.projectiles) {
    if (!pr.fromPlayer || !fx.on.hit) continue;
    const x = lerp(pr.prevX, pr.x, alpha);
    const y = lerp(pr.prevY, pr.y, alpha);
    const v = Math.hypot(pr.vx, pr.vy) || 1;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 1;
    for (const [c, o] of [[PINK, -1], [CYAN, 1]] as const) {
      ctx.strokeStyle = c;
      ctx.beginPath();
      ctx.moveTo(snap(x + o * 0.5), snap(y));
      ctx.lineTo(snap(x - (pr.vx / v) * 10 + o * 0.5), snap(y - (pr.vy / v) * 10));
      ctx.stroke();
    }
  }
  for (const p of fx.parts) if (p.kind !== "foot") drawPart(ctx, p);
  const k = fx.on.rest ? idleLevel(fx) : 0;
  if (k > 0) {
    const px = lerp(s.player.prevX, s.player.x, alpha);
    const py = lerp(s.player.prevY, s.player.y, alpha);
    const a = tick * 0.03;
    const dx = snap(px + Math.cos(a) * 16);
    const dy = snap(py - 26 + Math.sin(a * 2) * 3);
    ctx.globalAlpha = k;
    drawMap(ctx, DRONE[Math.floor(tick / 3) % 2]!, DRONE_COLORS, dx, dy, 1, Math.sin(a) > 0);
    // 드론이 내리쬐는 스캔 빛
    ctx.globalAlpha = k * 0.25;
    ctx.fillStyle = VIOLET;
    ctx.beginPath();
    ctx.moveTo(dx - 2, dy + 3);
    ctx.lineTo(dx + 2, dy + 3);
    ctx.lineTo(snap(px) + 8, snap(py) + 4);
    ctx.lineTo(snap(px) - 8, snap(py) + 4);
    ctx.fill();
  }
  ctx.restore();
}
