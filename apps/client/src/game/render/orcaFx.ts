// 오르카 기술 효과 — 시원하게 뻥 뚫리는 물주먹 (짙은 바다 · 하늘색 물빛 · 흰 거품, 해방은 흰 노랑 번개)
// 물 주먹 파동 · 소용돌이 · 웅장한 물기둥 · 상어 물기 · 상어 터짐 · 해방 준비 · 범고래 돌파 · 큰 파도 · 해방 · 추가타 물기 · 번개 대시
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { bolt, droplets, VOLT, waterArc } from "./thorkenFx";
import { crown } from "./tailArt";
import { bubbles, caustic, glints, rays } from "./seaLight";
import { grandGeyser, OC_AQUA, OC_DEEP, OC_FOAM, spiral } from "./orcaArt";

const OC_FX = new Set(["ocSpray", "ocWhirl", "ocGeyser", "ocBite", "ocBurst", "ocReady", "ocBreach", "ocWave", "ocFree", "ocDart", "ocBolt"]);

/** 앞으로 뻗는 물 주먹 파동 (a 방향 · 반각 arc · 앞머리 d · 두께 th) : 짙은 물 부채꼴 + 흰 거품 앞머리 */
function punchWave(ctx: Ctx, x: number, y: number, a: number, arc: number, d: number, th: number, al: number): void {
  additive(ctx, () => {
    const g = ctx.createRadialGradient(x, y, Math.max(0, d - th * 3.5), x, y, d);
    g.addColorStop(0, alpha(OC_DEEP, 0));
    g.addColorStop(0.4, alpha(OC_DEEP, 0.6 * al));
    g.addColorStop(0.8, alpha(OC_AQUA, 0.95 * al));
    g.addColorStop(1, alpha(OC_FOAM, al));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, d, a - arc, a + arc);
    ctx.arc(x, y, Math.max(0, d - th * 3.5), a + arc, a - arc, true);
    ctx.closePath();
    ctx.fill();
    crescent(ctx, x, y, d + 1, a, arc * 0.95, th, OC_FOAM, al);
  });
}

