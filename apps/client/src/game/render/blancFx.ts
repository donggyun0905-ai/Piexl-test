// 블랑 효과: 시트 4칸 그림 16종 (기본 공격 1~4단계 · 추가 공격 1~4단계 · 스킬 4개와 강화판, render/blancArt ROW)
// + 빛으로만: 빠져나옴 · 깃털 · 레이저 · 되돌림 · 조종 공격
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import { BC, bcPic, ROW } from "./blancArt";
import { sheetLoop, type Frame } from "./sheetLoop";

const KINDS = new Set<string>([...Object.keys(ROW), "bcExit", "bcFeather", "bcLaser", "bcReflect", "bcHostHit"]);
/** 반복 칸 (없으면 가운데 두 칸): 천개의 거짓 눈은 마지막 칸에 가만히 · 긴 스킬은 마지막 두 칸 */
const LOOP: Partial<Record<string, readonly Frame[]>> = {
  bcEyes: [[3, false]],
  bcWhisper: [[2, false], [3, false]],
  bcSanctum: [[2, false], [3, false]],
  bcRedeem: [[2, false], [3, false]],
  bcEnd: [[2, false], [3, false]],
};
/** 바라보는 쪽으로 돌려 그리는 그림 (원본이 오른쪽을 봄) */
const TURN = new Set<string>(["bcFan"]);
/** 그림 크기 배율 (반지름 → 그림 너비) */
const SCALE: Partial<Record<string, number>> = { bcFan: 2.4, bcEnd: 1.6, bcEyes: 2, bcWings: 2.2, bcRift: 2.6, bcSeize: 2.4 };

export function drawBlancFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "bcLaser") {
    additive(ctx, () => {
      ctx.save();
      ctx.globalAlpha *= 1 - f;
      ctx.strokeStyle = BC.violet;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + fx.dirX * fx.size, y + fx.dirY * fx.size);
      ctx.stroke();
      ctx.strokeStyle = BC.light;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });
    return true;
  }
  if (fx.kind === "bcExit" || fx.kind === "bcReflect" || fx.kind === "bcFeather" || fx.kind === "bcHostHit") {
    const big = fx.kind === "bcExit";
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * (0.6 + f * 0.5), big ? BC.white : BC.violet, (big ? 0.85 : 0.6) * (1 - f), 0.4);
      shock(ctx, x, y, fx.size * easeOut(f), BC.light, 0.7 * (1 - f), big ? 4 : 2);
      if (big || fx.kind === "bcFeather") sparks(ctx, x, y, big ? 16 : 8, fx.size, f, BC.white, fx.x + fx.y, 1);
    });
    return true;
  }
  // 맨 끝 5틱만 흐려짐 (마지막 그림이 다 보이게)
  const a = Math.min(1, fx.ticks / 5);
  const left = fx.dirX < 0;
  const ang = Math.atan2(fx.dirY, fx.dirX);
  const w = fx.size * (SCALE[fx.kind] ?? 2.2);
  const rot = TURN.has(fx.kind) ? (left ? ang + Math.PI : ang) : 0;
  sheetLoop(ctx, bcPic, ROW[fx.kind as keyof typeof ROW], fx.ticks, fx.maxTicks, x, y, w, a, rot, TURN.has(fx.kind) && left, LOOP[fx.kind]);
  return true;
}
