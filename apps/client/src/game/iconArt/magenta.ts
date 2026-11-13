// 아슈바르 마젠타 아이콘: 자홍 꽃잎이 흩날리는 검은 부채 · 무기 1 (욕망의 부채)
import type { Pen } from "./pen";

const RIB = "#2a1a2a";
const PINK = "#ff3ab8";
const LIGHT = "#ffc8f0";
const DEEP = "#a01a8a";

export const MZ_WEAPON_ART = {
  /** 욕망의 부채: 펼친 부채(검은 살 · 자홍 천) · 꽃잎 두 장 */
  mzFan: (g: Pen) =>
    g.rect(3, 6, 10, 3, PINK).rect(4, 4, 8, 2, PINK).rect(5, 3, 6, 1, DEEP).rect(4, 9, 8, 1, DEEP)
      .line(8, 13, 3, 6, RIB).line(8, 13, 6, 3, RIB).line(8, 13, 10, 3, RIB).line(8, 13, 13, 6, RIB).rect(7, 12, 3, 2, RIB)
      .px(6, 5, LIGHT).px(10, 7, LIGHT).px(1, 2, PINK).px(2, 3, LIGHT).px(14, 11, PINK).px(13, 12, DEEP),
};