/** 빠르게 뻗는 물살 줄 (속도선) */
function streaks(ctx: Ctx, x: number, y: number, a: number, arc: number, r0: number, r1: number, seed: number, n: number, al: number): void {
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const b = a + (rnd(seed, i) - 0.5) * arc * 2;
      const u = rnd(i, seed);
      ctx.strokeStyle = alpha(i % 3 ? OC_AQUA : OC_FOAM, al * (0.5 + u * 0.5));
      ctx.lineWidth = i % 3 ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(b) * r0 * (0.7 + u * 0.3), y + Math.sin(b) * r0 * (0.7 + u * 0.3));
      ctx.lineTo(x + Math.cos(b) * r1, y + Math.sin(b) * r1);
      ctx.stroke();
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
    case "ocSpray": {
      // 물 주먹 파동: 주먹 끝 번쩍 → 물 부채꼴이 앞으로 뻗어 나감 → 앞머리에서 물보라
      const k = easeOut(Math.min(1, f / 0.55));
      const fistX = x + fx.dirX * 12;
      const fistY = y + fx.dirY * 12;
      if (f < 0.3) additive(ctx, () => {
        glow(ctx, fistX, fistY, 18, OC_FOAM, 1 - f / 0.3, 1.5);
        rays(ctx, fistX, fistY, 16, 6, 1 - f / 0.3, seed, OC_FOAM, a);
      });
      punchWave(ctx, x, y, a, 0.8, 10 + (r - 10) * k, 6 + (1 - f) * 4, fade);
      if (k > 0.4) punchWave(ctx, x, y, a, 0.6, (10 + (r - 10) * k) * 0.7, 3, fade * 0.6);
      if (f < 0.6) streaks(ctx, x, y, a, 0.6, r * 0.2, r * (0.3 + k * 0.6), seed, 10, 1 - f / 0.6);
      droplets(ctx, x + fx.dirX * r * k * 0.9, y + fx.dirY * r * k * 0.9, r * 0.45, f, seed, 9);
      return true;
    }
    case "ocWhirl": {
      // 소용돌이 훅: 물 띠가 한 바퀴 넘게 휘감고 · 안쪽 소용돌이 팔과 빨려 드는 물살
      const head = a + easeOut(f) * Math.PI * 2.4;
      additive(ctx, () => {
        waterArc(ctx, x, y, r * 0.85, head - 3, head, 6, fade);
        waterArc(ctx, x, y, r * 0.6, head + Math.PI - 2.2, head + Math.PI, 4, fade * 0.8);
        glow(ctx, x, y, r, OC_DEEP, 0.35 * fade);
      });
      spiral(ctx, x, y, r * 0.95, -f * 10, 4, 0.75 * fade);
      if (f < 0.7) streaks(ctx, x, y, a + f * 6, Math.PI, r * (1.1 - f), r * (0.6 - f * 0.4), seed, 12, 0.8 * (1 - f / 0.7));
      return true;
    }
    case "ocGeyser": {
      // 웅장한 물기둥: 땅이 부풀고 → 굵은 기둥이 치솟고 → 무너지며 물이 쏟아짐
      const s = r / 28;
      if (f < 0.15) {
        const k = f / 0.15;
        additive(ctx, () => {
          shock(ctx, x, y, r * (0.4 + k * 0.6), OC_DEEP, 0.8, 5);
          glow(ctx, x, y, r, OC_AQUA, 0.5 * k, 0.5);
        });
        bubbles(ctx, x, y - 2, r * 0.7, k, seed, 7, 1);
        return true;
      }
      const g = (f - 0.15) / 0.85;
      const rise = easeOut(Math.min(1, g / 0.3));
      const fall = g > 0.65 ? (g - 0.65) / 0.35 : 0;
      const h = 84 * s * rise * (1 - fall * 0.7);
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.7 + easeOut(g) * 0.9), OC_AQUA, 0.8 * (1 - g), 6);
        shock(ctx, x, y, r * (0.4 + easeOut(g) * 0.5), OC_FOAM, 0.6 * (1 - g), 2);
      });
      grandGeyser(ctx, x, y, r * 0.75 * (1 + fall * 0.4), h, 1 - fall * 0.8, Math.round(f * 60), seed);
      crown(ctx, x, y, r * 1.1, Math.min(1, g * 1.3), seed, 13);
      if (fall > 0) droplets(ctx, x, y - h * 0.6, r * 1.4, fall, seed, 18);
      return true;
    }
    case "ocBite": {
      // 상어 물기: 위·아래 흰 이빨 줄이 딱 닫힘 + 번쩍
      const close = easeOut(Math.min(1, f / 0.3));
      const gap = (1 - close) * r * 0.7;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.fillStyle = alpha(OC_FOAM, fade);
      for (const sg of [-1, 1]) {
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.moveTo(i * 4 - 2, sg * (gap + 6));
          ctx.lineTo(i * 4 + 2, sg * (gap + 6));
          ctx.lineTo(i * 4, sg * (gap + 1));
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
      additive(ctx, () => glow(ctx, x, y, r, OC_AQUA, 0.7 * fade, close > 0.9 ? 1.2 : 0.3));
      if (f > 0.25) sparks(ctx, x, y, 8, r * 1.5, (f - 0.25) / 0.75, OC_FOAM, seed, fade);
      return true;
    }
    case "ocBurst":
      // 상어 터짐: 물 고리 + 솟는 물보라 왕관 + 물방울
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.3 + easeOut(f)), OC_AQUA, 0.85 * fade, 6);
        shock(ctx, x, y, r * (0.15 + easeOut(f) * 0.7), OC_FOAM, 0.6 * fade, 2);
        if (f < 0.3) glow(ctx, x, y, r, OC_FOAM, 1 - f / 0.3, 1.3);
      });
      crown(ctx, x, y, r * 0.9, f, seed, 11);
      droplets(ctx, x, y, r * 1.1, f, seed, 14);
      bubbles(ctx, x, y, r * 0.7, f, seed, 6, fade);
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
      // 돌파 시작: 바닥을 박차는 물보라 왕관 + 뒤로 터지는 물살
      if (f > 0.45) return true;
      additive(ctx, () => {
        shock(ctx, x, y, 14 + easeOut(f / 0.45) * 40, OC_FOAM, 0.9 * (1 - f / 0.45), 5);
        glow(ctx, x, y, 34, OC_AQUA, 0.7 * (1 - f / 0.45), 1);
      });
      crown(ctx, x, y, 30, f / 0.45, seed, 13);
      streaks(ctx, x, y, a + Math.PI, 0.7, 8, 50 * easeOut(f / 0.45), seed, 9, 1 - f / 0.45);
      return true;
    case "ocWave":
      // 큰 파도: 바닥을 쓸고 나가는 두꺼운 물 고리 셋 + 솟구치는 물 벽 + 물결 빛무늬 + 물보라
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.25 + easeOut(f) * 0.9), OC_DEEP, 0.75 * fade, 18);
        shock(ctx, x, y, r * (0.2 + easeOut(f) * 0.85), OC_AQUA, 0.9 * fade, 9);
        shock(ctx, x, y, r * (0.1 + easeOut(f) * 0.65), OC_FOAM, 0.7 * fade, 3);
        if (f < 0.2) glow(ctx, x, y, r * 0.8, OC_FOAM, 1 - f * 5, 1.5);
      });
      crown(ctx, x, y, r * (0.4 + easeOut(f) * 0.7), f, seed, 22);
      caustic(ctx, x, y, r * 0.8, Math.round(f * 40), 0.6 * fade);
      droplets(ctx, x, y, r * 1.3, f, seed, 24);
      bubbles(ctx, x, y, r * 0.8, f, seed, 10, fade);
      return true;
    case "ocFree": {
      // 해방: 하늘로 치솟는 빛기둥 + 사방으로 뻗는 번개 + 노랑·물빛 고리
      const k = easeOut(Math.min(1, f / 0.4));
      additive(ctx, () => {
        for (const [w, c, al] of [[18, OC_AQUA, 0.35], [9, OC_FOAM, 0.55], [3, "#ffffff", 0.9]] as const) {
          const g = ctx.createLinearGradient(x, y, x, y - 120 * k);
          g.addColorStop(0, alpha(c, al * fade));
          g.addColorStop(1, alpha(c, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(x, y - 60 * k, w * (1 - f * 0.5), 60 * k, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        shock(ctx, x, y, r * (0.3 + k * 1.2), VOLT, 0.8 * fade, 3);
        shock(ctx, x, y, r * (0.2 + k), OC_AQUA, 0.8 * fade, 6);
      });
      if (f < 0.6) for (let i = 0; i < 6; i++) {
        const b = (i / 6) * Math.PI * 2 + seed;
        bolt(ctx, x, y - 4, x + Math.cos(b) * r * 1.4 * k, y + Math.sin(b) * r * k, (seed + i) * 3 + Math.floor(f * 8), 1 - f / 0.6, 1.6);
      }
      return true;
    }
    case "ocDart":
      // 추가타 물 상어 물기: 작은 물기 + 물보라
      additive(ctx, () => crescent(ctx, x, y, r * (0.5 + f * 0.5), a, 1.2, 3, OC_FOAM, fade));
      droplets(ctx, x, y, r, f, seed, 7);
      return true;
    case "ocBolt": {
      // 번개 대시: 지나간 자리에 번개 줄기 세 겹 · 양 끝 번쩍 (출발 표시는 짧은 번쩍만)
      if (r <= 0) {
        additive(ctx, () => glow(ctx, x, y, 16, VOLT, 1 - f, 1.5));
        return true;
      }
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const flick = Math.floor(f * 10);
      additive(ctx, () => {
        ctx.strokeStyle = alpha(OC_AQUA, 0.35 * fade);
        ctx.lineWidth = r * 1.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, y - 4);
        ctx.lineTo(tx, ty - 4);
        ctx.stroke();
        ctx.lineCap = "butt";
      });
      for (let i = 0; i < 3; i++) bolt(ctx, x, y - 4, tx, ty - 4, seed + i * 13 + flick, fade * (i ? 0.7 : 1), i ? 1.4 : 2.6);
      if (f < 0.4) additive(ctx, () => {
        glow(ctx, tx, ty - 4, 20, VOLT, 1 - f / 0.4, 1.4);
        glow(ctx, x, y - 4, 14, VOLT, 0.7 * (1 - f / 0.4), 1);
      });
      sparks(ctx, tx, ty - 4, 8, 22, f, VOLT, seed, fade);
      return true;
    }
  }
  return false;
}
