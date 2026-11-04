// 오닉스 그리기 (1): 효과 — 칠보 광륜·빛줄기 · 날아오름·내려앉음 · 보석 일곱(홍옥 불기둥·호박 운석·황옥 번개·비취 덩굴·청옥 서리·남옥 빛줄기·자수정 공허) · 칠보 공명 · 수정 반격 · 보석 꼬리
// 빛기둥·얼음 반구·덩굴 나선·갈라진 땅은 render/onyxPillar, 몸 둘레(광륜 보석·추진 불꽃)는 render/onyxAura
import type { EffectState } from "@pixel-rogue/shared";
import { lightning } from "./leoBolt";
import { cracks, debris, dome, GEM_COL, GEM_PALE, pillar, spiral } from "./onyxPillar";
import { additive, alpha, beam, easeOut, glow, rnd, rune, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

const TAU = Math.PI * 2;
const VIO = GEM_COL[6];
const VIO_PALE = GEM_PALE[6];

/** 네 갈래 반짝임 별 */
function twinkle(ctx: Ctx, x: number, y: number, r: number, col: string, a: number): void {
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.4, col, a, 1.2);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(x - r, y - 0.5, r * 2, 1);
    ctx.fillRect(x - 0.5, y - r, 1, r * 2);
  });
}

/** 마름모 보석 조각 (회전) */
function shard(ctx: Ctx, x: number, y: number, s: number, a: number, col: string, pale: string, al: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.globalAlpha *= al;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.6, 0);
  ctx.lineTo(0, s);
  ctx.lineTo(-s * 0.6, 0);
  ctx.fill();
  ctx.fillStyle = pale;
  ctx.fillRect(-0.5, -s * 0.6, 1, s * 0.6);
  ctx.restore();
}

