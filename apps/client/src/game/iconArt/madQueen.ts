// 탈라시아 매드퀸 아이콘: 함대 무기 4 (미래형 대포 · 빛깔마다 빛나는 줄·포구) · 전용 아이템 10 (대포 3 · 폭발 · 터렛 2 · 날개 2 · 일제사격 · 자유)
import type { Pen } from "./pen";

const STEEL = "#c8d0dc";
const DARK = "#4a5262";
const EDGE = "#2a303c";
const FOAM = "#f2feff";
const CYAN = "#5af0ff";
const RED = "#ff4a5a";
const GOLD = "#ffe04a";
const GREEN = "#5aff7a";
const SEA = "#1ab8e8";

/** 미래형 대포 (오른쪽을 봄): 몸통 · 포신 · 빛나는 줄 · 둥근 빛 코어 (x,y 왼쪽 위) */
function cannon(g: Pen, c: string, x = 1, y = 5): void {
  g.rect(x, y, 9, 5, STEEL).rect(x + 1, y + 5, 7, 1, DARK).line(x, y, x + 8, y, FOAM);
  g.rect(x + 9, y + 1, 5, 3, DARK).rect(x + 9, y + 1, 5, 1, STEEL).px(x + 14, y + 2, c).px(x + 14, y + 1, EDGE).px(x + 14, y + 3, EDGE);
  g.line(x + 2, y + 2, x + 6, y + 2, c);
  g.disc(x + 2, y + 3, 1, c).px(x + 2, y + 3, FOAM);
  g.px(x + 4, y + 6, DARK).px(x + 3, y + 7, DARK).px(x + 6, y + 6, DARK).px(x + 7, y + 7, DARK);
}

/** 작은 대포 (머리 위 대포 아이템) */
function mini(g: Pen, x: number, y: number, c = CYAN): void {
  g.rect(x, y, 5, 3, STEEL).rect(x + 5, y + 1, 2, 1, DARK).px(x + 1, y + 1, c).px(x + 2, y + 1, c);
}

/** 네온 터렛 (가운데 x, 바닥 y) */
function turret(g: Pen, x: number, y: number, c = CYAN): void {
  g.rect(x - 4, y - 2, 9, 2, DARK).rect(x - 3, y - 3, 7, 1, STEEL).line(x - 3, y - 1, x + 3, y - 1, c);
  g.rect(x - 1, y - 6, 4, 3, STEEL).rect(x - 5, y - 6, 4, 2, DARK).px(x - 5, y - 6, c).px(x - 5, y - 5, c).px(x + 1, y - 5, c);
}

/** 날개 무기 (한쪽, side -1 왼쪽 · 1 오른쪽, 가운데 x,y) */
function wing(g: Pen, x: number, y: number, side: number, c = CYAN): void {
  for (let i = 0; i < 3; i++) g.line(x, y + i, x + side * (5 - i), y - 3 + i * 3, i === 1 ? c : STEEL);
  g.px(x, y, DARK).px(x, y + 1, DARK);
}

/** 폭발 (가운데 x,y · 반지름 r) */
function blast(g: Pen, x: number, y: number, r: number, c: string): void {
  g.disc(x, y, r, c).disc(x, y, Math.max(0, r - 2), FOAM);
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) g.px(x + dx * (r + 2), y + dy * (r + 2), c);
}

export const MQ_WEAPON_ART = {
  mqTide: (g: Pen) => {
    cannon(g, CYAN);
    g.line(0, 13, 4, 12, SEA).line(5, 12, 9, 13, SEA).line(10, 13, 15, 12, SEA);
  },
  mqCrimson: (g: Pen) => {
    cannon(g, RED);
    g.px(15, 5, RED).px(14, 4, "#ffa040").px(15, 9, RED);
  },
  mqBeacon: (g: Pen) => {
    cannon(g, GOLD);
    g.line(13, 0, 11, 3, GOLD).line(11, 3, 14, 3, GOLD).line(14, 3, 12, 6, FOAM);
  },
  mqCoral: (g: Pen) => {
    cannon(g, GREEN);
    g.px(2, 14, "#ff7a9a").px(2, 13, "#ff7a9a").px(1, 12, "#ff7a9a").px(3, 12, "#ff7a9a").px(13, 13, GREEN).px(14, 12, GREEN);
  },
};

export const MQ_PASSIVE_ART = {
  mqTwin: (g: Pen) => {
    mini(g, 2, 4);
    mini(g, 8, 4);
    g.line(4, 10, 11, 10, CYAN).px(7, 11, FOAM).px(7, 9, FOAM);
  },
  mqBroadside: (g: Pen) => {
    mini(g, 1, 3);
    mini(g, 1, 8);
    mini(g, 8, 6);
    g.line(0, 13, 15, 13, SEA);
  },
  mqFlagship: (g: Pen) => {
    g.line(3, 11, 12, 11, DARK).line(4, 12, 11, 12, DARK).rect(6, 7, 4, 4, STEEL).line(8, 1, 8, 7, DARK);
    g.rect(9, 2, 4, 2, CYAN).px(9, 4, CYAN).px(5, 9, "#ffd040").px(10, 9, "#ffd040");
    g.line(0, 14, 15, 14, SEA);
  },
  mqWarhead: (g: Pen) => blast(g, 8, 8, 4, "#ff9a3a"),
  mqRig: (g: Pen) => {
    turret(g, 8, 14);
    g.line(8, 0, 8, 5, CYAN).px(7, 4, CYAN).px(9, 4, CYAN);
  },
  mqOverclock: (g: Pen) => {
    turret(g, 7, 14, GOLD);
    g.line(13, 1, 11, 5, GOLD).line(11, 5, 14, 5, GOLD).line(14, 5, 12, 9, FOAM);
  },
  mqSquadron: (g: Pen) => {
    wing(g, 6, 6, -1);
    wing(g, 9, 6, 1);
    wing(g, 6, 11, -1, GREEN);
    wing(g, 9, 11, 1, GREEN);
  },
  mqPrism: (g: Pen) => {
    g.line(8, 2, 3, 12, FOAM).line(3, 12, 13, 12, FOAM).line(13, 12, 8, 2, FOAM);
    g.line(0, 7, 6, 7, STEEL).line(10, 6, 15, 3, RED).line(10, 7, 15, 7, GOLD).line(10, 8, 15, 11, CYAN);
  },
  mqBarrage: (g: Pen) => {
    for (const [x, y] of [[3, 2], [8, 4], [12, 1]] as const) g.line(x, y, x, y + 4, FOAM).px(x, y + 5, RED);
    blast(g, 5, 12, 2, "#ff9a3a");
    blast(g, 11, 12, 2, CYAN);
  },
  mqFreedom: (g: Pen) => {
    g.line(4, 2, 4, 13, DARK).rect(5, 2, 8, 6, FOAM).line(5, 5, 12, 5, CYAN).px(12, 3, CYAN);
    g.line(0, 14, 15, 14, SEA).line(0, 13, 3, 13, SEA).line(9, 13, 15, 13, SEA);
  },
};
