// 시간술사 아이콘: 무기 10개 · 전용 아이템 10개 (시계·모래시계·톱니·잔상)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { ChronoWeapon } from "../../i18n/items/chrono";
import { D, G, K, Pen, S } from "./pen";

const BLUE = "#7ae0ff";
const DEEP = "#2a6a8a";
const SAND = "#e8c878";
const BRASS = "#c8a050";

/** 시계 얼굴 (cx, cy = 가운데, r = 반지름, 바늘 각도는 시·분 방향 [dx, dy]) */
function clock(g: Pen, cx: number, cy: number, r: number, rim = BRASS): void {
  g.disc(cx, cy, r, "#f4f0e0").ring(cx, cy, r, rim);
  g.line(cx, cy, cx, cy - r + 2, K).line(cx, cy, cx + r - 3, cy, K).px(cx, cy, "#e04a4a");
}

/** 톱니바퀴 */
function gear(g: Pen, cx: number, cy: number, r: number, c = BRASS): void {
  g.disc(cx, cy, r, c).disc(cx, cy, Math.max(1, r - 3), K);
  for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]] as const) g.px(cx + dx * (r + 1), cy + dy * (r + 1), c);
}

function hourglass(g: Pen, x: number, y: number): void {
  g.rect(x, y, 9, 1, BRASS).rect(x, y + 11, 9, 1, BRASS);
  g.line(x + 1, y + 1, x + 4, y + 5, S).line(x + 7, y + 1, x + 4, y + 5, S).line(x + 4, y + 6, x + 1, y + 10, S).line(x + 4, y + 6, x + 7, y + 10, S);
  g.rect(x + 3, y + 2, 3, 2, SAND).rect(x + 2, y + 9, 5, 2, SAND).px(x + 4, y + 7, SAND);
}

export const CHRONO_WEAPON_ART: Record<ChronoWeapon & WeaponId, (g: Pen) => void> = {
  pocketwatch: (g) => {
    clock(g, 8, 9, 6);
    g.ring(8, 2, 1, BRASS);
  },
  clockhands: (g) => {
    g.line(2, 14, 13, 3, S).line(3, 14, 13, 4, D).line(2, 14, 8, 2, BRASS).disc(2, 14, 1, K);
  },
  hourglass: (g) => hourglass(g, 3, 2),
  pendulum: (g) => {
    g.rect(2, 1, 12, 1, BRASS).line(8, 2, 11, 11, D).disc(11, 12, 3, BRASS).px(10, 11, "#fff");
    g.px(3, 10, BLUE).px(4, 12, BLUE).px(6, 13, BLUE);
  },
  timebomb: (g) => {
    g.disc(8, 10, 5, K).line(8, 5, 11, 2, BRASS).px(12, 1, "#ff9a3c");
    clock(g, 8, 10, 3, "#e04a4a");
  },
  rewinddisc: (g) => {
    g.ring(8, 8, 6, BLUE).ring(8, 8, 3, DEEP);
    g.line(4, 3, 1, 3, "#fff").px(2, 2, "#fff").px(2, 4, "#fff");
  },
  stopwatch: (g) => {
    clock(g, 8, 9, 6, S);
    g.rect(7, 1, 3, 2, S).px(13, 3, S);
  },
  gearstorm: (g) => {
    gear(g, 5, 5, 3);
    gear(g, 11, 11, 3, D);
    gear(g, 12, 3, 2);
  },
  futuresight: (g) => {
    g.disc(8, 8, 6, DEEP).disc(8, 8, 3, BLUE).disc(8, 8, 1, K);
    g.line(8, 1, 8, 0, BLUE).line(15, 8, 14, 8, BLUE).line(1, 8, 2, 8, BLUE);
  },
  paradox: (g) => {
    g.ring(5, 8, 4, BLUE).ring(11, 8, 4, "#c88aff");
    g.px(8, 8, "#fff");
  },
};

type ChronoPassive = "longEcho" | "quickEcho" | "doubleEcho" | "timeSlow" | "haste" | "warpField" | "echoBurst" | "precision" | "clockwork" | "eternity";

/** 잔상 사람 모양 (x, y = 머리 왼쪽 위) */
function ghost(g: Pen, x: number, y: number, c: string): void {
  g.rect(x, y, 3, 3, c).rect(x - 1, y + 3, 5, 5, c).px(x - 1, y + 8, c).px(x + 3, y + 8, c);
}

export const CHRONO_PASSIVE_ART: Record<ChronoPassive & PassiveId, (g: Pen) => void> = {
  longEcho: (g) => {
    ghost(g, 3, 3, DEEP);
    ghost(g, 10, 3, BLUE);
    g.line(6, 14, 10, 14, BLUE);
  },
  quickEcho: (g) => {
    ghost(g, 9, 3, BLUE);
    g.line(1, 5, 6, 5, "#fff").line(2, 8, 6, 8, "#fff").line(1, 11, 5, 11, "#fff");
  },
  doubleEcho: (g) => {
    ghost(g, 2, 3, DEEP);
    ghost(g, 7, 3, "#4a9ac0");
    ghost(g, 12, 3, BLUE);
  },
  timeSlow: (g) => {
    clock(g, 8, 8, 6, BLUE);
    g.px(2, 14, "#fff").px(4, 14, "#fff");
  },
  haste: (g) => {
    clock(g, 9, 8, 5);
    g.line(1, 5, 3, 5, BLUE).line(0, 8, 3, 8, BLUE).line(1, 11, 3, 11, BLUE);
  },
  warpField: (g) => {
    g.ring(8, 8, 7, DEEP).ring(8, 8, 4, BLUE).disc(8, 8, 1, "#fff");
  },
  echoBurst: (g) => {
    ghost(g, 6, 5, BLUE);
    g.px(2, 2, G).px(13, 2, G).px(2, 13, G).px(13, 13, G).px(8, 1, G);
  },
  precision: (g) => {
    clock(g, 8, 8, 6);
    g.px(8, 3, "#e04a4a").px(8, 4, "#e04a4a");
  },
  clockwork: (g) => {
    gear(g, 7, 9, 4);
    g.rect(11, 2, 2, 5, D).rect(13, 2, 2, 2, D);
  },
  eternity: (g) => {
    g.ring(5, 8, 3, BLUE).ring(11, 8, 3, BLUE).px(8, 8, "#fff").px(8, 3, "#e05a6a").px(7, 2, "#e05a6a").px(9, 2, "#e05a6a");
  },
};
