// 새벽의 성흔 시저스 아이콘: 단죄의 쌍가위 (흰 날·붉은 십자·쇠 고리 손잡이) · 전용 아이템 20 (절단 5 · 실 5 · 단죄 5 · 달빛 5)
import type { Pen } from "./pen";

const BLADE = "#e8e4ee";
const EDGE = "#9a96a8";
const DARK = "#2a2630";
const RING = "#a08a6a";
const RED = "#d8203a";
const BLOOD = "#7a1020";
const THREAD = "#ff3a4a";
const WHITE = "#ffffff";
const MOON = "#c8d8ff";
const LAV = "#c8b8e8";

/** 벌린 가위 (축 x,y · 날 길이 n · 벌린 정도 w) */
function shears(g: Pen, x: number, y: number, n = 7, w = 3): void {
  g.line(x, y, x + n, y - w, BLADE).line(x, y, x + n, y + w, BLADE).px(x + n, y - w, EDGE).px(x + n, y + w, EDGE);
  g.ring(x - 3, y - 2, 2, RING).ring(x - 3, y + 2, 2, RING).px(x, y, DARK);
}
/** 닫힌 가위 (축 x,y · 오른쪽으로 날) */
function closed(g: Pen, x: number, y: number, n = 8): void {
  g.rect(x, y - 1, n, 2, BLADE).line(x, y + 1, x + n - 1, y + 1, EDGE).px(x + n, y, EDGE).px(x + 3, y, RED);
  g.ring(x - 3, y - 2, 2, RING).ring(x - 3, y + 2, 2, RING);
}
/** 실 (x0,y0 → x1,y1) */
function thread(g: Pen, x0: number, y0: number, x1: number, y1: number, c = THREAD): void {
  g.line(x0, y0, x1, y1, c);
}

export const SX_WEAPON_ART = {
  sxShears: (g: Pen) => {
    shears(g, 4, 6, 9, 3);
    closed(g, 5, 12, 8);
  },
};

export const SX_PASSIVE_ART = {
  sxEdge: (g: Pen) => {
    closed(g, 4, 8, 9);
    g.px(14, 6, WHITE).px(13, 5, WHITE).px(15, 7, WHITE);
  },
  sxWide: (g: Pen) => shears(g, 4, 8, 9, 6),
  sxSnap: (g: Pen) => {
    shears(g, 4, 8, 8, 2);
    g.px(13, 8, WHITE).px(14, 7, WHITE).px(14, 9, WHITE);
  },
  sxRust: (g: Pen) => {
    closed(g, 4, 7, 9);
    g.px(8, 7, "#8a5a2a").px(10, 8, "#8a5a2a").px(9, 10, RED).px(9, 12, BLOOD).px(11, 11, RED);
  },
  sxTwin: (g: Pen) => {
    closed(g, 4, 4, 9);
    closed(g, 4, 11, 9);
  },
  sxSpool: (g: Pen) => {
    g.rect(4, 3, 8, 2, RING).rect(4, 11, 8, 2, RING).rect(5, 5, 6, 6, THREAD).line(5, 7, 10, 7, BLOOD).line(5, 9, 10, 9, BLOOD).line(11, 8, 15, 12, THREAD);
  },
  sxLong: (g: Pen) => {
    thread(g, 1, 12, 5, 4);
    thread(g, 5, 4, 10, 12);
    thread(g, 10, 12, 15, 3);
  },
  sxTaut: (g: Pen) => {
    g.disc(2, 8, 1, LAV).disc(14, 8, 1, RED);
    thread(g, 3, 8, 13, 8, WHITE);
    g.line(3, 7, 13, 7, THREAD);
  },
  sxWeave: (g: Pen) => {
    thread(g, 1, 3, 15, 13);
    thread(g, 1, 13, 15, 3);
    thread(g, 1, 8, 15, 8, "#ff8a94");
  },
  sxBind: (g: Pen) => {
    g.disc(8, 8, 4, DARK);
    thread(g, 3, 5, 13, 11);
    thread(g, 3, 11, 13, 5);
    thread(g, 3, 8, 13, 8);
  },
  sxHead: (g: Pen) => {
    g.disc(8, 5, 3, "#d8c8b8").px(7, 5, RED).px(9, 5, RED);
    g.line(2, 9, 14, 9, WHITE).px(5, 10, RED).px(8, 11, BLOOD).px(11, 10, RED);
  },
  sxChain: (g: Pen) => {
    g.line(2, 3, 13, 14, WHITE).line(13, 3, 2, 14, WHITE).px(8, 8, RED).px(3, 13, RED).px(13, 4, RED);
  },
  sxGiant: (g: Pen) => {
    g.rect(3, 4, 10, 9, "#5a4a6a").rect(5, 6, 2, 2, RED).rect(9, 6, 2, 2, RED);
    shears(g, 3, 13, 9, 2);
  },
  sxHarvest: (g: Pen) => {
    closed(g, 4, 5, 9);
    g.rect(7, 10, 3, 4, RED).rect(6, 11, 5, 2, RED).px(8, 9, "#ff8a94");
  },
  sxFear: (g: Pen) => {
    g.disc(8, 8, 5, DARK).px(6, 7, WHITE).px(10, 7, WHITE).line(6, 10, 10, 10, WHITE).ring(8, 8, 7, RED);
  },
  sxMoon: (g: Pen) => {
    g.disc(6, 6, 4, WHITE).disc(8, 5, 3, DARK);
    thread(g, 6, 10, 15, 14, MOON);
  },
  sxFull: (g: Pen) => {
    g.disc(8, 8, 5, WHITE).px(6, 7, MOON).px(9, 9, MOON);
    shears(g, 3, 13, 8, 2);
  },
  sxCrescent: (g: Pen) => {
    g.disc(7, 8, 6, WHITE).disc(10, 6, 5, DARK);
    g.line(9, 12, 15, 9, MOON);
  },
  sxHalo: (g: Pen) => {
    g.ring(8, 8, 6, MOON).ring(8, 8, 4, WHITE);
    closed(g, 5, 8, 6);
  },
  sxRemain: (g: Pen) => {
    g.disc(8, 8, 4, MOON).disc(10, 7, 3, DARK).px(4, 13, LAV).px(12, 13, LAV).px(8, 14, WHITE);
  },
};
