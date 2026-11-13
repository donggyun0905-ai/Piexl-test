// 아슈바르 블뢰 아이콘: 표지에 푸른 눈결정이 박힌 하얀 마도서 · 무기 1 (하얀 마도서)
import type { Pen } from "./pen";

const PAGE = "#f0f4fa";
const EDGE = "#8a9ab8";
const BLUE = "#5ab4ff";
const DARK = "#1a2440";

export const BU_WEAPON_ART = {
  /** 하얀 마도서: 하얀 표지 · 어두운 책등 · 가운데 푸른 눈결정 */
  buTome: (g: Pen) =>
    g.rect(3, 2, 10, 12, PAGE).rect(3, 2, 2, 12, DARK).line(5, 2, 12, 2, EDGE).line(5, 13, 12, 13, EDGE).line(12, 2, 12, 13, EDGE)
      .line(9, 4, 9, 11, BLUE).line(6, 7, 12, 7, BLUE).px(7, 5, BLUE).px(11, 5, BLUE).px(7, 9, BLUE).px(11, 9, BLUE).px(9, 7, "#ffffff"),
};
