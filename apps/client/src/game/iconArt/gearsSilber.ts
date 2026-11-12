// 실베르 기어스 아이콘: 은빛 둥근 방패·푸른 보석·푸른 빛 · 무기 1 (은빛 쌍방패) · 전용 아이템 20 — gears.ts가 아닌 이름 (기계공학자와 헷갈리지 않게)
import type { Pen } from "./pen";

const SILVER = "#d8dcea";
const DARK = "#7a82a0";
const BLUE = "#3a7aff";
const LIGHT = "#a8d8ff";
const WHITE = "#f4f8ff";
const DEEP = "#1a3a9a";
const GOLD = "#ffd84a";

/** 둥근 방패 (가운데 cx, cy · 반지름 r): 은빛 테 · 푸른 고리 · 가운데 보석 */
function shield(g: Pen, cx: number, cy: number, r = 5): Pen {
  g.disc(cx, cy, r, SILVER).ring(cx, cy, r, DARK);
  if (r >= 4) g.ring(cx, cy, r - 2, BLUE);
  return g.px(cx, cy, WHITE).px(cx, cy - 1, LIGHT).px(cx, cy + 1, LIGHT);
}
/** 육각형 테두리 */
function hex(g: Pen, cx: number, cy: number, r: number, c: string): Pen {
  return g.line(cx - r, cy, cx - r / 2, cy - r, c).line(cx - r / 2, cy - r, cx + r / 2, cy - r, c).line(cx + r / 2, cy - r, cx + r, cy, c)
    .line(cx + r, cy, cx + r / 2, cy + r, c).line(cx + r / 2, cy + r, cx - r / 2, cy + r, c).line(cx - r / 2, cy + r, cx - r, cy, c);
}

export const GE_WEAPON_ART = {
  geShields: (g: Pen) => shield(shield(g, 5, 8, 4), 11, 8, 4),
};

export const GE_PASSIVE_ART = {
  geMirror: (g: Pen) => shield(g, 5, 8, 4).line(10, 8, 15, 8, WHITE).line(10, 5, 14, 2, LIGHT).line(10, 11, 14, 14, LIGHT),
  geDome: (g: Pen) => g.line(1, 13, 3, 7, LIGHT).line(3, 7, 6, 4, LIGHT).line(6, 4, 10, 4, LIGHT).line(10, 4, 13, 7, LIGHT).line(13, 7, 15, 13, LIGHT).line(1, 13, 15, 13, BLUE).px(8, 3, WHITE).line(8, 5, 8, 12, BLUE).line(4, 9, 12, 9, BLUE),
  geQuake: (g: Pen) => shield(shield(g, 5, 6, 3), 11, 6, 3).line(1, 13, 15, 13, DARK).line(3, 11, 5, 13, LIGHT).line(13, 11, 11, 13, LIGHT).px(8, 12, LIGHT),
  geWave: (g: Pen) => shield(g, 5, 8, 4).line(11, 3, 14, 8, LIGHT).line(14, 8, 11, 13, LIGHT).line(13, 2, 15, 6, BLUE),
  geHex: (g: Pen) => hex(g, 8, 8, 6, BLUE).px(8, 8, WHITE).px(5, 8, LIGHT).px(11, 8, LIGHT),
  geThrow: (g: Pen) => shield(g, 11, 8, 4).line(1, 8, 6, 8, LIGHT).line(2, 5, 5, 6, BLUE).line(2, 11, 5, 10, BLUE),
  geTwin: (g: Pen) => shield(shield(g, 4, 8, 3), 12, 8, 3).px(8, 4, WHITE).px(8, 12, WHITE).line(8, 6, 8, 10, LIGHT),
  geBarrage: (g: Pen) => shield(shield(shield(g, 4, 5, 2), 9, 8, 2), 13, 11, 2).line(1, 13, 6, 13, LIGHT),
  geGuardian: (g: Pen) => shield(g, 8, 8, 6).px(8, 1, GOLD).px(2, 8, GOLD).px(14, 8, GOLD),
  geStorm: (g: Pen) => g.ring(8, 8, 6, LIGHT).ring(8, 8, 3, BLUE).line(9, 2, 7, 7, WHITE).line(7, 7, 10, 8, WHITE).line(10, 8, 8, 14, WHITE),
  geArmor: (g: Pen) => g.rect(4, 3, 8, 10, SILVER).line(4, 3, 11, 3, WHITE).line(8, 4, 8, 12, DARK).px(8, 7, BLUE),
  geRebound: (g: Pen) => g.line(1, 1, 1, 15, DARK).disc(6, 8, 3, BLUE).line(10, 4, 14, 2, LIGHT).line(10, 12, 14, 14, LIGHT).line(10, 8, 15, 8, LIGHT),
  geMomentum: (g: Pen) => g.disc(10, 8, 4, BLUE).ring(10, 8, 4, DEEP).px(10, 8, WHITE).line(1, 6, 5, 6, LIGHT).line(0, 9, 5, 9, LIGHT).line(1, 12, 5, 12, LIGHT),
  geCounter: (g: Pen) => shield(g, 6, 9, 4).line(11, 2, 11, 9, WHITE).line(13, 4, 13, 11, LIGHT).line(15, 6, 15, 13, BLUE),
  geFortress: (g: Pen) => g.rect(2, 6, 12, 8, SILVER).rect(2, 3, 3, 3, SILVER).rect(7, 3, 3, 3, SILVER).rect(11, 3, 3, 3, SILVER).rect(6, 9, 4, 5, DEEP),
  geEcho: (g: Pen) => shield(g, 6, 8, 4).ring(10, 8, 5, LIGHT).ring(11, 8, 6, BLUE),
  geCrystal: (g: Pen) => hex(g, 8, 8, 5, LIGHT).line(8, 1, 8, 3, WHITE).line(8, 13, 8, 15, WHITE).line(1, 8, 2, 8, WHITE).line(14, 8, 15, 8, WHITE),
  geOrbit: (g: Pen) => g.ring(8, 8, 6, DEEP).disc(8, 8, 2, LIGHT).disc(2, 8, 2, SILVER).disc(14, 8, 2, SILVER).px(2, 8, BLUE).px(14, 8, BLUE),
  geResolve: (g: Pen) => shield(g, 8, 8, 5).line(3, 14, 13, 14, "#ff4a4a").px(8, 1, WHITE),
  geHeavy: (g: Pen) => g.disc(9, 8, 5, SILVER).ring(9, 8, 5, DEEP).ring(9, 8, 3, BLUE).px(9, 8, WHITE).line(0, 6, 3, 6, LIGHT).line(0, 10, 3, 10, LIGHT),
};
