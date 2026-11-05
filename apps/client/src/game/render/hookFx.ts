// 훅 기술 효과 — 시원하게 뻥 뚫리는 해적 산탄 (푸른 발사 그림 + 산탄 줄기 · 물보라)
// 산탄 발사 · 둘째 총열 · 갈고리 걸림 · 난파(벽 충돌) · 밧줄 착지 · 번개
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { bolt, droplets } from "./thorkenFx";
import { bubbles, rainbow } from "./seaLight";
import { blastSprite, HK_AQUA, HK_DEEP, HK_FOAM } from "./hookArt";

const HK_FX = new Set(["hkBlast", "hkTap", "hkGrab", "hkWreck", "hkLand", "hkBolt"]);

/** 산탄 줄기: 부채꼴로 퍼지며 뻗는 흰·물빛 선 (reach 길이) */
function pellets(ctx: Ctx, x: number, y: number, a: number, reach: number, f: number, seed: number, n: number, spread: number): void {
  const k = easeOut(Math.min(1, f / 0.35));
  const fade = f < 0.35 ? 1 : 1 - (f - 0.35) / 0.65;
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const b = a + (rnd(seed, i) - 0.5) * spread;
      const len = reach * (0.7 + rnd(i, seed) * 0.35);
      const head = len * k;
      const tail = Math.max(0, head - len * 0.45);
      ctx.strokeStyle = alpha(i % 3 ? HK_AQUA : HK_FOAM, 0.9 * fade);
      ctx.lineWidth = i % 3 ? 1.4 : 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(b) * tail, y + Math.sin(b) * tail);
      ctx.lineTo(x + Math.cos(b) * head, y + Math.sin(b) * head);
      ctx.stroke();
      if (f > 0.3) {
        ctx.fillStyle = alpha(HK_FOAM, fade);
        ctx.fillRect(Math.round(x + Math.cos(b) * head), Math.round(y + Math.sin(b) * head), 2, 2);
      }
    }
    ctx.lineCap = "butt";
  });
}

export function drawHookFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!HK_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.5 ? 1 : 1 - (f - 0.5) / 0.5;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const seed = fx.x * 7 + fx.y * 3;
  switch (fx.kind) {
    case "hkBlast":
    case "hkTap": {
      const big = fx.kind === "hkBlast";
      const frame = Math.min(3, Math.floor(f * 4));
      const w = fx.size * (big ? 1.35 : 0.95);
      const push = frame >= 2 ? w * 0.18 * (frame - 1) : 0;
      blastSprite(ctx, big ? 0 : 1, frame, x + fx.dirX * push, y + fx.dirY * push, a, w, f < 0.75 ? 1 : 1 - (f - 0.75) / 0.25);
      pellets(ctx, x, y, a, fx.size * 1.05, f, seed, big ? 9 : 5, big ? 1.1 : 0.6);
      if (f < 0.2) additive(ctx, () => glow(ctx, x, y, 14, HK_FOAM, 1 - f * 5, 1.5));
      return true;
    }
    case "hkGrab":
      additive(ctx, () => {
        shock(ctx, x, y, fx.size * (0.4 + easeOut(f)), HK_AQUA, 0.8 * fade, 3);
        glow(ctx, x, y, fx.size, HK_AQUA, 0.5 * fade, 1);
      });
      sparks(ctx, x, y, 6, fx.size * 1.3, f, HK_FOAM, seed, fade);
      return true;
    case "hkWreck": {
      // 난파: 벽에 처박힌 충격 · 나뭇조각 · 물보라
      additive(ctx, () => {
        shock(ctx, x, y, fx.size * (0.5 + easeOut(f) * 1.2), HK_FOAM, 0.8 * fade, 4);
        glow(ctx, x, y, fx.size * 1.2, HK_DEEP, 0.6 * fade, 1);
      });
      for (let i = 0; i < 8; i++) {
        const b = rnd(seed, i) * Math.PI * 2;
        const d = fx.size * (0.4 + easeOut(f) * (0.8 + rnd(i, seed)));
        ctx.fillStyle = alpha(i % 2 ? "#8a5a2a" : "#c8a070", fade);
        ctx.fillRect(Math.round(x + Math.cos(b) * d), Math.round(y + Math.sin(b) * d - f * 6), 3, 2);
      }
      droplets(ctx, x, y, fx.size, f, seed, 8);
      return true;
    }
    case "hkLand":
      additive(ctx, () => {
        shock(ctx, x, y, fx.size * (0.3 + easeOut(f)), HK_AQUA, 0.7 * fade, 5);
        shock(ctx, x, y, fx.size * (0.15 + easeOut(f) * 0.7), HK_FOAM, 0.5 * fade, 2);
      });
      droplets(ctx, x, y, fx.size * 0.8, f, seed, 10);
      bubbles(ctx, x, y, fx.size * 0.6, f, seed, 5, fade);
      if (f < 0.6) rainbow(ctx, x, y - 4, fx.size * 0.7, 0.3 * (1 - f / 0.6));
      return true;
    case "hkBolt":
      additive(ctx, () => bolt(ctx, x, y, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), seed + Math.floor(f * 4), fade, 2));
      return true;
  }
  return false;
}
