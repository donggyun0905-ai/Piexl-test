// 차원의 순례자(히든) 아이콘: 여러 차원에서 모은 수집품 무기 20 · 전용 아이템 20 (배낭 갈색·하늘색·보랏빛 차원)
import { type Pen } from "./pen";

const BAG = "#b8783e";
const BAG_D = "#7a4a28";
const SKY = "#7ad0f0";
const VIO = "#8a5aff";
const VIO_L = "#c8a8ff";
const PINK = "#ff6aa8";
const GOLD = "#ffd040";
const STEEL = "#d8e0ec";
const STEEL_D = "#8a94a8";
const WOOD = "#8a5a30";
const WH = "#ffffff";

/** 반짝임 (+ 모양) */
function twinkle(g: Pen, x: number, y: number, c = WH): void {
  g.px(x, y, c).px(x - 1, y, c).px(x + 1, y, c).px(x, y - 1, c).px(x, y + 1, c);
}

export const PG_WEAPON_ART = {
  pgStaff: (g: Pen) => {
    g.line(4, 14, 10, 6, WOOD).line(5, 14, 11, 6, "#5e3a1c").disc(11, 4, 2, PINK).px(10, 3, "#ffd0e4").px(13, 2, GOLD).px(8, 3, GOLD);
    twinkle(g, 3, 4, GOLD);
  },
  pgBlade: (g: Pen) => {
    g.line(3, 13, 11, 5, STEEL).line(4, 13, 12, 5, STEEL_D).line(11, 4, 13, 2, WH).line(2, 11, 6, 15, GOLD).rect(1, 13, 2, 2, "#5e3a1c").px(7, 9, "#c8a080");
  },
  pgFlag: (g: Pen) => {
    g.line(3, 1, 3, 15, STEEL_D).rect(4, 2, 9, 6, VIO).rect(4, 2, 9, 1, VIO_L).px(12, 7, "#5a3aaa").px(13, 5, VIO);
    g.px(8, 4, GOLD).px(7, 5, GOLD).px(8, 5, GOLD).px(9, 5, GOLD).px(8, 6, GOLD).px(3, 0, GOLD);
  },
  pgLantern: (g: Pen) => {
    g.ring(8, 2, 2, STEEL_D).rect(4, 4, 8, 2, "#5e3a1c").rect(5, 6, 6, 7, "#ffd860").rect(4, 13, 8, 2, "#5e3a1c").rect(7, 8, 2, 3, "#fff6c0").line(5, 6, 5, 12, "#c08a20").line(10, 6, 10, 12, "#c08a20");
  },
  pgPan: (g: Pen) => {
    g.disc(7, 8, 5, STEEL_D).disc(7, 8, 4, "#5a6272").px(5, 6, STEEL).px(6, 5, STEEL).rect(11, 7, 5, 2, WOOD).px(15, 7, "#5e3a1c");
    g.px(3, 2, WH).px(10, 2, WH);
  },
  pgMap: (g: Pen) => {
    g.rect(1, 3, 14, 10, "#ecdcac").rect(1, 3, 1, 10, "#c0a870").rect(14, 3, 1, 10, "#c0a870").line(5, 3, 5, 12, "#d8c890").line(10, 3, 10, 12, "#d8c890");
    g.line(3, 10, 7, 7, "#d84a5a").line(7, 7, 11, 9, "#d84a5a").px(12, 5, "#d84a5a").px(11, 6, "#d84a5a").px(13, 6, "#d84a5a");
  },
  pgCompass: (g: Pen) => {
    g.disc(8, 8, 6, GOLD).disc(8, 8, 5, "#1a2a4a").line(8, 4, 8, 7, "#ff4a5a").line(8, 9, 8, 12, STEEL).px(8, 8, WH).px(4, 8, SKY).px(12, 8, SKY).px(8, 1, GOLD);
  },
  pgBoomerang: (g: Pen) => {
    g.line(2, 12, 8, 4, "#c89a5a").line(8, 4, 14, 12, "#c89a5a").line(3, 12, 8, 6, "#8a5a2a").line(8, 6, 13, 12, "#8a5a2a").px(8, 4, SKY).px(1, 4, "#c8fff0").px(14, 3, "#c8fff0");
  },
  pgSling: (g: Pen) => {
    g.line(4, 14, 8, 9, WOOD).line(8, 9, 4, 3, WOOD).line(8, 9, 12, 3, WOOD).line(4, 3, 8, 6, "#d84a5a").line(12, 3, 8, 6, "#d84a5a").disc(8, 6, 1, "#a8a0a0").px(2, 8, "#c8c0b8").px(14, 7, "#c8c0b8");
  },
  pgUmbrella: (g: Pen) => {
    g.disc(8, 7, 6, "#3c4c94").rect(2, 7, 13, 6, "#1a1030").line(8, 1, 8, 13, STEEL_D).line(8, 13, 10, 14, STEEL_D).px(5, 4, GOLD).px(10, 3, GOLD).px(12, 6, GOLD).px(4, 6, WH);
  },
  pgBell: (g: Pen) => {
    g.disc(8, 8, 4, STEEL).rect(4, 8, 9, 3, STEEL).rect(3, 11, 11, 1, STEEL_D).px(8, 12, GOLD).px(8, 13, GOLD).px(6, 6, WH).line(8, 2, 8, 3, PINK).px(7, 2, PINK).px(9, 2, PINK);
    g.px(2, 5, VIO_L).px(14, 5, VIO_L).px(1, 8, VIO_L).px(15, 8, VIO_L);
  },
  pgCrane: (g: Pen) => {
    g.line(2, 9, 8, 6, "#f8f4ec").line(8, 6, 14, 9, "#f8f4ec").line(5, 11, 8, 6, "#ff8ab8").line(11, 11, 8, 6, "#ff8ab8").line(8, 6, 8, 3, "#f8f4ec").px(9, 3, "#d84a5a").px(8, 12, "#ff8ab8");
  },
  pgCrystal: (g: Pen) => {
    g.line(8, 1, 12, 7, "#6ae0ff").line(12, 7, 8, 15, "#3ab0e0").line(8, 15, 4, 7, "#3ab0e0").line(4, 7, 8, 1, "#e0fbff").rect(6, 6, 5, 4, "#6ae0ff").px(7, 5, WH).px(6, 7, WH);
  },
  pgClock: (g: Pen) => {
    g.disc(8, 9, 5, "#c88a2a").disc(8, 9, 4, "#ffe8a0").line(8, 9, 8, 6, "#3a2a1a").line(8, 9, 10, 9, "#3a2a1a").rect(7, 2, 2, 2, STEEL_D).line(12, 4, 14, 2, STEEL_D).px(14, 1, "#ff6a3a");
  },
  pgMeteor: (g: Pen) => {
    g.line(1, 1, 9, 9, "#ffb040").line(2, 1, 10, 9, "#ff8a3a").disc(11, 11, 3, GOLD).px(10, 10, WH).px(11, 10, WH);
    twinkle(g, 4, 11, "#fff0a0");
  },
  pgSeed: (g: Pen) => {
    g.disc(8, 10, 4, "#8a5a2a").disc(8, 10, 3, "#b8783e").px(7, 8, "#e0a868").line(8, 6, 8, 3, "#5ad07a").line(8, 4, 5, 2, "#5ad07a").line(8, 4, 11, 2, "#8af0a0").px(3, 13, "#a8f0b0").px(13, 13, "#a8f0b0");
  },
  pgMirror: (g: Pen) => {
    g.line(2, 12, 6, 2, "#c8f0ff").line(6, 2, 8, 9, "#8ac8e8").line(8, 9, 2, 12, "#c8f0ff").line(9, 13, 13, 5, "#c8f0ff").line(13, 5, 14, 12, "#8ac8e8").px(4, 7, WH).px(12, 9, WH).px(10, 2, "#ffc8e8");
  },
  pgHourglass: (g: Pen) => {
    g.rect(3, 1, 10, 2, WOOD).rect(3, 13, 10, 2, WOOD).line(4, 3, 7, 8, "#c8f0ff").line(11, 3, 8, 8, "#c8f0ff").line(7, 8, 4, 12, "#c8f0ff").line(8, 8, 11, 12, "#c8f0ff");
    g.rect(5, 4, 6, 1, "#ffd860").rect(6, 5, 4, 1, "#ffd860").px(8, 9, "#ffd860").rect(6, 11, 4, 2, "#ffd860").rect(5, 12, 6, 1, "#e0a020");
  },
  pgKey: (g: Pen) => {
    g.ring(5, 5, 3, GOLD).px(5, 5, PINK).line(7, 7, 13, 13, GOLD).line(8, 7, 14, 13, "#c8a020").rect(11, 12, 2, 3, GOLD).rect(13, 10, 2, 2, GOLD);
  },
  pgGate: (g: Pen) => {
    g.rect(3, 2, 10, 13, "#5a5a70").rect(4, 3, 8, 12, VIO).rect(5, 4, 6, 11, "#3a1a8a").disc(8, 9, 2, "#c060ff").px(8, 9, WH).rect(2, 14, 12, 1, "#2a2a3a").px(10, 9, GOLD);
  },
};

