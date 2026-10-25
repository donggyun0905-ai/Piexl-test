// 시즌 2 헬리오스 아이콘: 역병의사 무기 4·아이템 10 (모기·연기·쥐·검은 손·새부리 가면) · 학살자 대낫 10·아이템 10 (피 묻은 대낫·콤보 표시)
import type { Pen } from "./pen";

const BLOOD = "#c81e2a";
const DARK = "#3a3446";
const BLADE = "#e8ecf4";
const SMOKE = "#7a8a5a";
const WH = "#ffffff";

/** 대낫: 자루 + 휜 날 (날 색 b, 날 끝에 피) */
function scythe(g: Pen, b = BLADE): void {
  g.line(4, 14, 11, 3, "#5a3a2a");
  for (let i = 0; i < 8; i++) g.px(11 - i, 3 + Math.round((i * i) / 10), b);
  g.px(4, 4, BLOOD).px(5, 4, BLOOD).px(5, 5, BLOOD);
}
const mosquito = (g: Pen, x: number, y: number) => g.px(x, y, DARK).px(x - 1, y - 1, "#c8e0f0").px(x + 1, y - 1, "#c8e0f0").px(x + 1, y + 1, "#c84a4a");
const rat = (g: Pen, x: number, y: number) => g.rect(x, y, 4, 2, "#6a5a5a").px(x + 4, y, "#6a5a5a").px(x + 4, y - 1, "#e8a0a0").px(x - 1, y + 1, "#c8a0a0").px(x - 2, y + 1, "#c8a0a0").px(x + 3, y, "#1a1018");

export const HELIOS2_WEAPON_ART = {
  mosquitoSwarm: (g: Pen) => {
    for (const [x, y] of [[4, 4], [9, 3], [12, 7], [6, 9], [10, 12], [3, 12]]) mosquito(g, x!, y!);
  },
  miasmaCenser: (g) => {
    g.disc(6, 6, 3, SMOKE).disc(10, 5, 3, "#9aa86a").disc(9, 9, 3, SMOKE);
    g.line(8, 10, 8, 12, "#c8a040").rect(6, 12, 5, 3, "#8a6a3a").px(8, 13, "#ff8a2a");
  },
  ratKing: (g) => {
    rat(g, 3, 5);
    rat(g, 8, 9);
    rat(g, 2, 12);
    g.px(4, 3, "#ffd040").px(5, 2, "#ffd040").px(6, 3, "#ffd040");
  },
  deathGrip: (g) => {
    g.rect(4, 6, 8, 6, "#1e1a24").rect(4, 3, 2, 4, "#1e1a24").rect(7, 2, 2, 5, "#1e1a24").rect(10, 3, 2, 4, "#1e1a24");
    g.px(5, 9, "#9aff6a").px(9, 9, "#9aff6a").line(4, 12, 12, 14, "#4a3a5a");
  },
  bloodScythe: (g) => scythe(g),
  diamondScythe: (g) => {
    scythe(g);
    g.px(13, 11, "#ff6a7a").px(12, 12, "#ff6a7a").px(14, 12, "#ff6a7a").px(13, 13, "#ff6a7a");
  },
  whirlScythe: (g) => {
    scythe(g);
    g.ring(8, 9, 6, "#ff6a7a");
  },
  tideScythe: (g) => {
    scythe(g, "#ff8a8a");
    for (const y of [8, 11, 14]) g.line(11, y, 14, y - 1, BLOOD);
  },
  hungerScythe: (g) => {
    scythe(g);
    g.line(1, 9, 3, 9, WH).line(1, 11, 4, 11, WH);
  },
  flyingScythe: (g) => {
    scythe(g);
    g.ring(12, 11, 3, "#c8c8d8");
  },
  rushScythe: (g) => {
    scythe(g);
    g.line(1, 13, 6, 13, BLOOD).line(2, 15, 7, 15, BLOOD);
  },
  earthScythe: (g) => {
    scythe(g, "#d8b080");
    g.rect(1, 14, 14, 2, "#7a5a3a").px(5, 13, "#7a5a3a").px(10, 13, "#7a5a3a");
  },
  phantomScythe: (g) => {
    scythe(g, "#a8b8ff");
    g.line(1, 8, 15, 8, "#8a8aff");
  },
  executionScythe: (g) => {
    scythe(g, "#ffd8d8");
    g.rect(11, 11, 4, 4, BLOOD).px(12, 12, WH).px(13, 13, WH);
  },
} satisfies Record<string, (g: Pen) => void>;

