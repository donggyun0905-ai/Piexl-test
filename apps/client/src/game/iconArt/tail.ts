// 탈라시아 테일 아이콘: 바다 무기 10 (물결 위로 솟은 상어 지느러미 · 바다마다 색·표시) · 전용 아이템 10 (꼬리·물기 5 · 바다·상어 5)
import type { Pen } from "./pen";

const SEA = "#1ab8e8";
const DEEP = "#0a5aa8";
const AQUA = "#7af4ff";
const FOAM = "#f2feff";
const FIN = "#0a6ab8";
const RED = "#ff5a6a";

/** 물결 바다 (아래 y부터 채움, c 물빛) · 위 줄은 흰 거품 물결 */
function sea(g: Pen, c = SEA, y = 10): void {
  g.rect(0, y + 1, 16, 15 - y, c);
  for (let x = 0; x < 16; x++) g.px(x, y + (x % 4 < 2 ? 0 : 1), x % 4 === 0 ? FOAM : AQUA);
}

/** 상어 등지느러미 (밑동 x, 물 높이 y, 크기 h) */
function fin(g: Pen, x: number, y: number, h = 6, c = FIN): void {
  for (let k = 0; k < h; k++) g.line(x - h + k + 1, y - k, x + Math.floor(k / 2), y - k, c);
  g.px(x - h + 1, y, AQUA).px(x + Math.floor((h - 1) / 2), y - h + 1, AQUA);
}

/** 옆모습 작은 상어 (머리 x0 오른쪽, 세로 y): 등 · 흰 배 · 꼬리 · 지느러미 · 눈 */
function shark(g: Pen, x0 = 3, y = 8, c = SEA): void {
  g.rect(x0 + 1, y - 1, 8, 3, c).rect(x0 + 2, y + 1, 7, 1, FOAM).px(x0 + 9, y, c).px(x0 + 10, y + 1, c);
  g.px(x0, y, c).px(x0 - 1, y - 1, c).px(x0 - 2, y - 2, c).px(x0 - 1, y + 1, c).px(x0 - 2, y + 2, c);
  g.px(x0 + 5, y - 2, c).px(x0 + 4, y - 3, c).px(x0 + 4, y - 2, c);
  g.px(x0 + 8, y - 1, "#04203a").px(x0 + 9, y + 1, "#ffffff");
}

/** 이빨 줄 (위 y, 아래로 뾰족) */
function teeth(g: Pen, y: number, x0 = 3, x1 = 13): void {
  for (let x = x0; x <= x1; x += 2) g.px(x, y, "#ffffff").px(x, y + 1, "#ffffff").px(x + 1, y, "#ffffff");
}

export const TL_WEAPON_ART = {
  tlTide: (g: Pen) => {
    sea(g);
    fin(g, 9, 10);
  },
  tlHammer: (g: Pen) => {
    sea(g);
    fin(g, 9, 10);
    g.line(3, 2, 13, 2, FIN).px(3, 3, FIN).px(13, 3, FIN).px(8, 3, FIN).px(8, 4, AQUA);
  },
  tlMako: (g: Pen) => {
    sea(g, "#3ad0ff");
    fin(g, 11, 10, 5, "#1a8ae8");
    g.line(1, 7, 6, 7, FOAM).line(2, 5, 5, 5, AQUA);
  },
  tlGreat: (g: Pen) => {
    sea(g, DEEP);
    fin(g, 10, 10, 7, "#5a6a7a");
    g.px(10, 4, FOAM);
  },
  tlStorm: (g: Pen) => {
    sea(g, "#2a6ac8");
    fin(g, 7, 10, 5);
    g.line(13, 1, 11, 4, "#fff07a").line(11, 4, 14, 5, "#fff07a").line(14, 5, 12, 8, "#fff07a");
  },
  tlFrost: (g: Pen) => {
    sea(g, "#8ae0ff");
    fin(g, 9, 10, 6, "#4a9ad8");
    g.px(3, 3, FOAM).px(2, 4, AQUA).px(4, 4, AQUA).px(3, 5, FOAM).px(3, 4, "#ffffff");
  },
  tlOcean: (g: Pen) => {
    sea(g, SEA, 8);
    fin(g, 5, 8, 4);
    fin(g, 13, 8, 4);
  },
  tlFrenzy: (g: Pen) => {
    sea(g);
    fin(g, 4, 10, 4);
    fin(g, 9, 10, 5);
    fin(g, 14, 10, 4);
  },
  tlWhirl: (g: Pen) => {
    sea(g, DEEP, 6);
    g.ring(8, 11, 4, AQUA).ring(8, 11, 2, FOAM).px(8, 11, "#ffffff");
  },
  tlMega: (g: Pen) => {
    sea(g, "#0a3a6a", 12);
    for (let k = 0; k < 10; k++) g.line(3 + k, 12 - k, 12, 12 - k, "#2a4a6a");
    g.px(3, 12, AQUA).px(12, 3, AQUA).px(9, 7, "#ffffff");
  },
};

