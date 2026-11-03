// 수집가 아이콘 (16칸 도트): 수집가의 검 · 수집 무기 30 (보내 준 무기 그림의 색·모양을 따라 작게 다시 찍음)
import { bow, crossbow, G, K, type Pen } from "./pen";

const IRON = "#3a3446";
const BLUE_GEM = "#5ab0ff";
const RED_GEM = "#ff3a48";

/** 빛나는 둘레 점 (아이콘 귀퉁이 반짝임) */
function glint(g: Pen, c: string, pts: readonly (readonly [number, number])[]): void {
  for (const [x, y] of pts) g.px(x, y, c);
}

/** 대각선 검: 자루(왼쪽 아래) → 날(오른쪽 위) · 날 두 줄 · 코등이 · 가운데 보석 */
function blade(g: Pen, edge: string, body: string, guard = G, gem = BLUE_GEM, len = 9): void {
  g.line(2, 14, 4, 12, "#5a3a2a").px(1, 15, guard);
  g.line(3, 10, 7, 14, guard).px(5, 12, gem);
  for (let i = 0; i < len; i++) {
    g.px(6 + i, 10 - i, edge);
    g.px(6 + i, 11 - i, body);
    g.px(7 + i, 11 - i, body);
  }
  g.px(6 + len, 10 - len, edge).px(7 + len, 9 - len, edge);
}

/** 지팡이: 대각선 자루 + 위 끝 구슬 (고리를 두르면 ring) */
function rod(g: Pen, wood: string, orb: string, core: string, ring?: string): void {
  g.line(2, 15, 10, 7, wood).line(3, 15, 11, 7, IRON);
  g.disc(12, 4, 3, orb).disc(12, 4, 1, core).px(11, 3, "#ffffff");
  if (ring) g.ring(12, 4, 4, ring);
}

/** 창: 긴 자루 + 마름모 창끝 */
function spear(g: Pen, shaft: string, tip: string, dark: string): void {
  g.line(1, 15, 11, 5, shaft).line(2, 15, 12, 5, dark);
  g.line(11, 4, 15, 0, tip).line(12, 5, 15, 2, tip).px(11, 2, tip).px(13, 5, tip).px(12, 3, "#ffffff");
  g.px(10, 6, G).px(9, 6, G).px(10, 7, G);
}

/** 망치: 자루 + 오른쪽 위 큰 머리 */
function hammer(g: Pen, head: string, dark: string, gem: string): void {
  g.line(2, 15, 9, 8, "#4a3a3a").line(3, 15, 10, 8, IRON);
  g.rect(8, 1, 7, 6, head).rect(8, 6, 7, 1, dark).rect(14, 1, 1, 6, dark);
  g.px(11, 3, gem).px(11, 4, gem).px(12, 3, G).px(10, 4, G);
}

/** 도끼: 자루 + 큰 초승달 날 */
function axe(g: Pen, edge: string, body: string, gem: string): void {
  g.line(3, 15, 11, 3, "#3a2a3a").line(4, 15, 12, 3, IRON);
  for (let y = 1; y <= 9; y++) {
    const w = 4 - Math.abs(y - 5) * 0.6;
    for (let x = 0; x < w; x++) g.px(12 + x, y, body);
    g.px(12 + Math.round(w), y, edge);
  }
  g.px(10, 5, gem).px(11, 4, G);
}

/** 활 + 화살 (색) */
function bowWith(g: Pen, wood: string, glow: string): void {
  bow(g, 3, 8, 7, wood);
  g.line(5, 8, 14, 8, "#d8c8a0").px(15, 8, glow).px(14, 7, glow).px(14, 9, glow);
  glint(g, glow, [[6, 1], [6, 15], [8, 2], [8, 14]]);
}

/** 마법서: 표지 · 금 테두리 · 가운데 무늬 */
function tome(g: Pen, cover: string, mark: string, core: string): void {
  g.rect(3, 2, 10, 12, cover).rect(13, 3, 1, 11, "#e8e0c8").rect(3, 14, 10, 1, K);
  g.line(3, 2, 12, 2, G).line(3, 13, 12, 13, G).line(3, 2, 3, 13, G);
  g.disc(8, 8, 2, mark).px(8, 8, core);
}

export const CL_WEAPON_ART = {
  clBlade: (g: Pen) => blade(g, "#ffffff", "#c8d0e0", G, BLUE_GEM),
};

