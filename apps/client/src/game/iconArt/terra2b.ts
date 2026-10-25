// 시즌 2 테라코어 아이콘 (둘째): 붐버(검은 폭탄·불꽃·화약) 무기 10·아이템 10 · 아티팩터(푸른 문신·리펄스) 무기 1·아이템 15
import type { Pen } from "./pen";

const BOMB = "#2a2a34";
const SHINE = "#6a6a7a";
const FUSE = "#c8a070";
const SPARK = "#ffd040";
const FIRE = "#ff6a2a";
const BLUE = "#4a9aff";
const GLOW = "#a8e0ff";
const SKIN = "#e8c0a0";
const GOLD = "#ffd040";

/** 둥근 폭탄 + 도화선 불꽃 */
function bomb(g: Pen, cx: number, cy: number, r: number): void {
  g.disc(cx, cy, r, BOMB).px(cx - 1, cy - 1, SHINE);
  g.line(cx + r - 1, cy - r, cx + r + 1, cy - r - 2, FUSE).px(cx + r + 2, cy - r - 3, SPARK);
}
/** 폭발 (주황 고리 + 노란 속) */
function burst(g: Pen, cx: number, cy: number, r: number): void {
  g.disc(cx, cy, r, FIRE).disc(cx, cy, Math.max(1, r - 2), SPARK);
}
/** 팔뚝 + 푸른 문신 줄 */
function arm(g: Pen): void {
  g.rect(2, 9, 10, 4, SKIN);
  for (const x of [3, 6, 9]) g.px(x, 10, BLUE).px(x + 1, 11, GLOW);
}

export const TERRA2B_WEAPON_ART = {
  bmGrenade: (g: Pen) => {
    g.rect(5, 6, 6, 8, "#4a6a3a").rect(6, 4, 4, 2, "#8a8a8a").px(11, 4, "#c8c8c8");
    g.line(6, 8, 9, 8, "#2a4a2a").line(6, 11, 9, 11, "#2a4a2a");
  },
  bmSticky: (g) => {
    bomb(g, 7, 9, 4);
    g.px(4, 13, "#8aff6a").px(7, 14, "#8aff6a").px(10, 13, "#8aff6a");
  },
  bmCluster: (g) => {
    bomb(g, 5, 6, 3);
    for (const [x, y] of [[10, 10], [13, 6], [6, 13], [12, 13]]) g.disc(x!, y!, 1, BOMB);
  },
  bmMine: (g) => {
    g.rect(2, 10, 12, 3, "#5a5a4a").rect(4, 8, 8, 2, "#7a7a6a").px(8, 7, "#ff2a3a");
  },
  bmRocket: (g) => {
    g.line(2, 13, 11, 4, "#d8dce8").line(3, 13, 12, 4, "#a8b0c0").px(12, 3, "#e84a4a").px(13, 3, "#e84a4a");
    g.px(1, 14, SPARK).px(2, 15, FIRE);
  },
  bmDynamite: (g) => {
    for (const x of [3, 7, 11]) g.rect(x, 5, 3, 9, "#d83a3a").px(x + 1, 4, FUSE).px(x + 1, 3, SPARK);
  },
  bmFirework: (g) => {
    g.line(8, 15, 8, 8, FUSE);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.px(8 + Math.round(Math.cos(a) * 5), 5 + Math.round(Math.sin(a) * 4), ["#ff6a8a", SPARK, "#6ae8ff", "#a87aff"][i % 4]!);
    }
  },
  bmNapalm: (g) => {
    g.rect(5, 2, 6, 7, "#6a6a5a").rect(6, 1, 4, 1, "#9a9a8a");
    burst(g, 8, 12, 3);
    g.px(3, 13, FIRE).px(13, 13, FIRE);
  },
  bmChain: (g) => {
    burst(g, 3, 12, 2);
    burst(g, 8, 8, 2);
    burst(g, 13, 4, 2);
    g.line(4, 11, 7, 9, SPARK).line(9, 7, 12, 5, SPARK);
  },
  bmMega: (g) => {
    bomb(g, 7, 9, 6);
    g.px(4, 7, "#ffffff").rect(6, 9, 3, 1, "#e84a4a");
  },
  afRepulsor: (g) => {
    arm(g);
    g.rect(12, 8, 3, 6, "#3a4a6a").disc(14, 10, 1, GLOW);
    g.ring(14, 10, 2, BLUE);
  },
} satisfies Record<string, (g: Pen) => void>;

