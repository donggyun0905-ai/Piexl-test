// 성국 미카엘라 아이콘: 무한의 무기 보관소 (떠다니는 은빛 검과 투창 다발) · 전용 아이템 20 (콤보·광기 5 · 폭발·연쇄 5 · 투척·무기 5 · 포탈·스킬 5)
import type { Pen } from "./pen";

const GOLD = "#f2c14e";
const LIGHT = "#fff6c0";
const WHITE = "#ffffff";
const SILVER = "#d8dce8";
const STEEL = "#9aa4b8";
const VOID = "#7a58d8";
const DEEP = "#3a2a68";
const RED = "#e8405a";
const ORANGE = "#ff9a40";

/** 검 (손잡이 x,y · 위쪽 날 길이 len) */
function sword(g: Pen, x: number, y: number, len = 8): void {
  g.line(x, y - 2, x, y - len, SILVER).px(x, y - len - 1, WHITE).line(x - 2, y - 1, x + 2, y - 1, GOLD).px(x, y, GOLD);
}
/** 투창 (아래 x0,y0 → 위 x1,y1) */
function spear(g: Pen, x0: number, y0: number, x1: number, y1: number): void {
  g.line(x0, y0, x1, y1, GOLD).px(x1, y1, WHITE).px(x1 + 1, y1, SILVER).px(x1, y1 + 1, SILVER);
}
/** 포탈 (가운데 x,y) */
function portal(g: Pen, x: number, y: number, r = 4): void {
  g.disc(x, y, r, DEEP).ring(x, y, r, VOID).px(x, y, LIGHT);
}
/** 폭발 (가운데 x,y) */
function boom(g: Pen, x: number, y: number, r = 3): void {
  g.disc(x, y, r, ORANGE).disc(x, y, r - 1, LIGHT).px(x - r - 1, y, ORANGE).px(x + r + 1, y, ORANGE).px(x, y - r - 1, ORANGE).px(x, y + r + 1, ORANGE);
}

export const MC_WEAPON_ART = {
  mcArmory: (g: Pen) => {
    sword(g, 4, 14, 9);
    sword(g, 12, 14, 9);
    spear(g, 6, 15, 10, 2);
    spear(g, 9, 15, 13, 4);
  },
};

export const MC_PASSIVE_ART = {
  mcFrenzy: (g: Pen) => {
    for (const x of [3, 7, 11]) sword(g, x, 14, 10);
    g.px(14, 3, RED).px(14, 5, RED);
  },
  mcMadness: (g: Pen) => {
    g.disc(8, 8, 5, DEEP).px(6, 7, RED).px(10, 7, RED).line(5, 11, 11, 11, RED);
  },
  mcTempo: (g: Pen) => {
    g.ring(8, 8, 6, SILVER).line(8, 8, 8, 4, GOLD).line(8, 8, 11, 9, GOLD);
  },
  mcDouble: (g: Pen) => {
    sword(g, 4, 14, 9);
    spear(g, 9, 14, 14, 3);
    g.line(6, 4, 9, 4, LIGHT).px(9, 3, LIGHT).px(9, 5, LIGHT);
  },
  mcEcho: (g: Pen) => {
    spear(g, 2, 14, 10, 2);
    g.line(6, 15, 14, 5, STEEL);
  },
  mcPowder: (g: Pen) => {
    boom(g, 8, 8, 4);
  },
  mcWide: (g: Pen) => {
    boom(g, 8, 8, 2);
    g.ring(8, 8, 6, ORANGE);
  },
  mcResonance: (g: Pen) => {
    boom(g, 4, 11, 2);
    boom(g, 12, 5, 2);
    g.line(6, 9, 10, 7, LIGHT);
  },
  mcFuse: (g: Pen) => {
    g.line(2, 14, 7, 9, STEEL).line(7, 9, 10, 9, STEEL);
    boom(g, 12, 6, 3);
  },
  mcShrapnel: (g: Pen) => {
    boom(g, 6, 8, 2);
    g.px(12, 4, SILVER).px(13, 8, SILVER).px(11, 12, SILVER).px(10, 14, RED);
  },
  mcJavelin: (g: Pen) => {
    spear(g, 1, 15, 14, 2);
    g.disc(8, 8, 2, DEEP).px(4, 12, VOID);
  },
  mcHeavy: (g: Pen) => {
    g.rect(6, 2, 4, 9, SILVER).px(7, 1, WHITE).rect(4, 11, 8, 2, GOLD).rect(7, 13, 2, 3, GOLD);
  },
  mcSword: (g: Pen) => {
    sword(g, 8, 15, 12);
    g.line(3, 6, 6, 3, LIGHT);
  },
  mcLance: (g: Pen) => {
    spear(g, 3, 15, 13, 1);
    g.px(12, 3, GOLD).px(14, 2, LIGHT);
  },
  mcHoard: (g: Pen) => {
    for (const x of [3, 6, 9, 12]) sword(g, x, 14, 6 + (x % 2) * 2);
  },
  mcStorm: (g: Pen) => {
    portal(g, 8, 3, 3);
    for (const x of [4, 8, 12]) g.line(x, 7, x, 13, SILVER).px(x, 14, WHITE);
  },
  mcBlink: (g: Pen) => {
    g.line(2, 12, 13, 4, VOID).disc(3, 12, 2, DEEP);
    sword(g, 13, 8, 6);
  },
  mcVoid: (g: Pen) => {
    portal(g, 8, 8, 6);
    sword(g, 8, 13, 9);
  },
  mcArsenal: (g: Pen) => {
    portal(g, 8, 4, 4);
    spear(g, 4, 15, 6, 9);
    spear(g, 11, 15, 10, 9);
    sword(g, 8, 15, 5);
  },
  mcPrayer: (g: Pen) => {
    g.line(5, 13, 8, 4, SILVER).line(11, 13, 8, 4, SILVER).ring(8, 3, 2, VOID);
  },
};
