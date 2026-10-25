// 야수 아이콘: 무기 10개 · 전용 아이템 10개 (고양이 얼굴·발톱·발바닥)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { BeastWeapon } from "../../i18n/items/beast";
import { G, K, Pen, S, star } from "./pen";

const FUR = "#f0a050";
const STRIPE = "#b8662a";
const PINK = "#ff9ab0";

/** 고양이 얼굴 (cx, cy = 가운데) */
export function catFace(g: Pen, cx: number, cy: number, fur = FUR, eye = K): void {
  g.disc(cx, cy, 3, fur)
    .px(cx - 3, cy - 3, fur)
    .px(cx - 3, cy - 4, fur)
    .px(cx + 3, cy - 3, fur)
    .px(cx + 3, cy - 4, fur)
    .px(cx - 1, cy - 1, eye)
    .px(cx + 1, cy - 1, eye)
    .px(cx, cy + 1, PINK);
}

/** 발톱 세 줄 (x, y = 왼쪽 위) */
function claws(g: Pen, x: number, y: number, len: number, c = S): void {
  for (let i = 0; i < 3; i++) g.line(x + i * 3, y + len, x + i * 3 + len, y, c);
}

/** 발바닥 (cx, cy = 큰 볼록살 가운데) */
function paw(g: Pen, cx: number, cy: number, c = PINK): void {
  g.disc(cx, cy + 1, 2, c).px(cx - 3, cy - 2, c).px(cx - 1, cy - 3, c).px(cx + 1, cy - 3, c).px(cx + 3, cy - 2, c);
}

export const BEAST_WEAPON_ART: Record<BeastWeapon & WeaponId, (g: Pen) => void> = {
  claws: (g) => claws(g, 2, 3, 9),
  pouncers: (g) => {
    claws(g, 5, 2, 7);
    g.line(1, 14, 5, 10, FUR).line(1, 12, 3, 10, FUR);
  },
  yarnball: (g) => {
    g.disc(7, 8, 5, "#e85a8a").line(4, 5, 10, 11, "#ffb0c8").line(3, 8, 8, 13, "#ffb0c8").line(10, 12, 15, 14, "#e85a8a");
  },
  catpack: (g) => {
    catFace(g, 4, 6);
    catFace(g, 12, 6, "#d8d0c0");
    catFace(g, 8, 12, "#5a5a6a");
  },
  lionheart: (g) => {
    g.disc(8, 8, 6, "#b8662a");
    catFace(g, 8, 9, "#f0c060");
  },
  hairball: (g) => {
    g.disc(8, 9, 4, "#8a6a4a").px(5, 7, "#c8a070").px(9, 6, "#c8a070").px(11, 10, "#c8a070").line(3, 12, 1, 14, "#8a6a4a");
  },
  catnip: (g) => {
    g.line(8, 14, 8, 6, "#3a8a3a").disc(5, 6, 2, "#6ad06a").disc(11, 6, 2, "#6ad06a").disc(8, 3, 2, "#8ae08a").px(3, 2, "#c8f0c8").px(13, 2, "#c8f0c8");
  },
  catbell: (g) => {
    g.line(2, 4, 14, 4, "#e0505e").disc(8, 9, 4, G).line(5, 10, 11, 10, "#c89a2a").px(8, 12, K).px(7, 7, "#fff");
  },
  shadowpaw: (g) => {
    paw(g, 8, 9, "#6a4a9a");
    g.px(2, 3, "#a080e0").px(13, 13, "#a080e0").px(14, 4, "#a080e0");
  },
  tigerclaw: (g) => {
    claws(g, 1, 2, 12, "#fff");
    g.px(13, 12, STRIPE).px(14, 13, STRIPE).px(12, 14, STRIPE);
  },
};

type BeastPassive = "catNap" | "extraCat" | "sharpClaws" | "nineLives" | "agility" | "hunterInstinct" | "purr" | "packLeader" | "fishTreat" | "wildRoar";

export const BEAST_PASSIVE_ART: Record<BeastPassive & PassiveId, (g: Pen) => void> = {
  catNap: (g) => {
    g.rect(2, 10, 12, 4, FUR).disc(4, 10, 2, FUR).line(3, 10, 5, 10, K);
    g.line(9, 3, 12, 3, "#fff").line(12, 3, 9, 6, "#fff").line(9, 6, 12, 6, "#fff");
  },
  extraCat: (g) => {
    catFace(g, 7, 9);
    g.rect(12, 2, 1, 5, "#fff").rect(10, 4, 5, 1, "#fff");
  },
  sharpClaws: (g) => {
    claws(g, 2, 3, 9);
    g.px(12, 3, "#fff").px(14, 3, "#fff").px(13, 2, "#fff");
  },
  nineLives: (g) => {
    catFace(g, 8, 9, "#f4f6fa");
    g.ring(8, 3, 3, G);
  },
  agility: (g) => {
    g.line(2, 12, 7, 6, FUR).line(7, 6, 13, 9, FUR).px(14, 9, FUR).line(1, 4, 5, 4, "#fff").line(0, 7, 3, 7, "#fff");
  },
  hunterInstinct: (g) => {
    g.disc(8, 8, 5, "#f0e040").rect(7, 4, 2, 9, K).px(6, 8, K).px(9, 8, K);
  },
  purr: (g) => {
    catFace(g, 6, 10);
    g.disc(12, 4, 2, "#e0505e").px(11, 6, "#e0505e").px(13, 6, "#e0505e").px(12, 7, "#e0505e");
  },
  packLeader: (g) => {
    catFace(g, 8, 10, "#b8662a");
    g.rect(5, 2, 7, 2, G).px(5, 1, G).px(8, 1, G).px(11, 1, G);
  },
  fishTreat: (g) => {
    g.disc(7, 8, 3, "#7ab0e0").rect(5, 7, 5, 3, "#7ab0e0").line(11, 6, 14, 4, "#7ab0e0").line(11, 9, 14, 11, "#7ab0e0").px(5, 7, K);
  },
  wildRoar: (g) => {
    catFace(g, 6, 9, "#b8662a");
    g.line(11, 5, 14, 3, "#fff").line(11, 9, 15, 9, "#fff").line(11, 13, 14, 15, "#fff");
    star(g, 13, 1, G);
  },
};
