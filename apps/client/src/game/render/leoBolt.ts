// 레오 번개 그리기 도우미 (render/leo·leoAura가 씀): 노란 뇌전만 씀
// 갈라지는 번개 줄기(가운데 흰 심 · 노란 몸 · 넓은 금빛 번짐 · 잔가지) · 하늘에서 내리꽂는 낙뢰 · 둘레를 기어가는 방전 고리
// (참고 그림 art/참고/이펙트 01의 번개 줄기+방전·빛기둥+바닥 문양 느낌을 노란 뇌전으로 새로 그림)
import { additive, alpha, glow, rnd, rune, shock, sparks, type Ctx } from "./pwFxBits";

const TAU = Math.PI * 2;
export const VOLT = "#ffd83a";
export const VOLT_DEEP = "#ffb000";
export const VOLT_PALE = "#fff6b0";

/** 두 점 사이 꺾인 번개 길 (가운데를 밀어내며 반으로 계속 나눔, seed가 같으면 같은 모양) */
export function jagPath(x0: number, y0: number, x1: number, y1: number, seed: number, rough = 0.35, depth = 4): [number, number][] {
  let pts: [number, number][] = [[x0, y0], [x1, y1]];
  let amp = Math.hypot(x1 - x0, y1 - y0) * rough;
  for (let d = 0; d < depth; d++) {
    const next: [number, number][] = [pts[0]!];
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i]!;
      const [bx, by] = pts[i + 1]!;
      const len = Math.hypot(bx - ax, by - ay) || 1;
      const off = (rnd(seed + d * 7.1, i * 3.3) - 0.5) * amp;
      next.push([(ax + bx) / 2 + (-(by - ay) / len) * off, (ay + by) / 2 + ((bx - ax) / len) * off], [bx, by]);
    }
    pts = next;
    amp *= 0.5;
  }
  return pts;
}

function stroke(ctx: Ctx, pts: [number, number][], color: string, w: number): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(pts[0]![0], pts[0]![1]);
  for (const [x, y] of pts.slice(1)) ctx.lineTo(x, y);
  ctx.stroke();
}

/** 번개 한 줄기: 넓은 금빛 번짐 → 노란 몸 → 흰 심 (+ 잔가지). a: 진하기 · w: 굵기 */
export function lightning(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, seed: number, w: number, a: number, twigs = 2): void {
  if (a <= 0.02) return;
  const pts = jagPath(x0, y0, x1, y1, seed);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  additive(ctx, () => {
    stroke(ctx, pts, alpha(VOLT_DEEP, a * 0.22), w * 4.5);
    stroke(ctx, pts, alpha(VOLT, a * 0.55), w * 2.2);
  });
  stroke(ctx, pts, alpha(VOLT, a), w);
  stroke(ctx, pts, `rgba(255,255,255,${a})`, Math.max(0.8, w * 0.4));
  // 잔가지: 줄기 중간에서 비스듬히 짧게 갈라짐
  for (let k = 0; k < twigs; k++) {
    const i = 2 + Math.floor(rnd(seed, k + 9) * (pts.length - 4));
    const [bx, by] = pts[i]!;
    const ang = Math.atan2(y1 - y0, x1 - x0) + (rnd(k, seed) > 0.5 ? 1 : -1) * (0.5 + rnd(seed, k) * 0.6);
    const len = Math.hypot(x1 - x0, y1 - y0) * (0.18 + rnd(k + 3, seed) * 0.2);
    const tw = jagPath(bx, by, bx + Math.cos(ang) * len, by + Math.sin(ang) * len, seed + k * 13, 0.4, 3);
    additive(ctx, () => stroke(ctx, tw, alpha(VOLT, a * 0.45), w * 1.4));
    stroke(ctx, tw, alpha(VOLT_PALE, a * 0.9), Math.max(0.7, w * 0.45));
  }
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
}

/** 둘레를 기어가는 방전 고리: 원 위의 짧은 번개 호 여러 개 (f: 0~1 지난 정도) */
export function arcRing(ctx: Ctx, x: number, y: number, r: number, n: number, f: number, seed: number, a = 1): void {
  for (let k = 0; k < n; k++) {
    const a0 = rnd(seed, k) * TAU + f * 1.5;
    const a1 = a0 + 0.35 + rnd(k, seed) * 0.4;
    const rr = r * (0.85 + rnd(seed + 1, k) * 0.25);
    lightning(ctx, x + Math.cos(a0) * rr, y + Math.sin(a0) * rr * 0.75, x + Math.cos(a1) * rr, y + Math.sin(a1) * rr * 0.75, seed * 3 + k, 1.2, a * (1 - f * 0.7), 0);
  }
}

/** 하늘에서 내리꽂는 낙뢰 (f: 0~1) · r: 땅에 닿는 둘레 · core: 심 색(보석 낙뢰는 푸른 흰빛) */
export function skyStrike(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, core = "#ffffff", big = 1): void {
  const top = y - 150 * big;
  const hit = Math.min(1, f / 0.18);
  const fade = f < 0.18 ? 1 : 1 - (f - 0.18) / 0.82;
  // 땅: 노란 문양 + 그을린 자국
  rune(ctx, x, y + 2, r * (0.9 + 0.3 * f), VOLT, 0.7 * fade, f * 2 + seed);
  ctx.fillStyle = `rgba(40,24,0,${0.3 * fade})`;
  ctx.beginPath();
  ctx.ellipse(x, y + 2, r * 0.6, r * 0.3, 0, 0, TAU);
  ctx.fill();
  // 내리꽂는 줄기 (깜빡이며 모양이 살짝 바뀜) · 두 갈래
  const flick = Math.floor(f * 9);
  const head = top + (y - top) * hit;
  const w = (3.2 - f * 1.8) * big;
  lightning(ctx, x + (rnd(seed, 1) - 0.5) * 18, top, x, head, seed + flick, w, fade, 3);
  if (f < 0.55) lightning(ctx, x + (rnd(seed, 2) - 0.5) * 40, top + 10, x + (rnd(seed, 3) - 0.5) * 8, head, seed + 50 + flick, w * 0.5, fade * 0.7, 1);
  if (hit < 1) return;
  // 닿은 자리: 하얀 섬광 · 충격파 · 불똥 · 땅을 기어가는 번개
  additive(ctx, () => {
    glow(ctx, x, y, r * (1.8 - f), core === "#ffffff" ? VOLT : core, 0.9 * fade, 1.6);
    shock(ctx, x, y, r * (0.4 + 1.3 * f), VOLT, 0.8 * fade, 5);
  });
  sparks(ctx, x, y, 10, r * 1.6, f, VOLT, seed, 1);
  for (let k = 0; k < 4; k++) {
    const ang = rnd(seed + 5, k) * TAU;
    const len = r * (0.8 + rnd(k, seed + 5) * 0.8) * Math.min(1, f * 3);
    lightning(ctx, x, y, x + Math.cos(ang) * len, y + Math.sin(ang) * len * 0.55, seed + k * 7 + flick, 1, fade * 0.8, 0);
  }
  if (core !== "#ffffff") additive(ctx, () => glow(ctx, x, y - 4, r * 0.7, core, fade, 1.2));
}
