// 버려진 자들 아이콘: 무기마다 세 아이의 물건(방패 초록·총 빨강·검 파랑)과 그 무기다운 표시 · 전용 아이템 10개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import { D, G, K, Pen, S, W } from "./pen";

const GREEN = "#4ac86a";
const RED = "#e8484a";
const BLUE = "#4a8aff";

/** 작은 방패 (가운데 x, 위 y) */
function shield(g: Pen, x: number, y: number, c = GREEN): void {
  g.rect(x - 2, y, 5, 4, K).rect(x - 1, y + 4, 3, 1, K).px(x, y + 5, K);
  g.rect(x - 1, y + 1, 3, 3, c).px(x, y + 4, c).px(x - 1, y + 1, "#fff");
}
/** 작은 권총 (손잡이 왼쪽 아래, 총구 오른쪽) */
function gun(g: Pen, x: number, y: number, c = RED): void {
  g.rect(x, y, 5, 2, K).rect(x, y + 2, 2, 2, K);
  g.rect(x + 1, y, 4, 1, c).px(x + 1, y + 2, c);
}
/** 작은 검 (대각선) */
function blade(g: Pen, x: number, y: number, c = BLUE, len = 5): void {
  g.px(x, y + len, W).px(x - 1, y + len - 1, G).px(x + 1, y + len + 1, G);
  for (let i = 1; i <= len; i++) g.px(x + i, y + len - i, c);
  g.px(x + len, y, "#fff");
}
/** 셋이 함께 (방패 왼쪽 · 총 오른쪽 위 · 검 오른쪽 아래) */
const TRIO = (mark?: (g: Pen) => void) => (g: Pen) => {
  shield(g, 4, 3);
  gun(g, 9, 2);
  blade(g, 9, 8);
  mark?.(g);
};

type AbWeapon = "streetKids" | "scrapShield" | "twinPistols" | "rooftopRifle" | "brokenBlade" | "ironPipe" | "fireworks" | "rustyChain" | "neonBat" | "lastPromise";
type AbPassive = "alleyBond" | "quickSwap" | "tagStrike" | "eldestShield" | "lastMag" | "rustyEdge" | "grewTogether" | "threeAsOne" | "streetScars" | "backAlleyRun";

export const ABANDONED_WEAPON_ART: Record<AbWeapon & WeaponId, (g: Pen) => void> = {
  streetKids: TRIO((g) => g.px(2, 13, GREEN).px(4, 13, RED).px(6, 13, BLUE)),
  scrapShield: (g) => {
    g.rect(2, 2, 9, 9, K).rect(3, 3, 7, 7, "#6a8a5a").px(4, 4, D).px(8, 7, "#8a6a3a").px(6, 5, D);
    g.rect(4, 11, 5, 1, K).rect(5, 12, 3, 1, K);
    gun(g, 10, 11);
  },
  twinPistols: (g) => {
    gun(g, 2, 4);
    gun(g, 8, 9);
    shield(g, 12, 1);
  },
  rooftopRifle: (g) => {
    g.line(1, 11, 14, 6, K).line(2, 11, 13, 7, RED).rect(6, 7, 3, 1, K).px(7, 6, "#9ad8ff");
    blade(g, 3, 1, BLUE, 4);
  },
  brokenBlade: (g) => {
    g.px(3, 13, W).px(2, 12, G).px(4, 14, G);
    for (let i = 1; i <= 5; i++) g.px(3 + i, 13 - i, BLUE);
    g.px(11, 5, BLUE).px(12, 4, "#fff").px(10, 7, "#c8d8ff");
    shield(g, 12, 9);
  },
  ironPipe: (g) => {
    g.line(2, 14, 12, 2, K).line(3, 14, 13, 2, D).px(12, 2, S).px(13, 3, S);
    shield(g, 4, 2);
  },
  fireworks: (g) => {
    g.disc(10, 5, 2, "#ff9a3c").px(13, 2, "#ffd84a").px(7, 2, "#ff6ad8").px(13, 8, "#9ad8ff").px(6, 7, "#ffd84a");
    gun(g, 2, 11);
  },
  rustyChain: (g) => {
    for (let i = 0; i < 4; i++) g.ring(3 + i * 3, 4 + i * 3, 1, "#a8783a");
    blade(g, 9, 2, BLUE, 4);
  },
  neonBat: (g) => {
    g.line(3, 13, 12, 3, "#ff4ad8").line(4, 13, 13, 3, "#ffa8f0").rect(2, 12, 2, 2, K);
    g.px(12, 2, "#fff").px(14, 4, "#ff4ad8");
  },
  lastPromise: TRIO((g) => g.px(7, 13, "#ff6a8a").px(6, 12, "#ff6a8a").px(8, 12, "#ff6a8a").px(7, 11, "#ff6a8a")),
};

export const ABANDONED_PASSIVE_ART: Record<AbPassive & PassiveId, (g: Pen) => void> = {
  alleyBond: (g) => {
    g.rect(2, 7, 4, 3, GREEN).rect(6, 7, 4, 3, RED).rect(10, 7, 4, 3, BLUE).line(2, 6, 13, 6, K).line(2, 10, 13, 10, K);
  },
  quickSwap: (g) => {
    g.line(3, 5, 12, 5, GREEN).px(11, 4, GREEN).px(11, 6, GREEN).line(3, 10, 12, 10, BLUE).px(4, 9, BLUE).px(4, 11, BLUE);
  },
  tagStrike: (g) => {
    g.line(2, 13, 7, 8, GREEN).line(7, 8, 13, 2, "#fff").px(12, 2, "#ffd84a").px(13, 3, "#ffd84a");
  },
  eldestShield: (g) => {
    g.rect(3, 2, 10, 9, K).rect(4, 3, 8, 7, GREEN).rect(5, 11, 6, 2, K).rect(6, 11, 4, 1, GREEN).px(7, 13, K).px(8, 13, K);
    g.rect(7, 4, 2, 5, "#fff").rect(5, 5, 6, 2, "#fff");
  },
  lastMag: (g) => {
    g.rect(5, 2, 6, 12, K).rect(6, 3, 4, 10, RED).px(7, 4, "#ffd84a").px(8, 6, "#ffd84a").px(7, 8, "#ffd84a");
  },
  rustyEdge: (g) => {
    blade(g, 3, 2, "#a8783a", 9);
    g.px(9, 6, "#e04040").px(10, 8, "#e04040");
  },
  grewTogether: (g) => {
    g.disc(4, 6, 2, GREEN).disc(8, 5, 2, RED).disc(12, 6, 2, BLUE).rect(2, 9, 12, 4, "#c8a070").px(7, 13, K);
  },
  threeAsOne: (g) => {
    g.disc(8, 8, 6, K).disc(8, 8, 5, GREEN).rect(8, 3, 5, 5, RED).rect(3, 8, 5, 5, BLUE).ring(8, 8, 6, "#fff");
  },
  streetScars: (g) => {
    g.disc(8, 8, 6, "#e8b890").line(4, 5, 11, 10, "#a84040").line(5, 10, 9, 6, "#a84040");
  },
  backAlleyRun: (g) => {
    g.rect(3, 9, 9, 3, "#6a6a7a").rect(11, 8, 2, 2, "#6a6a7a").line(1, 6, 6, 6, "#c8c8d8").line(2, 13, 7, 13, "#c8c8d8");
  },
};
