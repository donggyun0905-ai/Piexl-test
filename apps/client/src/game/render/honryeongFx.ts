// 혼령 효과: 연기용 내뿜기(4칸 그림을 차례로: 탄생 → 소멸, 속성마다 빛 색) · 연기 피어오름(구름·소환·사라짐) · 늑대 물기 · 범 할퀴기
// 부엉이 낙하 · 분신 터짐 · 용 한 번 때림 · 공포
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, alpha, crescent, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";
import { HR, hrPic } from "./honryeongArt";

const KINDS = new Set(["hrBreath", "hrPuff", "hrBite", "hrClaw", "hrDive", "hrPop", "hrDragonHit", "hrFear"]);
/** 무기 속성 빛 (0 없음 · 화상 · 느려짐 · 중독 · 회복 · 기절 · 출혈) */
const TINT = [HR.smoke, "#ff8a3a", "#8ad8ff", "#7ae05a", "#b8ffb0", "#ffe04a", "#ff4a5a"];

export function drawHonryeongFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.6 ? (1 - f) / 0.4 : 1;
  switch (fx.kind) {
    case "hrBreath": {
      // 곰방대 끝에서 연기용이 태어나 뻗었다 흩어짐
      const frame = Math.min(3, Math.floor(f * 4));
      const d = fx.size * 0.55;
      const cx = x + fx.dirX * d;
      const cy = y + fx.dirY * d;
      const tint = TINT[fx.style ?? 0] ?? HR.smoke;
      additive(ctx, () => glow(ctx, cx, cy, fx.size * 0.45, tint, 0.3 * a));
      hrPic(ctx, 0, frame, cx, cy, fx.size * 1.25, 0.95, Math.atan2(fx.dirY, fx.dirX));
      return true;
    }
    case "hrPuff": {
      const r = fx.size * (fx.style === 2 ? 0.6 + f * 0.6 : 0.4 + easeOut(f) * 0.5);
      additive(ctx, () => glow(ctx, x, y, r, HR.smoke, 0.4 * (1 - f)));
      ring(ctx, x, y, r, alpha(HR.pale, 0.6 * (1 - f)), 1.5);
      if (fx.style) sparks(ctx, x, y, 6, r * 1.2, f, HR.pale, fx.ticks, 1 - f);
      return true;
    }
    case "hrBite":
    case "hrClaw": {
      const n = fx.kind === "hrClaw" ? 3 : 2;
      const col = fx.style ? "#ff5a7a" : HR.pale;
      additive(ctx, () => {
        for (let i = 0; i < n; i++) crescent(ctx, x + (i - (n - 1) / 2) * fx.size * 0.35, y, fx.size * (0.7 + f * 0.3), -0.9 + f * 0.5, 0.9, Math.max(2, fx.size * 0.14), col, 0.9 * a);
      });
      if (fx.style) sparks(ctx, x, y, 6, fx.size, f, "#ff5a7a", fx.ticks, a);
      return true;
    }
    case "hrDive":
      additive(ctx, () => glow(ctx, x, y, fx.size, HR.smoke, 0.6 * a, 0.3));
      shock(ctx, x, y, fx.size * easeOut(f), HR.pale, a, 3);
      sparks(ctx, x, y, 8, fx.size * 1.1, f, HR.white, fx.ticks, a);
      return true;
    case "hrPop":
      // 분신이 터짐: 구름 그림이 부풀며 흩어짐
      additive(ctx, () => glow(ctx, x, y, fx.size, HR.smoke, 0.7 * a, 0.3));
      hrPic(ctx, 3, 3, x, y, fx.size * (1.4 + easeOut(f) * 1.4), 0.9 * (1 - f));
      shock(ctx, x, y, fx.size * easeOut(f), HR.pale, a, 3);
      return true;
    case "hrDragonHit":
      additive(ctx, () => glow(ctx, x, y, fx.size + 6, HR.white, 0.7 * (1 - f), 0.5));
      sparks(ctx, x, y, 5, fx.size + 12, f, HR.smoke, fx.style ?? 0, 1 - f);
      return true;
    case "hrFear": {
      // 겁에 질림: 머리 위 보랏빛 느낌표
      const up = y - 6 - easeOut(f) * 5;
      ctx.fillStyle = alpha(HR.smoke, a);
      ctx.fillRect(x - 1, up - 6, 2, 5);
      ctx.fillRect(x - 1, up, 2, 2);
      return true;
    }
  }
  return false;
}
