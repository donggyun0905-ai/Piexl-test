// 미카엘라 무기 기술 그림 (mcMoveFx · style = 기술 번호 × 64 + 그림 무기 번호): 그 무기 그림이 기술 모양대로 움직이고 빛·꼬리는 그 무기 속성 색
// 베기 · 내려찍기(위에서 꽂히며 땅이 갈라짐) · 휘두르기(넓은 초승달) · 회전 베기 · 찌르기 · 돌진 찌르기(잔상) · X 베기 · 땅 가르기(줄지어 솟는 땅) · 올려베기 · 회오리 · 칼비(바닥 문양) · 꿰뚫는 빛 창
import { MC_MOVE_IDS, MC_WEAPON_ELEM, type EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, crescent, easeOut, glow, rune, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { palW, weapon } from "./michaelaArt";
import { bolt } from "./michaelaElem";

/** 무기를 a0 → a1로 휘두름 (날 끝이 반지름 r · 손잡이는 몸 쪽, 무기가 범위를 꽉 채우게 크게) */
function swingW(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, u: number, w: number, _len: number, al: number): void {
  const an = a0 + (a1 - a0) * u;
  weapon(ctx, x + Math.cos(an) * r, y + Math.sin(an) * r, an + Math.PI, w, Math.max(40, r * 0.95), al, 0.3);
}

export function drawMichaelaMove(ctx: Ctx, fx: EffectState, snap: Snap): void {
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.35 ? 1 : 1 - (f - 0.35) / 0.65;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const tx = snap(fx.toX ?? fx.x);
  const ty = snap(fx.toY ?? fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const r = fx.size;
  const st = fx.style ?? 0;
  const w = st % 64;
  const m = MC_MOVE_IDS[Math.floor(st / 64)];
  const P = palW(w);
  const len = w < 21 ? 52 : 46;
  const seed = Math.abs(Math.round(fx.x * 7 + fx.y * 3));
  const k = easeOut(Math.min(1, f * 1.8));
  const storm = MC_WEAPON_ELEM[w] === 5;
  switch (m) {
    case "slash":
      additive(ctx, () => crescent(ctx, x, y, r, a, 1 * k + 0.1, 8, P.glow, fade * 0.85));
      swingW(ctx, x, y, r, a - 1.1, a + 1.1, k, w, len, fade);
      break;
    case "sweep":
      // 휘두르기: 앞을 크게 쓸어 내는 넓고 두꺼운 초승달 + 바람 줄
      additive(ctx, () => {
        crescent(ctx, x, y, r, a, 1.9 * k + 0.1, 14, P.glow, fade * 0.8);
        crescent(ctx, x, y, r * 0.75, a, 1.7 * k + 0.1, 6, P.trim, fade * 0.5);
      });
      swingW(ctx, x, y, r, a - 1.9, a + 1.9, k, w, len, fade);
      break;
    case "rise": {
      // 올려베기: 아래에서 위로 솟구치는 초승달 + 위로 튀는 빛
      const lift = 14 * k;
      additive(ctx, () => {
        crescent(ctx, x, y - lift, r, a - 0.5, 0.9 * k + 0.1, 9, P.glow, fade * 0.85);
        beam(ctx, x + Math.cos(a) * r * 0.6, y, x + Math.cos(a) * r * 0.6, y - 30 * k, 2, P.glow, fade * 0.6);
      });
      swingW(ctx, x, y - lift, r, a + 1.2, a - 1.3, k, w, len, fade);
      break;
    }
    case "cross": {
      // X 베기: 앞에서 / 와 \ 두 번 베어 X 자국
      const u1 = Math.min(1, f * 3);
      const u2 = Math.max(0, Math.min(1, f * 3 - 1));
      additive(ctx, () => {
        crescent(ctx, x, y, r, a - 0.45, 0.8 * easeOut(u1) + 0.05, 7, P.glow, fade * 0.85);
        if (u2 > 0) crescent(ctx, x, y, r, a + 0.45, 0.8 * easeOut(u2) + 0.05, 7, P.trim, fade * 0.85);
      });
      swingW(ctx, x, y, r, u2 > 0 ? a + 1.2 : a - 1.2, u2 > 0 ? a - 0.4 : a + 0.4, u2 > 0 ? u2 : u1, w, len, fade);
      break;
    }
    case "spin":
    case "whirl": {
      // 회전 베기 · 회오리: 무기가 몸 둘레를 돌며 둥근 빛 자국 (회오리는 여러 바퀴 · 소용돌이 줄)
      const turns = m === "whirl" ? 3 : 1;
      const an = a + f * Math.PI * 2 * turns;
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.7 + 0.3 * k), P.glow, fade * 0.6, 10);
        crescent(ctx, x, y, r, an - 1, 1, 9, P.glow, fade * 0.8);
        if (m === "whirl") for (let i = 0; i < 3; i++) crescent(ctx, x, y, r * (0.45 + i * 0.2), an * (1 + i * 0.3) + i * 2, 0.8, 4, P.trim, fade * 0.5);
      });
      weapon(ctx, x + Math.cos(an) * r, y + Math.sin(an) * r, an + Math.PI, w, Math.max(40, r * 0.95), fade, 0.3);
      break;
    }
    case "slam": {
      // 내려찍기: 무기가 위에서 날 끝부터 꽂히고 → 땅에 금이 가며 충격파
      const drop = Math.min(1, f / 0.35);
      if (drop < 1) weapon(ctx, x, y - 70 * (1 - drop * drop), -Math.PI / 2, w, len + 6, 1, 0.3);
      else {
        const u = (f - 0.35) / 0.65;
        additive(ctx, () => {
          glow(ctx, x, y, r * 1.1, P.glow, fade * 0.5);
          shock(ctx, x, y, r * easeOut(u) + 4, P.glow, fade, 8);
          ctx.strokeStyle = alpha(P.trim, fade);
          ctx.lineWidth = 1.5;
          for (let i = 0; i < 7; i++) {
            const g = (i / 7) * Math.PI * 2 + seed;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(g) * r * 0.6, y + Math.sin(g) * r * 0.35);
            ctx.lineTo(x + Math.cos(g + 0.2) * r * easeOut(u), y + Math.sin(g + 0.2) * r * 0.55 * easeOut(u));
            ctx.stroke();
          }
          sparks(ctx, x, y, 10, r, u, P.glow, seed, fade);
        });
        weapon(ctx, x, y + 2, -Math.PI / 2, w, len + 6, fade, 0);
      }
      break;
    }
    case "thrust": {
      // 찌르기: 무기가 앞으로 쭉 뻗고 빛줄기
      const ex = x + (tx - x) * k;
      const ey = y + (ty - y) * k;
      additive(ctx, () => {
        beam(ctx, x, y, ex, ey, 3, P.glow, fade);
        if (storm) bolt(ctx, x, y, ex, ey, "#ffffff", fade, seed);
      });
      weapon(ctx, ex, ey, a + Math.PI, w, len + 6, fade, 0.3);
      break;
    }
    case "lunge": {
      // 돌진 찌르기: 떠난 자리 → 도착 자리 잔상 셋 + 빛 꼬리
      additive(ctx, () => beam(ctx, x, y, tx, ty, 5 * fade, P.glow, fade * 0.8));
      for (let i = 0; i < 3; i++) {
        const u = (i + 1) / 3;
        weapon(ctx, x + (tx - x) * u + Math.cos(a) * 14, y + (ty - y) * u + Math.sin(a) * 14, a + Math.PI, w, len + 4, fade * (0.3 + u * 0.7), 0.2);
      }
      break;
    }
    case "quake": {
      // 땅 가르기: 무기를 땅에 박자 줄을 따라 땅이 차례로 솟고 금이 감
      weapon(ctx, x + Math.cos(a) * 10, y + Math.sin(a) * 6 + 2, -Math.PI / 2, w, len + 6, fade, 0.3);
      const n = 7;
      additive(ctx, () => {
        ctx.strokeStyle = alpha(P.trim, fade);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let i = 1; i <= n; i++) {
          const u = Math.min(i / n, k);
          ctx.lineTo(x + (tx - x) * u + (i % 2 ? 3 : -3), y + (ty - y) * u + (i % 2 ? -2 : 2));
        }
        ctx.stroke();
        for (let i = 1; i <= n; i++) {
          const u = i / n;
          if (u > k + 0.05) break;
          const px = x + (tx - x) * u;
          const py = y + (ty - y) * u;
          const h = r * (0.8 + 0.6 * ((i * 37) % 5) / 5) * fade;
          ctx.fillStyle = alpha(P.blade, fade * 0.9);
          ctx.beginPath();
          ctx.moveTo(px - 4, py);
          ctx.lineTo(px, py - h);
          ctx.lineTo(px + 4, py);
          ctx.fill();
          glow(ctx, px, py, 10, P.glow, fade * 0.7);
        }
      });
      break;
    }
    case "skyfall":
      // 칼비: 떨어질 자리 바닥에 도는 문양 + 하늘의 빛 (떨어지는 무기는 mcFallFx)
      additive(ctx, () => {
        rune(ctx, x, y, r, P.glow, fade, f * 4);
        glow(ctx, x, y - 70, 22, P.glow, fade * 0.7, 0.5);
      });
      break;
    case "pierce": {
      // 꿰뚫는 빛 창: 굵은 빛줄기가 순식간에 뻗고 무기가 맨 앞에서 날아감
      const ex = x + (tx - x) * Math.min(1, f * 3);
      const ey = y + (ty - y) * Math.min(1, f * 3);
      additive(ctx, () => {
        beam(ctx, x, y, ex, ey, r * fade + 2, P.glow, fade);
        glow(ctx, ex, ey, r * 2, P.glow, fade, 1);
        if (storm) bolt(ctx, x, y, ex, ey, "#ffffff", fade, seed);
      });
      weapon(ctx, ex, ey, a + Math.PI, w, len + 10, fade, 0.5);
      break;
    }
  }
}
