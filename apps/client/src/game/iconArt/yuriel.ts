// 성국 유리엘 아이콘: 성수 수정구 & 사슬 집행의 철퇴 (금빛 철퇴 + 푸른 성수 수정구) · 전용 아이템 20 (단죄·정화 5 · 철퇴·사슬 5 · 결계·수호 5 · 치유·스킬 5)
import type { Pen } from "./pen";

const GOLD = "#f2c14e";
const LIGHT = "#fff6c0";
const WHITE = "#ffffff";
const IVORY = "#f4ecd8";
const STEEL = "#c8d0e0";
const CHAIN = "#9aa4b8";
const WATER = "#7ad8ff";
const DEEP = "#3a8ad8";
const RED = "#e8405a";
const DARK = "#2a3048";
const GREEN = "#8aff9a";

/** 철퇴 머리 (가운데 x,y · 반지름 r) */
function mace(g: Pen, x: number, y: number, r = 3): void {
  g.disc(x, y, r, GOLD).px(x, y - r - 1, LIGHT).px(x, y + r + 1, LIGHT).px(x - r - 1, y, LIGHT).px(x + r + 1, y, LIGHT).px(x - 1, y - 1, WHITE);
}
/** 사슬 (점선) */
function chain(g: Pen, x0: number, y0: number, x1: number, y1: number): void {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= n; i += 2) g.px(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), CHAIN);
}
/** 수정구 (가운데 x,y) */
function orb(g: Pen, x: number, y: number, r = 3): void {
  g.disc(x, y, r, WATER).ring(x, y, r, DEEP).px(x - 1, y - 1, WHITE);
}
/** 빛 십자 */
function cross(g: Pen, x: number, y: number, c = LIGHT): void {
  g.line(x, y - 4, x, y + 4, c).line(x - 2, y - 2, x + 2, y - 2, c);
}

export const YR_WEAPON_ART = {
  yrFlail: (g: Pen) => {
    g.line(3, 14, 6, 9, STEEL).px(2, 15, GOLD);
    chain(g, 6, 9, 10, 5);
    mace(g, 11, 4, 2);
    orb(g, 4, 4, 2);
  },
};

export const YR_PASSIVE_ART = {
  yrInquest: (g: Pen) => {
    g.disc(8, 9, 4, DARK).px(7, 8, RED).px(9, 8, RED);
    cross(g, 8, 4, GOLD);
  },
  yrPyre: (g: Pen) => {
    g.disc(8, 10, 4, GOLD).disc(8, 8, 3, LIGHT).px(8, 3, LIGHT).px(6, 5, GOLD).px(10, 5, GOLD);
  },
  yrBloom: (g: Pen) => {
    g.ring(8, 8, 6, GOLD).ring(8, 8, 3, LIGHT).px(8, 8, WHITE);
  },
  yrStigma: (g: Pen) => {
    g.disc(8, 8, 5, DARK);
    cross(g, 8, 8, RED);
  },
  yrNoMercy: (g: Pen) => {
    mace(g, 8, 6, 3);
    g.line(3, 13, 13, 13, STEEL).px(5, 11, LIGHT).px(11, 11, LIGHT);
  },
  yrHeavy: (g: Pen) => {
    mace(g, 8, 8, 4);
  },
  yrChain: (g: Pen) => {
    chain(g, 2, 14, 12, 4);
    mace(g, 12, 4, 2);
    g.ring(8, 8, 6, CHAIN);
  },
  yrWrist: (g: Pen) => {
    g.line(2, 10, 8, 3, LIGHT).line(8, 3, 14, 10, LIGHT).rect(6, 11, 4, 3, IVORY);
  },
  yrBaptism: (g: Pen) => {
    g.px(8, 2, WATER).line(7, 4, 9, 4, WATER).disc(8, 8, 3, WATER).px(7, 7, WHITE);
    cross(g, 8, 12, GOLD);
  },
  yrVerdict: (g: Pen) => {
    mace(g, 8, 5, 3);
    g.line(2, 12, 14, 12, GOLD).line(4, 14, 12, 14, LIGHT);
  },
  yrSanct: (g: Pen) => {
    g.ring(8, 8, 7, WATER).ring(8, 8, 4, LIGHT);
    cross(g, 8, 8, GOLD);
  },
  yrBulwark: (g: Pen) => {
    g.rect(4, 3, 8, 7, STEEL).line(4, 10, 8, 14, STEEL).line(12, 10, 8, 14, STEEL);
    cross(g, 8, 7, GOLD);
  },
  yrVigil: (g: Pen) => {
    g.rect(7, 6, 2, 8, IVORY).px(8, 4, GOLD).px(8, 3, LIGHT).ring(8, 4, 2, LIGHT);
  },
  yrThorn: (g: Pen) => {
    g.ring(8, 8, 6, LIGHT);
    for (const [x, y] of [[8, 1], [8, 15], [1, 8], [15, 8], [3, 3], [13, 13], [3, 13], [13, 3]] as const) g.px(x, y, GOLD);
  },
  yrGuard: (g: Pen) => {
    g.disc(8, 8, 6, DEEP).disc(8, 8, 4, WATER);
    cross(g, 8, 8, WHITE);
  },
  yrTouch: (g: Pen) => {
    g.rect(5, 8, 6, 5, IVORY).rect(7, 4, 2, 4, IVORY);
    cross(g, 12, 4, GREEN);
  },
  yrOrb: (g: Pen) => {
    orb(g, 8, 7, 5);
    g.rect(5, 13, 6, 2, GOLD);
  },
  yrGrace: (g: Pen) => {
    g.ring(8, 8, 6, WATER).disc(8, 8, 3, GREEN).px(8, 8, WHITE);
  },
  yrHeaven: (g: Pen) => {
    g.line(8, 0, 8, 8, LIGHT).line(7, 0, 7, 6, WHITE);
    mace(g, 8, 11, 3);
  },
  yrPrayer: (g: Pen) => {
    g.line(5, 13, 8, 4, IVORY).line(11, 13, 8, 4, IVORY).ring(8, 3, 2, GOLD);
  },
};