export const CL_PASSIVE_ART = {
  clHolySword: (g: Pen) => {
    blade(g, "#ffffff", "#f0f0ff", G, BLUE_GEM);
    glint(g, "#ffe9a0", [[14, 5], [10, 1], [15, 2]]);
  },
  clBloodSword: (g: Pen) => blade(g, "#ff8a8a", "#a01a2a", "#5a1a2a", RED_GEM),
  clIceSword: (g: Pen) => {
    blade(g, "#e8f8ff", "#6ab8ff", "#8ad8ff", "#ffffff");
    glint(g, "#bfefff", [[14, 6], [9, 2]]);
  },
  clSunSword: (g: Pen) => {
    blade(g, "#fff4c0", "#ffc040", G, BLUE_GEM);
    g.ring(5, 11, 3, "#ffd060");
  },
  clVoidSword: (g: Pen) => {
    blade(g, "#e0b0ff", "#6a2ab0", "#3a2a5a", "#c060ff");
    glint(g, "#a860ff", [[13, 6], [9, 3], [15, 4]]);
  },
  clChainCleaver: (g: Pen) => {
    g.line(2, 15, 5, 12, "#5a3a2a").px(4, 12, G);
    for (let i = 0; i < 9; i++) g.line(5 + i, 11 - i, 8 + i, 13 - i, i % 3 === 0 ? "#a8a098" : "#c8c0b8");
    g.line(13, 1, 15, 4, "#f0f0f0");
    glint(g, "#8a8a92", [[1, 9], [2, 10], [1, 11], [2, 12]]);
  },
  clKatana: (g: Pen) => {
    g.line(2, 15, 5, 12, "#2a1a1a").px(3, 14, RED_GEM).px(4, 13, RED_GEM);
    g.rect(5, 11, 2, 2, G);
    for (let i = 0; i < 9; i++) g.px(7 + i, 10 - i - (i > 5 ? 1 : 0), "#e8e8f0").px(7 + i, 11 - i, "#8a1a2a");
  },
  clSunStaff: (g: Pen) => rod(g, "#3a3a6a", "#ffd060", "#5ab0ff", G),
  clVoidStaff: (g: Pen) => rod(g, "#3a2a4a", "#7a2ad8", "#ffb0ff", "#5a3a6a"),
  clVineStaff: (g: Pen) => {
    rod(g, "#6a4a2a", "#3ac85a", "#c8ffc0");
    glint(g, "#5ad86a", [[5, 13], [7, 10], [9, 9], [4, 11]]);
  },
  clWhiteBow: (g: Pen) => bowWith(g, "#f0ecdc", "#8ad8ff"),
  clBloodBow: (g: Pen) => bowWith(g, "#a01a2a", RED_GEM),
  clIceBow: (g: Pen) => bowWith(g, "#9ad8ff", "#e8f8ff"),
  clGoldBow: (g: Pen) => bowWith(g, G, "#fff4a0"),
  clCrossbow: (g: Pen) => crossbow(g, "#6a4a2a", "#e0a860"),
  clPistol: (g: Pen) => {
    g.rect(4, 4, 11, 2, "#e8e0c8").rect(4, 6, 11, 2, "#c8c0a8").rect(14, 4, 1, 4, K);
    g.rect(3, 4, 2, 5, G).line(3, 9, 1, 14, "#8a5a2a").line(4, 9, 2, 14, "#a87a4a").px(6, 9, IRON).px(7, 10, IRON);
  },
  clStarTome: (g: Pen) => {
    tome(g, "#1a2a6a", G, "#5ab0ff");
    glint(g, G, [[5, 4], [11, 4], [5, 11], [11, 11]]);
  },
  clEyeTome: (g: Pen) => {
    tome(g, "#3a2a3a", "#c050ff", "#ffffff");
    g.px(8, 8, "#1a0a1a").px(6, 8, "#ffd0ff").px(10, 8, "#ffd0ff");
  },
  clGoldFist: (g: Pen) => {
    g.rect(4, 3, 9, 7, G).rect(4, 3, 9, 1, "#fff0a0").rect(5, 10, 7, 4, "#c8901a");
    g.line(6, 4, 6, 8, "#c8901a").line(9, 4, 9, 8, "#c8901a");
    g.disc(8, 11, 1, RED_GEM).rect(4, 14, 9, 1, "#8a5a1a");
  },
  clClaw: (g: Pen) => {
    g.rect(4, 6, 7, 8, "#3a2a3a").rect(4, 6, 7, 1, "#6a5a7a");
    for (const x of [5, 8, 11]) g.line(x, 6, x + 3, 1, "#d8c8ff").px(x + 3, 0, "#c060ff");
    g.px(7, 10, "#ff40c0");
  },
  clBlueSpear: (g: Pen) => spear(g, "#2a3a6a", "#e8f0ff", "#1a1a3a"),
  clRedSpear: (g: Pen) => spear(g, "#6a1a2a", "#ff6070", "#2a0a1a"),
  clIceSpear: (g: Pen) => spear(g, "#4a8ad8", "#e8f8ff", "#2a5a9a"),
  clGoldSpear: (g: Pen) => spear(g, "#c8901a", "#fff4c0", "#8a5a1a"),
  clStoneHammer: (g: Pen) => hammer(g, "#d8d0c0", "#8a8478", BLUE_GEM),
  clBloodHammer: (g: Pen) => hammer(g, "#8a2a2a", "#4a1a1a", RED_GEM),
  clBlueAxe: (g: Pen) => axe(g, "#e8f4ff", "#7ab0e8", BLUE_GEM),
  clRedAxe: (g: Pen) => axe(g, "#ffd0c0", "#d83a2a", RED_GEM),
  clScythe: (g: Pen) => {
    g.line(4, 15, 9, 4, "#3a2a4a").line(5, 15, 10, 4, IRON);
    g.disc(9, 4, 2, "#e8e0d0").px(8, 4, K).px(10, 4, K);
    for (let i = 0; i < 6; i++) g.px(10 + i, 3 + Math.round(i * i * 0.15), "#c890ff").px(10 + i, 2 + Math.round(i * i * 0.15), "#f0d8ff");
    glint(g, "#a860ff", [[2, 7], [3, 9], [1, 11]]);
  },
  clCrescent: (g: Pen) => {
    g.ring(8, 8, 6, "#8ab8ff").ring(8, 8, 5, "#e8f4ff");
    g.line(4, 12, 12, 4, G).disc(8, 8, 1, BLUE_GEM);
  },
};
