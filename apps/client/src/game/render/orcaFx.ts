// 오르카 기술 효과 — 시원하게 뻥 뚫리는 물주먹 (하늘색 물보라 · 흰 거품 · 무지개)
// 물보라 잽 · 소용돌이 훅 · 물기둥 · 상어 물기 · 상어 터짐 · 해방 준비 · 범고래 돌파 시작 · 큰 파도
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { droplets, waterArc } from "./thorkenFx";
import { bubbles, caustic, glints, rainbow, rays } from "./seaLight";
import { OC_AQUA, OC_DEEP, OC_FOAM, spiral } from "./orcaArt";

const OC_FX = new Set(["ocSpray", "ocWhirl", "ocGeyser", "ocBite", "ocBurst", "ocReady", "ocBreach", "ocWave"]);

/** 부채꼴로 뻗는 물줄기 (a 방향 · reach 길이 · spread 퍼짐 · n 줄기) */
function jets(ctx: Ctx, x: number, y: number, a: number, reach: number, f: number, seed: number, n: number, spread: number): void {
  const k = easeOut(Math.min(1, f / 0.4));
  const fade = f < 0.4 ? 1 : 1 - (f - 0.4) / 0.6;
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const b = a + (i / (n - 1) - 0.5) * spread + (rnd(seed, i) - 0.5) * 0.15;
      const len = reach * (0.75 + rnd(i, seed) * 0.3);
      const head = len * k;
      const tail = Math.max(0, head - len * 0.6);
      ctx.strokeStyle = alpha(i % 2 ? OC_AQUA : OC_FOAM, 0.85 * fade);
      ctx.lineWidth = i % 2 ? 2.4 : 1.4;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(b) * tail, y + Math.sin(b) * tail);
      ctx.lineTo(x + Math.cos(b) * head, y + Math.sin(b) * head);
      ctx.stroke();
      ctx.fillStyle = alpha(OC_FOAM, fade);
      ctx.fillRect(Math.round(x + Math.cos(b) * head) - 1, Math.round(y + Math.sin(b) * head) - 1, 3, 3);
    }
    ctx.lineCap = "butt";
  });
}

