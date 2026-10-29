// 히든 아이템 아이콘 (차원의 순례자 히든 상점): 보랏빛 차원 틀 안에 그림 · 아티팩트 7색은 색만 다른 빛나는 결정
import type { Pen } from "./pen";

const W = "#ffffff";

/** 금기된 아티팩트: 금속 받침 위 빛나는 결정 (색마다) */
function relic(g: Pen, c: string, light: string): void {
  g.rect(4, 12, 8, 2, "#6a5a48").rect(5, 11, 6, 1, "#8a7a60");
  for (let y = 3; y <= 10; y++) {
    const half = y < 7 ? y - 2 : 11 - y;
    g.rect(8 - half, y, half * 2, 1, c);
  }
  g.line(8, 3, 8, 10, light).px(6, 6, W).px(7, 5, W);
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

export const HIDDEN_ART: Record<string, (g: Pen) => void> = {
  ...Object.fromEntries(Object.entries(RELIC_COLORS).map(([id, [c, l]]) => [id, (g: Pen) => relic(g, c, l)])),
  // 화려한 아티팩트: 결정 안에 무지개 줄
  relicPrism: (g) => {
    relic(g, "#c060e0", "#80f0ff");
    g.px(7, 7, "#ffe060").px(8, 8, "#60ff90").px(9, 7, "#ff6080");
  },
  ifritClaw: (g) => {
    g.line(4, 3, 7, 12, "#ff6a20").line(7, 3, 9, 12, "#ff8a30").line(10, 3, 11, 12, "#ffb040").px(7, 12, "#fff0a0").px(9, 12, "#fff0a0").px(11, 12, "#fff0a0").rect(3, 12, 10, 2, "#6a2a1a");
  },
  sylphQuiver: (g) => {
    g.rect(5, 4, 5, 10, "#4a8a6a").rect(5, 4, 5, 1, "#8af0c0").line(7, 1, 7, 4, "#c8c8d8").line(9, 2, 9, 4, "#c8c8d8").px(7, 1, "#8af0c0").px(9, 2, "#8af0c0").ring(11, 9, 3, "#c8fff0");
  },
  gnomeHammer: (g) => {
    g.rect(3, 3, 10, 5, "#8a7060").rect(3, 3, 10, 1, "#b8a080").rect(7, 8, 2, 7, "#6a4a2a").px(4, 5, "#4a3a30").px(11, 5, "#4a3a30");
  },
  dryadOrb: (g) => {
    g.disc(8, 8, 5, "#3ab060").disc(8, 8, 3, "#8af0a0").px(6, 6, W).rect(5, 13, 6, 2, "#5a3a1a").line(3, 11, 5, 13, "#3a8a3a").line(13, 11, 11, 13, "#3a8a3a");
  },
  aphroditeMirror: (g) => {
    g.disc(8, 6, 4, "#e8a8c8").disc(8, 6, 3, "#c8f0ff").px(7, 5, W).rect(7, 10, 2, 4, "#e0b040").rect(5, 14, 6, 1, "#e0b040").px(4, 3, "#ff80c0").px(12, 3, "#ff80c0");
  },
  godShard: (g) => {
    g.line(8, 1, 12, 8, "#fff0a0").line(12, 8, 8, 15, "#ffd040").line(8, 15, 4, 8, "#ffd040").line(4, 8, 8, 1, "#fff0a0").disc(8, 8, 2, W).px(2, 3, "#fff0a0").px(14, 12, "#fff0a0");
  },
  aetherBomb: (g) => {
    g.disc(8, 9, 5, "#5a2a8a").disc(8, 9, 3, "#b060ff").px(6, 7, "#f0c0ff").line(10, 4, 12, 2, W).px(13, 1, "#c080ff");
  },
  forbiddenScroll: (g) => {
    g.rect(3, 4, 10, 9, "#e8d8b0").rect(2, 3, 12, 2, "#8a3a2a").rect(2, 12, 12, 2, "#8a3a2a").disc(8, 8, 2, "#ff5a2a").px(8, 8, "#ffe0a0").line(5, 6, 6, 6, "#6a4a3a").line(10, 10, 11, 10, "#6a4a3a");
  },
  blizzardLance: (g) => {
    for (let i = 0; i < 3; i++) g.line(3 + i * 4, 14, 6 + i * 4, 2, "#9ad8ff").px(6 + i * 4, 2, "#ffffff");
    g.rect(2, 13, 13, 2, "#4a7aa8");
  },
  fallenWings: (g) => {
    g.line(7, 4, 2, 2, "#fff6d8").line(7, 6, 1, 6, "#fff6d8").line(7, 8, 2, 11, "#e8d8a8").line(9, 4, 14, 2, "#fff6d8").line(9, 6, 15, 6, "#fff6d8").line(9, 8, 14, 11, "#e8d8a8").rect(7, 4, 2, 7, "#ffd060");
  },
  petFlute: (g) => {
    g.line(3, 12, 13, 3, "#c89a5a").line(4, 12, 13, 4, "#a8783a").px(6, 9, "#3a2a1a").px(8, 7, "#3a2a1a").px(10, 5, "#3a2a1a").px(13, 1, "#ff8ab8").px(14, 2, "#ff8ab8").px(1, 9, "#ffd8e8");
  },
  portalGun: (g) => {
    g.rect(2, 7, 9, 4, "#e8e8f0").rect(10, 6, 3, 6, "#5a6272").disc(13, 9, 2, "#3ad0ff").rect(4, 11, 2, 3, "#5a6272").px(14, 9, "#ffffff");
  },
  fateDice: (g) => {
    g.rect(3, 3, 10, 10, "#f2ecdc").rect(3, 12, 10, 1, "#c8c0a8").px(5, 5, "#e03a3a").px(8, 8, "#e03a3a").px(10, 10, "#e03a3a").px(10, 5, "#e03a3a").px(5, 10, "#e03a3a");
  },
  cursedDice: (g) => {
    g.rect(3, 3, 10, 10, "#2a1a30").rect(3, 12, 10, 1, "#140a18").px(5, 5, "#ff3a5a").px(8, 8, "#ff3a5a").px(10, 10, "#ff3a5a").line(2, 2, 4, 4, "#8a3aa8").line(13, 2, 11, 4, "#8a3aa8").px(8, 1, "#ff3a5a");
  },
  terraform: (g) => {
    g.disc(8, 8, 6, "#3a7ad0").rect(4, 5, 4, 3, "#5ab05a").rect(9, 9, 4, 3, "#c8a050").rect(6, 11, 3, 2, "#5ab05a").px(5, 4, "#ffffff");
  },
  dimensionGate: (g) => {
    g.ring(8, 8, 6, "#8a5aff").ring(8, 8, 4, "#c8a8ff").disc(8, 8, 2, "#1a0a30").px(8, 8, W).px(2, 2, "#c8a8ff").px(13, 13, "#c8a8ff");
  },
};

/** 히든 아이템 틀 (보랏빛 차원 테두리) */
export function hiddenFrame(g: Pen): void {
  g.rect(0, 0, 16, 16, "#7a4ad8").rect(1, 1, 14, 14, "#1a1030").px(0, 0, "#d8b8ff").px(15, 15, "#d8b8ff");
}
