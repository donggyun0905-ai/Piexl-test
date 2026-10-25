// 정령사 아이콘: 대정령 10개(대정령 얼굴·상징) · 전용 아이템 10개 (정령 구슬·리본)
import type { Pen } from "./pen";

const WH = "#ffffff";
const GOLD = "#ffd040";

/** 빛나는 정령 구슬 (색 c) */
function orb(g: Pen, x: number, y: number, r: number, c: string): void {
  g.disc(x, y, r, c).px(x - 1, y - 1, WH);
}

export const SPIRIT_WEAPON_ART: Record<"titanCoreSpirit" | "ironHide" | "chronoSpire" | "nightWeaver" | "umbra" | "venomHide" | "idraSpirit" | "briarHeart" | "sylvanGuard" | "abyssRuin", (g: Pen) => void> = {
  titanCoreSpirit: (g) => g.rect(3, 3, 10, 11, "#8a8478").rect(4, 4, 8, 4, "#a8a090").rect(5, 6, 2, 1, "#ff9a3a").rect(9, 6, 2, 1, "#ff9a3a").rect(6, 10, 4, 2, "#5a5448"),
  ironHide: (g) => g.disc(8, 9, 6, "#7a8090").rect(4, 3, 2, 4, "#c8d0e0").rect(10, 3, 2, 4, "#c8d0e0").px(6, 8, "#ff4a4a").px(10, 8, "#ff4a4a").rect(6, 12, 4, 1, WH),
  chronoSpire: (g) => g.line(8, 1, 8, 14, "#6ad8ff").line(5, 14, 11, 14, "#6ad8ff").ring(8, 7, 4, GOLD).line(8, 7, 8, 4, GOLD).line(8, 7, 10, 7, GOLD),
  nightWeaver: (g) => {
    g.disc(8, 7, 3, "#3a2a5a").px(7, 6, "#c8a8ff").px(9, 6, "#c8a8ff");
    for (const [x, y] of [[2, 3], [14, 3], [2, 13], [14, 13]]) g.line(8, 8, x!, y!, "#c8a8ff");
  },
  umbra: (g) => g.disc(8, 8, 6, "#1a1028").disc(8, 8, 4, "#3a2a5a").px(6, 7, "#ff4a8a").px(10, 7, "#ff4a8a").rect(6, 11, 4, 1, "#ff4a8a"),
  venomHide: (g) => g.disc(8, 7, 5, "#3a8a3a").rect(6, 11, 4, 4, "#3a8a3a").px(6, 6, "#ffd040").px(10, 6, "#ffd040").line(8, 11, 8, 15, "#9aff5a"),
  idraSpirit: (g) => {
    // 세계수의 여신: 긴 초록 머리 · 금빛 관 · 꽃
    g.rect(4, 3, 8, 12, "#5ac84a").disc(8, 7, 3, "#f6dcc4").px(7, 7, "#1e5a2a").px(9, 7, "#1e5a2a");
    g.rect(5, 2, 6, 1, GOLD).px(8, 1, GOLD).px(5, 1, GOLD).px(10, 1, GOLD).px(4, 12, "#ff8ac8").px(11, 10, "#ff8ac8");
  },
  briarHeart: (g) => {
    g.disc(6, 7, 3, "#c82a4a").disc(10, 7, 3, "#c82a4a").rect(5, 8, 6, 3, "#c82a4a").rect(7, 11, 2, 2, "#c82a4a");
    for (const [x, y] of [[2, 4], [14, 4], [3, 12], [13, 12]]) g.line(8, 8, x!, y!, "#3a8a2a");
  },
  sylvanGuard: (g) => {
    g.rect(5, 5, 6, 9, "#3a7a3a").disc(8, 4, 3, "#e8c8a0").rect(5, 1, 6, 2, "#2a5a2a");
    g.line(13, 2, 13, 14, "#8a6a3a").line(12, 3, 12, 13, "#e8f0d8");
  },
  abyssRuin: (g) => g.ring(8, 8, 6, "#6a3aa8").disc(8, 8, 4, "#140a20").ring(8, 8, 2, "#c88aff").px(8, 8, WH),
};

export const SPIRIT_PASSIVE_ART = {
  spBond: (g: Pen) => {
    orb(g, 4, 5, 2, "#8ab8ff");
    orb(g, 12, 5, 2, "#ff9a3a");
    orb(g, 8, 12, 2, "#7ae05a");
    g.line(4, 5, 12, 5, "#e8e8f8").line(12, 5, 8, 12, "#e8e8f8").line(8, 12, 4, 5, "#e8e8f8");
  },
  spLonger: (g: Pen) => {
    orb(g, 6, 8, 3, "#8ab8ff");
    g.ring(11, 6, 3, GOLD).line(11, 6, 11, 4, GOLD);
  },
  spFury: (g: Pen) => {
    orb(g, 8, 9, 4, "#ff6a2a");
    g.px(5, 3, "#ff4a1a").px(8, 2, "#ffd040").px(11, 3, "#ff4a1a");
  },
  spAwaken: (g: Pen) => g.disc(8, 9, 5, "#8a8478").ring(8, 9, 6, GOLD).px(6, 8, "#ff9a3a").px(10, 8, "#ff9a3a").px(8, 1, GOLD),
  spGreatPower: (g: Pen) => g.disc(8, 8, 5, "#6a3aa8").line(8, 1, 8, 15, GOLD).line(1, 8, 15, 8, GOLD).px(8, 8, WH),
  spMissile: (g: Pen) => g.line(2, 12, 9, 5, "#c8d8ff").line(5, 14, 12, 7, "#c8d8ff").px(10, 4, WH).px(13, 6, WH),
  spFarewell: (g: Pen) => {
    orb(g, 8, 8, 3, "#8ab8ff");
    for (const [x, y] of [[8, 1], [1, 8], [14, 8], [8, 14], [3, 3], [13, 13]]) g.px(x!, y!, GOLD);
  },
  spHarmony: (g: Pen) => {
    orb(g, 5, 6, 2, "#ff9a3a");
    orb(g, 11, 6, 2, "#7ae05a");
    orb(g, 8, 11, 2, "#8a6aff");
    g.ring(8, 8, 7, "#e8e8f8");
  },
  spRibbon: (g: Pen) => g.rect(3, 6, 4, 4, "#c83a4a").rect(9, 6, 4, 4, "#c83a4a").rect(7, 7, 2, 2, "#e85a6a").line(6, 10, 4, 14, "#c83a4a").line(10, 10, 12, 14, "#c83a4a"),
  spShield: (g: Pen) => {
    g.rect(4, 3, 8, 7, "#6ad8ff").rect(5, 10, 6, 2, "#6ad8ff").px(8, 13, "#6ad8ff");
    orb(g, 8, 7, 2, WH);
  },
};