export const PG_PASSIVE_ART = {
  pgPack: (g: Pen) => {
    g.rect(3, 4, 10, 11, BAG).rect(3, 4, 10, 4, BAG_D).rect(4, 4, 8, 1, "#e0a868").rect(5, 9, 6, 4, "#e0a868").rect(6, 10, 4, 2, BAG).px(8, 10, VIO).px(5, 7, GOLD).px(10, 7, GOLD);
    g.rect(2, 1, 12, 3, "#d84a5a").line(4, 1, 4, 3, "#5a3418").line(11, 1, 11, 3, "#5a3418");
  },
  pgBoots: (g: Pen) => {
    g.rect(3, 3, 4, 9, "#8e5632").rect(3, 11, 7, 3, "#8e5632").rect(3, 14, 8, 1, "#5c3418").rect(9, 2, 4, 9, "#a86a42").rect(9, 10, 6, 3, "#a86a42").rect(9, 13, 7, 1, "#5c3418").px(4, 5, GOLD).px(10, 4, GOLD);
  },
  pgLens: (g: Pen) => {
    g.ring(6, 6, 4, GOLD).disc(6, 6, 3, "#c8f0ff").px(5, 4, WH).px(4, 5, WH).line(9, 9, 14, 14, WOOD).line(10, 9, 14, 13, "#5e3a1c");
  },
  pgClover: (g: Pen) => {
    g.disc(5, 5, 2, "#3ab060").disc(10, 5, 2, "#3ab060").disc(5, 10, 2, "#3ab060").disc(10, 10, 2, "#5ad07a").rect(7, 7, 2, 2, "#1a7a3a").line(8, 9, 11, 14, "#1a7a3a").px(4, 4, "#a8f0b0");
  },
  pgSnack: (g: Pen) => {
    g.rect(4, 5, 8, 9, "#e8c8a0").rect(4, 5, 8, 2, "#c8a070").line(6, 3, 10, 3, "#d84a5a").px(8, 4, "#d84a5a").disc(7, 10, 1, "#8a5a2a").disc(10, 9, 1, "#ff8ab8").px(6, 12, GOLD);
  },
  pgBadge: (g: Pen) => {
    g.disc(8, 8, 6, GOLD).disc(8, 8, 5, SKY).rect(7, 4, 2, 8, WH).rect(4, 7, 8, 2, WH).px(8, 8, PINK).px(5, 4, WH);
  },
  pgJournal: (g: Pen) => {
    g.rect(3, 2, 10, 13, "#6a3a8a").rect(4, 3, 8, 11, "#f8f4ec").line(5, 5, 10, 5, "#a89a8a").line(5, 7, 10, 7, "#a89a8a").line(5, 9, 8, 9, "#a89a8a").px(10, 10, GOLD).px(9, 11, GOLD).px(11, 11, GOLD).rect(12, 2, 1, 6, PINK);
  },
  pgRummage: (g: Pen) => {
    g.rect(3, 6, 10, 9, BAG).rect(3, 6, 10, 2, BAG_D).line(5, 1, 6, 6, STEEL).disc(10, 3, 2, PINK).line(9, 4, 9, 6, WOOD).px(13, 2, GOLD).px(2, 3, GOLD);
  },
  pgDoubleBag: (g: Pen) => {
    g.rect(1, 5, 8, 9, BAG_D).rect(1, 5, 8, 2, "#5e3818").rect(6, 3, 9, 11, BAG).rect(6, 3, 9, 3, "#e0a868").rect(8, 8, 5, 4, "#e0a868").px(10, 9, VIO).px(4, 10, GOLD);
  },
  pgEcho: (g: Pen) => {
    g.disc(8, 8, 3, VIO).disc(8, 8, 2, VIO_L).px(7, 7, WH).ring(8, 8, 5, "#6a3aff").ring(8, 8, 7, "#4a2aaa");
  },
  pgSouvenir: (g: Pen) => {
    g.disc(8, 10, 4, "#4aa878").rect(7, 3, 2, 3, "#4aa878").rect(6, 2, 4, 1, WOOD).px(6, 9, "#b0f4cc").px(10, 11, "#2a6a4a").line(3, 4, 4, 6, "#ff8ab8").px(13, 4, "#ff8ab8");
  },
  pgStamp: (g: Pen) => {
    g.rect(5, 2, 6, 6, WOOD).rect(6, 1, 4, 1, "#5e3a1c").rect(3, 8, 10, 3, "#5e3a1c").rect(3, 11, 10, 3, "#d84a5a").px(6, 12, "#ffc8c8").px(9, 12, "#ffc8c8").px(14, 5, VIO_L);
  },
  pgCampfire: (g: Pen) => {
    g.line(3, 14, 13, 11, WOOD).line(3, 11, 13, 14, "#5e3a1c").disc(8, 8, 3, "#ff6a2a").disc(8, 9, 2, "#ffd040").px(8, 4, "#ff8a3a").px(7, 3, "#ffb040").px(8, 9, WH);
  },
  pgStarDust: (g: Pen) => {
    twinkle(g, 5, 5, GOLD);
    twinkle(g, 11, 9, "#fff0a0");
    g.px(3, 11, "#ffe8a0").px(13, 3, "#ffe8a0").px(8, 13, "#ffe8a0").px(9, 2, WH).px(2, 8, WH);
  },
  pgKeyring: (g: Pen) => {
    g.ring(5, 4, 3, STEEL_D).line(7, 6, 9, 8, STEEL_D).line(9, 8, 12, 8, "#6ae0ff").line(12, 8, 10, 14, "#3ab0e0").line(10, 14, 8, 9, "#3ab0e0").px(10, 10, "#e0fbff").px(11, 9, WH);
  },
  pgPostcard: (g: Pen) => {
    g.rect(1, 4, 11, 8, "#f8f4ec").rect(2, 5, 5, 6, SKY).rect(2, 9, 5, 2, "#5ab05a").px(4, 6, GOLD).rect(4, 2, 11, 8, "#ecdcac").rect(5, 3, 5, 6, VIO).px(7, 4, WH).rect(11, 3, 3, 2, "#d84a5a");
  },
  pgTent: (g: Pen) => {
    g.line(8, 2, 2, 13, "#d84a5a").line(8, 2, 14, 13, "#d84a5a").line(8, 3, 4, 12, "#ff8a94").line(8, 3, 12, 12, "#9a2a3a").line(8, 5, 8, 13, "#3a1a2a").rect(2, 13, 13, 1, "#5e3a1c").px(8, 1, GOLD);
  },
  pgShortcut: (g: Pen) => {
    g.line(2, 13, 6, 9, "#ecdcac").line(6, 9, 10, 9, "#ecdcac").line(10, 9, 13, 4, "#ecdcac").line(2, 13, 13, 4, VIO_L).px(13, 3, GOLD).px(12, 3, GOLD).px(13, 5, GOLD);
  },
  pgLuckyCoin: (g: Pen) => {
    g.disc(8, 8, 6, "#c88a2a").disc(8, 8, 5, GOLD).rect(7, 5, 2, 6, "#c88a2a").rect(5, 7, 6, 2, "#c88a2a").px(6, 5, WH).px(5, 6, WH);
  },
  pgWorldLeaf: (g: Pen) => {
    g.disc(8, 7, 5, "#3ab060").disc(7, 6, 3, "#5ad07a").line(8, 3, 8, 14, "#1a7a3a").line(8, 7, 11, 5, "#1a7a3a").line(8, 9, 5, 7, "#1a7a3a").px(6, 4, "#a8f0b0").px(12, 12, GOLD);
  },
};
