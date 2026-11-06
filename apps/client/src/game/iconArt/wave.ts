// 탈라시아 웨이브 아이콘 (16×16): 상상의 도구 6 · 물의 기술 30 (모두 물빛: 하늘색·흰 거품·짙은 바다 + 기술마다 한 가지 포인트 색)
import type { Pen } from "./pen";

const AQUA = "#5ae8ff";
const SEA = "#1ab8e8";
const DEEP = "#1a6ae0";
const FOAM = "#f2feff";
const PALE = "#b8f4ff";
const GOLD = "#f2c14e";
const INK = "#10284a";
const PINK = "#ff9ad0";

/** 물방울 하나 (cx, 아래 끝 y) */
function drop(g: Pen, x: number, y: number, c = AQUA): void {
  g.px(x, y - 3, c).line(x - 1, y - 2, x + 1, y - 2, c).rect(x - 1, y - 1, 3, 2, c).px(x - 1, y - 2, FOAM);
}
/** 물결 한 줄 */
function ripple(g: Pen, y: number, c = SEA): void {
  for (let x = 0; x < 16; x += 4) g.line(x, y, x + 1, y - 1, c).line(x + 2, y - 1, x + 3, y, c);
}

export const WV_WEAPON_ART = {
  wvBoard: (g: Pen) => {
    g.line(3, 14, 12, 1, GOLD).line(4, 14, 13, 2, GOLD).line(5, 14, 13, 3, "#e8a040").line(5, 9, 9, 3, DEEP).px(8, 8, DEEP);
    g.line(0, 15, 15, 15, AQUA).px(1, 14, FOAM).px(14, 14, FOAM);
  },
  wvShell: (g: Pen) => {
    g.disc(7, 9, 5, "#f2d8c8").ring(7, 9, 5, "#d8a088").line(3, 7, 11, 11, "#d8a088").line(12, 5, 14, 3, "#f2d8c8").px(15, 2, AQUA);
    g.px(13, 1, FOAM).px(1, 3, AQUA).px(2, 1, FOAM);
  },
  wvPrism: (g: Pen) => {
    g.line(8, 1, 13, 10, PALE).line(8, 1, 3, 10, PALE).line(3, 10, 13, 10, PALE).line(8, 3, 8, 9, FOAM);
    g.line(13, 11, 15, 13, PINK).line(12, 12, 13, 15, GOLD).line(10, 12, 9, 15, AQUA).line(4, 11, 1, 14, SEA);
  },
  wvCrown: (g: Pen) => {
    g.rect(2, 9, 12, 4, GOLD).px(2, 6, GOLD).px(2, 7, GOLD).px(8, 4, GOLD).line(8, 5, 8, 8, GOLD).px(13, 6, GOLD).px(13, 7, GOLD);
    g.disc(8, 11, 1, AQUA).px(4, 11, AQUA).px(11, 11, AQUA).line(0, 14, 15, 14, SEA).px(8, 3, FOAM);
  },
  wvRibbon: (g: Pen) => {
    g.line(1, 12, 4, 6, AQUA).line(4, 6, 8, 11, AQUA).line(8, 11, 12, 4, AQUA).line(12, 4, 15, 8, AQUA);
    g.line(1, 13, 4, 8, SEA).line(5, 8, 8, 13, SEA).px(12, 3, FOAM).px(4, 5, FOAM);
  },
  wvDream: (g: Pen) => {
    g.disc(6, 9, 5, "#f2e8d8").disc(4, 8, 1, PINK).disc(7, 6, 1, AQUA).disc(9, 9, 1, GOLD).disc(5, 11, 1, DEEP);
    g.line(9, 13, 14, 2, "#c89a6a").px(14, 1, AQUA).px(15, 0, FOAM);
  },
};

