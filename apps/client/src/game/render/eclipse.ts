// 이클립스 그리기 (1): 효과 — 태양 검격(두꺼운 빨강 날 · 앞쪽 테두리에 노랑 불꽃 무늬, 몸에 붙여 그림) · 일식 내려베기·올려베기·초승달
// · 흑월 회전 · 그림자 돌진 · 뛰어오름 · 일식 낙하(검보라 고리가 크게 퍼짐) · 맞음 표시 · 영역 불꽃 · 개기일식
// 날아가는 초승달·영역·블랙홀·바뀌는 오라·치유의 빛·게이지는 render/eclipseAura
import type { EffectState } from "@pixel-rogue/shared";
import { band, N_PINK, N_VOID, rightSlash, S_GOLD, S_RED, smoke, TAU, voidArc } from "./eclipseBits";
import { alpha, easeOut, rnd, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

const EC_FX = new Set(["ecSlash", "ecCross", "ecHew", "ecSpin", "ecDash", "ecJump", "ecSlam", "ecSpark", "ecBurn", "ecHeal", "ecShift", "ecShiftEnd", "ecTotal"]);
/** 몸을 따라 그리는 것 (render/eclipseAura) */
const ON_BODY = new Set(["ecHeal", "ecShift", "ecShiftEnd"]);

/** 바닥에 누운 두 색 고리 (바깥 c1 · 안쪽 c2): 충격파 하나 */
function ring2(ctx: Ctx, x: number, y: number, r: number, thick: number, c1: string, c2: string, al: number): void {
  if (r <= 1 || al <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.55);
  ctx.lineWidth = thick;
  ctx.strokeStyle = alpha(c1, al);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.stroke();
  ctx.lineWidth = thick * 0.5;
  ctx.strokeStyle = alpha(c2, al);
  ctx.beginPath();
  ctx.arc(0, 0, r - thick * 0.25, 0, TAU);
  ctx.stroke();
  ctx.restore();
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
      // 한 번에 그어(찔러) 나감 → 얇아지며 불티를 흩뿌리고 사라짐 · 5타는 4타와 같은 깊은 찌르기
      const cut = w >= 4 ? 0.18 : 0.22;
      const after = Math.max(0, (f - cut) / (1 - cut));
      const grow = easeOut(Math.min(1, f / cut));
      const thin = (1 - after) ** 0.9;
      const al = Math.min(1, (1 - after) * 3);
      rightSlash(ctx, x, y, fx.dirX, fx.dirY, fx.size, w, grow, thin, al, after);
      break;
    }
    case "ecHew": {
      // 내려베기(0)는 시계 방향, 올려베기(1)는 반대로, 초승달(2)은 짧고 굵게 · 날 하나에 분홍 보라 테 + 검보라 속 · 끝 하나는 도끼날
      const sweep = easeOut(Math.min(1, f / 0.3));
      const arc = w === 2 ? 0.75 : 1.2;
      const dir = w === 1 ? -1 : 1;
      const from = a - arc * dir;
      const to = from + arc * 2 * dir * sweep;
      const after = Math.max(0, (f - 0.3) / 0.7);
      // 휘두르는 쪽 끝(앞장선 끝)은 도끼날처럼 네모나고 두껍게 · 꼬리는 가늘게 · 진하게
      voidArc(ctx, x, y, fx.size, Math.min(from, to), Math.max(from, to), fx.size * (w === 2 ? 0.34 : 0.28) * (1 - after * 0.6), Math.min(1, (1 - after) * 1.8), 0.78, dir > 0 ? 1 : 0);
      if (after > 0) smoke(ctx, x + Math.cos(to) * fx.size, y + Math.sin(to) * fx.size * 0.78, 3, 8, after, seed);
      break;
    }
    case "ecSpin": {
      // 흑월 회전: 몸 둘레를 한 바퀴 휘감는 날
      const sweep = easeOut(Math.min(1, f / 0.45));
      const after = Math.max(0, (f - 0.45) / 0.55);
      voidArc(ctx, x, y - 2, fx.size, a, a + TAU * 0.92 * sweep, fx.size * 0.2 * (1 - after * 0.7), Math.min(1, (1 - after) * 1.3), 0.7);
      break;
    }
    case "ecDash": {
      // 그림자 돌진: 지나간 줄을 따라 뾰족한 날 (분홍 보라 테 · 검보라 속)
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const nx = -fx.dirY;
      const ny = fx.dirX;
      // 시작은 바늘처럼, 끝(지금 몸)쪽이 굵은 한 줄
      for (const [c, k] of [[N_PINK, 1], [N_VOID, 0.5]] as const) {
        const t = 8 * fade * k;
        ctx.fillStyle = alpha(c, Math.min(1, fade * 1.5));
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tx + nx * t, ty + ny * t);
        ctx.lineTo(tx + fx.dirX * 4, ty + fx.dirY * 4);
        ctx.lineTo(tx - nx * t, ty - ny * t);
        ctx.fill();
      }
      break;
    }
    case "ecJump":
      ring2(ctx, x, y, fx.size * (0.5 + easeOut(f)), 3 * fade + 1, N_PINK, N_VOID, fade);
      smoke(ctx, x, y + 2, 6, 14, f, seed);
      break;
    case "ecSlam": {
      // 일식 낙하: 검보라로 그을린 바닥 → 두 색 고리가 크게 퍼짐 · 바닥 금 몇 줄 · 연기
      const grow = easeOut(Math.min(1, f * 1.4));
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, 0.55);
      ctx.fillStyle = alpha(N_VOID, 0.55 * fade);
      ctx.beginPath();
      ctx.arc(0, 0, fx.size * grow, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = alpha(N_PINK, 0.85 * fade);
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * TAU + rnd(seed, i) * 0.5;
        let d = 10;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * d, Math.sin(ang) * d);
        for (let j = 0; j < 3; j++) {
          d += fx.size * 0.22 * grow;
          const bend = ang + (rnd(i, j + seed) - 0.5) * 0.4;
          ctx.lineTo(Math.cos(bend) * d, Math.sin(bend) * d);
        }
        ctx.stroke();
      }
      ctx.restore();
      ring2(ctx, x, y, fx.size * grow, 10 * fade + 2, N_PINK, N_VOID, fade);
      // 내려찍은 자리에서 솟는 날 둘 (X자)
      if (f < 0.5) {
        const k = 1 - f / 0.5;
        voidArc(ctx, x, y - 10, 26, -Math.PI * 0.95, -Math.PI * 0.05, 10 * k, k, 1);
      }
      smoke(ctx, x, y, 10, fx.size * 0.8, f, seed, 1);
      break;
    }
    case "ecSpark":
      // 맞은 자리: 짧은 꺾인 칼자국 (태양 빨강·노랑 / 일식 분홍 보라·검보라)
      if (w) voidArc(ctx, x - Math.cos(a) * 6, y - Math.sin(a) * 6, 8, a - 0.9, a + 0.9, 4 * fade, fade, 1);
      else rightSlash(ctx, x - Math.cos(a) * 7, y - Math.sin(a) * 7, Math.cos(a), Math.sin(a), 6, 1, 1, 0.9 * fade + 0.3, fade);
      break;
    case "ecBurn": {
      // 영역에 닿은 적 발밑에 작은 불꽃 한 가닥
      const h = 10 * (0.5 + f);
      const g = ctx.createLinearGradient(0, y + 4, 0, y + 4 - h);
      g.addColorStop(0, alpha(w ? N_VOID : S_RED, fade));
      g.addColorStop(1, alpha(w ? N_PINK : S_GOLD, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - 3, y + 4);
      ctx.quadraticCurveTo(x, y + 4 - h * 0.6, x + Math.sin(f * 9 + seed) * 2, y + 4 - h);
      ctx.quadraticCurveTo(x + 1, y + 4 - h * 0.4, x + 3, y + 4);
      ctx.fill();
      break;
    }
    case "ecTotal":
      // 개기일식: 금빛 고리와 검보라 고리가 함께 퍼짐
      ring2(ctx, x, y, fx.size * easeOut(f), 6 * fade + 1, S_GOLD, S_RED, fade);
      ring2(ctx, x, y, fx.size * 0.72 * easeOut(f), 6 * fade + 1, N_PINK, N_VOID, fade);
      break;
    case "ecCross":
      // 예전 저장의 5타 효과 (지금은 쓰지 않음)
      ctx.fillStyle = alpha(S_GOLD, fade);
      band(ctx, x, y, fx.size, a - 0.5, a + 0.5, 4 * fade);
      break;
  }
  return true;
}
