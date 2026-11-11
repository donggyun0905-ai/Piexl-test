// 실베르 혼령 아이콘: 곰방대·연기·혼령 짐승 · 무기 10 · 전용 아이템 10
import type { Pen } from "./pen";

const SMOKE = "#b48aff";
const DEEP = "#5a3aa8";
const PALE = "#e8dcff";
const WHITE = "#f8f4ff";
const WOOD = "#8a5a2a";
const GOLD = "#e8c86a";
const DARK = "#2a1a4a";

/** 곰방대 (물부리 왼쪽 아래 → 대통 오른쪽 위) + 대통 색 c + 연기 한 줄 */
function pipe(g: Pen, c = GOLD, stem = WOOD): Pen {
  return g.line(2, 13, 11, 6, stem).px(1, 14, GOLD).rect(11, 4, 3, 3, c).px(12, 3, DARK).line(12, 2, 13, 0, PALE);
}
/** 연기 한 덩이 */
function puff(g: Pen, cx: number, cy: number, r: number, c = SMOKE): Pen {
  return g.disc(cx, cy, r, c).disc(cx - r, cy + 1, Math.max(1, r - 1), c).disc(cx + r, cy + 1, Math.max(1, r - 1), c).px(cx - 1, cy - 1, WHITE);
}
/** 짐승 머리 (귀 둘 · 눈 둘) */
function head(g: Pen, cx: number, cy: number, r: number, c = SMOKE): Pen {
  return g.disc(cx, cy, r, c).line(cx - r, cy - r, cx - r + 1, cy - r - 2, c).line(cx + r, cy - r, cx + r - 1, cy - r - 2, c).px(cx - 2, cy - 1, WHITE).px(cx + 2, cy - 1, WHITE).px(cx, cy + 1, DARK);
}

export const HR_WEAPON_ART = {
  hrPipe: (g: Pen) => pipe(g),
  hrEmber: (g: Pen) => pipe(g, "#ff8a3a").px(12, 3, "#ffd04a").px(14, 1, "#ff5a2a"),
  hrFrost: (g: Pen) => pipe(g, "#8ad8ff").px(12, 3, WHITE).px(14, 2, "#8ad8ff").px(10, 1, "#8ad8ff"),
  hrVenom: (g: Pen) => pipe(g, "#7ae05a").px(12, 3, "#3a8a2a").px(14, 1, "#7ae05a").px(10, 2, "#7ae05a"),
  hrHerb: (g: Pen) => pipe(g, "#b8ffb0").line(4, 5, 7, 2, "#4aa84a").line(4, 5, 3, 2, "#4aa84a").px(5, 3, "#b8ffb0"),
  hrBolt: (g: Pen) => pipe(g, "#ffe04a").line(5, 1, 3, 4, "#ffe04a").line(3, 4, 6, 4, "#ffe04a").line(6, 4, 4, 8, "#ffe04a"),
  hrBlood: (g: Pen) => pipe(g, "#ff4a5a").px(12, 3, "#8a1a2a").px(6, 3, "#ff4a5a").px(6, 4, "#ff4a5a").px(5, 5, "#ff4a5a").px(7, 5, "#ff4a5a"),
  hrLong: (g: Pen) => g.line(0, 15, 12, 3, WOOD).px(0, 15, GOLD).rect(12, 1, 3, 3, GOLD).line(13, 0, 15, 0, PALE).px(6, 9, GOLD),
  hrShort: (g: Pen) => g.line(5, 11, 10, 7, WOOD).px(4, 12, GOLD).rect(10, 5, 4, 4, GOLD).px(12, 4, DARK).line(12, 3, 13, 1, PALE),
  hrDream: (g: Pen) => puff(puff(pipe(g, SMOKE), 5, 4, 2), 9, 1, 1, PALE),
};

export const HR_PASSIVE_ART = {
  hrWolf: (g: Pen) => head(head(g, 5, 9, 3), 11, 8, 3, DEEP).px(5, 12, WHITE).px(11, 11, WHITE),
  hrTiger: (g: Pen) => head(g, 8, 8, 5).line(6, 4, 7, 6, DARK).line(10, 4, 9, 6, DARK).line(3, 8, 5, 8, DARK).line(11, 8, 13, 8, DARK).px(7, 11, WHITE).px(9, 11, WHITE),
  hrOwl: (g: Pen) => g.disc(8, 9, 5, SMOKE).ring(6, 7, 2, WHITE).ring(10, 7, 2, WHITE).px(6, 7, DARK).px(10, 7, DARK).px(8, 9, GOLD).line(3, 3, 5, 5, SMOKE).line(13, 3, 11, 5, SMOKE),
  hrDragon: (g: Pen) => g.line(1, 11, 5, 7, SMOKE).line(5, 7, 9, 10, SMOKE).line(9, 10, 13, 5, SMOKE).line(1, 12, 5, 8, DEEP).line(5, 8, 9, 11, DEEP).disc(13, 4, 2, PALE).px(14, 3, DARK).line(12, 1, 13, 2, WHITE).px(15, 5, WHITE),
  hrDecoy: (g: Pen) => g.disc(8, 4, 2, PALE).rect(6, 7, 5, 6, SMOKE).line(5, 14, 11, 14, DEEP).px(7, 4, DARK).px(9, 4, DARK).ring(8, 9, 7, DEEP),
  hrHunt: (g: Pen) => head(g, 8, 9, 4, DEEP).px(6, 8, "#ff4a5a").px(10, 8, "#ff4a5a").line(1, 2, 4, 5, PALE).line(15, 2, 12, 5, PALE).line(8, 0, 8, 3, PALE),
  hrFear: (g: Pen) => g.disc(8, 7, 5, PALE).rect(6, 11, 5, 3, PALE).px(6, 6, DARK).px(7, 6, DARK).px(9, 6, DARK).px(10, 6, DARK).px(8, 9, DARK).px(7, 13, DARK).px(9, 13, DARK),
  hrThick: (g: Pen) => puff(puff(puff(g, 8, 11, 3, DEEP), 5, 7, 3), 11, 6, 2, PALE),
  hrPact: (g: Pen) => g.rect(3, 2, 10, 12, PALE).line(5, 5, 10, 5, DEEP).line(5, 7, 10, 7, DEEP).line(5, 9, 8, 9, DEEP).disc(10, 11, 2, SMOKE).px(10, 11, WHITE),
  hrBreath: (g: Pen) => puff(g, 8, 5, 3, PALE).line(8, 9, 8, 13, "#ff7a9a").line(6, 11, 10, 11, "#ff7a9a").px(8, 14, SMOKE),
};