export const HELIOS2_PASSIVE_ART = {
  plGland: (g) => g.disc(8, 9, 5, "#5ac84a").disc(8, 9, 2, "#2a8a3a").px(6, 6, WH),
  plHive: (g) => {
    g.disc(8, 8, 5, "#c8a040").ring(8, 8, 5, "#8a6a2a");
    mosquito(g, 13, 3);
    mosquito(g, 3, 13);
  },
  plSmog: (g) => g.disc(5, 9, 4, SMOKE).disc(10, 7, 5, "#9aa86a").disc(11, 11, 3, SMOKE),
  plBurrow: (g) => {
    g.disc(8, 11, 5, "#2a1a14");
    rat(g, 6, 9);
  },
  plBlackDeath: (g) => g.disc(8, 8, 6, "#1a1018").px(6, 6, "#9aff6a").px(10, 9, "#9aff6a").px(7, 11, "#9aff6a"),
  plRust: (g) => g.rect(3, 4, 10, 8, "#9aa3b8").rect(5, 6, 3, 3, "#b86a2a").rect(9, 8, 2, 3, "#c8783a"),
  plMask: (g) => {
    g.disc(7, 7, 5, "#2a2430").line(9, 8, 15, 12, "#2a2430").line(9, 9, 14, 13, "#3a3440");
    g.ring(6, 6, 1, "#c8a040").px(6, 6, "#9aff6a");
  },
  plBloodlet: (g) => g.line(3, 13, 12, 3, BLADE).disc(11, 11, 2, BLOOD).px(11, 14, BLOOD),
  plContagion: (g) => {
    for (const [x, y] of [[4, 4], [12, 5], [8, 12]]) g.disc(x!, y!, 2, "#1a1018").px(x!, y!, "#9aff6a");
    g.line(4, 4, 12, 5, "#5a8a3a").line(12, 5, 8, 12, "#5a8a3a");
  },
  plReaper: (g) => {
    g.rect(5, 6, 6, 6, "#1e1a24").rect(5, 3, 2, 4, "#1e1a24").rect(9, 3, 2, 4, "#1e1a24");
    g.line(10, 2, 14, 6, BLADE);
  },
  slPact: (g) => g.rect(3, 3, 10, 11, "#e8d8b0").line(5, 6, 11, 6, DARK).line(5, 9, 10, 9, DARK).disc(10, 12, 2, BLOOD),
  slMadness: (g) => g.ring(8, 8, 6, BLOOD).ring(8, 8, 3, "#ff6a7a").px(8, 8, WH),
  slThirst: (g) => g.disc(8, 10, 4, BLOOD).line(8, 3, 8, 6, BLOOD).px(7, 9, "#ff8a8a"),
  slNumb: (g) => g.rect(3, 6, 10, 5, "#c8c8d8").line(3, 8, 12, 8, "#8a8aa0").px(13, 7, BLOOD),
  slBerserk: (g) => g.disc(8, 8, 5, BLOOD).line(5, 6, 7, 7, DARK).line(11, 6, 9, 7, DARK).line(5, 11, 11, 11, WH),
  slGrin: (g) => {
    g.disc(8, 8, 6, "#f0d8c8").px(6, 6, DARK).px(10, 6, DARK);
    for (let x = 4; x <= 12; x++) g.px(x, 10 + (x === 4 || x === 12 ? -1 : 0), BLOOD);
  },
  slCrimson: (g) => {
    for (let i = 0; i < 10; i++) g.px(3 + i, 12 - Math.round((i * i) / 12), BLOOD);
    g.px(12, 4, WH);
  },
  slHound: (g) => g.line(2, 12, 12, 6, BLOOD).line(2, 9, 9, 5, "#ff8a8a").disc(13, 5, 2, DARK),
  slLastBreath: (g) => g.disc(8, 8, 5, "#3a3446").line(4, 8, 12, 8, BLOOD).px(8, 8, WH),
  slMassacre: (g) => {
    g.disc(8, 8, 4, BLOOD);
    for (let i = 0; i < 8; i++) g.px(8 + Math.round(Math.cos(i * 0.8) * 6), 8 + Math.round(Math.sin(i * 0.8) * 6), "#ff6a2a");
  },
} satisfies Record<string, (g: Pen) => void>;
