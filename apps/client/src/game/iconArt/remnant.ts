// 아스칼론 잔영 아이콘: 그림자(짙은 보라·검정·옅은 보라 빛) 단검 10·전용 아이템 10
import { type Pen } from "./pen";

const BLADE = "#d8dcf0";
const VIO = "#8a6aff";
const DARK = "#2a2040";
const MIST = "#b8a8ff";
const RED = "#e83a4a";

/** 단검 하나 (손잡이 x0,y0 → 칼끝 x1,y1) */
function dagger(g: Pen, x0: number, y0: number, x1: number, y1: number, blade = BLADE): void {
  const mx = x0 + (x1 - x0) * 0.35;
  const my = y0 + (y1 - y0) * 0.35;
  g.line(x0, y0, mx, my, DARK).line(mx, my, x1, y1, blade).px(Math.round(mx), Math.round(my), VIO);
}

export const RM_WEAPON_ART = {
  rmDagger: (g: Pen) => {
    dagger(g, 3, 13, 13, 3);
    g.line(2, 10, 6, 6, MIST);
  },
  rmTwin: (g: Pen) => {
    dagger(g, 2, 13, 11, 3);
    dagger(g, 5, 14, 14, 5);
  },
  rmClaw: (g: Pen) => {
    for (const x of [3, 7, 11]) g.line(x, 13, x + 3, 3, BLADE).px(x, 13, DARK);
    g.rect(2, 12, 12, 2, DARK);
  },
  rmStiletto: (g: Pen) => {
    g.line(4, 12, 14, 2, BLADE).rect(2, 12, 3, 3, DARK).rect(3, 10, 3, 1, VIO);
  },
  rmKunai: (g: Pen) => {
    for (const [x, y] of [[2, 6], [6, 10], [9, 3]]) {
      g.line(x!, y!, x! + 4, y! - 3, BLADE).px(x!, y!, VIO);
    }
  },
  rmSpin: (g: Pen) => {
    g.ring(8, 8, 6, MIST).disc(8, 8, 1, DARK);
    for (const [x, y] of [[8, 1], [15, 8], [8, 15], [1, 8]]) g.px(x!, y!, BLADE);
  },
  rmFlash: (g: Pen) => {
    dagger(g, 8, 13, 14, 2);
    g.rect(1, 6, 2, 6, MIST).rect(4, 5, 1, 8, VIO);
  },
  rmReaper: (g: Pen) => {
    g.line(3, 14, 9, 3, DARK).line(9, 3, 14, 5, BLADE).line(14, 5, 12, 8, BLADE);
  },
  rmFang: (g: Pen) => {
    dagger(g, 3, 13, 13, 3, "#8ae88a");
    g.px(13, 5, "#5ad05a").px(12, 7, "#5ad05a");
  },
  rmEclipse: (g: Pen) => {
    g.disc(8, 8, 6, "#ffe9a8").disc(10, 7, 5, DARK);
    dagger(g, 2, 14, 7, 9);
  },
};

export const RM_PASSIVE_ART = {
  rmStep: (g: Pen) => {
    g.rect(2, 10, 4, 3, MIST).rect(9, 5, 4, 3, DARK).rect(9, 5, 1, 3, VIO);
  },
  rmBackstab: (g: Pen) => {
    g.rect(4, 4, 7, 10, "#4a3a5a");
    dagger(g, 14, 2, 8, 8);
  },
  rmExecute: (g: Pen) => {
    dagger(g, 3, 13, 13, 3);
    g.rect(10, 10, 4, 4, RED);
  },
  rmEcho: (g: Pen) => {
    g.rect(3, 4, 4, 9, MIST).rect(7, 3, 5, 10, VIO).rect(8, 4, 3, 3, "#e8d8ff");
  },
  rmVanish: (g: Pen) => {
    for (let i = 0; i < 6; i++) g.px(3 + i * 2, 12 - (i % 3) * 3, i % 2 ? MIST : VIO);
    g.ring(8, 8, 6, DARK);
  },
  rmBlood: (g: Pen) => {
    dagger(g, 3, 13, 13, 3);
    g.px(12, 6, RED).px(11, 8, RED).px(11, 9, RED);
  },
  rmHaste: (g: Pen) => {
    for (const y of [4, 8, 12]) g.line(2, y, 9, y, MIST);
    dagger(g, 8, 12, 14, 4);
  },
  rmSwift: (g: Pen) => {
    g.rect(4, 9, 6, 3, DARK).rect(9, 11, 3, 1, DARK).line(1, 7, 4, 7, MIST).line(1, 10, 3, 10, MIST);
  },
  rmFrenzy: (g: Pen) => {
    dagger(g, 2, 9, 7, 4);
    dagger(g, 9, 14, 14, 9);
    g.line(6, 8, 10, 10, VIO);
  },
  rmShroud: (g: Pen) => {
    g.rect(3, 3, 10, 11, DARK).rect(5, 5, 6, 3, "#4a3a6a").px(6, 6, VIO).px(9, 6, VIO);
  },
};
