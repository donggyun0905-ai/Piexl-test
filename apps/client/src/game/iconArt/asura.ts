// 실베르 아수라 아이콘: 남색 귀신 주먹·파란 빛·붉은 악귀 · 무기 1 (귀신의 주먹) · 전용 아이템 20
import type { Pen } from "./pen";

const BLUE = "#4a6aff";
const DEEP = "#1a2a8a";
const LIGHT = "#a8c0ff";
const WHITE = "#f0f4ff";
const NAVY = "#22265a";
const RED = "#ff3a3a";
const DRED = "#a81a1a";
const GOLD = "#ffd84a";
const SKIN = "#ffe0c0";
const FIRE = "#ff8a2a";

/** 주먹 (가운데 cx, cy · 크기 3~5) */
function fist(g: Pen, cx: number, cy: number, r = 4, col = BLUE): Pen {
  g.rect(cx - r, cy - r + 1, r * 2, r * 2 - 1, col).line(cx - r + 1, cy - r + 1, cx + r - 2, cy - r + 1, LIGHT);
  return g.line(cx - r, cy - 1, cx + r - 1, cy - 1, DEEP).px(cx - r + 1, cy + r - 1, WHITE);
}
/** 다이아 표식 */
function diamond(g: Pen, cx: number, cy: number, col = LIGHT): Pen {
  return g.line(cx, cy - 3, cx + 3, cy, col).line(cx + 3, cy, cx, cy + 3, col).line(cx, cy + 3, cx - 3, cy, col).line(cx - 3, cy, cx, cy - 3, col);
}

export const AS_WEAPON_ART = {
  asFist: (g: Pen) => fist(g, 8, 8, 5).line(1, 3, 3, 5, LIGHT).line(13, 2, 11, 4, LIGHT),
};

export const AS_PASSIVE_ART = {
  asCrush: (g: Pen) => fist(g, 8, 6, 4).px(3, 12, LIGHT).px(6, 14, LIGHT).px(9, 12, LIGHT).px(12, 14, LIGHT).px(14, 11, LIGHT).px(1, 14, LIGHT),
  asField: (g: Pen) => diamond(g.ring(8, 9, 6, NAVY).ring(8, 9, 7, BLUE).px(8, 9, SKIN), 8, 3),
  asWave: (g: Pen) => fist(g, 4, 8, 3).line(9, 3, 12, 8, LIGHT).line(12, 8, 9, 13, LIGHT).line(12, 2, 15, 8, BLUE).line(15, 8, 12, 14, BLUE),
  asUlt: (g: Pen) => fist(fist(fist(fist(g, 3, 4, 2), 13, 4, 2), 3, 12, 2), 13, 12, 2).disc(8, 8, 2, GOLD).ring(8, 8, 4, BLUE),
  asRapid: (g: Pen) => fist(fist(fist(g, 4, 5, 2), 9, 8, 2), 13, 11, 2).line(1, 9, 5, 9, LIGHT).line(4, 13, 8, 13, LIGHT),
  asDemon: (g: Pen) => g.disc(8, 8, 4, RED).disc(8, 8, 2, FIRE).line(2, 2, 5, 5, DRED).line(14, 2, 11, 5, DRED).line(2, 14, 5, 11, DRED).line(14, 14, 11, 11, DRED),
  asIron: (g: Pen) => fist(g, 8, 8, 5, NAVY).line(4, 6, 11, 6, LIGHT).px(5, 10, WHITE).px(9, 10, WHITE),
  asReach: (g: Pen) => fist(g, 11, 8, 3).line(1, 8, 7, 8, LIGHT).line(2, 5, 6, 7, BLUE).line(2, 11, 6, 9, BLUE),
  asFury: (g: Pen) => fist(g, 6, 9, 3).line(11, 3, 11, 13, RED).line(13, 5, 13, 13, RED).line(15, 7, 15, 13, RED),
  asGate: (g: Pen) => g.rect(2, 2, 3, 13, NAVY).rect(11, 2, 3, 13, NAVY).line(2, 2, 13, 2, BLUE).disc(8, 9, 2, LIGHT).ring(8, 9, 4, BLUE),
  asSix: (g: Pen) => g.ring(8, 8, 6, BLUE).px(8, 2, GOLD).px(13, 5, GOLD).px(13, 11, GOLD).px(8, 14, GOLD).px(3, 11, GOLD).px(3, 5, GOLD).disc(8, 8, 1, WHITE),
  asWeight: (g: Pen) => fist(g, 8, 5, 4, DEEP).line(0, 13, 15, 13, NAVY).line(2, 11, 5, 13, LIGHT).line(13, 11, 10, 13, LIGHT).px(8, 11, LIGHT),
  asPress: (g: Pen) => g.line(2, 4, 6, 8, LIGHT).line(6, 8, 2, 12, LIGHT).line(6, 3, 11, 8, BLUE).line(11, 8, 6, 13, BLUE).line(10, 2, 15, 8, DEEP).line(15, 8, 10, 14, DEEP),
  asHell: (g: Pen) => g.disc(8, 10, 4, RED).disc(8, 9, 2, FIRE).line(8, 1, 8, 5, FIRE).line(5, 3, 6, 6, RED).line(11, 3, 10, 6, RED),
  asRage: (g: Pen) => fist(g, 8, 9, 4, DRED).line(3, 2, 5, 5, RED).line(13, 2, 11, 5, RED).px(8, 2, RED),
  asShell: (g: Pen) => diamond(g.rect(3, 3, 10, 10, NAVY).line(3, 3, 12, 3, BLUE).line(3, 12, 12, 12, BLUE).line(3, 3, 3, 12, BLUE).line(12, 3, 12, 12, BLUE), 8, 8, LIGHT),
  asBarrage: (g: Pen) => fist(fist(fist(fist(g, 3, 3, 2), 8, 3, 2), 13, 3, 2), 8, 10, 3).line(1, 14, 15, 14, LIGHT),
  asFlying: (g: Pen) => fist(g, 11, 6, 3).line(1, 12, 7, 7, LIGHT).line(3, 14, 8, 9, BLUE).ring(11, 6, 5, DEEP),
  asSoul: (g: Pen) => g.disc(8, 7, 4, LIGHT).px(7, 6, NAVY).px(9, 6, NAVY).line(6, 11, 8, 15, LIGHT).line(10, 11, 8, 15, LIGHT).px(3, 3, RED).px(13, 3, RED),
  asStep: (g: Pen) => g.rect(3, 11, 4, 3, NAVY).rect(9, 7, 4, 3, NAVY).line(1, 14, 5, 9, LIGHT).line(7, 10, 11, 5, LIGHT).px(14, 3, BLUE),
};
