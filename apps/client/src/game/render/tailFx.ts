// 테일 기술 효과 — 시원하게 뻥 뚫리는 바다 (맑은 물빛 · 흰 거품 · 물 상어)
// 꼬리 위→아래 · 아래→위 · 내려치기 물기둥 · 삼키기 솟는 턱 · 돌진 튀어나옴·잠수 물보라 · 낙하 물폭탄 · 번개 · 변신 · 번개 돌진 · 씹기
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, easeOut, glow, rnd, shock, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { bolt, droplets } from "./thorkenFx";
import { bubbles, glint, glints, rainbow, rays } from "./seaLight";
import { AQUA, FOAM, WATER, jaws, ripple } from "./tailShark";

const TAU = Math.PI * 2;
const TL_FX = new Set(["tlDown", "tlUp", "tlSmash", "tlMaw", "tlLeap", "tlSplash", "tlSlam", "tlBolt", "tlMorph", "tlDart", "tlChomp"]);

/** 물 꼬리 (밑동 x·y에서 ang 쪽으로 len, 끝에 초승달 꼬리지느러미) */
function tailShape(ctx: Ctx, x: number, y: number, ang: number, len: number, a: number): void {
  const ex = x + Math.cos(ang) * len;
  const ey = y + Math.sin(ang) * len;
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.lineCap = "round";
  for (const [c, w] of [[alpha(WATER, 0.9), 7], [alpha(AQUA, 0.9), 4], [FOAM, 1.5]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.cos(ang - 0.3) * len * 0.6, y + Math.sin(ang - 0.3) * len * 0.6, ex, ey);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
  // 꼬리지느러미 (끝에서 양쪽으로 갈라짐)
  const n = ang + Math.PI / 2;
  ctx.fillStyle = WATER;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.quadraticCurveTo(ex + Math.cos(ang) * 4 + Math.cos(n) * 9, ey + Math.sin(ang) * 4 + Math.sin(n) * 9, ex + Math.cos(ang) * 9 + Math.cos(n) * 10, ey + Math.sin(ang) * 9 + Math.sin(n) * 10);
  ctx.lineTo(ex + Math.cos(ang) * 3, ey + Math.sin(ang) * 3);
  ctx.lineTo(ex + Math.cos(ang) * 9 - Math.cos(n) * 8, ey + Math.sin(ang) * 9 - Math.sin(n) * 8);
  ctx.quadraticCurveTo(ex + Math.cos(ang) * 3 - Math.cos(n) * 7, ey + Math.sin(ang) * 3 - Math.sin(n) * 7, ex, ey);
  ctx.fill();
  ctx.strokeStyle = alpha(AQUA, 0.9);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

/** 꼬리 휘두르기: from → to 각으로 쓸고 지나간 자리에 물 초승달 + 흩어지는 물방울 */
function swing(ctx: Ctx, x: number, y: number, from: number, to: number, k: number, reach: number, fade: number, seed: number): void {
  const at = from + (to - from) * k;
  additive(ctx, () => {
    const span = Math.abs(at - from) / 2;
    if (span > 0.05) {
      crescent(ctx, x, y, reach, (at + from) / 2, span, 12, WATER, 0.65 * fade);
      crescent(ctx, x, y, reach * 0.92, (at + from) / 2, span, 5, FOAM, 0.75 * fade);
    }
  });
  for (let i = 0; i < 7; i++) {
    const u = k * (i / 7);
    const a = from + (to - from) * u;
    const d = reach * (0.85 + rnd(seed, i) * 0.3);
    ctx.fillStyle = alpha(i % 2 ? FOAM : AQUA, fade * (0.4 + u * 0.6));
    ctx.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d), 2, 2);
  }
  for (let i = 3; i >= 1; i--) tailShape(ctx, x, y, from + (to - from) * Math.max(0, k - i * 0.1), reach * 0.85, 0.12 * (4 - i) * fade);
  tailShape(ctx, x, y, at, reach * 0.85, fade);
}

