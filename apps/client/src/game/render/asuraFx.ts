// 아수라 효과: 기본 펀치(일반펀치 3칸) · 연속 펀치(3칸을 되풀이) · 파동(부채꼴 물결) · 악귀(붉게 터짐)
// 각성 1·2타 · 3타(바닥 연속 강타) · 4타 (모두 4칸, 효과 길이 = 다음 공격까지라 계속 누르면 이어짐) · 육비 난무 맞음
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, crescent, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
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
      // 일반펀치 3칸: 앞 주먹 → 위 주먹 → 옆 주먹 (치는 차례마다 처음 칸이 다름) · 맞는 자리 빛 튐
      sparks(ctx, x, y, 5, fx.size * 0.7, f, AS.light, fx.ticks, a * 0.8);
      asPic(ctx, 0, ((fx.style ?? 0) + Math.min(2, Math.floor(f * 3))) % 3, x, y, fx.size * 2.4, a, Math.min(2, Math.floor(f * 3)) === 2 ? ang : 0);
      return true;
    case "asRapid":
      asPic(ctx, 1, fx.ticks % 3, x, y, fx.size * 2.6, a, 0, left);
      return true;
    case "asWave": {
      // 파동: 앞으로 퍼지는 두 겹 초승달 물결 + 끝에 튀는 빛
      const r = fx.size * (0.45 + easeOut(f) * 0.55);
      additive(ctx, () => {
        crescent(ctx, x, y, r, ang, 1.05, Math.max(4, fx.size * 0.22), AS.blue, 0.85 * a);
        crescent(ctx, x, y, r * 0.78, ang, 0.85, Math.max(3, fx.size * 0.12), AS.light, 0.6 * a);
      });
      sparks(ctx, x + fx.dirX * r, y + fx.dirY * r, 6, fx.size * 0.3, f, AS.light, fx.ticks, a);
      return true;
    }
    case "asDemon":
      // 악귀: 붉은 섬광 · 퍼지는 충격 고리 · 사방 가시 불티
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * (0.5 + f * 0.6), AS.red, 0.9 * a, 0.45);
        shock(ctx, x, y, fx.size * (0.3 + easeOut(f) * 0.9), AS.red, 0.8 * a, Math.max(2, fx.size * 0.25));
      });
      sparks(ctx, x, y, 10, fx.size * (0.4 + f * 1.1), f, "#ff8a6a", fx.ticks, a);
      return true;
    case "asAwk12":
      asPic(ctx, 3, four, x, y, fx.size * 2.6, a, left ? ang + Math.PI : ang, left);
      return true;
    case "asAwk3":
      // 바닥 강타: 내리칠 때마다 바닥에 충격 고리
      additive(ctx, () => shock(ctx, x, y, fx.size * (0.4 + easeOut(f) * 0.6), AS.blue, 0.6 * a, Math.max(3, fx.size * 0.18)));
      asPic(ctx, 4, four, x, y - fx.size * 0.25, fx.size * 2.6, a);
      return true;
    case "asAwk4":
      asPic(ctx, 5, four, x, y - fx.size * 0.25, fx.size * 2.6, a);
      if (four >= 2) additive(ctx, () => shock(ctx, x, y, fx.size * (0.5 + easeOut(f) * 0.7), AS.light, 0.8 * a, Math.max(3, fx.size * 0.2)));
      return true;
    default:
      additive(ctx, () => glow(ctx, x, y, fx.size * (0.6 + f * 0.6), AS.blue, 0.8 * a, 0.3));
      return true;
  }
}
