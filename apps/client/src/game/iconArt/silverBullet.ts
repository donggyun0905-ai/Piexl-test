// 새벽의 성흔 실버불렛 아이콘: 은빛 쌍권총 (은빛 몸통·검은 손잡이·흰 총구) · 전용 아이템 20 (쌍권총 5 · 연사 5 · 성수 5 · 집행 5)
import type { Pen } from "./pen";

const SILVER = "#c8d0dc";
const LIGHT = "#eef2f8";
const DARK = "#2a2e38";
const GRIP = "#4a3a30";
const WHITE = "#ffffff";
const HOLY = "#8ad0ff";
const MOON = "#d8e4ff";
const GOLD = "#e8c860";

/** 권총 (총구가 오른쪽, 왼쪽 위 x,y) */
function pistol(g: Pen, x: number, y: number): void {
  g.rect(x, y, 8, 3, SILVER).rect(x, y, 8, 1, LIGHT).px(x + 8, y + 1, WHITE);
  g.rect(x + 1, y + 3, 3, 4, GRIP).px(x + 4, y + 3, DARK);
}
/** 은탄 (총알 끝이 오른쪽) */
function bullet(g: Pen, x: number, y: number, c = SILVER): void {
  g.rect(x, y, 3, 2, GOLD).rect(x + 3, y, 2, 2, c).px(x + 5, y, LIGHT).px(x + 5, y + 1, c);
}
/** 성수병 (가운데 x · 아래 y) */
function flask(g: Pen, x: number, y: number, c = HOLY): void {
  g.rect(x - 1, y - 9, 2, 2, LIGHT).rect(x - 3, y - 7, 6, 7, c).rect(x - 2, y - 6, 1, 3, WHITE).rect(x - 3, y - 7, 6, 1, LIGHT);
}
/** 흰 활 ) */
function bow(g: Pen, x: number): void {
  g.line(x, 2, x + 3, 5, WHITE).line(x + 3, 5, x + 3, 10, WHITE).line(x + 3, 10, x, 13, WHITE);
}

export const SB_WEAPON_ART = {
  sbPistols: (g: Pen) => {
    pistol(g, 1, 3);
    pistol(g, 6, 8);
    g.px(10, 4, WHITE).px(15, 9, WHITE);
  },
};

export const SB_PASSIVE_ART = {
  sbQuick: (g: Pen) => {
    pistol(g, 4, 5);
    g.line(0, 5, 3, 5, MOON).line(0, 8, 3, 8, MOON).line(1, 11, 3, 11, MOON);
  },
  sbHollow: (g: Pen) => {
    g.rect(3, 6, 6, 4, GOLD).rect(9, 6, 4, 4, SILVER).px(12, 7, DARK).px(12, 8, DARK).px(13, 7, LIGHT);
  },
  sbPierce: (g: Pen) => {
    g.rect(6, 3, 3, 10, DARK).rect(7, 4, 1, 8, SILVER);
    bullet(g, 1, 7);
    bullet(g, 10, 7, LIGHT);
  },
  sbTriple: (g: Pen) => {
    bullet(g, 3, 3);
    bullet(g, 6, 7);
    bullet(g, 3, 11);
  },
  sbBarrel: (g: Pen) => {
    g.rect(1, 6, 13, 3, SILVER).rect(1, 6, 13, 1, LIGHT).px(14, 7, WHITE);
    g.rect(2, 9, 3, 4, GRIP);
  },
  sbEngrave: (g: Pen) => {
    g.ring(8, 8, 6, SILVER).line(5, 5, 11, 11, LIGHT).line(11, 5, 5, 11, LIGHT).px(8, 8, WHITE);
  },
  sbStorm: (g: Pen) => {
    for (let i = 0; i < 4; i++) bullet(g, 1 + (i % 2) * 5, 1 + i * 4);
  },
  sbRapid: (g: Pen) => {
    bullet(g, 7, 5);
    bullet(g, 7, 9);
    g.line(1, 6, 5, 6, MOON).line(1, 10, 5, 10, MOON);
  },
  sbBurst: (g: Pen) => {
    g.ring(8, 8, 6, SILVER).ring(8, 8, 3, LIGHT).px(8, 8, WHITE);
    g.px(8, 0, LIGHT).px(0, 8, LIGHT).px(15, 8, LIGHT).px(8, 15, LIGHT);
  },
  sbPure: (g: Pen) => {
    g.rect(4, 4, 8, 8, SILVER).rect(5, 5, 6, 6, LIGHT).px(6, 6, WHITE).px(7, 6, WHITE).px(6, 7, WHITE);
  },
  sbFlask: (g: Pen) => {
    flask(g, 8, 14);
    g.ring(8, 9, 7, MOON);
  },
  sbBless: (g: Pen) => {
    flask(g, 6, 14);
    g.line(12, 2, 12, 8, GOLD).line(9, 4, 15, 4, GOLD);
  },
  sbBelt: (g: Pen) => {
    g.line(0, 4, 15, 12, GRIP).line(0, 5, 15, 13, GRIP);
    for (let i = 0; i < 4; i++) g.rect(2 + i * 3, 1 + i * 2, 2, 4, GOLD);
  },
  sbPurify: (g: Pen) => {
    flask(g, 8, 13);
    g.px(2, 3, MOON).px(13, 2, WHITE).px(14, 9, MOON).px(1, 10, WHITE);
  },
  sbSplash: (g: Pen) => {
    g.rect(2, 12, 12, 2, HOLY).px(3, 9, HOLY).px(7, 8, HOLY).px(11, 9, HOLY).px(5, 6, LIGHT).px(10, 5, LIGHT);
  },
  sbFocus: (g: Pen) => {
    g.ring(8, 8, 6, MOON).line(8, 0, 8, 4, WHITE).line(8, 12, 8, 15, WHITE).line(0, 8, 4, 8, WHITE).line(12, 8, 15, 8, WHITE).px(8, 8, WHITE);
  },
  sbEndless: (g: Pen) => {
    g.rect(4, 2, 7, 12, DARK).rect(5, 3, 5, 10, SILVER);
    for (let i = 0; i < 4; i++) g.rect(6, 4 + i * 2, 3, 1, GOLD);
  },
  sbSeek: (g: Pen) => {
    bow(g, 2);
    g.line(6, 8, 10, 5, LIGHT).line(10, 5, 13, 7, LIGHT).px(14, 8, WHITE);
  },
  sbAgile: (g: Pen) => {
    g.rect(2, 10, 5, 3, GRIP).rect(8, 7, 5, 3, GRIP);
    g.line(0, 13, 3, 13, MOON).line(6, 10, 9, 10, MOON);
    bullet(g, 9, 2);
  },
  sbLunar: (g: Pen) => {
    g.disc(8, 8, 6, MOON).disc(10, 6, 5, DARK);
    bow(g, 11);
  },
};
