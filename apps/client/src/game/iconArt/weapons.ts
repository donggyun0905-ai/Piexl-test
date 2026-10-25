// 무기 아이콘: 이름에 맞는 모양을 하나씩
import { WEAPONS, type WeaponDef, type WeaponId } from "@pixel-rogue/shared";
import { CHAR_COLOR, S, D, W, G, K, Pen, bow, arrow, crossbow, staff, sword, haft, star, orb } from "./pen";
import { TALISMAN_WEAPON_ART } from "./talismans";
import { ENGINEER_WEAPON_ART } from "./engineer";
import { ELEMENTAL_WEAPON_ART } from "./elemental";
import { BRAWLER_WEAPON_ART } from "./brawler";
import { DOCTOR_WEAPON_ART } from "./doctor";
import { GUNNER_WEAPON_ART } from "./gunner";
import { BEAST_WEAPON_ART } from "./beast";
import { NINJA_WEAPON_ART } from "./ninja";
import { CHRONO_WEAPON_ART } from "./chrono";
import { SUMMON_WEAPON_ART } from "./summon";
import { BEDOUIN_WEAPON_ART } from "./bedouin";
import { GENERAL_WEAPON_ART } from "./general";
import { IMUGI_WEAPON_ART } from "./imugi";
import { APOSTLE_WEAPON_ART } from "./apostle";
import { ABANDONED_WEAPON_ART } from "./abandoned";
import { TITAN_WEAPON_ART } from "./titan";
import { ONI_WEAPON_ART } from "./oni";
import { STAR_WEAPON_ART } from "./star";
import { DUCK_WEAPON_ART } from "./duck";
import { SCRIBE_WEAPON_ART } from "./scribe";
import { IDRA_WEAPON_ART } from "./idra";
import { MORPH_WEAPON_ART } from "./morph";
import { FLY_WEAPON_ART } from "./fly";
import { ELDER_WEAPON_ART } from "./elder";
import { HELIOS2_WEAPON_ART } from "./helios2";
import { HELIOS_B_WEAPON_ART } from "./heliosB";
import { HELIOS_C_WEAPON_ART } from "./heliosC";
import { TERRA2_WEAPON_ART } from "./terra2";
import { TERRA2B_WEAPON_ART } from "./terra2b";
import { TERRA2C_WEAPON_ART } from "./terra2c";
import { REN_WEAPON_ART } from "./ren";
import { SPIRIT_WEAPON_ART } from "./spirit";

