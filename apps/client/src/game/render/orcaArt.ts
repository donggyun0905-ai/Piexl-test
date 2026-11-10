// 오르카 그림 공용: 거대한 범고래 물기운(범고래 돌파) · 푸른 불꽃 주먹 · 소용돌이 팔 · 웅장한 물기둥 · 몸 둘레 번개 (상어는 테일과 같은 tailShark 그림)
// 모두 코드로 그림 (하늘색 물빛 · 흰 거품 · 짙은 바다색 테두리 · 해방 번개는 흰 노랑)
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";
import { OC_INK, OC_VOLT, PAL } from "./orcaPal";

/** 진한 파랑 번개 줄기 (x0,y0 → x1,y1 · seed 모양 · a 진하기 · w 굵기) */
export function blueBolt(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, seed: number, a: number, w = 2): void {
  const n = 7;
  const nx = -(y1 - y0);
  const ny = x1 - x0;
  const len = Math.hypot(nx, ny) || 1;
  const pts: [number, number][] = [[x0, y0]];
  for (let k = 1; k < n; k++) {
    const u = k / n;
    const off = (rnd(seed, k) - 0.5) * 0.35 * len * 0.4;
    pts.push([x0 + (x1 - x0) * u + (nx / len) * off, y0 + (y1 - y0) * u + (ny / len) * off]);
  }
  pts.push([x1, y1]);
  ctx.lineJoin = "round";
  additive(ctx, () => {
    for (const [c, ww] of [[alpha("#0a2aff", a * 0.45), w * 3.2], [alpha(OC_VOLT, a), w * 1.2], [alpha("#dfe8ff", a), Math.max(1, w * 0.45)]] as const) {
      ctx.strokeStyle = c;
      ctx.lineWidth = ww;
      ctx.beginPath();
      for (const [px, py] of pts) ctx.lineTo(px, py);
      ctx.stroke();
    }
  });
}

/** 몸 윤곽 (len 길이 · half 폭 · flap 꼬리 흔들림) */
function bodyPath(ctx: Ctx, len: number, half: number, flap: number): void {
  ctx.beginPath();
  ctx.moveTo(len * 0.55, 0);
  ctx.quadraticCurveTo(len * 0.35, -half * 1.05, -len * 0.1, -half * 0.8);
  ctx.quadraticCurveTo(-len * 0.35, -half * 0.45, -len * 0.45, flap * 0.3);
  ctx.quadraticCurveTo(-len * 0.35, half * 0.5, -len * 0.1, half * 0.75);
  ctx.quadraticCurveTo(len * 0.35, half * 0.95, len * 0.55, 0);
  ctx.closePath();
}