export function drawOnyxFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("ox")) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = 1 - f;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const seed = Math.round(fx.x * 7 + fx.y * 13 + fx.maxTicks);
  const r = fx.size;
  switch (fx.kind) {
    case "oxHalo": {
      // 가운데 자수정이 터지듯 빛나며 일곱 빛깔 광륜이 퍼짐
      additive(ctx, () => {
        glow(ctx, x, y, 26 * (1 - f * 0.5), VIO, fade, 1.6);
        shock(ctx, x, y, r * (0.4 + 1.6 * easeOut(f)), VIO, fade, 4);
      });
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * TAU + f * 2.4;
        const d = r * (0.5 + easeOut(f) * 0.9);
        twinkle(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8, 3 + 2 * fade, GEM_COL[k]!, fade);
      }
      break;
    }
    case "oxBeam": {
      // 몸에서 적까지 무지갯빛이 도는 보라 빛줄기 → 적 자리에 작은 빛기둥·별
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const k = Math.abs(seed) % 7;
      const reach = Math.min(1, f / 0.25);
      const ex = x + (tx - x) * reach;
      const ey = y + (ty - y) * reach;
      additive(ctx, () => {
        beam(ctx, x, y, ex, ey, 3.2 * fade + 0.6, VIO, fade);
        beam(ctx, x, y, ex, ey, 1.2, GEM_COL[k]!, fade * 0.7);
      });
      if (reach >= 1) {
        pillar(ctx, tx, ty, 9, (f - 0.25) / 0.75, VIO, VIO_PALE, seed, 70, 0.6);
        twinkle(ctx, tx, ty - 6, 5 * fade + 2, GEM_COL[k]!, fade);
      }
      break;
    }
    case "oxLift": {
      // 날아오름: 발밑에서 보라 불꽃이 아래로 뿜고 먼지 고리
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.4 + easeOut(f) * 1.4), VIO, fade, 5);
        for (let i = -1; i <= 1; i++) {
          const g = ctx.createLinearGradient(0, y - 6, 0, y + 18 * fade + 4);
          g.addColorStop(0, `rgba(255,255,255,${fade})`);
          g.addColorStop(0.4, alpha(VIO, fade));
          g.addColorStop(1, alpha(VIO, 0));
          ctx.fillStyle = g;
          ctx.fillRect(x + i * 6 - 2, y - 6, 4, 22 * fade + 4);
        }
      });
      sparks(ctx, x, y, 10, r * 1.3, f, VIO_PALE, seed);
      break;
    }
    case "oxLand": {
      const big = fx.width === 1;
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.3 + easeOut(f) * 1.2), VIO, fade, big ? 9 : 5);
        if (big) shock(ctx, x, y, r * (0.15 + easeOut(f) * 0.8), GEM_COL[4], fade, 5);
        glow(ctx, x, y, r * 0.7, VIO, fade * 0.8, 1);
      });
      if (big) {
        cracks(ctx, x, y, r * 0.8, f, VIO, seed);
        debris(ctx, x, y, r * 0.7, f, seed, 12);
        rune(ctx, x, y, r * 0.9, VIO_PALE, fade, f * 3);
      }
      break;
    }
    case "oxRuby":
      // 홍옥: 갈라진 땅 위로 붉은 불기둥 + 피어오르는 불씨
      cracks(ctx, x, y, r * 1.2, f, GEM_COL[0], seed);
      pillar(ctx, x, y, r * 0.8, f, GEM_COL[0], GEM_PALE[0], seed, 180);
      for (let k = 0; k < 8; k++) {
        const up = (f * 60 + rnd(seed, k) * 40) % 60;
        ctx.fillStyle = alpha(k % 2 ? "#ffd040" : GEM_COL[0], fade);
        ctx.fillRect(x + (rnd(k, seed) - 0.5) * r * 1.6, y - up, 2, 2);
      }
      break;
    case "oxAmber": {
      // 호박: 하늘에서 비스듬히 떨어지는 운석 → 주황 폭발
      const hit = 0.35;
      if (f < hit) {
        const u = f / hit;
        const mx = x + 70 * (1 - u);
        const my = y - 130 * (1 - u);
        additive(ctx, () => {
          beam(ctx, mx + 30, my - 55, mx, my, 5, GEM_COL[1], 0.6);
          glow(ctx, mx, my, 10, GEM_COL[1], 1, 1.4);
        });
        shard(ctx, mx, my, 5, u * 6, GEM_COL[1], GEM_PALE[1], 1);
      } else {
        const g = (f - hit) / (1 - hit);
        const gf = 1 - g;
        additive(ctx, () => {
          glow(ctx, x, y, r * (2 - g), GEM_COL[1], gf, 1.6);
          shock(ctx, x, y, r * (0.4 + 1.5 * easeOut(g)), GEM_COL[1], gf, 6);
        });
        cracks(ctx, x, y, r, g, GEM_COL[1], seed);
        debris(ctx, x, y, r, g, seed, 10);
        sparks(ctx, x, y, 14, r * 2, g, "#ffd040", seed);
      }
      break;
    }
    case "oxTopaz": {
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      lightning(ctx, x, y, tx, ty, seed + Math.floor(f * 6), 2.2 * fade + 0.6, fade, 2);
      additive(ctx, () => glow(ctx, tx, ty, 14, GEM_COL[2], fade, 1.5));
      sparks(ctx, tx, ty, 6, 14, f, GEM_COL[2], seed);
      break;
    }
    case "oxJade": {
      // 비취: 몸 둘레 바닥에서 가시 덩굴이 솟고 위로 나선을 그리며 감아 오름
      rune(ctx, x, y + 6, r * (0.6 + 0.4 * easeOut(f)), GEM_COL[3], fade, f * 2);
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * TAU;
        const bx = x + Math.cos(a) * r * 0.8;
        const by = y + 6 + Math.sin(a) * r * 0.4;
        const hh = Math.sin(Math.min(1, f * 2.2) * Math.PI) * (10 + (k % 3) * 5);
        ctx.fillStyle = alpha(k % 2 ? GEM_PALE[3] : GEM_COL[3], fade);
        ctx.beginPath();
        ctx.moveTo(bx - 2.5, by);
        ctx.lineTo(bx, by - hh);
        ctx.lineTo(bx + 2.5, by);
        ctx.fill();
      }
      spiral(ctx, x, y + 6, 14, 60, f, GEM_COL[3], GEM_PALE[3]);
      additive(ctx, () => glow(ctx, x, y - 6, 20, GEM_COL[3], fade * 0.7, 1));
      break;
    }
    case "oxSapph":
      // 청옥: 방 전체로 퍼지는 서리 물결 + 눈송이
      additive(ctx, () => {
        shock(ctx, x, y, r * easeOut(f) * 1.4, GEM_COL[4], fade, 14);
        shock(ctx, x, y, r * easeOut(f) * 0.9, GEM_COL[5], fade * 0.7, 8);
      });
      for (let k = 0; k < 16; k++) {
        const a = rnd(seed, k) * TAU;
        const d = r * easeOut(f) * (0.4 + rnd(k, seed) * 1);
        twinkle(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7, 2.5, GEM_PALE[4], fade);
      }
      break;
    case "oxFrost":
      // 청옥 맞은 적: 얼음 기둥 + 반구 막
      pillar(ctx, x, y, r * 0.5, f, GEM_COL[4], GEM_PALE[4], seed, 90, 0.8);
      dome(ctx, x, y, r, f, GEM_COL[4], GEM_PALE[4]);
      break;
    case "oxAqua": {
      // 남옥: 나는 쪽으로 꿰뚫는 물빛 광선 + 물결 고리
      const a = Math.atan2(fx.dirY, fx.dirX);
      const len = r * Math.min(1, f / 0.15);
      const ex = x + Math.cos(a) * len;
      const ey = y + Math.sin(a) * len;
      const w = (fx.width ?? 10) * (f < 0.15 ? 0.6 : fade);
      additive(ctx, () => {
        beam(ctx, x, y, ex, ey, w * 1.4, GEM_COL[5], fade);
        beam(ctx, x, y, ex, ey, w * 0.5, GEM_PALE[5], fade);
      });
      for (let k = 0; k < 5; k++) {
        const u = ((k / 5 + f * 1.5) % 1) * len;
        const cx = x + Math.cos(a) * u;
        const cy = y + Math.sin(a) * u;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        ctx.strokeStyle = alpha(GEM_PALE[5], fade * 0.8);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, 2, w * 1.2, 0, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }
      twinkle(ctx, x, y, 7 * fade + 2, GEM_COL[5], fade);
      break;
    }
    case "oxAmeth": {
      // 자수정: 빨려 드는 공허 구슬 → 마지막에 터짐 (보라 룬 기둥)
      const pull = Math.min(1, f / 0.6);
      rune(ctx, x, y + 4, r * (1.2 - pull * 0.5), VIO, fade, f * 5);
      ctx.fillStyle = `rgba(20,0,40,${0.75 * fade})`;
      ctx.beginPath();
      ctx.arc(x, y - 4, 4 + 10 * Math.sin(pull * Math.PI * 0.5), 0, TAU);
      ctx.fill();
      for (let k = 0; k < 14; k++) {
        const a = rnd(seed, k) * TAU + f * 6;
        const d = r * (1 - pull) * (0.5 + rnd(k, seed) * 0.6) + 6;
        ctx.fillStyle = alpha(k % 2 ? VIO_PALE : VIO, fade);
        ctx.fillRect(x + Math.cos(a) * d, y - 4 + Math.sin(a) * d * 0.6, 2, 2);
      }
      additive(ctx, () => ringGlow(ctx, x, y - 4, 14, fade));
      if (f > 0.6) pillar(ctx, x, y, r * 0.6, (f - 0.6) / 0.4, VIO, VIO_PALE, seed, 200, 1.3);
      break;
    }
    case "oxReson": {
      // 칠보 공명: 둘레에 일곱 빛기둥이 차례로 꽂히고 무지개 충격파 + 하얀 섬광
      for (let k = 0; k < 7; k++) {
        const g = Math.min(1, Math.max(0, (f - k * 0.04) / 0.8));
        if (g <= 0) continue;
        const a = (k / 7) * TAU - Math.PI / 2;
        pillar(ctx, x + Math.cos(a) * 40, y + 8 + Math.sin(a) * 26, 12, g, GEM_COL[k]!, GEM_PALE[k]!, seed + k, 200);
      }
      additive(ctx, () => {
        for (let k = 0; k < 7; k++) shock(ctx, x, y, r * easeOut(f) * (0.6 + k * 0.07), GEM_COL[k]!, fade * 0.6, 5);
        glow(ctx, x, y, 60 * fade, "#ffffff", fade, 2);
      });
      break;
    }
    case "oxShard":
      // 수정 반격: 몸에서 보석 조각이 사방으로 튐
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * TAU + rnd(seed, k);
        const d = r * easeOut(f) * (0.8 + rnd(k, seed) * 0.6);
        shard(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8, 3, a + f * 8, GEM_COL[k % 7]!, GEM_PALE[k % 7]!, fade);
      }
      additive(ctx, () => glow(ctx, x, y, 16, GEM_COL[5], fade, 1.2));
      break;
    case "oxDust":
      // 보석 꼬리: 지나간 자리에 일곱 빛깔 반짝이
      for (let k = 0; k < 7; k++) {
        const ox = (rnd(seed, k) - 0.5) * r * 1.4 - fx.dirX * f * 14;
        const oy = (rnd(k, seed) - 0.5) * r * 0.8 - fx.dirY * f * 14 - f * 6;
        twinkle(ctx, x + ox, y + oy, 2 + fade * 2, GEM_COL[k]!, fade);
      }
      break;
    default:
      return false;
  }
  return true;
}

/** 보라 빛 고리 (공허 구슬 테두리) */
function ringGlow(ctx: Ctx, x: number, y: number, r: number, a: number): void {
  shock(ctx, x, y, r, VIO, a, 4);
}
