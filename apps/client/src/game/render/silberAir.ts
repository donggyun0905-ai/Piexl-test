// 실베르 캐릭터의 몸 위 그리기 묶음 (아수라 표식 · 백인장 드론 · 혼령) — forgotten.ts가 커서 나눔
import type { RunState } from "@pixel-rogue/shared";
import { drawAsuraAir } from "./asuraArt";
import { drawBaekinjangAir } from "./baekinjangArt";
import { drawHonryeongAir } from "./honryeongArt";
import type { Snap } from "./palette";
import type { Ctx } from "./pwFxBits";

export function drawSilberAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  drawAsuraAir(ctx, s, alpha, snap);
  drawBaekinjangAir(ctx, s, alpha, snap);
  drawHonryeongAir(ctx, s, alpha, snap);
}
