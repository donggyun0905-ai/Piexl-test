// 성국 베아트리스 아이콘: 사멸·절멸의 쌍검 (백은 칼날 두 자루가 X자, 붉은 성석) · 전용 아이템 20 (악·처단 5 · 화염 5 · 재생 5 · 스킬 5)
import type { Pen } from "./pen";

const SUN = "#ff3a1a";
const FLAME = "#ff8a2a";
const GOLD = "#f2c14e";
const SILVER = "#eef2f8";
const STEEL = "#aab4c8";
const RED = "#c81a2a";
const DARK = "#3a1018";
const WHITE = "#fffbe8";

/** X자로 엇갈린 쌍검 (c 칼날 색) */
function twin(g: Pen, c = SILVER): void {
  g.line(2, 2, 12, 12, c).line(3, 2, 13, 12, STEEL).line(13, 2, 3, 12, c).line(12, 2, 2, 12, STEEL);
  g.line(11, 14, 14, 11, GOLD).line(1, 11, 4, 14, GOLD).px(14, 14, SUN).px(1, 14, SUN);
}
/** 붉은 X자 (가운데 cx, cy · 반지름 r) */
function cross(g: Pen, cx: number, cy: number, r: number, c = SUN): void {
  g.line(cx - r, cy - r, cx + r, cy + r, c).line(cx + r, cy - r, cx - r, cy + r, c).px(cx, cy, WHITE);
}
/** 불꽃 (아래 가운데 x, y) */
function flame(g: Pen, x: number, y: number, c = FLAME): void {
  g.disc(x, y - 2, 3, c).disc(x, y - 4, 2, SUN).px(x, y - 7, GOLD).px(x, y - 2, WHITE);
}
/** 태양 (가운데) */
function sun(g: Pen, cx: number, cy: number, r: number): void {
  g.disc(cx, cy, r, SUN).disc(cx, cy, r - 1, FLAME).px(cx, cy, WHITE);
  g.px(cx, cy - r - 2, GOLD).px(cx, cy + r + 2, GOLD).px(cx - r - 2, cy, GOLD).px(cx + r + 2, cy, GOLD);
}
/** 방패 */
function shield(g: Pen, c = SILVER): void {
  g.rect(4, 3, 9, 7, c).line(4, 10, 8, 14, c).line(12, 10, 8, 14, c).line(5, 4, 11, 4, GOLD).line(8, 5, 8, 12, GOLD);
}

export const BT_WEAPON_ART = {
  btTwin: (g: Pen) => twin(g),
};

export const BT_PASSIVE_ART = {
  btGrudge: (g: Pen) => {
    cross(g, 8, 8, 5, DARK);
    g.ring(8, 8, 6, RED);
  },
  btSin: (g: Pen) => {
    g.rect(4, 8, 9, 6, DARK).line(4, 8, 12, 8, RED).px(8, 11, SUN);
    g.line(8, 2, 8, 7, STEEL).px(8, 1, GOLD);
  },
  btExecutor: (g: Pen) => {
    twin(g, SUN);
    g.px(8, 7, WHITE);
  },
  btVerdict: (g: Pen) => {
    g.rect(0, 0, 16, 16, "#2a0a10");
    cross(g, 8, 8, 7);
    cross(g, 8, 8, 3, GOLD);
  },
  btWitness: (g: Pen) => {
    g.disc(8, 8, 5, SILVER).disc(8, 8, 3, RED).disc(8, 8, 1, DARK);
    g.px(2, 3, SUN).px(14, 3, SUN).px(2, 13, SUN).px(14, 13, SUN);
  },
  btEmber: (g: Pen) => {
    flame(g, 5, 14);
    flame(g, 11, 12, SUN);
  },
  btCore: (g: Pen) => sun(g, 8, 8, 4),
  btScorch: (g: Pen) => {
    flame(g, 8, 15);
    g.line(2, 3, 5, 6, FLAME).line(14, 3, 11, 6, FLAME);
  },
  btFlare: (g: Pen) => {
    g.ring(8, 8, 6, FLAME).ring(8, 8, 3, SUN).px(8, 8, WHITE);
    g.px(8, 0, GOLD).px(8, 15, GOLD).px(0, 8, GOLD).px(15, 8, GOLD);
  },
  btBrand: (g: Pen) => {
    g.line(1, 14, 14, 1, SUN).line(2, 14, 14, 2, FLAME).line(1, 13, 13, 1, FLAME);
    g.px(14, 1, WHITE).px(6, 9, GOLD);
  },
  btUndying: (g: Pen) => {
    flame(g, 8, 15, SUN);
    g.line(3, 5, 3, 10, "#5ae05a").line(1, 7, 5, 7, "#5ae05a");
  },
  btVow: (g: Pen) => {
    shield(g);
    g.px(8, 8, SUN);
  },
  btOath: (g: Pen) => {
    g.disc(8, 9, 4, RED).line(8, 2, 8, 6, SILVER).px(8, 1, GOLD).px(7, 9, "#ff7a8a");
  },
  btGrace: (g: Pen) => {
    g.ring(8, 4, 3, GOLD).disc(8, 11, 3, WHITE).line(5, 11, 11, 11, GOLD);
  },
  btSilver: (g: Pen) => {
    shield(g, STEEL);
    g.rect(6, 5, 5, 3, SILVER);
  },
  btNoon: (g: Pen) => {
    sun(g, 8, 6, 3);
    g.line(1, 14, 14, 14, SILVER).line(3, 12, 12, 12, STEEL);
  },
  btTotality: (g: Pen) => {
    g.disc(8, 8, 6, SUN).disc(8, 8, 5, DARK).ring(8, 8, 6, GOLD);
    g.line(1, 15, 6, 10, SILVER);
  },
  btSwift: (g: Pen) => {
    g.line(2, 5, 13, 5, FLAME).line(1, 8, 14, 8, SUN).line(2, 11, 13, 11, FLAME).px(15, 8, WHITE);
  },
  btMercy: (g: Pen) => {
    g.disc(5, 7, 3, SUN).disc(11, 7, 3, SUN).line(3, 9, 8, 14, SUN).line(13, 9, 8, 14, SUN).disc(8, 10, 3, SUN);
    g.px(6, 6, WHITE);
  },
  btBreaker: (g: Pen) => {
    g.rect(1, 9, 14, 6, STEEL).line(1, 9, 14, 9, SILVER).line(5, 9, 5, 14, DARK).line(10, 9, 10, 14, DARK);
    cross(g, 8, 6, 4);
  },
};
