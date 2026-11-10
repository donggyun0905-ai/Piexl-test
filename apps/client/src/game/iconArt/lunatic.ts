// 새벽의 성흔 루나틱 아이콘: 월광의 세검 (새하얀 레이피어 · 금빛 손잡이 · 초승달) · 전용 아이템 20 (세검 5 · 약점 5 · 달빛 베기 5 · 대시·각성 5)
import type { Pen } from "./pen";

const BLUE = "#6a7aff";
const MOON = "#cfd8ff";
const WHITE = "#ffffff";
const GOLD = "#f0d070";
const DARK = "#10142a";
const RED = "#ff5a6a";

/** 레이피어 (손잡이 x0,y0 → 칼끝 x1,y1, 대각선) */
function rapier(g: Pen, x0: number, y0: number, x1: number, y1: number): void {
  g.line(x0, y0, x1, y1, MOON).px(x1, y1, WHITE);
  g.px(x0, y0, GOLD).px(x0 - 1, y0 + 1, GOLD).px(x0 + 1, y0 - 1 + 2, GOLD).px(x0 - 1, y0 - 1, GOLD);
}
/** 초승달 (가운데 x,y · 반지름 r) */
function moon(g: Pen, x: number, y: number, r: number, c = MOON): void {
  g.disc(x, y, r, c).disc(x + Math.ceil(r / 2), y - 1, r, DARK);
}
/** 조준점 (가운데 x,y · 반지름 r) */
function aim(g: Pen, x: number, y: number, r: number, c = WHITE): void {
  g.ring(x, y, r, BLUE).px(x, y - r - 1, c).px(x, y + r + 1, c).px(x - r - 1, y, c).px(x + r + 1, y, c).px(x, y, c);
}
/** 반짝임 */
const star = (g: Pen, x: number, y: number) => g.px(x, y, WHITE).px(x - 1, y, MOON).px(x + 1, y, MOON).px(x, y - 1, MOON).px(x, y + 1, MOON);
/** 초승달 칼자국 (오른쪽이 볼록) */
function arc(g: Pen, x: number, c = MOON): void {
  g.line(x, 2, x + 3, 5, c).line(x + 3, 5, x + 3, 10, c).line(x + 3, 10, x, 13, c).line(x + 1, 3, x + 2, 5, WHITE);
}

export const LN_WEAPON_ART = {
  lnRapier: (g: Pen) => {
    rapier(g, 3, 13, 14, 2);
    moon(g, 4, 4, 3);
  },
};

export const LN_PASSIVE_ART = {
  lnSwift: (g: Pen) => {
    rapier(g, 4, 12, 14, 2);
    g.line(0, 6, 3, 6, MOON).line(0, 9, 3, 9, MOON).line(1, 12, 2, 12, MOON);
  },
  lnPierce: (g: Pen) => {
    rapier(g, 1, 14, 15, 0);
    g.px(13, 0, WHITE).px(15, 2, WHITE);
  },
  lnFlurry: (g: Pen) => {
    g.line(2, 8, 14, 8, MOON).line(2, 8, 13, 3, BLUE).line(2, 8, 13, 13, BLUE).px(14, 8, WHITE).px(13, 3, WHITE).px(13, 13, WHITE);
    g.rect(1, 7, 2, 3, GOLD);
  },
  lnWave: (g: Pen) => {
    rapier(g, 1, 14, 7, 8);
    arc(g, 10);
    g.px(9, 7, BLUE).px(8, 9, BLUE);
  },
  lnLunge: (g: Pen) => {
    rapier(g, 6, 12, 15, 3);
    g.line(0, 13, 4, 13, BLUE).line(1, 10, 4, 10, BLUE).px(5, 14, MOON);
  },
  lnEye: (g: Pen) => {
    g.disc(8, 8, 5, MOON).disc(8, 8, 3, BLUE).disc(8, 8, 1, DARK).px(7, 7, WHITE);
    g.line(2, 8, 0, 8, MOON).line(14, 8, 15, 8, MOON);
  },
  lnDeep: (g: Pen) => {
    aim(g, 9, 8, 4, RED);
    rapier(g, 1, 15, 8, 8);
  },
  lnMarkFast: (g: Pen) => {
    aim(g, 9, 8, 4);
    g.line(0, 5, 2, 5, MOON).line(0, 8, 2, 8, MOON).line(0, 11, 2, 11, MOON);
  },
  lnTwinMark: (g: Pen) => {
    aim(g, 5, 5, 3);
    aim(g, 11, 11, 3);
  },
  lnExecute: (g: Pen) => {
    moon(g, 7, 7, 5, RED);
    g.line(9, 12, 14, 15, MOON).px(15, 15, WHITE);
  },
  lnSlashBig: (g: Pen) => {
    moon(g, 8, 8, 6);
    star(g, 13, 3);
    star(g, 2, 13);
  },
  lnSlashPow: (g: Pen) => {
    arc(g, 5);
    arc(g, 9, BLUE);
    star(g, 13, 13);
  },
  lnChain: (g: Pen) => {
    moon(g, 4, 5, 3);
    moon(g, 12, 11, 3);
    g.line(6, 7, 10, 10, BLUE).px(8, 8, WHITE);
  },
  lnFullMoon: (g: Pen) => {
    g.disc(8, 8, 6, MOON).disc(8, 8, 5, WHITE).px(6, 6, MOON).px(10, 10, MOON).px(9, 6, MOON);
  },
  lnMoonRain: (g: Pen) => {
    moon(g, 4, 4, 2);
    moon(g, 11, 6, 2);
    moon(g, 6, 12, 2);
    g.line(4, 1, 4, 0, BLUE).line(11, 3, 11, 2, BLUE).line(6, 9, 6, 8, BLUE);
  },
  lnDashPow: (g: Pen) => {
    rapier(g, 5, 11, 15, 4);
    g.line(0, 9, 4, 9, BLUE).line(0, 12, 3, 12, BLUE).line(1, 6, 4, 6, BLUE);
  },
  lnAfterimage: (g: Pen) => {
    g.line(1, 13, 8, 6, BLUE).px(8, 6, MOON);
    rapier(g, 6, 13, 14, 5);
  },
  lnSense: (g: Pen) => {
    moon(g, 8, 6, 4, GOLD);
    g.rect(5, 12, 7, 2, MOON).px(8, 11, WHITE);
  },
  lnEndless: (g: Pen) => {
    moon(g, 8, 7, 5);
    g.line(2, 14, 14, 14, BLUE).px(8, 14, WHITE);
  },
  lnCrescent: (g: Pen) => {
    g.ring(8, 8, 6, MOON).ring(8, 8, 4, BLUE).px(8, 8, WHITE);
    g.rect(2, 2, 3, 3, DARK);
  },
};
