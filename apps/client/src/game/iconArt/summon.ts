// 소환술사 아이콘: 채찍 10개(손잡이 + 휘어진 채찍 + 소환수 얼굴) · 전용 아이템 10개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { SummonWeapon } from "../../i18n/items/summon";
import { D, G, K, Pen, S, W } from "./pen";

const BONE = "#ece4d0";
const GREEN = "#5ab86a";
const RED = "#e0505e";

/** 손잡이(왼쪽 아래)에서 휘어 나가는 채찍 (c = 채찍 색) */
function whip(g: Pen, c: string): void {
  g.rect(1, 12, 2, 3, W).px(3, 11, K);
  g.line(3, 11, 6, 7, c).line(6, 7, 10, 6, c).line(10, 6, 12, 8, c).line(12, 8, 14, 7, c);
}

/** 작은 해골 얼굴 */
function skull(g: Pen, x: number, y: number, c = BONE): void {
  g.rect(x, y, 5, 4, c).rect(x + 1, y + 4, 3, 1, c).px(x + 1, y + 1, K).px(x + 3, y + 1, K);
}

export const SUMMON_WEAPON_ART: Record<SummonWeapon & WeaponId, (g: Pen) => void> = {
  leatherwhip: (g) => {
    whip(g, "#a8743a");
    skull(g, 9, 10);
  },
  thornwhip: (g) => {
    whip(g, "#5a8a3a");
    g.px(7, 6, "#c8f0a0").px(11, 5, "#c8f0a0");
    g.disc(11, 12, 2, "#c8483a").px(10, 10, "#ff9a3c").px(12, 10, "#ff9a3c");
  },
  chainwhip: (g) => {
    for (let i = 0; i < 5; i++) g.ring(4 + i * 2, 10 - i * 2, 1, D);
    g.rect(1, 12, 2, 3, W);
    g.rect(9, 10, 6, 5, "#8a8478").px(10, 11, "#ff9a3c").px(13, 11, "#ff9a3c");
  },
  bonewhip: (g) => {
    whip(g, BONE);
    g.line(10, 15, 15, 10, W).px(14, 9, S).px(15, 11, S);
  },
  flamewhip: (g) => {
    whip(g, "#ff6a2a");
    g.disc(12, 12, 2, "#ff9a3c").px(12, 9, "#ffd040").px(11, 10, "#ffd040");
  },
  vinewhip: (g) => {
    whip(g, GREEN);
    g.rect(9, 10, 6, 2, "#c84a6a").px(10, 10, "#fff").px(13, 10, "#fff").rect(11, 12, 2, 3, "#e8dcc0");
  },
  shadowwhip: (g) => {
    whip(g, "#4a3a6a");
    g.rect(9, 11, 5, 3, "#5a5a6a").px(9, 10, "#5a5a6a").px(13, 10, "#5a5a6a").px(14, 12, "#5a5a6a").px(10, 12, "#ffd040");
  },
  starwhip: (g) => {
    whip(g, "#7ac8ff");
    g.px(12, 12, "#fff").px(11, 12, "#ff9ad8").px(13, 12, "#ff9ad8").px(12, 11, G).px(12, 13, G);
  },
  stormwhip: (g) => {
    whip(g, "#ffe060");
    for (const [x, y] of [[9, 11], [12, 13], [13, 10]] as const) g.px(x, y, "#3a2650").px(x - 1, y - 1, "#3a2650").px(x + 1, y - 1, "#3a2650");
  },
  dragonwhip: (g) => {
    whip(g, "#c83a3a");
    g.rect(9, 10, 5, 4, "#c83a3a").px(13, 9, "#c83a3a").px(12, 11, "#ffd040").px(8, 9, "#e88a3a");
  },
};

type SummonPassive = "horde" | "oldPact" | "lash" | "soulHarvest" | "empower" | "longWhip" | "sacrifice" | "command" | "bondShield" | "twinSummon";

export const SUMMON_PASSIVE_ART: Record<SummonPassive & PassiveId, (g: Pen) => void> = {
  horde: (g) => {
    skull(g, 1, 8);
    skull(g, 6, 3);
    skull(g, 10, 9);
  },
  oldPact: (g) => {
    g.rect(3, 2, 10, 12, "#e8d8a8").rect(3, 2, 10, 1, "#a8743a").rect(3, 13, 10, 1, "#a8743a");
    g.line(5, 5, 11, 5, K).line(5, 8, 11, 8, K).disc(10, 11, 1, RED);
  },
  lash: (g) => {
    whip(g, "#a8743a");
    g.px(14, 4, "#fff").px(15, 6, "#fff").px(13, 3, "#fff");
  },
  soulHarvest: (g) => {
    g.disc(8, 9, 4, "#7ae0c8").px(8, 3, "#7ae0c8").px(7, 4, "#7ae0c8").px(6, 9, K).px(10, 9, K);
  },
  empower: (g) => {
    skull(g, 5, 7);
    g.line(8, 1, 8, 5, G).px(7, 2, G).px(9, 2, G);
  },
  longWhip: (g) => {
    g.rect(1, 12, 2, 3, W).line(3, 11, 15, 2, "#a8743a");
  },
  sacrifice: (g) => {
    skull(g, 5, 6);
    g.px(2, 3, "#ff9a3c").px(13, 3, "#ff9a3c").px(2, 13, "#ff9a3c").px(14, 12, "#ff9a3c").px(8, 2, "#ffd040");
  },
  command: (g) => {
    g.line(4, 14, 4, 2, W).rect(5, 2, 7, 5, RED).px(8, 4, G);
  },
  bondShield: (g) => {
    g.rect(3, 2, 10, 8, D).rect(4, 10, 8, 2, D).rect(6, 12, 4, 2, D).rect(4, 3, 8, 6, S);
    skull(g, 6, 4, "#8a8a9a");
  },
  twinSummon: (g) => {
    skull(g, 2, 6);
    skull(g, 9, 6);
    g.px(8, 2, G).px(7, 3, G).px(9, 3, G);
  },
};
