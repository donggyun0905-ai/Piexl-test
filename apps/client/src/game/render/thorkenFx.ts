// 토르켄 그리기 (1): 기술 효과 — 시원한 바다·폭풍 느낌 (맑은 하늘색 물보라 · 흰 거품 · 노란 번개)
// 닻 휘두르기(물살 초승달) · 철구공 휩쓸기(물 띠) · 던지기 · 천둥 · 물보라 · 감아 들이기 · 태풍 부르기 · 하늘 번개 · 종 · 물결 · 튀는 번개 · 물기둥 · 얼음
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { drawAnchorSwing } from "./thorkenAnchor";

const TAU = Math.PI * 2;
export const SEA = "#2a9cff";
export const CYAN = "#6ae8ff";
export const FOAM = "#f0fdff";
export const VOLT = "#fff27a";
const TK_FX = new Set(["tkAnchor", "tkSweep", "tkThrow", "tkClap", "tkSplash", "tkReel", "tkStormCall", "tkBolt", "tkBell", "tkTide", "tkVolt", "tkGeyser", "tkFrost"]);

/** 번개 한 줄기 (지그재그, seed로 모양 고정) */
export function bolt(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, seed: number, a: number, w = 2): void {
  const n = 7;
  const pts: [number, number][] = [[x0, y0]];
  const nx = -(y1 - y0);
  const ny = x1 - x0;
  const len = Math.hypot(nx, ny) || 1;
  for (let k = 1; k < n; k++) {
    const u = k / n;
    const off = (rnd(seed, k) - 0.5) * 0.35 * len;
    pts.push([x0 + (x1 - x0) * u + (nx / len) * off * 0.4, y0 + (y1 - y0) * u + (ny / len) * off * 0.4]);
  }
  pts.push([x1, y1]);
  ctx.lineJoin = "round";
  // 겹치면 밝아지게 (어두운 바닥에서도 번쩍)
  additive(ctx, () => {
    for (const [c, ww] of [[alpha("#7ad8ff", a * 0.3), w * 3], [alpha(VOLT, a), w], [`rgba(255,255,255,${a})`, Math.max(1, w * 0.45)]] as const) {
      ctx.strokeStyle = c;
      ctx.lineWidth = ww;
      ctx.beginPath();
      for (const [px, py] of pts) ctx.lineTo(px, py);
      ctx.stroke();
    }
  });
}

/** 물방울 왕관: 가운데서 위로 튀어 올랐다 떨어지는 물방울 */
export function droplets(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, n = 12): void {
  for (let k = 0; k < n; k++) {
    const ang = rnd(seed, k) * TAU;
    const d = r * (0.4 + rnd(k, seed) * 0.7) * easeOut(f);
    const up = Math.sin(f * Math.PI) * r * (0.4 + rnd(k, 3) * 0.6);
    const s = 1 + rnd(k, 5) * 1.8 * (1 - f * 0.6);
    ctx.fillStyle = k % 3 === 0 ? alpha(FOAM, 1 - f) : alpha(CYAN, 0.9 * (1 - f));
    ctx.fillRect(Math.round(x + Math.cos(ang) * d - s / 2), Math.round(y + Math.sin(ang) * d * 0.55 - up - s / 2), Math.ceil(s), Math.ceil(s));
  }
}

