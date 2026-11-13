// 아슈바르 베르 아이콘: 초록 덩굴이 감긴 쌍낫 · 무기 1 (덩굴 쌍낫)
import type { Pen } from "./pen";

const HAFT = "#3a2a1a";
const GREEN = "#7ae05a";
const LIGHT = "#d8ffb0";
const DEEP = "#2a7a1a";

export const VT_WEAPON_ART = {
  /** 덩굴 쌍낫: 엇갈린 두 자루 · 초록 곡선 날 · 감긴 덩굴 잎 */
  vtScythe: (g: Pen) =>
    g.line(3, 14, 11, 4, HAFT).line(13, 14, 5, 4, HAFT)
      .rect(9, 2, 4, 1, GREEN).rect(12, 3, 2, 2, GREEN).px(13, 5, DEEP).px(10, 1, LIGHT)
      .rect(3, 2, 4, 1, GREEN).rect(2, 3, 2, 2, GREEN).px(2, 5, DEEP).px(5, 1, LIGHT)
      .px(6, 10, GREEN).px(7, 11, DEEP).px(10, 9, GREEN).px(9, 10, DEEP).px(5, 12, LIGHT).px(11, 12, LIGHT),
};
