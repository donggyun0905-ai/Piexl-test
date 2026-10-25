// 장수 아이콘: 옛 명장 무기 11개(창·극·월도·검) · 전용 아이템 12개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { GeneralWeapon } from "../../i18n/items/general";
import { D, G, K, Pen, S, W } from "./pen";

const RED = "#c83a3a";
const JADE = "#3ac88a";
const DARK = "#5a3a2a";

/** 자루 (왼쪽 아래 → 오른쪽 위 대각선, 끝 좌표 반환) */
function pole(g: Pen, len = 12, c = W): [number, number] {
  g.line(1, 15, len, 15 - len + 1, c);
  return [len, 15 - len + 1];
}

/** 대각선 검 (칼날 색·코등이 색) */
function blade(g: Pen, edge: string, guard: string, x0 = 2): void {
  g.line(x0, 14, x0 + 2, 12, DARK).line(x0 + 1, 11, x0 + 4, 14, guard);
  g.line(x0 + 3, 11, 14, 0, edge).line(x0 + 4, 11, 14, 1, D);
}

export const GENERAL_WEAPON_ART: Record<GeneralWeapon & WeaponId, (g: Pen) => void> = {
  trainingSpear: (g) => {
    const [x, y] = pole(g, 11);
    g.line(x, y, x + 3, y - 3, D).px(x - 1, y + 1, "#c8b89a");
  },
  skyHalberd: (g) => {
    const [x, y] = pole(g, 11, RED);
    g.line(x, y, x + 4, y - 4, S);
    // 초승달 날 두 개 (방천화극)
    g.line(x - 3, y - 1, x - 1, y - 3, S).px(x - 3, y, S).line(x + 1, y + 1, x + 3, y + 3, S).px(x + 2, y + 3, S);
    g.px(x - 1, y + 2, G);
  },
  greenDragonBlade: (g) => {
    pole(g, 9, "#3a6a4a");
    g.rect(9, 2, 3, 6, S).rect(12, 1, 2, 4, S).px(10, 1, S).px(9, 7, JADE).px(10, 7, JADE).px(11, 3, JADE);
  },
  serpentSpear: (g) => {
    pole(g, 10, K);
    // 구불구불 뱀 날
    g.px(11, 5, S).px(12, 5, S).px(12, 4, S).px(13, 3, S).px(13, 2, S).px(14, 1, S).px(15, 0, "#fff");
    g.px(9, 7, RED);
  },
  heavenSword: (g) => {
    blade(g, "#fff", G);
    g.px(9, 6, "#c8e0ff");
  },
  twinSwords: (g) => {
    blade(g, S, G, 0);
    blade(g, S, G, 4);
  },
  hwarangSword: (g) => {
    blade(g, S, G);
    g.px(2, 15, "#e0505e").px(1, 15, "#e0505e").px(3, 13, G);
  },
  loneBlade: (g) => {
    g.line(2, 14, 4, 12, DARK).line(3, 11, 6, 14, D);
    g.line(5, 11, 13, 2, S).line(6, 11, 14, 3, S).line(6, 12, 14, 4, D);
  },
  cliffSpear: (g) => {
    const [x, y] = pole(g, 11, "#e8ecf4");
    g.line(x, y, x + 4, y - 4, S).px(x + 1, y - 2, "#fff");
    g.px(x - 1, y + 1, RED).px(x - 2, y + 2, RED).px(x - 1, y + 2, RED);
  },
  twinDragonSword: (g) => {
    blade(g, S, "#3a6ac8");
    g.px(8, 8, "#7ac8ff").px(11, 5, "#7ac8ff");
  },
  gyebaekBlade: (g) => {
    blade(g, S, "#8a6a3a");
    g.px(4, 10, RED).px(13, 2, RED);
  },
};

type GeneralPassive = "hiddenPower" | "redHare" | "ironWall" | "spearMastery" | "warCry" | "bloodBlade" | "momentum" | "armorPierce" | "unbreakable" | "martialSoul" | "loyalty" | "warBanner";

export const GENERAL_PASSIVE_ART: Record<GeneralPassive & PassiveId, (g: Pen) => void> = {
  hiddenPower: (g) => {
    g.disc(8, 8, 5, "#5a1a2a").disc(8, 8, 3, RED).disc(8, 8, 1, G);
    g.px(8, 1, G).px(8, 15, G).px(1, 8, G).px(15, 8, G);
  },
  redHare: (g) => {
    g.rect(3, 7, 9, 4, RED).rect(11, 4, 3, 4, RED).px(13, 3, RED).px(13, 5, K);
    g.rect(4, 11, 1, 3, RED).rect(10, 11, 1, 3, RED).line(1, 7, 3, 8, "#ff9a3c");
  },
  ironWall: (g) => {
    g.rect(2, 3, 12, 10, D).rect(3, 4, 10, 8, S);
    for (let x = 4; x < 13; x += 3) g.rect(x, 4, 1, 8, D);
  },
  spearMastery: (g) => {
    g.line(1, 14, 13, 2, W).line(13, 2, 15, 0, S);
    g.line(14, 14, 2, 2, W).line(2, 2, 0, 0, S);
  },
  warCry: (g) => {
    g.disc(5, 8, 3, "#e8c8a0").rect(7, 7, 2, 3, K);
    g.line(10, 5, 14, 3, G).line(10, 8, 15, 8, G).line(10, 11, 14, 13, G);
  },
  bloodBlade: (g) => {
    blade(g, S, G);
    g.px(10, 5, RED).px(12, 3, RED).px(11, 7, RED).px(12, 8, RED);
  },
  momentum: (g) => {
    g.line(2, 13, 7, 8, "#ff9a3c").line(7, 8, 9, 10, "#ff9a3c").line(9, 10, 14, 3, G).px(13, 2, G).px(14, 4, G).px(12, 3, G);
  },
  armorPierce: (g) => {
    g.rect(4, 4, 8, 9, D).rect(5, 5, 6, 7, S);
    g.line(0, 15, 12, 3, W).line(12, 3, 14, 1, "#fff");
  },
  unbreakable: (g) => {
    g.rect(6, 3, 4, 11, S).rect(4, 5, 8, 3, S).px(7, 9, RED).px(8, 10, RED);
  },
  martialSoul: (g) => {
    g.disc(8, 7, 4, RED).disc(8, 7, 2, G).rect(7, 11, 2, 4, D);
  },
  loyalty: (g) => {
    g.disc(5, 6, 3, RED).disc(10, 6, 3, RED).rect(3, 7, 10, 2, RED);
    for (let i = 0; i < 5; i++) g.rect(4 + i, 9 + i, 8 - 2 * i, 1, RED);
    g.px(8, 6, G).px(7, 7, G).px(9, 7, G);
  },
  warBanner: (g) => {
    g.line(3, 15, 3, 1, W).rect(4, 1, 9, 7, RED).px(8, 4, G).px(7, 3, G).px(9, 5, G);
  },
};