export const TERRA2B_PASSIVE_ART = {
  bmPowder: (g: Pen) => g.rect(4, 4, 8, 10, "#8a6a3a").rect(5, 2, 6, 2, "#5a4a2a").rect(6, 7, 4, 3, "#2a2a2a"),
  bmWide: (g) => {
    burst(g, 8, 8, 4);
    g.ring(8, 8, 7, FIRE);
  },
  bmFuse: (g) => {
    g.line(2, 13, 12, 3, FUSE);
    g.px(13, 2, SPARK).px(14, 1, "#ffffff").px(12, 1, SPARK);
  },
  bmMore: (g) => {
    bomb(g, 5, 10, 3);
    bomb(g, 11, 8, 3);
  },
  bmShrapnel: (g) => {
    g.disc(8, 8, 2, SPARK);
    for (const [x, y] of [[2, 2], [14, 2], [2, 14], [14, 14]]) g.line(8, 8, x!, y!, "#a8b0c0");
  },
  bmSuit: (g) => g.rect(4, 3, 8, 11, "#5a6a3a").rect(5, 4, 6, 4, "#2a3a4a").rect(6, 5, 4, 2, "#8ac8ff"),
  bmArtist: (g) => {
    g.line(3, 13, 10, 6, "#8a6a3a").rect(10, 4, 3, 3, "#e8e8f0");
    burst(g, 12, 12, 2);
  },
  bmEcho: (g) => {
    burst(g, 6, 8, 3);
    g.ring(10, 8, 4, FIRE);
  },
  bmBurn: (g) => {
    bomb(g, 6, 10, 3);
    g.disc(12, 7, 2, FIRE).px(12, 4, SPARK);
  },
  bmFinale: (g) => {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      g.line(8, 8, 8 + Math.round(Math.cos(a) * 7), 8 + Math.round(Math.sin(a) * 7), i % 2 ? SPARK : FIRE);
    }
    g.disc(8, 8, 1, "#ffffff");
  },
  afTattoo: (g: Pen) => {
    arm(g);
    g.px(12, 10, BLUE).px(13, 11, GLOW);
  },
  afFocus: (g) => g.ring(8, 8, 6, BLUE).ring(8, 8, 3, GLOW).px(8, 8, "#ffffff"),
  afWide: (g) => {
    g.disc(8, 8, 2, GLOW);
    for (const r of [4, 6]) g.ring(8, 8, r, BLUE);
  },
  afPush: (g) => {
    g.disc(4, 8, 2, GLOW);
    for (const x of [8, 11, 14]) g.line(x, 4, x + 1, 8, BLUE).line(x + 1, 8, x, 12, BLUE);
  },
  afDouble: (g) => g.disc(5, 6, 2, GLOW).disc(11, 10, 2, GLOW).ring(5, 6, 3, BLUE).ring(11, 10, 3, BLUE),
  afCrafter: (g) => {
    g.line(3, 13, 10, 6, "#8a6a3a").rect(9, 3, 5, 4, "#a8b0c0");
    g.px(4, 4, GLOW).px(13, 12, GLOW);
  },
  afLucky: (g) => {
    for (const [x, y] of [[5, 5], [10, 5], [5, 10], [10, 10]]) g.disc(x!, y!, 2, "#4ad86a");
    g.px(8, 13, "#2a8a3a").px(8, 14, "#2a8a3a");
  },
  afBlueprint: (g) => {
    g.rect(2, 3, 12, 10, "#2a5ab8").rect(3, 4, 10, 8, "#3a6ad8");
    g.line(4, 10, 8, 6, GLOW).line(8, 6, 12, 10, GLOW).rect(6, 9, 4, 2, GLOW);
  },
  afShield: (g) => g.ring(8, 8, 6, BLUE).ring(8, 8, 5, GLOW),
  afSurge: (g) => {
    g.line(9, 1, 5, 8, GLOW).line(5, 8, 10, 8, GLOW).line(10, 8, 6, 15, GLOW);
    g.px(9, 2, "#ffffff");
  },
  afPhoenix: (g) => {
    g.disc(8, 9, 3, FIRE).disc(8, 9, 1, GOLD);
    g.line(5, 8, 1, 4, FIRE).line(11, 8, 15, 4, FIRE).px(8, 4, GOLD);
  },
  afOverdrive: (g) => {
    g.ring(8, 8, 6, GOLD);
    g.line(9, 2, 6, 8, "#ffffff").line(6, 8, 10, 8, "#ffffff").line(10, 8, 7, 14, "#ffffff");
  },
  afGolem: (g) => {
    g.rect(4, 3, 8, 6, "#8a8a9a").rect(3, 9, 10, 5, "#6a6a7a");
    g.px(6, 5, GOLD).px(9, 5, GOLD).line(5, 11, 10, 11, BLUE);
  },
  afSingularity: (g) => {
    g.disc(8, 8, 2, "#0a0a14");
    for (let i = 0; i < 3; i++) g.ring(8, 8, 3 + i * 2, i % 2 ? GOLD : "#a87aff");
  },
  afInfinity: (g) => {
    g.ring(5, 8, 3, GOLD).ring(11, 8, 3, GOLD);
    g.px(8, 8, "#ffffff");
  },
} satisfies Record<string, (g: Pen) => void>;
