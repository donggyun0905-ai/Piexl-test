// 웨이브 그림 도구 2 (waveBits·waveBits2·waveFx가 씀): 물로 된 작은 나(물거울) · 연꽃잎 · 전기 줄 · 해파리 · 물고기 · 깃털 · 꼬인 물밧줄
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";
import { glint } from "./seaLight";
import type { RunState } from "@pixel-rogue/shared";
import { screenScale } from "../mipmap";
import { drawCharacter, isCasting, sheetFor } from "../sprites";
import { waterFill, WV } from "./waveArt";

const TAU = Math.PI * 2;

/** 물거울: 내 캐릭터 그림을 그대로 복사해 물빛으로 물들이고 반투명하게 (위로 흐르는 빛 띠 · 가장자리 물결) */
let off: HTMLCanvasElement | null = null;
export function mirrorCopy(ctx: Ctx, s: RunState, x: number, y: number, a: number): boolean {
  const p = s.player;
  const k = Math.min(6, screenScale(ctx));
  const W = 48;
  const px = Math.ceil(W * k);
  off ??= document.createElement("canvas");
  if (off.width !== px) off.width = off.height = px;
  const o = off.getContext("2d");
  if (!o) return false;
  o.setTransform(1, 0, 0, 1, 0, 0);
  o.clearRect(0, 0, px, px);
  o.setTransform(k, 0, 0, k, 0, 0);
  const pose = { faceX: p.faceX, faceY: p.faceY, moving: p.x !== p.prevX || p.y !== p.prevY, casting: isCasting(s.tick, p.attackCount), step: Math.floor(s.tick / 8) };
  if (!drawCharacter(o, sheetFor("wave"), W / 2, W / 2 + 8, p.r, pose)) return false;
  // 그림 위에만 물빛을 덮음: 위는 맑은 하늘색 · 아래는 짙은 바다 · 비스듬히 지나가는 흰 빛 띠
  o.setTransform(1, 0, 0, 1, 0, 0);
  o.globalCompositeOperation = "source-atop";
  const g = o.createLinearGradient(0, 0, 0, px);
  g.addColorStop(0, "rgba(90,220,255,0.3)");
  g.addColorStop(1, "rgba(20,110,240,0.45)");
  o.fillStyle = g;
  o.fillRect(0, 0, px, px);
  const band = ((s.tick * 2) % 160) / 100 - 0.3;
  const bg = o.createLinearGradient(0, px * band, px, px * (band + 0.35));
  bg.addColorStop(0, "rgba(255,255,255,0)");
  bg.addColorStop(0.5, "rgba(255,255,255,0.4)");
  bg.addColorStop(1, "rgba(255,255,255,0)");
  o.fillStyle = bg;
  o.fillRect(0, 0, px, px);
  o.globalCompositeOperation = "source-over";
  additive(ctx, () => glow(ctx, x, y - 8, 20, WV.aqua, 0.45 * a, 0.2));
  ctx.save();
  ctx.globalAlpha = (0.72 + Math.sin(s.tick * 0.12) * 0.08) * a;
  // 화면 픽셀에 맞춰 1:1로 (흐리지 않게)
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(off, Math.round((x - W / 2) * k) / k, Math.round((y - W / 2 - 8) * k) / k, W, W);
  ctx.restore();
  return true;
}

/** 연꽃잎 하나 (ang 바깥쪽 · len) */
export function petal(ctx: Ctx, x: number, y: number, a0: number, len: number, a: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a0);
  const g = ctx.createLinearGradient(0, 0, len, 0);
  g.addColorStop(0, alpha(WV.pink, 0.8 * a));
  g.addColorStop(0.6, alpha(WV.pale, 0.8 * a));
  g.addColorStop(1, alpha(WV.foam, a));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len * 0.5, -len * 0.38, len, 0);
  ctx.quadraticCurveTo(len * 0.5, len * 0.38, 0, 0);
  ctx.fill();
  ctx.strokeStyle = alpha(WV.foam, 0.7 * a);
  ctx.lineWidth = 0.7;
  ctx.stroke();
  ctx.restore();
}

/** 지지직 전기 줄 */
export function zapLine(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, seed: number, a: number): void {
  additive(ctx, () => {
    for (const [c, w] of [[alpha(WV.gold, 0.35 * a), 3], [alpha(WV.foam, a), 1]] as const) {
      ctx.strokeStyle = c;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      for (let k = 1; k < 6; k++) {
        const u = k / 6;
        ctx.lineTo(x0 + (x1 - x0) * u + (rnd(seed, k) - 0.5) * 6, y0 + (y1 - y0) * u + (rnd(k, seed) - 0.5) * 6);
      }
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
  });
}

/** 해파리 하나 (갓 + 흐느적 촉수) */
export function jelly(ctx: Ctx, x: number, y: number, a: number, tick: number, seed: number): void {
  const pulse = 1 + Math.sin(tick * 0.15 + seed) * 0.12;
  additive(ctx, () => glow(ctx, x, y, 14, WV.pink, 0.6 * a, 0.3));
  ctx.lineCap = "round";
  for (let k = 0; k < 4; k++) {
    ctx.strokeStyle = alpha(k % 2 ? WV.pink : WV.pale, 0.7 * a);
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(x - 3 + k * 2, y + 1);
    for (let i = 1; i <= 4; i++) ctx.lineTo(x - 3 + k * 2 + Math.sin(tick * 0.2 + i + k) * 1.5, y + 1 + i * 2.5);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
  waterFill(ctx, x, y - 2, 6, a, () => {
    ctx.beginPath();
    ctx.ellipse(x, y, 5.5 * pulse, 4.5 / pulse, 0, Math.PI, TAU);
    ctx.closePath();
  }, 0.8);
  glint(ctx, x - 2, y - 3, 1.5, WV.foam, a);
}

/** 작은 물고기 (ang 머리 쪽) */
export function fish(ctx: Ctx, x: number, y: number, ang: number, a: number, c: string): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.fillStyle = alpha(c, a);
  ctx.beginPath();
  ctx.ellipse(0, 0, 3.2, 1.5, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-2.5, 0);
  ctx.lineTo(-5, -2);
  ctx.lineTo(-5, 2);
  ctx.fill();
  ctx.fillStyle = alpha(WV.foam, a);
  ctx.fillRect(1.5, -0.8, 1, 1);
  ctx.restore();
}

/** 물 깃털 */
export function feather(ctx: Ctx, x: number, y: number, ang: number, a: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  additive(ctx, () => glow(ctx, 0, 0, 7, WV.aqua, 0.5 * a));
  waterFill(ctx, 0, 0, 4, a, () => {
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.quadraticCurveTo(0, -3, -5, 0);
    ctx.quadraticCurveTo(0, 3, 5, 0);
  }, 0.6);
  ctx.strokeStyle = alpha(WV.foam, a);
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(-6, 0);
  ctx.lineTo(5, 0);
  ctx.stroke();
  ctx.restore();
}

/** 꼬인 물밧줄 (두 가닥이 감김) */
export function rope(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, a: number, tick: number, tight: number): void {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  additive(ctx, () => {
    for (const ph of [0, Math.PI]) {
      ctx.strokeStyle = alpha(ph ? WV.aqua : WV.foam, a);
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const u = i / 12;
        const sag = Math.sin(u * Math.PI) * 6 * (1 - tight);
        const tw = Math.sin(u * 10 + tick * 0.3 + ph) * 1.6;
        ctx.lineTo(x0 + dx * u + nx * (tw + sag), y0 + dy * u + ny * (tw + sag));
      }
      ctx.stroke();
    }
  });
}
