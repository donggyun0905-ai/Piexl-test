// 아슈바르 블랑 아이콘: 흰 깃털 부채 · 가운데 보라 눈 · 무기 1 (순백의 부채)
import type { Pen } from "./pen";

const RIB = "#8a7aa8";
const WHITE = "#f4f0ff";
const LIGHT = "#ffffff";
const VIOLET = "#9a6aff";

export const BC_WEAPON_ART = {
  /** 순백의 부채: 펼친 흰 부채 · 보라 눈 · 아래 손잡이 */
  bcFan: (g: Pen) =>
    g.rect(3, 4, 10, 2, WHITE).rect(2, 6, 12, 2, WHITE).rect(3, 8, 10, 2, WHITE).rect(5, 10, 6, 1, WHITE)
      .px(4, 3, LIGHT).px(8, 2, LIGHT).px(11, 3, LIGHT)
      .rect(7, 6, 2, 2, VIOLET).px(6, 7, VIOLET).px(9, 6, VIOLET)
      .line(8, 11, 8, 14, RIB).px(5, 9, RIB).px(10, 9, RIB),
};
