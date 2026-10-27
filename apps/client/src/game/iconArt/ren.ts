// 렌 아이콘: 맨손(토목 고리를 두른 손) · 전용 아이템 20개 (바위·나무·뿌리·감옥)
import type { Pen } from "./pen";

const ROCK = "#a8a090";
const ROCK_D = "#7a7268";
const WOOD = "#8a6a3a";
const WOOD_D = "#5a4020";
const LEAF = "#5ac84a";
const GOLD = "#ffd040";
const WH = "#ffffff";

/** 흙과 나무가 엉킨 덩어리 */
function clod(g: Pen, x: number, y: number, r: number): void {
  g.disc(x, y, r, ROCK).disc(x - 1, y + 1, Math.max(1, r - 2), ROCK_D).line(x - r, y - 1, x + r, y + 1, WOOD).px(x + 1, y - r + 1, LEAF);
}

export const REN_WEAPON_ART: Record<"renHands", (g: Pen) => void> = {
  renHands: (g) => {
    g.ring(8, 8, 6, WOOD).ring(8, 8, 5, ROCK_D);
    g.rect(6, 6, 4, 6, "#e8c0a0").rect(5, 6, 1, 3, "#e8c0a0").rect(10, 7, 1, 3, "#e8c0a0");
    g.px(8, 2, LEAF).px(13, 8, LEAF).px(3, 9, ROCK);
  },
};

export const REN_PASSIVE_ART = {
  renStone: (g: Pen) => g.disc(8, 8, 5, ROCK).disc(8, 9, 3, "#ff6a8a").px(7, 8, WH),
  renOak: (g: Pen) => g.rect(6, 4, 4, 11, WOOD).rect(7, 4, 1, 11, WOOD_D).disc(8, 4, 4, LEAF),
  renSoil: (g: Pen) => g.rect(1, 10, 14, 4, "#7a5a32").rect(1, 9, 14, 1, LEAF).line(3, 6, 1, 6, WH).line(12, 6, 14, 6, WH),
  renRootPulse: (g: Pen) => g.line(8, 2, 8, 9, WOOD).line(8, 9, 3, 14, WOOD_D).line(8, 9, 13, 14, WOOD_D).ring(8, 5, 2, LEAF),
  renMoss: (g: Pen) => g.rect(3, 9, 10, 4, "#4a8a3a").rect(3, 13, 11, 2, WOOD_D).px(5, 8, LEAF).px(9, 8, LEAF),
  renAmber: (g: Pen) => g.disc(8, 8, 4, "#e8a040").px(7, 7, "#fff0a0").px(9, 9, "#a86a20"),
  renGuardPlus: (g: Pen) => {
    clod(g, 4, 5, 2);
    clod(g, 12, 5, 2);
    clod(g, 8, 12, 2);
    g.px(8, 7, WH);
  },
  renThorn: (g: Pen) => {
    clod(g, 8, 8, 4);
    for (const [x, y] of [[8, 2], [2, 8], [14, 8], [8, 14]]) g.px(x!, y!, LEAF);
  },
  renWall: (g: Pen) => g.rect(2, 4, 12, 9, ROCK).rect(2, 7, 12, 1, ROCK_D).rect(7, 4, 1, 3, ROCK_D).rect(4, 8, 1, 4, ROCK_D).rect(10, 8, 1, 4, ROCK_D),
  renReflect: (g: Pen) => g.rect(3, 3, 3, 10, ROCK).line(14, 4, 7, 8, "#ff6a6a").line(7, 8, 14, 12, GOLD),
  renQuake: (g: Pen) => {
    clod(g, 8, 6, 3);
    g.line(2, 13, 5, 11, ROCK_D).line(5, 11, 8, 14, ROCK_D).line(8, 14, 11, 11, ROCK_D).line(11, 11, 14, 13, ROCK_D);
  },
  renBindLong: (g: Pen) => g.ring(8, 8, 5, WOOD).ring(8, 8, 3, WOOD_D).line(8, 13, 6, 15, WOOD_D).line(8, 13, 10, 15, WOOD_D),
  renEarth: (g: Pen) => {
    // 솟아오르는 흙 덩어리 + 초록 기운 화살
    clod(g, 8, 10, 4);
    g.rect(3, 13, 10, 1, WOOD_D).line(8, 5, 8, 1, "#5ac84a").px(7, 2, "#5ac84a").px(9, 2, "#5ac84a").px(3, 5, "#5ac84a").px(13, 6, "#5ac84a");
  },
  renPrisonDmg: (g: Pen) => {
    for (const x of [3, 6, 9, 12]) g.rect(x, 2, 1, 12, WOOD);
    g.rect(2, 2, 12, 1, WOOD_D).rect(2, 13, 12, 1, WOOD_D).px(7, 7, "#ff6a2a").px(8, 8, "#ff6a2a");
  },
  renBigger: (g: Pen) => clod(g, 8, 8, 6),
  renCollapse: (g: Pen) => {
    clod(g, 4, 4, 2);
    clod(g, 11, 5, 3);
    clod(g, 6, 11, 3);
    g.line(1, 15, 14, 15, ROCK_D);
  },
  renRegrow: (g: Pen) => g.rect(7, 7, 2, 8, WOOD).rect(4, 5, 3, 2, LEAF).rect(9, 3, 3, 2, LEAF).px(8, 6, LEAF),
  renHeavy: (g: Pen) => g.rect(4, 2, 8, 13, WOOD).rect(5, 2, 2, 13, WOOD_D).ring(8, 8, 2, "#c8a060"),
  renCrushStun: (g: Pen) => {
    clod(g, 8, 5, 4);
    g.rect(2, 12, 12, 2, "#3a3446").px(4, 11, GOLD).px(11, 11, GOLD);
  },
  renBurstPrison: (g: Pen) => {
    for (const x of [4, 8, 12]) g.rect(x, 4, 1, 9, WOOD);
    g.px(2, 2, "#ff9a3a").px(13, 2, "#ff9a3a").px(1, 8, GOLD).px(14, 9, GOLD).px(8, 1, WH);
  },
};