/** 솟구치는 물기둥 (아래에서 위로, 높이 h) */
function geyser(ctx: Ctx, x: number, y: number, w: number, h: number, a: number): void {
  if (a <= 0.02) return;
  additive(ctx, () => {
    const g = ctx.createLinearGradient(x, y, x, y - h);
    g.addColorStop(0, alpha(WATER, 0.75 * a));
    g.addColorStop(0.6, alpha(AQUA, 0.5 * a));
    g.addColorStop(1, alpha(FOAM, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - w, y);
    ctx.quadraticCurveTo(x - w * 0.5, y - h * 0.6, x - w * 0.15, y - h);
    ctx.lineTo(x + w * 0.15, y - h);
    ctx.quadraticCurveTo(x + w * 0.5, y - h * 0.6, x + w, y);
    ctx.closePath();
    ctx.fill();
  });
}

export function drawTailFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!TL_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.6 ? 1 : 1 - (f - 0.6) / 0.4;
  const x = snap(fx.x);
  const y = snap(fx.y) - 3;
  const face = Math.atan2(fx.dirY, fx.dirX);
  const seed = fx.x * 7 + fx.y * 3;
  const tick = fx.maxTicks - fx.ticks;
  // 위→아래: 화면 위쪽 끝에서 아래쪽 끝으로 (왼쪽을 보면 거꾸로 돌아도 위에서 아래)
  const down = Math.cos(face) >= 0 ? 1 : -1;
  switch (fx.kind) {
    case "tlDown":
    case "tlUp": {
      const s = (fx.kind === "tlDown" ? 1 : -1) * down;
      swing(ctx, x, y, face - 1.3 * s, face + 1.3 * s, easeOut(Math.min(1, f / 0.45)), fx.size, fade, seed);
      droplets(ctx, x + fx.dirX * fx.size * 0.8, y + fx.dirY * fx.size * 0.8, fx.size * 0.45, f, seed, 8);
      return true;
    }
    case "tlSmash": {
      // 내려치기: 꼬리가 위에서 내리꽂히고 → 물기둥이 솟으며 물결이 퍼짐
      const hit = Math.min(1, f / 0.3);
      if (f < 0.3) tailShape(ctx, x - fx.dirX * 22, y - fx.dirY * 22 - 22 * (1 - hit), Math.atan2(fx.dirY + 0.9 * (1 - hit), fx.dirX), 30, 1);
      else {
        const g = (f - 0.3) / 0.7;
        additive(ctx, () => {
          glow(ctx, x, y, fx.size * 1.2, AQUA, 0.8 * (1 - g), 0.9);
          shock(ctx, x, y, fx.size * easeOut(g) * 1.3, AQUA, 0.9 * (1 - g), 5);
        });
        geyser(ctx, x, y, fx.size * 0.45, 46 * Math.sin(Math.min(1, g * 1.5) * Math.PI * 0.5), 1 - g);
        for (let i = 0; i < 3; i++) ripple(ctx, x, y + 2, fx.size * easeOut(Math.min(1, g * 1.2 + i * 0.15)), 0.8 * (1 - g), i ? AQUA : FOAM, 2);
        droplets(ctx, x, y - 10, fx.size, g, seed, 14);
        rainbow(ctx, x, y - 6, fx.size * 0.9, 0.7 * (1 - g));
      }
      return true;
    }
    case "tlMaw": {
      // 삼키기: 바다 밑에서 커다란 턱이 크게 벌린 채 솟아 → 쾅 닫히고 → 물기둥과 함께 가라앉음
      const k = Math.min(1, f / 0.35);
      const open = f < 0.35 ? 1 - k * 0.15 : Math.max(0, 0.85 - (f - 0.35) * 5);
      const rise = easeOut(k) * fx.size * 0.5 - Math.max(0, f - 0.6) * fx.size * 1.2;
      additive(ctx, () => glow(ctx, x, y, fx.size * 1.4, WATER, 0.6 * fade, 0.4));
      geyser(ctx, x, y + 4, fx.size * 1.1, fx.size * 1.5 * easeOut(k), 0.7 * fade);
      jaws(ctx, x, y - rise, fx.size * 1.05, open, fade);
      if (f > 0.35 && f < 0.6) additive(ctx, () => shock(ctx, x, y - rise, fx.size * 1.4 * ((f - 0.35) / 0.25), FOAM, 0.9, 3));
      for (let i = 0; i < 3; i++) ripple(ctx, x, y + 3, fx.size * (1 + easeOut(f) * 0.8 + i * 0.25), 0.8 * (1 - f), i ? AQUA : FOAM, 2);
      droplets(ctx, x, y - rise, fx.size * 1.2, f, seed, 16);
      glints(ctx, x, y - fx.size, fx.size, 5, tick, seed, FOAM, fade);
      return true;
    }
    case "tlLeap":
    case "tlSplash": {
      // 물에서 튀어나옴 · 다시 잠수: 왕관 모양 물보라 + 물결 고리 + 거품
      const up = fx.kind === "tlLeap";
      additive(ctx, () => glow(ctx, x, y, fx.size * 1.2, AQUA, 0.6 * (1 - f), 0.6));
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI + (i / 8) * Math.PI;
        const h = fx.size * (0.8 + rnd(seed, i) * 0.8) * Math.sin(Math.min(1, f * 1.6) * Math.PI);
        ctx.strokeStyle = alpha(i % 2 ? FOAM : AQUA, 0.9 * (1 - f));
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * fx.size * 0.4, y);
        ctx.lineTo(x + Math.cos(a) * fx.size * (0.6 + f), y - h);
        ctx.stroke();
      }
      for (let i = 0; i < 2; i++) ripple(ctx, x, y + 2, fx.size * (0.6 + easeOut(f) * (1.4 + i * 0.5)), 0.9 * (1 - f), i ? AQUA : FOAM, 2);
      bubbles(ctx, x, y - 4, fx.size, f, seed, up ? 6 : 10, 1 - f);
      return true;
    }
    case "tlSlam": {
      // 낙하: 물폭탄처럼 터지는 바다 · 높은 물기둥 · 무지개 · 빛줄기
      additive(ctx, () => {
        if (f < 0.25) glow(ctx, x, y, fx.size * 1.6, FOAM, 1 - f / 0.25, 1);
        shock(ctx, x, y, fx.size * 1.5 * easeOut(f), AQUA, 0.9 * (1 - f), 8);
        shock(ctx, x, y, fx.size * 1.1 * easeOut(Math.min(1, f * 1.4)), FOAM, 0.7 * (1 - f), 3);
      });
      geyser(ctx, x, y, fx.size * 0.7, 80 * Math.sin(Math.min(1, f * 2) * Math.PI * 0.5), 1 - f);
      rays(ctx, x, y - 10, fx.size * 2 * easeOut(f), 10, 0.5 * (1 - f), seed, AQUA, f);
      for (let i = 0; i < 3; i++) ripple(ctx, x, y + 3, fx.size * (0.8 + easeOut(f) * (1 + i * 0.4)), 0.9 * (1 - f), i ? AQUA : FOAM, 2.5);
      droplets(ctx, x, y - 16, fx.size * 1.6, f, seed, 22);
      rainbow(ctx, x, y - 10, fx.size * 1.3, 0.8 * (1 - f));
      glints(ctx, x, y - 20, fx.size * 1.2, 6, tick, seed, FOAM, 1 - f);
      return true;
    }
    case "tlBolt":
      additive(ctx, () => {
        bolt(ctx, x, y, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y) - 3, seed + tick, 1 - f, 2);
        glow(ctx, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y) - 3, 10, AQUA, 0.8 * (1 - f), 0.8);
      });
      return true;
    case "tlMorph":
      // 물 상어로 변함: 몸을 감싸며 물이 휘감기고 → 확 터짐
      additive(ctx, () => {
        glow(ctx, x, y - 4, 22 * (1 - f * 0.5), AQUA, 0.9 * (1 - f), 0.8);
        for (let k = 0; k < 3; k++) crescent(ctx, x, y - 4, 14 + k * 4, f * 8 + (k * TAU) / 3, 1.2, 4, k === 1 ? FOAM : WATER, 0.8 * (1 - f));
      });
      droplets(ctx, x, y - 4, 22, f, seed, 12);
      return true;
    case "tlDart": {
      // 번개 같은 돌진: 하얗게 빛나는 물살 줄기 + 양옆으로 갈라지는 물결
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y) - 3;
      additive(ctx, () => {
        ctx.lineCap = "round";
        for (const [c, w] of [[alpha(WATER, 0.45 * (1 - f)), 14], [alpha(AQUA, 0.8 * (1 - f)), 6], [alpha(FOAM, 1 - f), 2]] as const) {
          ctx.strokeStyle = c;
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }
        ctx.lineCap = "butt";
        if (f < 0.4) bolt(ctx, x, y, tx, ty, seed + tick, 0.7 * (1 - f / 0.4), 1);
      });
      if (tick % 2 === 0) glint(ctx, (x + tx) / 2, (y + ty) / 2, 5 * (1 - f), FOAM, 1 - f);
      return true;
    }
    case "tlChomp": {
      // 씹어먹기: 위아래 턱이 쾅 닫히는 이빨 자국 + 물보라 + 흡혈 물방울이 빨려 듦
      const k = Math.min(1, f / 0.25);
      const gap = fx.size * (1 - easeOut(k));
      additive(ctx, () => {
        if (f > 0.2) glow(ctx, x, y, fx.size * 1.4, AQUA, 0.8 * (1 - f), 0.9);
        shock(ctx, x, y, fx.size * 1.6 * easeOut(f), FOAM, 0.9 * (1 - f), 4);
      });
      ctx.fillStyle = alpha("#ffffff", fade);
      for (const side of [-1, 1]) {
        for (let i = -2; i <= 2; i++) {
          const px = x + i * fx.size * 0.32;
          const py = y + side * (gap + 3);
          ctx.beginPath();
          ctx.moveTo(px - 3.5, py);
          ctx.lineTo(px, py - side * 8);
          ctx.lineTo(px + 3.5, py);
          ctx.fill();
        }
      }
      if (f > 0.25) {
        droplets(ctx, x, y, fx.size * 1.3, (f - 0.25) / 0.75, seed, 18);
        for (let i = 0; i < 6; i++) {
          const a = rnd(seed, i) * TAU;
          const d = fx.size * 1.4 * (1 - f);
          ctx.fillStyle = alpha(i % 2 ? "#ff6a8a" : AQUA, 1 - f);
          ctx.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d), 2, 2);
        }
      }
      return true;
    }
  }
  return false;
}