const WEAPON_ART: Record<WeaponId, (g: Pen) => void> = {
  ...ENGINEER_WEAPON_ART,
  ...ELEMENTAL_WEAPON_ART,
  ...BRAWLER_WEAPON_ART,
  ...DOCTOR_WEAPON_ART,
  ...GUNNER_WEAPON_ART,
  ...BEAST_WEAPON_ART,
  ...NINJA_WEAPON_ART,
  ...CHRONO_WEAPON_ART,
  ...SUMMON_WEAPON_ART,
  ...BEDOUIN_WEAPON_ART,
  ...GENERAL_WEAPON_ART,
  ...IMUGI_WEAPON_ART,
  ...APOSTLE_WEAPON_ART,
  ...ABANDONED_WEAPON_ART,
  ...TITAN_WEAPON_ART,
  ...ONI_WEAPON_ART,
  ...STAR_WEAPON_ART,
  ...DUCK_WEAPON_ART,
  ...SCRIBE_WEAPON_ART,
  ...IDRA_WEAPON_ART,
  ...MORPH_WEAPON_ART,
  ...FLY_WEAPON_ART,
  ...ELDER_WEAPON_ART,
  ...HELIOS2_WEAPON_ART,
  ...HELIOS_B_WEAPON_ART,
  ...HELIOS_C_WEAPON_ART,
  ...TERRA2_WEAPON_ART,
  ...TERRA2B_WEAPON_ART,
  ...TERRA2C_WEAPON_ART,
  ...REN_WEAPON_ART,
  ...SPIRIT_WEAPON_ART,
  // 공용 (0.48.0) · 풋내기 맨손
  club: (g) => {
    haft(g, 2, 14, 9, 7);
    g.disc(11, 5, 3, W).px(10, 4, "#b8925a").px(13, 3, D);
  },
  dagger: (g) => sword(g, 3, S),
  javelin: (g) => {
    g.line(1, 15, 12, 4, W).line(12, 4, 15, 1, S).px(14, 3, D).px(12, 2, D);
  },
  boomerang: (g) => {
    g.line(3, 4, 8, 9, "#c8925a").line(8, 9, 13, 4, "#c8925a").line(3, 5, 8, 10, "#8a5a2a").line(8, 10, 13, 5, "#8a5a2a");
  },
  fists: (g) => {
    g.rect(4, 6, 8, 6, "#e8c8a0").rect(4, 6, 8, 1, "#c8a080").px(6, 8, "#c8a080").px(8, 8, "#c8a080").px(10, 8, "#c8a080").rect(3, 9, 2, 3, "#e8c8a0");
  },
  // 근접
  greatblade: (g) => sword(g, 8, S, true),
  shortsword: (g) => sword(g, 4, S),
  spear: (g) => {
    haft(g, 2, 14, 11, 5);
    g.rect(11, 3, 3, 3, S).rect(13, 1, 2, 3, S).px(15, 0, S).px(12, 2, D).px(10, 5, D).px(11, 6, D);
  },
  warhammer: (g) => {
    haft(g, 2, 14, 10, 6);
    g.rect(7, 2, 8, 5, D).rect(7, 2, 8, 2, S).rect(14, 3, 1, 3, K);
  },
  twinaxes: (g) => {
    g.line(2, 14, 8, 8, W).line(2, 8, 8, 14, W);
    g.rect(9, 6, 4, 4, S).px(13, 7, D).px(13, 8, D).px(9, 5, D);
    g.rect(1, 6, 4, 4, S).px(0, 7, D).px(0, 8, D);
  },
  halberd: (g) => {
    haft(g, 2, 14, 11, 5);
    g.rect(10, 2, 5, 4, S).px(15, 3, D).px(15, 4, D).px(12, 1, S).px(12, 0, S).px(9, 4, D);
  },
  whirlblade: (g) => {
    g.ring(8, 8, 5, D);
    for (const [x, y] of [[8, 2], [14, 8], [8, 14], [2, 8]] as const) g.px(x, y, S);
    g.px(11, 3, S).px(13, 5, S).px(3, 11, S).px(5, 13, S).px(8, 8, G);
    g.line(8, 6, 8, 10, W).line(6, 8, 10, 8, W);
  },
  broadaxe: (g) => {
    haft(g, 2, 14, 10, 6);
    g.rect(9, 1, 3, 9, S).rect(12, 0, 2, 11, S).rect(14, 1, 1, 9, D).rect(8, 3, 1, 5, S);
    g.rect(10, 4, 2, 3, K).px(11, 5, D);
  },
  flail: (g) => {
    g.line(2, 14, 6, 10, W);
    g.line(6, 10, 8, 7, D).px(8, 6, D).px(9, 5, D);
    g.disc(11, 4, 3, D).px(10, 3, S).px(11, 0, S).px(14, 4, S).px(8, 4, S).px(11, 8, S);
  },
  sabre: (g) => {
    g.line(2, 14, 4, 12, W).px(4, 11, G).px(5, 12, G).px(3, 11, G).px(5, 13, G);
    g.line(6, 10, 9, 5, S).line(9, 5, 13, 3, S).px(13, 4, D).px(14, 3, S).px(8, 8, D);
  },
  towershield: (g) => {
    g.rect(3, 2, 10, 8, D).rect(4, 10, 8, 2, D).rect(5, 12, 6, 1, D).rect(6, 13, 4, 1, D);
    g.rect(4, 3, 8, 6, "#4a6ab0").rect(7, 3, 2, 10, G).rect(4, 6, 8, 2, G).px(8, 7, "#fff");
  },
  runeblade: (g) => {
    sword(g, 8, "#9ec0ff", true, "#5a80d8");
    g.px(9, 7, "#fff").px(11, 5, "#fff").px(7, 9, "#fff");
  },
  glaive: (g) => {
    haft(g, 2, 14, 9, 7);
    g.line(9, 7, 12, 2, S).line(10, 7, 13, 3, S).line(11, 7, 14, 4, D).px(13, 2, D);
  },
  // 원거리
  crossbow: (g) => crossbow(g, W),
  repeater: (g) => {
    crossbow(g, W);
    g.rect(4, 4, 4, 4, K).rect(5, 5, 2, 2, G); // 연발 상자
  },
  arbalest: (g) => crossbow(g, D, "#fff"),
  heavycrossbow: (g) => {
    crossbow(g, "#6a5a8a");
    g.rect(2, 7, 11, 1, W).line(4, 9, 15, 9, S).px(15, 8, S).px(15, 10, S).px(14, 8, D).px(14, 10, D);
  },
  sling: (g) => {
    g.line(4, 14, 8, 10, W).line(8, 10, 5, 4, "#c8b890").line(8, 10, 11, 4, "#c8b890");
    g.disc(8, 3, 2, D).px(7, 2, S);
    g.px(11, 3, "#c8b890").px(5, 3, "#c8b890");
  },
  longbow: (g) => {
    bow(g, 3, 8, 7);
    arrow(g, 3, 14, 8);
  },
  shortbow: (g) => {
    bow(g, 5, 8, 4);
    arrow(g, 5, 12, 8);
  },
  scatterbow: (g) => {
    bow(g, 3, 8, 6);
    arrow(g, 4, 13, 8);
    g.line(4, 8, 12, 4, "#b89a6a").px(13, 3, S).line(4, 8, 12, 12, "#b89a6a").px(13, 13, S);
  },
  huntingbow: (g) => {
    bow(g, 3, 8, 6, "#4a8a4a");
    arrow(g, 4, 14, 8, "#9ae08a");
    g.line(4, 8, 13, 6, "#b89a6a").px(14, 6, "#9ae08a").line(4, 8, 13, 10, "#b89a6a").px(14, 10, "#9ae08a");
  },
  volleybow: (g) => {
    bow(g, 2, 8, 7, "#b88a3a");
    for (const dy of [-6, -3, 0, 3, 6]) g.line(3, 8, 13, 8 + dy, "#b89a6a").px(14, 8 + dy, S);
  },
  knives: (g) => {
    for (const [x, y] of [[2, 12], [5, 8], [8, 4]] as const) {
      g.line(x, y + 2, x + 1, y + 3, W).line(x + 2, y, x + 6, y - 3, S).px(x + 1, y + 1, G).px(x + 2, y + 1, D).px(x + 7, y - 3, S);
    }
  },
  chakram: (g) => {
    g.ring(8, 8, 6, S).ring(8, 8, 3, D);
    g.px(8, 1, D).px(8, 15, D).px(1, 8, D).px(15, 8, D).px(3, 3, D).px(13, 13, D).px(13, 3, D).px(3, 13, D);
  },
  // 마법
  emberstaff: (g) => {
    staff(g);
    g.disc(12, 4, 3, "#ff8a30").disc(12, 5, 1, "#ffe070").px(12, 0, "#ff8a30").px(11, 1, "#ff6a20").px(13, 1, "#ff6a20");
  },
  stormstaff: (g) => {
    staff(g);
    orb(g, 12, 4, 3, "#4ac0e8");
    g.px(14, 1, "#fff8a0").px(13, 2, "#fff8a0").px(14, 3, "#fff8a0").px(10, 7, "#fff8a0");
  },
  frostwand: (g) => {
    g.line(3, 14, 9, 8, W);
    g.line(11, 2, 11, 8, "#bff0ff").line(8, 5, 14, 5, "#bff0ff").line(9, 3, 13, 7, "#8ad8f0").line(13, 3, 9, 7, "#8ad8f0").px(11, 5, "#fff");
  },
  lightningrod: (g) => {
    g.line(3, 14, 9, 8, "#6a5a8a");
    g.line(12, 1, 9, 5, "#ffe84a").line(9, 5, 12, 6, "#ffe84a").line(12, 6, 10, 10, "#ffe84a").px(13, 1, "#fff");
    g.px(9, 6, "#ffe84a").px(11, 6, "#fff");
  },
  cometstaff: (g) => {
    staff(g);
    g.line(11, 5, 4, 1, "#ff9a60").line(11, 4, 6, 0, "#ffd0a0").disc(12, 5, 2, "#ffe0a0").px(12, 5, "#fff");
  },
  triorb: (g) => {
    orb(g, 8, 3, 2, "#e06ad8");
    orb(g, 4, 11, 2, "#6ad0e0");
    orb(g, 12, 11, 2, "#e0d06a");
    g.px(7, 6, "#b0a8c8").px(5, 8, "#b0a8c8").px(9, 6, "#b0a8c8").px(11, 8, "#b0a8c8").px(8, 12, "#b0a8c8");
  },
  starfall: (g) => {
    star(g, 4, 4, "#ffe070", true);
    star(g, 11, 6, "#ffe070");
    star(g, 6, 11, "#ffe070");
    star(g, 13, 12, "#ffd0a0");
  },
  shadowstaff: (g) => {
    staff(g);
    g.disc(12, 4, 3, "#2a1a4a").ring(12, 4, 3, "#9a6ad8").px(11, 3, "#c0a0ff");
  },
  flameglove: (g) => {
    g.rect(4, 8, 8, 6, "#6a4a8a").rect(5, 6, 6, 2, "#8a6aaa").rect(3, 9, 2, 3, "#6a4a8a");
    g.px(5, 5, "#8a6aaa").px(7, 5, "#8a6aaa").px(9, 5, "#8a6aaa").rect(4, 13, 8, 1, "#3a2a5a");
    g.px(8, 3, "#ff8a30").px(7, 2, "#ff8a30").px(8, 1, "#ffd060").px(9, 3, "#ff6a20").px(7, 4, "#ffd060").px(8, 4, "#ff8a30");
  },
  voidorb: (g) => {
    g.disc(8, 8, 5, "#14081f").ring(8, 8, 6, "#9a50e0").ring(8, 8, 3, "#4a2a7a").px(6, 6, "#c0a0ff");
  },
  ...TALISMAN_WEAPON_ART,
  starwand: (g) => {
    g.line(3, 14, 9, 8, W);
    star(g, 11, 5, G, true);
  },
};

export function weaponArt(g: Pen, id: WeaponId): void {
  const w: WeaponDef = WEAPONS[id];
  WEAPON_ART[id](g);
  // 전용 무기는 왼쪽 아래 모서리에 캐릭터 색 점
  if (w.exclusive) g.rect(0, 14, 2, 2, CHAR_COLOR[w.exclusive]);
}
