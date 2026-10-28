// 운명의 여행자 효과: 운명 뒤집힘 · 시위 놓음 · 치명 · 빛줄기 · 번개 · 화살비 · 운석 · 바위 · 목마 · 바람 · 보호막 · 세이렌 · 파도 · 소용돌이 · 물기 · 벼락 · 돼지 · 섬 · 태양
import type { EffectState } from "@pixel-rogue/shared";
import { glowEdge } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const GOLD_L = "#ffe08a";

function ring(ctx: Ctx, x: number, y: number, r: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, TAU);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.stroke();
}
function disc(ctx: Ctx, x: number, y: number, r: number, c: string): void {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, TAU);
  ctx.fill();
}
function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.stroke();
}
/** 번개 지그재그 */
function zig(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, seed: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  for (let i = 1; i < 6; i++) {
    const k = i / 6;
    const off = (((seed * 7 + i * 13) % 9) - 4) * 1.2;
    ctx.lineTo(x0 + (x1 - x0) * k + off, y0 + (y1 - y0) * k - off);
  }
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

export function drawVoyagerFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("vy")) return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  ctx.globalAlpha = 1 - t;
  switch (fx.kind) {
    case "vyFlip":
      // 금빛 고리가 두 번 퍼짐 (이름은 voyager 위 그리기)
      if (t < 0.4) {
        ring(ctx, x, y, r * t * 5, GOLD_L, 2);
        ring(ctx, x, y, r * t * 3, "#ffffff", 1);
      }
      break;
    case "vyLoose":
      for (let i = -1; i <= 1; i++) line(ctx, x, y, x - fx.dirX * r + fx.dirY * i * 4, y - fx.dirY * r - fx.dirX * i * 4, "#ffffff", 1);
      break;
    case "vyCrit":
      for (let i = 0; i < 4; i++) {
        const a = (i * TAU) / 4 + t;
        line(ctx, x, y, x + Math.cos(a) * r * (0.5 + t), y + Math.sin(a) * r * (0.5 + t), GOLD_L, 2);
      }
      break;
    case "vyBeam": {
      const tx = snap(fx.toX ?? x);
      const ty = snap(fx.toY ?? y);
      line(ctx, x, y, tx, ty, "#ffd060", r * (1 - t) + 1);
      line(ctx, x, y, tx, ty, "#ffffff", Math.max(1, r * 0.4 * (1 - t)));
      break;
    }
    case "vyChain":
    case "vyBolt": {
      const tx = fx.kind === "vyChain" ? snap(fx.toX ?? x) : x;
      const ty = fx.kind === "vyChain" ? snap(fx.toY ?? y) : y;
      if (fx.kind === "vyBolt") zig(ctx, x - 6, y - 90, x, y, "#c8e8ff", fx.maxTicks + Math.round(x));
      else zig(ctx, x, y, tx, ty, "#8ac8ff", Math.round(x + y));
      disc(ctx, tx, ty, 3 * (1 - t) + 1, "#ffffff");
      break;
    }
    case "vyRain":
      line(ctx, x - 3, y - 20 * (1 - t), x, y, GOLD_L, 1.5);
      ring(ctx, x, y, r * t, "#ffffff", 1);
      break;
    case "vyMeteor":
    case "vyBoulder":
    case "vyHorse":
    case "vySun": {
      const c = fx.kind === "vyMeteor" ? "#ff7a3a" : fx.kind === "vyBoulder" ? "#8a8a9a" : fx.kind === "vyHorse" ? "#c8964a" : "#ffb030";
      disc(ctx, x, y, r * (0.3 + t * 0.7), c);
      ctx.globalAlpha = (1 - t) * 0.7;
      disc(ctx, x, y, r * (0.15 + t * 0.4), fx.kind === "vyBoulder" ? "#c8c8d0" : "#ffe08a");
      break;
    }
    case "vyWind":
      for (let i = 0; i < 8; i++) {
        const a = (i * TAU) / 8 + t;
        const rr = r * t;
        line(ctx, x + Math.cos(a) * rr * 0.6, y + Math.sin(a) * rr * 0.6, x + Math.cos(a + 0.4) * rr, y + Math.sin(a + 0.4) * rr, "#e8f4ff", 1);
      }
      break;
    case "vyShield":
      ring(ctx, x, y - 4, r, "#8ac8ff", 2);
      break;
    case "vySiren":
      ring(ctx, x, y, r * t, "#ff9ad8", 1.5);
      ring(ctx, x, y, r * t * 0.6, "#ffd0f0", 1);
      ctx.fillStyle = "#ff9ad8";
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("♪", x - 10, y - 20 - t * 10);
      ctx.fillText("♫", x + 10, y - 24 - t * 10);
      break;
    case "vyTide":
      for (let i = 0; i < 3; i++) ring(ctx, x, y, r * ((t + i * 0.15) % 1), "#4a9ae8", 3 - i);
      break;
    case "vyWhirl":
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = "#6ab8ff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, r * (0.3 + i * 0.3), t * 6 + i, t * 6 + i + 2);
        ctx.stroke();
      }
      break;
    case "vyBite":
      line(ctx, x - r, y - 3, x + r, y - 3, "#ffffff", 1.5);
      line(ctx, x - r, y + 3, x + r, y + 3, "#ffffff", 1.5);
      break;
    case "vyPig":
      disc(ctx, x, y - r - 4, 4, "#ffb0c8");
      ctx.fillStyle = "#c86a8a";
      ctx.fillRect(x - 2, y - r - 4, 1, 1);
      ctx.fillRect(x + 1, y - r - 4, 1, 1);
      break;
    case "vyIsland":
      ctx.globalAlpha = 0.5 * (1 - t);
      disc(ctx, x, y + 4, r, "#e8d8a0");
      ring(ctx, x, y + 4, r + 2, "#6ab8ff", 2);
      break;
    default:
      break;
  }
  ctx.globalAlpha = 1;
  return true;
}
