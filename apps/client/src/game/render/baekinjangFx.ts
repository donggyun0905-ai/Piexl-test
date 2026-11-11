// 백인장 효과: 시트 4칸 그림 12종 (혈월 쌍검격·적색 난무·선혈 회전참·섬광 돌진베기·붉은 날개 폭우·추적 침격·관통 나선창·기계익 충격파·적안 표식·혈철 감옥·사신의 팔연참·종언의 붉은 날개)
// + 붉은 십자(종언 마지막)·별 폭발(팔연참 마지막) · 붉은 레이저 선 · 드론 찌름
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import { BJ, bjLaser, bjPic, ROW } from "./baekinjangArt";

const EXTRA = new Set(["bjCross", "bjLine", "bjDroneHit"]);

export function drawBaekinjangFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const row = ROW[fx.kind as keyof typeof ROW];
  if (row === undefined && !EXTRA.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.8 ? (1 - f) / 0.2 : 1;
  const ang = Math.atan2(fx.dirY, fx.dirX);
  const four = Math.min(3, Math.floor(f * 4));
  const left = fx.dirX < 0;
  const turn = left ? ang + Math.PI : ang;
  switch (fx.kind) {
    case "bjLine":
      bjLaser(ctx, x, y, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), 1 - f, fx.size);
      if (f < 0.4) additive(ctx, () => glow(ctx, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), 7, BJ.light, 0.8, 0.3));
      return true;
    case "bjDroneHit":
      sparks(ctx, x, y, 4, fx.size * (0.6 + f), f, BJ.light, fx.ticks, a);
      return true;
    case "bjCross": {
      if (fx.style === 1) {
        // 팔연참 마지막: 별 모양 폭발 (시트 마지막 칸을 키우며)
        bjPic(ctx, ROW.bjReaper, 3, x, y, fx.size * (1.8 + easeOut(f) * 0.8), 1 - f);
        additive(ctx, () => shock(ctx, x, y, fx.size * (0.4 + easeOut(f) * 0.8), BJ.red, 0.8 * (1 - f), Math.max(3, fx.size * 0.2)));
        return true;
      }
      // 붉은 십자: 세로가 긴 십자 빛기둥이 내리꽂히고 가늘어짐
      const k = fx.size * (0.6 + easeOut(Math.min(1, f * 3)) * 0.4);
      const w = Math.max(1, (1 - f) * fx.size * 0.16);
      bjLaser(ctx, x, y - k * 1.5, x, y + k * 0.9, a, w);
      bjLaser(ctx, x - k * 0.8, y - k * 0.3, x + k * 0.8, y - k * 0.3, a, w);
      additive(ctx, () => glow(ctx, x, y - k * 0.3, fx.size * 0.6, BJ.red, 0.7 * a, 0.3));
      sparks(ctx, x, y, 8, fx.size * (0.5 + f), f, BJ.light, fx.ticks, a);
      return true;
    }
    case "bjDash":
    case "bjSpear": {
      // 지나온 줄 가운데에 길게
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const len = Math.max(30, Math.hypot(tx - x, ty - y));
      bjLaser(ctx, x, y, tx, ty, a * 0.6, fx.kind === "bjSpear" ? 3 : 1.5);
      bjPic(ctx, row!, four, (x + tx) / 2, (y + ty) / 2, len * 1.15, a, turn, left);
      return true;
    }
    case "bjSlash":
    case "bjFlurry":
      sparks(ctx, x, y, 5, fx.size * 0.8, f, BJ.light, fx.ticks, a * 0.8);
      bjPic(ctx, row!, four, x, y, fx.size * 2.6, a, turn, left);
      return true;
    case "bjRain":
    case "bjNeedle":
      // 길게 이어지는 기술: 처음 세 칸이 나온 뒤 마지막 두 칸을 오감
      bjPic(ctx, row!, f < 0.3 ? Math.floor(f * 10) : 2 + (Math.floor(fx.ticks / 4) % 2), x, y, fx.size * 2.4, a, turn, left);
      return true;
    case "bjSpin":
      bjPic(ctx, row!, four, x, y, fx.size * 2.5, a);
      return true;
    case "bjShock":
      additive(ctx, () => shock(ctx, x, y, fx.size * (0.3 + easeOut(f) * 0.7), BJ.red, 0.7 * a, Math.max(3, fx.size * 0.12)));
      bjPic(ctx, row!, four, x, y - fx.size * 0.1, fx.size * (1.6 + easeOut(f) * 0.6), a);
      return true;
    case "bjPrison":
    case "bjEnd":
      // 오래 가는 기술: 네 칸이 차례로 나온 뒤 마지막 칸이 숨쉬듯 남음
      bjPic(ctx, row!, Math.min(3, Math.floor((fx.maxTicks - fx.ticks) / 5)), x, y - fx.size * 0.2, fx.size * (fx.kind === "bjEnd" ? 3 : 2.6), a * (0.85 + 0.15 * Math.sin(fx.ticks * 0.4)));
      return true;
    default:
      // 적안 표식 · 사신의 팔연참
      bjPic(ctx, row!, four, x, y, fx.size * 2.6, a);
      return true;
  }
}
