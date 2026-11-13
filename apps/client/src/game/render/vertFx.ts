// 베르 효과: 시트 4칸 그림 16종 (기본 공격 1~4단계 · 추가 공격 1~4단계 · 스킬 4개와 강화판, render/vertArt ROW)
// + 빛으로만: 터짐 · 독가스 · 씨앗이 심어짐(style 1)·발아
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import { ROW, VT, vtPic } from "./vertArt";
import { sheetLoop, type Frame } from "./sheetLoop";

const KINDS = new Set<string>([...Object.keys(ROW), "vtPop", "vtGas", "vtSprout"]);
/** 반복 칸 (없으면 가운데 두 칸): 회전무·천륜 가시무는 좌우 반전을 번갈아 · 꽃밭·부식·감옥·종언은 마지막 두 칸 */
const LOOP: Partial<Record<string, readonly Frame[]>> = {
  vtSpin: [[2, false], [3, false], [2, true], [3, true]],
  vtDance: [[2, false], [3, false], [2, true], [3, true]],
  vtGarden: [[2, false], [3, false]],
  vtErode: [[2, false], [3, false]],
  vtPrison: [[2, false], [3, false]],
  vtEnd: [[2, false], [3, false]],
};
/** 바라보는 쪽으로 돌려 그리는 그림 (원본이 오른쪽을 봄) */
const TURN = new Set<string>(["vtSlash", "vtFrenzy", "vtWhip"]);
/** 그림 크기 배율 (반지름 → 그림 너비) */
const SCALE: Partial<Record<string, number>> = { vtWhip: 2.2, vtSlash: 2.4, vtEnd: 1.6, vtPrison: 1.6 };

export function drawVertFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "vtPop" || fx.kind === "vtSprout") {
    const c = fx.style ? VT.light : VT.green;
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * (0.6 + f * 0.5), c, 0.7 * (1 - f), 0.4);
      shock(ctx, x, y, fx.size * easeOut(f), VT.light, 0.7 * (1 - f), 3);
      if (!fx.style) sparks(ctx, x, y, 12, fx.size, f, VT.green, fx.x + fx.y, 1);
    });
    return true;
  }
  if (fx.kind === "vtGas") {
    additive(ctx, () => glow(ctx, x, y, fx.size * (0.5 + f * 0.6), VT.poison, 0.35 * (1 - f), 0));
    return true;
  }
  // 맨 끝 5틱만 흐려짐 (마지막 그림이 다 보이게)
  const a = Math.min(1, fx.ticks / 5);
  const left = fx.dirX < 0;
  const ang = Math.atan2(fx.dirY, fx.dirX);
  const w = fx.size * (SCALE[fx.kind] ?? 2.2);
  const rot = TURN.has(fx.kind) ? (left ? ang + Math.PI : ang) : 0;
  sheetLoop(ctx, vtPic, ROW[fx.kind as keyof typeof ROW], fx.ticks, fx.maxTicks, x, y, w, a, rot, TURN.has(fx.kind) && left, LOOP[fx.kind]);
  return true;
}
