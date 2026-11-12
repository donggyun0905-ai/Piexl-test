// 훅 그림 공용: 빛 갈고리(큰 C자 날 + 톱니 자루 + 구멍) · 밧줄 · 더블배럴 산탄총 · 발사 그림(sprites/hook_fx: 줄 0 큰 발사 · 줄 1 둘째 총열)
// 갈고리는 사용자가 준 참고 그림의 모양만 따서 코드로 새로 그림 (시원한 물빛 · 흰 속)
import { additive, alpha, crescent, glow, type Ctx } from "./pwFxBits";
import { lazyImg } from "../lazyImage";

export const HK_AQUA = "#5ae8ff";
export const HK_DEEP = "#1a78d8";
export const HK_FOAM = "#f0fcff";
const CELL = 128;
const fx = lazyImg(`${import.meta.env.BASE_URL}sprites/hook_fx.png`);

/** 빛 갈고리 (머리 x,y · a 나가는 방향 · s 크기 배율 · al 투명도): 앞쪽 큰 C자 날이 뒤로 휘고, 자루에 톱니 */
export function hookShape(ctx: Ctx, x: number, y: number, a: number, s: number, al: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  additive(ctx, () => {
    glow(ctx, 2 * s, 0, 16 * s, HK_AQUA, 0.45 * al);
    // C자 날: 앞을 감싸고 끝이 뒤(던진 사람 쪽)를 향함
    crescent(ctx, 2 * s, 0, 10 * s, 0, 2.3, 5 * s, HK_DEEP, 0.7 * al);
    crescent(ctx, 2 * s, 0, 10 * s, 0, 2.3, 3 * s, HK_AQUA, 0.95 * al);
    crescent(ctx, 2 * s, 0, 10.5 * s, -0.4, 1.4, 1.2 * s, HK_FOAM, al);
    // 자루 + 아래 톱니
    ctx.strokeStyle = alpha(HK_AQUA, 0.9 * al);
    ctx.lineWidth = 2.6 * s;
    ctx.beginPath();
    ctx.moveTo(-14 * s, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.strokeStyle = alpha(HK_FOAM, al);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-14 * s, -0.5);
    ctx.lineTo(0, -0.5);
    ctx.stroke();
    ctx.fillStyle = alpha(HK_AQUA, 0.85 * al);
    for (let i = 0; i < 4; i++) ctx.fillRect((-12 + i * 3) * s, 1.2 * s, 1.6 * s, 1.6 * s);
    // 자루 끝 지느러미 · 날 이음새 구멍
    ctx.beginPath();
    ctx.moveTo(-14 * s, 0);
    ctx.lineTo(-18 * s, -4 * s);
    ctx.lineTo(-16 * s, 0);
    ctx.lineTo(-18 * s, 4 * s);
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillStyle = alpha("#04203a", 0.8 * al);
  ctx.beginPath();
  ctx.arc(-1 * s, -1.5 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** 밧줄: 손(x0,y0) → 갈고리(x1,y1), 살짝 처지는 빛 밧줄 + 흐르는 점 */
export function rope(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, tick: number, al = 1): void {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2 + Math.min(10, Math.hypot(x1 - x0, y1 - y0) * 0.06);
  additive(ctx, () => {
    for (const [c, w, a] of [[HK_DEEP, 3, 0.45], [HK_AQUA, 1.6, 0.85], [HK_FOAM, 0.7, 0.9]] as const) {
      ctx.strokeStyle = alpha(c, a * al);
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(mx, my, x1, y1);
      ctx.stroke();
    }
    ctx.fillStyle = alpha(HK_FOAM, al);
    for (let i = 0; i < 4; i++) {
      const u = ((tick * 0.05 + i / 4) % 1);
      const v = 1 - u;
      ctx.fillRect(Math.round(v * v * x0 + 2 * v * u * mx + u * u * x1), Math.round(v * v * y0 + 2 * v * u * my + u * u * y1), 2, 2);
    }
  });
}

/** 더블배럴 산탄총 (손 x,y · a 방향 · k 0~1 반동): 짧은 두 총열 · 금 테 · 나무 손잡이 */
export function shotgun(ctx: Ctx, x: number, y: number, a: number, k: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  if (Math.cos(a) < 0) ctx.scale(1, -1);
  ctx.translate(-k * 3, 0);
  ctx.rotate(-k * 0.35);
  ctx.fillStyle = "#6a4020";
  ctx.fillRect(-6, -1, 6, 4);
  ctx.fillStyle = "#2a3040";
  ctx.fillRect(0, -2.5, 13, 2);
  ctx.fillRect(0, 0, 13, 2);
  ctx.fillStyle = "#9aa8c0";
  ctx.fillRect(0, -2.5, 13, 0.8);
  ctx.fillStyle = "#e8c050";
  ctx.fillRect(0, -3, 2, 6);
  ctx.fillRect(11, -2.8, 1, 5);
  ctx.restore();
}

/** 발사 그림 한 칸 (row 0 큰 발사 · 1 둘째 총열 · frame 0~3) · 총구 x,y에서 a 방향으로 · 폭 w */
export function blastSprite(ctx: Ctx, row: number, frame: number, x: number, y: number, a: number, w: number, al: number): void {
  if (!fx.complete || fx.naturalWidth === 0 || al <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha *= Math.min(1, al);
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(fx, frame * CELL, row * CELL, CELL, CELL, 0, -w / 2, w, w);
  ctx.restore();
}
