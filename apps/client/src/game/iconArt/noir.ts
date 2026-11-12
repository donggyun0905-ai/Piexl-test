// 아슈바르 느아르 아이콘: 검은 칼날 · 보라 빛 · 붉은 눈 · 무기 1 (공허의 검)
import type { Pen } from "./pen";

const BLACK = "#1a1422";
const EDGE = "#6a4a9a";
const GLOW = "#b48aff";
const RED = "#ff3a5a";

export const NR_WEAPON_ART = {
  /** 공허의 검: 대각선 검은 칼날 + 보라 테 + 붉은 보석 손잡이 */
  nrBlade: (g: Pen) => g.line(3, 13, 12, 4, EDGE).line(4, 13, 13, 4, BLACK).line(4, 12, 12, 4, BLACK).px(13, 3, GLOW).px(12, 3, GLOW)
    .line(2, 10, 6, 14, EDGE).px(3, 13, RED).px(2, 14, BLACK).px(9, 6, GLOW),
};
