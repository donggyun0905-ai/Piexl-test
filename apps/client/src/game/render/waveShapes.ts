// 웨이브 그림 도구 2 (waveBits·waveBits2·waveFx가 씀): 물로 된 작은 나(물거울) · 연꽃잎 · 전기 줄 · 해파리 · 물고기 · 깃털 · 꼬인 물밧줄
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";
import { glint } from "./seaLight";
import { blob, waterFill, WV } from "./waveArt";

const TAU = Math.PI * 2;

/** 물로 된 작은 사람 (물거울): 포니테일 물줄기 · 후드 · 서핑보드 */
export function waterGirl(ctx: Ctx, x: number, y: number, a: number, tick: number, face: number): void {
  additive(ctx, () => glow(ctx, x, y - 8, 16, WV.aqua, 0.5 * a, 0.3));
  waterFill(ctx, x, y - 5, 7, a * 0.8, () => {
    ctx.beginPath();
    ctx.moveTo(x - 4, y);
    ctx.quadraticCurveTo(x - 5, y - 8, x, y - 10);
    ctx.quadraticCurveTo(x + 5, y - 8, x + 4, y);
    ctx.closePath();
  });
  blob(ctx, x, y - 13, 3.5, a, tick, 1, 0.04);
  ctx.strokeStyle = alpha(WV.foam, 0.8 * a);
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - face * 2, y - 16);
  ctx.quadraticCurveTo(x - face * 9, y - 15, x - face * 8 + Math.sin(tick * 0.2) * 2, y - 8);
  ctx.stroke();
  ctx.strokeStyle = alpha(WV.gold, 0.6 * a);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - face * 7, y - 18);
  ctx.lineTo(x - face * 5, y + 1);
  ctx.stroke();
  ctx.lineCap = "butt";
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