export function drawOrcaFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!OC_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.5 ? 1 : 1 - (f - 0.5) / 0.5;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const seed = fx.x * 7 + fx.y * 3;
  const r = fx.size;
  switch (fx.kind) {
    case "ocSpray":
      // 넓은 물보라: 큰 초승달 물결 + 부채꼴 물줄기 + 물방울
      additive(ctx, () => {
        crescent(ctx, x, y, r * (0.45 + easeOut(f) * 0.6), a, 1.35, 9, OC_DEEP, 0.55 * fade);
        crescent(ctx, x, y, r * (0.5 + easeOut(f) * 0.55), a, 1.25, 5, OC_AQUA, 0.9 * fade);
        glow(ctx, x + fx.dirX * 10, y + fx.dirY * 10, 16, OC_FOAM, 0.6 * (1 - f), 1.2);
      });
      jets(ctx, x, y, a, r * 1.05, f, seed, 9, 2.6);
      droplets(ctx, x + fx.dirX * r * 0.6, y + fx.dirY * r * 0.6, r * 0.6, f, seed, 10);
      return true;
    case "ocWhirl":
      // 소용돌이: 돌아가는 물 띠 두 겹 + 안쪽 소용돌이 팔 + 밖으로 튀는 물방울
      additive(ctx, () => {
        const spin = f * 9;
        waterArc(ctx, x, y, r * (0.7 + f * 0.3), spin, spin + 2.6, 5, fade);
        waterArc(ctx, x, y, r * (0.75 + f * 0.3), spin + Math.PI, spin + Math.PI + 2.6, 5, fade);
        shock(ctx, x, y, r * (0.4 + easeOut(f) * 0.7), OC_AQUA, 0.6 * fade, 4);
      });
      spiral(ctx, x, y, r * 0.8, -f * 8, 4, 0.7 * fade);
      droplets(ctx, x, y, r * 1.2, f, seed, 14);
      return true;
    case "ocGeyser": {
      // 물기둥: 바닥 물보라 고리 → 위로 솟는 기둥 → 꼭대기 거품 · 떨어지는 물방울
      const h = 58 * easeOut(Math.min(1, f / 0.45)) * (f > 0.7 ? 1 - (f - 0.7) / 0.3 : 1);
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.5 + easeOut(f) * 0.8), OC_AQUA, 0.7 * fade, 4);
        const g = ctx.createLinearGradient(x, y, x, y - h);
        g.addColorStop(0, alpha(OC_DEEP, 0.7 * fade));
        g.addColorStop(0.5, alpha(OC_AQUA, 0.85 * fade));
        g.addColorStop(1, alpha(OC_FOAM, 0.95 * fade));
        ctx.fillStyle = g;
        const w = r * 0.55;
        ctx.beginPath();
        ctx.moveTo(x - w, y);
        ctx.quadraticCurveTo(x - w * 0.5, y - h * 0.6, x - w * 0.35, y - h);
        ctx.lineTo(x + w * 0.35, y - h);
        ctx.quadraticCurveTo(x + w * 0.5, y - h * 0.6, x + w, y);
        ctx.closePath();
        ctx.fill();
        glow(ctx, x, y - h, w * 1.3, OC_FOAM, 0.8 * fade, 1);
      });
      droplets(ctx, x, y - h * 0.8, r, f, seed, 12);
      if (f > 0.3 && f < 0.8) rainbow(ctx, x, y - h * 0.5, r * 0.9, 0.35 * fade);
      return true;
    }
    case "ocBite":
      // 상어 물기: 위·아래 이빨 초승달이 딱 닫힘 + 하얀 튐
      additive(ctx, () => {
        const close = easeOut(Math.min(1, f / 0.35));
        crescent(ctx, x, y - (1 - close) * 8, r * 0.8, -Math.PI / 2, 1.2, 4, OC_FOAM, fade);
        crescent(ctx, x, y + (1 - close) * 8, r * 0.8, Math.PI / 2, 1.2, 4, OC_FOAM, fade);
        glow(ctx, x, y, r, OC_AQUA, 0.6 * fade, 1);
      });
      sparks(ctx, x, y, 7, r * 1.4, f, OC_FOAM, seed, fade);
      return true;
    case "ocBurst":
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.3 + easeOut(f)), OC_AQUA, 0.8 * fade, 5);
        shock(ctx, x, y, r * (0.15 + easeOut(f) * 0.7), OC_FOAM, 0.6 * fade, 2);
        glow(ctx, x, y, r * 0.9, OC_AQUA, 0.6 * (1 - f), 1.2);
      });
      droplets(ctx, x, y, r * 1.1, f, seed, 14);
      bubbles(ctx, x, y, r * 0.7, f, seed, 6, fade);
      if (f < 0.6) rainbow(ctx, x, y - 4, r * 0.8, 0.35 * (1 - f / 0.6));
      return true;
    case "ocReady":
      // 해방 준비: 솟구치는 물빛 고리 + 빛줄기
      additive(ctx, () => {
        shock(ctx, x, y - f * 10, r * (0.4 + easeOut(f)), OC_AQUA, 0.8 * fade, 3);
        rays(ctx, x, y - 4, r * 1.3 * easeOut(f), 8, 0.5 * fade, seed, OC_FOAM, f * 2);
      });
      glints(ctx, x, y - 6, r, 4, Math.round(f * 30), seed, OC_FOAM, fade);
      return true;
    case "ocBreach":
      // 돌파 시작: 뒤로 터지는 물보라 + 위로 솟는 물방울
      if (f > 0.4) return true;
      additive(ctx, () => {
        shock(ctx, x, y, 14 + easeOut(f / 0.4) * 34, OC_FOAM, 0.9 * (1 - f / 0.4), 4);
        glow(ctx, x, y, 30, OC_AQUA, 0.7 * (1 - f / 0.4), 1);
      });
      jets(ctx, x, y, a + Math.PI, 40, f / 0.4, seed, 7, 1.8);
      return true;
    case "ocWave":
      // 큰 파도: 두꺼운 물 고리 세 겹 + 물결 빛무늬 + 큰 물보라 + 무지개
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.25 + easeOut(f) * 0.85), OC_DEEP, 0.7 * fade, 14);
        shock(ctx, x, y, r * (0.2 + easeOut(f) * 0.8), OC_AQUA, 0.9 * fade, 8);
        shock(ctx, x, y, r * (0.1 + easeOut(f) * 0.6), OC_FOAM, 0.7 * fade, 3);
        if (f < 0.25) glow(ctx, x, y, r * 0.7, OC_FOAM, 1 - f * 4, 1.5);
      });
      caustic(ctx, x, y, r * 0.8, Math.round(f * 40), 0.6 * fade);
      droplets(ctx, x, y, r * 1.2, f, seed, 22);
      bubbles(ctx, x, y, r * 0.8, f, seed, 10, fade);
      if (f > 0.15 && f < 0.85) rainbow(ctx, x, y - 6, r * 0.75, 0.5 * fade);
      return true;
  }
  return false;
}
