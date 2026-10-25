// 거너 아이콘: 총 10개 · 전용 아이템 10개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import { D, G, K, Pen, S, W, star } from "./pen";

const GUN = "#5a6070";
const DARK = "#3a3e4a";

/** 옆에서 본 권총 (x, y = 총열 왼쪽 위) */
function pistol(g: Pen, x: number, y: number): void {
  g.rect(x, y, 8, 3, GUN).rect(x + 1, y + 3, 3, 4, DARK).px(x + 8, y + 1, D).px(x + 5, y + 3, DARK);
}

type GunWeapon = "pistol" | "sniper" | "shotgun" | "bayonet" | "dualpistol" | "mercenary" | "smg" | "minigun" | "grenade" | "drone";

export const GUNNER_WEAPON_ART: Record<GunWeapon & WeaponId, (g: Pen) => void> = {
  pistol: (g) => pistol(g, 4, 5),
  sniper: (g) => {
    g.rect(1, 7, 14, 2, GUN).rect(1, 9, 4, 3, W).rect(6, 5, 4, 2, DARK).px(15, 7, D).rect(8, 9, 1, 2, DARK);
  },
  shotgun: (g) => {
    g.rect(1, 6, 13, 3, GUN).rect(1, 9, 4, 3, W).rect(7, 9, 4, 1, W).px(14, 6, D).px(14, 8, D);
  },
  bayonet: (g) => {
    pistol(g, 2, 6);
    g.line(10, 7, 15, 7, S).px(15, 6, S);
  },
  dualpistol: (g) => {
    pistol(g, 1, 2);
    pistol(g, 6, 8);
  },
  mercenary: (g) => {
    pistol(g, 1, 3);
    g.line(9, 4, 14, 4, S).disc(11, 11, 3, "#4a6a3a").rect(10, 7, 2, 2, D);
  },
  smg: (g) => {
    g.rect(2, 6, 11, 3, GUN).rect(4, 9, 2, 5, DARK).rect(8, 9, 2, 3, DARK).px(13, 7, D).rect(0, 7, 2, 1, DARK);
  },
  minigun: (g) => {
    g.rect(1, 5, 5, 6, DARK).line(6, 6, 15, 6, D).line(6, 8, 15, 8, S).line(6, 10, 15, 10, D).rect(12, 5, 1, 7, GUN);
  },
  grenade: (g) => {
    g.disc(8, 10, 4, "#4a6a3a").rect(7, 4, 3, 2, D).line(10, 4, 13, 3, S).px(6, 9, "#6a8a5a");
  },
  drone: (g) => {
    g.rect(5, 7, 6, 3, GUN).line(2, 5, 6, 7, D).line(14, 5, 10, 7, D).rect(1, 4, 3, 1, S).rect(12, 4, 3, 1, S).px(8, 10, "#ff5a48");
  },
};

type GunPassive = "gunMaster" | "discipline" | "focusFire" | "ration" | "allIn" | "elite" | "scrapGun" | "supportFire" | "bleed" | "rapidFire";

export const GUNNER_PASSIVE_ART: Record<GunPassive & PassiveId, (g: Pen) => void> = {
  gunMaster: (g) => {
    pistol(g, 1, 3);
    pistol(g, 6, 9);
    star(g, 13, 3, G);
  },
  discipline: (g) => {
    g.rect(4, 3, 8, 10, "#4a6a3a").rect(6, 5, 4, 1, G).rect(6, 7, 4, 1, G).rect(6, 9, 4, 1, G);
  },
  focusFire: (g) => {
    g.ring(8, 8, 6, "#e0505e").ring(8, 8, 3, "#e0505e").px(8, 8, "#fff").line(8, 0, 8, 3, "#fff").line(8, 13, 8, 15, "#fff");
  },
  ration: (g) => {
    g.rect(3, 5, 10, 8, "#8a7a4a").rect(4, 6, 8, 2, "#c8b878").rect(6, 9, 4, 2, "#e0505e");
  },
  allIn: (g) => {
    pistol(g, 4, 4);
    g.px(2, 11, "#ff8a30").px(5, 12, "#ff8a30").px(9, 11, "#ff8a30").px(12, 12, "#ff8a30");
  },
  elite: (g) => {
    star(g, 8, 6, G, true);
    g.rect(4, 11, 8, 2, "#5a6aa8").rect(5, 13, 6, 1, "#5a6aa8");
  },
  scrapGun: (g) => {
    pistol(g, 3, 5);
    g.px(12, 3, "#8a8a8a").px(13, 2, "#8a8a8a").px(11, 12, "#c87a3a").px(13, 13, "#c87a3a");
  },
  supportFire: (g) => {
    g.rect(5, 3, 6, 3, GUN).line(2, 2, 5, 4, D).line(14, 2, 11, 4, D).line(8, 7, 8, 13, "#ffe070").px(8, 14, "#fff");
  },
  bleed: (g) => {
    g.disc(8, 10, 3, "#c02030").rect(7, 4, 3, 4, "#c02030").px(8, 3, "#c02030").px(7, 9, "#ff7a8a");
  },
  rapidFire: (g) => {
    for (const y of [4, 8, 12]) g.line(2, y, 9, y, "#ffe070").px(10, y, "#fff");
    g.line(12, 3, 14, 8, K).line(14, 8, 12, 13, K);
  },
};
