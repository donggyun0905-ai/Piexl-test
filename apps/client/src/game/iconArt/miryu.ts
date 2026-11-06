// 탈라시아 미류 아이콘: 대태도 무기 10 (푸른 칼집 무늬 긴 칼 + 칼날 따라 흐르는 물살, 칼마다 표시) · 전용 아이템 10 (물길 3 · 흘리기 2 · 칼날 2 · 해룡 3)
import type { Pen } from "./pen";

const AQUA = "#5ae8ff";
const SEA = "#1ab8e8";
const DEEP = "#1a5ad8";
const FOAM = "#f2feff";
const STEEL = "#dce8f4";
const HILT = "#2a4ab8";
const TASSEL = "#e83a4a";
const GOLD = "#f2c14e";
const INK = "#10284a";

/** 대태도 (왼쪽 아래 손잡이 → 오른쪽 위 칼끝, blade 칼날 색 · flow 칼날 따라 흐르는 물살 색) */
function odachi(g: Pen, blade = STEEL, flow = AQUA): void {
  g.line(2, 13, 4, 11, HILT).px(1, 14, GOLD).px(1, 15, TASSEL).px(0, 15, TASSEL);
  g.line(3, 10, 6, 13, GOLD);
  g.line(5, 10, 14, 1, blade).line(6, 10, 14, 2, "#9ab8d8");
  g.line(5, 12, 10, 9, flow).line(10, 9, 13, 7, flow).px(14, 5, FOAM).px(8, 12, FOAM);
}

/** 흐르는 물결 띠 (y 높이, 오른쪽으로 흐름) */
function stream(g: Pen, y: number, c = AQUA): void {
  g.line(1, y + 1, 4, y - 1, c).line(4, y - 1, 8, y + 1, c).line(8, y + 1, 12, y - 1, c).line(12, y - 1, 14, y, c).px(15, y, FOAM);
}

/** 해룡 머리 (오른쪽을 봄) */
function dragonHead(g: Pen, c = AQUA): void {
  g.disc(8, 8, 4, c).rect(10, 7, 5, 3, c).px(14, 10, FOAM).px(9, 6, INK);
  g.line(6, 4, 4, 1, SEA).line(8, 4, 8, 1, SEA).px(3, 1, FOAM).px(8, 0, FOAM);
  g.line(2, 9, 5, 12, DEEP).line(1, 12, 4, 14, DEEP);
}

export const MR_WEAPON_ART = {
  mrSeiran: (g: Pen) => odachi(g),
  mrMoon: (g: Pen) => {
    odachi(g, STEEL, "#c8f6ff");
    g.disc(12, 12, 3, "#fff6c8").disc(13, 11, 2, INK).px(10, 14, AQUA);
  },
  mrTorrent: (g: Pen) => {
    odachi(g, STEEL, SEA);
    g.line(9, 14, 15, 11, AQUA).line(11, 15, 15, 13, FOAM).px(15, 9, FOAM);
  },
  mrVortex: (g: Pen) => {
    g.ring(10, 10, 5, SEA).ring(10, 10, 3, AQUA).px(10, 10, FOAM);
    odachi(g);
  },
  mrMirror: (g: Pen) => {
    odachi(g, "#f8fcff", "#e8f8ff");
    g.disc(12, 12, 2, FOAM).px(14, 14, AQUA).px(10, 14, AQUA).px(14, 10, AQUA);
  },
  mrWillow: (g: Pen) => {
    odachi(g);
    g.line(14, 1, 15, 5, AQUA).line(15, 5, 13, 9, AQUA).line(13, 9, 15, 13, SEA).px(15, 14, FOAM);
  },
  mrCrest: (g: Pen) => {
    odachi(g);
    g.line(8, 15, 11, 12, FOAM).line(11, 12, 14, 13, AQUA).line(14, 13, 15, 15, SEA);
  },
  mrFrost: (g: Pen) => {
    odachi(g, "#e8fbff", "#bff4ff");
    g.line(12, 10, 12, 14, FOAM).line(10, 12, 14, 12, FOAM).px(11, 11, AQUA).px(13, 13, AQUA);
  },
  mrAbyss: (g: Pen) => {
    odachi(g, "#8aa8d8", DEEP);
    g.line(6, 9, 13, 2, INK).disc(12, 12, 2, DEEP).px(12, 12, "#5a3aff");
  },
  mrFormless: (g: Pen) => {
    odachi(g, STEEL, "#8af0ff");
    g.px(9, 14, AQUA).px(11, 13, AQUA).px(13, 14, SEA).px(15, 12, AQUA).px(14, 10, FOAM);
  },
};

export const MR_PASSIVE_ART = {
  mrRipple: (g: Pen) => {
    g.ring(8, 8, 2, FOAM).ring(8, 8, 4, AQUA).ring(8, 8, 6, SEA).ring(8, 8, 7, DEEP);
  },
  mrSurf: (g: Pen) => {
    stream(g, 11, SEA);
    stream(g, 13, AQUA);
    g.line(5, 8, 11, 4, FOAM).line(6, 9, 12, 5, AQUA).px(13, 4, FOAM);
  },
  mrCourse: (g: Pen) => {
    g.px(2, 12, AQUA).px(4, 10, AQUA).px(7, 9, SEA).px(9, 7, AQUA).px(12, 6, SEA);
    stream(g, 13);
    g.line(11, 2, 14, 2, FOAM).line(12, 4, 15, 4, FOAM);
  },
  mrParry: (g: Pen) => {
    odachi(g);
    g.line(14, 9, 10, 13, FOAM).px(15, 8, "#ff9a5a").px(9, 14, AQUA);
  },
  mrReturn: (g: Pen) => {
    g.disc(4, 11, 2, AQUA).px(4, 10, FOAM).line(6, 10, 12, 4, SEA).line(12, 4, 9, 4, FOAM).line(12, 4, 12, 7, FOAM);
    g.disc(11, 12, 1, AQUA).disc(14, 10, 1, AQUA);
  },
  mrHorn: (g: Pen) => {
    g.line(4, 14, 7, 6, SEA).line(7, 6, 5, 2, AQUA).line(6, 9, 10, 6, SEA).line(10, 6, 12, 2, AQUA).line(9, 12, 13, 10, SEA).line(13, 10, 15, 7, AQUA);
    g.px(5, 1, FOAM).px(12, 1, FOAM).px(15, 6, FOAM);
  },
  mrCascade: (g: Pen) => {
    g.line(2, 2, 13, 2, SEA).line(4, 3, 4, 13, AQUA).line(7, 3, 7, 14, FOAM).line(10, 3, 10, 13, AQUA).line(13, 3, 13, 12, SEA);
    g.line(1, 14, 15, 14, DEEP).px(2, 13, FOAM).px(14, 13, FOAM);
  },
  mrScale: (g: Pen) => {
    g.disc(5, 5, 3, SEA).disc(11, 5, 3, AQUA).disc(8, 10, 3, SEA).disc(5, 5, 1, FOAM).disc(11, 5, 1, FOAM).disc(8, 10, 1, FOAM);
    g.line(4, 13, 12, 13, DEEP);
  },
  mrBreath: (g: Pen) => {
    dragonHead(g, SEA);
    g.px(15, 9, FOAM).px(15, 11, AQUA);
  },
  mrSky: (g: Pen) => {
    dragonHead(g);
    g.line(0, 15, 5, 13, AQUA).line(5, 13, 9, 15, SEA).line(9, 15, 15, 13, AQUA);
  },
};
