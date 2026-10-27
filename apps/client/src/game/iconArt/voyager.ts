// 운명의 여행자(히든) 아이콘: 운명의 활(금빛 활대·하늘빛 시위) · 전용 아이템 10 (주사위·모래시계·월계관 등)
import { type Pen } from "./pen";

const GOLD = "#e8b040";
const GOLD_L = "#ffe08a";
const STRING = "#c8e8ff";
const IVORY = "#f2ecdc";
const PIP = "#2a1e3a";
const SAND = "#e8c878";
const SEA = "#3a8ad8";
const OLIVE = "#6aa040";

/** 주사위 (x, y 왼쪽 위 5×5, 눈 n) */
function die(g: Pen, x: number, y: number, n: number): void {
  g.rect(x, y, 5, 5, IVORY);
  const at: Record<number, [number, number][]> = { 1: [[2, 2]], 2: [[0, 0], [4, 4]], 3: [[0, 0], [2, 2], [4, 4]], 4: [[0, 0], [4, 0], [0, 4], [4, 4]], 5: [[0, 0], [4, 0], [2, 2], [0, 4], [4, 4]], 6: [[0, 0], [0, 2], [0, 4], [4, 0], [4, 2], [4, 4]] };
  for (const [dx, dy] of at[n] ?? []) g.px(x + dx, y + dy, n === 1 ? "#d83a3a" : PIP);
}

export const VY_WEAPON_ART = {
  vyBow: (g: Pen) => {
    g.line(4, 1, 9, 4, GOLD).line(9, 4, 11, 8, GOLD).line(11, 8, 9, 12, GOLD).line(9, 12, 4, 15, GOLD);
    g.line(4, 1, 4, 15, STRING).px(9, 4, GOLD_L).px(9, 12, GOLD_L);
    g.line(2, 8, 14, 8, "#a87a4a").px(14, 8, "#ffffff").px(13, 7, "#ffffff").px(13, 9, "#ffffff");
  },
};

export const VY_PASSIVE_ART = {
  vyTwinDice: (g: Pen) => {
    die(g, 2, 3, 6);
    die(g, 9, 8, 6);
  },
  vyLoadedDie: (g: Pen) => {
    die(g, 5, 5, 5);
    g.px(4, 4, GOLD_L).px(11, 11, GOLD_L);
  },
  vySandglass: (g: Pen) => {
    g.rect(3, 1, 10, 1, GOLD).rect(3, 14, 10, 1, GOLD);
    g.line(4, 2, 7, 7, STRING).line(11, 2, 8, 7, STRING).line(7, 8, 4, 13, STRING).line(8, 8, 11, 13, STRING);
    g.rect(5, 11, 6, 2, SAND).px(7, 8, SAND).px(8, 9, SAND);
  },
  vyKeepFate: (g: Pen) => {
    g.rect(3, 9, 10, 5, "#f2c8a0").rect(3, 8, 2, 2, "#f2c8a0");
    die(g, 6, 4, 4);
  },
  vyString: (g: Pen) => {
    g.line(3, 1, 3, 15, STRING).line(4, 1, 4, 15, "#ffffff").px(5, 8, GOLD).px(6, 8, GOLD);
  },
  vyQuiver: (g: Pen) => {
    g.rect(5, 6, 6, 9, "#8a5a2a").rect(5, 6, 6, 1, GOLD);
    for (const x of [6, 8, 10]) g.line(x, 1, x, 6, "#a87a4a").px(x, 1, "#ffffff");
  },
  vyLaurel: (g: Pen) => {
    g.ring(8, 9, 5, OLIVE);
    for (const [x, y] of [[3, 6], [13, 6], [4, 12], [12, 12]]) g.px(x!, y!, "#9ad870");
    g.rect(6, 14, 4, 1, GOLD);
  },
  vySeaLegs: (g: Pen) => {
    g.rect(0, 11, 16, 5, SEA).line(0, 11, 4, 9, "#c8e8ff").line(8, 11, 12, 9, "#c8e8ff");
    g.rect(5, 4, 2, 7, "#f2c8a0").rect(9, 4, 2, 7, "#f2c8a0");
  },
  vyBlessing: (g: Pen) => {
    die(g, 5, 6, 6);
    g.px(8, 1, GOLD_L).px(2, 4, GOLD_L).px(14, 4, GOLD_L).line(8, 2, 8, 4, GOLD);
  },
  vyHomeward: (g: Pen) => {
    g.rect(0, 12, 16, 4, SEA).rect(4, 9, 8, 3, "#8a5a2a").line(8, 9, 8, 4, "#a87a4a");
    g.px(12, 2, GOLD_L).px(11, 2, GOLD).px(13, 2, GOLD).px(12, 1, GOLD).px(12, 3, GOLD);
  },
};
