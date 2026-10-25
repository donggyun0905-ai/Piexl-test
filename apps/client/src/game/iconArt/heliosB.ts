// 시즌 2 헬리오스 아이콘 (둘째): 이터 그림자 1·아이템 10 (검은 아가리·붉은 눈·흰 이빨) · 묵인 돌진 10·아이템 10 (쇠뿔·판금·충격파)
import type { Pen } from "./pen";

const INK = "#1a1420";
const RED = "#ff2030";
const TOOTH = "#f4f0f8";
const IRON = "#8a8e9a";
const IRON_L = "#c8ccd8";
const IRON_D = "#4a4e5a";
const CLOTH = "#a81e2a";
const GOLD = "#d8b060";

/** 이빨 달린 아가리 (가운데 cx·cy, 너비 w) */
function maw(g: Pen, cx: number, cy: number, w: number): void {
  g.rect(cx - w, cy - 3, w * 2 + 1, 7, INK);
  for (let x = cx - w + 1; x < cx + w; x += 2) g.px(x, cy - 2, TOOTH).px(x + 1, cy + 2, TOOTH);
  g.rect(cx - w + 1, cy, w * 2 - 1, 1, "#5a0e18");
}
/** 쇠뿔 투구 머리 (돌진 무기 바탕) */
function horn(g: Pen, tint = IRON): void {
  g.rect(3, 7, 9, 6, tint).rect(4, 8, 7, 1, IRON_L).rect(3, 12, 9, 1, IRON_D);
  g.line(11, 7, 14, 3, IRON_L).px(12, 6, tint).px(13, 5, tint);
  g.px(5, 10, RED).px(8, 10, RED);
}
const speed = (g: Pen, y: number) => g.line(0, y, 2, y, IRON_L);

export const HELIOS_B_WEAPON_ART = {
  shadowMaw: (g: Pen) => {
    g.disc(8, 8, 6, INK);
    maw(g, 8, 10, 4);
    g.px(6, 5, RED).px(10, 5, RED).px(3, 14, INK).px(13, 14, INK).px(2, 15, INK);
  },
  ironHorn: (g) => {
    horn(g);
    speed(g, 9);
    speed(g, 11);
  },
  shieldBash: (g) => {
    g.rect(4, 3, 8, 10, IRON).rect(5, 4, 6, 1, IRON_L).rect(7, 6, 2, 4, GOLD).px(8, 13, IRON_D);
    g.px(13, 5, "#ffe070").px(14, 8, "#ffe070").px(13, 11, "#ffe070");
  },
  quakeRam: (g) => {
    horn(g);
    g.line(1, 15, 15, 15, "#7a5a3a").px(4, 14, "#7a5a3a").px(9, 14, "#7a5a3a").px(13, 14, "#7a5a3a");
  },
  longRam: (g) => {
    horn(g);
    speed(g, 8);
    g.line(0, 10, 2, 10, IRON_L).line(0, 12, 1, 12, IRON_L).line(0, 14, 6, 14, IRON_L);
  },
  twinRam: (g) => {
    horn(g);
    g.line(2, 2, 9, 2, GOLD).px(3, 1, GOLD).px(3, 3, GOLD).px(8, 1, GOLD).px(8, 3, GOLD);
  },
  chainRam: (g) => {
    horn(g);
    for (const x of [1, 4, 7]) g.ring(x + 1, 15, 1, IRON_D);
  },
  wallRam: (g) => {
    horn(g);
    g.rect(14, 2, 2, 13, "#a8a090").px(14, 5, "#7a7060").px(15, 10, "#7a7060");
  },
  spikeRam: (g) => {
    horn(g);
    for (const x of [2, 7, 12]) g.ring(x, 15, 1, "#e8c070");
  },
  fortressRam: (g) => {
    horn(g, "#6a7080");
    g.rect(1, 1, 5, 5, CLOTH).px(3, 3, GOLD);
  },
  meteorRam: (g) => {
    horn(g, "#a86a3a");
    g.px(0, 3, "#ff8a2a").px(1, 4, "#ffd040").px(2, 5, "#ff8a2a").px(0, 6, "#ff6a2a").px(1, 1, "#ff8a2a");
  },
} satisfies Record<string, (g: Pen) => void>;

