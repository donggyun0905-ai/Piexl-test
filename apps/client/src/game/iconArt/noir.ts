// 아슈바르 느아르 아이콘: 검은 손톱 · 보라 빛 · 붉은 눈 · 무기 1 (공허의 손톱)
import type { Pen } from "./pen";

const BLACK = "#1a1422";
const EDGE = "#6a4a9a";
const GLOW = "#b48aff";
const RED = "#ff3a5a";

export const NR_WEAPON_ART = {
  /** 공허의 손톱: 검은 손등(붉은 보석) + 위로 휘어 뻗은 보라 테 손톱 셋 */
  nrBlade: (g: Pen) =>
    g.rect(2, 10, 6, 4, BLACK).line(2, 10, 7, 10, EDGE).line(2, 14, 7, 14, EDGE).px(4, 12, RED).px(5, 12, RED)
      .line(3, 9, 4, 4, BLACK).line(4, 4, 6, 1, EDGE).px(6, 1, GLOW)
      .line(5, 9, 7, 4, BLACK).line(7, 4, 10, 1, EDGE).px(10, 1, GLOW)
      .line(7, 10, 10, 6, BLACK).line(10, 6, 13, 4, EDGE).px(13, 4, GLOW)
      .line(8, 12, 11, 11, BLACK).line(11, 11, 14, 10, EDGE).px(14, 10, GLOW),
};
