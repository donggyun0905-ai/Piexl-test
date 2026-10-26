// 시즌 2 테라코어 아이콘: 오토마타(하늘빛 레이저·인형·미사일) · 라이더(주황 불꽃·쇠·바퀴) 무기 20·아이템 20
import type { Pen } from "./pen";

const LZ = "#8ae8ff";
const LZW = "#e8fcff";
const STEEL = "#a8b0c0";
const DARK = "#3a3446";
const FIRE = "#ff8a3a";
const HOT = "#ffd040";
const SMOKE = "#9aa0aa";
const PULSE = "#6ae8ff";
const RIDE = "#2a5ad8";

/** 손 + 손끝에서 뻗는 레이저 (len 길이, w 굵기) */
function hand(g: Pen, w = 1, len = 10, c = LZ): void {
  g.rect(1, 9, 3, 3, "#f0dcd0").px(4, 10, "#f0dcd0");
  for (let i = 0; i < w; i++) g.line(5, 10 - Math.floor(w / 2) + i, 5 + len, 10 - Math.floor(w / 2) + i - 5, c);
  g.line(5, 10, 5 + len, 5, LZW);
}
/** 미사일 하나 (끝에서 연기) */
function missile(g: Pen, x: number, y: number): void {
  g.rect(x, y, 3, 1, "#e8e8f0").px(x + 3, y, "#e84a4a").px(x - 1, y, HOT).px(x - 2, y, SMOKE).px(x - 3, y + 1, SMOKE);
}
/** 작은 인형 머리 (자매) */
function doll(g: Pen, x: number, y: number): void {
  g.rect(x, y, 3, 3, "#e8e0f0").px(x + 1, y + 1, LZ).rect(x, y + 3, 3, 2, "#4a5a7a");
}
/** 바퀴 */
function wheel(g: Pen, cx: number, cy: number, r: number): void {
  g.ring(cx, cy, r, DARK).px(cx, cy, STEEL);
}

export const TERRA2_WEAPON_ART = {
  adFinger: (g: Pen) => hand(g),
  adSisters: (g) => {
    doll(g, 2, 2);
    doll(g, 7, 1);
    doll(g, 12, 3);
    g.line(4, 9, 14, 14, LZ);
  },
  adMissile: (g) => {
    missile(g, 6, 3);
    missile(g, 9, 6);
    missile(g, 5, 9);
    hand(g, 1, 6);
  },
  adRed: (g) => {
    hand(g);
    g.line(5, 11, 15, 10, "#ff3a4a").line(5, 12, 15, 11, "#ffb0b8");
    g.px(14, 6, "#ffe14a").px(13, 5, "#ffe14a").px(15, 5, "#ffe14a");
  },
  adPrism: (g) => {
    g.line(1, 13, 8, 8, LZ).line(8, 8, 14, 2, "#c8a8ff").line(8, 8, 15, 8, "#ff8ac8").line(8, 8, 13, 14, "#8aff9a");
    g.disc(8, 8, 1, LZW);
  },
  adCannon: (g) => {
    g.rect(1, 6, 7, 5, STEEL).rect(8, 7, 2, 3, DARK);
    g.rect(10, 6, 6, 5, LZ).rect(10, 7, 6, 3, LZW);
  },
  adSweep: (g) => {
    for (let i = -2; i <= 2; i++) g.line(3, 10, 14, 10 + i * 3 - 4, LZ);
    g.disc(3, 10, 1, "#f0dcd0");
  },
  adBind: (g) => {
    hand(g);
    g.ring(13, 5, 2, "#c8a8ff").ring(13, 5, 3, "#8a6ad8");
  },
  adSatellite: (g) => {
    g.rect(5, 1, 6, 3, STEEL).rect(1, 2, 4, 1, LZ).rect(11, 2, 4, 1, LZ);
    g.rect(7, 4, 2, 10, LZ).rect(5, 13, 6, 2, LZW);
  },
  adSword: (g) => {
    g.line(3, 13, 13, 3, "#c8f0ff").line(4, 13, 14, 3, LZ).line(4, 12, 13, 3, LZW);
    g.line(2, 10, 6, 14, STEEL).rect(1, 14, 2, 2, DARK);
  },
  rdHammer: (g) => {
    g.line(3, 14, 10, 7, "#6a4a2a");
    g.rect(8, 2, 6, 6, STEEL).rect(9, 3, 4, 4, "#d8dce8").px(13, 2, RIDE);
  },
  rdPulse: (g) => {
    g.rect(2, 7, 8, 3, DARK).rect(3, 10, 2, 3, DARK).rect(10, 8, 2, 1, STEEL);
    g.disc(14, 8, 1, PULSE).px(12, 6, PULSE).px(12, 10, PULSE);
  },
  rdDagger: (g) => {
    g.line(3, 13, 12, 4, "#e8ecf4").line(4, 13, 13, 4, STEEL);
    g.rect(2, 12, 3, 3, DARK).px(13, 3, "#ff4a5a");
  },
  rdRail: (g) => {
    g.rect(1, 7, 10, 3, STEEL).rect(1, 8, 10, 1, PULSE);
    g.line(11, 8, 15, 8, LZW).px(15, 7, PULSE).px(15, 9, PULSE);
  },
  rdScatter: (g) => {
    g.rect(1, 7, 6, 3, DARK);
    for (let i = -2; i <= 2; i++) g.px(10 + Math.abs(i), 8 + i * 2, PULSE).px(12 + Math.abs(i), 8 + i * 3, PULSE);
  },
  rdExhaust: (g) => {
    g.rect(1, 9, 5, 3, STEEL);
    g.disc(9, 10, 2, FIRE).disc(12, 8, 2, HOT).px(14, 6, "#ff4a2a").px(15, 9, HOT);
  },
  rdWheel: (g) => {
    g.ring(8, 8, 6, STEEL).ring(8, 8, 3, DARK);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.px(8 + Math.round(Math.cos(a) * 7), 8 + Math.round(Math.sin(a) * 7), "#e8ecf4");
    }
  },
  rdLance: (g) => {
    g.line(1, 14, 13, 2, STEEL).line(2, 14, 14, 2, DARK);
    g.px(14, 1, HOT).px(12, 1, PULSE).px(15, 3, PULSE).px(13, 4, PULSE);
  },
  rdChain: (g) => {
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 1.6;
      g.px(8 + Math.round(Math.cos(a) * 6), 8 + Math.round(Math.sin(a) * 6), i % 2 ? STEEL : "#d8dce8");
    }
    g.disc(8, 8, 1, DARK);
  },
  rdNitro: (g) => {
    g.rect(4, 5, 4, 7, "#3a7ad8").rect(5, 4, 2, 1, STEEL).px(5, 7, "#ffffff");
    g.disc(10, 12, 2, FIRE).px(13, 13, HOT).px(12, 10, HOT);
  },
} satisfies Record<string, (g: Pen) => void>;

