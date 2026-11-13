// 아슈바르 존 아이콘: 손가락 끝에서 황금 번개가 튀는 검은 장갑 · 무기 1 (금빛 손아귀)
import type { Pen } from "./pen";

const GLOVE = "#2a2230";
const EDGE = "#6a5a40";
const GOLD = "#ffd020";
const LIGHT = "#fff6b0";

export const JN_WEAPON_ART = {
  /** 금빛 손아귀: 검은 장갑 손 · 금빛 손목 띠 · 손끝에서 번개 */
  jnGrip: (g: Pen) =>
    g.rect(4, 8, 7, 6, GLOVE).rect(4, 13, 7, 1, GOLD).rect(4, 4, 1, 4, GLOVE).rect(6, 3, 1, 5, GLOVE).rect(8, 3, 1, 5, GLOVE).rect(10, 4, 1, 4, GLOVE).rect(11, 9, 2, 2, GLOVE)
      .line(4, 8, 10, 8, EDGE).line(5, 2, 4, 0, GOLD).line(7, 2, 7, 0, GOLD).line(9, 2, 10, 0, GOLD).line(12, 3, 14, 1, GOLD).px(13, 2, LIGHT).px(7, 1, LIGHT).px(9, 10, GOLD),
};
