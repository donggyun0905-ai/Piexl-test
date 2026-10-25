// 오리(히든) 아이콘: 무기 10개 · 전용 아이템 10개 (오리 얼굴·깃털·알·음파)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { DuckWeapon } from "../../i18n/items/duck";
import { D, G, K, Pen, S, star } from "./pen";

const YEL = "#ffd84a";
const BILL = "#ff9a2a";
const WAVE = "#9ad8ff";

/** 오른쪽을 보는 오리 (cx, cy = 몸 가운데, small이면 새끼) */
export function duckFace(g: Pen, cx: number, cy: number, body = YEL, small = false): void {
  const r = small ? 2 : 3;
  g.disc(cx, cy + 1, r + 1, body)
    .disc(cx + r - 1, cy - r, r, body)
    .rect(cx + r * 2 - 1, cy - r, small ? 2 : 3, 2, BILL)
    .px(cx + r, cy - r - 1, K);
}

/** 음파 (cx, cy에서 오른쪽으로 퍼지는 호 n줄) */
function waves(g: Pen, cx: number, cy: number, n: number, c = WAVE): void {
  for (let i = 0; i < n; i++) {
    const x = cx + i * 2;
    const h = 2 + i;
    g.line(x, cy - h, x + 1, cy - h + 1, c).line(x + 1, cy - h + 1, x + 1, cy + h - 1, c).line(x + 1, cy + h - 1, x, cy + h, c);
  }
}

/** 깃털 (x0, y0 → x1, y1) */
function feather(g: Pen, x0: number, y0: number, x1: number, y1: number, c = "#f4f4f8"): void {
  g.line(x0, y0, x1, y1, c).line(x0 + 1, y0, x1 + 1, y1, c).line(x0, y0, x1, y1, "#c8c8d8").px(x1, y1, c);
}

export const DUCK_WEAPON_ART: Record<DuckWeapon & WeaponId, (g: Pen) => void> = {
  rubberDuck: (g) => {
    duckFace(g, 6, 9);
    waves(g, 12, 6, 2);
  },
  megaphone: (g) => {
    g.rect(2, 6, 3, 4, "#e05050").line(5, 5, 11, 2, "#f06a6a").line(5, 10, 11, 13, "#f06a6a").line(11, 2, 11, 13, "#f06a6a").rect(6, 6, 5, 4, "#f06a6a");
    waves(g, 12, 7, 2);
  },
  featherFan: (g) => {
    feather(g, 8, 14, 2, 4);
    feather(g, 8, 14, 7, 2);
    feather(g, 8, 14, 13, 4);
    g.disc(8, 13, 1, G);
  },
  goldenEgg: (g) => {
    g.disc(8, 9, 4, G).disc(8, 6, 3, G).px(6, 5, "#fff6c0").px(6, 6, "#fff6c0").px(11, 11, "#c89a2a");
    star(g, 13, 3, "#fff6c0");
  },
  motherDuck: (g) => {
    duckFace(g, 5, 7);
    duckFace(g, 10, 12, YEL, true);
    duckFace(g, 3, 13, YEL, true);
  },
  puddleStomp: (g) => {
    g.ring(8, 11, 5, WAVE).ring(8, 11, 3, "#5ab0e8").px(3, 5, WAVE).px(13, 4, WAVE).px(8, 3, "#cfeeff");
  },
  thunderQuack: (g) => {
    duckFace(g, 5, 9);
    g.line(13, 1, 10, 7, "#ffe860").line(10, 7, 13, 7, "#ffe860").line(13, 7, 10, 14, "#ffe860");
  },
  swanSong: (g) => {
    g.disc(6, 11, 4, "#f4f4f8").line(9, 9, 10, 3, "#f4f4f8").line(10, 9, 11, 3, "#f4f4f8").rect(11, 3, 2, 1, BILL).px(10, 3, K);
    g.px(13, 8, "#c8a0ff").px(14, 7, "#c8a0ff").line(14, 7, 14, 4, "#c8a0ff");
  },
  bubbleQuack: (g) => {
    duckFace(g, 4, 10, YEL, true);
    g.ring(11, 6, 3, WAVE).px(10, 5, "#fff").ring(13, 12, 2, WAVE);
  },
  crownDuck: (g) => {
    duckFace(g, 7, 10);
    g.rect(6, 2, 5, 2, G).px(6, 1, G).px(8, 1, G).px(10, 1, G).px(8, 2, "#e05050");
  },
};

type DuckPassive = "extraDuckling" | "loudQuack" | "goldenFeather" | "duckWalk" | "bigQuack" | "duckFamily" | "breadSnack" | "echoQuack" | "featherShield" | "braveDuckling";

export const DUCK_PASSIVE_ART: Record<DuckPassive & PassiveId, (g: Pen) => void> = {
  extraDuckling: (g) => {
    duckFace(g, 6, 10, YEL, true);
    g.line(12, 3, 12, 7, S).line(10, 5, 14, 5, S);
  },
  loudQuack: (g) => {
    g.rect(2, 7, 4, 3, BILL).px(5, 6, BILL);
    waves(g, 7, 8, 4);
  },
  goldenFeather: (g) => feather(g, 3, 14, 12, 2, G),
  duckWalk: (g) => {
    g.rect(2, 11, 4, 2, BILL).px(1, 12, BILL).rect(9, 7, 4, 2, BILL).px(8, 8, BILL).px(4, 4, "#fff").px(13, 13, "#fff");
  },
  bigQuack: (g) => {
    duckFace(g, 8, 9, YEL, true);
    g.ring(8, 8, 6, WAVE);
  },
  duckFamily: (g) => {
    duckFace(g, 4, 6);
    duckFace(g, 10, 6, "#f4f4f8");
    duckFace(g, 7, 12, YEL, true);
  },
  breadSnack: (g) => {
    g.disc(8, 8, 5, "#d89a50").disc(8, 8, 3, "#f8d8a0").px(5, 5, "#a86a2a").px(11, 11, "#a86a2a");
  },
  echoQuack: (g) => {
    waves(g, 2, 8, 2);
    waves(g, 9, 8, 2, "#5ab0e8");
  },
  featherShield: (g) => {
    g.disc(8, 8, 6, "#5ab0e8").disc(8, 8, 4, "#cfeeff");
    feather(g, 6, 12, 10, 4, "#fff");
  },
  braveDuckling: (g) => {
    duckFace(g, 6, 10, YEL, true);
    g.line(11, 2, 11, 9, S).line(9, 7, 13, 7, D).px(11, 1, S);
  },
};

