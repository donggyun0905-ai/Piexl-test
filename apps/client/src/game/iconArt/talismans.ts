// 음양사 아이콘: 부적 무기 10개(세로 종이 + 무기마다 다른 무늬) · 전용 패시브 10개
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import { G, K, Pen } from "./pen";

const PAPER = "#f6ecc8";
const INK = "#c03030";

/** 세로로 긴 부적 종이 (가운데 아래 붉은 도장) */
function paper(g: Pen, edge = "#d8c890"): void {
  g.rect(5, 1, 7, 14, edge).rect(6, 2, 5, 12, PAPER).rect(7, 12, 3, 1, INK);
}

type CharmWeapon = "handcharm" | "mightcharm" | "sealcharm" | "thundercharm" | "flamecharm" | "frostcharm" | "blossomcharm" | "lightcharm" | "darkcharm" | "earthcharm";

export const TALISMAN_WEAPON_ART: Record<CharmWeapon & WeaponId, (g: Pen) => void> = {
  handcharm: (g) => {
    paper(g);
    g.line(8, 3, 8, 10, INK).line(7, 5, 9, 5, INK).line(7, 8, 9, 8, INK);
  },
  mightcharm: (g) => {
    paper(g, INK);
    g.rect(7, 3, 3, 3, INK).line(8, 6, 8, 10, INK).line(6, 9, 10, 9, INK);
  },
  sealcharm: (g) => {
    paper(g);
    g.ring(8, 6, 2, "#4a8a5a").px(8, 6, "#4a8a5a").line(8, 9, 8, 10, "#4a8a5a");
    g.px(2, 4, PAPER).px(3, 5, PAPER).px(13, 9, PAPER).px(14, 8, PAPER);
  },
  thundercharm: (g) => {
    paper(g);
    g.line(9, 3, 7, 6, "#e0b020").line(7, 6, 9, 7, "#e0b020").line(9, 7, 7, 10, "#e0b020");
    g.px(3, 2, "#ffe84a").px(13, 12, "#ffe84a");
  },
  flamecharm: (g) => {
    paper(g);
    g.rect(7, 6, 3, 4, "#ff6a20").rect(8, 4, 1, 2, "#ff8a30").px(8, 8, "#ffe070").px(7, 5, "#ff8a30").px(9, 5, "#ff8a30");
  },
  frostcharm: (g) => {
    paper(g, "#9ad8f0");
    g.line(8, 3, 8, 10, "#4ab0e0").line(6, 5, 10, 8, "#4ab0e0").line(10, 5, 6, 8, "#4ab0e0");
  },
  blossomcharm: (g) => {
    paper(g, "#ff9ec8");
    g.px(8, 4, "#ff7ab0").px(7, 5, "#ff7ab0").px(9, 5, "#ff7ab0").px(7, 7, "#ff7ab0").px(9, 7, "#ff7ab0").px(8, 6, G);
    g.px(2, 3, "#ff9ec8").px(3, 7, "#ff9ec8").px(13, 5, "#ff9ec8").px(14, 10, "#ff9ec8");
  },
  lightcharm: (g) => {
    paper(g, "#fff2a0");
    g.disc(8, 6, 2, "#ffd040").px(8, 3, "#ffd040").px(8, 9, "#ffd040").px(5, 6, "#ffd040").px(11, 6, "#ffd040").px(8, 6, "#fff");
  },
  darkcharm: (g) => {
    g.rect(2, 3, 5, 11, "#4a3a6a").rect(9, 3, 5, 11, "#4a3a6a");
    g.rect(5, 1, 7, 14, "#2a1a4a").rect(6, 2, 5, 12, "#3a2a5a").rect(7, 12, 3, 1, "#9a6ad8");
    g.ring(8, 6, 2, "#9a6ad8");
  },
  earthcharm: (g) => {
    paper(g, "#8a6a3a");
    g.rect(6, 8, 5, 2, "#8a6a3a").rect(7, 6, 3, 2, "#a08050").px(8, 4, "#6a8a3a").px(8, 5, "#6a8a3a");
  },
};

export const TALISMAN_PASSIVE_ART: Partial<Record<PassiveId, (g: Pen) => void>> = {
  resolve: (g) => {
    g.disc(8, 8, 4, "#e0505e").ring(8, 8, 6, "#f6ecc8").px(8, 8, "#fff");
  },
  mindEye: (g) => {
    g.rect(3, 7, 10, 3, PAPER).rect(5, 6, 6, 5, PAPER).disc(8, 8, 2, "#4a8ae0").px(8, 8, K);
  },
  yinForce: (g) => {
    g.disc(8, 8, 6, "#2a2438").disc(8, 5, 1, "#f6ecc8").ring(8, 8, 6, "#f6ecc8");
  },
  yangForce: (g) => {
    g.disc(8, 8, 6, "#f6ecc8").disc(8, 11, 1, "#2a2438").ring(8, 8, 6, "#2a2438");
  },
  barrier: (g) => {
    g.ring(8, 8, 6, "#e0b020").ring(8, 8, 4, "#e0b020").px(8, 8, "#fff").px(8, 2, INK).px(8, 14, INK).px(2, 8, INK).px(14, 8, INK);
  },
  jadeOrb: (g) => {
    g.disc(8, 8, 5, "#3aa070").disc(8, 8, 3, "#7fe0b0").px(6, 6, "#fff");
  },
  deathSeal: (g) => {
    g.rect(3, 3, 10, 10, INK).rect(4, 4, 8, 8, "#2a1418").line(5, 5, 10, 10, INK).line(10, 5, 5, 10, INK);
  },
  domain: (g) => {
    g.ring(8, 8, 6, "#9a6ad8").ring(8, 8, 3, "#9a6ad8").px(8, 8, "#fff").px(2, 2, "#c0a0ff").px(13, 13, "#c0a0ff");
  },
  lifeSiphon: (g) => {
    g.rect(6, 2, 4, 12, PAPER).rect(7, 12, 2, 1, INK).disc(8, 7, 2, "#e0505e").px(3, 5, "#e0505e").px(12, 9, "#e0505e");
  },
  prajna: (g) => {
    g.disc(8, 9, 5, "#e0c060").rect(4, 3, 2, 3, "#e0c060").rect(10, 3, 2, 3, "#e0c060").px(6, 8, K).px(10, 8, K).line(6, 11, 10, 11, INK);
  },
};
