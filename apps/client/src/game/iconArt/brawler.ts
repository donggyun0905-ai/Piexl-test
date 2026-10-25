// 격투가 아이콘: 콤보 무기 10개 · 전용 아이템 10개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import { G, K, Pen, star } from "./pen";

const SKIN = "#f2c8a0";
const SHADE = "#c8906a";

/** 주먹 (오른쪽을 향함) */
function fist(g: Pen, x: number, y: number, c = SKIN, edge = SHADE): void {
  g.rect(x, y, 6, 5, c).rect(x + 6, y + 1, 1, 3, c).rect(x, y + 4, 6, 1, edge).px(x + 2, y + 1, edge).px(x + 4, y + 1, edge).rect(x - 3, y + 1, 3, 3, c);
}

type BrawlWeapon = "fist" | "boxinggloves" | "kick" | "muaythai" | "judo" | "jiujitsu" | "mma" | "karate" | "taekkyon" | "energywave";

export const BRAWLER_WEAPON_ART: Record<BrawlWeapon & WeaponId, (g: Pen) => void> = {
  fist: (g) => {
    fist(g, 5, 6);
    g.px(14, 5, "#fff").px(14, 11, "#fff").px(15, 8, "#fff");
  },
  boxinggloves: (g) => {
    g.disc(6, 8, 4, "#d83a3a").disc(11, 8, 4, "#e85050").rect(4, 12, 4, 2, "#fff").rect(9, 12, 4, 2, "#fff").px(10, 6, "#ff9a9a");
  },
  kick: (g) => {
    g.rect(2, 4, 3, 7, "#3a4a7a").rect(4, 9, 8, 3, "#3a4a7a").rect(11, 8, 4, 4, SKIN).px(15, 9, SKIN);
  },
  muaythai: (g) => {
    g.rect(3, 4, 4, 8, "#d83a3a").rect(9, 4, 4, 8, "#3a6ad8").line(3, 3, 13, 3, G).rect(5, 13, 6, 1, K);
  },
  judo: (g) => {
    g.rect(3, 3, 10, 10, "#f4f4f4").line(8, 3, 8, 12, "#d8d8d8").line(3, 8, 7, 3, "#d8d8d8").line(13, 8, 9, 3, "#d8d8d8").rect(3, 9, 10, 2, K);
  },
  jiujitsu: (g) => {
    // 쌍광연격: 엇갈린 두 검 + 빛
    g.line(2, 14, 13, 3, "#e8ecf4").line(2, 3, 13, 14, "#e8ecf4").px(14, 2, "#fff").px(14, 15, "#fff");
    g.rect(2, 12, 3, 1, G).rect(2, 4, 3, 1, G).px(8, 8, "#fff");
  },
  mma: (g) => {
    g.rect(2, 5, 12, 6, K).rect(3, 6, 4, 4, "#d83a3a").rect(9, 6, 4, 4, "#d83a3a").rect(7, 7, 2, 2, G);
  },
  karate: (g) => {
    g.rect(3, 3, 10, 10, "#f4f4f4").rect(3, 8, 10, 2, "#202020").rect(6, 10, 2, 4, "#202020").rect(9, 10, 2, 3, "#202020");
  },
  taekkyon: (g) => {
    g.rect(4, 2, 8, 9, "#f0ead8").rect(4, 10, 8, 4, "#4a5a8a").line(4, 6, 11, 6, "#3a8a5a").px(2, 4, "#fff").px(13, 4, "#fff");
  },
  energywave: (g) => {
    g.disc(5, 8, 4, "#4ac0ff").disc(5, 8, 2, "#e8faff").rect(9, 6, 7, 5, "#8ae0ff").rect(9, 7, 7, 3, "#e8faff");
  },
};

type BrawlPassive = "balance" | "zone" | "ironBody" | "speedIsPower" | "mach" | "strongman" | "drunkenFist" | "intimidate" | "bloodDemon" | "knockout";

export const BRAWLER_PASSIVE_ART: Record<BrawlPassive & PassiveId, (g: Pen) => void> = {
  balance: (g) => {
    fist(g, 3, 3, SKIN);
    g.rect(8, 8, 6, 6, "#8a93a6").rect(9, 9, 4, 4, "#5a6a90");
  },
  zone: (g) => {
    g.ring(8, 8, 6, "#ffe070").ring(8, 8, 3, "#ffb040").disc(8, 8, 1, "#fff");
  },
  ironBody: (g) => {
    g.rect(4, 2, 8, 12, "#c8ccd8").rect(5, 3, 6, 10, "#e8ecf4").rect(7, 5, 2, 6, "#ffe070").rect(6, 7, 4, 2, "#ffe070");
  },
  speedIsPower: (g) => {
    fist(g, 7, 6);
    g.line(1, 6, 5, 6, "#fff").line(0, 9, 5, 9, "#fff").line(2, 12, 5, 12, "#fff");
  },
  mach: (g) => {
    g.line(2, 12, 14, 4, "#8ae0ff").line(2, 13, 14, 5, "#4ac0ff").px(14, 3, "#fff").px(15, 4, "#fff");
  },
  strongman: (g) => {
    g.rect(1, 7, 14, 2, "#5a6070").rect(1, 4, 3, 8, K).rect(12, 4, 3, 8, K).rect(6, 9, 4, 5, SKIN);
  },
  drunkenFist: (g) => {
    g.rect(5, 6, 6, 8, "#8a5a2a").rect(6, 3, 4, 3, "#b08a5a").rect(6, 2, 4, 1, "#d8c8a0").px(12, 4, "#ff9a9a").px(13, 3, "#ff9a9a");
  },
  intimidate: (g) => {
    g.rect(4, 4, 8, 8, "#3a2a2a").px(6, 7, "#ff3a3a").px(10, 7, "#ff3a3a").line(6, 10, 10, 10, "#ff3a3a").px(2, 3, "#ff9a3a").px(13, 3, "#ff9a3a");
  },
  bloodDemon: (g) => {
    g.disc(8, 9, 4, "#a01020").rect(7, 3, 2, 3, "#a01020").px(8, 2, "#a01020").px(7, 8, "#ff5a6a");
  },
  knockout: (g) => {
    star(g, 8, 8, "#ffe070", true);
    g.px(3, 3, "#ffe070").px(13, 3, "#ffe070").px(3, 13, "#ffe070").px(13, 13, "#ffe070");
  },
};
