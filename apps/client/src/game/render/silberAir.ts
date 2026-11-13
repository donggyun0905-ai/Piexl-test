// 실베르 캐릭터의 몸 위·바닥 그리기 묶음 (아수라 표식 · 백인장 드론 · 혼령 · 아리아 · 레이븐 · 기어스) — forgotten.ts가 커서 나눔
import type { RunState } from "@pixel-rogue/shared";
import { drawAsuraAir } from "./asuraArt";
import { drawBaekinjangAir } from "./baekinjangArt";
import { drawAriaAir, drawAriaGround } from "./ariaArt";
import { drawRavenAir, drawRavenGround } from "./ravenArt";
import { drawGearsAir } from "./gearsArt";
import { drawNoirBack } from "./noirArt";
import { drawRougeGround } from "./rougeArt";
import { drawBleuAir, drawBleuGround } from "./bleuArt";
import { drawHonryeongAir, drawHonryeongGround } from "./honryeongArt";
import type { Snap } from "./palette";
import type { Ctx } from "./pwFxBits";

export function drawSilberAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  drawAsuraAir(ctx, s, alpha, snap);
  drawBaekinjangAir(ctx, s, alpha, snap);
  drawHonryeongAir(ctx, s, alpha, snap);
  drawAriaAir(ctx, s, alpha, snap);
  drawRavenAir(ctx, s, alpha, snap);
  drawGearsAir(ctx, s, alpha, snap);
  drawBleuAir(ctx, s, alpha, snap);
}

/** 바닥 (혼령 분신·짐승 · 아리아 악기) */
export function drawSilberGround(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  // 느아르·루주·블뢰 등 뒤 악마 계급 마크 (몸보다 먼저)
  drawNoirBack(ctx, s, alpha, snap);
  // 루주 바닥의 혈장미
  drawRougeGround(ctx, s, alpha, snap);
  // 블뢰 눈결정·얼어 있는 적
  drawBleuGround(ctx, s, alpha, snap);
  drawHonryeongGround(ctx, s, alpha, snap);
  drawAriaGround(ctx, s, alpha, snap);
  drawRavenGround(ctx, s, alpha, snap);
}
