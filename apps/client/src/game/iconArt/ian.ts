// 성국 이안 아이콘: 집행의 펜 & 강철 실타래 (금빛 펜촉 칼날 + 보랏빛 실) · 전용 아이템 20 (기록·속박 5 · 암살·급소 5 · 실 5 · 인과·스킬 5)
import type { Pen } from "./pen";

const INK = "#b89aff";
const VIOLET = "#6a4aff";
const GOLD = "#f2c14e";
const PAPER = "#f4ecd8";
const STEEL = "#aab4c8";
const SILVER = "#eef2f8";
const DARK = "#2a1e40";
const RED = "#e8405a";

/** 대각선 펜 (펜촉이 왼쪽 아래 · c 펜대 색) */
function pen(g: Pen, c = GOLD): void {
  g.line(13, 2, 4, 11, c).line(14, 3, 5, 12, STEEL).line(4, 11, 2, 14, SILVER).px(1, 15, SILVER).px(12, 4, VIOLET);
}
/** 실 (y 줄을 따라 물결) */
function thread(g: Pen, y: number, c = INK): void {
  for (let x = 1; x < 15; x++) g.px(x, y + ((x >> 1) % 2 ? 1 : 0), c);
}
/** 두루마리 종이 */
function paper(g: Pen): void {
  g.rect(3, 3, 10, 11, PAPER).line(3, 3, 12, 3, GOLD).line(3, 13, 12, 13, GOLD);
}
/** 기록 점 n개 (종이 위 잉크) */
function marks(g: Pen, n: number): void {
  for (let i = 0; i < n; i++) g.line(5, 5 + i * 2, 10, 5 + i * 2, DARK);
}

export const IA_WEAPON_ART = {
  iaPen: (g: Pen) => {
    pen(g);
    g.ring(11, 11, 3, INK).px(11, 11, VIOLET);
  },
};

export const IA_PASSIVE_ART = {
  iaQuill: (g: Pen) => {
    g.line(12, 1, 5, 10, PAPER).line(13, 2, 6, 11, SILVER).line(5, 10, 3, 14, GOLD).px(9, 6, INK);
  },
  iaLedger: (g: Pen) => {
    g.rect(2, 3, 12, 10, "#5a3a2a").rect(3, 4, 10, 8, PAPER).line(8, 4, 8, 11, GOLD);
    marks(g, 3);
  },
  iaClause: (g: Pen) => {
    paper(g);
    g.line(5, 6, 10, 6, DARK).line(5, 9, 10, 9, RED).px(11, 9, RED);
  },
  iaChain: (g: Pen) => {
    for (const [x, y] of [[3, 4], [8, 8], [13, 12]] as const) g.ring(x, y, 2, INK);
    g.line(4, 5, 7, 7, STEEL).line(9, 9, 12, 11, STEEL);
  },
  iaSeal: (g: Pen) => {
    g.rect(3, 3, 10, 10, RED).rect(4, 4, 8, 8, "#a01a2a").line(6, 6, 9, 9, PAPER).line(9, 6, 6, 9, PAPER);
  },
  iaVital: (g: Pen) => {
    g.ring(8, 8, 6, PAPER).ring(8, 8, 3, RED).px(8, 8, RED).line(8, 0, 8, 3, STEEL).line(8, 13, 8, 15, STEEL);
  },
  iaSilence: (g: Pen) => {
    g.disc(8, 8, 6, DARK).line(4, 8, 12, 8, INK).px(8, 5, SILVER).px(8, 11, SILVER);
  },
  iaShadow: (g: Pen) => {
    g.disc(6, 9, 4, DARK).disc(10, 7, 4, VIOLET).disc(10, 7, 2, INK);
  },
  iaNeedle: (g: Pen) => {
    g.line(14, 1, 2, 13, SILVER).line(15, 1, 3, 13, STEEL).px(1, 14, PAPER).ring(13, 3, 1, GOLD);
  },
  iaReaper: (g: Pen) => {
    paper(g);
    g.line(5, 7, 10, 7, DARK).line(5, 10, 8, 10, DARK).disc(10, 10, 1, RED);
  },
  iaSteel: (g: Pen) => {
    g.disc(8, 8, 5, STEEL).disc(8, 8, 3, SILVER).disc(8, 8, 1, DARK);
    thread(g, 13, STEEL);
  },
  iaWeave: (g: Pen) => {
    thread(g, 4);
    thread(g, 8, VIOLET);
    thread(g, 12);
    g.line(4, 2, 4, 14, GOLD).line(11, 2, 11, 14, GOLD);
  },
  iaSnare: (g: Pen) => {
    g.ring(9, 7, 5, INK).ring(9, 7, 4, VIOLET).line(4, 10, 1, 15, INK);
  },
  iaSpool: (g: Pen) => {
    g.line(2, 8, 14, 2, INK).line(2, 8, 14, 8, INK).line(2, 8, 14, 14, INK).disc(2, 8, 2, GOLD);
  },
  iaKnot: (g: Pen) => {
    thread(g, 8);
    g.disc(8, 8, 3, VIOLET).ring(8, 8, 3, INK).px(8, 8, SILVER);
  },
  iaEcho: (g: Pen) => {
    paper(g);
    g.ring(8, 8, 3, INK).ring(8, 8, 5, VIOLET);
  },
  iaLaw: (g: Pen) => {
    g.line(8, 2, 8, 14, GOLD).line(3, 5, 13, 5, GOLD).disc(3, 9, 2, INK).disc(13, 9, 2, VIOLET).line(3, 5, 3, 7, GOLD).line(13, 5, 13, 7, GOLD);
  },
  iaAbsolute: (g: Pen) => {
    g.rect(4, 2, 8, 12, PAPER).rect(4, 2, 8, 2, GOLD).line(6, 6, 10, 6, DARK).line(6, 9, 10, 9, DARK).line(6, 12, 10, 12, DARK);
  },
  iaVerse: (g: Pen) => {
    g.line(8, 2, 8, 14, GOLD).line(4, 6, 12, 6, GOLD).ring(8, 6, 2, PAPER);
  },
  iaCall: (g: Pen) => {
    g.disc(8, 4, 2, PAPER).line(8, 6, 8, 14, GOLD).line(3, 10, 13, 10, INK).px(2, 2, GOLD).px(14, 2, GOLD).px(8, 1, SILVER);
  },
};
