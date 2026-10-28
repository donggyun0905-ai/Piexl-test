// 떠돌이 기습 · 파수꾼 반격 그림 (sim/origin)
// - 기습 준비: 발밑에 감도는 바람 두 줄 + 쇠뇌 끝 반짝임 · 기습 탄: 바람빛 꼬리를 끄는 굵은 화살 (패시브면 붉은 금빛 두 갈래 띠)
// - 기습 쏨: 쇠뇌 끝 섬광과 앞으로 터지는 바람 · 기습 맞음: 바람 고리 + 엇갈린 두 줄 베임 (패시브면 붉게 찢기는 자국과 파편)
// - 반격 준비: 몸 앞 금빛 방패 문양이 숨 쉬듯 빛나고 빛 알갱이가 올라감 · 반격 베기: 금빛 충격파 + 여덟 갈래 빛살 + 가운데 방패 섬광
import type { EffectState, ProjectileState, RunState } from "@pixel-rogue/shared";
import { additive, alpha, beam, crescent, glow, ring, shock, sparks } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
/** 떠돌이 바람빛 · 패시브 붉은 금빛 · 파수꾼 금빛 · 반격의 방패 강철빛 */
const WIND = "#7ef0d0";
const WIND_LIGHT = "#d8fff4";
const RED = "#ff5a48";
const RED_GOLD = "#ffc45a";
const GOLD = "#ffd56a";
const GOLD_LIGHT = "#fff3c8";
const STEEL = "#8fd8ff";

/** 기습·반격 준비 중 몸 둘레 */
export function drawOriginAura(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a));
  if (p.ambushTicks > 0) {
    const k = Math.min(1, p.ambushTicks / 20);
    const spin = s.tick * 0.25;
    additive(ctx, () => {
      // 발밑 바람: 서로 반대쪽을 도는 두 줄
      crescent(ctx, x, y + 3, 9, spin, 1.3, 1.5, WIND, 0.55 * k);
      crescent(ctx, x, y + 3, 7, spin + Math.PI, 1.1, 1, WIND_LIGHT, 0.45 * k);
      // 쇠뇌 끝 반짝임 (네 갈래 별)
      const tx = x + p.faceX * 8;
      const ty = y - 2 + p.faceY * 8;
      const l = 2 + 1.5 * Math.sin(s.tick * 0.5);
      glow(ctx, tx, ty, 5, WIND, 0.7 * k, 1.2);
      beam(ctx, tx - l, ty, tx + l, ty, 1, WIND_LIGHT, 0.9 * k);
      beam(ctx, tx, ty - l, tx, ty + l, 1, WIND_LIGHT, 0.9 * k);
    });
  }
  if ((p.counterTicks ?? 0) > 0) {
    const k = Math.min(1, (p.counterTicks ?? 0) / 20);
    const breathe = 0.6 + 0.4 * Math.sin(s.tick * 0.3);
    const fa = Math.atan2(p.faceY, p.faceX);
    additive(ctx, () => {
      // 몸 앞 금빛 방패 (반원 두 겹) + 몸 둘레 옅은 빛
      glow(ctx, x, y - 2, 13, GOLD, 0.35 * k * breathe);
      crescent(ctx, x, y - 2, 10, fa, 1.2, 2, GOLD, 0.8 * k * breathe);
      crescent(ctx, x, y - 2, 12, fa, 0.8, 1, GOLD_LIGHT, 0.6 * k);
      // 위로 올라가는 빛 알갱이 셋
      for (let i = 0; i < 3; i++) {
        const f = ((s.tick + i * 9) % 27) / 27;
        const px = x + Math.cos(i * 2.1 + s.tick * 0.05) * 7;
        ctx.fillStyle = alpha(GOLD_LIGHT, (1 - f) * k);
        ctx.fillRect(snap(px), snap(y + 2 - f * 14), 1, 1);
      }
    });
  }
}

