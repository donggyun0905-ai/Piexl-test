// 펜리르 그리기 (1): 효과 — 물어 베기·되베기 초승달 · 지면 검기 출발·바닥 자국 · 난도 고리·수정 초승달 베기 · 뛰어오름 · 착지(갈라진 땅·검기 왕관·충격파)
// · 선왕의 광륜 · 회피 잔상 · 사냥 본능. 검기 띠·수정 조각·갈라진 땅은 render/fenrirBits, 나아가는 검기·균열은 render/fenrirAura
import type { EffectState } from "@pixel-rogue/shared";
import { BLUE, cracks, ICE, shards, SKY, slashArc, VIOLET } from "./fenrirBits";
import { debris } from "./onyxPillar";
import { additive, alpha, easeOut, glow, rnd, rune, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

const TAU = Math.PI * 2;
const GOLD = "#ffc860";
const FN_FX = new Set(["fnBite", "fnWaveGo", "fnScar", "fnRing", "fnCut", "fnJump", "fnLand", "fnHalo", "fnDodge", "fnHunt"]);

/** 바닥을 긋는 자국: 빛나는 칼금 → 식으며 어두운 금 (big: 3타 큰 검기, 흙먼지) */
function scar(ctx: Ctx, x: number, y: number, a: number, w: number, f: number, big: boolean, seed: number): void {
  const len = big ? 12 : 8;
  const hot = Math.max(0, 1 - f * 2);
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  ctx.lineCap = "round";
  ctx.strokeStyle = `rgba(20,18,40,${0.55 * (1 - f)})`;
  ctx.lineWidth = big ? 3 : 2;
  ctx.beginPath();
  ctx.moveTo(x - ca * len, y - sa * len * 0.6);
  ctx.lineTo(x, y);
  ctx.stroke();
  additive(ctx, () => {
    ctx.strokeStyle = alpha(SKY, 0.9 * hot);
    ctx.lineWidth = big ? 2.2 : 1.4;
    ctx.beginPath();
    ctx.moveTo(x - ca * len, y - sa * len * 0.6);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (big) glow(ctx, x, y, w * 1.2, BLUE, 0.4 * hot);
  });
  ctx.lineCap = "butt";
  if (!big) return;
  // 양옆으로 튀는 흙먼지
  for (const side of [-1, 1]) {
    const up = Math.sin(Math.min(1, f * 1.5) * Math.PI) * 5;
    ctx.fillStyle = `rgba(150,140,170,${0.5 * (1 - f)})`;
    const d = w * (0.6 + f) + rnd(seed, side) * 3;
    ctx.beginPath();
    ctx.arc(x - sa * d * side, y + ca * d * side * 0.6 - up, 2 + f * 3, 0, TAU);
    ctx.fill();
  }
}

/** 착지: 번쩍 → 갈라진 땅 · 두 겹 충격파 · 둘레에 솟는 검기 왕관 · 파편 (howl: 울부짖음 고리) */
function landing(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, howl: boolean): void {
  const fade = 1 - f;
  additive(ctx, () => {
    if (f < 0.25) {
      ctx.fillStyle = alpha(ICE, 0.35 * (1 - f / 0.25));
      ctx.fillRect(x - 400, y - 300, 800, 600);
    }
    glow(ctx, x, y, r * 2.2 * (1 - f * 0.5), BLUE, fade, 2);
    shock(ctx, x, y, r * (0.4 + 2 * easeOut(f)), SKY, fade, 10);
    shock(ctx, x, y, r * (0.2 + 1.2 * easeOut(f)), VIOLET, fade * 0.8, 6);
  });
  // 패인 땅 + 빛나는 금
  ctx.fillStyle = `rgba(16,14,30,${0.55 * fade})`;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.6, r * 0.3, 0, 0, TAU);
  ctx.fill();
  cracks(ctx, x, y, r * 1.6 * Math.min(1, f * 4), 10, seed, fade, Math.max(0, 1 - f * 1.6));
  // 검기 왕관: 둘레에 초승달 검기가 솟았다가 흩어짐
  const crown = 7;
  for (let k = 0; k < crown; k++) {
    const ang = (k / crown) * TAU + 0.3;
    const cx = x + Math.cos(ang) * r * 0.9;
    const cy = y + Math.sin(ang) * r * 0.45;
    const rise = easeOut(Math.min(1, f * 3));
    slashArc(ctx, cx, cy - 6 * rise, 10 + 8 * rise, -Math.PI / 2 + Math.cos(ang) * 0.6, 0.9, 4, rise, Math.max(0, 1 - f * 1.4), k % 2 ? 1 : -1, false, k % 2 ? BLUE : VIOLET);
  }
  if (howl) for (let k = 0; k < 3; k++) additive(ctx, () => shock(ctx, x, y - 6, r * (0.6 + ((f * 2 + k / 3) % 1) * 1.6), VIOLET, fade * 0.6, 3));
  debris(ctx, x, y, r, f, seed, 10);
  shards(ctx, x, y - 4, 14, r * 1.8, f, seed, 1);
  sparks(ctx, x, y, 16, r * 2, f, SKY, seed + 2, 1);
}

