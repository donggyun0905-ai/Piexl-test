// 기계공학자 아이콘: 레이저 무기 11개 · 전용 패시브 10개
import type { PassiveId } from "@pixel-rogue/shared";
import { S, D, K, Pen, haft, star } from "./pen";

const R = "#ff5a48"; // 레이저
const L = "#fff2e8"; // 레이저 가운데
const O = "#e8a040"; // 구리·주황
const B = "#6ec6e8"; // 유리·푸른 빛

export const ENGINEER_WEAPON_ART = {
  beamer: (g: Pen) => {
    g.rect(2, 7, 8, 4, D).rect(2, 7, 8, 1, S).rect(10, 8, 3, 2, S).rect(4, 11, 2, 3, K).rect(6, 8, 2, 2, O);
    g.px(13, 8, R).px(13, 9, R).line(14, 8, 15, 8, L).line(14, 9, 15, 9, R);
  },
  laserturret: (g: Pen) => {
    g.line(4, 14, 7, 10, D).line(11, 14, 8, 10, D).line(8, 11, 8, 14, D);
    g.rect(4, 5, 7, 5, O).rect(4, 5, 7, 1, "#f8c878").rect(11, 6, 3, 2, S).px(14, 6, R).px(15, 6, L).px(15, 7, R);
  },
  mirrordrone: (g: Pen) => {
    g.line(4, 5, 12, 4, R).line(12, 4, 8, 12, R).line(8, 12, 4, 5, "#c8603a");
    for (const [x, y] of [[4, 5], [12, 4], [8, 12]] as const) g.disc(x, y, 2, S).px(x, y, B);
  },
  focuscannon: (g: Pen) => {
    g.rect(1, 5, 9, 6, D).rect(1, 5, 9, 1, S).rect(3, 11, 2, 3, K).rect(4, 7, 3, 2, O);
    g.disc(11, 8, 3, B).px(10, 7, "#fff").line(14, 8, 15, 8, L);
  },
  plasmacutter: (g: Pen) => {
    g.rect(1, 8, 6, 3, D).rect(1, 8, 6, 1, S).rect(7, 9, 2, 1, S).rect(2, 11, 2, 3, K);
    for (let i = 0; i < 7; i++) {
      const h = Math.floor(i / 2);
      g.line(9 + i, 9 - h, 9 + i, 9 + h, i < 2 ? "#ffe070" : i < 5 ? O : R);
    }
  },
  teslacoil: (g: Pen) => {
    g.rect(6, 9, 4, 6, D).rect(5, 14, 6, 1, K);
    for (const y of [10, 12]) g.line(6, y, 9, y, O);
    g.disc(8, 5, 3, S).px(7, 4, "#fff");
    g.px(3, 2, B).px(2, 3, B).px(3, 4, B).px(13, 2, B).px(14, 3, B).px(13, 4, B);
  },
  magnetfield: (g: Pen) => {
    g.rect(3, 4, 3, 8, "#e0505e").rect(10, 4, 3, 8, "#e0505e").rect(3, 10, 10, 3, "#e0505e");
    g.rect(3, 2, 3, 2, S).rect(10, 2, 3, 2, S);
    g.px(7, 1, B).px(8, 1, B).px(1, 6, B).px(14, 6, B).px(7, 5, B).px(8, 5, B);
  },
  hydraulichammer: (g: Pen) => {
    haft(g, 2, 14, 8, 8);
    g.rect(7, 2, 8, 5, D).rect(7, 2, 8, 1, S).rect(9, 7, 4, 2, O).rect(10, 9, 2, 1, S);
  },
  overreactor: (g: Pen) => {
    g.ring(8, 8, 6, D).disc(8, 8, 4, O).disc(8, 8, 2, L).px(8, 8, "#fff");
    g.px(2, 2, R).px(13, 2, R).px(2, 13, R).px(13, 13, R);
  },
  minelauncher: (g: Pen) => {
    g.line(2, 3, 6, 7, D).line(3, 3, 7, 7, S);
    g.disc(10, 10, 4, K).px(10, 10, R).px(10, 5, D).px(15, 10, D).px(10, 15, D).px(5, 10, D);
  },
  orbitalcannon: (g: Pen) => {
    g.rect(6, 1, 4, 3, D).rect(1, 2, 4, 1, B).rect(11, 2, 4, 1, B);
    g.line(7, 4, 7, 13, R).line(9, 4, 9, 13, R).line(8, 4, 8, 13, L).rect(4, 14, 9, 1, O);
  },
};

export const ENGINEER_PASSIVE_ART: Partial<Record<PassiveId, (g: Pen) => void>> = {
  highLens: (g) => {
    g.ring(8, 8, 5, S).disc(8, 8, 4, B).px(6, 6, "#fff").px(7, 6, "#fff").line(2, 13, 4, 11, D);
  },
  beamSplitter: (g) => {
    g.line(2, 8, 7, 8, R).line(7, 8, 13, 4, R).line(7, 8, 13, 12, R).px(7, 8, "#fff").px(13, 4, L).px(13, 12, L);
  },
  heatBuildup: (g) => {
    g.disc(8, 10, 3, O).rect(7, 4, 2, 4, O).px(8, 3, "#ffe070").disc(8, 11, 1, "#ffe070");
    g.rect(3, 12, 1, 2, R).rect(12, 10, 1, 4, R);
  },
  focusCoil: (g) => {
    g.line(8, 2, 8, 13, S);
    for (const y of [4, 6, 8, 10]) g.line(4, y, 11, y + 1, O);
  },
  refractPrism: (g) => {
    for (let i = 0; i < 7; i++) g.line(8 - Math.floor(i / 2), 4 + i, 8 + Math.floor(i / 2), 4 + i, B);
    g.line(2, 7, 6, 8, R).line(10, 8, 13, 6, R).line(10, 9, 13, 11, "#f8c878");
  },
  coolingSystem: (g) => {
    g.line(8, 3, 8, 13, B).line(3, 8, 13, 8, B).line(5, 5, 11, 11, "#a8e8ff").line(11, 5, 5, 11, "#a8e8ff").px(8, 8, "#fff");
  },
  overloadBurst: (g) => {
    g.ring(8, 8, 5, R);
    star(g, 8, 8, O, true);
  },
  energyRecycle: (g) => {
    g.ring(8, 8, 5, "#ffc878").disc(8, 8, 2, O).px(12, 4, "#fff").px(13, 5, "#fff").px(3, 11, "#fff").px(4, 12, "#fff");
  },
  armorMelt: (g) => {
    g.rect(4, 3, 8, 6, D).rect(4, 3, 8, 1, S);
    g.line(5, 9, 5, 11, O).line(8, 9, 8, 12, O).line(11, 9, 11, 10, O).px(8, 13, R);
  },
  overclock: (g) => {
    g.rect(3, 5, 10, 8, S).rect(4, 6, 8, 6, K).line(8, 3, 8, 10, R).px(7, 4, R).px(9, 4, R).px(6, 5, R).px(10, 5, R);
  },
};
