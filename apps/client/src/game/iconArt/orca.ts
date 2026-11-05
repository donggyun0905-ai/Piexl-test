// 탈라시아 오르카 아이콘: 권갑 무기 6 (푸른 불꽃 주먹 + 권갑마다 표시) · 전용 아이템 10 (콤보 3 · 상어 3 · 해방 4)
import type { Pen } from "./pen";

const SKIN = "#f2d0a8";
const AQUA = "#5ae8ff";
const DEEP = "#1a78d8";
const FOAM = "#f2feff";
const GOLD = "#f2c14e";
const SEA = "#1ab8e8";
const INK = "#10284a";

/** 물기운 두른 주먹 (오른쪽을 봄, c 손목띠 색) */
function fist(g: Pen, c = GOLD): void {
  g.disc(9, 8, 4, AQUA).disc(9, 8, 3, SKIN).rect(4, 6, 3, 5, c);
  g.line(8, 5, 12, 5, "#d8b088").line(10, 6, 10, 10, "#d8b088").px(13, 7, FOAM).px(13, 9, FOAM);
  g.px(2, 5, AQUA).px(1, 8, SEA).px(2, 11, AQUA).px(3, 3, FOAM);
}

/** 상어 (오른쪽을 봄) */
function shark(g: Pen, y = 8, c = AQUA): void {
  g.line(2, y, 12, y, c).line(3, y + 1, 12, y + 1, DEEP).line(4, y - 1, 11, y - 1, c);
  g.line(7, y - 2, 9, y - 4, c).px(8, y - 2, c).px(13, y, c).px(14, y + 1, FOAM).px(11, y - 1, INK);
  g.line(0, y - 2, 2, y, c).line(0, y + 3, 2, y + 1, c).line(11, y + 2, 14, y + 2, FOAM);
}

export const OC_WEAPON_ART = {
  ocTide: (g: Pen) => fist(g),
  ocRiptide: (g: Pen) => {
    fist(g, AQUA);
    g.ring(8, 8, 7, SEA).px(1, 8, FOAM).px(15, 8, FOAM);
  },
  ocGeyser: (g: Pen) => {
    fist(g, "#c8d8e8");
    g.line(14, 15, 14, 1, AQUA).line(15, 15, 15, 3, FOAM).px(13, 1, FOAM);
  },
  ocMegalodon: (g: Pen) => {
    shark(g, 9, "#3a8ad8");
    g.px(12, 11, FOAM).px(10, 11, FOAM).px(8, 11, FOAM).px(13, 2, "#ff5a5a");
  },
  ocPod: (g: Pen) => {
    shark(g, 5);
    g.line(4, 12, 10, 12, AQUA).line(5, 13, 10, 13, DEEP).px(11, 12, FOAM).line(9, 15, 14, 15, AQUA);
  },
  ocMaelstrom: (g: Pen) => {
    g.ring(8, 8, 7, DEEP).ring(8, 8, 5, SEA).ring(8, 8, 3, AQUA).disc(8, 8, 1, FOAM);
    g.px(14, 3, FOAM).px(2, 13, FOAM).px(1, 4, AQUA);
  },
};

export const OC_PASSIVE_ART = {
  ocSpray: (g: Pen) => {
    fist(g);
    g.px(15, 4, FOAM).px(15, 12, FOAM).px(14, 2, AQUA).px(14, 14, AQUA);
  },
  ocUndertow: (g: Pen) => {
    g.line(1, 4, 14, 4, SEA).line(1, 8, 14, 8, AQUA).line(1, 12, 14, 12, DEEP);
    g.line(6, 2, 2, 4, FOAM).line(10, 10, 14, 8, FOAM).px(7, 13, FOAM);
  },
  ocSurf: (g: Pen) => {
    g.line(1, 13, 14, 13, SEA).line(3, 12, 12, 9, AQUA).line(12, 9, 14, 5, FOAM).rect(4, 10, 8, 2, GOLD);
  },
  ocFin: (g: Pen) => {
    g.line(2, 13, 9, 2, "#3a8ad8").line(9, 2, 13, 13, "#3a8ad8").line(5, 12, 9, 5, AQUA).line(0, 14, 15, 14, SEA);
  },
  ocFrenzy: (g: Pen) => {
    shark(g, 7, "#3a8ad8");
    g.px(6, 13, "#e83a4a").px(9, 14, "#e83a4a").px(12, 12, "#ff6a6a");
  },
  ocEcho: (g: Pen) => {
    g.disc(3, 8, 2, AQUA).ring(3, 8, 5, SEA).ring(3, 8, 8, DEEP);
    g.px(13, 3, FOAM).px(14, 8, FOAM).px(13, 13, FOAM);
  },
  ocBreath: (g: Pen) => {
    g.rect(2, 10, 12, 3, INK).line(3, 9, 12, 9, DEEP).line(8, 8, 8, 3, AQUA).line(6, 4, 4, 1, FOAM).line(10, 4, 12, 1, FOAM);
  },
  ocLiberty: (g: Pen) => {
    g.line(4, 3, 4, 11, GOLD).line(4, 3, 11, 1, GOLD).line(11, 1, 11, 9, GOLD).disc(3, 12, 2, GOLD).disc(10, 10, 2, GOLD);
    g.px(14, 4, AQUA).px(13, 13, FOAM);
  },
  ocFoam: (g: Pen) => {
    g.disc(8, 8, 6, SEA).disc(8, 8, 4, AQUA).disc(6, 6, 1, FOAM).disc(11, 9, 1, FOAM).px(8, 11, FOAM);
  },
  ocSeaWind: (g: Pen) => {
    g.line(1, 4, 11, 4, FOAM).line(11, 4, 13, 2, FOAM).line(2, 8, 14, 8, AQUA).line(14, 8, 15, 10, AQUA).line(1, 12, 10, 12, SEA);
  },
};
