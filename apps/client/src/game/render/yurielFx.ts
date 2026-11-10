// 유리엘 기술 효과 — 단죄의 성녀 (금빛 · 흰 빛 · 성수 하늘색)
// 철퇴 휘두르기(금빛 초승달 + 철퇴 머리) · 사슬 한 바퀴(도는 사슬 고리) · 정화의 빛(빛 십자 기둥) · 1 정화의 빛(퍼지는 성수 물결) · 2 철퇴 던지기·떨어짐
// 3 수호 결계 펼침 · 4 기도(모이는 빛) · 내리꽂히는 빛의 철퇴 · 회복(초록 +)
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, crescent, easeOut, glow, rune, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

export const YR = { gold: "#f2c14e", light: "#fff6c0", white: "#ffffff", water: "#7ad8ff", deep: "#3a8ad8", chain: "#b8c0d0", green: "#8aff9a" };
const YR_FX = new Set(["yrSwingFx", "yrSpinFx", "yrPurgeFx", "yrLightFx", "yrMaceFx", "yrSlamFx", "yrWardFx", "yrUltFx", "yrHolyFx", "yrHealFx"]);

/** 철퇴 머리: 금빛 공 + 네 가시 */
export function maceHead(ctx: Ctx, x: number, y: number, r: number, al: number): void {
  glow(ctx, x, y, r * 2.4, YR.light, al * 0.7);
  ctx.fillStyle = alpha(YR.gold, al);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = alpha(YR.light, al);
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) ctx.fillRect(x + dx * (r + 1) - 1, y + dy * (r + 1) - 1, 2, 2);
  ctx.fillStyle = `rgba(255,255,255,${al})`;
  ctx.fillRect(x - r * 0.4, y - r * 0.5, 1.5, 1.5);
}

/** 사슬: (x,y)→(tx,ty) 고리 점선 */
export function chainLine(ctx: Ctx, x: number, y: number, tx: number, ty: number, al: number): void {
  const d = Math.hypot(tx - x, ty - y);
  const n = Math.max(1, Math.floor(d / 4));
  ctx.strokeStyle = alpha(YR.chain, al);
  ctx.lineWidth = 1;
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n;
    ctx.beginPath();
    ctx.ellipse(x + (tx - x) * u, y + (ty - y) * u, 1.8, 1.2, Math.atan2(ty - y, tx - x) + (i % 2 ? 0 : Math.PI / 2), 0, Math.PI * 2);
    ctx.stroke();
  }
}

/** 빛 십자 기둥 (x,y 바닥 · 높이 h) */
function holyCross(ctx: Ctx, x: number, y: number, h: number, al: number): void {
  beam(ctx, x, y, x, y - h, 3, YR.gold, al);
  beam(ctx, x - h * 0.28, y - h * 0.7, x + h * 0.28, y - h * 0.7, 2.5, YR.gold, al);
}