export const HELIOS_B_PASSIVE_ART = {
  eaGluttony: (g) => {
    maw(g, 8, 8, 5);
    g.disc(8, 8, 1, RED);
  },
  eaHunger: (g) => {
    g.ring(8, 8, 6, INK).ring(8, 8, 5, "#3a2a4a");
    g.px(6, 6, RED).px(10, 6, RED).line(5, 11, 11, 11, TOOTH);
  },
  eaMaw: (g) => maw(g, 8, 8, 7),
  eaFang: (g) => {
    for (const x of [3, 7, 11]) g.line(x, 3, x + 1, 12, TOOTH).px(x + 1, 13, "#c8c0d8");
    g.line(1, 14, 14, 14, INK);
  },
  eaAbyss: (g) => {
    g.disc(8, 11, 5, INK).disc(8, 12, 3, "#3a1a4a");
    for (const x of [4, 7, 10, 12]) g.px(x, 7, TOOTH);
    g.px(6, 9, RED).px(10, 9, RED);
  },
  eaDevour: (g) => {
    g.disc(8, 8, 6, INK);
    g.disc(8, 9, 2, "#e8a070");
    for (let x = 3; x <= 13; x += 2) g.px(x, 4, TOOTH).px(x, 13, TOOTH);
  },
  eaFeast: (g) => {
    maw(g, 8, 6, 4);
    g.disc(8, 12, 3, "#e05a5a").px(7, 11, "#ff9a9a");
  },
  eaFrenzy: (g) => {
    g.disc(8, 8, 5, INK);
    g.px(6, 7, RED).px(10, 7, RED).px(5, 6, RED).px(11, 6, RED);
    g.line(1, 3, 4, 5, RED).line(15, 3, 12, 5, RED);
  },
  eaShade: (g) => {
    g.rect(4, 3, 8, 11, INK).rect(5, 2, 6, 1, INK);
    g.px(6, 6, RED).px(9, 6, RED).line(2, 14, 13, 14, "#3a2a4a");
  },
  eaEcho: (g) => {
    maw(g, 6, 8, 3);
    g.ring(9, 8, 6, "#5a3a6a").ring(9, 8, 4, "#3a2a4a");
  },
  mkPlate: (g) => g.rect(3, 3, 10, 10, IRON).rect(4, 4, 8, 1, IRON_L).rect(3, 12, 10, 1, IRON_D).px(5, 6, GOLD).px(10, 6, GOLD).px(5, 10, GOLD).px(10, 10, GOLD),
  mkBulk: (g) => {
    g.rect(2, 6, 12, 8, IRON).rect(1, 5, 4, 3, IRON_L).rect(11, 5, 4, 3, IRON_L);
    g.disc(8, 4, 2, "#c8906a").rect(6, 10, 4, 4, CLOTH);
  },
  mkSpikes: (g) => {
    g.rect(4, 5, 8, 8, IRON);
    for (const [x, y] of [[3, 4], [12, 4], [2, 9], [13, 9], [8, 2]]) g.px(x!, y!, IRON_L);
  },
  mkRegen: (g) => g.disc(8, 8, 5, "#8a7a6a").disc(8, 8, 2, "#e05a5a").px(6, 6, "#c8b8a8"),
  mkMomentum: (g) => {
    g.line(4, 8, 13, 8, IRON_L).px(12, 7, IRON_L).px(12, 9, IRON_L).px(11, 6, IRON_L).px(11, 10, IRON_L);
    speed(g, 5);
    speed(g, 11);
  },
  mkShock: (g) => {
    g.disc(8, 8, 3, IRON);
    for (const [x, y] of [[8, 2], [14, 8], [8, 14], [2, 8]]) g.px(x!, y!, "#ffe070");
    g.px(12, 4, "#ffe070").px(4, 12, "#ffe070");
  },
  mkMeditate: (g) => {
    g.disc(8, 5, 2, "#c8906a").rect(5, 8, 6, 5, IRON).rect(3, 12, 10, 2, IRON_D);
    g.ring(8, 8, 7, "#a8b8ff");
  },
  mkPotion: (g) => g.rect(4, 6, 8, 8, "#6a8a3a").rect(5, 4, 6, 2, "#8a6a3a").px(7, 9, "#c8ff8a").px(9, 11, "#c8ff8a"),
  mkTrample: (g) => {
    g.rect(5, 2, 6, 7, IRON_D).rect(4, 8, 8, 2, "#2a2026");
    g.line(1, 13, 15, 13, "#7a5a3a").ring(8, 13, 3, "#e8c070");
  },
  mkIron: (g) => g.disc(8, 8, 6, IRON).disc(8, 8, 3, IRON_D).px(8, 8, RED).px(5, 5, IRON_L),
} satisfies Record<string, (g: Pen) => void>;
