// 화면에 붙는 글자 모음 (카메라와 상관없이 왼쪽 위, render/index에서 부름): 이무기 콤보 · 인시전 도륙 콤보 · 후광 · 유물 · 영혼 · 먹보 · 버려진 자들 태그
import type { RunState, TagSpecialKind } from "@pixel-rogue/shared";
import { drawTagHud } from "./abandoned";
import { drawSoulHud } from "./apostle";
import { drawEaterHud } from "./eaterHud";
import { drawHaloHud } from "./forgottenHalo";
import { drawComboHud } from "./imugiAura";
import { drawIncisionHud } from "./incisionBody";
import { drawRelicHud } from "./pilgrim";

export function drawScreenHuds(ctx: CanvasRenderingContext2D, s: RunState, scale: number, tagName?: (kind: TagSpecialKind) => string): void {
  drawComboHud(ctx, s, scale);
  drawIncisionHud(ctx, s, scale);
  drawHaloHud(ctx, s, scale);
  drawRelicHud(ctx, s, scale);
  drawSoulHud(ctx, s, scale);
  drawEaterHud(ctx, s, scale);
  drawTagHud(ctx, s, scale, tagName);
}
