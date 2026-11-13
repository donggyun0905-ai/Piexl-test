// 아슈바르 루주 아이콘: 붉은 장미 손잡이의 쌍검 X자 · 무기 1 (장미쌍검)
import type { Pen } from "./pen";

const STEEL = "#e8e0ea";
const EDGE = "#8a1a2a";
const RED = "#ff3a4a";
const DARK = "#2a1418";

export const RG_WEAPON_ART = {
  /** 장미쌍검: 두 칼날이 X자로 겹치고 손잡이에 붉은 장미 */
  rgBlades: (g: Pen) =>
    g.line(2, 2, 11, 11, STEEL).line(3, 2, 12, 11, EDGE).px(2, 2, RED)
      .line(13, 2, 4, 11, STEEL).line(12, 2, 3, 11, EDGE).px(13, 2, RED)
      .rect(11, 11, 3, 3, DARK).rect(2, 11, 3, 3, DARK)
      .px(12, 12, RED).px(13, 13, RED).px(12, 13, EDGE).px(3, 12, RED).px(2, 13, RED).px(3, 13, EDGE),
};
