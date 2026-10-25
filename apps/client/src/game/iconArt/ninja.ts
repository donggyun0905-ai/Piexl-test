// 닌자 아이콘: 무기 10개 · 전용 아이템 10개 (수리검·쿠나이·그림자 분신·연막)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { NinjaWeapon } from "../../i18n/items/ninja";
import { D, G, K, Pen, S, W } from "./pen";

const INK = "#2a1c3c";
const VIO = "#8a5ad8";
const RED = "#e04a6a";

/** 네 날 수리검 (cx, cy = 가운데, r = 날 길이) */
function star4(g: Pen, cx: number, cy: number, r: number, c = S): void {
  for (let i = 1; i <= r; i++) g.px(cx + i, cy, c).px(cx - i, cy, c).px(cx, cy + i, c).px(cx, cy - i, c);
  g.px(cx + 1, cy - 1, c).px(cx - 1, cy + 1, c).px(cx + 1, cy + 1, D).px(cx - 1, cy - 1, D).px(cx, cy, K);
}

/** 그림자 분신 (x, y = 머리 왼쪽 위) */
function shadow(g: Pen, x: number, y: number, c = INK): void {
  g.rect(x, y, 3, 3, c).rect(x - 1, y + 3, 5, 5, c).px(x - 1, y + 8, c).px(x + 3, y + 8, c).px(x + 2, y + 1, RED).line(x - 2, y + 3, x - 4, y + 4, c);
}

/** 쿠나이 (왼쪽 아래 → 오른쪽 위) */
function kunai(g: Pen, x0: number, y0: number, len: number): void {
  g.line(x0, y0, x0 + 3, y0 - 3, W).ring(x0 - 1, y0 + 1, 1, D);
  g.line(x0 + 3, y0 - 3, x0 + 3 + len, y0 - 3 - len, S).line(x0 + 4, y0 - 3, x0 + 3 + len, y0 - 2 - len, D);
}

export const NINJA_WEAPON_ART: Record<NinjaWeapon & WeaponId, (g: Pen) => void> = {
  shuriken: (g) => star4(g, 8, 8, 6),
  kunai: (g) => kunai(g, 3, 13, 8),
  fanstar: (g) => {
    star4(g, 4, 11, 3);
    star4(g, 8, 6, 3);
    star4(g, 12, 11, 3);
  },
  phantomring: (g) => {
    g.ring(8, 8, 7, VIO);
    for (const [x, y] of [[8, 1], [13, 3], [15, 8], [13, 13], [8, 15], [3, 13], [1, 8], [3, 3]] as const) g.px(x, y, "#fff");
    star4(g, 8, 8, 2);
  },
  kusarigama: (g) => {
    g.line(2, 14, 8, 8, W).line(8, 8, 8, 3, S).line(8, 3, 12, 2, S).px(13, 3, S);
    for (let i = 0; i < 4; i++) g.px(10 + i, 10 + i, D);
    g.disc(14, 14, 1, D);
  },
  smokebomb: (g) => {
    g.disc(8, 10, 4, K).px(7, 8, D).line(8, 5, 10, 3, W).px(11, 2, "#ff9a3c");
    g.disc(3, 4, 2, "#8a8a9a").disc(13, 5, 2, "#8a8a9a");
  },
  shadowclone: (g) => {
    shadow(g, 3, 4, "#4a3a6a");
    shadow(g, 10, 4);
  },
  ninjato: (g) => {
    g.line(3, 13, 13, 3, S).line(4, 13, 13, 4, D).rect(2, 11, 3, 3, K).line(1, 15, 3, 13, RED);
  },
  fuma: (g) => {
    star4(g, 8, 8, 7, D);
    g.ring(8, 8, 2, S);
  },
  kagenui: (g) => {
    g.line(3, 3, 12, 12, S).px(13, 13, VIO).px(2, 2, K);
    g.rect(1, 13, 10, 2, INK).px(6, 12, INK).px(9, 12, INK);
  },
};

type NinjaPassive = "shadowMark" | "twinShadow" | "venomStar" | "shadowRush" | "moonlight" | "smokeVeil" | "assassin" | "bigStar" | "shadowChain" | "silentStep";

export const NINJA_PASSIVE_ART: Record<NinjaPassive & PassiveId, (g: Pen) => void> = {
  shadowMark: (g) => {
    g.disc(8, 8, 5, INK).px(6, 7, VIO).px(8, 7, VIO).px(10, 7, VIO).px(7, 10, "#fff").px(9, 10, "#fff");
  },
  twinShadow: (g) => {
    shadow(g, 4, 3);
    shadow(g, 10, 6, "#4a3a6a");
  },
  venomStar: (g) => {
    star4(g, 7, 7, 5, "#7ae07a");
    g.px(12, 12, "#4ab84a").px(13, 14, "#4ab84a").px(11, 14, "#4ab84a");
  },
  shadowRush: (g) => {
    shadow(g, 9, 4);
    g.line(1, 6, 6, 6, VIO).line(2, 9, 6, 9, VIO).line(1, 12, 5, 12, VIO);
  },
  moonlight: (g) => {
    g.disc(8, 8, 6, "#f4f0c8").disc(10, 6, 5, K).px(4, 12, "#fff");
  },
  smokeVeil: (g) => {
    g.disc(5, 9, 3, "#9a9aaa").disc(10, 8, 4, "#b0b0c0").disc(8, 12, 3, "#8a8a9a");
  },
  assassin: (g) => {
    kunai(g, 2, 14, 7);
    g.disc(12, 4, 2, RED).px(14, 7, RED);
  },
  bigStar: (g) => {
    star4(g, 8, 8, 7);
    g.px(1, 1, G).px(14, 1, G).px(1, 14, G);
  },
  shadowChain: (g) => {
    for (let i = 0; i < 4; i++) g.ring(3 + i * 3, 12 - i * 3, 1, VIO);
    shadow(g, 11, 1);
  },
  silentStep: (g) => {
    g.rect(3, 9, 4, 2, INK).rect(9, 5, 4, 2, INK).px(2, 13, "#fff").px(5, 14, "#fff").px(12, 9, "#fff");
  },
};
