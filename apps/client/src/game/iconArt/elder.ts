// 장로 아이콘: 진법 10개(네모난 진 + 진마다 덧그림) · 전용 아이템 10개 (지팡이·수염·찻잔)
import type { Pen } from "./pen";

const GOLD = "#ffd040";
const WOOD = "#8a6a3a";
const WH = "#ffffff";

/** 바닥의 네모난 진 (테두리 색 c) */
function seal(g: Pen, c: string): void {
  for (let i = 1; i <= 14; i++) g.px(i, 1, c).px(i, 14, c).px(1, i, c).px(14, i, c);
  g.px(3, 3, c).px(12, 3, c).px(3, 12, c).px(12, 12, c);
}

export const ELDER_WEAPON_ART: Record<"vineGate" | "fiveDaggers" | "crushWalls" | "pitTrap" | "swordRain" | "thunderSeal" | "frostSquare" | "windCage" | "stoneFist" | "heavenPalace", (g: Pen) => void> = {
  vineGate: (g) => {
    seal(g, "#5ac84a");
    g.line(8, 13, 7, 8, "#2a8a3a").line(7, 8, 9, 3, "#2a8a3a").rect(9, 4, 2, 2, "#5ac84a").rect(5, 7, 2, 2, "#5ac84a");
  },
  fiveDaggers: (g) => {
    seal(g, "#e8a040");
    for (const [x, y] of [[8, 3], [3, 7], [13, 7], [5, 12], [11, 12]]) g.line(x!, y! - 1, x!, y! + 1, "#e8ecf4");
    g.rect(7, 6, 2, 5, "#ff6a2a").px(7, 5, "#ffd040").px(8, 5, "#ffd040");
  },
  crushWalls: (g) => {
    seal(g, "#9aa3b8");
    g.rect(2, 3, 3, 10, "#7a7a8a").rect(11, 3, 3, 10, "#7a7a8a").line(6, 8, 9, 8, WH);
  },
  pitTrap: (g) => {
    seal(g, "#8a6a4a");
    g.rect(4, 4, 8, 8, "#1a1018").rect(5, 5, 6, 1, "#4a3a2a");
  },
  swordRain: (g) => {
    seal(g, "#c8d0e0");
    for (const x of [4, 8, 12]) g.line(x, 2, x, 9, "#e8ecf4").px(x - 1, 3, GOLD).px(x + 1, 3, GOLD);
  },
  thunderSeal: (g) => {
    seal(g, "#e8d040");
    g.line(9, 2, 7, 7, GOLD).line(7, 7, 10, 7, GOLD).line(10, 7, 7, 13, GOLD);
  },
  frostSquare: (g) => {
    seal(g, "#8ad8ff");
    g.line(8, 3, 8, 12, WH).line(3, 8, 12, 8, WH).line(5, 5, 11, 11, "#c8f0ff").line(11, 5, 5, 11, "#c8f0ff");
  },
  windCage: (g) => {
    seal(g, "#a8e8c8");
    g.ring(8, 8, 4, "#a8e8ff").ring(8, 8, 2, "#e8f8ff").px(8, 8, WH);
  },
  stoneFist: (g) => {
    seal(g, "#8a8478");
    g.rect(5, 4, 6, 6, "#a8a090").rect(5, 10, 6, 3, "#8a8478").px(6, 5, "#c8c0b0").px(8, 5, "#c8c0b0");
  },
  heavenPalace: (g) => {
    seal(g, GOLD);
    for (const [x, y] of [[3, 3], [12, 3], [3, 12], [12, 12]]) g.rect(x! - 1, y! - 1, 2, 2, "#fff4c0");
    g.disc(8, 8, 2, "#fff4c0").px(8, 8, WH);
  },
};

export const ELDER_PASSIVE_ART = {
  elSage: (g: Pen) => g.disc(8, 6, 4, "#c8b070").rect(6, 10, 4, 4, "#c8b070").px(7, 5, "#3a3446").px(9, 5, "#3a3446").ring(8, 6, 6, GOLD),
  elExpand: (g: Pen) => {
    seal(g, "#5ac84a");
    g.line(4, 8, 1, 8, WH).line(12, 8, 15, 8, WH).line(8, 4, 8, 1, WH).line(8, 12, 8, 15, WH);
  },
  elMore: (g: Pen) => {
    g.rect(1, 1, 9, 9, "#2a8a3a").rect(2, 2, 7, 7, "#3a3446");
    g.rect(6, 6, 9, 9, "#5ac84a").rect(7, 7, 7, 7, "#3a3446");
  },
  elLinger: (g: Pen) => {
    seal(g, "#8a6a4a");
    g.ring(8, 8, 4, GOLD).line(8, 8, 8, 5, GOLD).line(8, 8, 10, 8, GOLD);
  },
  elDouble: (g: Pen) => g.rect(1, 3, 6, 6, "#5ac84a").rect(2, 4, 4, 4, "#3a3446").rect(9, 7, 6, 6, "#5ac84a").rect(10, 8, 4, 4, "#3a3446"),
  elStaff: (g: Pen) => g.line(4, 14, 11, 3, WOOD).line(5, 14, 12, 3, "#6a4a2a").disc(12, 3, 2, "#5ac84a"),
  elTea: (g: Pen) => g.rect(3, 7, 8, 6, "#e8e0c8").rect(11, 8, 2, 3, "#e8e0c8").rect(4, 8, 6, 2, "#6a9a3a").line(5, 2, 6, 5, "#e8f0f4").line(8, 1, 8, 5, "#e8f0f4"),
  elBeard: (g: Pen) => g.disc(8, 5, 4, "#e8b890").rect(4, 7, 8, 6, "#f4f4f0").rect(5, 13, 6, 2, "#f4f4f0").px(6, 4, "#3a3446").px(10, 4, "#3a3446"),
  elWard: (g: Pen) => {
    seal(g, "#8ac8ff");
    g.rect(6, 5, 4, 6, "#c8b070").px(7, 4, "#e8b890").px(8, 4, "#e8b890");
  },
  elMaster: (g: Pen) => {
    seal(g, GOLD);
    g.px(8, 4, GOLD).rect(6, 6, 5, 1, GOLD).px(8, 5, GOLD).px(8, 7, GOLD).px(7, 8, GOLD).px(9, 8, GOLD).rect(5, 11, 6, 1, "#ff8a3a");
  },
};
