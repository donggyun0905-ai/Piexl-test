// 아스칼론 풍류사 아이콘: 천자문 두루마리 무기 10 (두루마리 위에 구절 마법 그림) · 전용 아이템 10 (먹·비취·금)
import { star, type Pen } from "./pen";

const PAPER = "#f4e6c0";
const ROD = "#8a5a2a";
const INK = "#2a2438";
const JADE = "#2ab89a";
const GOLD = "#ffd860";
const SKY = "#8ad0ff";
const RED = "#e85a4a";
const CLOUD = "#c8d4f0";

/** 펼친 두루마리 (위아래 나무 막대) */
function scroll(g: Pen): void {
  g.rect(3, 2, 10, 12, PAPER).rect(2, 1, 12, 2, ROD).rect(2, 13, 12, 2, ROD).px(2, 1, INK).px(13, 14, INK);
}

/** 작은 구름 */
function cloud(g: Pen, x: number, y: number, c = CLOUD): void {
  g.rect(x, y + 1, 6, 2, c).rect(x + 1, y, 3, 1, c).px(x + 4, y, c).rect(x, y + 3, 6, 1, "#8a9ac8");
}

export const PU_WEAPON_ART = {
  puHeaven: (g: Pen) => {
    scroll(g);
    g.rect(5, 3, 2, 10, INK).rect(9, 3, 2, 10, "#d8a83a").px(5, 3, "#5a4a8a").px(10, 12, GOLD);
  },
  puFlood: (g: Pen) => {
    scroll(g);
    g.line(4, 9, 6, 6, SKY).line(6, 6, 8, 9, SKY).line(8, 9, 10, 6, SKY).line(10, 6, 12, 9, SKY).rect(4, 10, 8, 2, "#4a8ae8");
  },
  puSunMoon: (g: Pen) => {
    scroll(g);
    g.disc(6, 6, 2, RED).disc(10, 10, 2, "#c8d0ff").px(11, 9, PAPER);
  },
  puStars: (g: Pen) => {
    scroll(g);
    g.line(5, 5, 8, 8, "#8a8ad8").line(8, 8, 11, 5, "#8a8ad8").line(8, 8, 9, 11, "#8a8ad8");
    star(g, 5, 5, GOLD);
    star(g, 11, 5, GOLD);
    g.px(8, 8, GOLD).px(9, 11, GOLD);
  },
  puSeasons: (g: Pen) => {
    scroll(g);
    g.line(4, 5, 11, 5, SKY).line(5, 7, 12, 7, SKY).line(4, 10, 11, 10, "#ff8a3a").line(5, 12, 12, 12, RED);
  },
  puHarvest: (g: Pen) => {
    scroll(g);
    g.line(6, 12, 9, 4, "#c89a3a").line(9, 4, 12, 5, "#e8c86a").rect(5, 9, 3, 3, GOLD).px(6, 8, GOLD);
  },
  puRain: (g: Pen) => {
    scroll(g);
    cloud(g, 5, 3);
    g.line(5, 8, 4, 11, SKY).line(8, 8, 7, 11, SKY).line(11, 8, 10, 11, SKY);
  },
  puFrost: (g: Pen) => {
    scroll(g);
    g.line(8, 4, 8, 12, "#c8f0ff").line(4, 8, 12, 8, "#c8f0ff").line(5, 5, 11, 11, SKY).line(11, 5, 5, 11, SKY).px(8, 8, "#ffffff");
  },
  puGold: (g: Pen) => {
    scroll(g);
    g.line(4, 6, 12, 6, "#4ab8e8").line(4, 8, 12, 8, "#4ab8e8").disc(8, 11, 1, GOLD).px(5, 11, GOLD).px(11, 11, GOLD);
  },
  puSword: (g: Pen) => {
    scroll(g);
    g.line(5, 11, 11, 5, "#e8ecf4").line(6, 11, 12, 5, "#9aa3b8").rect(4, 11, 2, 2, ROD).line(4, 9, 7, 12, GOLD);
  },
};

export const PU_PASSIVE_ART = {
  puShrink: (g: Pen) => {
    g.rect(2, 10, 3, 2, CLOUD).rect(11, 4, 3, 2, CLOUD).line(4, 9, 11, 5, JADE).line(5, 10, 12, 6, "#8af0d0").px(12, 3, "#ffffff");
  },
  puClone: (g: Pen) => {
    for (const [x, c] of [[3, "#8a9ac8"], [9, JADE]] as const) g.rect(x, 3, 4, 2, INK).rect(x, 5, 4, 4, "#f0c8a0").rect(x - 1, 9, 6, 5, c);
  },
  puDisguise: (g: Pen) => {
    g.rect(7, 2, 2, 12, ROD).rect(3, 5, 10, 2, ROD).disc(8, 4, 2, "#e8c86a").rect(5, 8, 6, 4, "#c8a050").px(7, 4, INK).px(9, 4, INK);
  },
  puThief: (g: Pen) => {
    g.disc(8, 10, 4, "#8a5a3a").rect(6, 4, 4, 3, "#6a3a2a").rect(5, 6, 6, 1, GOLD).disc(8, 10, 1, GOLD);
  },
  puCloud: (g: Pen) => {
    cloud(g, 2, 6, "#ffb0c8");
    cloud(g, 8, 4, "#b0e8ff");
    g.px(4, 12, "#ffe88a").px(10, 11, "#b0ffb8").px(13, 9, "#d8b0ff");
  },
  puInk: (g: Pen) => {
    g.line(11, 2, 6, 9, ROD).rect(4, 9, 3, 3, INK).disc(8, 13, 2, INK).px(13, 13, INK).px(3, 14, INK);
  },
  puDog: (g: Pen) => {
    g.rect(4, 6, 8, 6, "#d8a060").rect(4, 4, 2, 3, "#a87040").rect(10, 4, 2, 3, "#a87040").px(6, 8, INK).px(9, 8, INK).px(7, 10, INK).rect(3, 12, 10, 2, PAPER);
  },
  puFlute: (g: Pen) => {
    g.line(2, 13, 13, 2, "#c8a050").line(3, 13, 14, 2, "#8a6a2a").px(6, 9, INK).px(8, 7, INK).px(10, 5, INK).px(13, 9, SKY).px(12, 12, SKY);
  },
  puBook: (g: Pen) => {
    g.rect(3, 3, 10, 11, "#3a5ab8").rect(4, 4, 8, 9, PAPER).line(8, 4, 8, 12, "#c8b890").rect(5, 6, 2, 1, INK).rect(9, 6, 2, 1, INK).rect(5, 9, 2, 1, INK).rect(9, 9, 2, 1, INK);
  },
  puBanner: (g: Pen) => {
    g.rect(3, 2, 1, 13, ROD).rect(4, 2, 9, 7, RED).rect(6, 4, 5, 3, PAPER).px(8, 5, INK);
  },
};
