// 에테르 광부(히든) 아이콘: 곡괭이(나무 자루·쇠 머리·하늘빛 에테르) 10·전용 아이템 10
import { type Pen } from "./pen";

const WOOD = "#8a5a2a";
const WOOD_L = "#b07a40";
const IRON = "#9aa3b8";
const IRON_L = "#e8ecf4";
const ETHER = "#5ad8e8";
const ETHER_L = "#c8fbff";
const GOLD = "#ffd040";
const FIRE = "#ff7a3a";

/** 곡괭이 (자루 아래 x0,y0 → 머리 가운데 x1,y1, 머리는 자루와 엇갈림) */
function pick(g: Pen, x0 = 3, y0 = 14, x1 = 11, y1 = 4, head = IRON, tip = IRON_L): void {
  g.line(x0, y0, x1, y1, WOOD).line(x0 + 1, y0, x1 + 1, y1, WOOD_L);
  g.line(x1 - 5, y1 - 2, x1 + 1, y1, head).line(x1 + 1, y1, x1 + 4, y1 + 5, head);
  g.px(x1 - 5, y1 - 2, tip).px(x1 + 4, y1 + 5, tip);
}

/** 에테르 결정 (x, y 가운데) */
function crystal(g: Pen, x: number, y: number, c = ETHER): void {
  g.line(x, y - 3, x - 2, y, c).line(x, y - 3, x + 2, y, c).line(x - 2, y, x, y + 3, c).line(x + 2, y, x, y + 3, c).px(x, y, ETHER_L);
}

export const MN_WEAPON_ART = {
  mnPick: (g: Pen) => pick(g),
  mnDrill: (g: Pen) => {
    g.line(3, 14, 8, 8, WOOD);
    for (let i = 0; i < 6; i++) g.line(7 + i, 9 - i, 9 + i, 11 - i, i % 2 ? ETHER : IRON_L);
    g.px(14, 2, ETHER_L);
  },
  mnSledge: (g: Pen) => {
    g.line(4, 15, 9, 6, WOOD).line(5, 15, 10, 6, WOOD_L);
    g.rect(3, 2, 11, 4, IRON).rect(3, 2, 11, 1, IRON_L).px(1, 3, IRON).px(15, 3, IRON);
  },
  mnTnt: (g: Pen) => {
    pick(g, 2, 15, 9, 7);
    g.rect(11, 8, 4, 7, "#d83a3a").rect(11, 10, 4, 1, "#f2e6cc").line(13, 8, 14, 5, "#4a3a2a").px(14, 4, FIRE).px(15, 3, GOLD);
  },
  mnCart: (g: Pen) => {
    g.rect(2, 6, 12, 5, "#6a4a2a").rect(2, 6, 12, 1, WOOD_L).disc(5, 12, 2, IRON).disc(11, 12, 2, IRON);
    crystal(g, 8, 4);
    g.rect(0, 14, 16, 1, "#4a4a5a");
  },
  mnPit: (g: Pen) => {
    g.disc(8, 11, 5, "#1a1018").ring(8, 11, 5, "#6a4a2a");
    g.line(4, 1, 11, 8, WOOD).rect(10, 7, 3, 3, IRON).px(12, 9, IRON_L);
  },
  mnMagnet: (g: Pen) => {
    pick(g, 2, 15, 8, 8);
    g.line(10, 2, 10, 8, "#d83a3a").line(14, 2, 14, 8, "#3a6ad8").line(10, 8, 14, 8, IRON).px(10, 2, IRON_L).px(14, 2, IRON_L);
  },
  mnGem: (g: Pen) => {
    pick(g, 2, 15, 9, 7, "#c84ad8", "#ffc8ff");
    crystal(g, 13, 12, "#ff7ad8");
  },
  mnThrow: (g: Pen) => {
    pick(g, 5, 12, 10, 5);
    g.ring(8, 8, 7, ETHER).px(1, 8, ETHER_L);
  },
  mnEther: (g: Pen) => {
    pick(g, 1, 15, 7, 8, ETHER, ETHER_L);
    g.rect(11, 0, 3, 13, ETHER).rect(12, 0, 1, 13, ETHER_L).rect(9, 13, 7, 2, ETHER);
  },
};

export const MN_PASSIVE_ART = {
  mnLamp: (g: Pen) => {
    g.rect(5, 3, 6, 2, IRON).rect(4, 5, 8, 8, "#4a4a5a").rect(6, 7, 4, 4, GOLD).px(7, 8, "#ffffff").rect(4, 13, 8, 1, IRON);
  },
  mnHelmet: (g: Pen) => {
    g.rect(4, 5, 8, 5, GOLD).rect(5, 4, 6, 1, GOLD).rect(2, 10, 12, 2, "#c8a020").rect(7, 6, 2, 2, "#fff4c0");
  },
  mnMuscle: (g: Pen) => {
    g.disc(6, 8, 4, "#f2c8a0").disc(10, 6, 3, "#f2c8a0").rect(2, 10, 6, 4, "#f2c8a0");
    pick(g, 10, 15, 13, 9);
  },
  mnVein: (g: Pen) => {
    g.rect(1, 1, 14, 14, "#3a3040").line(1, 12, 6, 7, ETHER).line(6, 7, 10, 9, ETHER).line(10, 9, 15, 3, ETHER_L);
  },
  mnGold: (g: Pen) => {
    g.rect(1, 1, 14, 14, "#3a3040").line(1, 10, 7, 6, GOLD).line(7, 6, 15, 8, GOLD).disc(11, 12, 2, GOLD).px(11, 11, "#ffffff");
  },
  mnCanary: (g: Pen) => {
    g.disc(8, 9, 4, "#ffe040").disc(10, 6, 3, "#ffe040").px(11, 5, "#1a1a1a").px(13, 6, FIRE).px(14, 6, FIRE);
    g.line(4, 13, 12, 13, WOOD).line(2, 3, 4, 5, "#ffffff").line(1, 7, 3, 7, "#ffffff");
  },
  mnChain: (g: Pen) => {
    g.disc(5, 10, 4, FIRE).disc(11, 6, 4, GOLD).disc(5, 10, 2, "#ffffff");
    crystal(g, 12, 12);
  },
  mnMole: (g: Pen) => {
    g.rect(0, 11, 16, 5, "#6a4a2a").disc(8, 10, 5, "#5a4a5a").px(6, 9, "#1a1a1a").px(10, 9, "#1a1a1a").px(8, 11, "#ff9ab0");
    g.line(3, 13, 1, 15, "#f2c8a0").line(13, 13, 15, 15, "#f2c8a0");
  },
  mnExpert: (g: Pen) => {
    for (const [x, y] of [[3, 4], [9, 2], [12, 8], [5, 10]]) g.disc(x!, y!, 2, "#8a8a9a");
    g.rect(0, 14, 16, 2, "#6a4a2a");
  },
  mnJackpot: (g: Pen) => {
    crystal(g, 8, 8, GOLD);
    g.px(2, 2, "#ffffff").px(13, 3, "#ffffff").px(3, 13, "#ffffff").px(14, 12, ETHER_L);
  },
};
