// 마젠타 효과: 시트 4칸 그림 16종 (기본 공격 1~4단계 · 추가 공격 1~4단계 · 스킬 4개와 강화판, render/magentaArt ROW)
// + 빛으로만: 저주 터짐 · 향기 연기 생김 · 매혹 하트
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import { heart, MZ, mzPic, ROW } from "./magentaArt";
import { sheetLoop, type Frame } from "./sheetLoop";

const KINDS = new Set<string>([...Object.keys(ROW), "mzPop", "mzScent", "mzCharm"]);
/** 반복 칸 (없으면 가운데 두 칸): 소용돌이·영혼 구체는 좌우 반전을 번갈아 · 꽃밭·강우·성역은 마지막 두 칸 */
const LOOP: Partial<Record<string, readonly Frame[]>> = {
  mzVortex: [[2, false], [3, false], [2, true], [3, true]],
  mzSoul: [[2, false], [3, false], [3, true], [2, true]],
  mzGarden: [[2, false], [3, false]],
  mzStorm: [[2, false], [3, false]],
  mzEnd: [[2, false], [3, false], [3, true]],
  mzErode: [[2, false], [3, false]],
};
/** 바라보는 쪽으로 돌려 그리는 그림 (원본이 오른쪽을 봄) */
const TURN = new Set<string>(["mzWave"]);
/** 그림 크기 배율 (반지름 → 그림 너비) */
const SCALE: Partial<Record<string, number>> = { mzWave: 2.6, mzStorm: 1.5, mzEnd: 1.5, mzBrand: 1.6, mzErode: 1.6 };

export function drawMagentaFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "mzPop") {
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * (0.6 + f * 0.5), fx.style ? MZ.pink : MZ.curse, 0.7 * (1 - f), 0.4);
      shock(ctx, x, y, fx.size * easeOut(f), MZ.light, 0.7 * (1 - f), 3);
      sparks(ctx, x, y, 12, fx.size, f, MZ.light, fx.x + fx.y, 1);
    });
    return true;
  }
  if (fx.kind === "mzScent") {
    additive(ctx, () => glow(ctx, x, y, fx.size * (0.5 + f * 0.5), MZ.pink, 0.25 * (1 - f), 0));
    return true;
  }
  if (fx.kind === "mzCharm") {
    heart(ctx, x - 4, y - f * 10, 1.4, MZ.pink, 1 - f);
    return true;
  }
  // 맨 끝 5틱만 흐려짐 (마지막 그림이 다 보이게)
  const a = Math.min(1, fx.ticks / 5);
  const left = fx.dirX < 0;
  const ang = Math.atan2(fx.dirY, fx.dirX);
  const w = fx.size * (SCALE[fx.kind] ?? 2.2);
  const rot = TURN.has(fx.kind) ? (left ? ang + Math.PI : ang) : 0;
  sheetLoop(ctx, mzPic, ROW[fx.kind as keyof typeof ROW], fx.ticks, fx.maxTicks, x, y, w, a, rot, TURN.has(fx.kind) && left, LOOP[fx.kind]);
  return true;
}
