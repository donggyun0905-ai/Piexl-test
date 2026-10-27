// 아스칼론 잊혀진 자 아이콘: 빛(금·흰·옅은 하늘) 무기 10·전용 아이템 10
import { star, type Pen } from "./pen";

const GOLD = "#ffd860";
const PALE = "#fff6c0";
const WHITE = "#ffffff";
const SKY = "#a8e0ff";
const DEEP = "#c89a3a";

/** 빛 십자가 (가운데 cx, cy · 팔 길이 a) */
function cross(g: Pen, cx: number, cy: number, a: number, c = GOLD): void {
  g.rect(cx - 1, cy - a, 2, a * 2 + 1, c).rect(cx - a + 1, cy - 1, a * 2 - 1, 2, c).px(cx, cy, WHITE);
}

export const FG_WEAPON_ART = {
  fgGrace: (g: Pen) => {
    g.rect(3, 9, 6, 4, "#ffe9b8").rect(4, 6, 1, 3, "#ffe9b8").rect(6, 5, 1, 4, "#ffe9b8").rect(8, 6, 1, 3, "#ffe9b8");
    g.line(9, 8, 14, 3, GOLD).line(9, 10, 15, 8, PALE).px(14, 3, WHITE).px(15, 8, WHITE);
  },
  fgTathagata: (g: Pen) => {
    cross(g, 8, 8, 6);
    g.ring(8, 8, 3, PALE).px(2, 14, SKY).px(14, 14, SKY).px(8, 15, SKY);
  },
  fgSpear: (g: Pen) => {
    g.line(1, 14, 14, 1, GOLD).line(2, 14, 15, 1, PALE).rect(12, 1, 3, 3, WHITE);
  },
  fgNova: (g: Pen) => {
    g.ring(8, 8, 6, GOLD).ring(8, 8, 4, PALE).disc(8, 8, 2, WHITE);
  },
  fgRain: (g: Pen) => {
    cross(g, 4, 4, 2);
    cross(g, 11, 6, 2, PALE);
    cross(g, 6, 11, 2);
    g.line(13, 11, 13, 14, SKY);
  },
  fgWing: (g: Pen) => {
    for (let i = 0; i < 5; i++) g.line(2, 8, 13 - i, 2 + i * 3, i % 2 ? PALE : GOLD);
    g.px(2, 8, WHITE);
  },
  fgPrism: (g: Pen) => {
    g.line(4, 13, 8, 4, SKY).line(8, 4, 12, 13, SKY).line(4, 13, 12, 13, SKY);
    g.line(9, 8, 15, 4, GOLD).line(9, 9, 15, 9, "#ff8ab0").line(9, 10, 15, 14, "#8ae8ff");
  },
  fgHalo: (g: Pen) => {
    g.ring(8, 6, 5, GOLD).ring(8, 6, 4, PALE).rect(6, 10, 4, 5, "#ffe9b8");
  },
  fgJudge: (g: Pen) => {
    cross(g, 8, 7, 6, WHITE);
    g.rect(7, 1, 2, 2, GOLD).rect(3, 14, 10, 1, DEEP);
  },
  fgDawn: (g: Pen) => {
    g.line(2, 14, 13, 3, PALE).line(3, 14, 14, 3, GOLD).px(14, 2, WHITE).rect(1, 13, 3, 2, DEEP);
    g.line(5, 3, 1, 9, SKY);
  },
};

export const FG_PASSIVE_ART = {
  fgMemory: (g: Pen) => {
    g.ring(8, 8, 6, GOLD).rect(7, 3, 2, 5, PALE).rect(8, 7, 3, 2, PALE);
  },
  fgEcho: (g: Pen) => {
    g.ring(8, 8, 6, PALE).ring(8, 8, 3, GOLD);
    star(g, 8, 8, WHITE);
  },
  fgPillar: (g: Pen) => {
    g.rect(6, 1, 4, 14, PALE).rect(7, 1, 2, 14, WHITE).rect(4, 13, 8, 2, GOLD);
  },
  fgMany: (g: Pen) => {
    for (const x of [2, 7, 12]) g.rect(x, 3, 3, 12, x === 7 ? WHITE : PALE);
    g.rect(1, 14, 14, 1, GOLD);
  },
  fgBless: (g: Pen) => {
    g.rect(4, 3, 8, 7, GOLD).rect(5, 10, 6, 2, GOLD).rect(6, 12, 4, 2, GOLD).rect(5, 4, 6, 6, PALE);
    cross(g, 8, 7, 2, DEEP);
  },
  fgShine: (g: Pen) => {
    star(g, 8, 8, GOLD, true);
    g.px(2, 2, WHITE).px(13, 3, WHITE).px(3, 13, WHITE);
  },
  fgCross: (g: Pen) => {
    cross(g, 8, 8, 5, "#ff8a6a");
    g.ring(8, 8, 2, GOLD);
  },
  fgPulse: (g: Pen) => {
    g.line(1, 8, 5, 8, GOLD).line(5, 8, 7, 3, GOLD).line(7, 3, 9, 13, GOLD).line(9, 13, 11, 8, GOLD).line(11, 8, 15, 8, GOLD);
  },
  fgHeal: (g: Pen) => {
    g.rect(3, 5, 4, 4, "#ff8aa8").rect(9, 5, 4, 4, "#ff8aa8").rect(4, 8, 8, 3, "#ff8aa8").rect(6, 11, 4, 2, "#ff8aa8").px(8, 13, "#ff8aa8");
    g.ring(8, 8, 7, GOLD);
  },
  fgAfter: (g: Pen) => {
    g.disc(8, 8, 3, WHITE).ring(8, 8, 5, GOLD).ring(8, 8, 7, SKY);
  },
};
