// 성국 라파엘 아이콘: 천공의 마도 복합 대궁 (흰 금빛 활 + 푸른 에테르 스코프) · 전용 아이템 20 (저격·거리 5 · 표적·지휘관 5 · 폭풍·바람 5 · 스킬·빛 5)
import type { Pen } from "./pen";

const GOLD = "#f2c14e";
const LIGHT = "#fff0a0";
const IVORY = "#f4ecd8";
const STEEL = "#c8d0e0";
const ETHER = "#6ac8ff";
const SKY = "#b0e8ff";
const RED = "#e8405a";
const DARK = "#2a3048";
const STORM = "#8aa8d0";

/** 화살 (촉 x,y · 오른쪽 위를 향함, 길이 len) */
function arrow(g: Pen, x: number, y: number, len = 9, c = IVORY): void {
  g.line(x, y, x - len, y + len, c).px(x - 1, y, c).px(x, y + 1, c).px(x - len - 1, y + len - 1, SKY).px(x - len + 1, y + len + 1, SKY);
}
/** 과녁 (가운데 x,y) */
function reticle(g: Pen, x = 8, y = 8, c = RED): void {
  g.ring(x, y, 5, c).line(x, y - 7, x, y - 3, c).line(x, y + 3, x, y + 7, c).line(x - 7, y, x - 3, y, c).line(x + 3, y, x + 7, y, c).px(x, y, c);
}

export const RF_WEAPON_ART = {
  rfBow: (g: Pen) => {
    g.line(4, 1, 2, 8, IVORY).line(2, 8, 4, 15, IVORY).line(4, 1, 4, 15, STEEL).px(5, 1, GOLD).px(5, 15, GOLD).px(1, 8, GOLD);
    arrow(g, 14, 2, 9);
    g.disc(8, 6, 2, ETHER).px(8, 6, "#ffffff");
  },
};

export const RF_PASSIVE_ART = {
  rfScope: (g: Pen) => {
    g.rect(2, 6, 12, 4, STEEL).disc(12, 8, 3, ETHER).px(12, 7, "#ffffff").rect(4, 10, 2, 3, DARK);
  },
  rfReach: (g: Pen) => {
    g.line(2, 2, 2, 14, IVORY).line(2, 2, 14, 8, STEEL).line(2, 14, 14, 8, STEEL).px(14, 8, GOLD);
  },
  rfPierce: (g: Pen) => {
    g.disc(5, 9, 2, DARK).disc(10, 5, 2, DARK);
    arrow(g, 14, 2, 12);
  },
  rfSteady: (g: Pen) => {
    g.ring(8, 8, 6, SKY).line(4, 8, 12, 8, IVORY).px(8, 8, GOLD);
  },
  rfHead: (g: Pen) => {
    g.disc(8, 9, 5, DARK);
    reticle(g, 8, 6);
  },
  rfBrand: (g: Pen) => {
    reticle(g, 8, 8, GOLD);
    g.disc(8, 8, 2, RED);
  },
  rfHunt: (g: Pen) => {
    g.rect(4, 4, 8, 3, GOLD).px(4, 3, GOLD).px(8, 2, GOLD).px(11, 3, GOLD);
    arrow(g, 14, 6, 8);
  },
  rfSpotter: (g: Pen) => {
    g.line(1, 8, 8, 4, IVORY).line(8, 4, 15, 8, IVORY).line(1, 8, 8, 12, IVORY).line(8, 12, 15, 8, IVORY).disc(8, 8, 2, ETHER).px(8, 8, DARK);
  },
  rfShard: (g: Pen) => {
    g.disc(8, 8, 2, LIGHT);
    for (const [x, y] of [[8, 2], [2, 8], [14, 8], [8, 14], [4, 4], [12, 4], [4, 12], [12, 12]] as const) g.px(x, y, SKY);
  },
  rfTwin: (g: Pen) => {
    reticle(g, 5, 6);
    g.ring(12, 11, 3, GOLD).px(12, 11, GOLD);
  },
  rfEye: (g: Pen) => {
    g.ring(8, 8, 6, STORM).ring(8, 8, 3, SKY).disc(8, 8, 1, "#ffffff");
  },
  rfRain: (g: Pen) => {
    for (let i = 0; i < 4; i++) g.line(3 + i * 3, 1 + (i % 2) * 3, 3 + i * 3, 9 + (i % 2) * 3, i % 2 ? SKY : IVORY).px(3 + i * 3, 10 + (i % 2) * 3, GOLD);
  },
  rfTail: (g: Pen) => {
    g.line(1, 5, 11, 5, SKY).line(3, 9, 14, 9, IVORY).line(1, 13, 9, 13, SKY).px(12, 4, SKY).px(15, 8, IVORY);
  },
  rfThunder: (g: Pen) => {
    g.line(10, 1, 6, 8, LIGHT).line(6, 8, 10, 8, LIGHT).line(10, 8, 5, 15, LIGHT);
    arrow(g, 15, 2, 5, SKY);
  },
  rfFeather: (g: Pen) => {
    g.line(3, 13, 13, 3, IVORY);
    for (let i = 0; i < 4; i++) g.px(5 + i * 2, 9 - i * 2, SKY).px(6 + i * 2, 12 - i * 2, SKY);
  },
  rfFocus: (g: Pen) => {
    g.ring(8, 8, 6, ETHER).ring(8, 8, 3, ETHER).px(8, 8, "#ffffff").line(8, 0, 8, 2, SKY).line(8, 14, 8, 16, SKY);
  },
  rfLance: (g: Pen) => {
    g.rect(1, 6, 12, 4, LIGHT).line(13, 5, 15, 8, LIGHT).line(13, 10, 15, 8, LIGHT).line(1, 8, 13, 8, "#ffffff");
  },
  rfWrath: (g: Pen) => {
    g.line(8, 0, 8, 12, LIGHT).line(5, 9, 8, 12, LIGHT).line(11, 9, 8, 12, LIGHT).rect(2, 13, 12, 2, GOLD).px(8, 14, RED);
  },
  rfHalo: (g: Pen) => {
    g.ring(8, 5, 4, GOLD);
    arrow(g, 13, 7, 8);
  },
  rfPrayer: (g: Pen) => {
    g.rect(7, 2, 2, 12, GOLD).rect(4, 5, 8, 2, GOLD).line(1, 12, 6, 12, SKY).line(10, 13, 15, 13, SKY);
  },
};