/** 거대한 범고래 물기운 (가운데 x,y · a 방향 · s 크기 · al): 짙은 몸 + 흰 눈무늬·배 + 물빛 테두리 · 큰 등지느러미 */
export function orcaShape(ctx: Ctx, x: number, y: number, a: number, s: number, al: number, tick: number): void {
  const len = 52 * s;
  const half = 13 * s;
  const flap = Math.sin(tick * 0.45) * half * 0.8;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  additive(ctx, () => glow(ctx, 0, 0, len * 0.8, PAL.aqua, 0.55 * al, 0.5));
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
  ctx.strokeStyle = alpha(PAL.aqua, al);
  ctx.lineWidth = 2;
  ctx.stroke();
  // 흰 배 · 눈 뒤 흰 무늬
  ctx.fillStyle = alpha(PAL.foam, 0.9 * al);
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
  ctx.strokeStyle = alpha(PAL.aqua, al);
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

/** 푸른 불꽃 주먹 빛 (x,y · r 크기 · al) */
export function fistGlow(ctx: Ctx, x: number, y: number, r: number, al: number, tick: number): void {
  if (al <= 0.02) return;
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.6, PAL.deep, 0.5 * al);
    glow(ctx, x, y, r, PAL.aqua, 0.8 * al, 1.2);
    ctx.fillStyle = alpha(PAL.foam, al);
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
      for (const [c, w, a] of [[PAL.deep, 4, 0.4], [PAL.aqua, 2, 0.8], [PAL.foam, 0.8, 0.9]] as const) {
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

/** 웅장한 물기둥 (바닥 x,y · 바닥 폭 w · 높이 h · al · tick 물살 흐름): 짙은 바깥 → 물빛 → 흰 심 · 위로 치솟는 물살 줄 · 꼭대기 물보라 */
export function grandGeyser(ctx: Ctx, x: number, y: number, w: number, h: number, al: number, tick: number, seed: number): void {
  if (al <= 0.02 || h < 2) return;
  const col = (ww: number, top: number) => {
    ctx.beginPath();
    ctx.moveTo(x - ww, y);
    ctx.bezierCurveTo(x - ww * 0.55, y - h * 0.35, x - ww * 0.5, y - h * 0.8, x - ww * top, y - h);
    ctx.lineTo(x + ww * top, y - h);
    ctx.bezierCurveTo(x + ww * 0.5, y - h * 0.8, x + ww * 0.55, y - h * 0.35, x + ww, y);
    ctx.closePath();
  };
  additive(ctx, () => {
    glow(ctx, x, y - h * 0.5, Math.max(w, h * 0.6), PAL.deep, 0.45 * al);
    for (const [c, ww, top, a] of [[PAL.deep, w, 0.7, 0.75], [PAL.aqua, w * 0.7, 0.55, 0.8], [PAL.foam, w * 0.28, 0.3, 0.85]] as const) {
      const g = ctx.createLinearGradient(x, y, x, y - h);
      g.addColorStop(0, alpha(c, a * al));
      g.addColorStop(0.85, alpha(c, a * 0.8 * al));
      g.addColorStop(1, alpha(c, 0));
      ctx.fillStyle = g;
      col(ww, top);
      ctx.fill();
    }
    // 위로 치솟는 물살 줄
    ctx.lineCap = "round";
    for (let i = 0; i < 7; i++) {
      const ox = (rnd(seed, i) - 0.5) * w * 1.1;
      const u = (tick * 0.09 + rnd(i, seed)) % 1;
      const yy = y - h * u;
      ctx.strokeStyle = alpha(i % 2 ? PAL.foam : PAL.aqua, 0.9 * al * (1 - u * 0.6));
      ctx.lineWidth = i % 2 ? 1.2 : 2;
      ctx.beginPath();
      ctx.moveTo(x + ox * (1 - u * 0.5), yy + 12);
      ctx.lineTo(x + ox * (1 - u * 0.5), yy);
      ctx.stroke();
    }
    ctx.lineCap = "butt";
    // 꼭대기: 터지는 물보라 송이
    glow(ctx, x, y - h, w * 1.4, PAL.foam, 0.7 * al, 1);
    for (let i = 0; i < 9; i++) {
      const ang = -Math.PI + (i / 8) * Math.PI;
      const d = w * (0.6 + rnd(seed, i + 9) * 0.8);
      ctx.fillStyle = alpha(i % 2 ? PAL.foam : PAL.aqua, al);
      ctx.beginPath();
      ctx.arc(x + Math.cos(ang) * d, y - h + Math.sin(ang) * d * 0.7, 1.5 + rnd(i, 3) * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/** 몸 둘레 번개 (해방): 짧은 번개 갈래가 깜빡이며 튐 */
export function crackle(ctx: Ctx, x: number, y: number, r: number, tick: number, al: number): void {
  const t = tick >> 2;
  for (let i = 0; i < 3; i++) {
    if (rnd(t, i) < 0.35) continue;
    const a = rnd(i, t) * Math.PI * 2;
    const r0 = r * 0.5;
    blueBolt(ctx, x + Math.cos(a) * r0, y + Math.sin(a) * r0, x + Math.cos(a + 0.6) * r, y + Math.sin(a + 0.6) * r, t * 7 + i, al, 1.2);
  }
}
