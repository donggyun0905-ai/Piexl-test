// 새벽의 성흔 네일러 아이콘: 심판관의 망치와 못 (쇠 망치 머리·검은 자루·큰 못) · 전용 아이템 20 (못 5 · 망치 5 · 심판 5 · 사냥꾼 5)
import type { Pen } from "./pen";

const IRON = "#8a909e";
const STEEL = "#c8ccd8";
const DARK = "#2a2c34";
const WOOD = "#5a3a22";
const RED = "#e0303c";
const BLOOD = "#7a1020";
const WHITE = "#ffffff";
const MOON = "#c8d8ff";
const BAND = "#e8e0cc";
const CURSE = "#a01a8a";

/** 못 (머리 x,y · 아래로 길이 n) */
function nail(g: Pen, x: number, y: number, n = 8, c = STEEL): void {
  g.rect(x - 1, y, 3, 1, c).line(x, y + 1, x, y + n - 1, IRON).px(x, y + n, DARK);
}
/** 옆으로 누운 못 (머리 x,y · 오른쪽으로 길이 n) */
function flyNail(g: Pen, x: number, y: number, n = 7, c = STEEL): void {
  g.rect(x, y - 1, 1, 3, c).line(x + 1, y, x + n - 1, y, IRON).px(x + n, y, DARK);
}
/** 망치 (머리 가운데 x,y · 자루는 오른쪽 아래로) */
function hammer(g: Pen, x: number, y: number, c = IRON): void {
  g.line(x + 1, y + 2, x + 6, y + 8, WOOD).rect(x - 3, y - 1, 7, 3, c).px(x - 3, y - 1, STEEL).px(x + 3, y + 1, DARK);
}
/** 초승달 (가운데 x,y) */
function moon(g: Pen, x: number, y: number, r = 4): void {
  g.disc(x, y, r, WHITE).disc(x + 2, y - 1, r - 1, DARK).px(x - r + 1, y, MOON);
}

export const NL_WEAPON_ART = {
  nlHammer: (g: Pen) => {
    hammer(g, 6, 5);
    nail(g, 12, 3, 10);
  },
};

export const NL_PASSIVE_ART = {
  nlIron: (g: Pen) => {
    nail(g, 8, 2, 12, IRON);
    g.rect(6, 2, 5, 2, STEEL);
  },
  nlBarb: (g: Pen) => {
    nail(g, 8, 2, 11);
    g.px(7, 6, STEEL).px(9, 8, STEEL).px(7, 10, STEEL).px(9, 13, RED).px(8, 14, BLOOD);
  },
  nlQuick: (g: Pen) => {
    flyNail(g, 6, 8, 8);
    g.line(1, 6, 4, 6, MOON).line(0, 8, 4, 8, MOON).line(1, 10, 4, 10, MOON);
  },
  nlSpread: (g: Pen) => {
    flyNail(g, 3, 4, 7);
    flyNail(g, 5, 8, 8);
    flyNail(g, 3, 12, 7);
  },
  nlDeep: (g: Pen) => {
    g.rect(1, 11, 14, 4, WOOD).line(1, 11, 14, 11, DARK);
    nail(g, 5, 7, 6);
    nail(g, 10, 6, 7);
  },
  nlSledge: (g: Pen) => {
    g.line(9, 7, 14, 14, WOOD).rect(2, 2, 10, 6, IRON).rect(2, 2, 10, 1, STEEL).rect(2, 7, 10, 1, DARK);
  },
  nlWide: (g: Pen) => {
    hammer(g, 7, 6);
    g.line(1, 13, 4, 10, STEEL).line(14, 13, 11, 10, STEEL).line(4, 14, 11, 14, STEEL);
  },
  nlDrive: (g: Pen) => {
    hammer(g, 5, 3);
    nail(g, 10, 7, 7);
    g.rect(4, 14, 10, 2, WOOD);
  },
  nlStun: (g: Pen) => {
    hammer(g, 6, 7);
    g.px(4, 2, "#ffe060").px(8, 1, "#ffe060").px(12, 3, "#ffe060").px(6, 1, WHITE).px(10, 2, WHITE);
  },
  nlEcho: (g: Pen) => {
    hammer(g, 7, 7);
    g.ring(7, 7, 6, MOON).ring(7, 7, 4, STEEL);
  },
  nlChain: (g: Pen) => {
    nail(g, 3, 3, 9);
    g.line(4, 6, 13, 11, RED).line(4, 7, 13, 12, BLOOD);
    nail(g, 13, 7, 7);
  },
  nlBind: (g: Pen) => {
    g.disc(8, 8, 4, BLOOD);
    for (const [x, y] of [[3, 3], [13, 3], [3, 11], [13, 11], [8, 1]]) nail(g, x!, y!, 4);
  },
  nlBleed: (g: Pen) => {
    g.ring(8, 9, 6, RED).ring(8, 9, 5, BLOOD).px(8, 3, RED).px(13, 13, RED).px(3, 13, RED);
    hammer(g, 7, 7);
  },
  nlCurse: (g: Pen) => {
    nail(g, 8, 1, 9);
    g.disc(8, 12, 3, CURSE).px(8, 12, WHITE).px(5, 9, CURSE).px(11, 9, CURSE);
  },
  nlFuse: (g: Pen) => {
    nail(g, 3, 5, 8);
    g.line(4, 12, 7, 10, RED).line(7, 10, 10, 12, RED).line(10, 12, 13, 9, RED).px(13, 8, "#ffb84a").px(14, 7, "#fff2c0");
  },
  nlRain: (g: Pen) => {
    for (const [x, y] of [[2, 1], [7, 3], [12, 0], [4, 8], [10, 8]]) nail(g, x!, y!, 5);
  },
  nlFocus: (g: Pen) => {
    g.ring(9, 8, 5, RED).px(9, 8, RED).line(9, 1, 9, 3, RED).line(9, 13, 9, 15, RED);
    flyNail(g, 0, 8, 6);
  },
  nlMoon: (g: Pen) => {
    moon(g, 6, 6, 5);
    nail(g, 12, 6, 8);
  },
  nlBlind: (g: Pen) => {
    g.disc(8, 8, 6, "#d8b090").rect(2, 6, 12, 3, BAND).px(3, 7, "#c8bca0").px(12, 7, "#c8bca0").line(13, 8, 15, 12, BAND);
  },
  nlRelent: (g: Pen) => {
    nail(g, 6, 2, 10);
    g.line(9, 4, 14, 4, RED).line(9, 7, 13, 7, RED).line(9, 10, 12, 10, RED).px(6, 13, BLOOD);
  },
};
