// 실베르 쉐도잉 아이콘: 푸른 영혼 붓·먹 획 · 무기 1 (마법 붓) · 전용 아이템 20 (쉐도잉 효과 5 · 레이드 맵 잔패턴 15)
import type { Pen } from "./pen";

const INK = "#1c1a2e";
const NAVY = "#2a3a8a";
const SOUL = "#9ab8ff";
const PALE = "#e8f0ff";
const LILAC = "#c8a0ff";
const GOLD = "#e8b84a";
const WOOD = "#8a5a2a";
const PINK = "#ffb0d0";
const RED = "#ff5a3a";
const ICE = "#8ae8ff";
const GREEN = "#5ac85a";

/** 먹 획 한 줄 (굵게) */
const stroke = (g: Pen, x0: number, y0: number, x1: number, y1: number, c = SOUL) => g.line(x0, y0, x1, y1, c).line(x0 + 1, y0, x1 + 1, y1, c);
/** 고리 (가운데 cx, cy · 반지름 r) */
function ring(g: Pen, cx: number, cy: number, r: number, c: string): void {
  for (let a = 0; a < 32; a++) g.px(Math.round(cx + Math.cos((a / 32) * Math.PI * 2) * r), Math.round(cy + Math.sin((a / 32) * Math.PI * 2) * r), c);
}

export const SD_WEAPON_ART = {
  sdBrush: (g: Pen) => {
    g.line(3, 14, 10, 7, WOOD).line(4, 14, 11, 7, GOLD).px(7, 10, SOUL);
    g.rect(10, 4, 3, 3, SOUL).rect(12, 2, 2, 2, PALE).px(14, 1, PALE).px(9, 5, LILAC).px(11, 8, LILAC);
  },
};

export const SD_PASSIVE_ART = {
  sdSword: (g: Pen) => {
    stroke(g, 2, 13, 13, 2, PALE);
    g.line(5, 13, 14, 4, SOUL).line(2, 10, 11, 1, LILAC);
  },
  sdScroll: (g: Pen) => {
    g.rect(2, 3, 12, 10, GOLD).rect(3, 4, 10, 8, PALE).line(4, 10, 7, 6, NAVY).line(7, 6, 11, 10, NAVY).px(10, 5, SOUL);
  },
  sdLotus: (g: Pen) => {
    g.rect(7, 4, 2, 6, PINK).line(3, 7, 7, 11, PINK).line(13, 7, 9, 11, PINK).rect(4, 11, 8, 2, SOUL).px(8, 2, GOLD);
  },
  sdCrane: (g: Pen) => {
    g.line(2, 6, 8, 9, PALE).line(14, 6, 8, 9, PALE).rect(7, 9, 3, 2, PALE).px(10, 8, RED).rect(2, 13, 12, 1, SOUL);
  },
  sdSakura: (g: Pen) => {
    stroke(g, 1, 12, 14, 9);
    g.rect(6, 3, 3, 3, PINK).px(7, 4, GOLD).px(11, 5, PINK).px(3, 6, PINK);
  },
  sdChain: (g: Pen) => {
    ring(g, 5, 8, 3, LILAC);
    ring(g, 11, 8, 3, LILAC);
    g.line(7, 8, 9, 8, PALE);
  },
  sdFlame: (g: Pen) => {
    g.rect(6, 4, 4, 9, RED).rect(7, 2, 2, 3, GOLD).rect(7, 8, 2, 4, GOLD).rect(3, 13, 10, 1, INK);
  },
  sdFrost: (g: Pen) => {
    g.line(8, 1, 8, 14, ICE).line(4, 5, 8, 9, ICE).line(12, 5, 8, 9, ICE).line(5, 12, 8, 9, PALE).line(11, 12, 8, 9, PALE);
  },
  sdVortex: (g: Pen) => {
    ring(g, 8, 8, 6, LILAC);
    ring(g, 8, 8, 3, SOUL);
    g.px(8, 8, PALE);
  },
  sdMoon: (g: Pen) => {
    g.disc(8, 8, 5, LILAC).disc(10, 6, 4, "#241e30").px(5, 12, LILAC).px(5, 14, LILAC);
  },
  sdStar: (g: Pen) => {
    g.line(2, 12, 6, 3, SOUL).line(6, 3, 10, 12, SOUL).line(10, 12, 14, 3, SOUL).px(6, 2, GOLD).px(10, 13, GOLD).px(14, 2, GOLD);
  },
  sdClock: (g: Pen) => {
    ring(g, 8, 8, 6, GOLD);
    g.line(8, 8, 8, 4, PALE).line(8, 8, 11, 8, PALE);
  },
  sdGhost: (g: Pen) => {
    g.rect(5, 4, 6, 8, LILAC).rect(6, 3, 4, 1, LILAC).px(5, 12, LILAC).px(8, 12, LILAC).px(10, 12, LILAC).px(7, 6, INK).px(9, 6, INK);
  },
  sdThorn: (g: Pen) => {
    g.line(2, 14, 9, 7, GREEN).px(4, 11, GREEN).px(6, 10, GREEN).disc(10, 5, 3, "#a040c0").px(10, 5, PINK);
  },
  sdComet: (g: Pen) => {
    g.line(1, 14, 10, 5, SOUL).line(2, 13, 9, 6, PALE).disc(11, 4, 2, PALE).px(12, 3, ICE);
  },
  sdButterfly: (g: Pen) => {
    g.rect(3, 4, 4, 4, LILAC).rect(9, 4, 4, 4, LILAC).rect(4, 8, 3, 3, PINK).rect(9, 8, 3, 3, PINK).line(8, 3, 8, 11, INK);
  },
  sdGate: (g: Pen) => {
    g.rect(3, 4, 2, 10, GOLD).rect(11, 4, 2, 10, GOLD).rect(3, 3, 10, 2, GOLD).rect(5, 6, 6, 8, "#fff2b0");
  },
  sdWings: (g: Pen) => {
    g.line(8, 9, 2, 4, PALE).line(8, 10, 3, 7, LILAC).line(8, 9, 14, 4, PALE).line(8, 10, 13, 7, LILAC);
    stroke(g, 3, 13, 12, 13);
  },
  sdMeteor: (g: Pen) => {
    g.line(1, 1, 9, 9, PINK).line(2, 1, 10, 9, "#c040ff").disc(11, 11, 3, PINK).px(11, 11, PALE);
  },
  sdDragon: (g: Pen) => {
    stroke(g, 2, 12, 7, 8);
    stroke(g, 7, 8, 11, 10);
    g.rect(11, 6, 4, 4, SOUL).px(13, 7, GOLD).px(15, 5, PALE).px(11, 5, PALE);
  },
};
