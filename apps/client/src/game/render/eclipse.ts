// 이클립스 그리기 (1): 효과 — 태양 연격 번쩍임·5타 태양 십자 · 일식 내려베기·올려베기·초승달 · 흑월 회전 · 그림자 돌진 · 뛰어오름
// · 일식 낙하(번쩍 → 거대한 보라 충격파·번개 줄·빛기둥·연기 고리) · 맞음 불꽃 · 영역 불꽃 · 개기일식
// 날아가는 검격·영역·블랙홀·바뀌는 오라·치유의 빛·게이지는 render/eclipseAura
import type { EffectState } from "@pixel-rogue/shared";
import { chevron, flameTongue, N_DEEP, N_LIGHT, N_PINK, N_VIO, N_VOID, S_AMBER, S_GOLD, S_RED, S_WHITE, smoke, TAU, voidArc } from "./eclipseBits";
import { additive, alpha, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

const EC_FX = new Set(["ecSlash", "ecCross", "ecHew", "ecSpin", "ecDash", "ecJump", "ecSlam", "ecSpark", "ecBurn", "ecHeal", "ecShift", "ecShiftEnd", "ecTotal"]);
/** 몸을 따라 그리는 것 (render/eclipseAura) */
const ON_BODY = new Set(["ecHeal", "ecShift", "ecShiftEnd"]);

/** 태양 십자: 날카로운 햇살 여덟 가닥 (긴 넷 · 짧은 넷), 겉 노랑 · 속 빨강 */
function sunburst(ctx: Ctx, x: number, y: number, r: number, f: number, spin: number): void {
  const fade = 1 - f;
  const R = r * (0.5 + 0.7 * easeOut(f));
  additive(ctx, () => glow(ctx, x, y, R * 1.2, S_AMBER, 0.8 * fade, 1.5));
  for (const [w, c, k] of [[3.4, S_GOLD, 1], [1.8, S_RED, 0.82]] as const) {
    ctx.fillStyle = alpha(c, 0.95 * fade);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = spin + (i / 8) * TAU;
      const len = R * k * (i % 2 ? 0.55 : 1);
      ctx.moveTo(x + Math.cos(a + Math.PI / 2) * w, y + Math.sin(a + Math.PI / 2) * w);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.lineTo(x + Math.cos(a - Math.PI / 2) * w, y + Math.sin(a - Math.PI / 2) * w);
    }
    ctx.fill();
  }
  additive(ctx, () => glow(ctx, x, y, 6, S_WHITE, fade, 2));
}

