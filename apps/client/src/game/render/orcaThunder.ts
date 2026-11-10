// 오르카 해방 중 천둥 주먹: 물 효과 위에 얹는 굵은 파란 번개 층 (orcaFx가 tint 있는 효과에 부름)
// 주먹 끝 번개 덩어리 · 하늘에서 내리꽂는 낙뢰 · 번개 고리 · 바닥 번쩍
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { blueBolt } from "./orcaArt";
import { OC_VOLT } from "./orcaPal";

const CORE = "#e8f0ff";
const DEEP = "#0a1eff";

/** 하늘에서 (x,y)로 내리꽂는 낙뢰 (높이 h) + 바닥 번쩍·고리 */
export function thunderStrike(ctx: Ctx, x: number, y: number, h: number, f: number, seed: number, w = 4): void {
  if (f > 0.55) return;
  const k = 1 - f / 0.55;
  const flick = Math.floor(f * 14);
  blueBolt(ctx, x + (rnd(seed, 1) - 0.5) * 20, y - h, x, y, seed + flick, k, w);
  blueBolt(ctx, x + (rnd(seed, 2) - 0.5) * 30, y - h * 0.8, x, y, seed + flick + 5, k * 0.6, w * 0.45);
  additive(ctx, () => {
    glow(ctx, x, y, 26, OC_VOLT, k, 1.6);
    shock(ctx, x, y, 8 + easeOut(f / 0.55) * 30, CORE, 0.9 * k, 3);
  });
}

/** 번개 덩어리 (x,y 둘레로 굵은 번개 n갈래가 r까지 뻗음, a 방향 쪽으로 몰림 · spread 퍼짐) */
function burst(ctx: Ctx, x: number, y: number, a: number, spread: number, r: number, n: number, k: number, seed: number, w: number): void {
  for (let i = 0; i < n; i++) {
    const b = a + (i / Math.max(1, n - 1) - 0.5) * spread + (rnd(seed, i) - 0.5) * 0.3;
    const d = r * (0.7 + rnd(i, seed) * 0.4);
    blueBolt(ctx, x, y, x + Math.cos(b) * d, y + Math.sin(b) * d, seed + i * 7, k, w);
  }
}

/** 해방 중 효과 위에 천둥을 얹음 */
export function drawThunder(ctx: Ctx, fx: EffectState, snap: Snap): void {
  const f = 1 - fx.ticks / fx.maxTicks;
  const k = f < 0.4 ? 1 : 1 - (f - 0.4) / 0.6;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const seed = Math.round(fx.x * 7 + fx.y * 3) + Math.floor(f * 12);
  const r = fx.size;
  switch (fx.kind) {
    case "ocSpray": {
      // 천둥 주먹: 주먹 끝에서 앞으로 굵은 번개 다발 · 끝에 낙뢰
      const fistX = x + fx.dirX * 12;
      const fistY = y + fx.dirY * 12;
      additive(ctx, () => {
        glow(ctx, fistX, fistY, 22, DEEP, 0.8 * k, 0.6);
        glow(ctx, fistX, fistY, 12, CORE, k, 1.5);
      });
      burst(ctx, fistX, fistY, a, 1.4, r * (0.8 + easeOut(f) * 0.6), 5, k, seed, 3.6);
      thunderStrike(ctx, x + fx.dirX * r * 0.8, y + fx.dirY * r * 0.8, 70, f, seed, 3.5);
      return;
    }
    case "ocWhirl":
      // 번개 소용돌이: 둘레를 도는 굵은 번개 고리
      for (let i = 0; i < 6; i++) {
        const b0 = a + f * 8 + (i / 6) * Math.PI * 2;
        const rr = r * 0.85;
        blueBolt(ctx, x + Math.cos(b0) * rr, y + Math.sin(b0) * rr, x + Math.cos(b0 + 1.05) * rr, y + Math.sin(b0 + 1.05) * rr, seed + i, k, 3);
      }
      additive(ctx, () => shock(ctx, x, y, r * (0.6 + easeOut(f) * 0.4), OC_VOLT, 0.7 * k, 6));
      return;
    case "ocGeyser":
      // 번개 물기둥: 기둥을 타고 오르내리는 번개 + 낙뢰
      thunderStrike(ctx, x, y, 110, f, seed, 5);
      if (f > 0.15 && f < 0.8) for (let i = 0; i < 3; i++) blueBolt(ctx, x + (i - 1) * r * 0.4, y, x + (i - 1) * r * 0.2, y - 70, seed + i * 11, k, 2.2);
      return;
    case "ocBite":
    case "ocDart":
    case "ocBurst":
      thunderStrike(ctx, x, y, 60, f, seed, fx.kind === "ocBurst" ? 4 : 2.6);
      if (fx.kind === "ocBurst") burst(ctx, x, y, 0, Math.PI * 2, r * 1.2, 6, k, seed, 2.2);
      return;
    case "ocBolt":
      if (r > 0) sparks(ctx, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y) - 4, 10, 30, f, CORE, seed, k);
      return;
    case "ocZap":
      additive(ctx, () => glow(ctx, x, y, 14, alpha(OC_VOLT, 1), 0.8 * (1 - f), 1.2));
      return;
  }
}