export const WV_PASSIVE_ART = {
  wvButterfly: (g: Pen) => {
    g.disc(5, 6, 3, AQUA).disc(11, 6, 3, AQUA).disc(5, 11, 2, SEA).disc(11, 11, 2, SEA).line(8, 4, 8, 13, INK);
    g.px(4, 5, FOAM).px(10, 5, FOAM).px(7, 2, PALE).px(9, 2, PALE);
  },
  wvSpear: (g: Pen) => {
    g.line(2, 14, 12, 4, SEA).line(3, 14, 13, 4, AQUA).line(12, 2, 15, 1, FOAM).line(11, 3, 14, 0, PALE).px(13, 3, FOAM);
    g.px(1, 15, FOAM).px(5, 13, PALE);
  },
  wvArmor: (g: Pen) => {
    g.line(3, 2, 13, 2, AQUA).line(3, 2, 3, 9, AQUA).line(13, 2, 13, 9, AQUA).line(3, 9, 8, 14, AQUA).line(13, 9, 8, 14, AQUA);
    g.rect(5, 4, 7, 5, SEA).line(6, 10, 10, 10, SEA).px(5, 4, FOAM).px(6, 5, FOAM);
  },
  wvGoddess: (g: Pen) => {
    g.line(8, 1, 12, 6, PALE).line(8, 1, 4, 6, FOAM).line(4, 6, 8, 13, SEA).line(12, 6, 8, 13, DEEP).line(4, 6, 12, 6, AQUA);
    g.rect(6, 6, 4, 4, AQUA).px(7, 4, FOAM).px(7, 3, FOAM).line(6, 7, 8, 11, PALE);
    g.ring(8, 14, 2, SEA).px(1, 3, FOAM).px(14, 9, AQUA).px(2, 10, PALE);
  },
  wvWhale: (g: Pen) => {
    g.disc(7, 8, 4, DEEP).rect(3, 8, 9, 3, DEEP).line(11, 9, 14, 6, DEEP).line(11, 9, 14, 12, DEEP).line(3, 11, 11, 11, PALE).px(4, 7, FOAM);
    g.line(6, 3, 6, 1, AQUA).px(5, 0, FOAM).px(7, 0, FOAM);
  },
  wvBubble: (g: Pen) => {
    g.ring(8, 8, 6, PALE).ring(8, 8, 5, AQUA).px(5, 5, FOAM).px(6, 4, FOAM).disc(8, 9, 2, "#e85a5a").px(7, 8, INK).px(9, 8, INK);
    g.ring(14, 2, 1, PALE);
  },
  wvClock: (g: Pen) => {
    g.line(4, 1, 12, 1, GOLD).line(4, 15, 12, 15, GOLD).line(5, 2, 11, 2, PALE).line(6, 3, 10, 7, PALE).line(10, 3, 6, 7, PALE);
    g.line(8, 8, 8, 9, AQUA).rect(5, 11, 7, 3, AQUA).px(7, 10, AQUA).px(9, 10, AQUA).px(6, 11, FOAM);
  },
  wvJelly: (g: Pen) => {
    g.disc(4, 4, 2, PINK).disc(12, 5, 2, PINK).disc(8, 11, 2, PINK).line(4, 4, 12, 5, GOLD).line(12, 5, 8, 11, GOLD).line(8, 11, 4, 4, GOLD);
    g.px(4, 7, PINK).px(12, 8, PINK).px(8, 14, PINK).px(3, 3, FOAM);
  },
  wvMirror: (g: Pen) => {
    g.disc(4, 5, 2, "#f2d0a8").line(4, 7, 4, 12, "#e8eef4").disc(12, 5, 2, AQUA).line(12, 7, 12, 12, AQUA).line(8, 1, 8, 15, PALE);
    g.px(11, 4, FOAM).px(3, 3, "#d8d0c8").px(13, 3, PALE);
  },
  wvCloud: (g: Pen) => {
    g.disc(5, 5, 3, "#c8d8e8").disc(10, 4, 3, "#c8d8e8").rect(3, 5, 10, 3, "#c8d8e8").px(9, 3, FOAM);
    drop(g, 4, 12);
    drop(g, 9, 15);
    drop(g, 13, 11);
  },
  wvSpout: (g: Pen) => {
    g.line(3, 2, 13, 2, AQUA).line(4, 4, 12, 4, SEA).line(5, 6, 11, 6, AQUA).line(6, 8, 10, 8, SEA).line(7, 10, 9, 10, AQUA).line(8, 12, 8, 14, AQUA);
    g.px(2, 3, FOAM).px(14, 1, FOAM).px(11, 7, FOAM);
  },
  wvLotus: (g: Pen) => {
    g.line(8, 2, 5, 8, AQUA).line(8, 2, 11, 8, AQUA).line(2, 6, 7, 11, SEA).line(14, 6, 9, 11, SEA).rect(6, 8, 5, 4, PINK).px(8, 9, GOLD);
    ripple(g, 14);
  },
  wvSurf: (g: Pen) => {
    g.line(0, 15, 6, 6, DEEP).line(6, 6, 10, 2, AQUA).line(10, 2, 14, 3, FOAM).line(13, 3, 12, 6, FOAM).line(1, 15, 7, 9, SEA);
    g.line(6, 12, 13, 9, GOLD).line(7, 13, 14, 10, "#e8a040");
  },
  wvSpiral: (g: Pen) => {
    g.px(8, 8, FOAM);
    for (let i = 0; i < 12; i++) {
      const a = i * 0.7;
      const r = 1.5 + i * 0.55;
      g.px(Math.round(8 + Math.cos(a) * r), Math.round(8 + Math.sin(a) * r), i % 3 ? AQUA : FOAM);
      g.px(Math.round(8 - Math.cos(a) * r), Math.round(8 - Math.sin(a) * r), i % 3 ? SEA : PALE);
    }
  },
  wvFlood: (g: Pen) => {
    g.rect(0, 9, 16, 7, DEEP).rect(0, 7, 16, 2, SEA);
    ripple(g, 7, AQUA);
    g.px(3, 11, FOAM).px(10, 12, FOAM).px(13, 10, PALE).line(6, 1, 6, 5, PALE).line(5, 4, 7, 4, PALE);
  },
  wvSchool: (g: Pen) => {
    for (const [x, y] of [[3, 3], [11, 4], [6, 8], [12, 11], [3, 12]] as const) g.line(x, y, x + 2, y, AQUA).px(x + 3, y, FOAM).px(x - 1, y - 1, SEA).px(x - 1, y + 1, SEA);
    g.ring(8, 8, 7, PALE);
  },
  wvRope: (g: Pen) => {
    g.disc(2, 3, 1, "#e85a5a").disc(13, 2, 1, "#e85a5a").disc(2, 13, 1, "#e85a5a").disc(14, 13, 1, "#e85a5a");
    g.line(3, 4, 7, 7, AQUA).line(12, 3, 9, 7, AQUA).line(3, 12, 7, 9, AQUA).line(13, 12, 9, 9, AQUA).disc(8, 8, 2, FOAM);
  },
  wvBalloon: (g: Pen) => {
    g.disc(9, 6, 5, AQUA).disc(9, 6, 3, SEA).px(7, 3, FOAM).px(8, 3, FOAM).line(9, 11, 8, 13, PALE).line(8, 13, 9, 15, PALE);
    g.px(2, 13, AQUA).px(1, 15, FOAM).px(4, 15, AQUA);
  },
  wvPearl: (g: Pen) => {
    g.line(1, 2, 6, 13, PALE).line(6, 13, 12, 3, PALE).line(12, 3, 15, 9, PALE).disc(12, 3, 2, "#f6f0ff").px(11, 2, FOAM);
    g.px(6, 14, AQUA).px(1, 1, AQUA);
  },
  wvHands: (g: Pen) => {
    g.rect(1, 6, 4, 8, AQUA).line(1, 4, 1, 6, AQUA).line(3, 3, 3, 6, AQUA).line(5, 5, 6, 8, AQUA);
    g.rect(11, 6, 4, 8, AQUA).line(14, 4, 14, 6, AQUA).line(12, 3, 12, 6, AQUA).line(10, 5, 9, 8, AQUA);
    g.px(8, 8, FOAM).px(7, 6, FOAM).px(8, 10, PALE).line(0, 15, 15, 15, SEA);
  },
  wvFountain: (g: Pen) => {
    g.rect(3, 12, 10, 3, "#c8d0d8").line(8, 11, 8, 4, AQUA).line(8, 4, 3, 9, AQUA).line(8, 4, 13, 9, AQUA).px(8, 3, FOAM);
    drop(g, 2, 12, SEA);
    drop(g, 14, 12, SEA);
  },
  wvSkip: (g: Pen) => {
    g.disc(13, 4, 1, "#c8d0d8").line(1, 12, 3, 9, PALE).line(3, 9, 5, 12, PALE).line(5, 12, 8, 8, PALE).line(8, 8, 11, 11, PALE).line(11, 11, 13, 5, PALE);
    g.ring(3, 13, 2, AQUA).ring(8, 12, 2, AQUA).line(0, 15, 15, 15, SEA);
  },
  wvSiren: (g: Pen) => {
    g.line(5, 2, 5, 11, AQUA).line(5, 2, 12, 1, AQUA).line(12, 1, 12, 9, AQUA).disc(4, 12, 2, AQUA).disc(11, 10, 2, AQUA);
    g.px(3, 11, FOAM).px(10, 9, FOAM).px(14, 13, PINK).px(1, 5, PALE);
  },
  wvMist: (g: Pen) => {
    g.line(1, 4, 9, 4, PALE).line(4, 7, 15, 7, "#c8e8f0").line(0, 10, 11, 10, PALE).line(5, 13, 14, 13, "#c8e8f0");
    g.px(12, 3, FOAM).px(2, 13, FOAM).px(13, 10, AQUA);
  },
  wvOctopus: (g: Pen) => {
    g.disc(8, 5, 4, "#c86ae8").px(6, 5, FOAM).px(10, 5, FOAM).px(6, 4, INK).px(10, 4, INK);
    g.line(4, 8, 1, 14, AQUA).line(6, 9, 5, 15, AQUA).line(10, 9, 11, 15, AQUA).line(12, 8, 15, 14, AQUA).px(0, 13, FOAM).px(15, 13, FOAM);
  },
  wvWings: (g: Pen) => {
    g.line(7, 6, 1, 2, AQUA).line(7, 7, 0, 6, SEA).line(7, 8, 2, 11, AQUA).line(9, 6, 15, 2, AQUA).line(9, 7, 16, 6, SEA).line(9, 8, 14, 11, AQUA);
    g.rect(7, 5, 2, 6, FOAM).px(1, 1, FOAM).px(15, 1, FOAM);
  },
  wvEye: (g: Pen) => {
    g.line(1, 8, 5, 4, DEEP).line(5, 4, 11, 4, DEEP).line(11, 4, 15, 8, DEEP).line(1, 8, 5, 12, DEEP).line(5, 12, 11, 12, DEEP).line(11, 12, 15, 8, DEEP);
    g.disc(8, 8, 3, AQUA).disc(8, 8, 1, INK).px(7, 6, FOAM);
  },
  wvEbb: (g: Pen) => {
    g.ring(8, 8, 7, AQUA).ring(8, 8, 4, SEA).disc(8, 8, 1, FOAM).line(0, 8, 2, 8, FOAM).line(14, 8, 16, 8, FOAM).px(8, 0, PALE).px(8, 15, PALE);
  },
  wvTrail: (g: Pen) => {
    for (const [x, y] of [[2, 13], [6, 10], [9, 6], [13, 3]] as const) g.rect(x, y, 2, 2, SEA);
    g.line(3, 12, 3, 8, AQUA).line(10, 5, 10, 1, AQUA).px(3, 7, FOAM).px(10, 0, FOAM).line(7, 9, 7, 7, PALE);
  },
  wvTsunami: (g: Pen) => {
    g.rect(0, 9, 16, 7, DEEP).line(0, 9, 6, 3, SEA).line(6, 3, 12, 1, AQUA).line(12, 1, 15, 3, FOAM).line(15, 3, 13, 6, FOAM).line(1, 9, 7, 4, AQUA);
    g.px(4, 12, FOAM).px(10, 13, PALE).px(12, 7, FOAM);
  },
};
