// 오르카 색: 보통은 하늘색 물빛, 해방 중에는 진한 파랑 (inBlue 안에서 그리는 동안 PAL이 바뀜, 상어도 같이)
// 물방울·물 띠·물보라 왕관·거품·물결무늬는 공용 도우미에 지금 색을 넘겨 그림
import type { Ctx } from "./pwFxBits";
import { bubbles, caustic } from "./seaLight";
import { crown } from "./tailArt";
import { sharkBlue } from "./tailShark";
import { droplets, waterArc } from "./thorkenFx";

const NORMAL = { aqua: "#5ae8ff", deep: "#1a6ae0", foam: "#f0fcff", pale: "#c8f6ff" };
const BLUE = { aqua: "#3a72ff", deep: "#0a1ea8", foam: "#bcd0ff", pale: "#8aa8ff" };
export const PAL = { ...NORMAL };
export const OC_INK = "#0a2a52";
/** 해방 번개 색 */
export const OC_VOLT = "#3a6aff";

/** on이면 fn 안에서 그리는 오르카 효과·상어를 진한 파랑으로 */
export function inBlue(_ctx: Ctx, on: boolean, fn: () => void): void {
  if (!on) return fn();
  Object.assign(PAL, BLUE);
  sharkBlue(true, fn);
  Object.assign(PAL, NORMAL);
}

export const drops = (ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, n = 12) => droplets(ctx, x, y, r, f, seed, n, PAL.aqua, PAL.foam);
export const band = (ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, w: number, a: number) => waterArc(ctx, x, y, r, a0, a1, w, a, PAL.deep, PAL.aqua, PAL.foam);
export const splash = (ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, n = 11) => crown(ctx, x, y, r, f, seed, n, PAL.aqua, PAL.foam);
export const bubs = (ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, n = 6, a = 1) => bubbles(ctx, x, y, r, f, seed, n, a, PAL.pale);
export const caust = (ctx: Ctx, x: number, y: number, r: number, tick: number, a: number) => caustic(ctx, x, y, r, tick, a, PAL.pale);
