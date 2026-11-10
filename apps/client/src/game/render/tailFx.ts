// 테일 기술 효과 — 시원하게 뻥 뚫리는 바다 (맑은 물빛 · 흰 거품 · 물 상어)
// 꼬리 위→아래 · 아래→위 · 내려치기 물기둥 · 삼키기 솟는 턱 · 돌진 튀어나옴·잠수 물보라 · 낙하 물폭탄 · 번개 · 변신 · 번개 돌진 · 씹기
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, easeOut, glow, rnd, shock, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { bolt, droplets } from "./thorkenFx";
import { bubbles, glint, glints, rainbow, rays } from "./seaLight";
import { AQUA, FOAM, WATER, jaws, ripple, sharkShape } from "./tailShark";
import { crown, geyser, shed, spray, tailShape } from "./tailArt";

const TAU = Math.PI * 2;
const TL_FX = new Set(["tlDown", "tlUp", "tlSmash", "tlMaw", "tlLeap", "tlSplash", "tlSlam", "tlBolt", "tlMorph", "tlDart", "tlChomp"]);

/** 꼬리 휘두르기: from → to 각으로 쓸고 지나간 자리에 겹겹의 물 초승달 + 바깥으로 튀는 물살 + 굵은 꼬리(잔상 둘) */
function swing(ctx: Ctx, x: number, y: number, from: number, to: number, k: number, reach: number, fade: number, seed: number, f: number): void {
  const at = from + (to - from) * k;
  const dir = to > from ? 1 : -1;
  additive(ctx, () => {
    const span = Math.abs(at - from) / 2;
    if (span > 0.05) {
      const mid = (at + from) / 2;
      crescent(ctx, x, y, reach * 1.02, mid, span, 16, WATER, 0.4 * fade);
      crescent(ctx, x, y, reach, mid, span, 9, AQUA, 0.65 * fade);
      crescent(ctx, x, y, reach * 0.95, mid, span, 3, FOAM, 0.85 * fade);
      crescent(ctx, x, y, reach * 0.7, mid, span * 0.9, 4, AQUA, 0.3 * fade);
    }
  });
  spray(ctx, x, y, from, at, reach, f, seed, fade);
  for (let i = 0; i < 8; i++) {
    const u = k * (i / 8);
    const a = from + (to - from) * u;
    const d = reach * (0.85 + rnd(seed, i) * 0.3);
    ctx.fillStyle = alpha(i % 2 ? FOAM : AQUA, fade * (0.4 + u * 0.6));
    ctx.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d), 2, 2);
  }
  // 잔상 둘 → 진짜 꼬리 (밑동이 굵고, 휘두르는 반대쪽으로 휨)
  for (let i = 2; i >= 1; i--) tailShape(ctx, x, y, from + (to - from) * Math.max(0, k - i * 0.12), reach * 0.9, 0.18 * (3 - i) * fade, 0.35 * dir);
  tailShape(ctx, x, y, at, reach * 0.9, fade, 0.35 * dir);
  shed(ctx, x, y, at, reach * 0.9, f, seed, fade);
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
      swing(ctx, x, y, face - 1.3 * s, face + 1.3 * s, easeOut(Math.min(1, f / 0.45)), fx.size, fade, seed, f);
      droplets(ctx, x + fx.dirX * fx.size * 0.8, y + fx.dirY * fx.size * 0.8, fx.size * 0.45, f, seed, 8);
      return true;
    }
    case "tlSmash": {
      // 내려치기: 꼬리가 위에서 내리꽂히고 → 물기둥이 솟으며 물결이 퍼짐
      const hit = Math.min(1, f / 0.3);
      if (f < 0.3) {
        // 굵은 꼬리가 머리 위에서 크게 휘어 내리꽂힘 (잔상 둘)
        for (let i = 2; i >= 0; i--) {
          const h = Math.max(0, hit - i * 0.15);
          tailShape(ctx, x - fx.dirX * 24, y - fx.dirY * 24 - 26 * (1 - h), Math.atan2(fx.dirY + 1.1 * (1 - h), fx.dirX), 34, i ? 0.2 * (3 - i) : 1, -0.4, 1.2);
        }
      } else {
        const g = (f - 0.3) / 0.7;
        additive(ctx, () => {
          glow(ctx, x, y, fx.size * 1.2, AQUA, 0.8 * (1 - g), 0.9);
          shock(ctx, x, y, fx.size * easeOut(g) * 1.3, AQUA, 0.9 * (1 - g), 5);
        });
        geyser(ctx, x, y, fx.size * 0.45, 50 * Math.sin(Math.min(1, g * 1.5) * Math.PI * 0.5), 1 - g, seed);
        crown(ctx, x, y + 2, fx.size * 0.9, g, seed);
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
      geyser(ctx, x, y + 4, fx.size * 1.1, fx.size * 1.5 * easeOut(k), 0.7 * fade, seed);
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
      crown(ctx, x, y, fx.size * (up ? 1.1 : 1.3), f, seed);
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
      geyser(ctx, x, y, fx.size * 0.7, 80 * Math.sin(Math.min(1, f * 2) * Math.PI * 0.5), 1 - f, seed);
      crown(ctx, x, y + 2, fx.size * 1.3, f, seed, 15);
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
        if (f > 0.5) shock(ctx, x, y - 4, 30 * easeOut((f - 0.5) / 0.5), AQUA, 0.9 * (1 - f), 4);
      });
      bubbles(ctx, x, y - 4, 20, f, seed, 8, 1 - f);
      droplets(ctx, x, y - 4, 26, f, seed, 16);
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
      // 양옆으로 갈라지는 물결 (V자) · 줄을 감아 도는 거품 · 끝에서 사라지는 상어 그림자
      const len = Math.hypot(tx - x, ty - y) || 1;
      const ux = (tx - x) / len;
      const uy = (ty - y) / len;
      ctx.strokeStyle = alpha(FOAM, 0.7 * (1 - f));
      ctx.lineWidth = 1.2;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.quadraticCurveTo((x + tx) / 2 - uy * side * 8, (y + ty) / 2 + ux * side * 8, x - uy * side * (12 + f * 10), y + ux * side * (12 + f * 10));
        ctx.stroke();
      }
      for (let i = 0; i < 12; i++) {
        const u = i / 12;
        const off = Math.sin(u * 14 + f * 12) * 3.5;
        ctx.fillStyle = alpha(i % 2 ? FOAM : AQUA, (1 - f) * (0.3 + u * 0.7));
        ctx.fillRect(Math.round(x + (tx - x) * u - uy * off), Math.round(y + (ty - y) * u + ux * off), 2, 2);
      }
      sharkShape(ctx, tx, ty, Math.atan2(uy, ux), 26, 0.6 * (1 - f), tick, 0.6);
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
      // 위아래 잇몸(물빛 띠) + 안으로 휜 상어 이빨 (가운데가 크고 양끝이 작음)
      for (const side of [-1, 1]) {
        const gy = y + side * (gap + 4);
        ctx.fillStyle = alpha(WATER, 0.85 * fade);
        ctx.beginPath();
        ctx.ellipse(x, gy + side * 2, fx.size * 0.95, 3, 0, 0, TAU);
        ctx.fill();
        for (let i = -3; i <= 3; i++) {
          const px = x + i * fx.size * 0.26;
          const big = 1 - Math.abs(i) * 0.18;
          ctx.fillStyle = alpha("#ffffff", fade);
          ctx.strokeStyle = alpha("#9adcf0", fade);
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(px - 3.2 * big, gy);
          ctx.quadraticCurveTo(px - 1.5 * big, gy - side * 5 * big, px + 0.8 * big, gy - side * 9 * big);
          ctx.quadraticCurveTo(px + 1.5 * big, gy - side * 4 * big, px + 3.2 * big, gy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
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
