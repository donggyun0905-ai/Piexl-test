// 히든 아이템 아이콘 (차원의 순례자 히든 상점): 보랏빛 차원 틀 안에 14×14 글자 판 그림(iconArt/hiddenGrids) · 아티팩트 7색은 색만 다른 깎인 결정
import type { Pen } from "./pen";

import { HIDDEN_GRIDS, RELIC_PAL, RELIC_ROWS, type Grid } from "./hiddenGrids";

/** 글자 판 그림 (틀 안쪽 1칸부터) */
function grid(g: Pen, { rows, pal }: Grid): void {
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = pal[row[x]!];
      if (c) g.px(x + 1, y + 1, c);
    }
  });
}

/** 금기된 아티팩트: 금속 받침 위 깎인 결정 (색마다) */
function relic(g: Pen, c: string, light: string, dark: string): void {
  grid(g, { rows: RELIC_ROWS, pal: { ...RELIC_PAL, c, l: light, d: dark, s: light } });
}

export const RELIC_COLORS: Record<string, [string, string]> = {
  relicRed: ["#e03a3a", "#ff9a8a"],
  relicBlue: ["#3a7ae0", "#9ac8ff"],
  relicSilver: ["#a8b0c0", "#f0f4ff"],
  relicGold: ["#e0b030", "#fff0a0"],
  relicPrism: ["#c060e0", "#80f0ff"],
  relicWhite: ["#e8e8f0", "#ffffff"],
  relicGreen: ["#3ac060", "#a8ffb8"],
};
const RELIC_DARK: Record<string, string> = { relicRed: "#8a1a1a", relicBlue: "#1a3a8a", relicSilver: "#5a6070", relicGold: "#8a6010", relicPrism: "#6a2a8a", relicWhite: "#9a9ab0", relicGreen: "#1a6a30" };

export const HIDDEN_ART: Record<string, (g: Pen) => void> = {
  ...Object.fromEntries(Object.entries(RELIC_COLORS).map(([id, [c, l]]) => [id, (g: Pen) => relic(g, c, l, RELIC_DARK[id]!)])),
  // 화려한 아티팩트: 결정 안에 무지개 줄
  relicPrism: (g) => {
    relic(g, "#c060e0", "#80f0ff", "#6a2a8a");
    g.px(6, 6, "#ffe060").px(7, 7, "#60ff90").px(8, 7, "#60c8ff").px(9, 6, "#ff6080").px(7, 8, "#ffe060");
  },
  ...Object.fromEntries(Object.entries(HIDDEN_GRIDS).map(([id, gr]) => [id, (g: Pen) => grid(g, gr)])),
  // 저주받은 주사위: 위로 솟은 뿔 둘
  cursedDice: (g) => {
    grid(g, HIDDEN_GRIDS.cursedDice!);
    g.px(4, 1, "#c8c0a8").px(3, 0, "#c8c0a8").px(10, 1, "#c8c0a8").px(11, 0, "#c8c0a8");
  },
};

/** 히든 아이템 틀 (보랏빛 차원 테두리) */
export function hiddenFrame(g: Pen): void {
  g.rect(0, 0, 16, 16, "#7a4ad8").rect(1, 1, 14, 14, "#1a1030").px(0, 0, "#d8b8ff").px(15, 15, "#d8b8ff");
}
