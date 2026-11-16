// 한정 스킨 피해 숫자 고르기 (damageNumbers · 상점 미리보기 FxPreview가 씀): 테마마다 전용 숫자, 아니면 false (이벤트 상점 숫자는 dmgSkins)
import type { DmgStyle } from "../../shop/effects";
import { drawTigerNumber } from "./tigerNumber";
import { drawSummerNumber } from "./summerNumber";
import { drawCyberNumber } from "./cyberNumber";
import { drawXmasNumber } from "./xmasNumber";
import { drawMaidNumber } from "./maidNumber";

type Draw = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, age: number, crit: boolean) => void;
const DRAW = { tiger: drawTigerNumber, summer: drawSummerNumber, cyber: drawCyberNumber, noel: drawXmasNumber, maid: drawMaidNumber } satisfies Record<string, Draw>;
export type LimitedDmg = keyof typeof DRAW;

/** 한정 스킨 숫자면 그리고 true */
export function drawLimitedNumber(ctx: CanvasRenderingContext2D, style: DmgStyle, text: string, x: number, y: number, age: number, crit: boolean): style is LimitedDmg {
  const d = (DRAW as Record<string, Draw>)[style];
  if (!d) return false;
  d(ctx, text, x, y, age, crit);
  return true;
}