export function drawYurielFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!YR_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.3 ? 1 : 1 - (f - 0.3) / 0.7;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const r = fx.size;
  const seed = Math.abs(Math.round(fx.x * 7 + fx.y * 3));
  switch (fx.kind) {
    case "yrSwingFx": {
      // 철퇴 휘두르기: 금빛 초승달 자국 + 끝에 철퇴 머리 (1타·2타는 반대쪽으로)
      const dir = fx.style === 1 ? -1 : 1;
      const k = easeOut(Math.min(1, f * 1.6));
      const sw = a + dir * (-1.1 + 2.2 * k);
      additive(ctx, () => {
        crescent(ctx, x, y, r, a, 1.1 * k + 0.1, 9, YR.gold, fade * 0.8);
        chainLine(ctx, x, y, x + Math.cos(sw) * r * 0.85, y + Math.sin(sw) * r * 0.85, fade);
      });
      maceHead(ctx, x + Math.cos(sw) * r * 0.9, y + Math.sin(sw) * r * 0.9, 4, fade);
      return true;
    }
    case "yrSpinFx": {
      // 사슬 철퇴 한 바퀴: 둘레를 도는 철퇴 + 빛 고리 + 흩어지는 빛
      const sw = a + easeOut(f) * Math.PI * 2;
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.6 + 0.4 * easeOut(f)), YR.gold, fade * 0.7, 10);
        crescent(ctx, x, y, r, sw - 0.9, 0.9, 8, YR.light, fade * 0.7);
        sparks(ctx, x, y, 10, r, f, YR.light, seed, fade);
      });
      chainLine(ctx, x, y, x + Math.cos(sw) * r, y + Math.sin(sw) * r, fade);
      maceHead(ctx, x + Math.cos(sw) * r, y + Math.sin(sw) * r, 5, fade);
      return true;
    }
    case "yrPurgeFx": {
      // 정화의 빛: 단죄가 가득 찬 적 자리에 빛 십자 기둥 + 퍼지는 빛 고리
      additive(ctx, () => {
        glow(ctx, x, y, r * 1.4, YR.light, fade, 0.9);
        shock(ctx, x, y, r * easeOut(f) + 4, YR.gold, fade, 8);
        holyCross(ctx, x, y + 4, 40 * (0.6 + 0.4 * easeOut(f)), fade);
        sparks(ctx, x, y, 14, r * 1.3, f, YR.gold, seed, fade);
      });
      return true;
    }
    case "yrLightFx": {
      // 1 정화의 빛: 수정구의 성수가 물결로 퍼짐 (하늘색 + 금빛 문양)
      additive(ctx, () => {
        for (let i = 0; i < 3; i++) shock(ctx, x, y, r * easeOut(Math.min(1, f * 1.3 + i * 0.15)), i === 1 ? YR.gold : YR.water, fade * 0.8, 8);
        rune(ctx, x, y, r * 0.8, YR.gold, fade * 0.7, f * 2);
        glow(ctx, x, y - 10, 14, YR.water, fade, 0.8);
      });
      return true;
    }
    case "yrMaceFx": {
      // 2 철퇴 던지기: 손에서 떨어질 자리까지 사슬을 끌며 날아감 (높이 포물선)
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const mx = x + (tx - x) * f;
      const my = y + (ty - y) * f - Math.sin(f * Math.PI) * 30;
      additive(ctx, () => {
        chainLine(ctx, x, y - 6, mx, my, 1);
        ctx.strokeStyle = alpha(YR.gold, 0.6);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.ellipse(tx, ty, r, r * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });
      maceHead(ctx, mx, my, 5, 1);
      return true;
    }
    case "yrSlamFx": {
      // 철퇴 떨어짐: 금빛 충격파 + 땅 문양 + 튀는 빛
      additive(ctx, () => {
        glow(ctx, x, y, r * 1.2, YR.gold, fade, 0.6);
        shock(ctx, x, y, r * easeOut(f) + 3, YR.light, fade, 10);
        rune(ctx, x, y, r, YR.gold, fade * 0.8, -f);
        sparks(ctx, x, y, 16, r * 1.2, f, YR.gold, seed, fade);
      });
      maceHead(ctx, x, y - 2, 6, fade);
      return true;
    }
    case "yrWardFx": {
      // 3 수호 결계 펼침: 바닥 문양이 크게 펼쳐지며 빛 고리
      additive(ctx, () => {
        rune(ctx, x, y, r * easeOut(f), YR.water, fade, f * 3);
        shock(ctx, x, y, r * easeOut(f), YR.light, fade, 12);
      });
      return true;
    }
    case "yrUltFx": {
      // 4 기도: 하늘에서 빛이 모여 내려옴 (위로 갈수록 밝은 기둥 + 모이는 알갱이)
      additive(ctx, () => {
        beam(ctx, x, y - 8, x, y - 150, 6 + 10 * f, YR.light, 0.3 + 0.5 * f);
        glow(ctx, x, y - 14, 18 + 14 * f, YR.gold, 0.8, 0.9);
        for (let i = 0; i < 10; i++) {
          const ang = (i / 10) * Math.PI * 2 + f * 3;
          const d = r * (1 - f);
          glow(ctx, x + Math.cos(ang) * d, y - 14 + Math.sin(ang) * d * 0.55, 3, YR.light, 0.9);
        }
      });
      return true;
    }
    case "yrHolyFx": {
      // 내리꽂히는 빛의 철퇴: 하늘에서 빛줄기 → 땅에 닿으면 십자 섬광 (dirX 1: 유리엘 둘레 큰 빛)
      const drop = Math.min(1, f * 3);
      additive(ctx, () => {
        if (drop < 1) beam(ctx, x, y - 160 * (1 - drop), x, y - 160, 5, YR.light, 0.8);
        if (drop >= 1) {
          glow(ctx, x, y, r * 1.5, YR.light, fade, 1);
          shock(ctx, x, y, r * easeOut((f - 0.33) * 1.5), YR.gold, fade, 10);
          holyCross(ctx, x, y + 2, r * 1.6, fade);
        }
      });
      if (drop < 1) maceHead(ctx, x, y - 160 * (1 - drop), 6, 1);
      return true;
    }
    case "yrHealFx": {
      // 회복: 초록 + 들이 피어오름
      additive(ctx, () => {
        for (let i = 0; i < 5; i++) {
          const px = x + Math.cos(i * 1.3 + seed) * r;
          const py = y - 6 - f * 26 - i * 3;
          ctx.fillStyle = alpha(YR.green, fade);
          ctx.fillRect(px - 0.5, py - 3, 1.5, 7);
          ctx.fillRect(px - 3, py - 0.5, 7, 1.5);
        }
      });
      return true;
    }
  }
  return false;
}
