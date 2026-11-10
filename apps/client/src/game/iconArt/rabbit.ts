// 실베르 래빗 아이콘: 분홍 토끼 망치·초록 땅울림·하얀 토끼 · 무기 1 (토끼 망치) · 전용 아이템 20
import type { Pen } from "./pen";

const PINK = "#ff7ac0";
const DEEP = "#c83a8a";
const PURPLE = "#7a4ab8";
const GREEN = "#7dff4a";
const DGREEN = "#3aa82a";
const WHITE = "#fff4f8";
const EAR = "#ffb0d0";
const GOLD = "#ffd84a";
const BLACK = "#2a1a2a";
const ORANGE = "#ff8a2a";
const GHOST = "#c8f0ff";
const MOON = "#fff0a0";

/** 망치 머리 (가운데 cx, cy) + 자루 아래로 */
function hammer(g: Pen, cx: number, cy: number, head = PINK, handle = true): Pen {
  g.rect(cx - 4, cy - 2, 9, 5, head).rect(cx - 1, cy - 2, 3, 5, PURPLE).px(cx, cy, WHITE).line(cx - 4, cy - 2, cx - 4, cy + 2, DEEP).line(cx + 4, cy - 2, cx + 4, cy + 2, DEEP);
  return handle ? g.line(cx, cy + 3, cx - 4, 15, PURPLE).px(cx - 4, 15, GOLD) : g;
}
/** 토끼 얼굴 (가운데 cx, cy) */
function bunny(g: Pen, cx: number, cy: number): Pen {
  g.rect(cx - 3, cy - 7, 2, 5, WHITE).rect(cx + 2, cy - 7, 2, 5, WHITE).px(cx - 2, cy - 5, EAR).px(cx + 3, cy - 5, EAR);
  return g.disc(cx, cy, 3, WHITE).px(cx - 1, cy, BLACK).px(cx + 1, cy, BLACK).px(cx - 2, cy + 1, EAR).px(cx + 2, cy + 1, EAR);
}
/** 땅울림 고리 (가운데 cx, cy) */
function quake(g: Pen, cx: number, cy: number, w: number): Pen {
  g.line(cx - w, cy, cx - w + 2, cy - 1, GREEN).line(cx - w + 2, cy - 1, cx + w - 2, cy - 1, DGREEN).line(cx + w - 2, cy - 1, cx + w, cy, GREEN);
  return g.line(cx - w, cy, cx - w + 2, cy + 1, GREEN).line(cx - w + 2, cy + 1, cx + w - 2, cy + 1, GREEN).line(cx + w - 2, cy + 1, cx + w, cy, GREEN).line(cx, cy - 4, cx, cy - 1, GREEN);
}

export const RB_WEAPON_ART = {
  rbHammer: (g: Pen) => hammer(g, 9, 4),
};

