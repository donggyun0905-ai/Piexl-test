// 리바이어 기술 효과 — 속이 뻥 뚫리는 바다 느낌 (맑은 하늘색 물살 · 흰 거품 · 푸른 고래)
// 1타 창 휘두르기 · 고래 날개 쓸기 · 2타 회전 · 고래 한 바퀴 · 대돌격 출발 · 3타 충격파 · 고래 도약 · 번개 · 노래 · 물뿜기 · 산호 터짐
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { bolt, droplets } from "./thorkenFx";
import { bubbles, caustic, glint, glints, rainbow, rays } from "./seaLight";
import { CYAN, FOAM, SEA, spearShape, whaleShape } from "./leviaWhale";

const TAU = Math.PI * 2;
const LV_FX = new Set(["lvSwing", "lvFin", "lvSpin", "lvOrbit", "lvCharge", "lvQuake", "lvBreach", "lvBolt", "lvSong", "lvGush", "lvBurst"]);

/** 휘두르는 창 (face 쪽을 가운데로 half만큼 양옆, k = 0~1 진행): 물살 초승달 + 잔상 + 창 */
function spearSweep(ctx: Ctx, x: number, y: number, face: number, half: number, k: number, reach: number, fade: number): void {
  const at = (u: number) => face - half + half * 2 * u;
  additive(ctx, () => {
    const span = Math.abs(at(k) - at(0)) / 2;
    if (span > 0.05) {
      crescent(ctx, x, y, reach, (at(0) + at(k)) / 2, span, 10, CYAN, 0.75 * fade);
      crescent(ctx, x, y, reach * 0.8, (at(0) + at(k)) / 2, span, 4, FOAM, 0.6 * fade);
    }
  });
  // 지나간 자리에 흩어지는 반짝임
  for (let i = 0; i < 6; i++) {
    const u = k * (i / 6);
    const a = at(u);
    glint(ctx, x + Math.cos(a) * reach * (0.9 + (i % 2) * 0.12), y + Math.sin(a) * reach * (0.9 + (i % 2) * 0.12), 2 + (i % 3), FOAM, fade * (0.4 + u * 0.6));
  }
  for (let i = 3; i >= 1; i--) spearShape(ctx, x, y, at(Math.max(0, k - i * 0.08)), reach, 0.15 * (4 - i) * fade);
  spearShape(ctx, x, y, at(k), reach, fade);
}

/** 고래가 몸을 돌며 지나감 (가운데 x·y, 반지름 r, 각 a0 → a1, k = 진행) · 지나간 길에 물 띠 */
function whaleArc(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, k: number, fade: number, tick: number): void {
  const a = a0 + (a1 - a0) * k;
  const dir = a1 > a0 ? 1 : -1;
  additive(ctx, () => {
    const span = Math.abs(a - a0) / 2;
    if (span > 0.05) {
      crescent(ctx, x, y, r, (a + a0) / 2, span, 16, SEA, 0.45 * fade);
      crescent(ctx, x, y, r, (a + a0) / 2, span, 6, CYAN, 0.7 * fade);
    }
  });
  const wx = x + Math.cos(a) * r;
  const wy = y + Math.sin(a) * r;
  whaleShape(ctx, wx, wy, a + (dir * Math.PI) / 2, Math.max(26, r * 0.9), fade, tick);
  droplets(ctx, wx, wy, r * 0.35, k, tick, 8);
  bubbles(ctx, wx, wy, r * 0.4, k, tick, 5, fade);
  glints(ctx, wx, wy, r * 0.5, 4, tick, 3, FOAM, fade);
}

