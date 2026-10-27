// 시즌 2 아스칼론 아이콘: 추적자(짙은 녹색·쇠·붉은 조준) 저격총 1·전용 아이템 10
import type { Pen } from "./pen";

const GUN = "#3a3e4a";
const STEEL = "#a8b0c4";
const WOOD = "#6a4a2a";
const RED = "#ff4a4a";
const GOLD = "#ffd860";
const WHITE = "#ffffff";

/** 저격총 옆모습 (총구 오른쪽) */
function rifle(g: Pen, y = 9): void {
  g.rect(1, y, 4, 3, WOOD).rect(5, y, 10, 2, GUN).px(15, y, STEEL).rect(7, y - 2, 4, 2, STEEL).px(10, y - 2, RED).rect(6, y + 2, 2, 2, GUN);
}

export const ASC_WEAPON_ART = {
  trSniper: (g: Pen) => rifle(g),
};

export const ASC_PASSIVE_ART = {
  trScope: (g: Pen) => {
    g.rect(3, 6, 10, 4, GUN).rect(4, 5, 2, 6, STEEL).rect(11, 5, 2, 6, STEEL).px(8, 8, RED);
  },
  trHollow: (g: Pen) => {
    g.rect(6, 4, 4, 9, GOLD).rect(6, 3, 4, 1, "#c89040").px(7, 3, GUN).px(8, 3, GUN);
  },
  trSilencer: (g: Pen) => {
    g.rect(2, 7, 4, 2, GUN).rect(6, 6, 9, 4, "#5a5e6a").px(15, 7, STEEL).px(15, 8, STEEL);
  },
  trBipod: (g: Pen) => {
    rifle(g, 5);
    g.line(9, 8, 6, 14, STEEL).line(10, 8, 13, 14, STEEL);
  },
  trMark: (g: Pen) => {
    g.line(8, 2, 8, 14, RED).line(2, 8, 14, 8, RED).rect(6, 6, 5, 5, RED).rect(7, 7, 3, 3, "#2a0a0a");
  },
  trRicochet: (g: Pen) => {
    g.line(1, 12, 8, 4, GOLD).line(8, 4, 15, 12, GOLD).px(8, 3, WHITE).rect(6, 13, 5, 2, STEEL);
  },
  trDrum: (g: Pen) => {
    g.rect(3, 4, 10, 9, GUN).rect(4, 5, 8, 7, STEEL);
    for (const [x, y] of [[6, 7], [9, 7], [6, 10], [9, 10]]) g.px(x!, y!, GOLD);
  },
  trCharge: (g: Pen) => {
    g.rect(5, 3, 6, 11, GUN).rect(6, 4, 4, 9, "#6ac8ff").line(9, 5, 7, 9, WHITE).line(7, 9, 9, 12, WHITE);
  },
  trCamo: (g: Pen) => {
    g.rect(3, 3, 10, 11, "#4a6a3a");
    for (const [x, y] of [[4, 5], [9, 4], [6, 9], [11, 10], [5, 12]]) g.rect(x!, y!, 2, 2, "#2a3a1e");
  },
  trHeadshot: (g: Pen) => {
    g.rect(5, 3, 6, 6, "#e8c0a0").rect(4, 2, 8, 2, "#3a2a1e").px(8, 6, RED).px(9, 6, RED);
    g.line(2, 12, 14, 12, RED).line(8, 9, 8, 15, RED);
  },
};
