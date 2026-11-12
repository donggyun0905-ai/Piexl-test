// 실베르 아리아 아이콘: 음표·악기 · 무기 10 · 전용 아이템 10
import type { Pen } from "./pen";

const GOLD = "#ffd860";
const DEEP = "#b8862a";
const PALE = "#fff4c8";
const WHITE = "#ffffff";
const DARK = "#2a2030";
const WOOD = "#8a5a2a";
const SOUL = "#ffe8a0";

/** 음표 하나 (머리 가운데 cx, cy · 기둥 위로 · 꼬리 오른쪽) */
function note(g: Pen, cx: number, cy: number, c = GOLD): Pen {
  return g.disc(cx, cy, 2, c).line(cx + 2, cy, cx + 2, cy - 7, c).line(cx + 2, cy - 7, cx + 4, cy - 5, c).px(cx - 1, cy - 1, WHITE);
}
/** 지휘봉 (손잡이 왼쪽 아래 → 끝 오른쪽 위) */
function baton(g: Pen, tip = WHITE): Pen {
  return g.line(3, 13, 12, 4, PALE).rect(2, 12, 3, 3, DEEP).px(13, 3, tip);
}
/** 영혼 팔 한 줄기 */
function arm(g: Pen, x: number, y: number): Pen {
  return g.line(x, y, x + 3, y - 3, SOUL).line(x + 1, y, x + 4, y - 3, SOUL).px(x + 4, y - 4, WHITE);
}

export const AR_WEAPON_ART = {
  arBaton: (g: Pen) => note(baton(g), 10, 12),
  arFlute: (g: Pen) => g.line(1, 13, 14, 2, "#d8e0f0").line(2, 13, 15, 2, "#9aa8c0").px(5, 10, DARK).px(8, 7, DARK).px(11, 4, DARK),
  arCello: (g: Pen) => g.disc(7, 10, 4, WOOD).disc(7, 5, 3, WOOD).line(7, 2, 7, 14, DARK).line(2, 1, 14, 13, PALE).px(1, 0, DEEP),
  arTrumpet: (g: Pen) => g.line(1, 8, 9, 8, GOLD).line(1, 9, 9, 9, DEEP).rect(4, 5, 4, 2, GOLD).disc(12, 8, 3, GOLD).disc(12, 8, 1, DEEP).px(5, 4, PALE).px(7, 4, PALE),
  arBell: (g: Pen) => baton(g, GOLD).disc(12, 4, 2, GOLD).rect(10, 5, 5, 2, GOLD).px(12, 8, DEEP),
  arLyre: (g: Pen) => g.line(3, 2, 4, 13, GOLD).line(12, 2, 11, 13, GOLD).line(4, 13, 11, 13, DEEP).line(3, 2, 12, 2, GOLD).line(6, 3, 6, 12, PALE).line(8, 3, 8, 12, PALE).line(10, 3, 10, 12, PALE),
  arDrum: (g: Pen) => g.rect(3, 6, 10, 7, "#d84a4a").line(3, 6, 12, 6, PALE).line(3, 12, 12, 12, GOLD).line(4, 7, 11, 11, GOLD).line(11, 7, 4, 11, GOLD).line(1, 1, 6, 5, WOOD).line(14, 1, 9, 5, WOOD),
  arMusicBox: (g: Pen) => g.rect(2, 7, 12, 7, "#8ad8ff").rect(2, 5, 12, 2, "#5aa8e8").line(14, 9, 15, 9, GOLD).px(15, 8, GOLD).px(4, 3, WHITE).px(8, 2, WHITE).px(12, 3, WHITE),
  arTambourine: (g: Pen) => g.ring(8, 8, 6, "#ff8a3a").ring(8, 8, 5, WOOD).px(2, 8, GOLD).px(14, 8, GOLD).px(8, 2, GOLD).px(8, 14, GOLD).px(8, 7, "#ffd04a").px(7, 8, "#ff5a2a"),
  arRequiem: (g: Pen) => note(g.rect(2, 2, 12, 12, "#e8e0d0").line(3, 5, 12, 5, DARK).line(3, 8, 12, 8, DARK).line(3, 11, 12, 11, DARK), 6, 11, "#8a1a2a"),
};

export const AR_PASSIVE_ART = {
  arPiano: (g: Pen) => arm(g.rect(1, 7, 14, 6, DARK).line(1, 7, 10, 2, DARK).rect(2, 10, 12, 2, WHITE).px(4, 10, DARK).px(7, 10, DARK).px(10, 10, DARK).px(13, 10, DARK).line(2, 13, 2, 15, GOLD).line(13, 13, 13, 15, GOLD), 4, 9),
  arHarp: (g: Pen) => g.line(3, 14, 3, 2, GOLD).line(3, 2, 13, 5, GOLD).line(13, 5, 6, 14, GOLD).line(3, 14, 7, 14, DEEP).line(5, 3, 5, 13, PALE).line(7, 3, 7, 12, PALE).line(9, 4, 9, 10, PALE).line(11, 5, 11, 7, PALE),
  arHorn: (g: Pen) => g.ring(6, 8, 4, GOLD).ring(6, 8, 3, DEEP).line(9, 11, 13, 14, GOLD).disc(13, 13, 2, GOLD).disc(13, 13, 1, DEEP).px(6, 4, PALE),
  arClarinet: (g: Pen) => g.line(3, 1, 11, 13, DARK).line(4, 1, 12, 13, DARK).disc(12, 14, 2, DARK).px(5, 4, GOLD).px(7, 7, GOLD).px(9, 10, GOLD).px(3, 0, PALE),
  arViolin: (g: Pen) => arm(g.disc(8, 10, 3, WOOD).disc(8, 6, 2, WOOD).line(8, 1, 8, 13, DARK).line(2, 2, 14, 12, PALE), 1, 14),
  arChord: (g: Pen) => note(note(g, 5, 13), 11, 11, "#ff8ad8"),
  arCanon: (g: Pen) => note(g, 5, 12).line(9, 3, 14, 3, PALE).line(14, 3, 14, 8, PALE).line(14, 8, 10, 8, PALE).px(10, 7, PALE).px(10, 9, PALE),
  arForte: (g: Pen) => g.line(1, 13, 5, 3, GOLD).line(5, 3, 7, 3, GOLD).line(2, 8, 5, 8, GOLD).line(8, 13, 12, 3, DEEP).line(12, 3, 14, 3, DEEP).line(9, 8, 12, 8, DEEP),
  arEncore: (g: Pen) => g.disc(8, 8, 3, "#ff8ad8").px(8, 2, GOLD).px(8, 14, GOLD).px(2, 8, GOLD).px(14, 8, GOLD).px(4, 4, "#8ad8ff").px(12, 4, "#8ad8ff").px(4, 12, "#7aff8a").px(12, 12, "#7aff8a").px(8, 8, WHITE),
  arMaestro: (g: Pen) => baton(g).rect(1, 2, 8, 2, DARK).rect(2, 0, 6, 2, WHITE).px(5, 1, GOLD),
};
