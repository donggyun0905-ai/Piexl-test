// 탈라시아 훅 아이콘: 갈고리 무기 6 (C자 갈고리 + 갈고리마다 표시) · 전용 아이템 10 (갈고리 3 · 산탄총 3 · 해적 4)
import type { Pen } from "./pen";

const STEEL = "#c8d0dc";
const DARK = "#3a4252";
const AQUA = "#5ae8ff";
const FOAM = "#f2feff";
const RUST = "#b0603a";
const WOOD = "#7a4a22";
const GOLD = "#f2c14e";
const SEA = "#1ab8e8";

/** C자 갈고리 (자루 아래 왼쪽 → 위 오른쪽 날, c 날 색) */
function hook(g: Pen, c = STEEL, edge = FOAM): void {
  g.line(2, 13, 9, 6, DARK).line(3, 13, 10, 6, DARK);
  g.ring(10, 5, 4, c).px(6, 7, c).px(6, 8, c).px(7, 8, edge).px(13, 2, edge).px(14, 4, edge);
  g.px(11, 9, DARK).px(12, 9, DARK).px(4, 10, c).px(6, 9, c);
}

/** 더블배럴 산탄총 (오른쪽을 봄) */
function gun(g: Pen, y = 7): void {
  g.rect(2, y + 1, 4, 3, WOOD).rect(6, y, 8, 1, DARK).rect(6, y + 2, 8, 1, DARK).line(6, y + 1, 13, y + 1, STEEL);
  g.px(6, y - 1, GOLD).px(6, y + 3, GOLD).px(14, y, AQUA).px(14, y + 2, AQUA);
}

export const HK_WEAPON_ART = {
  hkRusty: (g: Pen) => hook(g, RUST, "#e0a070"),
  hkKraken: (g: Pen) => {
    hook(g, "#a05ad8");
    g.line(0, 15, 3, 12, "#c87aff").line(1, 11, 0, 9, "#c87aff").px(5, 15, "#c87aff");
  },
  hkHarpoon: (g: Pen) => {
    hook(g);
    g.line(13, 9, 15, 11, AQUA).line(12, 11, 15, 14, AQUA);
  },
  hkStorm: (g: Pen) => {
    gun(g, 9);
    g.line(9, 0, 7, 3, "#ffe04a").line(7, 3, 10, 3, "#ffe04a").line(10, 3, 8, 6, FOAM);
  },
  hkDragon: (g: Pen) => {
    gun(g, 9);
    g.px(14, 6, "#ff5a3a").px(15, 7, "#ffa040").px(13, 5, "#ffa040").px(15, 5, "#ff5a3a").px(14, 4, "#ffe04a");
  },
  hkUndertow: (g: Pen) => {
    hook(g, AQUA);
    g.line(0, 14, 4, 13, SEA).line(5, 13, 9, 14, SEA).line(10, 14, 15, 13, SEA);
  },
};

export const HK_PASSIVE_ART = {
  hkChain: (g: Pen) => {
    for (let i = 0; i < 5; i++) g.ring(3 + i * 2, 12 - i * 2, 1, i % 2 ? STEEL : DARK);
    g.ring(12, 3, 2, STEEL);
  },
  hkGrapnel: (g: Pen) => {
    g.line(8, 2, 8, 14, DARK).ring(8, 2, 1, STEEL);
    g.line(8, 13, 3, 9, STEEL).line(8, 13, 13, 9, STEEL).line(8, 13, 5, 7, AQUA).line(8, 13, 11, 7, AQUA);
  },
  hkSwing: (g: Pen) => {
    g.line(1, 1, 8, 9, "#c8a070").line(8, 9, 14, 3, "#c8a070").disc(8, 11, 2, AQUA);
    g.line(2, 14, 13, 14, SEA);
  },
  hkDoubleTap: (g: Pen) => {
    gun(g, 5);
    g.disc(14, 12, 1, FOAM).disc(11, 13, 1, AQUA);
  },
  hkPowder: (g: Pen) => {
    g.rect(4, 5, 8, 9, "#3a2a1a").rect(5, 3, 6, 2, "#5a3a20").px(8, 2, DARK).px(9, 1, "#ff9a3a").px(10, 0, "#ffe04a");
    g.line(5, 8, 10, 8, GOLD).px(7, 10, "#ffffff").px(9, 11, "#ffffff");
  },
  hkWreck: (g: Pen) => {
    g.line(1, 12, 14, 12, WOOD).line(2, 13, 13, 13, WOOD).line(4, 11, 7, 6, WOOD).px(8, 6, FOAM).px(6, 4, FOAM);
    g.line(0, 15, 15, 15, SEA).px(10, 10, WOOD).px(12, 9, WOOD);
  },
  hkPlunder: (g: Pen) => {
    g.rect(2, 8, 12, 6, WOOD).rect(2, 6, 12, 2, "#9a6a32").rect(7, 8, 2, 2, GOLD);
    g.disc(5, 4, 1, GOLD).disc(9, 3, 1, GOLD).disc(12, 5, 1, GOLD);
  },
  hkRum: (g: Pen) => {
    g.rect(6, 1, 3, 3, "#5a3a20").rect(5, 4, 5, 2, "#3a6a3a").rect(4, 6, 7, 9, "#2a5a2a").rect(5, 9, 5, 3, "#e8d8a0").px(7, 10, "#a02020");
  },
  hkJolly: (g: Pen) => {
    g.line(2, 1, 2, 15, WOOD).rect(3, 2, 11, 8, "#1a1a22").disc(8, 5, 2, "#f0f0f0").px(7, 5, "#1a1a22").px(9, 5, "#1a1a22");
    g.line(5, 8, 11, 9, "#f0f0f0").line(5, 9, 11, 8, "#f0f0f0");
  },
  hkFreedom: (g: Pen) => {
    g.line(5, 1, 5, 13, WOOD).rect(6, 2, 7, 7, FOAM).line(6, 5, 12, 5, AQUA).line(1, 14, 14, 14, SEA).line(2, 13, 11, 13, WOOD);
  },
};
