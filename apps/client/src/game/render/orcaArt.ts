// 오르카 그림 공용: 물기운 상어(기공파) · 거대한 범고래 물기운(범고래 돌파) · 푸른 불꽃 주먹 · 소용돌이 팔
// 모두 코드로 그림 (하늘색 물빛 · 흰 거품 · 짙은 바다색 테두리)
import { additive, alpha, glow, type Ctx } from "./pwFxBits";

export const OC_AQUA = "#5ae8ff";
export const OC_DEEP = "#1a6ae0";
export const OC_FOAM = "#f0fcff";
export const OC_INK = "#0a2a52";

/** 몸 윤곽 한 점 (u: 0 머리 → 1 꼬리, 위/아래 폭) */
function bodyPath(ctx: Ctx, len: number, half: number, flap: number): void {
  ctx.beginPath();
  ctx.moveTo(len * 0.55, 0);
  ctx.quadraticCurveTo(len * 0.35, -half * 1.05, -len * 0.1, -half * 0.8);
  ctx.quadraticCurveTo(-len * 0.35, -half * 0.45, -len * 0.45, flap * 0.3);
  ctx.quadraticCurveTo(-len * 0.35, half * 0.5, -len * 0.1, half * 0.75);
  ctx.quadraticCurveTo(len * 0.35, half * 0.95, len * 0.55, 0);
  ctx.closePath();
}

/** 상어 기공파 (머리 x,y · a 방향 · s 크기 · al 진하기 · tick 꼬리 흔들기 · bite 0~1 입 벌림) */
export function sharkShape(ctx: Ctx, x: number, y: number, a: number, s: number, al: number, tick: number, bite = 0): void {
  const len = 30 * s;
  const half = 7 * s;
  const flap = Math.sin(tick * 0.6) * half;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  additive(ctx, () => {
    glow(ctx, 0, 0, len * 0.75, OC_AQUA, 0.5 * al, 0.4);
    // 꼬리지느러미 (흔들림)
    ctx.fillStyle = alpha(OC_AQUA, 0.85 * al);
    ctx.beginPath();
    ctx.moveTo(-len * 0.42, flap * 0.3);
    ctx.lineTo(-len * 0.72, -half * 1.2 + flap);
    ctx.lineTo(-len * 0.6, flap * 0.4);
    ctx.lineTo(-len * 0.74, half * 1.1 + flap);
    ctx.closePath();
    ctx.fill();
    // 몸: 짙은 바다색 → 물빛 · 흰 배
    bodyPath(ctx, len, half, flap);
    const g = ctx.createLinearGradient(0, -half, 0, half);
    g.addColorStop(0, alpha(OC_DEEP, 0.9 * al));
    g.addColorStop(0.55, alpha(OC_AQUA, 0.9 * al));
    g.addColorStop(1, alpha(OC_FOAM, 0.95 * al));
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = alpha(OC_FOAM, al);
    ctx.lineWidth = 1;
    ctx.stroke();
    // 등지느러미 · 가슴지느러미
    ctx.fillStyle = alpha(OC_AQUA, al);
    ctx.beginPath();
    ctx.moveTo(len * 0.12, -half * 0.85);
    ctx.lineTo(-len * 0.08, -half * 2);
    ctx.lineTo(-len * 0.12, -half * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(len * 0.12, half * 0.7);
    ctx.lineTo(-len * 0.04, half * 1.6);
    ctx.lineTo(-len * 0.02, half * 0.65);
    ctx.closePath();
    ctx.fill();
    // 아가미 줄 · 입 (벌리면 이빨)
    ctx.strokeStyle = alpha(OC_FOAM, 0.8 * al);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(len * (0.2 - i * 0.06), -half * 0.4);
      ctx.lineTo(len * (0.18 - i * 0.06), half * 0.3);
      ctx.stroke();
    }
    const open = half * 0.25 + bite * half * 0.6;
    ctx.fillStyle = alpha(OC_FOAM, al);
    for (let i = 0; i < 4; i++) {
      const tx = len * (0.5 - i * 0.07);
      ctx.fillRect(tx, open * 0.6 - 0.5, 1.2 * s, 1.6 * s);
      ctx.fillRect(tx, -open * 0.2 - 1, 1.2 * s, 1.4 * s);
    }
  });
  ctx.fillStyle = alpha(OC_INK, al);
  ctx.fillRect(len * 0.36, -half * 0.45, 1.6 * s, 1.6 * s);
  ctx.restore();
}

