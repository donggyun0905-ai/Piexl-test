// 미카엘라 기술 효과 — 공허의 인도자 (은빛 검 · 금빛 투창 · 공허 보라 · 폭발 주황). 그림 도구는 michaelaArt
// 검 베기(은빛 초승달) · 창 찌르기(빛줄기) · 투척(날아가는 무기·빛 꼬리) · 폭발(연쇄는 보라) · 떨어지는 무기(하늘에서 사선으로 꽂힘) · 포탈 · 바꿔 듦 · 순간 이동 · 무기고
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, crescent, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { blade, MC, portal } from "./michaelaArt";

const MC_FX = new Set(["mcSlashFx", "mcThrustFx", "mcThrowFx", "mcBlastFx", "mcFallFx", "mcPortalFx", "mcSwapFx", "mcBlinkFx", "mcUltFx"]);

export function drawMichaelaFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!MC_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.3 ? 1 : 1 - (f - 0.3) / 0.7;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const r = fx.size;
  const seed = Math.abs(Math.round(fx.x * 7 + fx.y * 3));
  const tx = snap(fx.toX ?? fx.x);
  const ty = snap(fx.toY ?? fx.y);
  switch (fx.kind) {
    case "mcSlashFx": {
      // 검 베기: 은빛 초승달 (1타·2타 반대로 기울임) + 끝에 검
      const tilt = fx.style === 1 ? 0.35 : -0.35;
      additive(ctx, () => crescent(ctx, x, y, r, a + tilt, 1 * easeOut(Math.min(1, f * 1.8)) + 0.1, 8, MC.silver, fade * 0.85));
      const sw = a + tilt + (fx.style === 1 ? -1 : 1) * (easeOut(f) * 2 - 1);
      blade(ctx, x + Math.cos(sw) * r, y + Math.sin(sw) * r, sw + Math.PI, 0, 12, fade);
      return true;
    }
    case "mcThrustFx": {
      // 창 찌르기: 앞으로 뻗는 금빛 빛줄기 + 창
      const k = easeOut(Math.min(1, f * 2));
      const ex = x + Math.cos(a) * r * k;
      const ey = y + Math.sin(a) * r * k;
      additive(ctx, () => beam(ctx, x, y, ex, ey, 3, MC.gold, fade));
      blade(ctx, ex, ey, a + Math.PI, 1, 18, fade);
      return true;
    }
    case "mcThrowFx": {
      // 투척: 무기가 날아가며 빛 꼬리
      const k = easeOut(f);
      const mx = x + (tx - x) * k;
      const my = y + (ty - y) * k;
      additive(ctx, () => beam(ctx, x + (tx - x) * Math.max(0, k - 0.35), y + (ty - y) * Math.max(0, k - 0.35), mx, my, 2, fx.style === 1 ? MC.gold : MC.silver, 0.7 * fade));
      blade(ctx, mx, my, a + Math.PI, fx.style ?? 0, 14, 1);
      return true;
    }
    case "mcBlastFx": {
      // 폭발: 주황 빛 + 충격파 + 불똥 (연쇄로 터진 것은 보라빛이 섞임)
      const c = fx.dirX === 1 ? MC.violet : MC.orange;
      additive(ctx, () => {
        glow(ctx, x, y, r * 1.3, c, fade, 1);
        shock(ctx, x, y, r * easeOut(f) + 3, c, fade, 8);
        sparks(ctx, x, y, 12, r * 1.2, f, MC.light, seed, fade);
      });
      return true;
    }
    case "mcFallFx": {
      // 떨어지는 무기: 하늘에서 사선으로 내리꽂힘 · 땅에 예고 고리
      const k = f * f;
      const hx = x + 30 * (1 - k);
      const hy = y - 110 * (1 - k);
      additive(ctx, () => {
        ctx.strokeStyle = alpha(MC.violet, 0.5 * f);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        beam(ctx, hx + 9, hy - 33, hx, hy, 1.5, MC.light, 0.5);
      });
      blade(ctx, hx, hy, Math.atan2(-110, 30), fx.dirX, 16, 1);
      return true;
    }
    case "mcPortalFx": {
      // 포탈: 열렸다가 닫힘
      const open = f < 0.2 ? f / 0.2 : f > 0.8 ? (1 - f) / 0.2 : 1;
      portal(ctx, x, y, r * open, f * 8, open);
      return true;
    }
    case "mcSwapFx": {
      // 바꿔 듦: 무기가 손으로 솟구치며 빛 고리
      additive(ctx, () => {
        shock(ctx, x, y, r * easeOut(f), MC.violet, fade, 6);
        glow(ctx, x, y - 10 * f, 10, MC.light, fade, 0.8);
      });
      blade(ctx, x, y - 4 - 16 * easeOut(f), Math.PI / 2, fx.dirX, 14, fade);
      return true;
    }
    case "mcBlinkFx": {
      // 순간 이동: 떠난 자리 → 도착 자리 보라 빛줄기 + 양끝 포탈
      additive(ctx, () => {
        beam(ctx, x, y - 6, tx, ty - 6, 3 * fade, MC.violet, fade);
        shock(ctx, tx, ty, r * easeOut(f), MC.silver, fade, 8);
      });
      portal(ctx, x, y, 12 * fade, f * 6, fade);
      portal(ctx, tx, ty, 14 * fade, -f * 6, fade);
      return true;
    }
    case "mcUltFx": {
      // 무한의 무기고: 머리 위로 커다란 포탈이 열리며 무기 고리가 돎
      portal(ctx, x, y - 60, r * easeOut(Math.min(1, f * 2)), f * 10, fade);
      for (let i = 0; i < 8; i++) {
        const an = f * 6 + (i / 8) * Math.PI * 2;
        blade(ctx, x + Math.cos(an) * r, y - 60 + Math.sin(an) * r * 0.45, Math.PI / 2 * -1, i % 2, 12, fade);
      }
      return true;
    }
  }
  return false;
}
