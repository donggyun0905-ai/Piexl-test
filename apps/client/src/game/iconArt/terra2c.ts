// 시즌 2 테라코어 아이콘 (셋째): 펑크(네온 분홍·하늘빛·크롬) 사이버 무기 10·몸에 심는 능력 10
import type { Pen } from "./pen";

const PINK = "#ff4ad8";
const CYAN = "#4af0ff";
const CHROME = "#c8d0e0";
const DARK = "#2a2438";
const WHITE = "#ffffff";

/** 네온 칼날 (시작 → 끝) */
function blade(g: Pen, x0: number, y0: number, x1: number, y1: number, c = PINK): void {
  g.line(x0, y0, x1, y1, c).line(x0 + 1, y0, x1 + 1, y1, WHITE);
}

export const TERRA2C_WEAPON_ART = {
  cyKatana: (g: Pen) => {
    blade(g, 3, 13, 13, 3);
    g.rect(1, 13, 3, 2, DARK).px(4, 12, CHROME);
  },
  cyMonowire: (g) => {
    g.rect(1, 11, 3, 3, CHROME);
    for (let x = 4; x < 16; x++) g.px(x, 11 - Math.round(Math.sin(x * 0.7) * 4), CYAN);
  },
  cySmartGun: (g) => {
    g.rect(1, 9, 7, 3, DARK).rect(2, 12, 2, 2, DARK).px(7, 9, CYAN);
    for (const [x, y] of [[10, 6], [12, 9], [14, 4]]) g.px(x!, y!, PINK).px(x! - 1, y! + 1, "#8a2a7a");
  },
  cyMantis: (g) => {
    g.rect(6, 9, 4, 5, "#e8c0a0");
    blade(g, 7, 9, 2, 2);
    blade(g, 9, 9, 14, 2);
  },
  cyShotgun: (g) => {
    g.rect(1, 8, 9, 3, DARK).rect(3, 11, 2, 3, DARK).px(9, 8, PINK);
    for (let i = -2; i <= 2; i++) g.px(12 + Math.abs(i), 9 + i * 2, CYAN);
  },
  cyRailPistol: (g) => {
    g.rect(2, 8, 6, 3, CHROME).rect(3, 11, 2, 3, DARK);
    g.line(8, 9, 15, 9, PINK).px(15, 8, WHITE);
  },
  cyHack: (g) => {
    g.rect(1, 3, 7, 5, DARK).rect(2, 4, 5, 3, CYAN);
    g.line(7, 7, 13, 12, PINK).disc(13, 12, 2, PINK).px(13, 12, WHITE);
  },
  cyGorilla: (g) => {
    g.rect(3, 5, 9, 8, CHROME).rect(4, 6, 7, 6, "#8a92a8");
    for (const x of [5, 7, 9]) g.px(x, 4, PINK);
  },
  cyEmp: (g) => {
    g.disc(7, 9, 4, DARK).px(6, 8, CYAN);
    g.ring(7, 9, 6, CYAN).px(11, 3, PINK).px(12, 2, WHITE);
  },
  cyTwinNeon: (g) => {
    blade(g, 2, 14, 10, 2, CYAN);
    blade(g, 6, 14, 14, 2, PINK);
  },
} satisfies Record<string, (g: Pen) => void>;

export const TERRA2C_PASSIVE_ART = {
  cyOptics: (g: Pen) => {
    g.disc(8, 8, 5, CHROME).disc(8, 8, 3, DARK).disc(8, 8, 1, PINK);
    g.px(11, 5, WHITE);
  },
  cyReflex: (g) => {
    for (const y of [4, 8, 12]) g.line(2, y, 13, y - 1, CYAN);
    g.px(14, 3, WHITE).px(14, 7, WHITE).px(14, 11, WHITE);
  },
  cyBoost: (g) => {
    g.ring(8, 8, 6, PINK).ring(8, 8, 3, CYAN);
    g.line(8, 8, 8, 3, WHITE).line(8, 8, 11, 8, WHITE);
  },
  cyCharge: (g) => {
    g.rect(4, 3, 8, 11, DARK).rect(6, 2, 4, 1, CHROME);
    g.rect(5, 8, 6, 5, CYAN).px(7, 6, WHITE).px(8, 5, WHITE);
  },
  cyBerserk: (g) => {
    g.rect(3, 4, 10, 8, DARK).rect(4, 5, 8, 6, "#e84a6a");
    for (const x of [4, 7, 10]) g.px(x, 3, CHROME).px(x, 12, CHROME);
  },
  cyLeech: (g) => {
    g.disc(8, 9, 4, "#d83a5a").px(8, 4, "#d83a5a").px(8, 5, "#d83a5a");
    g.line(4, 13, 12, 5, CYAN);
  },
  cySkin: (g) => {
    for (let y = 3; y < 14; y += 3) for (let x = 3; x < 14; x += 3) g.rect(x, y, 2, 2, CHROME);
    g.px(8, 8, PINK);
  },
  cyCloak: (g) => {
    g.rect(5, 3, 6, 11, "#6a6a8a").rect(6, 4, 4, 9, "#a8b0c8");
    g.px(4, 6, CYAN).px(12, 10, CYAN);
  },
  cyOverclock: (g) => {
    g.ring(8, 8, 6, CHROME).disc(8, 8, 2, PINK);
    for (const [x, y] of [[8, 1], [8, 15], [1, 8], [15, 8]]) g.px(x!, y!, CYAN);
  },
  cyEcho: (g) => {
    g.rect(2, 4, 3, 9, "#5a3a6a").rect(6, 4, 3, 9, "#8a4aa8").rect(10, 4, 3, 9, PINK);
    g.px(11, 5, WHITE);
  },
} satisfies Record<string, (g: Pen) => void>;
