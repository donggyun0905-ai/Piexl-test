// 성국 세레나 아이콘: 강철 가시 채찍 & 맹독성 에테르 비수 (금빛 가시 사슬 + 빛나는 비수) · 전용 아이템 20 (가시·마비 5 · 사슬·비수 5 · 무희·치명 5 · 스킬·환혹 5)
import type { Pen } from "./pen";

const GOLD = "#f2c14e";
const LIGHT = "#fff0a0";
const IVORY = "#f4ecd8";
const STEEL = "#c8d0e0";
const PINK = "#ffb0d0";
const ROSE = "#e8407a";
const VENOM = "#8aff5a";
const ETHER = "#b0e8ff";
const DARK = "#3a2440";

/** 비수 (끝 x,y · 아래쪽 자루) */
function dagger(g: Pen, x: number, y: number, c = STEEL): void {
  g.line(x, y, x, y + 4, c).px(x - 1, y + 2, c).px(x + 1, y + 2, c).rect(x - 1, y + 5, 3, 1, GOLD).px(x, y + 6, DARK);
}
/** 가시 사슬 고리 (가운데 x,y · 반지름 r) */
function chain(g: Pen, x: number, y: number, r: number, c = GOLD): void {
  g.ring(x, y, r, c);
  for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const) g.px(x + dx * (r + 1), y + dy * (r + 1), LIGHT);
}
/** 가시 하나 */
function thorn(g: Pen, x: number, y: number, c = GOLD): void {
  g.px(x, y, c).px(x, y + 1, c).px(x - 1, y + 2, c).px(x + 1, y + 2, c);
}
/** 백합 */
function lily(g: Pen, x = 8, y = 8): void {
  g.disc(x, y, 2, IVORY).px(x, y - 3, IVORY).px(x - 3, y, IVORY).px(x + 3, y, IVORY).px(x, y + 3, IVORY).px(x, y, GOLD);
}

export const SN_WEAPON_ART = {
  snWhip: (g: Pen) => {
    chain(g, 7, 9, 5);
    dagger(g, 12, 1, ETHER);
    g.line(12, 7, 11, 9, GOLD);
  },
};

export const SN_PASSIVE_ART = {
  snThorn: (g: Pen) => {
    g.line(3, 13, 12, 3, "#4a8a3a");
    for (const [x, y] of [[5, 9], [8, 6], [10, 4]] as const) thorn(g, x, y, ROSE);
    g.disc(12, 3, 2, ROSE);
  },
  snBarb: (g: Pen) => {
    g.line(2, 8, 14, 8, STEEL);
    for (let x = 3; x < 14; x += 3) g.px(x, 7, GOLD).px(x + 1, 6, GOLD);
  },
  snNumb: (g: Pen) => {
    g.disc(8, 10, 4, PINK).line(8, 6, 6, 2, IVORY).line(8, 6, 10, 2, IVORY).px(7, 0, LIGHT).px(9, 0, LIGHT);
  },
  snVenom: (g: Pen) => {
    lily(g, 8, 7);
    g.px(8, 11, VENOM).px(8, 12, VENOM).disc(8, 14, 1, VENOM);
  },
  snBloom: (g: Pen) => {
    g.disc(8, 8, 3, ROSE);
    for (const [x, y] of [[8, 1], [2, 8], [14, 8], [8, 13], [3, 3], [13, 3], [3, 13], [13, 13]] as const) g.px(x, y, GOLD);
  },
  snChain: (g: Pen) => {
    chain(g, 5, 8, 3);
    chain(g, 11, 8, 3, LIGHT);
  },
  snReach: (g: Pen) => {
    g.ring(8, 8, 7, GOLD).ring(8, 8, 4, STEEL);
    dagger(g, 14, 1, ETHER);
  },
  snSpin: (g: Pen) => {
    g.ring(8, 8, 6, GOLD).line(8, 2, 11, 4, LIGHT).line(8, 14, 5, 12, LIGHT).disc(8, 8, 1, IVORY);
  },
  snEdge: (g: Pen) => {
    dagger(g, 8, 2, LIGHT);
    g.line(5, 3, 6, 4, IVORY).line(11, 3, 10, 4, IVORY);
  },
  snEther: (g: Pen) => {
    g.line(8, 1, 12, 8, ETHER).line(12, 8, 8, 15, ETHER).line(8, 15, 4, 8, ETHER).line(4, 8, 8, 1, ETHER).disc(8, 8, 2, LIGHT);
  },
  snGrace: (g: Pen) => {
    g.line(3, 8, 8, 5, IVORY).line(8, 5, 13, 8, IVORY).line(3, 8, 8, 11, IVORY).line(8, 11, 13, 8, IVORY).disc(8, 8, 2, ROSE).px(8, 8, DARK);
  },
  snFatal: (g: Pen) => {
    g.disc(6, 8, 3, ROSE).disc(10, 8, 3, ROSE).line(4, 11, 8, 15, ROSE).line(12, 11, 8, 15, ROSE).px(8, 4, LIGHT);
  },
  snTempo: (g: Pen) => {
    g.line(5, 3, 5, 11, IVORY).line(11, 2, 11, 10, IVORY).line(5, 3, 11, 2, IVORY).disc(4, 12, 2, GOLD).disc(10, 11, 2, GOLD);
  },
  snLash: (g: Pen) => {
    g.line(1, 13, 6, 6, PINK).line(6, 6, 14, 3, GOLD);
    dagger(g, 14, 1, ETHER);
  },
  snMirage: (g: Pen) => {
    g.rect(3, 3, 10, 10, "#ffffff22").line(3, 3, 13, 13, PINK).line(13, 3, 3, 13, PINK).ring(8, 8, 5, LIGHT);
  },
  snWing: (g: Pen) => {
    g.rect(4, 10, 8, 3, IVORY).rect(4, 13, 9, 1, GOLD).line(12, 10, 15, 6, LIGHT).line(11, 9, 14, 5, LIGHT);
  },
  snPerfume: (g: Pen) => {
    g.rect(5, 7, 6, 7, PINK).rect(6, 8, 4, 5, ROSE).rect(7, 4, 2, 3, GOLD).rect(6, 3, 4, 1, GOLD);
    for (const [x, y] of [[3, 2], [12, 1], [13, 5]] as const) g.px(x, y, LIGHT);
  },
  snQuiver: (g: Pen) => {
    dagger(g, 4, 4, ETHER);
    dagger(g, 8, 2, VENOM);
    dagger(g, 12, 4, ETHER);
  },
  snNight: (g: Pen) => {
    g.disc(7, 6, 5, LIGHT).disc(9, 5, 4, DARK);
    lily(g, 8, 12);
  },
  snMuse: (g: Pen) => {
    g.ring(8, 6, 5, GOLD);
    for (const [x, y] of [[8, 0], [2, 4], [14, 4]] as const) g.px(x, y, LIGHT);
    lily(g, 8, 7);
  },
};
