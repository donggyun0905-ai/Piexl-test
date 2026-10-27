// 아스칼론 영사 아이콘: 실(은빛·분홍빛 가는 줄) 무기 10·전용 아이템 10
import { type Pen } from "./pen";

const SILK = "#f4e8ff";
const PINK = "#ff8ad8";
const RED = "#e83a5a";
const SPOOL = "#8a5a3a";
const STEEL = "#c8d0e0";
const GOLD = "#ffd860";

/** 손끝에서 뻗는 실 (x0,y0 → x1,y1) */
function thread(g: Pen, x0: number, y0: number, x1: number, y1: number, c = SILK): void {
  g.line(x0, y0, x1, y1, c);
}
function ring(g: Pen, x: number, y: number): void {
  g.px(x, y, GOLD).px(x + 1, y, GOLD).px(x, y + 1, GOLD).px(x + 1, y + 1, PINK);
}

export const SK_WEAPON_ART = {
  skThread: (g: Pen) => {
    ring(g, 2, 12);
    thread(g, 3, 12, 15, 1);
  },
  skTwin: (g: Pen) => {
    ring(g, 2, 12);
    thread(g, 3, 12, 15, 2);
    thread(g, 3, 13, 15, 7, PINK);
  },
  skWeb: (g: Pen) => {
    for (const [x, y] of [[15, 1], [15, 8], [8, 1]]) thread(g, 2, 14, x!, y!);
    g.line(6, 10, 9, 10, SILK).line(9, 6, 9, 10, SILK);
  },
  skSteel: (g: Pen) => {
    ring(g, 2, 12);
    g.line(3, 12, 15, 2, STEEL).line(4, 12, 15, 3, "#8a92a8");
  },
  skCrimson: (g: Pen) => {
    ring(g, 2, 12);
    thread(g, 3, 12, 15, 1, RED);
    g.px(10, 6, RED).px(11, 7, RED);
  },
  skNeedle: (g: Pen) => {
    g.line(9, 2, 14, 7, STEEL).px(9, 2, "#ffffff");
    thread(g, 2, 14, 10, 4);
  },
  skHarp: (g: Pen) => {
    g.line(2, 2, 2, 14, GOLD).line(2, 2, 13, 4, GOLD);
    for (const x of [5, 8, 11]) thread(g, x, 3, x, 14);
  },
  skSpool: (g: Pen) => {
    g.rect(4, 3, 8, 2, SPOOL).rect(4, 11, 8, 2, SPOOL).rect(5, 5, 6, 6, PINK);
    for (const y of [6, 8]) g.line(5, y, 10, y, SILK);
  },
  skMarionette: (g: Pen) => {
    g.rect(3, 2, 10, 2, SPOOL);
    for (const x of [5, 8, 11]) thread(g, x, 4, x, 9);
    g.rect(6, 9, 5, 4, "#c8a0c8").px(8, 8, "#e8c8a8");
  },
  skCocoon: (g: Pen) => {
    g.disc(8, 8, 5, SILK);
    for (const y of [5, 8, 11]) g.line(4, y, 12, y - 1, PINK);
  },
};

export const SK_PASSIVE_ART = {
  skFast: (g: Pen) => {
    g.rect(5, 4, 6, 8, PINK);
    for (const y of [4, 8, 12]) g.line(1, y, 4, y, SILK);
  },
  skMore: (g: Pen) => {
    g.disc(8, 9, 5, PINK);
    for (const y of [6, 9, 12]) g.line(4, y, 12, y, SILK);
    thread(g, 12, 6, 15, 1);
  },
  skEdge: (g: Pen) => {
    thread(g, 1, 14, 14, 1);
    g.px(7, 7, "#ffffff").px(8, 6, "#ffffff").px(6, 8, STEEL);
  },
  skRend: (g: Pen) => {
    g.rect(5, 5, 6, 6, "#6a4a6a");
    for (const [x, y] of [[1, 1], [15, 1], [1, 15], [15, 15], [8, 0]]) thread(g, 8, 8, x!, y!, RED);
  },
  skTangle: (g: Pen) => {
    g.ring(8, 8, 5, SILK).ring(8, 8, 3, PINK);
    thread(g, 2, 3, 14, 13);
  },
  skFrenzy: (g: Pen) => {
    for (let i = 0; i < 6; i++) thread(g, 1 + i * 2, 15, 15 - i, 1 + i, i % 2 ? PINK : SILK);
  },
  skBlood: (g: Pen) => {
    g.rect(6, 7, 4, 6, RED).rect(7, 5, 2, 2, RED).px(7, 9, "#ff9aa8");
    thread(g, 1, 3, 15, 3);
  },
  skAgile: (g: Pen) => {
    g.rect(5, 9, 6, 3, "#4a2a4a").rect(10, 11, 3, 1, "#4a2a4a");
    thread(g, 1, 7, 5, 7);
    thread(g, 1, 10, 3, 10);
  },
  skHaste: (g: Pen) => {
    g.rect(3, 8, 6, 5, "#f2d4c4").rect(4, 5, 1, 3, "#f2d4c4").rect(6, 4, 1, 4, "#f2d4c4");
    thread(g, 6, 4, 15, 1);
  },
  skShield: (g: Pen) => {
    g.rect(3, 3, 10, 7, "#f0e0ff").rect(5, 10, 6, 2, "#f0e0ff").rect(7, 12, 2, 2, "#f0e0ff");
    for (const y of [5, 7, 9]) g.line(4, y, 11, y, PINK);
  },
};
