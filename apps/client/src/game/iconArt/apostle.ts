// 악의 사도 아이콘: 뒤집힌 십자가 8개(죄마다 빛깔) · 사탄의 가면 · 역천의 베드로 · 전용 아이템 10개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import { G, K, Pen } from "./pen";

const BLOOD = "#a8202e";
const SOUL = "#b8f0ff";

/** 뒤집힌 십자가 (세로 막대, 가로 막대는 아래쪽) + 테두리 */
function cross(g: Pen, c: string, x = 8, top = 1): void {
  g.rect(x - 1, top, 3, 14, K).rect(x - 4, top + 8, 9, 3, K);
  g.rect(x, top + 1, 1, 12, c).rect(x - 3, top + 9, 7, 1, c).px(x, top + 1, "#fff");
}

/** 십자가 아래 장판 (타원) */
function field(g: Pen, c: string): void {
  g.rect(2, 13, 12, 2, c).px(1, 14, c).px(14, 14, c);
}

const SIN = (c: string, mark?: (g: Pen) => void) => (g: Pen) => {
  field(g, c);
  cross(g, c);
  mark?.(g);
};

type ApostleWeapon = "invertedCross" | "wrathCross" | "slothCross" | "gluttonyCross" | "envyCross" | "lustCross" | "greedCross" | "prideCross" | "satanMask" | "heresyPeter";
type ApostlePassive = "soulFeast" | "soulMagnet" | "fallenGrail" | "sinWeight" | "longCurse" | "bloodPact" | "blackMass" | "soulBurst" | "apostate" | "malice";

export const APOSTLE_WEAPON_ART: Record<ApostleWeapon & WeaponId, (g: Pen) => void> = {
  invertedCross: (g) => {
    // 목걸이 줄 + 뒤집힌 십자가
    g.line(2, 1, 8, 4, "#8a8090").line(14, 1, 8, 4, "#8a8090");
    cross(g, "#c8c0d8", 8, 3);
  },
  wrathCross: SIN(BLOOD, (g) => g.px(3, 11, "#ff8a2a").px(12, 10, "#ffd040").px(13, 12, "#ff8a2a")),
  slothCross: SIN("#7ad0ff", (g) => g.px(12, 3, "#fff").px(13, 2, "#fff").px(14, 1, "#fff")),
  gluttonyCross: SIN("#ff9a2a", (g) => g.disc(3, 5, 2, "#ff9a2a").px(3, 8, "#ff9a2a")),
  envyCross: SIN("#9ae84a", (g) => g.px(3, 4, "#9ae84a").px(13, 6, "#9ae84a").px(2, 7, "#d8ffc0")),
  lustCross: SIN("#ff6ab8", (g) => g.px(2, 3, "#ff6ab8").px(4, 3, "#ff6ab8").rect(2, 4, 3, 1, "#ff6ab8").px(3, 5, "#ff6ab8")),
  greedCross: SIN("#ffd040", (g) => g.disc(3, 4, 1.5, G).disc(13, 6, 1.5, G)),
  prideCross: SIN("#9a4aff", (g) => g.ring(12, 4, 2, "#c8a0ff").px(12, 4, "#fff")),
  satanMask: (g) => {
    g.disc(8, 8, 6, "#1a1020").ring(8, 8, 6, BLOOD);
    g.rect(4, 6, 3, 2, BLOOD).rect(9, 6, 3, 2, BLOOD).line(5, 11, 11, 11, BLOOD).px(6, 12, "#fff").px(10, 12, "#fff");
    g.line(3, 3, 1, 0, BLOOD).line(13, 3, 15, 0, BLOOD);
  },
  heresyPeter: (g) => {
    g.px(4, 4, "#2a8aff").line(3, 9, 5, 2, "#6ad8ff").line(5, 9, 3, 3, "#2a8aff").disc(4, 10, 2, "#6ad8ff");
    cross(g, "#6ad8ff", 10, 1);
  },
};

/** 영혼 불꽃 (작게) */
function soul(g: Pen, x: number, y: number, c = SOUL): void {
  g.disc(x, y, 2, c).px(x, y - 3, c).px(x - 1, y - 2, c).px(x, y, "#fff");
}

export const APOSTLE_PASSIVE_ART: Record<ApostlePassive & PassiveId, (g: Pen) => void> = {
  soulFeast: (g) => {
    soul(g, 8, 6);
    g.rect(3, 11, 10, 3, BLOOD).line(3, 10, 12, 10, "#e8e0f0").px(5, 12, "#fff").px(10, 12, "#fff");
  },
  soulMagnet: (g) => {
    soul(g, 12, 5);
    soul(g, 4, 4);
    g.line(2, 14, 6, 10, K).line(6, 10, 10, 14, K).px(2, 14, BLOOD).px(10, 14, BLOOD);
  },
  fallenGrail: (g) => {
    g.rect(4, 3, 8, 4, G).rect(5, 7, 6, 1, G).rect(7, 8, 2, 4, G).rect(5, 12, 6, 2, G);
    g.rect(5, 4, 6, 2, BLOOD).px(10, 8, BLOOD).px(10, 10, BLOOD);
  },
  sinWeight: (g) => {
    cross(g, "#c8c0d8", 8, 0);
    g.rect(1, 13, 14, 3, "#5a2a6a").px(3, 12, "#9a4aff").px(12, 12, "#9a4aff");
  },
  longCurse: (g) => {
    g.ring(8, 8, 6, "#9a4aff").line(8, 8, 8, 4, "#e8e0f0").line(8, 8, 12, 8, "#e8e0f0").px(8, 8, BLOOD);
  },
  bloodPact: (g) => {
    g.rect(3, 2, 9, 12, "#e8d8b8").line(4, 4, 10, 4, K).line(4, 6, 9, 6, K).line(4, 8, 10, 8, K);
    g.disc(10, 12, 2, BLOOD).px(13, 13, BLOOD);
  },
  blackMass: (g) => {
    g.rect(4, 7, 2, 7, "#e8e0f0").rect(10, 7, 2, 7, "#e8e0f0").px(5, 5, "#ff8a2a").px(11, 5, "#ff8a2a");
    g.px(5, 6, "#ffd040").px(11, 6, "#ffd040").ring(8, 10, 3, "#3a1838");
  },
  soulBurst: (g) => {
    soul(g, 8, 9);
    g.px(2, 3, SOUL).px(14, 3, SOUL).px(2, 14, SOUL).px(14, 14, SOUL).px(8, 1, "#fff").px(1, 8, "#fff").px(15, 8, "#fff");
  },
  apostate: (g) => {
    g.disc(8, 5, 3, "#c8a888").rect(4, 9, 8, 6, "#2a1830").px(7, 4, BLOOD).px(9, 4, BLOOD);
    cross(g, BLOOD, 8, 8);
  },
  malice: (g) => {
    g.disc(8, 8, 5, "#3a1838").px(6, 7, BLOOD).px(10, 7, BLOOD).line(5, 10, 11, 10, BLOOD);
    g.line(4, 4, 2, 1, BLOOD).line(12, 4, 14, 1, BLOOD).px(8, 14, "#ff8a2a");
  },
};
