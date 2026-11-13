// 루주 그리기: 효과 시트 그림 한 칸 · 바닥의 혈장미 (악마 계급 마크는 느아르와 같이 render/noirArt)
// 그림 sprites/rougeFx.png (192칸 4×16, 줄 차례는 ROW) — scripts/art/rouge.py
import type { RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import { sheetPic } from "./noirArt";
import type { Snap } from "./palette";
import { additive, glow, type Ctx } from "./pwFxBits";

export const RG = { red: "#ff2a3a", light: "#ffb0b8", dark: "#5a0a14", ember: "#ff7a3a" };
/** 효과 시트의 줄 (scripts/art/rouge.py ROWS 차례) */
export const ROW = {
  rgX: 0, rgBloom: 1, rgFlame: 2, rgPetal: 3, rgSpin: 4, rgForest: 5, rgThorn: 6, rgBlaze: 7,
  rgBloomBig: 8, rgRush: 9, rgDance: 10, rgMark: 11, rgFuneral: 12, rgMoon: 13, rgEnd: 14, rgRain: 15,
} as const;
export const rgPic = sheetPic(img("rougeFx"));

/** 바닥(몸보다 먼저): 방의 혈장미 (혈화 개화 첫 칸 그림을 작게, 사라질 때쯤 옅어짐) */
export function drawRougeGround(ctx: Ctx, s: RunState, _alpha: number, snap: Snap): void {
  const roses = s.player.rgRoses;
  if (!roses?.length) return;
  for (const r of roses) {
    const left = r.until - s.tick;
    const a = Math.min(1, left / 60) * (0.75 + 0.25 * Math.sin((s.tick + r.x) * 0.08));
    const [x, y] = [snap(r.x), snap(r.y)];
    additive(ctx, () => glow(ctx, x, y, 10, RG.red, 0.25 * a, 0.2));
    rgPic(ctx, ROW.rgBloom, 0, x, y, 26, a);
  }
}