export function drawFenrirFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!FN_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = 1 - f;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const seed = Math.round(fx.x * 7 + fx.y * 13 + fx.maxTicks);
  switch (fx.kind) {
    case "fnBite": {
      // 1타는 좁고 빠르게, 2타(되베기)는 반대로 넓게 + 연기 그림자
      const back = !!fx.width;
      const sweep = easeOut(Math.min(1, f / 0.4));
      const out = f < 0.4 ? 1 : 1 - (f - 0.4) / 0.6;
      slashArc(ctx, x, y, fx.size, a, back ? 1.6 : 1.2, fx.size * (back ? 0.24 : 0.2), sweep, out, back ? -1 : 1, back, back ? VIOLET : BLUE);
      if (sweep >= 1) {
        const ea = a + (back ? -1.6 : 1.2) * (back ? -1 : 1);
        shards(ctx, x + Math.cos(ea) * fx.size, y + Math.sin(ea) * fx.size, 7, 18, (f - 0.4) / 0.6, seed);
      }
      break;
    }
    case "fnWaveGo":
      // 대검을 바닥에 내려 긋는 순간: 푸른 섬광 · 앞으로 튀는 불똥 · 흙먼지
      additive(ctx, () => {
        glow(ctx, x + fx.dirX * 8, y + fx.dirY * 8, fx.size * (1 + f), SKY, fade, 1.6);
        shock(ctx, x, y + 3, fx.size * (0.4 + f * 1.4), BLUE, fade, 4);
      });
      sparks(ctx, x + fx.dirX * 10, y + fx.dirY * 10, 10, fx.size * 1.6, f, ICE, seed, 1);
      debris(ctx, x, y + 3, fx.size, f, seed, 6);
      break;
    case "fnScar":
      scar(ctx, x, y + 3, a, fx.size, f, !!fx.width, seed);
      break;
    case "fnRing": {
      // 난도 자리: 도는 푸른 문양 + 안으로 모이는 칼빛
      rune(ctx, x, y + 2, fx.size * (1.2 - 0.2 * f), SKY, fade, f * 5);
      for (let k = 0; k < 6; k++) {
        const ang = (k / 6) * TAU + f * 2;
        const d = fx.size * (1.6 - f * 1.2);
        additive(ctx, () => {
          ctx.strokeStyle = alpha(ICE, 0.7 * fade);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.6);
          ctx.lineTo(x + Math.cos(ang) * (d - 6), y + Math.sin(ang) * (d - 6) * 0.6);
          ctx.stroke();
        });
      }
      break;
    }
    case "fnCut": {
      // 수정 초승달 베기: 한 자리를 가로지르며 번쩍 → 깨진 수정 조각 (번갈아 푸른·보랏빛, 휘는 쪽 반대)
      const side = fx.width ? -1 : 1;
      const nx = -fx.dirY * side;
      const ny = fx.dirX * side;
      const r = fx.size;
      const sweep = easeOut(Math.min(1, f / 0.3));
      const out = f < 0.3 ? 1 : 1 - (f - 0.3) / 0.7;
      slashArc(ctx, x - nx * r * 0.7, y - ny * r * 0.7, r, Math.atan2(ny, nx), 0.9, r * 0.2, sweep, out, side, true, fx.width ? VIOLET : BLUE);
      additive(ctx, () => {
        ctx.strokeStyle = `rgba(255,255,255,${out})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - fx.dirX * r * sweep, y - fx.dirY * r * sweep);
        ctx.lineTo(x + fx.dirX * r * sweep, y + fx.dirY * r * sweep);
        ctx.stroke();
        glow(ctx, x, y, r * 0.6, SKY, out * 0.6, 1);
      });
      if (f > 0.3) shards(ctx, x, y, 6, r * 1.1, (f - 0.3) / 0.7, seed);
      break;
    }
    case "fnJump": {
      // 뛰어오름: 발밑 흙먼지 고리 · 하늘로 솟는 빛줄기 · 금빛 광륜 번쩍
      ctx.fillStyle = `rgba(150,140,170,${0.4 * fade})`;
      ctx.beginPath();
      ctx.ellipse(x, y + 4, fx.size * (0.6 + f), fx.size * (0.3 + f * 0.5), 0, 0, TAU);
      ctx.fill();
      additive(ctx, () => {
        const top = y - 20 - 70 * easeOut(f);
        const g = ctx.createLinearGradient(0, top, 0, y);
        g.addColorStop(0, alpha(SKY, 0));
        g.addColorStop(1, alpha(SKY, 0.7 * fade));
        ctx.fillStyle = g;
        ctx.fillRect(x - 5 * fade, top, 10 * fade, y - top);
        glow(ctx, x, y - 14, 16, GOLD, fade * 0.6, 1);
      });
      sparks(ctx, x, y, 8, fx.size * 1.4, f, ICE, seed, 0.8);
      break;
    }
    case "fnLand":
      landing(ctx, x, y + 2, fx.size, f, seed, !!fx.width);
      break;
    case "fnHalo": {
      // 선왕의 광륜: 금빛 고리가 퍼지며 보석이 박힘 · 빛살
      const r = fx.size * (0.6 + 0.4 * easeOut(f));
      additive(ctx, () => {
        glow(ctx, x, y, r * 1.8, GOLD, fade, 1.5);
        shock(ctx, x, y, r, GOLD, fade, 3);
      });
      for (let k = 0; k < 7; k++) {
        const ang = -Math.PI / 2 + ((k - 3) / 7) * Math.PI * 1.2;
        const gx = x + Math.cos(ang) * r;
        const gy = y + Math.sin(ang) * r;
        ctx.fillStyle = alpha(k === 3 ? "#ffffff" : BLUE, fade);
        ctx.fillRect(gx - 1.5, gy - 1.5, 3, 3);
      }
      sparks(ctx, x, y, 12, r * 1.6, f, GOLD, seed, 1);
      break;
    }
    case "fnDodge": {
      // 회피: 은빛 잔상 줄 셋이 뒤로 흩어짐
      for (let k = 0; k < 3; k++) {
        const off = (k - 1) * 5;
        const bx = x - fx.dirX * (6 + f * 14) - fx.dirY * off;
        const by = y - fx.dirY * (6 + f * 14) + fx.dirX * off - 4;
        ctx.strokeStyle = `rgba(220,230,255,${0.7 * fade})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx - fx.dirX * 10, by - fx.dirY * 10);
        ctx.stroke();
      }
      additive(ctx, () => glow(ctx, x, y - 4, fx.size, ICE, 0.4 * fade));
      break;
    }
    case "fnHunt": {
      // 사냥 본능: 붉은 눈빛 · 앞으로 뻗는 바람 줄
      additive(ctx, () => glow(ctx, x, y - 8, 8, "#ff4a5a", fade, 1));
      for (let k = -1; k <= 1; k++) {
        ctx.strokeStyle = alpha(k ? SKY : "#ff8a9a", fade);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - fx.dirX * 8 + k * 4 * fx.dirY, y - fx.dirY * 8 - k * 4 * fx.dirX);
        ctx.lineTo(x - fx.dirX * (16 + f * 10) + k * 4 * fx.dirY, y - fx.dirY * (16 + f * 10) - k * 4 * fx.dirX);
        ctx.stroke();
      }
      break;
    }
  }
  return true;
}