export const RB_PASSIVE_ART = {
  rbQuake: (g: Pen) => quake(g, 8, 11, 6).line(3, 6, 3, 9, GREEN).line(13, 6, 13, 9, GREEN).px(8, 3, GREEN),
  rbTriple: (g: Pen) => quake(g, 8, 12, 4).line(8, 9, 8, 1, GREEN).line(6, 9, 1, 3, GREEN).line(10, 9, 15, 3, GREEN),
  rbSeal: (g: Pen) => bunny(g, 8, 10).px(13, 4, GOLD).px(2, 13, GOLD).px(14, 12, GOLD),
  rbHomerun: (g: Pen) => hammer(g, 6, 5).line(10, 10, 15, 6, WHITE).line(11, 12, 15, 9, WHITE).px(14, 2, GOLD).px(15, 1, GOLD),
  rbLucky: (g: Pen) => g.rect(0, 4, 16, 8, PINK).rect(6, 4, 4, 8, PURPLE).px(7, 7, WHITE).px(8, 7, WHITE).line(0, 3, 15, 3, GREEN).line(0, 12, 15, 12, GREEN).px(2, 1, GOLD).px(13, 14, GOLD),
  rbCarrot: (g: Pen) => g.line(4, 13, 11, 6, ORANGE).line(5, 13, 12, 6, ORANGE).line(4, 12, 10, 6, ORANGE).line(11, 5, 13, 2, DGREEN).line(12, 6, 15, 4, DGREEN).line(11, 4, 10, 1, GREEN),
  rbEars: (g: Pen) => g.rect(4, 1, 3, 12, WHITE).rect(9, 1, 3, 12, WHITE).rect(5, 3, 1, 8, EAR).rect(10, 3, 1, 8, EAR).rect(3, 13, 10, 2, WHITE),
  rbHop: (g: Pen) => bunny(g, 7, 9).line(10, 13, 15, 13, GREEN).line(12, 15, 15, 15, DGREEN).px(1, 14, GREEN),
  rbClover: (g: Pen) => g.disc(5, 5, 2, GREEN).disc(10, 5, 2, GREEN).disc(5, 10, 2, GREEN).disc(10, 10, 2, GREEN).px(7, 7, DGREEN).px(8, 8, DGREEN).line(9, 9, 13, 15, DGREEN),
  rbBell: (g: Pen) => g.disc(8, 8, 4, GOLD).rect(4, 10, 9, 2, GOLD).px(8, 12, DEEP).line(7, 3, 9, 3, PINK).ring(8, 8, 7, GREEN),
  rbGhost: (g: Pen) => hammer(g, 9, 4, GHOST).disc(4, 12, 3, GHOST).px(3, 12, BLACK).px(5, 12, BLACK).line(1, 14, 7, 14, GHOST),
  rbHeavy: (g: Pen) => hammer(g, 8, 4, DEEP).line(1, 13, 15, 13, PURPLE).px(3, 11, GOLD).px(13, 11, GOLD).px(8, 10, GOLD),
  rbStomp: (g: Pen) => quake(g, 5, 13, 3).px(5, 8, PINK).px(5, 7, PINK).rect(9, 2, 6, 3, PINK).rect(11, 6, 4, 2, PINK).rect(12, 9, 3, 2, PINK),
  rbAfter: (g: Pen) => quake(g, 6, 12, 4).ring(12, 6, 3, GREEN).px(12, 6, GOLD).line(15, 1, 15, 14, PURPLE),
  rbCrack: (g: Pen) => g.rect(0, 10, 16, 5, PURPLE).line(2, 10, 5, 13, BLACK).line(5, 13, 8, 11, BLACK).line(8, 11, 12, 14, BLACK).line(12, 14, 14, 10, BLACK).px(8, 6, GREEN).px(4, 7, GREEN).px(12, 7, GREEN),
  rbMoon: (g: Pen) => g.disc(8, 8, 6, MOON).px(6, 6, GOLD).px(10, 10, GOLD).px(11, 6, GOLD).rect(6, 0, 1, 4, WHITE).rect(9, 0, 1, 4, WHITE).px(6, 1, EAR).px(9, 1, EAR),
  rbFluff: (g: Pen) => g.disc(8, 9, 5, WHITE).disc(4, 7, 3, WHITE).disc(12, 7, 3, WHITE).disc(8, 5, 3, WHITE).px(7, 9, EAR).px(9, 10, EAR),
  rbMega: (g: Pen) => g.rect(1, 2, 14, 9, PINK).rect(6, 2, 4, 9, PURPLE).px(7, 5, WHITE).px(8, 6, WHITE).line(1, 2, 1, 10, DEEP).line(14, 2, 14, 10, DEEP).line(8, 11, 6, 15, PURPLE),
  rbFever: (g: Pen) => g.line(2, 14, 8, 2, ORANGE).line(8, 2, 6, 8, GOLD).line(6, 8, 14, 5, ORANGE).line(14, 5, 9, 14, GOLD).px(3, 3, PINK).px(13, 13, PINK),
  rbStar: (g: Pen) => g.line(8, 1, 8, 15, GOLD).line(1, 8, 15, 8, GOLD).line(3, 3, 13, 13, PINK).line(13, 3, 3, 13, PINK).disc(8, 8, 2, GOLD),
};
