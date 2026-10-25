// 시즌 2 헬리오스 아이콘 (셋째): 사멸 독침 10·아이템 10 (은침·비취 독·보랏빛 독가스)
import type { Pen } from "./pen";

const PIN = "#d8dce8";
const TIP = "#3ad87a";
const GAS = "#6ac87a";
const SILK = "#5a2a6a";
const GOLD = "#e8c060";
const DOOM = "#a86ad8";

/** 침 하나: (x0,y0) → (x1,y1), 끝이 독빛 */
function pin(g: Pen, x0: number, y0: number, x1: number, y1: number): void {
  g.line(x0, y0, x1, y1, PIN).px(x1, y1, TIP);
}
/** 가운데에서 부채꼴로 n개 */
function fanOf(g: Pen, n: number, len = 9): void {
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 4 + ((i - (n - 1) / 2) * 0.9) / Math.max(1, n - 1);
    pin(g, 3, 12, Math.round(3 + Math.cos(a) * len), Math.round(12 + Math.sin(a) * len));
  }
}

export const HELIOS_C_WEAPON_ART = {
  tangNeedle: (g: Pen) => fanOf(g, 3, 10),
  stormNeedles: (g) => {
    for (const [x, y] of [[2, 3], [6, 2], [10, 4], [4, 8], [9, 9], [12, 7], [3, 13], [8, 13]]) pin(g, x!, y!, x! + 3, y! + 2);
  },
  lotusNeedles: (g) => {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pin(g, 8 + Math.round(Math.cos(a) * 2), 8 + Math.round(Math.sin(a) * 2), 8 + Math.round(Math.cos(a) * 7), 8 + Math.round(Math.sin(a) * 7));
    }
    g.disc(8, 8, 1, "#e88aa8");
  },
  threadNeedle: (g) => {
    pin(g, 1, 14, 14, 1);
    g.line(1, 15, 6, 10, "#c8c0d8");
  },
  fanNeedles: (g) => fanOf(g, 7, 11),
  chainNeedles: (g) => {
    for (const y of [4, 8, 12]) pin(g, 2 + (y % 3), y, 12 + (y % 3), y);
  },
  mistNeedles: (g) => {
    g.disc(10, 10, 4, GAS).disc(12, 7, 3, "#8ad89a");
    fanOf(g, 3, 8);
  },
  soulNeedle: (g) => {
    pin(g, 3, 13, 12, 4);
    pin(g, 5, 14, 14, 5);
    g.px(10, 2, DOOM).px(13, 3, DOOM).disc(12, 12, 2, "#3a1a4a").px(12, 12, DOOM);
  },
  scorpionNeedles: (g) => {
    g.line(4, 13, 6, 8, "#8a5a2a").line(6, 8, 10, 5, "#8a5a2a").line(10, 5, 12, 6, "#8a5a2a");
    pin(g, 12, 6, 14, 9);
    fanOf(g, 2, 6);
  },
  thousandNeedles: (g) => {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      pin(g, 8 + Math.round(Math.cos(a) * 3), 8 + Math.round(Math.sin(a) * 3), 8 + Math.round(Math.cos(a) * 7), 8 + Math.round(Math.sin(a) * 7));
    }
    g.px(8, 8, GOLD).px(7, 8, "#e88aa8").px(9, 8, "#e88aa8");
  },
} satisfies Record<string, (g: Pen) => void>;

export const HELIOS_C_PASSIVE_ART = {
  smVenom: (g) => g.rect(6, 3, 4, 2, GOLD).rect(5, 5, 6, 9, "#2a6a3a").rect(6, 7, 4, 5, TIP).px(7, 8, "#c8ffd8"),
  smReaper: (g) => {
    for (let i = 0; i < 5; i++) g.disc(8 + Math.round(Math.cos(i * 1.26) * 3), 7 + Math.round(Math.sin(i * 1.26) * 3), 2, DOOM);
    g.disc(8, 7, 1, "#1a0e24").line(8, 10, 8, 15, "#3a5a3a");
  },
  smMist: (g) => g.disc(5, 9, 4, GAS).disc(10, 7, 4, "#8ad89a").disc(10, 11, 3, GAS).px(9, 6, "#d8ffe0"),
  smCloud: (g) => {
    g.ring(8, 8, 7, GAS).ring(8, 8, 4, "#8ad89a");
    g.disc(8, 8, 2, TIP);
  },
  smMore: (g) => {
    g.rect(2, 4, 12, 8, SILK).rect(2, 4, 12, 1, "#7a3a8a");
    pin(g, 4, 13, 10, 7);
    pin(g, 7, 14, 13, 8);
  },
  smPierce: (g) => {
    g.disc(6, 8, 2, "#c84a4a").disc(10, 8, 2, "#c84a4a");
    pin(g, 1, 8, 15, 8);
  },
  smSilk: (g) => g.rect(4, 3, 8, 11, SILK).rect(5, 3, 6, 1, "#7a3a8a").px(8, 5, GOLD).px(9, 6, GOLD).rect(4, 13, 8, 1, TIP),
  smKiss: (g) => g.disc(6, 8, 3, "#c83a5a").disc(10, 8, 3, "#c83a5a").line(4, 9, 12, 9, "#7a1a2a").px(13, 4, TIP),
  smTang: (g) => {
    g.rect(3, 3, 10, 10, "#e8d8b0").rect(3, 3, 10, 1, "#c8b890");
    g.line(5, 6, 11, 6, "#3a1a4a").line(8, 6, 8, 11, "#3a1a4a").line(5, 10, 11, 10, "#3a1a4a");
    g.px(12, 12, "#c83a3a");
  },
  smBloom: (g) => {
    for (let i = 0; i < 5; i++) g.disc(8 + Math.round(Math.cos(i * 1.26) * 3), 8 + Math.round(Math.sin(i * 1.26) * 3), 2, GAS);
    g.disc(8, 8, 1, GOLD);
  },
} satisfies Record<string, (g: Pen) => void>;
