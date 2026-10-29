// 몰락한 왕(히든) 아이콘: 붉은 츠바이핸더 · 전용 아이템 10 (검정·푸른 갑옷 · 푸른 불꽃 · 잘게 쪼개진 영혼)
import { type Pen } from "./pen";

const RED = "#d8202a";
const RED_L = "#ff8a7a";
const RED_D = "#8a0a14";
const GOLD = "#e0b030";
const BLUE = "#3ab8ff";
const BLUE_L = "#c8f0ff";
const PLATE = "#2a3a6a";
const PLATE_L = "#4a6ab0";
const DARK = "#0e1430";
const WH = "#ffffff";

/** 푸른 불꽃 하나 (x 가운데 · 아래 y) */
function flame(g: Pen, x: number, y: number, h = 4): void {
  for (let i = 0; i < h; i++) g.px(x + (i % 2), y - i, i === 0 ? BLUE_L : BLUE);
  g.px(x - 1, y - 1, BLUE).px(x + 1, y - 2, BLUE);
}

/** 잘게 쪼개진 영혼 조각 */
function shards(g: Pen, x: number, y: number): void {
  g.px(x, y, BLUE_L).px(x + 2, y - 1, BLUE).px(x - 2, y + 1, BLUE).px(x + 1, y + 2, BLUE_L).px(x - 1, y - 2, BLUE);
}

export const FK_WEAPON_ART = {
  fkZwei: (g: Pen) => {
    // 긴 손잡이 · 넓은 날밑 · 넓은 붉은 날 (가운데 밝은 줄)
    g.line(2, 14, 4, 12, "#3a2418").px(1, 15, GOLD);
    g.line(2, 10, 6, 14, GOLD);
    for (let i = 0; i < 9; i++) {
      g.px(5 + i, 11 - i, RED).px(6 + i, 11 - i, RED_D).px(5 + i, 10 - i, RED_L);
    }
    g.px(14, 2, WH).px(15, 1, RED_L);
  },
};

export const FK_PASSIVE_ART = {
  fkCrest: (g: Pen) => {
    g.rect(4, 3, 8, 9, PLATE).rect(5, 4, 6, 7, DARK).line(4, 12, 8, 15, PLATE).line(11, 12, 8, 15, PLATE);
    g.px(7, 6, RED).px(8, 6, RED).rect(6, 7, 4, 1, GOLD).px(7, 8, GOLD).px(8, 8, GOLD).px(5, 5, "#8a6a3a").px(10, 9, "#8a6a3a");
  },
  fkPlate: (g: Pen) => {
    g.rect(3, 4, 10, 9, PLATE).rect(4, 5, 8, 2, PLATE_L).rect(7, 7, 2, 4, DARK).rect(2, 3, 3, 3, PLATE_L).rect(11, 3, 3, 3, PLATE_L);
    flame(g, 4, 14, 3);
    flame(g, 11, 14, 3);
  },
  fkGrip: (g: Pen) => {
    g.rect(4, 6, 8, 6, PLATE).rect(4, 6, 8, 1, PLATE_L).rect(5, 12, 6, 2, DARK);
    g.line(8, 1, 8, 6, "#3a2418").rect(5, 4, 7, 1, GOLD);
    flame(g, 12, 11, 3);
  },
  fkReach: (g: Pen) => {
    for (let i = 0; i < 12; i++) g.px(2 + i, 13 - i, RED).px(2 + i, 12 - i, RED_L);
    g.line(1, 10, 4, 13, GOLD).px(14, 1, WH);
    g.px(9, 12, BLUE_L).px(11, 12, BLUE).px(13, 12, BLUE_L);
  },
  fkHarvest: (g: Pen) => {
    g.ring(8, 8, 5, BLUE).disc(8, 8, 2, BLUE_L);
    shards(g, 3, 3);
    shards(g, 13, 4);
    shards(g, 4, 13);
    shards(g, 12, 13);
  },
  fkPyre: (g: Pen) => {
    g.rect(3, 13, 10, 2, "#3a2418").line(3, 12, 12, 13, "#5a3a20");
    for (let x = 4; x <= 11; x += 2) flame(g, x, 11, 6 + (x % 3));
    g.px(8, 2, WH);
  },
  fkLines: (g: Pen) => {
    g.line(2, 13, 7, 8, BLUE).line(7, 8, 13, 3, BLUE).line(2, 13, 13, 10, BLUE).line(2, 13, 9, 14, BLUE_L);
    g.disc(13, 3, 1, BLUE_L).disc(13, 10, 1, BLUE_L).px(2, 13, WH);
  },
  fkCross: (g: Pen) => {
    g.line(2, 2, 13, 13, RED).line(3, 2, 14, 13, RED_L).line(13, 2, 2, 13, RED).line(14, 2, 3, 13, RED_D);
    g.disc(8, 8, 1, WH);
  },
  fkMajesty: (g: Pen) => {
    g.rect(3, 6, 10, 3, DARK).rect(3, 6, 10, 1, PLATE_L);
    for (const x of [3, 6, 9, 12]) g.rect(x, 3, 1, 3, BLUE).px(x, 2, BLUE_L);
    g.px(8, 7, RED).px(5, 7, BLUE_L).px(11, 7, BLUE_L);
    shards(g, 8, 12);
  },
  fkRequiem: (g: Pen) => {
    g.rect(5, 3, 1, 8, BLUE_L).rect(10, 2, 1, 8, BLUE_L).rect(5, 3, 6, 1, BLUE_L).rect(5, 2, 6, 1, BLUE_L);
    g.disc(4, 11, 2, BLUE).disc(9, 10, 2, BLUE);
    flame(g, 13, 14, 4);
  },
};
