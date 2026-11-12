// 실베르 캐릭터의 몸 위·바닥 그리기 묶음 (아수라 표식 · 백인장 드론 · 혼령 · 아리아) — forgotten.ts가 커서 나눔
import type { RunState } from "@pixel-rogue/shared";
import { drawAsuraAir } from "./asuraArt";
import { drawBaekinjangAir } from "./baekinjangArt";
import { drawAriaAir, drawAriaGround } from "./ariaArt";
import { drawHonryeongAir, drawHonryeongGround } from "./honryeongArt";
import type { Snap } from "./palette";
import type { Ctx } from "./pwFxBits";

export function drawSilberAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  drawAsuraAir(ctx, s, alpha, snap);
  drawBaekinjangAir(ctx, s, alpha, snap);
  drawHonryeongAir(ctx, s, alpha, snap);
  drawAriaAir(ctx, s, alpha, snap);
}

/** 바닥 (혼령 분신·짐승 · 아리아 악기) */
export function drawSilberGround(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  drawHonryeongGround(ctx, s, alpha, snap);
  drawAriaGround(ctx, s, alpha, snap);
}
