// 탈라시아 토르켄 아이콘: 사슬 달린 철구공 무기 10 (공마다 바다 기술 무늬) · 전용 아이템 10 (바다·하늘·자유)
import { star, type Pen } from "./pen";

const IRON = "#4a4058";
const SHINE = "#8a7aa8";
const CHAIN = "#c8c8d8";
const SEA = "#2a8ae8";
const FOAM = "#e8faff";
const CYAN = "#5ae0ff";
const VOLT = "#fff07a";
const GOLD = "#ffc850";
const CORAL = "#ff7a8a";

/** 사슬 (왼쪽 위 → 공) + 공 (cx, cy 반지름 r) */
function ball(g: Pen, cx = 10, cy = 10, r = 4, c = IRON): void {
  for (let i = 0; i < 4; i++) g.px(1 + i * 2, 1 + i * 2, CHAIN).px(2 + i * 2, 2 + i * 2, "#8a8a9a");
  g.disc(cx, cy, r, c).px(cx - 2, cy - 2, SHINE).px(cx - 1, cy - 2, SHINE);
}

/** 물결 한 줄 */
function wave(g: Pen, y: number, c = CYAN): void {
  for (let x = 0; x < 16; x++) g.px(x, y + (x % 4 < 2 ? 0 : 1), c);
}

export const TK_WEAPON_ART = {
  tkIron: (g: Pen) => {
    ball(g, 10, 10, 5);
    g.px(12, 12, "#2a2438").px(13, 10, "#2a2438");
  },
  tkTide: (g: Pen) => {
    ball(g, 9, 8, 4);
    wave(g, 13, SEA);
    wave(g, 14, CYAN);
    g.px(3, 12, FOAM).px(12, 12, FOAM);
  },
  tkVolt: (g: Pen) => {
    ball(g, 9, 9, 4);
    g.line(14, 2, 12, 6, VOLT).line(12, 6, 14, 7, VOLT).line(14, 7, 12, 11, VOLT).px(14, 2, "#fff");
  },
  tkWhirl: (g: Pen) => {
    g.ring(9, 9, 6, SEA).ring(9, 9, 4, CYAN);
    ball(g, 9, 9, 2);
  },
  tkUrchin: (g: Pen) => {
    ball(g, 9, 9, 3, "#5a3a6a");
    for (const [x, y] of [[9, 4], [9, 14], [4, 9], [14, 9], [5, 5], [13, 13], [13, 5], [5, 13]] as const) g.px(x, y, CORAL);
  },
  tkTwin: (g: Pen) => {
    g.line(1, 8, 14, 8, CHAIN);
    g.disc(3, 8, 3, IRON).disc(12, 8, 3, IRON).px(2, 7, SHINE).px(11, 7, SHINE);
  },
  tkGeyser: (g: Pen) => {
    ball(g, 9, 5, 3);
    g.rect(7, 9, 4, 6, SEA).rect(8, 9, 2, 6, CYAN).px(6, 9, FOAM).px(11, 9, FOAM).px(8, 15, FOAM);
  },
  tkFloe: (g: Pen) => {
    ball(g, 9, 9, 4, "#5a7aa8");
    g.px(9, 3, FOAM).px(8, 4, CYAN).px(10, 4, CYAN).px(14, 9, FOAM).px(13, 8, CYAN).px(13, 10, CYAN).px(9, 9, FOAM);
  },
  tkKraken: (g: Pen) => {
    ball(g, 11, 11, 3);
    g.line(2, 14, 6, 9, "#a04ad8").line(6, 9, 4, 5, "#a04ad8").px(3, 6, "#e88aff").px(5, 10, "#e88aff").px(4, 12, "#e88aff");
  },
  tkMaelstrom: (g: Pen) => {
    g.ring(8, 8, 7, SEA).ring(8, 8, 5, CYAN).ring(8, 8, 3, FOAM);
    g.disc(8, 1, 1, IRON).disc(15, 8, 1, IRON);
  },
};

export const TK_PASSIVE_ART = {
  tkSail: (g: Pen) => {
    g.rect(7, 1, 1, 14, "#8a5a2a").line(8, 2, 13, 9, FOAM).line(8, 9, 13, 9, FOAM).rect(8, 4, 3, 5, FOAM).rect(9, 6, 3, 3, FOAM);
    wave(g, 14, SEA);
  },
  tkGull: (g: Pen) => {
    g.line(2, 7, 7, 9, FOAM).line(7, 9, 9, 8, FOAM).line(9, 8, 14, 5, FOAM).px(8, 9, "#3a3446").px(9, 9, GOLD);
  },
  tkPearl: (g: Pen) => {
    g.disc(8, 10, 5, "#3a7ab8").rect(3, 10, 11, 1, "#2a5a8a").disc(8, 8, 2, "#f4f0ff").px(7, 7, "#fff");
  },
  tkCompass: (g: Pen) => {
    g.ring(8, 8, 6, GOLD).line(8, 3, 8, 8, CORAL).line(8, 8, 8, 13, FOAM).px(8, 8, GOLD);
  },
  tkBell: (g: Pen) => {
    g.rect(5, 4, 6, 7, GOLD).rect(4, 10, 8, 2, GOLD).rect(7, 2, 2, 2, "#c8903a").px(7, 13, "#c8903a").px(6, 5, "#fff4c0");
  },
  tkBarnacle: (g: Pen) => {
    for (let i = 0; i < 5; i++) g.ring(3 + i * 2.5, 3 + i * 2.5, 2, CHAIN);
    g.px(5, 4, "#e8d8b0").px(10, 9, "#e8d8b0").px(12, 13, "#e8d8b0");
  },
  tkWhale: (g: Pen) => {
    g.disc(8, 9, 5, "#3a5aa8").rect(3, 10, 11, 3, "#3a5aa8").rect(4, 12, 9, 1, FOAM).px(5, 8, FOAM).line(13, 7, 15, 5, "#3a5aa8");
    g.px(8, 2, CYAN).px(7, 3, CYAN).px(9, 3, CYAN);
  },
  tkTrident: (g: Pen) => {
    g.rect(7, 4, 2, 11, GOLD).rect(4, 4, 8, 1, GOLD).rect(4, 1, 1, 3, GOLD).rect(11, 1, 1, 3, GOLD).rect(7, 0, 2, 4, GOLD).px(7, 0, "#fff");
  },
  tkCoral: (g: Pen) => {
    g.line(8, 15, 8, 6, CORAL).line(8, 10, 4, 5, CORAL).line(8, 9, 12, 3, CORAL).px(4, 4, "#ffb0b8").px(12, 2, "#ffb0b8").px(8, 5, "#ffb0b8");
  },
  tkLighthouse: (g: Pen) => {
    g.rect(6, 4, 4, 11, FOAM).rect(6, 7, 4, 2, CORAL).rect(6, 11, 4, 2, CORAL).rect(5, 2, 6, 2, "#3a3446").rect(7, 2, 2, 2, VOLT);
    g.line(10, 3, 15, 1, VOLT).line(5, 3, 0, 1, VOLT);
    star(g, 13, 7, CYAN);
  },
};