/** 물 띠 (가운데 x·y, 반지름 r, a0 → a1 사이를 칠함) · 앞쪽 끝에 흰 거품 */
export function waterArc(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, w: number, a: number): void {
  if (Math.abs(a1 - a0) < 0.01) return;
  const ccw = a1 < a0;
  ctx.lineCap = "round";
  for (const [c, ww] of [[alpha(SEA, a * 0.35), w * 2.2], [alpha(CYAN, a * 0.8), w], [alpha(FOAM, a), Math.max(1, w * 0.3)]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = ww;
    ctx.beginPath();
    ctx.arc(x, y, r, a0, a1, ccw);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
  // 앞 끝 물보라
  const hx = x + Math.cos(a1) * r;
  const hy = y + Math.sin(a1) * r;
  additive(ctx, () => glow(ctx, hx, hy, w * 2.2, CYAN, a * 0.9, 0.8));
}

export function drawThorkenFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!TK_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = 1 - f;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const seed = fx.x * 7 + fx.y * 3;
  switch (fx.kind) {
    case "tkAnchor": {
      // 닻 휘두르기: 커다란 금빛 닻이 부채꼴로 휙 돌아감 (잔상 + 물살) · 끝에서 물방울
      const side = fx.tint === "-1" ? -1 : 1;
      drawAnchorSwing(ctx, x, y - 3, Math.atan2(fx.dirY, fx.dirX), side, f, fx.size);
      droplets(ctx, x + fx.dirX * fx.size * 0.7, y - 3 + fx.dirY * fx.size * 0.7, fx.size * 0.6, f, seed, 10);
      return true;
    }
    case "tkSweep": {
      // 철구공 휩쓸기: 지나간 길에 물 띠 (앞 끝이 거품) · 꼬리가 사라짐
      const a0 = fx.dirX;
      const a1 = fx.dirY;
      const head = Math.min(1, f * (fx.maxTicks / Math.max(1, fx.maxTicks - 8)));
      const tail = Math.max(0, (f - 0.35) / 0.65);
      waterArc(ctx, x, y - 3, fx.size, a0 + (a1 - a0) * tail, a0 + (a1 - a0) * head, 5, 0.85 * (1 - tail * 0.6));
      return true;
    }
    case "tkThrow": {
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const k = easeOut(f);
      beam(ctx, x, y - 4, x + (tx - x) * k, y - 4 + (ty - y) * k - Math.sin(k * Math.PI) * 16, 1.5, CYAN, 0.5 * fade);
      return true;
    }
    case "tkClap": {
      // 떨어진 자리 천둥: 하늘에서 번개 + 흰 섬광 + 하늘색 충격파 + 불똥
      if (f < 0.45) bolt(ctx, x + (rnd(seed, 1) - 0.5) * 20, y - 140, x, y - 2, seed, 1 - f * 1.6, 3);
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * 1.3, VOLT, 0.8 * fade, 1);
        shock(ctx, x, y, fx.size * easeOut(f) * 1.2, CYAN, 0.9 * fade, 8);
      });
      sparks(ctx, x, y, 10, fx.size, f, VOLT, seed);
      return true;
    }
    case "tkSplash": {
      additive(ctx, () => shock(ctx, x, y, fx.size * easeOut(f), CYAN, 0.8 * fade, 5));
      droplets(ctx, x, y, fx.size, f, seed, 14);
      return true;
    }
    case "tkReel": {
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const k = easeOut(f);
      beam(ctx, x + (tx - x) * k, y + (ty - y) * k - 3, tx, ty - 3, 1.5, FOAM, 0.7 * fade);
      return true;
    }
    case "tkStormCall": {
      // 태풍 부르기: 흰 섬광 + 겹겹이 퍼지는 바람 고리 + 소용돌이 팔
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * 1.6, CYAN, 0.9 * fade, 1);
        for (let k = 0; k < 3; k++) shock(ctx, x, y, fx.size * easeOut(Math.min(1, f * 1.4 + k * 0.15)) * (1 + k * 0.3), k === 1 ? FOAM : CYAN, 0.8 * fade, 6);
      });
      return true;
    }
    case "tkBolt": {
      // 하늘 번개: 처음 몇 틱은 땅에 예고 원, 그 뒤 내리꽂힘
      const t = fx.maxTicks - fx.ticks;
      const strike = Math.max(0, t - (fx.maxTicks - 16));
      if (strike <= 0) {
        ctx.strokeStyle = alpha(VOLT, 0.5);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(x, y, fx.size, fx.size * 0.5, 0, 0, TAU);
        ctx.stroke();
        return true;
      }
      const g = 1 - strike / 16;
      bolt(ctx, x + (rnd(seed, 2) - 0.5) * 30, y - 170, x, y - 2, seed + strike, g, 3.5);
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * 2.2, VOLT, g, 1);
        shock(ctx, x, y, fx.size * 2 * (1 - g), CYAN, g, 5);
      });
      return true;
    }
    case "tkBell": {
      additive(ctx, () => {
        shock(ctx, x, y - 4, fx.size * easeOut(f), "#ffd870", 0.85 * fade, 8);
        glow(ctx, x, y - 6, 18, "#ffe8a0", 0.7 * fade, 1);
      });
      return true;
    }
    case "tkTide": {
      // 퍼지는 물결: 두 겹 고리 + 흰 거품 점
      additive(ctx, () => {
        shock(ctx, x, y, fx.size * easeOut(f), SEA, 0.9 * fade, 10);
        shock(ctx, x, y, fx.size * easeOut(f) * 0.7, CYAN, 0.7 * fade, 5);
      });
      for (let k = 0; k < 14; k++) {
        const ang = (k / 14) * TAU + rnd(seed, k) * 0.3;
        const d = fx.size * easeOut(f);
        ctx.fillStyle = alpha(FOAM, fade);
        ctx.fillRect(Math.round(x + Math.cos(ang) * d), Math.round(y + Math.sin(ang) * d * 0.6), 2, 1);
      }
      return true;
    }
    case "tkVolt": {
      bolt(ctx, x, y - 4, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y) - 4, seed + Math.floor(f * 4), fade, 1.5);
      return true;
    }
    case "tkGeyser": {
      // 물기둥: 아래에서 솟구쳐 꼭대기에서 흩어짐
      const h = 70 * easeOut(Math.min(1, f * 2.2));
      const w = fx.size * 0.55 * (1 - f * 0.3);
      const g = ctx.createLinearGradient(x, y, x, y - h);
      g.addColorStop(0, alpha(SEA, 0.85 * fade));
      g.addColorStop(0.7, alpha(CYAN, 0.8 * fade));
      g.addColorStop(1, alpha(FOAM, 0.9 * fade));
      ctx.fillStyle = g;
      ctx.fillRect(x - w / 2, y - h, w, h);
      ctx.fillStyle = alpha(FOAM, 0.9 * fade);
      ctx.fillRect(x - 1, y - h, 2, h);
      droplets(ctx, x, y - h, fx.size, f, seed, 16);
      additive(ctx, () => shock(ctx, x, y, fx.size * easeOut(f), CYAN, 0.8 * fade, 6));
      return true;
    }
    case "tkFrost": {
      // 얼음 결정: 여섯 갈래 가시 + 흰 빛
      ctx.strokeStyle = alpha(FOAM, fade);
      ctx.lineWidth = 1.5;
      for (let k = 0; k < 6; k++) {
        const ang = (k / 6) * TAU;
        const d = fx.size * easeOut(f);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.6);
        ctx.stroke();
      }
      additive(ctx, () => glow(ctx, x, y, fx.size, "#a8e8ff", 0.7 * fade, 0.8));
      return true;
    }
  }
  return false;
}
