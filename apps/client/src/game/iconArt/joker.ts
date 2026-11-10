// 실베르 조커 아이콘: 네온 보라·형광 연두 카드 · 무기 3 (트럼프 카드 · 사신의 낫 · 장난감 총) · 전용 아이템 15
import type { Pen } from "./pen";

const PAPER = "#f4f0ff";
const EDGE = "#c86bff";
const NEON = "#b8ff3a";
const INK = "#2a1a3a";
const RED = "#ff3a6a";
const ICE = "#8ae8ff";
const GOLD = "#ffd84a";
const DARK = "#5a3a7a";

/** 카드 한 장 (왼쪽 위 x, y · 6×9) · 가운데 스페이드 */
function card(g: Pen, x: number, y: number, mark = NEON, face = PAPER): void {
  g.rect(x, y, 6, 9, EDGE).rect(x + 1, y + 1, 4, 7, face);
  spade(g, x + 3, y + 4, mark);
}
/** 작은 스페이드 (가운데 cx, cy) */
const spade = (g: Pen, cx: number, cy: number, c: string) => g.px(cx, cy - 1, c).rect(cx - 1, cy, 3, 1, c).px(cx, cy + 1, c);
/** 하트 */
const heart = (g: Pen, cx: number, cy: number, c: string) => g.px(cx - 1, cy - 1, c).px(cx + 1, cy - 1, c).rect(cx - 2, cy, 5, 1, c).rect(cx - 1, cy + 1, 3, 1, c).px(cx, cy + 2, c);
/** 튕기는 길 (꺾인 점선) */
const zigzag = (g: Pen, c = NEON) => g.line(0, 13, 5, 3, c).line(5, 3, 10, 13, c).line(10, 13, 15, 3, c);

export const JK_WEAPON_ART = {
  jkCards: (g: Pen) => {
    card(g, 2, 4, NEON);
    card(g, 8, 2, EDGE);
  },
  jkScythe: (g: Pen) => {
    g.line(3, 15, 11, 3, DARK).line(4, 15, 12, 3, INK);
    g.line(11, 3, 5, 1, NEON).line(12, 4, 4, 2, EDGE).line(5, 2, 2, 5, NEON);
  },
  jkToyGun: (g: Pen) => {
    g.rect(2, 5, 10, 4, EDGE).rect(3, 9, 3, 5, DARK).rect(12, 6, 3, 2, NEON).px(7, 6, PAPER).px(9, 10, GOLD);
  },
};

export const JK_PASSIVE_ART = {
  jkDraw: (g: Pen) => {
    g.rect(1, 3, 4, 7, "#3a4aa8").rect(6, 1, 4, 7, "#a8283a").rect(11, 3, 4, 7, "#3a7a4a");
    g.px(2, 6, PAPER).px(8, 4, RED).px(13, 6, GOLD).line(3, 13, 12, 13, NEON);
  },
  jkEdge: (g: Pen) => {
    card(g, 5, 3);
    g.line(4, 2, 4, 13, PAPER).line(11, 2, 11, 13, PAPER).px(3, 1, NEON).px(12, 14, NEON);
  },
  jkDouble: (g: Pen) => {
    card(g, 1, 4);
    card(g, 9, 4, EDGE);
    g.px(7, 1, NEON).px(8, 1, NEON);
  },
  jkSleeve: (g: Pen) => {
    g.rect(0, 9, 9, 6, DARK).rect(8, 10, 2, 4, PAPER);
    card(g, 9, 1);
  },
  jkFlame: (g: Pen) => {
    card(g, 5, 5, RED);
    g.px(6, 3, RED).px(8, 1, GOLD).px(10, 3, RED).px(8, 3, GOLD);
  },
  jkFrost: (g: Pen) => {
    card(g, 5, 5, ICE);
    g.px(4, 2, ICE).px(8, 1, PAPER).px(12, 2, ICE).px(2, 13, ICE).px(14, 12, ICE);
  },
  jkRecall: (g: Pen) => {
    g.line(2, 14, 12, 4, DARK).px(13, 3, PAPER).px(12, 2, PAPER);
    g.line(1, 3, 6, 3, NEON).line(1, 6, 5, 6, NEON).px(14, 9, EDGE).px(11, 12, EDGE);
  },
  jkFirework: (g: Pen) => {
    for (const [dx, dy] of [[0, -5], [4, -3], [5, 1], [3, 5], [-3, 5], [-5, 1], [-4, -3]] as const) g.line(8, 8, 8 + dx, 8 + dy, [RED, GOLD, NEON][Math.abs(dx) % 3]!);
    g.px(8, 8, PAPER);
  },
  jkSplit: (g: Pen) => {
    card(g, 1, 2);
    g.rect(9, 6, 6, 9, DARK).rect(10, 7, 4, 7, "#8a6aa8");
    spade(g, 12, 10, PAPER);
  },
  jkAce: (g: Pen) => {
    g.rect(3, 1, 10, 14, GOLD).rect(4, 2, 8, 12, PAPER);
    spade(g, 8, 8, INK);
    g.px(5, 3, RED).px(10, 12, RED);
  },
  jkSeven: (g: Pen) => {
    card(g, 5, 3, GOLD, PAPER);
    g.line(6, 5, 9, 5, RED).line(9, 5, 7, 10, RED);
  },
  jkHeart: (g: Pen) => {
    card(g, 5, 3, PAPER);
    heart(g, 8, 6, RED);
  },
  jkAccel: (g: Pen) => {
    zigzag(g);
    g.px(15, 3, PAPER).px(14, 2, PAPER).px(14, 4, PAPER);
  },
  jkGuard: (g: Pen) => {
    card(g, 1, 3);
    card(g, 5, 5, EDGE);
    card(g, 9, 3);
    g.px(15, 1, RED).px(14, 0, RED);
  },
  jkFullHouse: (g: Pen) => {
    for (let i = 0; i < 5; i++) g.rect(1 + i * 3, 2 + (i % 2), 3, 11, i % 2 ? EDGE : PAPER);
    g.px(2, 6, RED).px(8, 7, NEON).px(14, 6, RED).line(1, 15, 15, 15, GOLD);
  },
};
