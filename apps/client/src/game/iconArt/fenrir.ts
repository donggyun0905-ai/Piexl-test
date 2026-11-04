// 비르디아 펜리르 아이콘: 선왕의 대검 무기 1 · 전용 아이템 10 (은백 털 · 푸른 보석 대검 · 금빛 광륜 · 푸른 검기)
import { type Pen } from "./pen";

const FUR = "#ece6f4";
const FUR2 = "#b8acd0";
const BLADE = "#2a4ac8";
const BLADE2 = "#7aa8ff";
const EDGE = "#e8eef8";
const GOLD = "#e8b048";
const GOLD2 = "#a8702a";
const GEM = "#3a8aff";
const WAVE = "#8ac8ff";
const K = "#2a2440";

/** 대검 (비스듬히, 칼날에 푸른 무늬) */
function blade(g: Pen, x0 = 2, y0 = 13, len = 11): void {
  for (let i = 0; i < len; i++) g.px(x0 + i, y0 - i, BLADE).px(x0 + i + 1, y0 - i, BLADE2).px(x0 + i, y0 - i - 1, EDGE);
  g.line(x0 - 1, y0 - 2, x0 + 2, y0 + 1, GOLD).px(x0 - 1, y0 + 1, GOLD2).px(x0, y0, GEM);
}

/** 늑대 얼굴 (뾰족 귀 · 이마 보석) */
function wolf(g: Pen, howl = false): void {
  g.disc(8, 9, 5, FUR).disc(8, 10, 4, FUR2).disc(8, 9, 4, FUR);
  g.line(4, 3, 5, 6, FUR).line(12, 3, 11, 6, FUR).px(4, 3, FUR2).px(12, 3, FUR2);
  g.px(6, 9, K).px(10, 9, K).rect(7, 11, 3, 2, howl ? "#a82a3a" : FUR2).px(8, 12, K);
  g.px(8, 6, GEM).px(8, 5, "#ffffff");
}

/** 초승달 검기 (가운데 cx·cy, 반지름 r) */
function crescent(g: Pen, cx: number, cy: number, r: number): void {
  for (let k = -r; k <= r; k++) {
    const y = cy + k;
    const x = cx + Math.round(Math.sqrt(Math.max(0, r * r - k * k)));
    g.px(x, y, WAVE).px(x - 1, y, Math.abs(k) < r / 2 ? "#ffffff" : BLADE2);
  }
}

/** 금빛 광륜 (보석 박힌 고리) */
function halo(g: Pen, cx: number, cy: number, r: number): void {
  g.ring(cx, cy, r, GOLD).px(cx, cy - r, GEM).px(cx - r, cy, GEM).px(cx + r, cy, GEM);
}

export const FN_WEAPON_ART = {
  fnKingBlade: (g: Pen) => {
    blade(g, 2, 13, 12);
    g.px(14, 1, "#ffffff");
  },
};

export const FN_PASSIVE_ART = {
  fnWisdom: (g: Pen) => {
    wolf(g);
    g.px(2, 4, WAVE).px(1, 6, WAVE).px(14, 4, WAVE).px(15, 6, WAVE);
  },
  fnHalo: (g: Pen) => {
    halo(g, 8, 8, 6);
    g.disc(8, 8, 2, GOLD).px(8, 7, "#ffffff");
  },
  fnFang: (g: Pen) => {
    g.line(4, 3, 6, 12, EDGE).line(5, 3, 6, 10, FUR).line(12, 3, 10, 12, EDGE).line(11, 3, 10, 10, FUR);
    g.px(6, 13, "#ff4a5a").px(10, 13, "#ff4a5a").px(8, 2, WAVE);
  },
  fnGale: (g: Pen) => {
    for (let i = 0; i < 3; i++) g.line(1, 4 + i * 4, 10 + i * 2, 4 + i * 4, i === 1 ? "#ffffff" : WAVE).px(11 + i * 2, 3 + i * 4, BLADE2);
  },
  fnHowl: (g: Pen) => {
    wolf(g, true);
    g.ring(8, 9, 7, WAVE);
  },
  fnStar: (g: Pen) => {
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      g.line(8, 8, 8 + Math.round(Math.cos(a) * 7), 8 + Math.round(Math.sin(a) * 7), k % 2 ? BLADE2 : WAVE);
    }
    g.disc(8, 8, 2, "#ffffff");
  },
  fnMoon: (g: Pen) => {
    crescent(g, 5, 8, 5);
    crescent(g, 9, 6, 4);
    g.px(13, 12, "#ffffff").px(2, 2, WAVE);
  },
  fnRift: (g: Pen) => {
    g.rect(0, 11, 16, 5, "#5a4a5a");
    g.line(1, 13, 5, 12, WAVE).line(5, 12, 9, 14, WAVE).line(9, 14, 15, 12, WAVE).px(8, 13, "#ffffff");
    crescent(g, 7, 6, 4);
  },
  fnVeteran: (g: Pen) => {
    wolf(g);
    g.line(5, 7, 7, 11, "#c84a5a").rect(13, 1, 2, 5, "#ff5a6a").px(13, 7, "#ff5a6a");
  },
  fnHunt: (g: Pen) => {
    g.line(2, 3, 6, 13, BLADE2).line(6, 3, 10, 13, WAVE).line(10, 3, 14, 13, BLADE2);
    g.px(6, 13, "#ffffff").px(10, 13, "#ffffff").px(14, 13, "#ffffff");
  },
};
