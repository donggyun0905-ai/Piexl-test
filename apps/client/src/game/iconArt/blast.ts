// 새벽의 성흔 블래스트 아이콘: 폭멸의 산탄총 (검은 총열·나무 개머리·총구 불꽃) · 전용 아이템 20 (화력 5 · 폭멸 5 · 성흔 5 · 사냥꾼 5)
import type { Pen } from "./pen";

const STEEL = "#5a5f6e";
const DARK = "#2a2c34";
const WOOD = "#a0642a";
const BRASS = "#e8b04a";
const FIRE = "#ffb84a";
const LIGHT = "#fff2c0";
const WHITE = "#ffffff";
const MOON = "#c8d8ff";
const RED = "#c82a3a";
const BLOOD = "#7a1020";
const SILVER = "#d8dce8";

/** 산탄총 (총구 x,y · 왼쪽으로 몸통) */
function gun(g: Pen, x: number, y: number): void {
  g.rect(x - 9, y, 9, 2, STEEL).line(x - 9, y + 2, x - 3, y + 2, DARK).rect(x - 13, y + 1, 4, 3, WOOD).px(x - 6, y + 3, WOOD).px(x, y, DARK);
}
/** 총구 불꽃 (x,y) */
function flash(g: Pen, x: number, y: number, c = FIRE): void {
  g.px(x, y, LIGHT).px(x + 1, y - 1, c).px(x + 1, y + 1, c).px(x + 2, y, c).px(x + 3, y - 2, c).px(x + 3, y + 2, c);
}
/** 탄피 (x,y) */
function shell(g: Pen, x: number, y: number, c = RED): void {
  g.rect(x, y, 2, 3, c).rect(x, y + 3, 2, 1, BRASS);
}
/** 초승달 (가운데 x,y) */
function moon(g: Pen, x: number, y: number, r = 4): void {
  g.disc(x, y, r, WHITE).disc(x + 2, y - 1, r - 1, DARK).px(x - r + 1, y, MOON);
}
/** 터짐 (x,y) */
function gore(g: Pen, x: number, y: number): void {
  g.disc(x, y, 2, RED).px(x - 3, y - 2, BLOOD).px(x + 3, y - 1, BLOOD).px(x - 2, y + 3, RED).px(x + 3, y + 3, SILVER).px(x - 4, y + 1, SILVER);
}

export const BL_WEAPON_ART = {
  blShotgun: (g: Pen) => {
    gun(g, 12, 7);
    flash(g, 12, 7);
  },
};

export const BL_PASSIVE_ART = {
  blBuckshot: (g: Pen) => {
    for (const [x, y] of [[4, 5], [8, 4], [12, 6], [6, 9], [10, 10], [5, 13], [11, 13]]) g.disc(x!, y!, 1, STEEL).px(x!, y!, SILVER);
  },
  blSlug: (g: Pen) => {
    shell(g, 7, 4, BRASS);
    g.rect(7, 2, 2, 2, STEEL);
  },
  blChoke: (g: Pen) => {
    gun(g, 14, 7);
    g.px(14, 6, BRASS).px(14, 9, BRASS);
  },
  blDragon: (g: Pen) => {
    shell(g, 3, 6);
    flash(g, 7, 8, "#ff6a2a");
    g.line(9, 8, 14, 5, FIRE).line(9, 9, 14, 12, FIRE);
  },
  blShred: (g: Pen) => {
    g.line(3, 4, 12, 13, SILVER).line(6, 3, 14, 11, SILVER);
    g.px(5, 9, RED).px(9, 13, BLOOD);
  },
  blGore: (g: Pen) => {
    gore(g, 8, 8);
    g.ring(8, 8, 5, FIRE);
  },
  blChain: (g: Pen) => {
    gore(g, 5, 6);
    gore(g, 11, 11);
  },
  blRecoil: (g: Pen) => {
    gun(g, 13, 6);
    g.line(2, 11, 6, 11, WHITE).line(2, 13, 7, 13, WHITE).px(3, 10, WHITE);
  },
  blSpread: (g: Pen) => {
    g.line(2, 8, 14, 2, FIRE).line(2, 8, 14, 8, FIRE).line(2, 8, 14, 14, FIRE).px(2, 8, LIGHT);
  },
  blPump: (g: Pen) => {
    gun(g, 14, 5);
    g.rect(6, 9, 4, 2, WOOD).line(4, 12, 11, 12, WHITE).px(4, 11, WHITE).px(11, 13, WHITE);
  },
  blMoonlight: (g: Pen) => {
    shell(g, 3, 8, WHITE);
    moon(g, 11, 6);
  },
  blFull: (g: Pen) => {
    g.disc(8, 8, 6, WHITE).disc(8, 8, 4, MOON).px(6, 6, WHITE);
  },
  blHunter: (g: Pen) => {
    g.ring(8, 8, 6, RED).line(8, 1, 8, 15, RED).line(1, 8, 15, 8, RED).px(8, 8, WHITE);
  },
  blHalo: (g: Pen) => {
    g.ring(8, 9, 6, MOON).ring(8, 9, 4, WHITE);
    moon(g, 8, 4, 3);
  },
  blLunar: (g: Pen) => {
    for (const [x, y] of [[4, 6], [9, 4], [13, 8], [7, 11], [11, 13]]) g.px(x!, y!, WHITE).px(x! - 1, y!, MOON);
    moon(g, 4, 12, 3);
  },
  blBlood: (g: Pen) => {
    g.disc(8, 10, 4, RED).line(8, 3, 8, 6, RED).px(7, 6, RED).px(9, 6, RED).px(7, 9, WHITE);
  },
  blSilver: (g: Pen) => {
    shell(g, 7, 5, SILVER);
    g.rect(7, 3, 2, 2, WHITE).px(11, 4, WHITE).px(4, 10, MOON);
  },
  blFlare: (g: Pen) => {
    g.disc(8, 8, 3, WHITE).line(8, 1, 8, 15, LIGHT).line(1, 8, 15, 8, LIGHT).px(3, 3, LIGHT).px(13, 13, LIGHT).px(3, 13, LIGHT).px(13, 3, LIGHT);
  },
  blRemain: (g: Pen) => {
    moon(g, 8, 7, 5);
    g.line(4, 14, 12, 14, MOON).px(8, 13, WHITE);
  },
  blNight: (g: Pen) => {
    g.rect(1, 1, 14, 14, "#1a1c34");
    moon(g, 10, 6, 4);
    g.px(3, 4, WHITE).px(5, 11, WHITE).px(12, 13, MOON);
  },
};
