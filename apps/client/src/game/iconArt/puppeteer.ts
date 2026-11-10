// 실베르 인형술사 아이콘: 붉은 실을 감은 하얀 손·나무 인형 · 무기 1 (인형술사의 손) · 전용 아이템 20 (미니 인형 8 · 그 밖 12)
import type { Pen } from "./pen";

const RED = "#e8304a";
const DARK = "#7a1a2a";
const WOOD = "#c8925a";
const BROWN = "#7a4a22";
const HAND = "#f4e8ec";
const BLUE = "#6a8ad8";
const GOLD = "#e8b84a";
const BLACK = "#1a1418";
const PINK = "#ffb0c0";
const LEAF = "#7ac85a";
const FIRE = "#ff8a2a";
const ICE = "#9ae0ff";

/** 작은 나무 인형 (머리 cx, cy) · 머리 위 실 */
function doll(g: Pen, cx: number, cy: number, body = WOOD): Pen {
  g.line(cx, 0, cx, cy - 3, RED);
  g.disc(cx, cy, 2, WOOD).px(cx - 1, cy, BLACK).px(cx + 1, cy, BLACK);
  g.rect(cx - 2, cy + 3, 5, 5, body).line(cx - 3, cy + 4, cx - 4, cy + 7, WOOD).line(cx + 3, cy + 4, cx + 4, cy + 7, WOOD);
  return g.rect(cx - 2, cy + 8, 2, 4, WOOD).rect(cx + 1, cy + 8, 2, 4, WOOD);
}

export const PP_WEAPON_ART = {
  ppHand: (g: Pen) => {
    g.rect(3, 6, 9, 7, HAND).rect(3, 2, 2, 5, HAND).rect(6, 1, 2, 6, HAND).rect(9, 2, 2, 5, HAND).rect(12, 5, 2, 4, HAND);
    g.line(3, 4, 4, 4, RED).line(6, 3, 7, 3, RED).line(9, 4, 10, 4, RED).px(6, 9, BLUE).px(8, 10, BLUE);
    g.line(4, 13, 4, 15, RED).line(10, 13, 10, 15, RED).px(4, 15, WOOD).px(10, 15, WOOD);
  },
};

