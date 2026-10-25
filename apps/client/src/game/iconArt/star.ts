// 별지기(히든) 아이콘: 별 무기 10개 · 전용 아이템 10개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import { K, Pen, W } from "./pen";

const GOLD = "#fff2a8";

/** 네 갈래 별 (가운데 x, y · 갈래 길이 n) */
function star(g: Pen, x: number, y: number, n: number, c: string, core = "#fff"): void {
  g.rect(x - n, y, n * 2 + 1, 1, c).rect(x, y - n, 1, n * 2 + 1, c);
  if (n >= 2) g.rect(x - 1, y - 1, 3, 3, c);
  g.px(x, y, core);
}

/** 별 둘 사이 빛줄기 */
const beam = (g: Pen, x0: number, y0: number, x1: number, y1: number, c: string) => g.line(x0, y0, x1, y1, c);

type StarWeapon = "starStaff" | "cometTail" | "twinStars" | "blackStar" | "novaHeart" | "polaris" | "meteorShower" | "milkyWay" | "frostStar" | "tinySun";
type StarPassive = "brightStar" | "longNight" | "wideSky" | "extraStar" | "starfall" | "stardust" | "starWard" | "zodiac" | "eclipse" | "armillary";

export const STAR_WEAPON_ART: Record<StarWeapon & WeaponId, (g: Pen) => void> = {
  starStaff: (g) => {
    g.line(3, 14, 10, 7, W).line(4, 14, 11, 7, "#5a4428");
    star(g, 11, 5, 3, GOLD);
  },
  cometTail: (g) => {
    g.line(1, 14, 9, 6, "#4a8ac8").line(2, 15, 10, 7, "#8ad8ff").line(1, 12, 7, 6, "#4a8ac8");
    star(g, 11, 4, 3, "#8ad8ff");
  },
  twinStars: (g) => {
    beam(g, 4, 11, 12, 5, "#ffb0e0");
    star(g, 4, 11, 3, "#ffb0e0");
    star(g, 12, 5, 3, "#ffb0e0");
  },
  blackStar: (g) => {
    g.disc(8, 8, 6, "#1a1028").ring(8, 8, 6, "#b07aff");
    star(g, 8, 8, 3, "#b07aff", "#e8d8ff");
  },
  novaHeart: (g) => {
    g.ring(8, 8, 7, "#ff6a2a").ring(8, 8, 5, "#ffb04a");
    star(g, 8, 8, 4, "#ff9a4a", "#fff6d0");
  },
  polaris: (g) => {
    star(g, 8, 8, 7, "#c8d8f0");
    star(g, 8, 8, 3, "#e8f4ff");
    g.px(3, 3, "#c8d8f0").px(13, 13, "#c8d8f0").px(13, 3, "#c8d8f0").px(3, 13, "#c8d8f0");
  },
  meteorShower: (g) => {
    for (const [x, y] of [[4, 4], [9, 2], [10, 9]] as const) {
      g.line(x - 3, y - 3, x, y, "#a8603a");
      star(g, x, y, 1, "#ffd27a");
    }
  },
  milkyWay: (g) => {
    g.line(1, 13, 14, 2, "#5a4a8a").line(2, 14, 15, 3, "#3a2a6a");
    for (const [x, y] of [[3, 11], [6, 9], [9, 6], [12, 4], [5, 12], [11, 7]] as const) g.px(x, y, "#e8d8ff");
    star(g, 8, 7, 2, "#c8b0ff");
  },
  frostStar: (g) => {
    star(g, 8, 8, 5, "#9af0ff");
    g.px(2, 3, "#fff").px(13, 2, "#fff").px(3, 13, "#fff").px(14, 12, "#fff");
  },
  tinySun: (g) => {
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      g.px(Math.round(8 + Math.cos(a) * 7), Math.round(8 + Math.sin(a) * 7), "#ffb04a");
    }
    g.disc(8, 8, 4, "#ff6a3a").disc(7, 7, 2, "#ffd27a");
  },
};

export const STAR_PASSIVE_ART: Record<StarPassive & PassiveId, (g: Pen) => void> = {
  brightStar: (g) => {
    g.disc(8, 8, 6, "#3a3456").disc(8, 8, 4, "#6a5a2a");
    star(g, 8, 8, 5, GOLD);
  },
  longNight: (g) => {
    g.disc(6, 7, 5, "#e8e0a8").disc(8, 5, 4, K);
    star(g, 12, 11, 2, GOLD);
  },
  wideSky: (g) => {
    for (const [x, y] of [[2, 3], [13, 2], [8, 8], [3, 13], [13, 13]] as const) star(g, x, y, 1, GOLD);
    beam(g, 2, 3, 8, 8, "#6a6aa8");
    beam(g, 8, 8, 13, 13, "#6a6aa8");
  },
  extraStar: (g) => {
    star(g, 6, 9, 4, GOLD);
    g.rect(11, 2, 5, 1, "#6ad86a").rect(13, 0, 1, 5, "#6ad86a");
  },
  starfall: (g) => {
    g.line(1, 2, 10, 11, "#8a6aa8").line(2, 2, 11, 11, "#c8b0ff");
    star(g, 12, 12, 2, GOLD);
  },
  stardust: (g) => {
    for (const [x, y, c] of [[3, 4, GOLD], [8, 2, "#fff"], [12, 6, GOLD], [5, 10, "#c8b0ff"], [10, 12, GOLD], [13, 13, "#fff"]] as const) g.px(x, y, c);
    star(g, 8, 8, 2, GOLD);
  },
  starWard: (g) => {
    g.rect(3, 2, 10, 8, "#4a6ac8").rect(4, 10, 8, 2, "#4a6ac8").rect(6, 12, 4, 2, "#4a6ac8");
    star(g, 8, 7, 3, GOLD);
  },
  zodiac: (g) => {
    g.ring(8, 8, 6, "#8a7ab8");
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      g.px(Math.round(8 + Math.cos(a) * 6), Math.round(8 + Math.sin(a) * 6), GOLD);
    }
    star(g, 8, 8, 2, GOLD);
  },
  eclipse: (g) => {
    g.disc(8, 8, 6, "#ffd040").disc(8, 8, 5, "#1a1028");
    g.px(2, 8, "#fff6d0").px(14, 8, "#fff6d0").px(8, 2, "#fff6d0").px(8, 14, "#fff6d0");
  },
  armillary: (g) => {
    g.ring(8, 7, 6, "#d8a83a").line(2, 7, 14, 7, "#d8a83a").line(8, 1, 8, 13, "#a87a1a");
    g.disc(8, 7, 2, "#5ac8e8").rect(6, 14, 5, 1, W);
  },
};
