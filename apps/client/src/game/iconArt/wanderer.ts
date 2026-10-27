// 아스칼론 방랑객 아이콘: 카타나(은빛 칼날·검은 손잡이·붉은 끈) 10·전용 아이템 10
import { type Pen } from "./pen";

const STEEL = "#e8ecf4";
const EDGE = "#9aa3b8";
const HILT = "#2a2028";
const CORD = "#c83a3a";
const GOLD = "#e8c060";
const SKY = "#a8e0ff";

/** 카타나 (손잡이 x0,y0 → 칼끝 x1,y1, 살짝 휨) */
function katana(g: Pen, x0 = 2, y0 = 14, x1 = 14, y1 = 2, blade = STEEL): void {
  const hx = x0 + (x1 - x0) * 0.25;
  const hy = y0 + (y1 - y0) * 0.25;
  g.line(x0, y0, hx, hy, HILT).px(Math.round(x0 + 1), Math.round(y0 - 1), CORD);
  g.line(hx, hy, x1, y1, blade).line(hx + 1, hy, x1, y1 + 1, EDGE).px(Math.round(hx), Math.round(hy), GOLD);
}

export const WD_WEAPON_ART = {
  wdKatana: (g: Pen) => katana(g),
  wdIai: (g: Pen) => {
    katana(g, 2, 13, 9, 9);
    g.line(6, 6, 15, 2, "#ffffff").line(5, 8, 15, 4, SKY);
  },
  wdZone: (g: Pen) => {
    g.ring(8, 8, 7, CORD).ring(8, 8, 5, "#ffd0d0");
    katana(g, 5, 11, 11, 5);
  },
  wdStorm: (g: Pen) => {
    g.ring(8, 8, 6, SKY);
    for (const [x, y] of [[8, 1], [15, 8], [8, 15], [1, 8]]) g.px(x!, y!, STEEL);
    g.line(4, 4, 12, 12, STEEL);
  },
  wdTempest: (g: Pen) => {
    for (const [a, b] of [[1, 4], [5, 1], [9, 6], [2, 10], [10, 11]]) g.line(a!, b! + 3, a! + 5, b!, STEEL);
    g.rect(1, 14, 14, 1, CORD);
  },
  wdCrescent: (g: Pen) => {
    katana(g, 1, 14, 9, 6);
    g.line(9, 2, 14, 6, SKY).line(14, 6, 13, 12, SKY).px(10, 2, "#ffffff");
  },
  wdTwin: (g: Pen) => {
    katana(g, 2, 14, 13, 3);
    katana(g, 14, 14, 3, 3);
  },
  wdNodachi: (g: Pen) => katana(g, 1, 15, 15, 1),
  wdFlurry: (g: Pen) => {
    katana(g, 2, 14, 10, 6);
    for (const y of [3, 6, 9]) g.line(9, y + 3, 15, y, "#ffffff");
  },
  wdMoon: (g: Pen) => {
    g.disc(11, 5, 3, "#fff4c0").disc(12, 4, 2, "#2a2a3a");
    katana(g, 1, 14, 10, 9);
    g.line(1, 11, 9, 7, SKY);
  },
};

export const WD_PASSIVE_ART = {
  wdHone: (g: Pen) => {
    g.rect(2, 10, 12, 4, "#8a7a6a").rect(2, 10, 12, 1, "#b8a890");
    katana(g, 3, 9, 13, 5);
  },
  wdDeep: (g: Pen) => {
    g.line(3, 3, 13, 13, STEEL).px(8, 8, CORD).px(9, 10, CORD).px(7, 11, CORD).px(10, 12, CORD);
  },
  wdCalm: (g: Pen) => {
    g.rect(1, 9, 14, 1, SKY).rect(3, 11, 10, 1, "#7ab8e0").ring(8, 5, 3, "#ffffff");
  },
  wdWind: (g: Pen) => {
    for (const y of [4, 8, 12]) g.line(2, y, 14, y - 2, y === 8 ? STEEL : SKY);
  },
  wdSheath: (g: Pen) => {
    g.line(2, 14, 13, 3, "#2a2028").line(3, 14, 14, 3, "#4a3a3a").px(3, 13, CORD).px(13, 3, GOLD);
  },
  wdGauge: (g: Pen) => {
    g.rect(2, 6, 12, 4, HILT).rect(3, 7, 8, 2, CORD).px(12, 7, "#ffffff");
  },
  wdRonin: (g: Pen) => {
    g.rect(3, 4, 10, 2, "#c8a870").rect(5, 2, 6, 2, "#c8a870").line(2, 10, 6, 14, HILT).line(10, 14, 13, 10, HILT);
  },
  wdFocus: (g: Pen) => {
    g.ring(8, 8, 6, CORD).ring(8, 8, 3, STEEL).px(8, 8, "#ffffff");
  },
  wdRain: (g: Pen) => {
    for (const [x, y] of [[3, 3], [8, 5], [12, 2], [5, 9], [11, 10]]) g.rect(x!, y!, 1, 3, CORD);
    g.rect(2, 14, 12, 1, CORD);
  },
  wdBlink: (g: Pen) => {
    g.disc(11, 4, 3, "#fff4c0").disc(12, 3, 2, "#2a2a3a");
    g.line(1, 13, 13, 9, "#ffffff").line(1, 14, 13, 10, SKY);
  },
};