export const PP_PASSIVE_ART = {
  ppDollRibbon: (g: Pen) => doll(g, 8, 5, DARK).rect(5, 1, 2, 2, RED).rect(9, 1, 2, 2, RED).px(8, 2, RED),
  ppDollSpiral: (g: Pen) => doll(g, 8, 5).ring(8, 5, 3, BROWN).px(8, 5, BROWN),
  ppDollJester: (g: Pen) => doll(g, 8, 6, RED).line(4, 3, 8, 1, RED).line(12, 3, 8, 1, DARK).px(4, 4, GOLD).px(12, 4, GOLD),
  ppDollHat: (g: Pen) => doll(g, 8, 6, BROWN).rect(6, 0, 5, 3, BLACK).rect(5, 3, 7, 1, BLACK),
  ppDollPrincess: (g: Pen) => doll(g, 8, 6, PINK).px(6, 2, GOLD).px(8, 1, GOLD).px(10, 2, GOLD).rect(6, 3, 5, 1, GOLD),
  ppDollDancer: (g: Pen) => doll(g, 7, 5).line(11, 7, 14, 4, WOOD).line(3, 13, 1, 15, WOOD).px(14, 12, PINK).px(13, 13, PINK),
  ppDollHood: (g: Pen) => doll(g, 8, 6, RED).rect(5, 2, 7, 3, RED).px(5, 5, RED).px(11, 5, RED).px(13, 13, FIRE).px(14, 12, FIRE),
  ppDollCat: (g: Pen) => doll(g, 8, 6).px(6, 3, WOOD).px(10, 3, WOOD).line(12, 12, 14, 9, WOOD).px(8, 9, GOLD).px(2, 12, ICE),
  ppCorpse: (g: Pen) => {
    g.disc(8, 5, 4, WOOD).px(6, 5, RED).px(10, 5, RED).line(6, 7, 10, 7, BROWN);
    g.rect(4, 9, 8, 5, WOOD).rect(6, 9, 4, 2, RED).disc(4, 14, 2, WOOD).disc(12, 14, 2, WOOD).px(1, 2, FIRE).px(14, 2, FIRE).px(15, 4, FIRE);
  },
  ppGolem: (g: Pen) => {
    g.line(3, 3, 6, 1, BROWN).line(13, 3, 10, 1, BROWN).px(8, 0, LEAF).px(9, 0, LEAF);
    g.disc(8, 5, 3, WOOD).px(7, 5, RED).px(9, 5, RED).rect(4, 9, 8, 5, RED).rect(2, 9, 2, 3, WOOD).rect(12, 9, 2, 3, WOOD).rect(5, 14, 2, 2, WOOD).rect(9, 14, 2, 2, WOOD).px(8, 11, GOLD);
  },
  ppBlack: (g: Pen) => {
    g.disc(8, 8, 5, DARK);
    for (let i = 0; i < 4; i++) g.line(2, 3 + i * 3, 14, 5 + i * 3, BLACK);
    g.line(1, 1, 15, 15, RED);
  },
  ppClone: (g: Pen) => {
    g.disc(5, 6, 2, BLACK).rect(3, 9, 5, 6, BLUE);
    g.disc(11, 6, 2, "#8a7a9a").rect(9, 9, 5, 6, "#b0c0e8").px(8, 2, PINK).px(13, 2, PINK);
  },
  ppCrown: (g: Pen) => g.rect(2, 9, 12, 3, BROWN).line(3, 9, 3, 4, BROWN).line(8, 9, 8, 2, BROWN).line(13, 9, 13, 4, BROWN).px(8, 1, LEAF).px(9, 1, LEAF).px(4, 12, WOOD),
  ppSpool: (g: Pen) => g.rect(4, 2, 8, 2, BROWN).rect(4, 12, 8, 2, BROWN).rect(5, 4, 6, 8, RED).line(5, 6, 10, 6, DARK).line(5, 9, 10, 9, DARK).line(11, 8, 15, 14, RED),
  ppLong: (g: Pen) => g.rect(1, 1, 4, 4, HAND).line(4, 4, 14, 14, RED).line(5, 4, 15, 14, RED).px(14, 15, WOOD).px(15, 15, WOOD),
  ppWeb: (g: Pen) => {
    g.line(8, 1, 8, 15, HAND).line(1, 8, 15, 8, HAND).line(2, 2, 14, 14, HAND).line(14, 2, 2, 14, HAND);
    g.ring(8, 8, 3, "#d0c8d8").ring(8, 8, 6, "#d0c8d8");
  },
  ppDance: (g: Pen) => doll(g, 5, 5).line(10, 0, 10, 4, RED).disc(11, 6, 2, WOOD).rect(9, 9, 4, 4, RED).line(13, 10, 15, 8, WOOD),
  ppBow: (g: Pen) => g.rect(3, 6, 4, 4, RED).rect(9, 6, 4, 4, RED).disc(8, 8, 1, GOLD).line(6, 10, 4, 14, RED).line(10, 10, 12, 14, RED).px(1, 2, FIRE).px(14, 1, FIRE),
  ppStitch: (g: Pen) => {
    g.disc(8, 8, 6, PINK).line(3, 8, 13, 8, DARK);
    for (let x = 4; x <= 12; x += 2) g.line(x, 6, x + 1, 10, DARK);
    g.line(13, 2, 15, 0, "#c0c0d0");
  },
  ppChain: (g: Pen) => {
    for (let i = 0; i < 4; i++) g.ring(3 + i * 3, 3 + i * 3, 2, GOLD);
    g.px(14, 14, RED).px(15, 13, RED);
  },
};
