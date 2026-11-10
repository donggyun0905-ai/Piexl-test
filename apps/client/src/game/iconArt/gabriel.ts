// 성국 가브리엘 아이콘: 불멸의 성벽 방패 & 단조 해머 (흰 금빛 망치 + 타일 방패) · 전용 아이템 20 (철옹·방어 5 · 망치·대지 5 · 중력 5 · 스킬·성벽 5)
import type { Pen } from "./pen";

const GOLD = "#f2c14e";
const LIGHT = "#fff0a0";
const IVORY = "#f4ecd8";
const STEEL = "#aab4c8";
const NAVY = "#3a4aa8";
const DARK = "#2a2440";
const STONE = "#7a6a58";
const VOID = "#5a3aa8";
const RED = "#e8405a";

/** 망치 (머리 가운데 x,y · 자루가 오른쪽 아래로) */
function hammer(g: Pen, x = 6, y = 6, c = IVORY): void {
  g.line(x + 1, y + 1, x + 8, y + 8, "#8a6a3a").rect(x - 3, y - 2, 7, 5, c).rect(x - 3, y - 2, 7, 1, GOLD).rect(x - 3, y + 2, 7, 1, GOLD).px(x, y, NAVY);
}
/** 타일 방패 (가운데 x · 위 y) */
function shield(g: Pen, x = 8, y = 2, c = IVORY): void {
  g.rect(x - 4, y, 9, 8, c).line(x - 4, y + 8, x, y + 12, c).line(x + 4, y + 8, x, y + 12, c).rect(x - 3, y + 1, 7, 6, NAVY);
  g.line(x, y + 1, x, y + 10, GOLD).line(x - 3, y + 4, x + 3, y + 4, GOLD);
}
/** 금 갈라짐 (땅) */
function cracks(g: Pen, y = 13): void {
  g.rect(1, y, 14, 2, STONE).line(4, y, 6, y - 2, GOLD).line(11, y, 9, y - 2, GOLD).px(8, y - 1, LIGHT);
}
/** 중력 소용돌이 */
function vortex(g: Pen, c = VOID): void {
  g.ring(8, 8, 6, c).ring(8, 8, 3, GOLD).disc(8, 8, 1, DARK);
}

export const GB_WEAPON_ART = {
  gbHammer: (g: Pen) => {
    shield(g, 10, 2);
    hammer(g, 5, 5);
  },
};

export const GB_PASSIVE_ART = {
  gbPlate: (g: Pen) => {
    g.rect(3, 2, 10, 12, STEEL).rect(4, 3, 8, 10, IVORY).line(8, 3, 8, 12, GOLD).line(4, 7, 11, 7, GOLD);
  },
  gbVow: (g: Pen) => {
    shield(g);
    g.ring(8, 6, 6, LIGHT);
  },
  gbThorns: (g: Pen) => {
    shield(g);
    for (const [x, y] of [[2, 2], [14, 2], [1, 8], [15, 8], [8, 0]] as const) g.px(x, y, RED);
  },
  gbAegis: (g: Pen) => {
    g.rect(2, 6, 12, 8, IVORY).rect(2, 4, 2, 2, IVORY).rect(7, 4, 2, 2, IVORY).rect(12, 4, 2, 2, IVORY).rect(6, 9, 4, 5, DARK).px(8, 2, GOLD);
  },
  gbIron: (g: Pen) => {
    g.disc(8, 8, 6, STEEL).disc(8, 8, 4, IVORY).line(8, 5, 8, 11, RED).line(5, 8, 11, 8, RED);
  },
  gbForge: (g: Pen) => {
    hammer(g, 7, 6);
    g.px(2, 2, LIGHT).px(13, 3, GOLD).px(3, 12, GOLD);
  },
  gbQuake: (g: Pen) => {
    cracks(g);
    g.ring(8, 9, 5, GOLD).ring(8, 9, 7, LIGHT);
  },
  gbStun: (g: Pen) => {
    hammer(g, 7, 9);
    for (const [x, y] of [[3, 2], [8, 1], [13, 2]] as const) g.px(x, y, LIGHT).px(x + 1, y + 1, GOLD);
  },
  gbAfter: (g: Pen) => {
    cracks(g);
    g.line(5, 1, 5, 9, LIGHT).line(11, 3, 11, 9, GOLD).rect(4, 8, 3, 2, LIGHT).rect(10, 8, 3, 2, GOLD);
  },
  gbTitan: (g: Pen) => {
    g.rect(3, 5, 8, 8, IVORY).rect(3, 3, 2, 3, IVORY).rect(6, 2, 2, 4, IVORY).rect(9, 3, 2, 3, IVORY).rect(11, 7, 3, 3, IVORY).line(3, 12, 10, 12, GOLD);
  },
  gbGrav: (g: Pen) => {
    vortex(g);
    g.disc(8, 8, 2, VOID).px(8, 8, LIGHT);
  },
  gbPull: (g: Pen) => {
    vortex(g);
    g.line(1, 1, 4, 4, LIGHT).line(15, 1, 12, 4, LIGHT).line(1, 15, 4, 12, LIGHT).line(15, 15, 12, 12, LIGHT);
  },
  gbWeight: (g: Pen) => {
    g.rect(3, 6, 10, 8, DARK).rect(4, 7, 8, 6, STEEL).ring(8, 4, 2, STEEL).line(6, 10, 10, 10, GOLD);
  },
  gbCrush: (g: Pen) => {
    cracks(g);
    g.rect(4, 2, 8, 6, DARK).rect(5, 3, 6, 4, VOID).line(4, 9, 11, 9, LIGHT);
  },
  gbOrbit: (g: Pen) => {
    g.line(4, 1, 4, 12, LIGHT).line(11, 1, 11, 12, GOLD).rect(2, 10, 5, 3, LIGHT).rect(9, 10, 5, 3, GOLD).ring(8, 8, 7, VOID);
  },
  gbBash: (g: Pen) => {
    shield(g, 10, 2);
    g.line(1, 5, 4, 5, LIGHT).line(0, 8, 4, 8, LIGHT).line(1, 11, 4, 11, LIGHT);
  },
  gbBulwark: (g: Pen) => {
    g.rect(1, 6, 14, 8, IVORY).rect(1, 4, 3, 2, IVORY).rect(6, 4, 4, 2, IVORY).rect(12, 4, 3, 2, IVORY).line(1, 10, 14, 10, GOLD).ring(8, 8, 7, LIGHT);
  },
  gbLight: (g: Pen) => {
    g.line(8, 0, 8, 7, LIGHT).rect(4, 7, 9, 5, LIGHT).rect(4, 7, 9, 1, GOLD).rect(4, 11, 9, 1, GOLD).px(8, 9, IVORY).line(2, 14, 14, 14, GOLD);
  },
  gbImmortal: (g: Pen) => {
    g.ring(8, 6, 5, GOLD);
    for (const [x, y] of [[8, 0], [2, 5], [14, 5], [4, 1], [12, 1]] as const) g.px(x, y, LIGHT);
    shield(g, 8, 5);
  },
  gbFaith: (g: Pen) => {
    g.rect(7, 1, 2, 14, GOLD).rect(3, 5, 10, 2, GOLD).ring(8, 6, 4, LIGHT);
  },
};