/** 일식 낙하: 번쩍 → 두 겹 보라 충격파 · 바깥으로 튀는 분홍 번개 · 가운데 빛기둥 · 연기 고리 · 갈라진 검은 땅 */
function slam(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number): void {
  const fade = 1 - f;
  additive(ctx, () => {
    if (f < 0.18) {
      ctx.fillStyle = alpha(N_PINK, 0.3 * (1 - f / 0.18));
      ctx.fillRect(x - 500, y - 400, 1000, 800);
    }
  });
  // 바닥: 검보라로 그을린 넓은 원 + 갈라진 금
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.55);
  const burn = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  burn.addColorStop(0, alpha(N_VOID, 0.75 * fade));
  burn.addColorStop(0.7, alpha(N_DEEP, 0.45 * fade));
  burn.addColorStop(1, alpha(N_DEEP, 0));
  ctx.fillStyle = burn;
  ctx.beginPath();
  ctx.arc(0, 0, r * easeOut(Math.min(1, f * 3)), 0, TAU);
  ctx.fill();
  ctx.strokeStyle = alpha(N_PINK, 0.8 * fade);
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 9; i++) {
    const a = rnd(seed, i) * TAU;
    let d = 8;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * d, Math.sin(a) * d);
    for (let j = 0; j < 4; j++) {
      d += r * 0.18 * easeOut(Math.min(1, f * 2.5));
      const w = a + (rnd(i, j + seed) - 0.5) * 0.5;
      ctx.lineTo(Math.cos(w) * d, Math.sin(w) * d);
    }
    ctx.stroke();
  }
  ctx.restore();
  additive(ctx, () => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.6);
    shock(ctx, 0, 0, r * (0.25 + 0.95 * easeOut(f)), N_PINK, fade, 14);
    shock(ctx, 0, 0, r * (0.1 + 0.6 * easeOut(f)), N_VIO, fade * 0.9, 9);
    ctx.restore();
  });
  // 빛기둥: 가운데에서 솟는 분홍 보라 불길 (안쪽 하양)
  const pillar = Math.max(0, 1 - f * 1.6);
  if (pillar > 0) {
    const h = 70 * (0.6 + 0.4 * easeOut(Math.min(1, f * 4)));
    for (let i = 0; i < 7; i++) {
      const off = (i - 3) * 4.5;
      const sway = Math.sin(f * 20 + i) * 3;
      additive(ctx, () => flameTongue(ctx, x + off, y, h * (1 - Math.abs(i - 3) * 0.18), 6, sway, pillar * 0.8, true));
    }
    additive(ctx, () => {
      const g = ctx.createLinearGradient(0, y, 0, y - h);
      g.addColorStop(0, alpha("#ffffff", pillar));
      g.addColorStop(1, alpha(N_LIGHT, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - 4, y - h, 8, h);
    });
  }
  // 바깥으로 튀는 번개 줄
  ctx.strokeStyle = alpha(N_PINK, fade);
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 12; i++) {
    const a = rnd(seed + 7, i) * TAU;
    const d0 = r * (0.3 + 0.7 * easeOut(f));
    let px = x + Math.cos(a) * d0;
    let py = y + Math.sin(a) * d0 * 0.6;
    ctx.beginPath();
    ctx.moveTo(px, py);
    for (let j = 0; j < 3; j++) {
      px += Math.cos(a) * 6 + (rnd(i, j) - 0.5) * 7;
      py += (Math.sin(a) * 6 - 3) * 0.6 + (rnd(j, i) - 0.5) * 6;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  smoke(ctx, x, y, 14, r * 0.85, f, seed, 1.2);
}

export function drawEclipseFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!EC_FX.has(fx.kind)) return false;
  if (ON_BODY.has(fx.kind)) return true;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = 1 - f;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const seed = Math.round(fx.x * 7 + fx.y * 13 + fx.maxTicks);
  const w = fx.width ?? 0;
  switch (fx.kind) {
    case "ecSlash": {
      // 작은 불의 도끼를 휘두른 자리: 몸 앞에서 번쩍이는 짧은 직각 날 + 불똥
      const d = 6 + 8 * easeOut(f);
      chevron(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, a, 9, 2.2, (w % 2 ? 0.3 : -0.3) * (w > 1 ? -1 : 1), fade);
      additive(ctx, () => sparks(ctx, x + Math.cos(a) * 10, y + Math.sin(a) * 10, 5, 14, f, S_GOLD, seed));
      break;
    }
    case "ecCross":
      sunburst(ctx, x + Math.cos(a) * 14, y + Math.sin(a) * 14, fx.size * 0.7, f, a + Math.PI / 8);
      additive(ctx, () => sparks(ctx, x, y, 10, fx.size, f, S_RED, seed));
      break;
    case "ecHew": {
      // 내려베기(0)는 시계 방향, 올려베기(1)는 반대로, 초승달(2)은 짧고 굵게 번쩍
      const sweep = easeOut(Math.min(1, f / 0.35));
      const arc = w === 2 ? 0.7 : 1.15;
      const dir = w === 1 ? -1 : 1;
      const from = a - arc * dir;
      const to = from + arc * 2 * dir * sweep;
      const r = fx.size * (w === 2 ? 0.7 : 1);
      const al = Math.min(1, fade * 1.6);
      voidArc(ctx, x, y, r, Math.min(from, to), Math.max(from, to), w === 2 ? 11 : 9, al, 0.75);
      smoke(ctx, x + Math.cos(to) * r, y + Math.sin(to) * r * 0.75, 5, 9, f, seed, 0.9);
      break;
    }
    case "ecSpin": {
      // 흑월 회전: 몸 둘레를 한 바퀴 휘감는 검보라 고리 + 분홍 충격파
      const sweep = easeOut(Math.min(1, f / 0.5));
      voidArc(ctx, x, y - 2, fx.size, a, a + TAU * sweep, 9, Math.min(1, fade * 1.5), 0.7);
      additive(ctx, () => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, 0.7);
        shock(ctx, 0, 0, fx.size * (0.6 + 0.5 * easeOut(f)), N_PINK, fade * 0.7, 6);
        ctx.restore();
      });
      smoke(ctx, x, y, 8, fx.size, f, seed, 0.8);
      break;
    }
    case "ecDash": {
      // 그림자 돌진: 지나간 줄을 따라 검보라 띠 + 분홍 테 + 연기
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const nx = -fx.dirY;
      const ny = fx.dirX;
      const t = 6 * fade;
      ctx.fillStyle = alpha(N_PINK, 0.7 * fade);
      ctx.beginPath();
      ctx.moveTo(x + nx * t * 1.4, y + ny * t * 1.4);
      ctx.lineTo(tx, ty);
      ctx.lineTo(x - nx * t * 1.4, y - ny * t * 1.4);
      ctx.fill();
      ctx.fillStyle = alpha(N_VOID, 0.85 * fade);
      ctx.beginPath();
      ctx.moveTo(x + nx * t, y + ny * t);
      ctx.lineTo(tx, ty);
      ctx.lineTo(x - nx * t, y - ny * t);
      ctx.fill();
      smoke(ctx, x, y, 3, 6, f, seed, 0.8);
      break;
    }
    case "ecJump":
      additive(ctx, () => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, 0.5);
        shock(ctx, 0, 0, fx.size * (0.4 + easeOut(f)), N_PINK, fade, 6);
        ctx.restore();
        for (let i = 0; i < 6; i++) {
          const off = (rnd(seed, i) - 0.5) * 22;
          ctx.fillStyle = alpha(i % 2 ? N_PINK : N_LIGHT, fade);
          ctx.fillRect(x + off, y - 6 - easeOut(f) * 30 * (0.5 + rnd(i, seed)), 1.5, 6);
        }
      });
      smoke(ctx, x, y + 2, 8, 14, f, seed);
      break;
    case "ecSlam":
      slam(ctx, x, y, fx.size, f, seed);
      break;
    case "ecSpark":
      if (w) {
        additive(ctx, () => {
          glow(ctx, x, y, fx.size * 1.4, N_VIO, 0.8 * fade);
          sparks(ctx, x, y, 7, fx.size * 1.6, f, N_PINK, seed);
        });
        ctx.fillStyle = alpha(N_VOID, 0.7 * fade);
        ctx.beginPath();
        ctx.arc(x, y, fx.size * 0.35 * fade, 0, TAU);
        ctx.fill();
      } else {
        // 태양: 붉은 속 노란 겉 네 갈래 번쩍
        for (const [k, c] of [[1, S_GOLD], [0.6, S_RED]] as const) {
          const L = fx.size * k * (0.6 + easeOut(f));
          ctx.fillStyle = alpha(c, fade);
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const ang = (i / 4) * TAU + Math.PI / 4 + a;
            ctx.moveTo(x + Math.cos(ang + 1.3) * 1.5, y + Math.sin(ang + 1.3) * 1.5);
            ctx.lineTo(x + Math.cos(ang) * L, y + Math.sin(ang) * L);
            ctx.lineTo(x + Math.cos(ang - 1.3) * 1.5, y + Math.sin(ang - 1.3) * 1.5);
          }
          ctx.fill();
        }
        additive(ctx, () => sparks(ctx, x, y, 4, fx.size * 1.6, f, S_AMBER, seed));
      }
      break;
    case "ecBurn":
      additive(ctx, () => flameTongue(ctx, x + Math.sin(seed) * 2, y + 4, 12 * (0.5 + f), 3, Math.sin(f * 9 + seed) * 2, fade * 0.9, !!w));
      break;
    case "ecTotal":
      // 개기일식: 금빛 바깥 고리와 검보라 안쪽 고리가 함께 퍼짐
      additive(ctx, () => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, 0.6);
        shock(ctx, 0, 0, fx.size * easeOut(f), S_GOLD, fade, 10);
        shock(ctx, 0, 0, fx.size * 0.75 * easeOut(f), N_PINK, fade, 8);
        ctx.restore();
        glow(ctx, x, y - 8, 30, w ? N_VIO : S_AMBER, fade, 1);
      });
      break;
  }
  return true;
}
