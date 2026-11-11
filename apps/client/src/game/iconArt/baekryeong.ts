// 실베르 백령 아이콘: 푸른 혼불·흰 망령·검은 칼집의 대태도 · 무기 1 (대태도) · 전용 아이템 20
import type { Pen } from "./pen";

const BLUE = "#3ac8ff";
const DEEP = "#1a5ad8";
const PALE = "#c8f0ff";
const WHITE = "#f4f8ff";
const STEEL = "#c8d4e8";
const BLACK = "#1a1a2a";
const GOLD = "#e8c86a";
const HORN = "#2a4ab8";
const RED = "#e84a5a";
const BOLT = "#ffe85a";

/** 대태도 (칼끝이 오른쪽 위로) · 날 색 */
function blade(g: Pen, x0: number, y0: number, x1: number, y1: number, edge = STEEL): Pen {
  return g.line(x0, y0, x1, y1, edge).line(x0 + 1, y0, x1, y1 + 1, WHITE).line(x0 - 2, y0 + 2, x0, y0, BLACK).px(x0 - 1, y0 + 1, GOLD);
}
/** 혼불 (가운데 cx, cy) */
function fire(g: Pen, cx: number, cy: number, r = 2): Pen {
  return g.disc(cx, cy, r, BLUE).px(cx, cy - r - 1, BLUE).px(cx, cy, PALE).px(cx - 1, cy - r, DEEP);
}
/** 망령 (가운데 cx, cy) */
function wraith(g: Pen, cx: number, cy: number): Pen {
  return g.disc(cx, cy, 3, WHITE).rect(cx - 3, cy, 7, 4, WHITE).px(cx - 3, cy + 4, WHITE).px(cx, cy + 4, WHITE).px(cx + 3, cy + 4, WHITE).px(cx - 1, cy, BLACK).px(cx + 1, cy, BLACK);
}
/** 에너지 참격 (초승달) */
function crescent(g: Pen, cx: number, cy: number, r: number, c = BLUE): Pen {
  return g.line(cx - r, cy - r, cx + r - 2, cy - 1, c).line(cx + r - 2, cy - 1, cx + r - 2, cy + 1, PALE).line(cx + r - 2, cy + 1, cx - r, cy + r, c);
}

export const BY_WEAPON_ART = {
  byBlade: (g: Pen) => blade(g, 3, 13, 14, 2).px(13, 1, BLUE).px(15, 3, BLUE),
};

export const BY_PASSIVE_ART = {
  byWraith: (g: Pen) => wraith(crescent(g, 6, 8, 5), 11, 6),
  byTrinity: (g: Pen) => wraith(wraith(wraith(g, 4, 5), 11, 4), 8, 10),
  byWhirl: (g: Pen) => g.ring(8, 8, 6, PALE).ring(8, 8, 3, WHITE).line(2, 12, 14, 4, STEEL).line(2, 4, 14, 12, STEEL),
  byGreat: (g: Pen) => blade(g, 8, 1, 8, 12).line(7, 12, 9, 12, BLUE).rect(3, 14, 11, 1, DEEP).px(5, 4, BLUE).px(11, 6, BLUE),
  byGreatWolf: (g: Pen) => g.line(3, 2, 3, 10, STEEL).line(8, 3, 8, 11, STEEL).line(13, 4, 13, 12, STEEL).px(3, 11, BLUE).px(8, 12, BLUE).px(13, 13, BLUE).line(1, 14, 15, 14, DEEP),
  byGreatWhite: (g: Pen) => blade(g, 8, 1, 8, 10).ring(8, 11, 5, PALE).line(2, 4, 4, 7, BOLT).line(4, 7, 3, 9, BOLT).line(14, 4, 12, 7, BOLT),
  byFeast: (g: Pen) => fire(fire(g, 5, 9), 11, 9).disc(8, 4, 2, PALE).px(8, 4, WHITE),
  byDrain: (g: Pen) => fire(g, 5, 7).line(8, 7, 11, 7, PALE).disc(12, 10, 3, RED).px(11, 9, WHITE),
  byHorn: (g: Pen) => g.line(3, 14, 5, 6, HORN).line(5, 6, 3, 1, BLUE).line(12, 14, 10, 6, HORN).line(10, 6, 12, 1, BLUE).px(4, 10, WHITE).px(11, 10, WHITE),
  byWide: (g: Pen) => crescent(g, 7, 8, 7).line(1, 1, 1, 15, PALE),
  byTwin: (g: Pen) => crescent(crescent(g, 6, 6, 4), 10, 10, 4, PALE),
  byFlame: (g: Pen) => fire(g, 8, 9, 4).px(5, 4, BLUE).px(11, 3, BLUE).px(8, 2, PALE),
  byStep: (g: Pen) => g.ring(9, 10, 5, BLUE).px(9, 10, PALE).line(1, 6, 5, 6, PALE).line(1, 9, 4, 9, PALE).rect(7, 2, 3, 2, WHITE),
  byGuard: (g: Pen) => fire(g.rect(3, 3, 10, 9, DEEP).line(3, 12, 8, 15, DEEP).line(12, 12, 8, 15, DEEP), 8, 8, 2),
  byHaunt: (g: Pen) => wraith(g, 8, 6).rect(2, 13, 3, 2, BLUE).rect(6, 13, 3, 2, BLUE).rect(10, 13, 3, 2, PALE),
  byPossess: (g: Pen) => wraith(g, 9, 5).disc(5, 11, 3, STEEL).px(4, 11, RED).px(6, 11, RED).line(7, 8, 9, 10, PALE),
  byReaper: (g: Pen) => blade(g, 2, 14, 13, 3).disc(12, 12, 2, RED).px(12, 12, BLACK),
  byWisp: (g: Pen) => fire(fire(g, 4, 11, 2).line(6, 9, 10, 5, PALE), 12, 4, 1),
  byFrost: (g: Pen) => crescent(g, 7, 8, 6, PALE).px(13, 3, WHITE).px(14, 12, WHITE).line(12, 7, 14, 9, WHITE),
  byCall: (g: Pen) => fire(g, 8, 6, 2).px(2, 12, BLUE).px(4, 9, PALE).px(13, 11, BLUE).px(11, 14, PALE).px(6, 14, BLUE),
};
