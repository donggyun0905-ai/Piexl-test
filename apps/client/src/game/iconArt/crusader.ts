// 새벽의 성흔 크루세이더 아이콘: 성십자가 (흰 돌 · 금테 · 붉은 무늬) · 전용 아이템 20 (성십자가 5 · 속죄의 무게 5 · 성벽 돌진 5 · 성십자가 강림 5)
import type { Pen } from "./pen";

const STONE = "#f4ecdc";
const SHADE = "#b8ac98";
const GOLD = "#e8b44a";
const RED = "#c8283a";
const DIRT = "#7a5a3a";
const LIGHT = "#fff6c8";
const WHITE = "#ffffff";

/** 십자가 (가로대 가운데 cx, 위끝 y, 세로 길이 h, 가로 반폭 w, 굵기 2) · 금테 · 가운데 붉은 점 */
function cross(g: Pen, cx: number, y: number, h: number, w: number): void {
  const by = y + Math.round(h * 0.3);
  g.rect(cx - 1, y, 3, h, GOLD).rect(cx - w, by - 1, w * 2 + 1, 3, GOLD);
  g.line(cx, y + 1, cx, y + h - 2, STONE).line(cx - w + 1, by, cx + w - 1, by, STONE);
  g.px(cx, by, RED).px(cx + 1, y + h - 1, SHADE);
}
/** 갈라진 땅 (아래 한 줄 + 위로 솟은 금) */
function ground(g: Pen, cx: number): void {
  g.line(0, 14, 15, 14, DIRT).line(cx, 13, cx - 2, 15, DIRT).line(cx - 4, 12, cx - 6, 13, SHADE).line(cx + 3, 12, cx + 5, 13, SHADE);
}
/** 무게 추 (아래 넓은 사다리꼴) */
const weight = (g: Pen, x: number, y: number) => g.rect(x + 1, y, 4, 1, SHADE).rect(x, y + 1, 6, 3, SHADE).px(x + 2, y + 2, WHITE);
/** 가시 고리 */
function thornRing(g: Pen, cx: number, cy: number, r: number): void {
  g.ring(cx, cy, r, GOLD).px(cx, cy - r - 1, GOLD).px(cx + r + 1, cy, GOLD).px(cx - r - 1, cy, GOLD).px(cx, cy + r + 1, GOLD);
}
/** 앞으로 미는 화살 줄 (돌진) */
const rush = (g: Pen, y: number) => g.line(0, y, 3, y, LIGHT).line(0, y + 3, 2, y + 3, LIGHT);

export const CR_WEAPON_ART = {
  crCross: (g: Pen) => cross(g, 7, 1, 14, 5),
};

export const CR_PASSIVE_ART = {
  crHeavy: (g: Pen) => {
    cross(g, 7, 0, 12, 5);
    weight(g, 5, 12);
  },
  crLong: (g: Pen) => {
    g.line(1, 9, 14, 9, DIRT).line(7, 2, 7, 15, DIRT).px(7, 9, GOLD);
    for (const [x, y] of [[2, 9], [12, 9], [7, 3], [7, 14]] as const) g.rect(x - 1, y - 1, 2, 2, STONE);
  },
  crQuick: (g: Pen) => {
    cross(g, 9, 1, 11, 4);
    g.line(1, 12, 4, 9, LIGHT).line(1, 15, 6, 10, LIGHT);
  },
  crAfter: (g: Pen) => {
    ground(g, 8);
    g.ring(8, 10, 3, GOLD).ring(8, 10, 6, SHADE);
  },
  crPillar: (g: Pen) => {
    ground(g, 8);
    g.rect(2, 6, 3, 8, STONE).rect(11, 4, 3, 10, STONE).rect(6, 8, 4, 6, SHADE).px(3, 6, GOLD).px(12, 4, GOLD);
  },
  crBrace: (g: Pen) => {
    cross(g, 8, 0, 9, 4);
    g.rect(4, 10, 8, 5, SHADE).rect(5, 11, 6, 3, STONE).px(8, 12, RED);
  },
  crPenance: (g: Pen) => {
    weight(g, 5, 9);
    g.line(8, 1, 8, 8, GOLD).px(7, 3, GOLD).px(9, 3, GOLD).px(3, 3, RED).px(13, 5, RED);
  },
  crVerdict: (g: Pen) => {
    cross(g, 8, 0, 11, 4);
    g.line(2, 13, 14, 13, GOLD).line(3, 14, 13, 14, LIGHT).px(1, 12, LIGHT).px(15, 12, LIGHT);
  },
  crThorn: (g: Pen) => {
    thornRing(g, 8, 8, 5);
    g.px(8, 8, RED).px(7, 8, RED).px(8, 7, RED);
  },
  crHalo: (g: Pen) => {
    thornRing(g, 7, 7, 4);
    g.line(12, 11, 15, 14, LIGHT).line(11, 13, 13, 15, LIGHT);
  },
  crRamPow: (g: Pen) => {
    rush(g, 5);
    g.rect(5, 6, 9, 3, GOLD).line(6, 7, 13, 7, STONE).rect(12, 3, 3, 9, GOLD).line(13, 4, 13, 10, STONE);
  },
  crRamWide: (g: Pen) => {
    rush(g, 6);
    g.rect(8, 1, 5, 14, GOLD).rect(9, 2, 3, 12, STONE).px(10, 7, RED);
  },
  crRamWall: (g: Pen) => {
    g.rect(12, 0, 4, 16, DIRT).line(12, 4, 15, 4, SHADE).line(12, 10, 15, 10, SHADE);
    g.disc(8, 8, 2, RED).px(10, 5, LIGHT).px(10, 11, LIGHT).px(11, 8, LIGHT);
    rush(g, 6);
  },
  crRamGain: (g: Pen) => {
    rush(g, 3);
    weight(g, 7, 9);
    g.line(9, 2, 9, 7, GOLD).line(7, 5, 11, 5, GOLD);
  },
  crRamSlam: (g: Pen) => {
    rush(g, 2);
    ground(g, 10);
    g.line(6, 11, 14, 11, GOLD).line(10, 8, 10, 13, GOLD);
  },
  crSense: (g: Pen) => {
    cross(g, 8, 2, 11, 4);
    g.px(2, 2, LIGHT).px(13, 1, LIGHT).px(1, 9, GOLD).px(14, 10, GOLD);
  },
  crEndless: (g: Pen) => {
    cross(g, 8, 0, 10, 4);
    g.ring(8, 12, 3, GOLD).px(8, 12, LIGHT);
  },
  crGiant: (g: Pen) => {
    g.rect(4, 4, 8, 9, SHADE).rect(5, 1, 6, 4, STONE).rect(6, 2, 4, 1, RED).rect(3, 13, 4, 3, STONE).rect(9, 13, 4, 3, STONE);
    g.line(0, 15, 15, 15, DIRT);
  },
  crRain: (g: Pen) => {
    cross(g, 4, 0, 7, 2);
    cross(g, 11, 4, 7, 2);
    cross(g, 6, 9, 7, 2);
  },
  crGrave: (g: Pen) => {
    cross(g, 8, 0, 13, 4);
    g.line(1, 14, 15, 14, DIRT).px(2, 11, LIGHT).px(14, 10, LIGHT).px(4, 8, GOLD).px(12, 7, GOLD);
  },
};
