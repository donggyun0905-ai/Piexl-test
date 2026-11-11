// 실베르 백인장 아이콘: 붉은 초승달 검격·은빛 드릴·기계 날개 · 무기 1 (혈월 쌍검) · 전용 아이템 20
import type { Pen } from "./pen";

const RED = "#ff2a3a";
const DEEP = "#8a0a1a";
const LIGHT = "#ffb0b8";
const WHITE = "#fff4f4";
const STEEL = "#c8ccd8";
const DARK = "#3a3440";

/** 초승달 검격 (가운데 cx, cy · 오른쪽으로 볼록) */
function moon(g: Pen, cx: number, cy: number, r = 5, col = RED): Pen {
  return g.line(cx - 1, cy - r, cx + 2, cy - 2, col).line(cx + 2, cy - 2, cx + 2, cy + 2, col).line(cx + 2, cy + 2, cx - 1, cy + r, col).px(cx + 1, cy, WHITE);
}
/** 미니 드릴 드론 (오른쪽을 봄) */
function drill(g: Pen, x: number, y: number): Pen {
  return g.rect(x, y - 1, 3, 3, STEEL).px(x + 1, y, RED).line(x + 3, y, x + 5, y, WHITE).px(x - 1, y, DARK);
}
/** 날개 한 쌍 (가운데 cx, cy) */
function wings(g: Pen, cx: number, cy: number, col = RED): Pen {
  return g.line(cx - 1, cy, cx - 6, cy - 4, col).line(cx - 1, cy + 1, cx - 6, cy + 3, col).line(cx + 1, cy, cx + 6, cy - 4, col).line(cx + 1, cy + 1, cx + 6, cy + 3, col).px(cx, cy, WHITE);
}

export const BJ_WEAPON_ART = {
  bjBlades: (g: Pen) => g.line(2, 13, 12, 3, STEEL).line(13, 13, 3, 3, STEEL).line(11, 3, 13, 2, RED).line(4, 3, 2, 2, RED).px(2, 13, DARK).px(13, 13, DARK).px(8, 8, WHITE),
};

export const BJ_PASSIVE_ART = {
  bjFlurry: (g: Pen) => moon(moon(g, 4, 8, 5), 10, 8, 5, LIGHT).line(1, 3, 14, 12, DEEP).px(14, 3, WHITE),
  bjSpin: (g: Pen) => g.ring(8, 8, 6, RED).ring(8, 8, 4, DEEP).px(8, 2, WHITE).px(14, 8, WHITE).px(8, 14, WHITE).px(2, 8, WHITE).px(8, 8, LIGHT),
  bjDash: (g: Pen) => g.line(1, 8, 13, 8, RED).line(3, 6, 12, 6, DEEP).line(3, 10, 12, 10, DEEP).line(11, 5, 15, 8, WHITE).line(15, 8, 11, 11, WHITE),
  bjRain: (g: Pen) => wings(g, 8, 3).line(3, 7, 5, 13, RED).line(7, 7, 8, 14, LIGHT).line(11, 7, 12, 13, RED).px(14, 9, LIGHT).px(1, 10, LIGHT),
  bjNeedle: (g: Pen) => drill(drill(drill(g, 2, 3), 6, 8), 2, 13).ring(13, 8, 2, RED),
  bjSpear: (g: Pen) => g.line(1, 8, 14, 8, WHITE).line(2, 6, 5, 10, RED).line(6, 6, 9, 10, RED).line(10, 6, 12, 10, RED).line(12, 5, 15, 8, STEEL).line(15, 8, 12, 11, STEEL),
  bjShock: (g: Pen) => wings(g, 8, 7, STEEL).line(1, 12, 6, 14, RED).line(15, 12, 10, 14, RED).line(0, 9, 2, 11, DEEP).line(15, 9, 13, 11, DEEP),
  bjEye: (g: Pen) => g.ring(8, 8, 6, RED).line(3, 8, 8, 5, LIGHT).line(8, 5, 13, 8, LIGHT).line(13, 8, 8, 11, LIGHT).line(8, 11, 3, 8, LIGHT).disc(8, 8, 1, RED).px(8, 0, WHITE).px(8, 15, WHITE),
  bjPrison: (g: Pen) => g.line(3, 4, 3, 14, STEEL).line(6, 3, 6, 14, STEEL).line(10, 3, 10, 14, STEEL).line(13, 4, 13, 14, STEEL).line(2, 14, 14, 14, RED).line(3, 8, 13, 10, DEEP).px(8, 1, RED),
  bjReaper: (g: Pen) => g.line(8, 1, 8, 15, RED).line(1, 8, 15, 8, RED).line(3, 3, 13, 13, LIGHT).line(13, 3, 3, 13, LIGHT).disc(8, 8, 1, WHITE),
  bjEnd: (g: Pen) => wings(wings(g, 8, 5), 8, 9, DEEP).line(8, 1, 8, 15, WHITE).line(5, 5, 11, 5, LIGHT),
  bjFleet: (g: Pen) => drill(drill(drill(drill(g, 1, 3), 9, 3), 1, 8), 9, 8).line(3, 13, 12, 13, RED).px(8, 11, WHITE),
  bjHeat: (g: Pen) => drill(g, 5, 9).line(4, 2, 5, 5, RED).line(8, 1, 8, 5, LIGHT).line(12, 2, 11, 5, RED).line(2, 13, 13, 13, DEEP),
  bjStain: (g: Pen) => g.disc(8, 10, 3, RED).line(8, 2, 6, 7, RED).line(8, 2, 10, 7, RED).px(7, 9, WHITE).px(3, 13, DEEP).px(13, 12, DEEP),
  bjShare: (g: Pen) => drill(drill(g.ring(11, 8, 3, RED).px(11, 8, WHITE), 1, 4), 1, 12).line(6, 5, 8, 7, LIGHT).line(6, 11, 8, 9, LIGHT),
  bjChain: (g: Pen) => g.ring(4, 8, 3, RED).ring(8, 8, 3, LIGHT).ring(12, 8, 3, RED).line(1, 13, 14, 13, DEEP).px(15, 13, WHITE),
  bjWane: (g: Pen) => moon(moon(g, 3, 8, 5, DEEP), 9, 8, 6).line(13, 8, 15, 8, WHITE).px(14, 5, LIGHT).px(14, 11, LIGHT),
  bjOverload: (g: Pen) => wings(g, 8, 8).line(9, 1, 6, 7, WHITE).line(6, 7, 10, 8, WHITE).line(10, 8, 7, 14, WHITE),
  bjPact: (g: Pen) => g.line(11, 2, 5, 14, STEEL).line(11, 2, 5, 3, RED).line(5, 3, 2, 6, RED).disc(11, 11, 2, RED).px(11, 11, WHITE),
  bjSteel: (g: Pen) => wings(g.rect(6, 5, 5, 7, DARK).line(6, 5, 10, 5, STEEL).line(8, 6, 8, 10, LIGHT), 8, 8, STEEL),
};