/** 거대한 범고래 물기운 (가운데 x,y · a 방향 · s 크기 · al): 짙은 몸 + 흰 눈무늬·배 + 물빛 테두리 · 큰 등지느러미 */
export function orcaShape(ctx: Ctx, x: number, y: number, a: number, s: number, al: number, tick: number): void {
  const len = 52 * s;
  const half = 13 * s;
  const flap = Math.sin(tick * 0.45) * half * 0.8;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  additive(ctx, () => glow(ctx, 0, 0, len * 0.8, OC_AQUA, 0.55 * al, 0.5));
  ctx.fillStyle = alpha(OC_INK, 0.8 * al);
  ctx.beginPath();
  ctx.moveTo(-len * 0.42, flap * 0.3);
  ctx.lineTo(-len * 0.7, -half + flap);
  ctx.lineTo(-len * 0.58, flap * 0.3);
  ctx.lineTo(-len * 0.7, half + flap);
  ctx.closePath();
  ctx.fill();
  bodyPath(ctx, len, half, flap);
  ctx.fill();
  ctx.strokeStyle = alpha(OC_AQUA, al);
  ctx.lineWidth = 2;
  ctx.stroke();
  // 흰 배 · 눈 뒤 흰 무늬
  ctx.fillStyle = alpha(OC_FOAM, 0.9 * al);
  ctx.beginPath();
  ctx.ellipse(len * 0.12, half * 0.45, len * 0.32, half * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(len * 0.26, -half * 0.38, len * 0.08, half * 0.16, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // 큰 등지느러미
  ctx.fillStyle = alpha(OC_INK, 0.85 * al);
  ctx.beginPath();
  ctx.moveTo(len * 0.08, -half * 0.8);
  ctx.quadraticCurveTo(-len * 0.02, -half * 2.4, -len * 0.14, -half * 2.6);
  ctx.lineTo(-len * 0.12, -half * 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = alpha(OC_AQUA, al);
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

/** 푸른 불꽃 주먹 빛 (x,y · r 크기 · al) */
export function fistGlow(ctx: Ctx, x: number, y: number, r: number, al: number, tick: number): void {
  if (al <= 0.02) return;
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.6, OC_DEEP, 0.5 * al);
    glow(ctx, x, y, r, OC_AQUA, 0.8 * al, 1.2);
    ctx.fillStyle = alpha(OC_FOAM, al);
    for (let i = 0; i < 3; i++) {
      const u = (tick * 0.12 + i / 3) % 1;
      ctx.fillRect(Math.round(x + Math.sin(i * 2.1 + tick * 0.2) * r * 0.5), Math.round(y - u * r * 1.6), 1, 2);
    }
  });
}

/** 소용돌이 팔 (가운데 x,y · r · 돌기 spin · n 팔 수 · al) */
export function spiral(ctx: Ctx, x: number, y: number, r: number, spin: number, n: number, al: number): void {
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let k = 0; k < n; k++) {
      for (const [c, w, a] of [[OC_DEEP, 4, 0.4], [OC_AQUA, 2, 0.8], [OC_FOAM, 0.8, 0.9]] as const) {
        ctx.strokeStyle = alpha(c, a * al);
        ctx.lineWidth = w;
        ctx.beginPath();
        for (let u = 0; u <= 1.001; u += 0.1) {
          const ang = spin + (k / n) * Math.PI * 2 + u * 2.6;
          const rr = r * (1 - u * 0.85);
          if (u === 0) ctx.moveTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr * 0.6);
          else ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr * 0.6);
        }
        ctx.stroke();
      }
    }
    ctx.lineCap = "butt";
  });
}
