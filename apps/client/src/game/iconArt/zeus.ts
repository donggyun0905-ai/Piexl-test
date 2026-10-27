// 제우스(히든) 아이콘: 번개(하늘빛·흰빛) 무기 10 · 전용 아이템 10
import { type Pen } from "./pen";

const BOLT = "#8ac8ff";
const BOLT_L = "#ffffff";
const GOLD = "#ffd040";
const CLOUD = "#c8d0e0";
const CLOUD_D = "#7a8298";

/** 번개 지그재그 (위 x0,y0 → 아래) */
function bolt(g: Pen, x0 = 9, y0 = 1, c = BOLT): void {
  g.line(x0, y0, x0 - 4, y0 + 6, c).line(x0 - 4, y0 + 6, x0, y0 + 7, c).line(x0, y0 + 7, x0 - 3, y0 + 14, c);
  g.px(x0 - 1, y0 + 3, BOLT_L).px(x0 - 2, y0 + 7, BOLT_L);
}
function cloud(g: Pen, y = 3): void {
  g.disc(5, y + 2, 3, CLOUD).disc(10, y + 1, 4, CLOUD).rect(3, y + 3, 10, 2, CLOUD_D);
}

export const ZS_WEAPON_ART = {
  zsBolt: (g: Pen) => {
    g.line(2, 14, 13, 3, GOLD).line(13, 3, 14, 1, BOLT_L);
    g.line(9, 4, 12, 6, BOLT).line(5, 9, 8, 11, BOLT);
  },
  zsSky: (g: Pen) => {
    cloud(g, 0);
    bolt(g, 10, 5);
  },
  zsChain: (g: Pen) => {
    g.line(1, 8, 5, 4, BOLT).line(5, 4, 9, 11, BOLT).line(9, 11, 14, 5, BOLT);
    for (const [x, y] of [[5, 4], [9, 11], [14, 5]]) g.px(x!, y!, BOLT_L);
  },
  zsStorm: (g: Pen) => {
    cloud(g, 1);
    g.line(4, 8, 3, 12, BOLT).line(8, 8, 7, 14, BOLT_L).line(12, 8, 11, 12, BOLT);
  },
  zsAegis: (g: Pen) => {
    g.disc(8, 8, 6, GOLD).disc(8, 8, 4, "#c89020");
    bolt(g, 10, 3, BOLT_L);
  },
  zsEagle: (g: Pen) => {
    g.line(1, 6, 7, 9, "#8a6a4a").line(15, 6, 9, 9, "#8a6a4a").rect(7, 7, 3, 5, "#6a4a2a").px(8, 6, BOLT_L).px(8, 5, GOLD);
    g.line(4, 13, 7, 12, BOLT);
  },
  zsClap: (g: Pen) => {
    g.ring(8, 8, 7, BOLT).ring(8, 8, 4, BOLT_L).px(8, 8, GOLD);
  },
  zsSpear: (g: Pen) => {
    g.line(1, 15, 15, 1, BOLT).line(2, 15, 15, 2, BOLT_L).px(14, 1, GOLD).px(15, 0, GOLD);
  },
  zsOrb: (g: Pen) => {
    g.disc(8, 8, 4, BOLT).disc(7, 7, 2, BOLT_L);
    g.line(2, 3, 4, 5, BOLT).line(13, 12, 11, 10, BOLT).line(13, 3, 11, 5, BOLT);
  },
  zsTitan: (g: Pen) => {
    g.rect(2, 9, 12, 6, "#6a6a7a").rect(4, 7, 3, 2, "#6a6a7a");
    bolt(g, 11, 0, GOLD);
  },
};

export const ZS_PASSIVE_ART = {
  zsKing: (g: Pen) => {
    g.rect(3, 6, 10, 6, GOLD).px(3, 4, GOLD).px(8, 3, GOLD).px(12, 4, GOLD).rect(3, 5, 1, 1, GOLD).rect(12, 5, 1, 1, GOLD);
    g.px(8, 8, BOLT).px(5, 9, BOLT_L).px(11, 9, BOLT_L);
  },
  zsCloud: (g: Pen) => {
    cloud(g, 6);
    g.line(1, 13, 14, 13, BOLT);
  },
  zsNectar: (g: Pen) => {
    g.rect(5, 3, 6, 2, GOLD).rect(4, 5, 8, 6, GOLD).rect(6, 11, 4, 3, GOLD).rect(5, 6, 6, 3, "#ff9a6a");
  },
  zsSkyEye: (g: Pen) => {
    g.disc(8, 8, 6, BOLT_L).disc(8, 8, 3, BOLT).px(8, 8, "#1a2448");
  },
  zsConductor: (g: Pen) => {
    g.line(2, 3, 13, 3, GOLD).line(2, 12, 13, 12, GOLD).line(5, 3, 9, 12, BOLT);
  },
  zsOverload: (g: Pen) => {
    g.disc(8, 8, 5, "#ff9a3a").disc(8, 8, 2, BOLT_L);
    for (const [x, y] of [[1, 1], [14, 2], [2, 14], [13, 13]]) g.px(x!, y!, BOLT);
  },
  zsWrath: (g: Pen) => {
    g.disc(8, 9, 5, "#d83a3a").px(6, 8, BOLT_L).px(10, 8, BOLT_L);
    bolt(g, 9, 0, GOLD);
  },
  zsStep: (g: Pen) => {
    g.rect(3, 10, 4, 3, "#c8a870").rect(9, 6, 4, 3, "#c8a870");
    g.line(1, 14, 5, 12, BOLT).line(8, 9, 14, 4, BOLT);
  },
  zsRetort: (g: Pen) => {
    g.disc(8, 8, 5, GOLD).disc(8, 8, 3, "#c89020");
    g.line(1, 1, 5, 5, BOLT).line(15, 1, 11, 5, BOLT).line(1, 15, 5, 11, BOLT);
  },
  zsGiant: (g: Pen) => {
    g.rect(4, 4, 8, 10, "#6a6a7a").px(6, 7, "#ff3a3a").px(9, 7, "#ff3a3a");
    g.line(14, 0, 9, 9, GOLD);
  },
};
