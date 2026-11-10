// 새벽의 성흔 인시전 아이콘: 도살자의 쌍도끼 (붉은 날 · 흰 별 문양 · 검은 자루) · 전용 아이템 20 (쌍도끼 5 · 도륙 콤보 5 · 도살 도약 5 · 돌진·광란 5)
import type { Pen } from "./pen";

const RED = "#e8303a";
const DEEP = "#8a1020";
const STEEL = "#e8e0e4";
const WHITE = "#ffffff";
const HAFT = "#3a2a30";
const HOT = "#ffb0a0";

/** 도끼 하나: 자루 (x0,y0 → x1,y1 위끝) · 위끝에 붉은 날 (side 1 = 오른쪽으로 · -1 = 왼쪽으로) */
function axe(g: Pen, x0: number, y0: number, x1: number, y1: number, side = 1): void {
  g.line(x0, y0, x1, y1, HAFT);
  const bx = x1 + side;
  g.rect(Math.min(bx, bx + side * 3), y1 - 1, 4, 5, RED).line(bx + side * 3, y1 - 2, bx + side * 3, y1 + 4, STEEL).px(bx + side, y1 + 1, WHITE).px(bx + side * 2, y1 + 3, DEEP);
}
/** 쌍도끼 X자 */
function twin(g: Pen): void {
  axe(g, 2, 14, 10, 4, 1);
  axe(g, 13, 14, 5, 4, -1);
}
/** 초승달 칼자국 (붉은, 오른쪽이 볼록) */
function arc(g: Pen, x: number, y: number, c = RED): void {
  g.line(x, y, x + 3, y + 3, c).line(x + 3, y + 3, x + 3, y + 7, c).line(x + 3, y + 7, x, y + 10, c).px(x + 2, y + 3, WHITE);
}
/** 핏방울 */
const drop = (g: Pen, x: number, y: number) => g.px(x, y, RED).rect(x - 1, y + 1, 3, 2, RED).px(x, y + 1, HOT);
/** 숫자 대신 콤보 막대 (n칸) */
const bars = (g: Pen, n: number) => {
  for (let i = 0; i < n; i++) g.rect(1 + i * 3, 13 - i, 2, 2 + i, i === n - 1 ? WHITE : RED);
};

export const IC_WEAPON_ART = {
  icAxes: (g: Pen) => twin(g),
};

export const IC_PASSIVE_ART = {
  icHeavy: (g: Pen) => {
    axe(g, 3, 15, 9, 5, 1);
    g.rect(10, 2, 5, 8, RED).line(14, 1, 14, 10, STEEL).px(11, 5, WHITE);
  },
  icWide: (g: Pen) => {
    axe(g, 6, 15, 8, 7, 1);
    g.line(1, 6, 4, 2, RED).line(4, 2, 11, 1, RED).line(11, 1, 15, 4, RED);
  },
  icSwift: (g: Pen) => {
    axe(g, 5, 14, 11, 5, 1);
    g.line(0, 5, 3, 5, RED).line(0, 8, 3, 8, RED).line(1, 11, 3, 11, RED);
    drop(g, 3, 12);
  },
  icThrow: (g: Pen) => {
    axe(g, 1, 15, 4, 9, 1);
    arc(g, 9, 1);
    arc(g, 12, 4, DEEP);
  },
  icVortex: (g: Pen) => {
    g.ring(8, 8, 6, RED).ring(8, 8, 3, DEEP).px(8, 2, WHITE).px(14, 8, WHITE).px(2, 8, HOT).px(8, 14, HOT);
  },
  icKeep: (g: Pen) => {
    bars(g, 4);
    g.line(1, 3, 13, 3, HOT).px(14, 3, WHITE);
  },
  icIron: (g: Pen) => {
    bars(g, 3);
    g.rect(10, 2, 5, 6, STEEL).rect(11, 3, 3, 4, "#9aa3b8").px(12, 8, STEEL);
  },
  icRampage: (g: Pen) => {
    bars(g, 5);
    g.px(14, 1, WHITE).px(13, 2, RED).px(15, 2, RED);
  },
  icDrink: (g: Pen) => {
    drop(g, 8, 2);
    g.rect(4, 8, 9, 6, DEEP).rect(5, 9, 7, 4, RED).px(6, 10, HOT).rect(7, 6, 3, 2, STEEL);
  },
  icBurst: (g: Pen) => {
    g.disc(8, 8, 3, RED).px(8, 8, WHITE);
    for (const [dx, dy] of [[0, -6], [6, 0], [0, 6], [-6, 0], [4, -4], [4, 4], [-4, 4], [-4, -4]]) g.px(8 + dx!, 8 + dy!, dx! && dy! ? HOT : RED);
  },
  icLeapOften: (g: Pen) => {
    g.line(2, 14, 7, 3, HOT).line(7, 3, 12, 12, RED).px(7, 2, WHITE);
    g.rect(10, 12, 5, 2, DEEP);
  },
  icLeapBig: (g: Pen) => {
    g.ring(8, 11, 6, RED).ring(8, 11, 3, DEEP).line(8, 1, 8, 9, HOT).px(8, 10, WHITE);
  },
  icLeapPow: (g: Pen) => {
    axe(g, 8, 1, 8, 8, 1);
    g.rect(2, 13, 12, 2, DEEP).line(4, 12, 1, 9, RED).line(12, 12, 15, 9, RED);
  },
  icQuake: (g: Pen) => {
    g.rect(1, 11, 14, 4, DEEP).line(8, 11, 5, 15, RED).line(8, 11, 12, 14, RED).line(8, 11, 8, 6, HOT).px(8, 5, WHITE);
  },
  icDouble: (g: Pen) => {
    g.line(1, 13, 5, 4, HOT).line(5, 4, 8, 12, RED).line(8, 12, 11, 4, HOT).line(11, 4, 15, 13, RED).px(5, 3, WHITE).px(11, 3, WHITE);
  },
  icRushPow: (g: Pen) => {
    axe(g, 7, 14, 12, 5, 1);
    g.line(0, 7, 5, 7, RED).line(0, 10, 5, 10, HOT).line(1, 13, 4, 13, RED);
  },
  icTrail: (g: Pen) => {
    g.line(1, 12, 14, 4, RED).line(1, 13, 14, 5, DEEP);
    drop(g, 4, 6);
    drop(g, 10, 10);
  },
  icSense: (g: Pen) => {
    g.disc(8, 8, 5, DEEP).line(8, 3, 8, 13, RED).line(3, 8, 13, 8, RED).px(8, 8, WHITE).px(6, 6, HOT);
  },
  icEndless: (g: Pen) => {
    g.ring(5, 8, 3, RED).ring(11, 8, 3, RED).px(8, 8, WHITE).px(5, 5, HOT).px(11, 11, HOT);
  },
  icCarnage: (g: Pen) => {
    twin(g);
    drop(g, 8, 11);
    g.px(2, 2, RED).px(14, 2, RED);
  },
};
