// 원소술사 아이콘: 회전체 무기 10개 · 전용 아이템 10개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import { K, Pen, S, star } from "./pen";

const FIRE = "#ff6a2a";
const WATER = "#3aa0ff";
const EARTH = "#c08a40";
const THUNDER = "#ffe23a";
const GRASS = "#5ad05a";

/** 가운데 점을 둘러싼 n개의 구슬 (미리 정한 자리) */
function ringOf(g: Pen, spots: readonly (readonly [number, number])[], colors: readonly string[], r = 1): void {
  spots.forEach(([x, y], i) => g.disc(x, y, r, colors[i % colors.length]!));
}
const FIVE = [[8, 2], [13, 6], [11, 13], [5, 13], [3, 6]] as const;
const EIGHT = [[8, 1], [13, 3], [15, 8], [13, 13], [8, 15], [3, 13], [1, 8], [3, 3]] as const;

type ElemWeapon = "elemorb" | "lightorb" | "galaxy" | "planets" | "bladelord" | "gravity" | "godhand" | "meteors" | "steelorb" | "trigger";

export const ELEMENTAL_WEAPON_ART: Record<ElemWeapon & WeaponId, (g: Pen) => void> = {
  elemorb: (g) => {
    g.ring(8, 8, 5, "#3a5a7a");
    ringOf(g, FIVE, [FIRE, WATER, EARTH, THUNDER, GRASS], 2);
    g.px(8, 8, "#fff");
  },
  lightorb: (g) => {
    g.ring(8, 8, 3, "#8a8460");
    ringOf(g, [[8, 4], [12, 8], [8, 12], [4, 8]], ["#fff6c0"], 1);
    g.px(8, 8, "#fff").px(2, 2, "#fff6c0").px(14, 13, "#fff6c0");
  },
  galaxy: (g) => {
    g.disc(8, 8, 6, "#2a1a5a").disc(8, 8, 3, "#5a3aa8");
    for (const [x, y] of [[4, 5], [11, 4], [12, 11], [5, 12], [8, 8], [9, 2], [2, 9]] as const) g.px(x, y, "#fff");
  },
  planets: (g) => {
    ringOf(g, EIGHT, ["#c8f4ff", "#ffcf7a", "#4a90e0", "#e0603a", "#d83a4a", "#e8c890", "#9ad8c8", "#8a9aff"], 1);
    g.disc(8, 8, 2, "#ffd060");
  },
  bladelord: (g) => {
    for (const [x, c] of [[3, FIRE], [6, WATER], [9, THUNDER], [12, GRASS]] as const) g.line(x, 2, x, 10, S).px(x, 11, c).px(x - 1, 11, c).px(x + 1, 11, c).px(x, 12, c);
  },
  gravity: (g) => {
    g.disc(8, 8, 6, "#28143e").ring(8, 8, 6, "#9a6aff").ring(8, 8, 3, "#6a4aa8").disc(8, 8, 1, K);
    g.line(8, 0, 8, 3, "#d8c0ff").line(7, 2, 8, 3, "#d8c0ff").line(9, 2, 8, 3, "#d8c0ff");
  },
  godhand: (g) => {
    g.rect(4, 7, 9, 6, "#ffe9b8").rect(4, 3, 2, 4, "#ffe9b8").rect(7, 2, 2, 5, "#ffe9b8").rect(10, 3, 2, 4, "#ffe9b8").rect(2, 8, 2, 3, "#ffe9b8");
    g.rect(4, 12, 9, 1, "#d8b878");
  },
  meteors: (g) => {
    star(g, 8, 8, "#ffffff");
    ringOf(g, [[8, 4], [12, 8], [8, 12], [4, 8]], ["#cfe0ff"], 0);
    ringOf(g, EIGHT, ["#ffe070"], 0);
  },
  steelorb: (g) => {
    ringOf(g, FIVE, ["#5a6070"], 2);
    ringOf(g, FIVE, ["#c8ccd8"], 1);
    g.rect(7, 7, 3, 2, "#e8ecf4");
  },
  trigger: (g) => {
    ringOf(g, [[3, 4], [3, 8], [3, 12]], ["#8ad0ff"], 1);
    g.line(6, 8, 14, 8, "#8ad0ff").px(15, 8, "#fff").line(7, 6, 11, 6, "#3a6a9a").line(7, 10, 11, 10, "#3a6a9a");
  },
};

type ElemPassive = "perfectCircle" | "cleanFreak" | "genesis" | "electronic" | "luckyDeflect" | "pet" | "bigger" | "beautiful" | "flashy" | "steadfast";

export const ELEMENTAL_PASSIVE_ART: Record<ElemPassive & PassiveId, (g: Pen) => void> = {
  perfectCircle: (g) => {
    g.ring(8, 8, 6, "#e8ecf4").ring(8, 8, 5, "#9aa3b8").px(8, 8, "#fff");
  },
  cleanFreak: (g) => {
    g.rect(4, 4, 8, 8, "#cfeaff").rect(5, 5, 6, 6, "#ffffff").px(2, 2, "#cfeaff").px(13, 3, "#cfeaff").px(3, 13, "#cfeaff").line(12, 12, 14, 14, "#6ad8f0");
  },
  genesis: (g) => {
    g.disc(8, 8, 3, "#ffd060").px(8, 2, "#fff").px(14, 8, "#fff").px(8, 14, "#fff").px(2, 8, "#fff").line(8, 4, 8, 12, "#fff").line(4, 8, 12, 8, "#fff");
  },
  electronic: (g) => {
    ringOf(g, [[3, 3], [13, 3], [13, 13], [3, 13]], ["#6ad8f0"], 1);
    g.line(4, 3, 12, 3, "#c8f8ff").line(13, 4, 13, 12, "#c8f8ff").line(12, 13, 4, 13, "#c8f8ff").line(3, 12, 3, 4, "#c8f8ff");
    g.line(9, 5, 7, 8, THUNDER).line(7, 8, 9, 8, THUNDER).line(9, 8, 7, 11, THUNDER);
  },
  luckyDeflect: (g) => {
    g.disc(5, 8, 3, "#c8ccd8").line(9, 4, 14, 2, "#ff6b8a").line(9, 12, 14, 14, "#ffe070").px(15, 1, "#ff6b8a");
  },
  pet: (g) => {
    g.disc(8, 9, 4, "#ff1a3a").disc(8, 9, 2, "#ff7a8a").px(6, 8, K).px(10, 8, K).px(5, 4, "#ff1a3a").px(11, 4, "#ff1a3a");
  },
  bigger: (g) => {
    g.ring(8, 8, 3, "#6ad8f0").ring(8, 8, 6, "#3a8ab0").line(11, 5, 14, 2, "#fff").line(12, 2, 14, 2, "#fff").line(14, 2, 14, 4, "#fff");
  },
  beautiful: (g) => {
    star(g, 8, 8, "#ff9ec8", true);
    g.px(3, 3, "#ffe070").px(13, 4, "#6ad8f0").px(12, 13, "#5ad05a");
  },
  flashy: (g) => {
    ringOf(g, FIVE, [FIRE, WATER, GRASS, EARTH, THUNDER], 1);
    star(g, 8, 8, "#fff");
  },
  steadfast: (g) => {
    g.rect(3, 3, 10, 10, "#8a93a6").rect(4, 4, 8, 8, "#5a6a90").rect(7, 5, 2, 6, "#e0505e").rect(5, 7, 6, 2, "#e0505e");
  },
};