/** 기습 탄 (다른 탄 그림 대신). 그렸으면 true */
export function drawAmbushShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (!pr.ambush) return false;
  const perk = pr.ambush === 2;
  const sp = Math.max(0.1, Math.hypot(pr.vx, pr.vy));
  const dx = pr.vx / sp;
  const dy = pr.vy / sp;
  const tail = 14 + sp * 2;
  const main = perk ? RED : WIND;
  additive(ctx, () => {
    // 길게 끌리는 빛 꼬리 + 머리 빛
    beam(ctx, x - dx * tail, y - dy * tail, x, y, 3, main, 0.45);
    beam(ctx, x - dx * tail * 0.6, y - dy * tail * 0.6, x, y, 1.5, perk ? RED_GOLD : WIND_LIGHT, 0.8);
    glow(ctx, x, y, perk ? 8 : 6, main, 0.85, 1.4);
    if (perk) {
      // 두 갈래 띠가 서로 감기며 따라옴
      for (const side of [1, -1]) {
        const w = Math.sin(tick * 0.6 + side) * 2.5 * side;
        beam(ctx, x - dx * tail + -dy * w, y - dy * tail + dx * w, x, y, 1, RED_GOLD, 0.6);
      }
    }
  });
  // 화살 머리 (흰 심 + 날개 두 점)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(Math.round(x - 1), Math.round(y - 1), 2, 2);
  ctx.fillStyle = perk ? RED_GOLD : WIND_LIGHT;
  ctx.fillRect(Math.round(x - dx * 3 - dy * 2), Math.round(y - dy * 3 + dx * 2), 1, 1);
  ctx.fillRect(Math.round(x - dx * 3 + dy * 2), Math.round(y - dy * 3 - dx * 2), 1, 1);
  return true;
}

/** 기습 쏨·맞음 · 반격 베기. 그렸으면 true */
export function drawOriginFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  const f = 1 - t;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const fa = Math.atan2(fx.dirY, fx.dirX);
  if (fx.kind === "ogShot") {
    const perk = fx.size === 2;
    const c = perk ? RED : WIND;
    additive(ctx, () => {
      glow(ctx, x, y, 10 + f * 6, c, t, 1.6);
      // 앞으로 퍼지는 바람 부채 (세 줄)
      for (const off of [-0.45, 0, 0.45]) {
        const d = 4 + f * 16;
        beam(ctx, x, y, x + Math.cos(fa + off) * d, y + Math.sin(fa + off) * d, off === 0 ? 2 : 1, perk ? RED_GOLD : WIND_LIGHT, t);
      }
      shock(ctx, x, y, 4 + f * 10, c, t * 0.8, 3);
    });
    return true;
  }
  if (fx.kind === "ogHit") {
    const perk = fx.size === 2;
    const c = perk ? RED : WIND;
    const r = 6 + f * (perk ? 14 : 10);
    additive(ctx, () => {
      glow(ctx, x, y, r, c, t, 1.5);
      shock(ctx, x, y, r, c, t, 4);
      // 엇갈린 두 줄 베임 (맞은 방향 기준)
      const l = (perk ? 11 : 8) * (0.6 + 0.4 * Math.min(1, f * 3));
      for (const off of [0.6, -0.6]) {
        const ax = Math.cos(fa + off) * l;
        const ay = Math.sin(fa + off) * l;
        beam(ctx, x - ax, y - ay, x + ax, y + ay, perk ? 2 : 1.5, perk ? RED_GOLD : WIND_LIGHT, t);
      }
      sparks(ctx, x, y, perk ? 9 : 6, r * 1.4, f, perk ? RED_GOLD : WIND_LIGHT, fx.x * 3 + fx.y);
    });
    if (perk) {
      // 찢긴 자국: 붉은 파편이 맞은 방향으로 튐
      ctx.fillStyle = alpha(RED, t);
      for (let i = 0; i < 4; i++) {
        const d = 4 + f * (10 + i * 3);
        const o = (i - 1.5) * 0.35;
        ctx.fillRect(snap(x + Math.cos(fa + o) * d), snap(y + Math.sin(fa + o) * d), 2, 1);
      }
    }
    return true;
  }
  if (fx.kind === "ogCounter") {
    const guard = fx.width === 2;
    const r = fx.size * (0.55 + 0.6 * Math.min(1, f * 1.6));
    additive(ctx, () => {
      glow(ctx, x, y, r * 0.7, GOLD, t * 0.8, 1.3);
      shock(ctx, x, y, r, GOLD, t, 6);
      if (guard) shock(ctx, x, y, r * 0.8, STEEL, t * 0.8, 3);
      // 여덟 갈래 빛살
      for (let i = 0; i < 8; i++) {
        const an = fa + (i * TAU) / 8;
        beam(ctx, x + Math.cos(an) * r * 0.45, y + Math.sin(an) * r * 0.45, x + Math.cos(an) * r * 0.95, y + Math.sin(an) * r * 0.95, 1, GOLD, t * 0.55);
      }
      // 가운데 방패 섬광 (처음 잠깐)
      if (f < 0.4) {
        const k = 1 - f / 0.4;
        crescent(ctx, x, y - 2, 9, fa, 1.4, 3, guard ? STEEL : GOLD, k);
        ring(ctx, x, y - 2, 6 + f * 10, alpha(GOLD_LIGHT, k), 1);
      }
    });
    return true;
  }
  return false;
}
