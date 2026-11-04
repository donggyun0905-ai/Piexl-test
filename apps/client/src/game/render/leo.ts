// 레오 그리기 (1): 효과 — 노란 뇌전 발톱 · 번개 물기 · 사자후 · 낙뢰(보석·뇌운·사자후) · 연쇄 번개 · 뇌광 도약 · 방전 · 보석 빛
// 번개 줄기·낙뢰·방전 고리는 render/leoBolt, 몸 둘레(전하·뇌인·갈기)는 render/leoAura
import type { EffectState } from "@pixel-rogue/shared";
import { arcRing, lightning, skyStrike, VOLT, VOLT_DEEP, VOLT_PALE } from "./leoBolt";
import { additive, alpha, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

const TAU = Math.PI * 2;
const GEM = "#6a9aff";
const LEO_FX = new Set(["leClaw", "leBite", "leRoar", "leBolt", "leChain", "lePounce", "leSpark", "leGem"]);

/** 가늘어지는 한 획 (가운데가 굵음): 넓은 번짐 → 노랑 → 흰 심 */
function taper(ctx: Ctx, pts: [number, number][], w: number, a: number): void {
  ctx.lineCap = "round";
  const n = pts.length - 1;
  for (const [col, k, add] of [[VOLT_DEEP, 3.2, 0.25], [VOLT, 1.6, 0.6], [VOLT, 1, 1], ["#ffffff", 0.45, 1]] as const) {
    const draw = () => {
      for (let i = 0; i < n; i++) {
        const u = (i + 0.5) / n;
        ctx.strokeStyle = col === "#ffffff" ? `rgba(255,255,255,${a})` : alpha(col, a * add);
        ctx.lineWidth = Math.max(0.6, w * k * Math.sin(u * Math.PI));
        ctx.beginPath();
        ctx.moveTo(pts[i]![0], pts[i]![1]);
        ctx.lineTo(pts[i + 1]![0], pts[i + 1]![1]);
        ctx.stroke();
      }
    };
    if (add < 1) additive(ctx, draw);
    else draw();
  }
  ctx.lineCap = "butt";
}

/** 발톱 자국 세 줄: 앞쪽을 비스듬히 가로질러 그어지며(f) 끝에 불똥·잔번개 */
function claws(ctx: Ctx, x: number, y: number, a: number, reach: number, side: number, f: number, seed: number, wide = 1): void {
  const sweep = Math.min(1, f / 0.45);
  const fade = f < 0.45 ? 1 : 1 - (f - 0.45) / 0.55;
  const dir = side ? 1 : -1;
  const nx = -Math.sin(a);
  const ny = Math.cos(a);
  for (let i = -1; i <= 1; i++) {
    const pts: [number, number][] = [];
    const steps = 12;
    for (let k = 0; k <= Math.round(steps * sweep); k++) {
      const u = k / steps;
      // 한쪽 옆에서 반대쪽 옆으로, 앞으로 볼록하게
      const t = (u - 0.5) * 2 * dir;
      const fwd = reach * (0.55 + 0.45 * (1 - t * t)) + i * 4;
      const lat = t * reach * 0.75 * wide + i * 3;
      pts.push([x + Math.cos(a) * fwd + nx * lat, y + Math.sin(a) * fwd + ny * lat]);
    }
    if (pts.length < 2) continue;
    taper(ctx, pts, 2.4 - Math.abs(i) * 0.5, fade);
    const [ex, ey] = pts.at(-1)!;
    if (f < 0.6) lightning(ctx, pts[0]![0], pts[0]![1], ex, ey, seed + i * 5 + Math.floor(f * 6), 0.8, fade * 0.5, 0);
    if (sweep >= 1) sparks(ctx, ex, ey, 4, 10, (f - 0.45) / 0.55, VOLT, seed + i, fade);
  }
}

export function drawLeoFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!LEO_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = 1 - f;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const seed = Math.round(fx.x * 7 + fx.y * 13 + fx.maxTicks);
  switch (fx.kind) {
    case "leClaw":
      claws(ctx, x, y, a, fx.size, fx.width ?? 0, f, seed);
      break;
    case "leBite": {
      // 위·아래 턱이 번개 송곳니를 드러내며 닫힘 → 섬광
      const close = easeOut(Math.min(1, f / 0.35));
      const gap = fx.size * (1 - close) + 2;
      for (const s of [-1, 1]) {
        const cx = x - Math.sin(a) * gap * s;
        const cy = y + Math.cos(a) * gap * s;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        ctx.globalAlpha = Math.min(1, fade * 1.6);
        for (let k = -2; k <= 2; k++) {
          ctx.fillStyle = k % 2 ? VOLT_PALE : "#ffffff";
          ctx.beginPath();
          ctx.moveTo(k * 4 - 2, 0);
          ctx.lineTo(k * 4 + 2, 0);
          ctx.lineTo(k * 4, -s * (5 + (k === 0 ? 0 : 2)));
          ctx.fill();
        }
        ctx.strokeStyle = alpha(VOLT, 0.9);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-11, 0);
        ctx.quadraticCurveTo(0, s * 5, 11, 0);
        ctx.stroke();
        ctx.restore();
      }
      if (close >= 1) {
        const g = (f - 0.35) / 0.65;
        additive(ctx, () => {
          glow(ctx, x, y, fx.size * 1.6, VOLT, 1 - g, 1.5);
          shock(ctx, x, y, fx.size * (0.5 + g), VOLT, 1 - g, 4);
        });
        arcRing(ctx, x, y, fx.size, 5, g, seed);
        sparks(ctx, x, y, 12, fx.size * 1.5, g, VOLT, seed, 1);
      }
      break;
    }
    case "leRoar": {
      // 사자후: 금빛이 번쩍 · 두 겹 충격파 · 파도 앞의 방전 고리 · 사방으로 뻗는 번개
      const r = fx.size * easeOut(f);
      additive(ctx, () => {
        ctx.fillStyle = alpha(VOLT, 0.16 * fade);
        ctx.fillRect(x - 400, y - 300, 800, 600);
        glow(ctx, x, y, 40 + 30 * fade, VOLT, fade, 2);
        shock(ctx, x, y, r, VOLT, fade, 14);
        shock(ctx, x, y, r * 0.7, VOLT_PALE, fade * 0.7, 8);
      });
      arcRing(ctx, x, y, r, 14, f, seed, fade);
      for (let k = 0; k < 8; k++) {
        const ang = (k / 8) * TAU + rnd(seed, k) * 0.4;
        const len = r * (0.6 + rnd(k, seed) * 0.4);
        if (f < 0.7) lightning(ctx, x + Math.cos(ang) * 10, y + Math.sin(ang) * 8, x + Math.cos(ang) * len, y + Math.sin(ang) * len * 0.75, seed + k + Math.floor(f * 8), 1.6, fade, 1);
      }
      if (fx.width) arcRing(ctx, x, y, r * 0.5, 8, f, seed + 3, fade);
      break;
    }
    case "leBolt": {
      const core = fx.tint === "gem" ? GEM : "#ffffff";
      skyStrike(ctx, x, y, fx.size, f, seed, core, fx.tint === "roar" ? 1.15 : 1);
      break;
    }
    case "leChain":
      lightning(ctx, x, y, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), seed + Math.floor(f * 7), 1.6, fade, 1);
      additive(ctx, () => glow(ctx, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), 10, VOLT, fade, 1.4));
      break;
    case "lePounce": {
      // 번개처럼 뛰어든 길(금빛 빛 꼬리 + 번개) → 내려친 자리 충격파·발톱 자국
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const steps = 10;
      const trail: [number, number][] = [];
      for (let k = 0; k <= steps; k++) trail.push([x + ((tx - x) * k) / steps, y - 4 + ((ty - y) * k) / steps]);
      taper(ctx, trail, 5 * fade, fade * 0.8);
      if (f < 0.5) lightning(ctx, x, y - 4, tx, ty - 4, seed + Math.floor(f * 8), 1.8, 1 - f * 2, 2);
      additive(ctx, () => {
        glow(ctx, tx, ty, fx.size * 1.5, VOLT, fade, 1.6);
        shock(ctx, tx, ty, fx.size * (0.4 + f * 1.2), VOLT, fade, 6);
      });
      claws(ctx, tx, ty - 3, a, fx.size * 0.8, 1, Math.min(1, f * 1.3), seed + 9, 0.8);
      sparks(ctx, tx, ty, 14, fx.size * 1.8, f, VOLT, seed, 1);
      break;
    }
    case "leSpark":
      additive(ctx, () => glow(ctx, x, y, fx.size, VOLT, 0.35 * fade));
      arcRing(ctx, x, y, fx.size * (0.7 + 0.3 * f), fx.width ? 10 : 6, f, seed + Math.floor(f * 5), fade);
      if (fx.width) additive(ctx, () => shock(ctx, x, y, fx.size * easeOut(f), VOLT, fade, 6));
      break;
    case "leGem": {
      // 이마 보석이 번쩍: 푸른 빛 + 노란 십자 섬광
      const s = 6 + 10 * easeOut(Math.min(1, f * 2));
      additive(ctx, () => {
        glow(ctx, x, y, s * 1.4, GEM, fade, 1.6);
        glow(ctx, x, y, s, VOLT, fade * 0.8);
      });
      ctx.strokeStyle = `rgba(255,255,255,${fade})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - s, y);
      ctx.lineTo(x + s, y);
      ctx.moveTo(x, y - s * 1.3);
      ctx.lineTo(x, y + s * 0.6);
      ctx.stroke();
      break;
    }
  }
  return true;
}
