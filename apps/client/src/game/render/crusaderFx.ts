// 크루세이더 효과 — 무겁고 두껍고 단단하게: 흰 돌·금빛·흙먼지 (조각은 render/crusaderBits)
// 내려찍기 (번쩍임 · 패인 땅 · 십자 낙인 · 두꺼운 흙먼지 고리 · 돌 파편) · 균열 돌판 (마디마다 솟았다 가라앉음) · 돌기둥 · 여진
// 심판의 십자가 착지 (빛기둥 · 꽂힌 십자가가 흔들리다 남음) · 성묘 정화 · 성벽 돌진·들이받기·벽 충돌 · 가시 면류관 · 거인의 발걸음 · 성십자가 강림
import type { EffectState } from "@pixel-rogue/shared";
import { brand, CR, crater, crossSprite, debris, dust, dustRing, hash, lightPillar, slabSprite } from "./crusaderBits";
import { additive, alpha, easeOut, glow, shock, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

/** crLiftFx (들어 올림)는 소리용 · 그림은 render/crusaderBody의 찍을 자리 예고 */
const CR_FX = new Set(["crLiftFx", "crSlamFx", "crSpikeFx", "crPillarFx", "crAfterFx", "crJudgeFx", "crGraveFx", "crRamFx", "crRamEndFx", "crWallFx", "crThornFx", "crStepFx", "crAwakeFx"]);

/** 무거운 착지 한 번 (번쩍임 · 패인 땅 · 흙먼지 · 충격파 · 파편): 내려찍기·여진·심판·강림이 같이 씀 */
function impact(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, power: number, flash = true): void {
  const al = 1 - f;
  crater(ctx, x, y, r * 0.85, 1 - f * f, seed, 6 + Math.round(power * 2));
  if (flash && f < 0.2) additive(ctx, () => glow(ctx, x, y - 2, r * (0.7 + power * 0.2), CR.light, (1 - f / 0.2) * 0.95, 0.85));
  dustRing(ctx, x, y, r * 1.15, f, 4 + power * 3);
  dust(ctx, x, y, r * 0.9, f, seed, 6 + power * 3, 0.5 + power * 0.1);
  additive(ctx, () => shock(ctx, x, y, r * easeOut(Math.min(1, f * 1.5)), CR.gold, al, 2 + power));
  debris(ctx, x, y - 2, 5 + power * 3, r * (0.9 + power * 0.2), f, seed, 1 + power * 0.25);
}

export function drawCrusaderFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!CR_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const al = 1 - f;
  const seed = Math.round(fx.x * 13 + fx.y * 7);
  const r = fx.size;
  if (fx.kind === "crSlamFx") {
    // 십자가 내리찍기: 땅에 십자 낙인이 번쩍 새겨지고 패임
    impact(ctx, x, y, r, f, seed, fx.width ? 1 : 2);
    brand(ctx, x, y, fx.dirX, fx.dirY, r, (1 - f) ** 2, fx.width ? 2 : 3);
  } else if (fx.kind === "crSpikeFx" || fx.kind === "crPillarFx") {
    // 균열 마디: 앞 마디에서 갈라져 온 금 · 돌판이 쿵 솟았다가 가라앉음
    const big = fx.kind === "crPillarFx";
    const len = r * (big ? 1.1 : 1.7);
    const bx = x - fx.dirX * len;
    const by = y - fx.dirY * len;
    ctx.strokeStyle = alpha(CR.dark, 0.8 * al);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(x, y);
    ctx.stroke();
    additive(ctx, () => {
      ctx.strokeStyle = alpha(CR.gold, 0.8 * al);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(x, y);
      ctx.stroke();
      if (f < 0.15) glow(ctx, x, y, r * 1.2, CR.gold, 0.8 * (1 - f / 0.15), 0.5);
    });
    const rise = f < 0.12 ? easeOut(f / 0.12) * 1.15 : f < 0.2 ? 1.15 - (f - 0.12) * 1.9 : f > 0.7 ? 1 - (f - 0.7) / 0.3 : 1;
    ctx.fillStyle = alpha(CR.dark, 0.35 * al);
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.9, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    slabSprite(ctx, x, y + 1, seed, (r / 10) * (big ? 2.4 : 1.75), rise, f > 0.8 ? (1 - f) * 5 : 1, hash(seed) > 0.5);
    dust(ctx, x, y, r * 0.8, f, seed, big ? 7 : 4, 0.5);
    debris(ctx, x, y - 2, big ? 6 : 3, r * (big ? 2.2 : 1.6), f, seed, big ? 1.2 : 0.8);
    if (big) additive(ctx, () => shock(ctx, x, y, r * 1.6 * easeOut(f), CR.gold, al, 3));
  } else if (fx.kind === "crAfterFx") {
    // 여진: 같은 자리가 다시 꺼지며 무너짐 (번쩍임 없이 흙먼지 위주)
    impact(ctx, x, y, r, f, seed + 5, 1, false);
    dust(ctx, x, y, r * 1.2, f, seed + 3, 10, 0.6);
  } else if (fx.kind === "crJudgeFx") {
    // 심판의 십자가 착지: 하늘에서 빛기둥 · 꽂힌 십자가가 흔들리다 남아 옅어짐 (width = 작은 십자가)
    const small = !!fx.width;
    const sc = r / (small ? 24 : 30);
    if (f < 0.35) lightPillar(ctx, x, y, r * (small ? 0.6 : 0.8), 220, 1 - f / 0.35);
    impact(ctx, x, y, r, f, seed, small ? 1 : 3);
    const wob = f < 0.25 ? Math.sin(f * 70) * (1 - f * 4) * 0.08 : 0;
    crossSprite(ctx, x, y + 2, sc, f > 0.7 ? (1 - f) / 0.3 : 1, 6 + f * 4, wob);
    if (f < 0.5) additive(ctx, () => glow(ctx, x, y - 20 * sc, 16 * sc, CR.gold, 0.6 * (1 - f * 2), 0.3));
  } else if (fx.kind === "crGraveFx") {
    // 성묘 정화: 금빛 고리가 퍼지고 빛 알갱이가 올라감
    additive(ctx, () => {
      shock(ctx, x, y, r * easeOut(f), CR.gold, al, 3);
      glow(ctx, x, y - 6, r * 0.5, CR.gold, 0.4 * al, 0.3);
      for (let i = 0; i < 6; i++) {
        const h = hash(seed + i);
        ctx.fillStyle = alpha(CR.light, al);
        ctx.fillRect(Math.round(x + (h - 0.5) * r * 1.4), Math.round(y - f * 26 - h * 8), 1, 2);
      }
    });
  } else if (fx.kind === "crRamFx") {
    // 성벽 돌진 시작: 뒤로 흙먼지가 터지고 앞으로 금빛 줄
    dust(ctx, x - fx.dirX * 8, y - fx.dirY * 8, 10, f, seed, 6, 0.6);
    additive(ctx, () => {
      for (let i = -1; i <= 1; i++) {
        ctx.strokeStyle = alpha(CR.gold, 0.7 * al);
        ctx.lineWidth = 2 - Math.abs(i);
        ctx.beginPath();
        ctx.moveTo(x - fx.dirY * i * 6 - fx.dirX * 20, y + fx.dirX * i * 6 - fx.dirY * 20 - 6);
        ctx.lineTo(x - fx.dirY * i * 6 + fx.dirX * 4, y + fx.dirX * i * 6 + fx.dirY * 4 - 6);
        ctx.stroke();
      }
    });
  } else if (fx.kind === "crRamEndFx" || fx.kind === "crWallFx") {
    // 들이받기 · 벽 충돌: 앞쪽으로 쏠린 흙먼지·파편 · 벽 충돌은 별 모양 금 · 큰 번쩍임
    const wall = fx.kind === "crWallFx";
    if (f < 0.2) additive(ctx, () => glow(ctx, x, y - 4, r * (wall ? 1.1 : 0.8), CR.light, 1 - f / 0.2, 0.8));
    if (wall) crater(ctx, x, y - 4, r * 1.3, al, seed, 9);
    dust(ctx, x + fx.dirX * r * 0.4, y + fx.dirY * r * 0.4, r * 0.7, f, seed, wall ? 9 : 6, 0.65);
    debris(ctx, x, y - 4, wall ? 10 : 6, r * 1.8, f, seed, 1.2, wall ? -fx.dirX : fx.dirX, wall ? -fx.dirY : fx.dirY);
    additive(ctx, () => shock(ctx, x, y, r * easeOut(f), CR.gold, al, wall ? 4 : 3));
  } else if (fx.kind === "crThornFx") {
    // 가시 면류관: 몸에서 굵은 금빛 가시가 사방으로 박힘
    const n = 12;
    const len = r * easeOut(Math.min(1, f * 2.5));
    additive(ctx, () => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + 0.2;
        const c = Math.cos(a);
        const s = Math.sin(a);
        ctx.fillStyle = alpha(i % 2 ? CR.gold : CR.light, al);
        ctx.beginPath();
        ctx.moveTo(x + c * 6 - s * 3, y - 8 + s * 6 + c * 3);
        ctx.lineTo(x + c * (6 + len), y - 8 + s * (6 + len) * 0.8);
        ctx.lineTo(x + c * 6 + s * 3, y - 8 + s * 6 - c * 3);
        ctx.fill();
      }
      glow(ctx, x, y - 8, 14, CR.gold, 0.6 * al, 0.4);
    });
  } else if (fx.kind === "crStepFx") {
    // 거인의 발걸음: 낮게 깔리는 흙먼지 고리 · 작은 금 · 자갈
    crater(ctx, x, y + 2, r * 0.45, al * 0.8, seed, 4);
    dustRing(ctx, x, y + 2, r, f, 5, 0.5);
    dust(ctx, x, y + 2, r * 0.6, f, seed, 5, 0.35);
    debris(ctx, x, y, 3, r * 0.8, f, seed, 0.8);
  } else if (fx.kind === "crAwakeFx") {
    // 성십자가 강림: 거대한 십자가가 하늘에서 몸 뒤로 내리꽂힘 → 큰 충격파 두 겹 · 빛기둥 · 금빛 고리
    const drop = Math.min(1, f / 0.2);
    const fall = (1 - drop) ** 2 * 180;
    const cx = x - fx.dirX * 6;
    const cy = y - 6;
    if (f >= 0.2) {
      const g = (f - 0.2) / 0.8;
      impact(ctx, cx, cy, r * 0.6, g, seed, 3);
      additive(ctx, () => {
        shock(ctx, x, y, r * easeOut(g), CR.gold, 1 - g, 5);
        shock(ctx, x, y, r * 1.2 * easeOut(g), CR.deep, 1 - g, 3);
      });
      if (g < 0.4) lightPillar(ctx, cx, cy, 40, 260, 1 - g / 0.4);
    } else additive(ctx, () => glow(ctx, cx, cy, 30 * drop, CR.gold, 0.5 * drop, 0.2));
    crossSprite(ctx, cx, cy - fall, 2.2, f > 0.65 ? (1 - f) / 0.35 : 1, f >= 0.2 ? 10 : 0);
  }
  return true;
}
