// 실베르 빙설 아이콘: 얼음 칼날·눈 결정·얼음 활·얼음 창 · 무기 10 · 전용 아이템 10
import type { Pen } from "./pen";

const ICE = "#8ad8ff";
const DEEP = "#2a6ad8";
const PALE = "#dff4ff";
const WHITE = "#f6fbff";
const NAVY = "#1a2a6a";
const GOLD = "#e8c86a";

/** 얼음 칼날 (자루 x0,y0 → 칼끝 x1,y1) */
function blade(g: Pen, x0: number, y0: number, x1: number, y1: number): Pen {
  return g.line(x0, y0, x1, y1, ICE).line(x0 + 1, y0, x1, y1 + 1, WHITE).line(x0 - 2, y0 + 2, x0, y0, NAVY).px(x0 - 1, y0 + 1, GOLD);
}
/** 눈 결정 (가운데 cx, cy, 반지름 r) */
function flake(g: Pen, cx: number, cy: number, r: number, c = PALE): Pen {
  return g.line(cx - r, cy, cx + r, cy, c).line(cx, cy - r, cx, cy + r, c).line(cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, c).line(cx - r + 1, cy + r - 1, cx + r - 1, cy - r + 1, c).px(cx, cy, WHITE);
}
/** 얼음 창 (아래 → 위) */
function spear(g: Pen, x: number, y0: number, y1: number): Pen {
  return g.line(x, y0, x, y1 + 2, ICE).px(x - 1, y1 + 2, PALE).px(x + 1, y1 + 2, PALE).px(x, y1, WHITE).px(x, y1 + 1, WHITE);
}

export const BS_WEAPON_ART = {
  bsBlade: (g: Pen) => blade(g, 3, 13, 14, 2),
  bsScythe: (g: Pen) => g.line(4, 15, 9, 3, NAVY).line(9, 3, 4, 1, ICE).line(9, 3, 14, 2, ICE).line(14, 2, 15, 5, PALE).line(10, 4, 14, 4, WHITE),
  bsDagger: (g: Pen) => blade(g, 5, 11, 12, 4).px(13, 3, WHITE),
  bsGreat: (g: Pen) => blade(g, 2, 14, 14, 2).line(3, 12, 13, 2, ICE).line(1, 11, 5, 15, GOLD),
  bsPike: (g: Pen) => g.line(1, 15, 12, 4, NAVY).line(12, 4, 15, 1, WHITE).line(11, 3, 13, 5, ICE).px(14, 2, PALE),
  bsShard: (g: Pen) => blade(g, 2, 10, 9, 3).line(7, 13, 14, 6, ICE).px(14, 6, WHITE).px(4, 14, PALE),
  bsFan: (g: Pen) => g.line(3, 13, 3, 3, ICE).line(3, 13, 9, 3, ICE).line(3, 13, 13, 6, ICE).line(3, 13, 14, 11, ICE).px(3, 3, WHITE).px(9, 3, WHITE).px(13, 6, WHITE).px(14, 11, WHITE).px(3, 13, GOLD),
  bsWhip: (g: Pen) => g.line(2, 14, 5, 10, NAVY).line(5, 10, 9, 9, ICE).line(9, 9, 12, 5, ICE).line(12, 5, 14, 2, PALE).px(14, 1, WHITE),
  bsRing: (g: Pen) => g.ring(8, 8, 6, ICE).ring(8, 8, 4, PALE).px(8, 2, WHITE).px(14, 8, WHITE).px(8, 14, WHITE).px(2, 8, WHITE),
  bsStaff: (g: Pen) => flake(g.line(3, 15, 10, 6, NAVY), 11, 5, 3),
};

export const BS_PASSIVE_ART = {
  bsUlt: (g: Pen) => g.line(1, 14, 13, 2, ICE).line(2, 14, 14, 2, WHITE).line(11, 1, 15, 1, PALE).line(15, 1, 15, 5, PALE).px(4, 9, DEEP).px(9, 13, DEEP),
  bsBow: (g: Pen) => g.line(4, 1, 9, 4, ICE).line(9, 4, 9, 12, ICE).line(9, 12, 4, 15, ICE).line(4, 1, 4, 15, PALE).line(2, 8, 15, 8, WHITE).px(15, 8, ICE),
  bsLance: (g: Pen) => spear(spear(spear(spear(g, 3, 13, 4), 6, 12, 2), 9, 12, 2), 12, 13, 4).rect(2, 14, 12, 1, DEEP),
  bsDust: (g: Pen) => g.px(3, 4, WHITE).px(7, 2, PALE).px(12, 5, WHITE).px(5, 9, ICE).px(10, 10, WHITE).px(13, 12, PALE).px(3, 13, ICE).px(8, 14, WHITE),
  bsHoming: (g: Pen) => flake(g, 5, 10, 3).line(8, 8, 13, 3, ICE).px(14, 2, WHITE).px(12, 2, PALE).px(14, 4, PALE),
  bsRapid: (g: Pen) => g.line(1, 8, 15, 8, ICE).line(1, 7, 13, 7, WHITE).line(10, 5, 15, 8, PALE).line(10, 11, 15, 8, PALE).px(3, 5, PALE).px(5, 11, PALE),
  bsSpike: (g: Pen) => g.line(3, 14, 5, 6, ICE).line(5, 6, 7, 14, ICE).line(6, 14, 9, 2, WHITE).line(9, 2, 11, 14, ICE).line(10, 14, 12, 7, PALE).line(12, 7, 14, 14, PALE).rect(1, 14, 14, 1, DEEP),
  bsWall: (g: Pen) => flake(flake(flake(g.ring(8, 8, 6, DEEP), 8, 2, 2), 2, 11, 2), 14, 11, 2),
  bsStorm: (g: Pen) => flake(g.ring(8, 8, 7, ICE), 8, 8, 4).px(2, 3, WHITE).px(14, 13, WHITE).px(13, 2, WHITE),
  bsShatter: (g: Pen) => g.line(3, 3, 8, 8, WHITE).line(8, 8, 13, 4, ICE).line(8, 8, 6, 14, ICE).line(8, 8, 14, 11, PALE).px(2, 9, ICE).px(12, 14, PALE).px(14, 1, WHITE),
};
