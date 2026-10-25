// 베두인 아이콘: 사막의 대륜(큰 고리 칼날) · 전용 아이템 20개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import { D, G, K, Pen, S } from "./pen";

const SAND = "#e8c070";
const DUNE = "#c8904a";
const SKY = "#7ac8ff";
const FIRE = "#ff7a2a";

/** 큰 고리 칼날 (가운데 cx·cy, 반지름 r) */
function chakram(g: Pen, cx: number, cy: number, r: number, edge = S, grip = G): void {
  g.ring(cx, cy, r, edge).ring(cx, cy, r - 1, D);
  for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const) g.px(cx + dx * (r + 1), cy + dy * (r + 1), edge);
  if (r > 3) g.rect(cx - 1, cy - r + 2, 2, 1, grip).rect(cx - 1, cy + r - 2, 2, 1, grip);
}

/** 모래 줄 (휘날림) */
function sand(g: Pen, y: number, x0 = 1, x1 = 14, c = SAND): void {
  g.line(x0, y, x1, y - 2, c);
}

export const BEDOUIN_WEAPON_ART: Record<"sandChakram" & WeaponId, (g: Pen) => void> = {
  sandChakram: (g) => {
    chakram(g, 8, 8, 6);
    g.px(4, 4, "#fff").px(5, 3, "#fff");
  },
};

type BedouinPassive =
  | "returnWind" | "mirageStep" | "desertMirage" | "sunWarrior" | "accumulate" | "sandstorm" | "scorchBlade" | "duneRush" | "oasis" | "heatHaze"
  | "scarabCharm" | "whirlRing" | "spinMaster" | "farThrow" | "reboundRing" | "sandVeil" | "quickCatch" | "mirageDouble" | "nomadSpirit" | "desertKing";

export const BEDOUIN_PASSIVE_ART: Record<BedouinPassive & PassiveId, (g: Pen) => void> = {
  returnWind: (g) => {
    chakram(g, 10, 8, 3);
    g.line(2, 4, 6, 3, SKY).line(6, 3, 5, 6, SKY).line(2, 12, 7, 13, SKY);
  },
  mirageStep: (g) => {
    for (let i = 0; i < 3; i++) g.rect(2 + i * 4, 9 - i, 3, 2, i === 2 ? SAND : "#a8885a");
    sand(g, 14);
  },
  desertMirage: (g) => {
    chakram(g, 8, 6, 3);
    chakram(g, 3, 11, 2, "#c8e0ff", SKY);
    chakram(g, 13, 11, 2, "#c8e0ff", SKY);
  },
  sunWarrior: (g) => {
    g.disc(8, 8, 3, G);
    for (const [x, y] of [[8, 2], [8, 14], [2, 8], [14, 8], [4, 4], [12, 12], [12, 4], [4, 12]] as const) g.px(x, y, FIRE);
  },
  accumulate: (g) => {
    for (let i = 0; i < 4; i++) g.rect(2 + i * 3, 11 - i * 2, 2, 3 + i * 2, i === 3 ? G : SAND);
  },
  sandstorm: (g) => {
    g.ring(8, 8, 6, SAND).ring(8, 8, 4, DUNE).ring(8, 8, 2, SAND).px(8, 8, "#fff");
  },
  scorchBlade: (g) => {
    chakram(g, 8, 9, 4, "#ffd040", FIRE);
    g.px(7, 2, FIRE).px(9, 3, "#ffd040").px(12, 4, FIRE);
  },
  duneRush: (g) => {
    // 무희의 춤: 빙글 도는 분홍 비단 + 팔 벌려 도는 무희
    g.ring(8, 8, 7, "#e86a9a").ring(8, 8, 5, SAND);
    g.line(4, 7, 12, 6, "#f2c14e").line(8, 6, 8, 11, "#5a3a7a").line(8, 11, 6, 14, "#5a3a7a").line(8, 11, 11, 13, "#5a3a7a");
    g.disc(8, 4, 1.5, "#c8904a").px(2, 3, "#fff").px(13, 12, "#fff");
  },
  oasis: (g) => {
    g.rect(2, 11, 12, 3, SAND).rect(4, 11, 8, 2, SKY);
    g.line(8, 11, 8, 4, DUNE).line(4, 4, 12, 4, "#5ab86a").px(5, 5, "#5ab86a").px(11, 5, "#5ab86a");
  },
  heatHaze: (g) => {
    for (let i = 0; i < 3; i++) for (let x = 2; x < 14; x++) g.px(x, 4 + i * 4 + (x % 4 < 2 ? 0 : 1), i === 1 ? FIRE : "#ffd8a0");
  },
  scarabCharm: (g) => {
    g.disc(8, 9, 4, "#3aa8a0").line(8, 5, 8, 13, K).px(8, 4, "#2a6a68").px(7, 3, "#2a6a68").px(9, 3, "#2a6a68");
    g.px(3, 7, "#3aa8a0").px(13, 7, "#3aa8a0").px(3, 11, "#3aa8a0").px(13, 11, "#3aa8a0").px(6, 7, G);
  },
  whirlRing: (g) => {
    // 잔상 고리: 흐릿한 잔상 둘 뒤로 날아가는 차크람
    g.ring(3, 12, 2, DUNE).ring(6, 9, 2.5, SAND);
    chakram(g, 11, 5, 3.5);
  },
  spinMaster: (g) => {
    g.ring(8, 8, 6, "#fff").ring(8, 8, 5, SAND).disc(8, 8, 2, DUNE);
    g.px(14, 4, "#fff").px(13, 3, "#fff");
  },
  farThrow: (g) => {
    chakram(g, 12, 4, 3);
    g.line(1, 14, 8, 8, SAND).line(2, 15, 9, 9, DUNE);
  },
  reboundRing: (g) => {
    g.rect(14, 1, 2, 14, D);
    g.line(2, 3, 13, 8, SAND).line(13, 8, 2, 13, SAND);
    chakram(g, 4, 13, 2);
  },
  sandVeil: (g) => {
    g.rect(3, 2, 10, 12, "#d8b880").rect(4, 3, 8, 10, SAND);
    for (let y = 4; y < 13; y += 3) g.line(4, y, 11, y + 1, DUNE);
  },
  quickCatch: (g) => {
    chakram(g, 10, 6, 3);
    g.rect(3, 10, 5, 4, "#c88a5a").rect(2, 9, 2, 3, "#c88a5a").px(8, 10, "#c88a5a");
  },
  mirageDouble: (g) => {
    g.rect(3, 5, 4, 8, "#c8e0ff").disc(5, 3, 2, "#c8e0ff");
    g.rect(9, 5, 4, 8, SAND).disc(11, 3, 2, "#e8b890").px(11, 7, FIRE);
  },
  nomadSpirit: (g) => {
    g.line(2, 14, 8, 3, DUNE).line(8, 3, 14, 14, DUNE).line(2, 14, 14, 14, DUNE).line(8, 3, 8, 14, "#a06a3a");
    g.px(8, 1, FIRE).px(9, 2, FIRE);
  },
  desertKing: (g) => {
    chakram(g, 8, 10, 5);
    g.rect(5, 2, 7, 2, G).px(5, 1, G).px(8, 0, G).px(11, 1, G).px(8, 2, "#e0505e");
  },
};