export const TL_PASSIVE_ART = {
  // ── 꼬리·마무리 5 ──
  tlFin: (g: Pen) => {
    fin(g, 10, 13, 10, "#5ac8e8");
    g.line(2, 13, 10, 5, FOAM);
  },
  tlBlood: (g: Pen) => {
    sea(g, DEEP, 9);
    g.disc(8, 12, 2, RED).px(5, 11, RED).px(11, 13, RED).px(8, 4, RED).px(7, 6, RED).px(9, 6, RED).px(8, 7, RED);
  },
  tlFeast: (g: Pen) => {
    g.rect(2, 3, 12, 10, "#04203a");
    teeth(g, 3);
    for (let x = 3; x <= 13; x += 2) g.px(x, 12, "#ffffff").px(x, 11, "#ffffff").px(x + 1, 12, "#ffffff");
    g.disc(8, 8, 1, RED);
  },
  tlChain: (g: Pen) => {
    shark(g, 3, 5);
    shark(g, 3, 11, "#3ad0ff");
    g.line(14, 2, 14, 14, AQUA);
  },
  tlFreedom: (g: Pen) => {
    sea(g, SEA, 11);
    g.line(4, 2, 4, 11, "#c8a060").rect(5, 2, 7, 4, AQUA).px(8, 3, FOAM).px(9, 4, FOAM);
  },
  // ── 바다·상어 5 ──
  tlDeep: (g: Pen) => {
    sea(g, DEEP, 4);
    g.ring(8, 10, 4, AQUA).px(8, 10, FOAM);
  },
  tlSchool: (g: Pen) => {
    sea(g, SEA, 12);
    fin(g, 4, 12, 3);
    fin(g, 9, 12, 4);
    fin(g, 14, 12, 3);
    g.px(4, 4, AQUA).px(9, 3, AQUA).px(13, 5, AQUA);
  },
  tlJaws: (g: Pen) => {
    g.disc(8, 8, 7, SEA).disc(8, 8, 5, "#04203a");
    teeth(g, 4, 4, 12);
    for (let x = 4; x <= 12; x += 2) g.px(x, 12, "#ffffff").px(x, 11, "#ffffff");
  },
  tlBreach: (g: Pen) => {
    sea(g, SEA, 12);
    g.rect(6, 3, 3, 8, SEA).px(5, 2, SEA).px(9, 2, SEA).px(7, 10, FOAM).px(7, 11, FOAM).px(7, 2, "#04203a");
    g.px(3, 10, FOAM).px(12, 9, FOAM).px(4, 8, AQUA).px(11, 7, AQUA);
  },
  tlRip: (g: Pen) => {
    shark(g, 3, 5);
    g.line(13, 11, 4, 11, "#3ad0ff").line(12, 12, 4, 12, FOAM).px(3, 11, "#3ad0ff").px(14, 10, "#3ad0ff").px(14, 13, "#3ad0ff");
  },
};
