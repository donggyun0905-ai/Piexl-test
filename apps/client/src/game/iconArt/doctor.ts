// 의사 아이콘: 의료 무기 11개 · 전용 패시브 10개
import type { PassiveId } from "@pixel-rogue/shared";
import { S, D, K, Pen, haft } from "./pen";

const Wt = "#f4f6fa"; // 흰 천·가운
const Rd = "#e0303a"; // 붉은 십자·피
const Bl = "#9fe0ff"; // 주사액
const Gn = "#7fd88a"; // 가스·알약
const Bd = "#e8dcc0"; // 붕대

/** 붉은 십자 (가운데 cx, cy) */
function cross(g: Pen, cx: number, cy: number, c = Rd): void {
  g.rect(cx - 1, cy - 3, 3, 7, c).rect(cx - 3, cy - 1, 7, 3, c);
}

export const DOCTOR_WEAPON_ART = {
  syringe: (g: Pen) => {
    g.line(2, 13, 4, 11, D).rect(3, 10, 3, 3, S).line(5, 10, 11, 4, Wt).line(6, 11, 12, 5, Wt).line(6, 10, 10, 6, Bl);
    g.line(12, 4, 15, 1, S);
  },
  scalpel: (g: Pen) => {
    g.line(2, 14, 8, 8, D).line(3, 14, 9, 8, S).line(9, 7, 13, 3, S).line(10, 7, 14, 3, "#fff").px(14, 2, "#fff");
  },
  transfusion: (g: Pen) => {
    g.rect(9, 1, 5, 6, Rd).rect(9, 1, 5, 1, Wt).rect(10, 7, 3, 1, S);
    g.line(11, 8, 11, 10, Rd).line(11, 10, 4, 12, Rd).line(4, 12, 2, 14, S);
  },
  defibrillator: (g: Pen) => {
    g.rect(1, 7, 6, 6, D).rect(9, 7, 6, 6, D).rect(2, 8, 4, 4, S).rect(10, 8, 4, 4, S);
    g.px(7, 4, "#ffe070").px(8, 5, "#ffe070").px(7, 6, "#ffe070").px(8, 7, "#ffe070");
  },
  sutureneedle: (g: Pen) => {
    for (let i = 0; i < 5; i++) g.px(3 + i * 2, 12 - Math.round(Math.sin(i) * 2) - i, S);
    g.line(11, 4, 14, 1, S).px(12, 3, K).line(2, 14, 4, 12, Bd).line(4, 12, 6, 13, Bd);
  },
  gascanister: (g: Pen) => {
    g.rect(5, 5, 6, 9, D).rect(5, 5, 6, 1, S).rect(7, 3, 2, 2, K).rect(6, 8, 4, 3, Gn);
    g.px(11, 2, Gn).px(12, 1, Gn).px(13, 3, Gn).px(3, 2, Gn);
  },
  ivpole: (g: Pen) => {
    g.line(8, 4, 8, 14, S).line(5, 14, 11, 14, D).line(4, 3, 12, 3, S).rect(3, 4, 3, 4, Bl).rect(10, 4, 3, 4, Bl);
  },
  pillshot: (g: Pen) => {
    for (const [x, y, c] of [[3, 3, Rd], [10, 2, Gn], [12, 9, Bl], [5, 10, "#ffd060"], [8, 6, Wt]] as const) g.rect(x, y, 3, 2, c).px(x, y, "#fff");
  },
  medkitbomb: (g: Pen) => {
    g.rect(2, 5, 12, 9, Wt).rect(2, 5, 12, 1, D).rect(6, 3, 4, 2, D);
    cross(g, 8, 9);
    g.px(14, 2, "#ffb040").px(13, 3, "#ff6a20");
  },
  bandagewhip: (g: Pen) => {
    g.line(2, 14, 4, 12, D);
    for (let i = 0; i < 10; i++) g.px(5 + i, 11 - Math.round(Math.sin(i * 0.8) * 3) - Math.floor(i / 2), Bd);
  },
  ambulance: (g: Pen) => {
    g.rect(1, 5, 14, 7, Wt).rect(11, 6, 3, 3, Bl).rect(1, 9, 14, 1, Rd).rect(3, 12, 3, 2, K).rect(10, 12, 3, 2, K);
    cross(g, 6, 7);
    g.px(4, 4, Rd).px(5, 4, "#4a8ae0");
  },
};

export const DOCTOR_PASSIVE_ART: Partial<Record<PassiveId, (g: Pen) => void>> = {
  woundSuture: (g) => {
    g.line(3, 8, 12, 8, Rd);
    for (const x of [4, 7, 10]) g.line(x, 6, x + 1, 10, Bd);
  },
  healthCare: (g) => {
    g.ring(8, 8, 5, Bl).disc(8, 8, 3, "#4a8ae0");
    cross(g, 8, 8, Wt);
  },
  robust: (g) => {
    g.disc(5, 6, 2, Rd).disc(10, 6, 2, Rd).rect(3, 7, 10, 2, Rd);
    for (let i = 0; i < 4; i++) g.rect(4 + i, 9 + i, 8 - 2 * i, 1, Rd);
    g.ring(8, 8, 6, Bl);
  },
  firstAid: (g) => {
    g.rect(3, 4, 10, 9, Wt);
    cross(g, 8, 8);
  },
  checkup: (g) => {
    g.rect(4, 3, 8, 11, Wt).rect(6, 2, 4, 2, D).line(5, 7, 7, 9, Gn).line(7, 9, 11, 5, Gn).line(5, 11, 10, 11, D);
  },
  overtreat: (g) => {
    g.rect(4, 6, 8, 3, Gn).rect(4, 6, 4, 3, Rd).rect(5, 10, 6, 2, Bl).px(8, 3, "#fff").px(7, 2, "#fff").px(9, 2, "#fff");
  },
  prescription: (g) => {
    g.rect(4, 2, 8, 12, Wt).line(5, 5, 10, 5, D).line(5, 8, 10, 8, D).line(5, 11, 8, 11, D).px(10, 11, Rd).px(11, 12, Rd);
  },
  doctorGown: (g) => {
    g.rect(4, 4, 8, 10, Wt).rect(7, 4, 2, 10, "#c8d0e0").rect(3, 5, 2, 5, Wt).rect(11, 5, 2, 5, Wt).px(6, 7, Rd);
  },
  surgery: (g) => {
    haft(g, 3, 13, 8, 8);
    g.line(8, 8, 12, 4, S).line(9, 8, 13, 4, "#fff").ring(8, 8, 6, Gn);
  },
  antibody: (g) => {
    g.disc(8, 8, 2, Bl);
    for (const [x, y] of [[8, 3], [13, 8], [8, 13], [3, 8]] as const) g.line(8, 8, x, y, "#4a8ae0").px(x, y, Rd);
  },
};
