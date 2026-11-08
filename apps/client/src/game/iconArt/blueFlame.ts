// 새벽의 성흔 블루 플레임 아이콘: 청염의 활 (푸른 불꽃 활 · 걸린 화살) · 전용 아이템 20 (활 5 · 감옥 5 · 기둥 5 · 청염·각성 5)
import type { Pen } from "./pen";

const DEEP = "#1238d8";
const BLUE = "#2a7aff";
const LIGHT = "#7ac8ff";
const PALE = "#d8f4ff";
const DARK = "#0a1030";
const WHITE = "#ffffff";

/** 작은 불꽃 (가운데 x · 아래 y): 아래 진한 파랑 → 위 옅게 */
function flame(g: Pen, x: number, y: number, h = 6): void {
  g.rect(x - 2, y - 2, 5, 2, DEEP).rect(x - 1, y - Math.ceil(h * 0.6), 3, Math.ceil(h * 0.6) - 2, BLUE);
  g.rect(x, y - h + 1, 1, Math.ceil(h * 0.5), LIGHT).px(x, y - h, PALE);
}
/** 활 ( (왼쪽 x · 위 2 ~ 아래 13) · 시위 */
function bow(g: Pen, x: number): void {
  g.line(x + 3, 2, x, 5, BLUE).line(x, 5, x, 10, BLUE).line(x, 10, x + 3, 13, BLUE).px(x + 3, 2, LIGHT).px(x + 3, 13, LIGHT);
  g.line(x + 3, 3, x + 3, 12, PALE);
}
/** 화살 (오른쪽을 향함, 꼬리 x0 · 머리 x1 · 높이 y) */
function arrow(g: Pen, x0: number, x1: number, y: number): void {
  g.line(x0, y, x1, y, LIGHT).px(x0, y - 1, BLUE).px(x0, y + 1, BLUE).px(x1, y, WHITE).px(x1 - 1, y - 1, PALE).px(x1 - 1, y + 1, PALE);
}
/** 불꽃 구슬 (감옥) */
function orb(g: Pen, x: number, y: number, r: number): void {
  g.disc(x, y, r, DEEP).disc(x, y, r - 1, BLUE).disc(x - 1, y - 1, Math.max(1, r - 3), LIGHT).px(x - 1, y - 2, WHITE);
}
/** 불꽃 기둥 (가운데 x · 아래 y · 높이 h) */
function pillar(g: Pen, x: number, y: number, h: number): void {
  g.rect(x - 2, y - h, 5, h, BLUE).rect(x - 1, y - h - 1, 3, h, LIGHT).rect(x, y - h - 2, 1, h - 2, PALE).rect(x - 4, y, 9, 1, DEEP);
}

export const BZ_WEAPON_ART = {
  bzBow: (g: Pen) => {
    bow(g, 3);
    arrow(g, 2, 14, 7);
    flame(g, 4, 15, 4);
  },
};

export const BZ_PASSIVE_ART = {
  bzDraw: (g: Pen) => {
    bow(g, 5);
    g.line(0, 5, 3, 5, LIGHT).line(0, 8, 3, 8, LIGHT).line(1, 11, 3, 11, LIGHT);
  },
  bzFletch: (g: Pen) => {
    arrow(g, 4, 14, 8);
    g.line(1, 5, 4, 8, BLUE).line(1, 11, 4, 8, BLUE).line(2, 5, 5, 8, LIGHT).line(2, 11, 5, 8, LIGHT);
  },
  bzSplit: (g: Pen) => {
    arrow(g, 1, 8, 8);
    g.line(8, 8, 13, 4, LIGHT).px(14, 3, WHITE).line(8, 8, 13, 12, LIGHT).px(14, 13, WHITE);
  },
  bzEmber: (g: Pen) => {
    arrow(g, 1, 9, 6);
    flame(g, 12, 14, 6);
    g.px(9, 11, LIGHT).px(14, 9, PALE);
  },
  bzWide: (g: Pen) => {
    g.ring(8, 8, 7, LIGHT).ring(8, 8, 5, BLUE).ring(8, 8, 3, DEEP).px(8, 8, WHITE);
  },
  bzPrison: (g: Pen) => {
    orb(g, 8, 8, 6);
  },
  bzCage: (g: Pen) => {
    orb(g, 8, 8, 5);
    g.line(2, 2, 2, 13, DARK).line(13, 2, 13, 13, DARK).line(2, 2, 13, 2, LIGHT).line(2, 13, 13, 13, LIGHT);
  },
  bzImplode: (g: Pen) => {
    orb(g, 8, 8, 4);
    g.px(1, 1, LIGHT).px(14, 1, LIGHT).px(1, 14, LIGHT).px(14, 14, LIGHT).px(3, 3, BLUE).px(12, 3, BLUE).px(3, 12, BLUE).px(12, 12, BLUE);
  },
  bzSeal: (g: Pen) => {
    orb(g, 8, 9, 5);
    g.line(4, 2, 12, 2, PALE).px(6, 1, WHITE).px(10, 1, WHITE);
  },
  bzInner: (g: Pen) => {
    g.ring(8, 8, 7, BLUE).disc(8, 8, 4, DEEP).disc(8, 8, 2, LIGHT);
  },
  bzPillar: (g: Pen) => {
    pillar(g, 8, 14, 11);
  },
  bzTwin: (g: Pen) => {
    pillar(g, 4, 14, 9);
    pillar(g, 11, 14, 11);
  },
  bzBlaze: (g: Pen) => {
    pillar(g, 8, 14, 9);
    g.rect(1, 13, 14, 2, BLUE).rect(2, 12, 12, 1, LIGHT);
  },
  bzKnock: (g: Pen) => {
    pillar(g, 5, 14, 10);
    g.line(9, 6, 14, 6, LIGHT).line(9, 9, 15, 9, PALE).line(9, 12, 14, 12, LIGHT);
  },
  bzLinger: (g: Pen) => {
    flame(g, 5, 14, 7);
    flame(g, 11, 12, 5);
    g.px(8, 3, LIGHT).px(13, 4, PALE);
  },
  bzWing: (g: Pen) => {
    g.line(7, 9, 1, 3, BLUE).line(7, 10, 1, 7, LIGHT).line(7, 11, 2, 11, BLUE).line(6, 9, 3, 5, PALE);
    g.line(8, 9, 14, 3, BLUE).line(8, 10, 14, 7, LIGHT).line(8, 11, 13, 11, BLUE).line(9, 9, 12, 5, PALE);
  },
  bzSoul: (g: Pen) => {
    flame(g, 8, 15, 12);
    g.px(6, 8, DARK).px(9, 8, DARK);
  },
  bzSense: (g: Pen) => {
    g.rect(2, 6, 12, 3, DARK).rect(2, 6, 12, 1, "#3a3a5a");
    flame(g, 8, 5, 4);
    g.px(4, 11, LIGHT).px(11, 12, LIGHT);
  },
  bzGreat: (g: Pen) => {
    arrow(g, 0, 15, 8);
    g.line(0, 6, 15, 6, BLUE).line(0, 10, 15, 10, BLUE).px(15, 8, WHITE);
  },
  bzEndless: (g: Pen) => {
    flame(g, 8, 14, 10);
    g.ring(8, 9, 6, DEEP);
  },
};