export const TERRA2_PASSIVE_ART = {
  adCore: (g: Pen) => g.disc(8, 8, 5, STEEL).disc(8, 8, 3, LZ).disc(8, 8, 1, LZW),
  adFocus: (g) => {
    g.ring(7, 7, 5, STEEL).disc(7, 7, 3, "#c8f4ff");
    g.line(11, 11, 15, 15, LZ);
  },
  adWide: (g) => {
    g.ring(5, 8, 4, STEEL);
    for (const y of [3, 8, 13]) g.line(9, 8, 15, y, LZ);
  },
  adCall: (g) => {
    doll(g, 6, 4);
    g.ring(7, 7, 6, LZ);
  },
  adFourth: (g) => {
    doll(g, 1, 2);
    doll(g, 6, 2);
    doll(g, 11, 2);
    doll(g, 6, 9);
  },
  adWarhead: (g) => {
    missile(g, 4, 4);
    g.disc(11, 11, 3, HOT).disc(11, 11, 2, FIRE);
  },
  adSalvo: (g) => {
    for (let i = 0; i < 4; i++) g.rect(2 + i * 3, 3, 2, 9, i % 2 ? "#d8dce8" : STEEL).px(2 + i * 3, 2, "#e84a4a");
  },
  adEcho: (g) => {
    hand(g, 1, 9, "#4a8aa8");
    g.line(5, 12, 14, 7, LZ);
  },
  adShield: (g) => g.ring(8, 8, 6, LZ).ring(8, 8, 5, "#c8f4ff").disc(8, 8, 2, "#e8e0f0"),
  adSoul: (g) => {
    g.rect(5, 3, 6, 6, "#e8e0f0").px(7, 5, LZ).px(9, 5, LZ).rect(5, 9, 6, 4, "#4a5a7a");
    g.px(8, 1, "#ff8ac8").px(7, 0, "#ff8ac8").px(9, 0, "#ff8ac8");
  },
  rdTurbo: (g) => {
    wheel(g, 8, 8, 5);
    g.line(1, 5, 4, 5, RIDE).line(1, 11, 4, 11, RIDE);
  },
  rdTank: (g) => g.rect(5, 3, 6, 11, "#3a7ad8").rect(6, 2, 4, 1, STEEL).rect(6, 6, 4, 2, "#ffffff"),
  rdShock: (g) => g.ring(8, 8, 6, PULSE).ring(8, 8, 3, LZW).disc(8, 8, 1, "#ffffff"),
  rdDouble: (g) => g.ring(6, 8, 4, PULSE).ring(10, 8, 4, LZ),
  rdSlip: (g) => {
    for (const y of [4, 8, 12]) g.line(1, y, 14, y - 2, "#c8d8e8");
  },
  rdRam: (g) => {
    g.rect(2, 6, 7, 5, RIDE).rect(9, 7, 3, 3, STEEL);
    g.px(13, 6, HOT).px(14, 9, HOT).px(13, 11, HOT);
  },
  rdDrift: (g) => {
    wheel(g, 9, 9, 4);
    for (let i = 0; i < 4; i++) g.px(2 + i, 13 - i, SMOKE).px(1 + i, 14 - i, "#c8ccd4");
  },
  rdGear: (g) => {
    g.ring(8, 8, 5, STEEL).disc(8, 8, 2, DARK);
    for (const [x, y] of [[8, 1], [8, 15], [1, 8], [15, 8]]) g.px(x!, y!, STEEL);
    g.line(8, 8, 12, 4, RIDE);
  },
  rdRepair: (g) => {
    g.line(3, 13, 12, 4, STEEL).rect(10, 2, 4, 3, STEEL);
    g.rect(2, 3, 4, 2, "#4ad86a").rect(3, 2, 2, 4, "#4ad86a");
  },
  rdBurn: (g) => {
    wheel(g, 6, 10, 4);
    g.disc(12, 9, 2, FIRE).px(13, 6, HOT).px(15, 10, HOT);
  },
} satisfies Record<string, (g: Pen) => void>;
