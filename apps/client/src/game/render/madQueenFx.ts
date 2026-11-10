// 매드퀸 기술 효과 — 시원하게 뻥 뚫리는 바다 포격 (함대 빛깔 + 흰 물보라 · 무지개)
// 포탄 폭발(빛 기둥·충격파·물보라) · 대포 불꽃 · 날개 레이저 · 터렛 내려앉기·떠나기 · 날개 펼침 · 전탄 일제사격 · 번개
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { bolt, droplets } from "./thorkenFx";
import { bubbles, rainbow, rays } from "./seaLight";
import { mqColor, MQ_FOAM } from "./madQueenArt";

const MQ_FX = new Set(["mqBoom", "mqMuzzle", "mqBeam", "mqDrop", "mqWing", "mqSalvo", "mqBolt"]);

/** 포탄 폭발: 빛 덩이 → 바깥으로 퍼지는 충격파 두 겹 · 솟는 물보라 · 빛줄기 · 흰 거품 방울 */
function boom(ctx: Ctx, x: number, y: number, r: number, c: string, f: number, seed: number): void {
  const fade = f < 0.4 ? 1 : 1 - (f - 0.4) / 0.6;
  const k = easeOut(Math.min(1, f / 0.5));
  additive(ctx, () => {
    glow(ctx, x, y, r * (0.6 + k * 0.6), c, 0.9 * fade, f < 0.25 ? 1.6 : 0.6);
    shock(ctx, x, y, r * (0.4 + k * 0.85), c, 0.8 * fade, 6);
    shock(ctx, x, y, r * (0.2 + k * 1.15), MQ_FOAM, 0.35 * fade, 3);
    if (r > 18) rays(ctx, x, y, r * (0.8 + k * 0.5), 6, 0.45 * fade, seed, c, f);
  });
  sparks(ctx, x, y, 8, r * 1.1, f, MQ_FOAM, seed, fade);
  droplets(ctx, x, y - 2, r * 0.9, f, seed, 10);
  bubbles(ctx, x, y, r * 0.8, f, seed, 5, fade);
  if (r > 26 && f < 0.6) rainbow(ctx, x, y - r * 0.2, r * 0.9, 0.35 * (1 - f / 0.6));
}

/** 전탄 일제사격: 내 둘레로 크게 번지는 빛 고리 · 하늘로 솟는 빛줄기 · 사방 빛줄기 */
function salvo(ctx: Ctx, x: number, y: number, c: string, f: number, seed: number): void {
  const fade = f < 0.5 ? 1 : 1 - (f - 0.5) / 0.5;
  const k = easeOut(f);
  additive(ctx, () => {
    shock(ctx, x, y, 20 + k * 140, c, 0.7 * fade, 10);
    shock(ctx, x, y, 10 + k * 90, MQ_FOAM, 0.5 * fade, 4);
    rays(ctx, x, y, 40 + k * 60, 12, 0.5 * fade, seed, c, f * 2);
    for (let i = 0; i < 6; i++) {
      const ox = (rnd(seed, i) - 0.5) * 60;
      beam(ctx, x + ox, y - 4, x + ox * 1.6, y - 120 - k * 80, 3, i % 2 ? MQ_FOAM : c, 0.6 * fade);
    }
    glow(ctx, x, y - 10, 24, c, 0.3 * fade);
  });
}

export function drawMadQueenFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!MQ_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.5 ? 1 : 1 - (f - 0.5) / 0.5;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const c = mqColor(fx.style);
  const seed = fx.x * 7 + fx.y * 3;
  switch (fx.kind) {
    case "mqBoom":
      boom(ctx, x, y, fx.size, c, f, seed);
      return true;
    case "mqMuzzle":
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * (1 + f), c, fade, 1.5);
        beam(ctx, x, y, x + fx.dirX * fx.size * 1.6, y + fx.dirY * fx.size * 1.6, 2, MQ_FOAM, 0.8 * fade);
      });
      return true;
    case "mqBeam": {
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const w = (fx.width ?? 6) * (f < 0.2 ? 0.4 + f * 3 : 1) * (1 - f * 0.6);
      additive(ctx, () => {
        beam(ctx, x, y, tx, ty, w, c, fade);
        glow(ctx, x, y, w * 2, c, fade, 1.5);
        for (let i = 0; i < 4; i++) {
          const u = (rnd(seed, i) + f) % 1;
          ctx.fillStyle = alpha(MQ_FOAM, fade * 0.8);
          ctx.fillRect(Math.round(x + (tx - x) * u + (rnd(seed, i + 9) - 0.5) * w * 2), Math.round(y + (ty - y) * u), 2, 2);
        }
      });
      return true;
    }
    case "mqDrop": {
      // 터렛이 하늘에서 빛 기둥을 타고 내려앉음 (dirY -1: 일제사격으로 하늘로 떠남)
      const up = fx.dirY < 0;
      additive(ctx, () => {
        const h = up ? 40 + f * 140 : 160 * (1 - easeOut(f));
        beam(ctx, x, y - 6, x, y - 6 - h, fx.size * 0.4 * fade, c, 0.7 * fade);
        shock(ctx, x, y, fx.size * (0.5 + f * 1.2), c, 0.6 * fade, 4);
        glow(ctx, x, y - 8, fx.size, c, 0.5 * fade, 1);
      });
      return true;
    }
    case "mqWing":
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * (1 + f), c, fade, 1.2);
        shock(ctx, x, y, fx.size * (0.3 + f * 1.2), MQ_FOAM, 0.6 * fade, 3);
      });
      sparks(ctx, x, y, 6, fx.size * 1.4, f, c, seed, fade);
      return true;
    case "mqSalvo":
      salvo(ctx, x, y, c, f, seed);
      return true;
    case "mqBolt":
      additive(ctx, () => bolt(ctx, x, y, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), seed + Math.floor(f * 4), fade, 2));
      return true;
  }
  return false;
}
