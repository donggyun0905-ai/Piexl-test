// 미카엘라 기술 효과 — 공허의 인도자. 무기는 사용자 그림에서 잘라 낸 그림(weapon) · 빛·꼬리 색은 그 무기 속성 색 · 폭발 모양은 michaelaElem
// 검 베기(속성 색 초승달) · 창 찌르기(빛줄기) · 투척(날아가는 무기·빛 꼬리) · 폭발 · 떨어지는 무기(하늘에서 사선으로 꽂힘) · 포탈 · 바꿔 듦 · 순간 이동 · 무기고 · 자전 번개
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, crescent, easeOut, shock, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { MC, palOf, palW, portal, weapon, WEAPON_N } from "./michaelaArt";
import { bolt, elemBlast } from "./michaelaElem";

const MC_FX = new Set(["mcSlashFx", "mcThrustFx", "mcThrowFx", "mcBlastFx", "mcFallFx", "mcPortalFx", "mcSwapFx", "mcBlinkFx", "mcUltFx", "mcBoltFx"]);

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
  // 베기·찌르기: style = 그림 무기 × 2 + 단계 · 투척·떨어짐·바꿔 듦·순간 이동: style = 그림 무기 · 폭발: style = 속성
  const st = fx.style ?? 0;
  const pair = fx.kind === "mcSlashFx" || fx.kind === "mcThrustFx";
  const w = pair ? Math.floor(st / 2) : st;
  const k = pair ? st % 2 : 0;
  const P = palW(w);
  const spear = w < 21;
  switch (fx.kind) {
    case "mcSlashFx": {
      // 검 베기: 속성 색 초승달 (1타·2타 반대로 기울임) + 끝에 검 · 자전이면 번개가 따라감
      const tilt = k === 1 ? 0.35 : -0.35;
      const sw = a + tilt + (k === 1 ? -1 : 1) * (easeOut(f) * 2 - 1);
      additive(ctx, () => {
        crescent(ctx, x, y, r, a + tilt, 1 * easeOut(Math.min(1, f * 1.8)) + 0.1, 8, P.glow, fade * 0.85);
        crescent(ctx, x, y, r * 0.8, a + tilt, 0.8 * easeOut(Math.min(1, f * 1.8)) + 0.1, 4, P.trim, fade * 0.6);
        if (P === palOf(5)) bolt(ctx, x, y, x + Math.cos(sw) * r, y + Math.sin(sw) * r, P.glow, fade, seed);
      });
      weapon(ctx, x + Math.cos(sw) * r, y + Math.sin(sw) * r, sw + Math.PI, w, 34, fade);
      return true;
    }
    case "mcThrustFx": {
      // 창 찌르기: 앞으로 뻗는 속성 빛줄기 + 창
      const kk = easeOut(Math.min(1, f * 2));
      const ex = x + Math.cos(a) * r * kk;
      const ey = y + Math.sin(a) * r * kk;
      additive(ctx, () => {
        beam(ctx, x, y, ex, ey, 3, P.glow, fade);
        if (P === palOf(5)) bolt(ctx, x, y, ex, ey, "#ffffff", fade, seed);
      });
      weapon(ctx, ex, ey, a + Math.PI, w, 44, fade);
      return true;
    }
    case "mcThrowFx": {
      // 투척: 속성 무기가 날아가며 그 색 빛 꼬리
      const kk = easeOut(f);
      const mx = x + (tx - x) * kk;
      const my = y + (ty - y) * kk;
      const back = Math.max(0, kk - 0.35);
      additive(ctx, () => beam(ctx, x + (tx - x) * back, y + (ty - y) * back, mx, my, 2.5, P.glow, 0.75 * fade));
      weapon(ctx, mx, my, a + Math.PI, w, spear ? 40 : 32, 1);
      return true;
    }
    case "mcBlastFx":
      elemBlast(ctx, x, y, r, st, f, fade, seed, fx.dirX === 1);
      return true;
    case "mcFallFx": {
      // 떨어지는 무기: 하늘에서 사선으로 내리꽂힘 · 땅에 속성 색 예고 고리
      const kk = f * f;
      const hx = x + 30 * (1 - kk);
      const hy = y - 110 * (1 - kk);
      additive(ctx, () => {
        ctx.strokeStyle = alpha(P.glow, 0.5 * f);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        beam(ctx, hx + 9, hy - 33, hx, hy, 1.5, P.glow, 0.5);
      });
      weapon(ctx, hx, hy, Math.atan2(-110, 30), w, spear ? 44 : 36, 1);
      return true;
    }
    case "mcPortalFx": {
      const open = f < 0.2 ? f / 0.2 : f > 0.8 ? (1 - f) / 0.2 : 1;
      portal(ctx, x, y, r * open, f * 8, open);
      return true;
    }
    case "mcSwapFx": {
      // 바꿔 듦: 속성 색 고리 · 무기가 손으로 솟구침
      additive(ctx, () => shock(ctx, x, y, r * easeOut(f), P.glow, fade, 6));
      weapon(ctx, x, y - 4 - 16 * easeOut(f), Math.PI / 2, w, spear ? 40 : 32, fade);
      return true;
    }
    case "mcBlinkFx": {
      // 순간 이동: 보라 빛줄기 + 양끝 포탈 · 도착 자리는 그 무기 색 고리
      additive(ctx, () => {
        beam(ctx, x, y - 6, tx, ty - 6, 3 * fade, MC.violet, fade);
        shock(ctx, tx, ty, r * easeOut(f), P.glow, fade, 8);
      });
      portal(ctx, x, y, 12 * fade, f * 6, fade);
      portal(ctx, tx, ty, 14 * fade, -f * 6, fade);
      return true;
    }
    case "mcUltFx": {
      // 무한의 무기고: 머리 위 커다란 포탈 + 여덟 속성 무기 고리
      portal(ctx, x, y - 60, r * easeOut(Math.min(1, f * 2)), f * 10, fade);
      for (let i = 0; i < 8; i++) {
        const an = f * 6 + (i / 8) * Math.PI * 2;
        weapon(ctx, x + Math.cos(an) * r, y - 60 + Math.sin(an) * r * 0.45 + 12, -Math.PI / 2, (i * 5) % WEAPON_N, 30, fade);
      }
      return true;
    }
    case "mcBoltFx":
      // 자전: 맞은 적에서 옆 적으로 번개가 튐
      additive(ctx, () => bolt(ctx, x, y - 6, tx, ty - 6, palOf(5).glow, fade, seed));
      return true;
  }
  return false;
}
