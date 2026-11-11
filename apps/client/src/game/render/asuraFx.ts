// 아수라 효과: 기본 펀치(일반펀치 3칸) · 연속 펀치(3칸을 되풀이) · 파동(부채꼴 물결) · 악귀(붉게 터짐)
// 각성 1·2타 · 3타(바닥 연속 강타) · 4타 (모두 4칸, 효과 길이 = 다음 공격까지라 계속 누르면 이어짐) · 육비 난무 맞음
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, alpha as fade, glow, ring, sparks, type Ctx } from "./pwFxBits";
import { AS, asPic } from "./asuraArt";

const KINDS = new Set(["asPunch", "asRapid", "asWave", "asDemon", "asAwk12", "asAwk3", "asAwk4", "asFistHit"]);

export function drawAsuraFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.75 ? (1 - f) / 0.25 : 1;
  const ang = Math.atan2(fx.dirY, fx.dirX);
  const four = Math.min(3, Math.floor(f * 4));
  const left = fx.dirX < 0;
  switch (fx.kind) {
    case "asPunch":
      // 일반펀치 3칸: 앞 주먹 → 위 주먹 → 옆 주먹 (치는 차례마다 처음 칸이 다름)
      asPic(ctx, 0, ((fx.style ?? 0) + Math.min(2, Math.floor(f * 3))) % 3, x, y, fx.size * 2.4, a, Math.min(2, Math.floor(f * 3)) === 2 ? ang : 0);
      return true;
    case "asRapid":
      asPic(ctx, 1, fx.ticks % 3, x, y, fx.size * 2.6, a, 0, left);
      return true;
    case "asWave": {
      const r = fx.size * (0.5 + f * 0.5);
      additive(ctx, () => {
        ctx.strokeStyle = fade(AS.blue, 0.8 * a);
        ctx.lineWidth = Math.max(2, fx.size * 0.12);
        ctx.beginPath();
        ctx.arc(x, y, r, ang - 1.05, ang + 1.05);
        ctx.stroke();
        ctx.strokeStyle = fade(AS.light, 0.6 * a);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.8, ang - 0.9, ang + 0.9);
        ctx.stroke();
      });
      return true;
    }
    case "asDemon":
      additive(ctx, () => glow(ctx, x, y, fx.size * (0.5 + f * 0.6), AS.red, 0.85 * a, 0.35));
      ring(ctx, x, y, fx.size * (0.4 + f * 0.8), fade(AS.red, 0.8 * a), 2);
      sparks(ctx, x, y, 8, fx.size * (0.4 + f), f, "#ff8a6a", fx.ticks, a);
      return true;
    case "asAwk12":
      asPic(ctx, 3, four, x, y, fx.size * 2.6, a, left ? ang + Math.PI : ang, left);
      return true;
    case "asAwk3":
      asPic(ctx, 4, four, x, y - fx.size * 0.25, fx.size * 2.6, a);
      return true;
    case "asAwk4":
      asPic(ctx, 5, four, x, y - fx.size * 0.25, fx.size * 2.6, a);
      if (four >= 2) ring(ctx, x, y, fx.size * (0.6 + f * 0.5), fade(AS.light, 0.7 * a), 2);
      return true;
    default:
      additive(ctx, () => glow(ctx, x, y, fx.size * (0.6 + f * 0.6), AS.blue, 0.8 * a, 0.3));
      return true;
  }
}