export function drawLeviaFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!LV_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.6 ? 1 : 1 - (f - 0.6) / 0.4;
  const x = snap(fx.x);
  const y = snap(fx.y) - 3;
  const face = Math.atan2(fx.dirY, fx.dirX);
  const seed = fx.x * 7 + fx.y * 3;
  const tick = fx.maxTicks - fx.ticks;
  switch (fx.kind) {
    case "lvSwing":
      spearSweep(ctx, x, y, face, 1.4, easeOut(Math.min(1, f / 0.5)), fx.size, fade);
      droplets(ctx, x + fx.dirX * fx.size * 0.8, y + fx.dirY * fx.size * 0.8, fx.size * 0.5, f, seed, 8);
      return true;
    case "lvFin":
      // 고래가 앞쪽을 크게 날개로 쓸고 지나감
      whaleArc(ctx, x, y, fx.size * 0.72, face - 1.9, face + 1.9, easeOut(Math.min(1, f / 0.7)), fade, tick);
      return true;
    case "lvSpin":
      spearSweep(ctx, x, y, face + Math.PI, Math.PI, easeOut(Math.min(1, f / 0.55)), fx.size, fade);
      additive(ctx, () => shock(ctx, x, y, fx.size * easeOut(f), CYAN, 0.6 * fade, 4));
      return true;
    case "lvOrbit":
      // 고래가 몸을 감아 나를 한 바퀴
      whaleArc(ctx, x, y, fx.size * 0.7, face, face + TAU, easeOut(Math.min(1, f / 0.75)), fade, tick);
      additive(ctx, () => shock(ctx, x, y, fx.size * easeOut(f), FOAM, 0.5 * fade, 3));
      return true;
    case "lvCharge":
      // 대돌격 출발: 앞으로 터지는 물보라 + 물빛 고리
      additive(ctx, () => {
        glow(ctx, x + fx.dirX * 10, y + fx.dirY * 10, fx.size * 2, CYAN, 0.8 * (1 - f), 1);
        shock(ctx, x, y, fx.size * 2.4 * easeOut(f), SEA, 0.8 * (1 - f), 6);
      });
      droplets(ctx, x + fx.dirX * 14, y + fx.dirY * 14, fx.size * 1.5, f, seed, 14);
      rays(ctx, x + fx.dirX * 10, y + fx.dirY * 10, fx.size * 3 * easeOut(f), 10, 0.55 * (1 - f), seed, CYAN, f * 0.5);
      return true;
    case "lvQuake": {
      // 부채꼴 충격파: 겹겹이 퍼지는 물의 벽 + 흰 거품 줄
      const half = Math.acos(Math.max(-1, Math.min(1, fx.arc ?? 0.35)));
      const c = fx.tint === "abyss" ? "#3a5aff" : CYAN;
      if (f < 0.35) additive(ctx, () => glow(ctx, x, y, fx.size * 0.6, c, 1 - f / 0.35, 1));
      rays(ctx, x, y, fx.size * 1.1 * easeOut(f), 8, 0.3 * (1 - f), seed, c, face);
      additive(ctx, () => {
        for (let k = 0; k < 3; k++) {
          const u = easeOut(Math.min(1, f * 1.3 + k * 0.12));
          crescent(ctx, x, y, fx.size * u * (0.75 + k * 0.15), face, half, 12 - k * 3, k === 1 ? FOAM : c, 0.8 * (1 - f));
        }
      });
      for (let k = 0; k < 16; k++) {
        const a = face - half + (k / 15) * half * 2;
        const d = fx.size * easeOut(f) * (0.85 + rnd(seed, k) * 0.25);
        ctx.fillStyle = alpha(k % 2 ? FOAM : CYAN, 1 - f);
        ctx.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d - Math.sin(f * Math.PI) * 6), 2, 2);
        if (k % 4 === 0) glint(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, 4 * (1 - f), FOAM, 1 - f);
      }
      return true;
    }
    case "lvBreach": {
      // 고래 도약: 땅에서 물기둥과 함께 솟구쳐 → 공중에서 몸을 뒤집어 → 내리꽂히며 큰 물보라
      const up = Math.sin(Math.min(1, f / 0.75) * Math.PI);
      const wy = y - up * 64;
      const ang = -Math.PI / 2 + Math.min(1, f / 0.75) * Math.PI * (fx.dirX >= 0 ? 1 : -1);
      additive(ctx, () => {
        shock(ctx, x, y, fx.size * easeOut(f), CYAN, 0.9 * (1 - f), 8);
        glow(ctx, x, y, fx.size * 0.8, SEA, 0.6 * (1 - f), 0.6);
      });
      // 바다에서 솟는 빛기둥 · 바닥 물빛 무늬 · 하늘로 퍼지는 빛줄기
      additive(ctx, () => {
        const g = ctx.createLinearGradient(x, y, x, y - 110);
        g.addColorStop(0, alpha(CYAN, 0.55 * up));
        g.addColorStop(1, alpha(CYAN, 0));
        ctx.fillStyle = g;
        ctx.fillRect(x - fx.size * 0.25, y - 110, fx.size * 0.5, 110);
      });
      caustic(ctx, x, y, fx.size * 0.9, tick, 0.6 * (1 - f));
      rays(ctx, x, wy, 46 * up, 12, 0.45 * up, seed, FOAM, tick * 0.03);
      if (f < 0.85) whaleShape(ctx, x, wy, ang, 54, f < 0.75 ? 1 : 1 - (f - 0.75) / 0.1, tick);
      // 내리꽂힌 뒤 물보라에 걸린 무지개
      if (f > 0.6) rainbow(ctx, x, y - 8, fx.size * 0.9, Math.sin(((f - 0.6) / 0.4) * Math.PI));
      droplets(ctx, x, y, fx.size, f, seed, 22);
      if (f > 0.7) droplets(ctx, x, y, fx.size * 1.3, (f - 0.7) / 0.3, seed + 9, 18);
      return true;
    }
    case "lvBolt":
      if (f < 0.5) bolt(ctx, x + (rnd(seed, 1) - 0.5) * 24, y - 130, x, y, seed, 1 - f * 1.8, 3);
      additive(ctx, () => glow(ctx, x, y, fx.size * 2, "#fff27a", 1 - f, 1));
      sparks(ctx, x, y, 8, fx.size * 2, f, "#fff27a", seed);
      glint(ctx, x, y, 10 * (1 - f), "#fff27a", 1 - f);
      return true;
    case "lvSong":
      // 고래의 노래: 퍼지는 음파 고리 셋 + 작은 음표
      additive(ctx, () => {
        for (let k = 0; k < 3; k++) shock(ctx, x, y, fx.size * easeOut(Math.min(1, f * 1.2 + k * 0.18)), k === 1 ? FOAM : "#8ab8ff", 0.7 * (1 - f), 3);
      });
      glints(ctx, x, y, fx.size * easeOut(f), 6, tick, seed, "#c8d8ff", 1 - f);
      ctx.fillStyle = alpha(FOAM, 1 - f);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * TAU + f;
        const nx = Math.round(x + Math.cos(a) * fx.size * 0.6 * easeOut(f));
        const ny = Math.round(y + Math.sin(a) * fx.size * 0.4 * easeOut(f) - f * 10);
        ctx.fillRect(nx, ny, 2, 2);
        ctx.fillRect(nx + 1, ny - 4, 1, 4);
      }
      return true;
    case "lvGush": {
      // 물뿜기: 내 자리에서 솟는 물기둥 + 흩어지는 물방울
      const h = 60 * easeOut(Math.min(1, f * 2.5));
      const w = 8 * (1 - f * 0.4);
      const g = ctx.createLinearGradient(x, y, x, y - h);
      g.addColorStop(0, alpha(SEA, 0.8 * (1 - f)));
      g.addColorStop(1, alpha(FOAM, 0.9 * (1 - f)));
      ctx.fillStyle = g;
      ctx.fillRect(x - w / 2, y - h, w, h);
      droplets(ctx, x, y - h, fx.size * 0.7, f, seed, 16);
      rainbow(ctx, x, y - h * 0.6, fx.size * 0.6, 0.8 * Math.sin(f * Math.PI));
      glints(ctx, x, y - h, fx.size * 0.6, 5, tick, seed, FOAM, 1 - f);
      additive(ctx, () => shock(ctx, x, y, fx.size * easeOut(f), CYAN, 0.7 * (1 - f), 5));
      return true;
    }
    case "lvBurst":
      // 산호 터짐: 분홍 산호 조각 + 물보라 고리
      additive(ctx, () => {
        glow(ctx, x, y, fx.size, "#ff9aaa", 0.7 * (1 - f), 1);
        shock(ctx, x, y, fx.size * easeOut(f), CYAN, 0.9 * (1 - f), 8);
      });
      sparks(ctx, x, y, 10, fx.size, f, "#ff8a9a", seed);
      rays(ctx, x, y, fx.size * 1.2 * easeOut(f), 9, 0.5 * (1 - f), seed, "#ffb0c0");
      droplets(ctx, x, y, fx.size, f, seed, 16);
      return true;
  }
  return false;
}

