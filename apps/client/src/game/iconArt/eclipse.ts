// 헬리오스 이클립스 아이콘: 태양의 도끼 무기 1 · 전용 아이템 10 (금빛 태양 · 붉은 속 노란 겉 직각 검격 · 검보라 일식 · 분홍 보라 테)
import { type Pen } from "./pen";

const GOLD = "#ffd040";
const GOLD2 = "#c88a20";
const RED = "#e8401a";
const SUN = "#fff0a0";
const VOID = "#1a0828";
const VIO = "#6a20a8";
const PINK = "#e070ff";
const SHAFT = "#8a5a2a";

/** 태양 (가운데 cx·cy, 반지름 r, 바깥 햇살) */
function sun(g: Pen, cx: number, cy: number, r: number): void {
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    g.line(cx, cy, cx + Math.round(Math.cos(a) * (r + 2)), cy + Math.round(Math.sin(a) * (r + 2)), k % 2 ? GOLD2 : GOLD);
  }
  g.disc(cx, cy, r, RED).disc(cx, cy, r - 1, GOLD).px(cx - 1, cy - 1, SUN);
}

/** 일식 (검은 원 · 분홍 보라 테) */
function eclipse(g: Pen, cx: number, cy: number, r: number): void {
  g.disc(cx, cy, r + 1, PINK).disc(cx, cy, r, VIO).disc(cx, cy, r - 1, VOID).px(cx + r, cy - r + 1, "#ffffff");
}

/** 직각 검격 (꼭짓점 x·y, 길이 n, 붉은 속 · 노란 겉) */
function chevron(g: Pen, x: number, y: number, n: number): void {
  g.line(x, y, x - n, y - n, GOLD).line(x, y, x - n, y + n, GOLD);
  g.line(x - 1, y, x - n, y - n + 1, RED).line(x - 1, y, x - n, y + n - 1, RED);
}

/** 도끼 (자루 비스듬히 · 초승달 날) */
function axe(g: Pen, big: boolean): void {
  g.line(3, 14, 12, 3, SHAFT);
  const c = big ? PINK : GOLD;
  const d = big ? VIO : RED;
  g.line(10, 1, 15, 4, c).line(15, 4, 15, 8, c).line(15, 8, 12, 9, c).line(11, 2, 14, 5, d).line(14, 5, 13, 8, d);
  g.px(12, 4, big ? VOID : SUN);
}

export const EC_WEAPON_ART = {
  ecAxe: (g: Pen) => {
    axe(g, false);
    g.px(2, 2, GOLD).px(1, 4, RED);
  },
};

export const EC_PASSIVE_ART = {
  ecDawn: (g: Pen) => {
    sun(g, 8, 10, 3);
    g.rect(7, 2, 2, 4, "#9affb0").rect(5, 3, 6, 2, "#9affb0").px(8, 3, "#ffffff");
  },
  ecCorona: (g: Pen) => {
    g.ring(8, 8, 7, GOLD2).ring(8, 8, 6, RED);
    sun(g, 8, 8, 3);
  },
  ecFlare: (g: Pen) => {
    chevron(g, 14, 8, 5);
    chevron(g, 9, 4, 3);
    chevron(g, 9, 12, 3);
  },
  ecSunspot: (g: Pen) => {
    sun(g, 8, 8, 5);
    g.disc(9, 9, 1, "#3a1a0a").px(6, 7, "#3a1a0a");
  },
  ecUmbra: (g: Pen) => {
    g.disc(8, 8, 7, "#3a1060");
    eclipse(g, 8, 8, 4);
  },
  ecHorizon: (g: Pen) => {
    g.ring(8, 8, 7, VIO).ring(8, 8, 5, PINK);
    g.disc(8, 8, 3, VOID).line(1, 10, 15, 6, PINK).px(8, 8, "#000000");
  },
  ecTotality: (g: Pen) => {
    sun(g, 8, 8, 5);
    g.disc(9, 7, 4, VOID).px(12, 4, "#ffffff");
  },
  ecTwilight: (g: Pen) => {
    g.rect(0, 9, 16, 7, "#3a1a4a").rect(0, 9, 16, 1, PINK);
    g.disc(8, 9, 4, RED).rect(3, 10, 10, 4, "#3a1a4a").px(8, 6, SUN);
  },
  ecCrown: (g: Pen) => {
    g.rect(3, 9, 10, 4, GOLD).px(3, 6, GOLD).px(3, 7, GOLD).px(3, 8, GOLD).px(8, 5, GOLD).px(8, 6, GOLD).px(8, 7, GOLD).px(8, 8, GOLD).px(12, 6, GOLD).px(12, 7, GOLD).px(12, 8, GOLD);
    g.px(5, 10, RED).px(8, 10, VIO).px(11, 10, RED).rect(3, 12, 10, 1, GOLD2);
  },
  ecMoonAxe: (g: Pen) => {
    axe(g, true);
    g.px(2, 3, PINK).px(4, 1, VIO);
  },
};
