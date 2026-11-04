// 테라코어 오닉스 아이콘: 칠보 광륜 무기 1 · 전용 아이템 10 (청동 광륜 · 일곱 빛깔 보석 · 보라 추진 불꽃)
import { type Pen } from "./pen";

const BRONZE = "#c8925a";
const BRONZE2 = "#7a5030";
const VIOLET = "#a050ff";
const VIOLET2 = "#e0b0ff";
/** 보석 일곱 빛깔 (홍옥·호박·황옥·비취·청옥·남옥·자수정) */
const GEMS = ["#ff3a4a", "#ff9a2a", "#ffe040", "#3ad870", "#3a6aff", "#5ae0ff", "#b060ff"];

/** 작은 보석 (가운데 + 빛 점) */
function gem(g: Pen, x: number, y: number, c: string, big = false): void {
  if (big) g.rect(x - 1, y - 1, 3, 3, c).px(x, y - 2, c).px(x, y + 2, c).px(x - 2, y, c).px(x + 2, y, c);
  else g.rect(x, y, 2, 2, c);
  g.px(x, y - (big ? 1 : 0), "#ffffff");
}

/** 광륜 고리에 보석 일곱 (n개만 밝게) */
function halo(g: Pen, n = 7, cy = 8): void {
  g.ring(8, cy, 6, BRONZE).ring(8, cy, 5, BRONZE2);
  const at: [number, number][] = [[7, cy - 7], [3, cy - 5], [1, cy - 1], [2, cy + 3], [12, cy - 5], [14, cy - 1], [13, cy + 3]];
  at.forEach(([x, y], i) => gem(g, x, y, i < n ? GEMS[i]! : "#5a4a5a"));
}

/** 보라 추진 불꽃 (아래로) */
function jet(g: Pen, x: number, y: number, h = 4): void {
  g.line(x, y, x, y + h, VIOLET).px(x, y + h, VIOLET2).px(x - 1, y + 1, VIOLET).px(x + 1, y + 1, VIOLET);
}

export const OX_WEAPON_ART = {
  oxHalo: (g: Pen) => {
    halo(g);
    gem(g, 8, 8, VIOLET, true);
    g.line(8, 8, 15, 15, VIOLET2).line(8, 8, 1, 15, VIOLET2).px(15, 15, "#ffffff").px(1, 15, "#ffffff");
  },
};

export const OX_PASSIVE_ART = {
  oxPolish: (g: Pen) => {
    gem(g, 8, 8, GEMS[6]!, true);
    g.px(3, 3, "#ffffff").px(12, 4, "#ffffff").px(4, 12, "#ffffff").line(11, 11, 14, 14, BRONZE).line(12, 11, 15, 14, BRONZE2);
  },
  oxCrown: (g: Pen) => {
    g.rect(2, 8, 12, 4, BRONZE).rect(2, 12, 12, 1, BRONZE2).px(2, 5, BRONZE).px(2, 6, BRONZE).px(8, 4, BRONZE).px(13, 5, BRONZE).px(13, 6, BRONZE).line(2, 7, 13, 7, BRONZE);
    [GEMS[0]!, GEMS[3]!, GEMS[4]!].forEach((c, i) => gem(g, 3 + i * 4, 9, c));
  },
  oxWings: (g: Pen) => {
    g.line(1, 4, 7, 9, VIOLET2).line(1, 6, 7, 10, VIOLET).line(15, 4, 9, 9, VIOLET2).line(15, 6, 9, 10, VIOLET);
    gem(g, 8, 8, GEMS[5]!, true);
    jet(g, 6, 11, 4);
    jet(g, 10, 11, 4);
  },
  oxLanding: (g: Pen) => {
    g.rect(6, 1, 4, 6, BRONZE).rect(7, 7, 2, 2, BRONZE2);
    g.line(1, 13, 15, 13, VIOLET).line(2, 12, 5, 10, VIOLET2).line(14, 12, 11, 10, VIOLET2).px(8, 11, "#ffffff").line(0, 15, 16, 15, BRONZE2);
  },
  oxResonance: (g: Pen) => {
    halo(g);
    g.ring(8, 8, 2, "#ffffff").px(8, 8, VIOLET2);
  },
  oxBulwark: (g: Pen) => {
    g.rect(3, 2, 10, 11, BRONZE2).rect(4, 3, 8, 9, BRONZE).line(8, 3, 8, 11, BRONZE2).line(4, 7, 11, 7, BRONZE2);
    gem(g, 7, 6, GEMS[6]!);
    g.rect(5, 13, 6, 1, BRONZE2);
  },
  oxPrism: (g: Pen) => {
    g.line(8, 2, 3, 12, "#e8ecf4").line(8, 2, 13, 12, "#e8ecf4").line(3, 12, 13, 12, "#e8ecf4");
    GEMS.forEach((c, i) => g.px(9 + i, 5 + i, c).px(10 + i, 5 + i, c));
    g.line(0, 7, 6, 7, "#ffffff");
  },
  oxShard: (g: Pen) => {
    gem(g, 8, 8, GEMS[5]!, true);
    for (const [x, y, c] of [[2, 2, 0], [13, 2, 2], [1, 12, 3], [14, 13, 6]] as const) g.line(8, 8, x, y, GEMS[c]!).px(x, y, "#ffffff");
  },
  oxQuick: (g: Pen) => {
    g.ring(8, 8, 6, BRONZE);
    g.line(8, 8, 8, 3, VIOLET2).line(8, 8, 12, 8, VIOLET).px(8, 8, "#ffffff");
    g.line(1, 2, 4, 2, VIOLET2).line(0, 5, 3, 5, VIOLET);
  },
  oxTrail: (g: Pen) => {
    gem(g, 12, 4, GEMS[6]!, true);
    GEMS.forEach((c, i) => g.px(10 - i, 6 + i, c).px(9 - i, 7 + i, c));
  },
};
