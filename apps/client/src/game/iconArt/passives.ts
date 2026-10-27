// 패시브 아이콘: 이름에 맞는 그림, 없으면 무늬 보석
import { PASSIVES, type PassiveDef, type PassiveId } from "@pixel-rogue/shared";
import { CHAR_COLOR, S, W, G, K, Pen } from "./pen";
import { TALISMAN_PASSIVE_ART } from "./talismans";
import { ENGINEER_PASSIVE_ART } from "./engineer";
import { ELEMENTAL_PASSIVE_ART } from "./elemental";
import { BRAWLER_PASSIVE_ART } from "./brawler";
import { DOCTOR_PASSIVE_ART } from "./doctor";
import { GUNNER_PASSIVE_ART } from "./gunner";
import { BEAST_PASSIVE_ART } from "./beast";
import { NINJA_PASSIVE_ART } from "./ninja";
import { CHRONO_PASSIVE_ART } from "./chrono";
import { SUMMON_PASSIVE_ART } from "./summon";
import { BEDOUIN_PASSIVE_ART } from "./bedouin";
import { GENERAL_PASSIVE_ART } from "./general";
import { IMUGI_PASSIVE_ART } from "./imugi";
import { APOSTLE_PASSIVE_ART } from "./apostle";
import { ABANDONED_PASSIVE_ART } from "./abandoned";
import { TITAN_PASSIVE_ART } from "./titan";
import { ONI_PASSIVE_ART } from "./oni";
import { STAR_PASSIVE_ART } from "./star";
import { DUCK_PASSIVE_ART } from "./duck";
import { SCRIBE_PASSIVE_ART } from "./scribe";
import { IDRA_PASSIVE_ART } from "./idra";
import { MORPH_PASSIVE_ART } from "./morph";
import { FLY_PASSIVE_ART } from "./fly";
import { ELDER_PASSIVE_ART } from "./elder";
import { HELIOS2_PASSIVE_ART } from "./helios2";
import { HELIOS_B_PASSIVE_ART } from "./heliosB";
import { HELIOS_C_PASSIVE_ART } from "./heliosC";
import { TERRA2_PASSIVE_ART } from "./terra2";
import { TERRA2B_PASSIVE_ART } from "./terra2b";
import { TERRA2C_PASSIVE_ART } from "./terra2c";
import { ASC_PASSIVE_ART } from "./ascalon";
import { REN_PASSIVE_ART } from "./ren";
import { SPIRIT_PASSIVE_ART } from "./spirit";

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** 이름에 맞는 패시브 아이콘 (공통·능력치 아이템). 없으면 무늬 보석 */
export const PASSIVE_ART: Partial<Record<PassiveId, (g: Pen) => void>> = {
  ...ENGINEER_PASSIVE_ART,
  ...ELEMENTAL_PASSIVE_ART,
  ...BRAWLER_PASSIVE_ART,
  ...DOCTOR_PASSIVE_ART,
  ...GUNNER_PASSIVE_ART,
  ...BEAST_PASSIVE_ART,
  ...NINJA_PASSIVE_ART,
  ...CHRONO_PASSIVE_ART,
  ...SUMMON_PASSIVE_ART,
  ...BEDOUIN_PASSIVE_ART,
  ...GENERAL_PASSIVE_ART,
  ...IMUGI_PASSIVE_ART,
  ...APOSTLE_PASSIVE_ART,
  ...ABANDONED_PASSIVE_ART,
  ...TITAN_PASSIVE_ART,
  ...ONI_PASSIVE_ART,
  ...STAR_PASSIVE_ART,
  ...DUCK_PASSIVE_ART,
  ...SCRIBE_PASSIVE_ART,
  ...IDRA_PASSIVE_ART,
  ...MORPH_PASSIVE_ART,
  ...FLY_PASSIVE_ART,
  ...ELDER_PASSIVE_ART,
  ...HELIOS2_PASSIVE_ART,
  ...HELIOS_B_PASSIVE_ART,
  ...HELIOS_C_PASSIVE_ART,
  ...TERRA2_PASSIVE_ART,
  ...TERRA2B_PASSIVE_ART,
  ...TERRA2C_PASSIVE_ART,
  ...ASC_PASSIVE_ART,
  ...REN_PASSIVE_ART,
  ...SPIRIT_PASSIVE_ART,
  sturdyHeart: (g) => {
    g.disc(5, 6, 3, "#e0505e").disc(10, 6, 3, "#e0505e").rect(3, 7, 10, 2, "#e0505e");
    for (let i = 0; i < 5; i++) g.rect(4 + i, 9 + i, 8 - 2 * i, 1, "#e0505e");
    g.px(4, 4, "#ffb0b8").px(5, 4, "#ffb0b8");
  },
  whetstone: (g) => {
    g.rect(3, 8, 10, 5, "#8a8498").rect(3, 8, 10, 1, "#b0aac0").rect(3, 12, 10, 1, "#5a546a");
    g.line(5, 6, 11, 2, S).px(12, 1, "#fff").px(9, 3, "#ffe070").px(6, 5, "#ffe070");
  },
  lightGloves: (g) => {
    g.rect(5, 6, 6, 7, "#8ac0f0").rect(4, 8, 2, 3, "#8ac0f0").rect(5, 3, 1, 3, "#8ac0f0").rect(7, 3, 1, 3, "#8ac0f0").rect(9, 3, 1, 3, "#8ac0f0");
    g.rect(5, 12, 6, 2, "#4a80b8").line(1, 6, 3, 6, "#fff").line(0, 9, 3, 9, "#fff");
  },
  longGrip: (g) => {
    g.line(3, 13, 12, 4, W).line(4, 13, 13, 4, "#6a4e2a");
    for (const i of [0, 3, 6]) g.line(4 + i, 12 - i, 6 + i, 10 - i, "#d8c898");
    g.rect(12, 2, 3, 3, S);
  },
  windBoots: (g) => {
    g.rect(5, 3, 4, 8, "#c88a4a").rect(5, 10, 8, 3, "#c88a4a").rect(5, 13, 8, 1, "#6a4a2a").rect(5, 3, 4, 1, "#e0b070");
    g.line(0, 5, 3, 5, "#cfe8ff").line(0, 8, 4, 8, "#cfe8ff").line(1, 11, 3, 11, "#cfe8ff");
  },
  featherTip: (g) => {
    g.line(3, 14, 13, 3, "#e8ecf4").line(4, 14, 14, 3, "#a8b0c8");
    for (let i = 0; i < 5; i++) g.px(6 + i * 2, 11 - i * 2, "#6ec6e8").px(7 + i * 2, 12 - i * 2, "#6ec6e8");
    g.px(3, 14, W);
  },
  cloverCharm: (g) => {
    for (const [x, y] of [[5, 5], [10, 5], [5, 10], [10, 10]] as const) g.disc(x, y, 2, "#4ac060");
    g.rect(7, 7, 2, 2, "#3a9a4a").line(8, 9, 10, 14, "#3a7a3a").px(5, 4, "#a0f0a8").px(10, 4, "#a0f0a8");
  },
  furySeal: (g) => {
    g.ring(8, 8, 6, "#c03030").disc(8, 8, 4, "#7a1a1a");
    g.line(5, 5, 7, 7, "#ffb040").line(11, 5, 9, 7, "#ffb040").rect(6, 10, 4, 1, "#ffb040");
  },
  hunterEye: (g) => {
    g.rect(2, 7, 12, 3, "#e8ecf4").rect(4, 5, 8, 7, "#e8ecf4").rect(6, 4, 4, 9, "#e8ecf4");
    g.disc(8, 8, 3, "#3aa860").disc(8, 8, 1, K).line(8, 1, 8, 3, "#e0505e").line(8, 13, 8, 15, "#e0505e").line(1, 8, 3, 8, "#e0505e").line(13, 8, 15, 8, "#e0505e");
  },
  heavyPlate: (g) => {
    g.rect(3, 3, 10, 9, "#8a93a6").rect(2, 3, 2, 4, "#aab2c4").rect(12, 3, 2, 4, "#aab2c4").rect(5, 12, 6, 2, "#6a7386");
    g.rect(7, 4, 2, 8, "#aab2c4").px(5, 6, "#d8dde8").px(10, 6, "#d8dde8");
  },
  quickDraw: (g) => {
    g.line(9, 1, 5, 8, "#ffe84a").line(5, 8, 10, 8, "#ffe84a").line(10, 8, 6, 15, "#ffe84a").line(10, 1, 6, 8, "#ffd030").px(9, 8, "#fff");
  },
  goldTooth: (g) => {
    g.rect(4, 3, 8, 6, "#f4f0e8").rect(4, 9, 3, 5, "#f4f0e8").rect(9, 9, 3, 5, "#f4f0e8").rect(6, 9, 4, 2, "#f4f0e8");
    g.rect(5, 4, 6, 2, G).px(6, 4, "#fff8c0");
  },
  ironSkin: (g) => {
    g.disc(8, 8, 6, "#6a7386").ring(8, 8, 6, "#aab2c4").disc(8, 8, 3, "#8a93a6");
    for (const [x, y] of [[8, 3], [8, 13], [3, 8], [13, 8]] as const) g.px(x, y, "#e8ecf4");
  },
  secondWind: (g) => {
    g.disc(8, 9, 3, "#e0505e").rect(5, 8, 6, 2, "#e0505e");
    g.line(4, 8, 1, 4, "#fff").line(4, 9, 1, 7, "#fff").line(4, 10, 2, 10, "#fff");
    g.line(12, 8, 15, 4, "#fff").line(12, 9, 15, 7, "#fff").line(12, 10, 14, 10, "#fff");
    g.px(8, 12, "#e0505e").px(7, 11, "#e0505e").px(9, 11, "#e0505e");
  },
  regenCharm: (g) => {
    g.ring(8, 8, 6, "#4ac060").rect(7, 4, 2, 8, "#8af09a").rect(4, 7, 8, 2, "#8af09a");
  },
  goldPouch: (g) => {
    g.disc(8, 10, 4, "#b08a4a").rect(5, 5, 6, 2, "#8a6a3a").rect(6, 3, 4, 2, "#b08a4a").rect(5, 6, 6, 1, "#d8c080");
    g.disc(8, 11, 1, G).px(8, 11, "#fff8c0");
  },
  goddessBlessing: (g) => {
    // 빛나는 금빛 날개 + 가운데 흰 빛
    g.ring(8, 8, 7, "#fff4c0");
    for (let i = 0; i < 4; i++) g.line(7 - i, 6 + i, 2, 5 + i * 2, "#ffd76a").line(9 + i, 6 + i, 14, 5 + i * 2, "#ffd76a");
    g.disc(8, 8, 2, "#ffffff").px(8, 4, "#fff8c0").px(8, 12, "#fff8c0");
  },
  dashCloak: (g) => {
    g.rect(6, 2, 6, 3, "#7a5ac0");
    for (let i = 0; i < 9; i++) g.rect(5 + (i >> 1), 5 + i, 7 - (i >> 1), 1, i % 2 ? "#6a4ab0" : "#8a6ad0");
    g.line(0, 7, 3, 7, "#cfc0f0").line(0, 10, 4, 10, "#cfc0f0").line(1, 13, 3, 13, "#cfc0f0");
  },
  // ── 떠돌이 전용
  ricochet: (g) => {
    g.line(3, 12, 8, 4, "#b89a6a").line(8, 4, 12, 11, "#b89a6a").px(12, 12, S).px(11, 12, S).px(13, 12, S).px(3, 12, "#c8d0e0");
  },
  splitHead: (g) => {
    g.line(3, 8, 7, 8, "#b89a6a").line(7, 8, 12, 3, "#b89a6a").line(7, 8, 12, 13, "#b89a6a").line(7, 8, 13, 8, "#b89a6a");
    g.px(13, 2, S).px(13, 13, S).px(14, 8, S);
  },
  seekerFeather: (g) => {
    g.line(3, 12, 6, 7, "#e8ecf4").line(6, 7, 10, 5, "#e8ecf4").line(10, 5, 12, 6, "#e8ecf4").px(7, 9, "#6ec6e8").px(5, 10, "#6ec6e8");
    g.ring(12, 8, 2, "#e0505e").px(12, 8, "#e0505e");
  },
  backQuiver: (g) => {
    g.rect(5, 6, 5, 7, "#8a6a3a").rect(5, 6, 5, 1, "#b08a4a");
    g.line(6, 6, 4, 2, "#e8ecf4").line(8, 6, 8, 2, "#e8ecf4").line(9, 6, 11, 3, "#e8ecf4").px(12, 11, S).line(10, 11, 13, 11, "#b89a6a");
  },
  returnFletch: (g) => {
    g.line(3, 6, 11, 6, "#b89a6a").line(11, 6, 11, 11, "#b89a6a").line(11, 11, 4, 11, "#b89a6a");
    g.px(3, 11, S).px(4, 10, S).px(4, 12, S).px(3, 5, "#c8d0e0").px(3, 7, "#c8d0e0");
  },
  huntFrenzy: (g) => {
    g.rect(5, 3, 6, 6, "#e8ecf4").rect(6, 9, 4, 3, "#e8ecf4").rect(6, 5, 1, 2, K).rect(9, 5, 1, 2, K).px(7, 8, K).px(8, 8, K);
    g.px(3, 3, "#ff6a20").px(13, 3, "#ff6a20").px(2, 5, "#ffb040").px(14, 5, "#ffb040");
  },
  steadyBreath: (g) => {
    g.ring(8, 8, 5, "#6ec6e8").ring(8, 8, 2, "#cfeaff").px(8, 8, "#fff");
    g.line(1, 4, 3, 4, "#cfeaff").line(13, 12, 15, 12, "#cfeaff");
  },
  ambush: (g) => {
    g.rect(3, 4, 10, 8, "#3a2a4a").rect(4, 7, 3, 2, "#ffe070").rect(9, 7, 3, 2, "#ffe070").px(5, 8, K).px(10, 8, K);
    g.line(2, 13, 6, 10, S);
  },
  volleyCharm: (g) => {
    g.line(8, 13, 3, 3, "#b89a6a").line(8, 13, 8, 2, "#b89a6a").line(8, 13, 13, 3, "#b89a6a").px(3, 2, S).px(8, 1, S).px(13, 2, S);
    g.rect(7, 12, 3, 2, G);
  },
  chaseSteps: (g) => {
    g.rect(3, 9, 3, 4, "#c8a070").rect(3, 6, 1, 2, "#c8a070").rect(5, 6, 1, 2, "#c8a070");
    g.rect(9, 4, 3, 4, "#c8a070").rect(9, 2, 1, 1, "#c8a070").rect(11, 2, 1, 1, "#c8a070");
  },
  // ── 파수꾼 전용
  counterGuard: (g) => {
    g.rect(3, 3, 8, 8, "#8a93a6").rect(4, 11, 6, 2, "#8a93a6").rect(4, 4, 6, 6, "#4a6ab0").rect(6, 4, 2, 7, G);
    g.line(12, 4, 14, 2, "#ff8a60").line(12, 8, 15, 8, "#ff8a60").line(12, 12, 14, 14, "#ff8a60");
  },
  spinCleave: (g) => {
    g.ring(8, 8, 5, "#e8ecf4").rect(2, 7, 3, 2, "#e8ecf4").px(8, 3, "#d86a5a").px(8, 13, "#d86a5a").px(13, 8, "#d86a5a").px(8, 8, G);
  },
  waveSlash: (g) => {
    for (let i = 0; i < 9; i++) {
      const x = 3 + i;
      const y = 3 + Math.round(((i - 4) * (i - 4)) / 3);
      g.px(x, y, "#e8ecf4").px(x, y + 1, "#9ec0ff").px(x + 1, y + 2, "#6a90e0");
    }
    g.px(13, 7, "#fff");
  },
  executioner: (g) => {
    g.rect(4, 3, 8, 5, "#e8ecf4").rect(5, 8, 6, 3, "#e8ecf4").rect(5, 5, 2, 2, "#d02020").rect(9, 5, 2, 2, "#d02020");
    g.line(3, 13, 13, 13, "#d86a5a").line(4, 12, 12, 12, "#8a2020");
  },
  lifeLeech: (g) => {
    g.rect(5, 3, 2, 6, "#f4f0e8").rect(9, 3, 2, 6, "#f4f0e8").px(6, 9, "#f4f0e8").px(9, 9, "#f4f0e8");
    g.px(6, 10, "#e0505e").px(9, 10, "#e0505e").rect(6, 12, 4, 2, "#e0505e").px(7, 14, "#e0505e");
  },
  rage: (g) => {
    g.rect(4, 5, 8, 8, "#d83030").rect(5, 4, 6, 1, "#d83030");
    g.rect(5, 7, 2, 1, "#fff").rect(9, 7, 2, 1, "#fff").rect(6, 11, 4, 1, K).px(5, 6, K).px(10, 6, K);
    g.px(4, 3, "#ffb040").px(8, 2, "#ffb040").px(12, 3, "#ffb040");
  },
  dashSlash: (g) => {
    g.line(1, 5, 5, 5, "#cfe8ff").line(0, 8, 6, 8, "#cfe8ff").line(1, 11, 5, 11, "#cfe8ff");
    g.line(7, 12, 13, 3, "#e8ecf4").line(8, 12, 14, 3, "#9aa3b8").px(7, 13, G);
  },
  earthshaker: (g) => {
    g.rect(2, 10, 12, 3, "#7a5a3a").line(8, 10, 6, 6, K).line(6, 6, 9, 4, K).line(8, 10, 10, 7, K);
    g.px(3, 8, "#a08a6a").px(12, 8, "#a08a6a").px(5, 3, "#a08a6a").px(11, 3, "#a08a6a");
  },
  lastStand: (g) => {
    g.rect(4, 3, 2, 11, W).rect(6, 3, 7, 5, "#d83030").px(13, 5, "#d83030");
    g.rect(6, 4, 3, 1, "#ff8a60");
  },
  bulwarkStance: (g) => {
    g.rect(3, 2, 10, 9, "#8a93a6").rect(4, 11, 8, 2, "#8a93a6").rect(5, 13, 6, 1, "#8a93a6").rect(4, 3, 8, 7, "#5a6a90").rect(7, 3, 2, 10, "#aab2c4");
  },
  ...TALISMAN_PASSIVE_ART,
  // ── 마법사 전용
  chainBurst: (g) => {
    g.disc(4, 8, 2, "#ff8a30").disc(8, 8, 2, "#ffb040").disc(12, 8, 2, "#ffd060").line(6, 8, 6, 8, "#fff").px(6, 8, "#fff").px(10, 8, "#fff");
  },
  wideBlast: (g) => {
    g.ring(8, 8, 3, "#ff8a30").ring(8, 8, 6, "#ffb040").px(8, 8, "#fff").px(1, 8, "#ffd060").px(14, 8, "#ffd060").px(8, 1, "#ffd060").px(8, 14, "#ffd060");
  },
  arcaneShield: (g) => {
    g.disc(8, 8, 6, "#3a5ab0").disc(8, 8, 5, "#6a90e0").ring(8, 8, 6, "#cfe0ff").px(5, 5, "#fff").px(6, 4, "#fff");
  },
  starShower: (g) => {
    g.line(3, 3, 6, 6, "#ffe070").line(8, 2, 11, 5, "#ffe070").line(7, 8, 10, 11, "#ffe070");
    g.px(7, 7, "#fff").px(12, 6, "#fff").px(11, 12, "#fff");
  },
  overcharge: (g) => {
    g.rect(4, 4, 8, 9, "#6a5a8a").rect(6, 2, 4, 2, "#9a8ac0").rect(5, 5, 6, 7, "#2a1a4a");
    g.line(9, 5, 7, 8, "#ffe84a").line(7, 8, 9, 8, "#ffe84a").line(9, 8, 7, 11, "#ffe84a");
  },
  igniteTip: (g) => {
    g.line(3, 14, 9, 8, W);
    g.rect(9, 5, 4, 4, "#ff8a30").rect(10, 3, 2, 3, "#ffb040").px(11, 2, "#ffe070").rect(10, 6, 2, 2, "#ffe070");
  },
  tempestBreath: (g) => {
    g.line(2, 5, 11, 5, "#cfeaff").px(12, 6, "#cfeaff").px(12, 7, "#cfeaff").px(11, 8, "#cfeaff").line(4, 8, 9, 8, "#cfeaff");
    g.line(3, 11, 12, 11, "#8ac0f0").px(13, 10, "#8ac0f0").px(13, 9, "#8ac0f0").px(12, 8, "#8ac0f0");
  },
  echoBolt: (g) => {
    g.disc(8, 8, 1, "#fff").ring(8, 8, 3, "#c0a0ff").ring(8, 8, 5, "#8a6ad8").ring(8, 8, 7, "#5a3a98");
  },
  manaDrain: (g) => {
    g.disc(8, 10, 3, "#4ac0e8").rect(7, 4, 2, 4, "#4ac0e8").px(8, 3, "#4ac0e8").px(7, 9, "#cfeaff");
    g.px(2, 4, "#e0505e").px(3, 5, "#e0505e").px(2, 6, "#e0505e").px(13, 4, "#e0505e").px(12, 5, "#e0505e").px(13, 6, "#e0505e");
  },
  piercingBolt: (g) => {
    g.line(2, 8, 13, 8, "#c0a0ff").line(3, 7, 12, 7, "#8a6ad8").px(14, 8, "#fff").rect(7, 4, 2, 9, "#8a6a4a").px(7, 8, "#c0a0ff").px(8, 8, "#c0a0ff");
  },
};

export function passiveArt(g: Pen, id: PassiveId): void {
  const def: PassiveDef = PASSIVES[id];
  const h = hash(id);
  const body = `hsl(${h % 360} 65% 55%)`;
  const dark = `hsl(${h % 360} 65% 30%)`;
  g.rect(2, 2, 12, 12, def.exclusive ? CHAR_COLOR[def.exclusive] : G).rect(3, 3, 10, 10, dark);
  // 아이템마다 다른 좌우 대칭 무늬
  let bits = h >>> 3;
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      if (bits & 1) g.rect(3 + x * 2, 3 + y * 2, 2, 2, body).rect(11 - x * 2, 3 + y * 2, 2, 2, body);
      bits >>>= 1;
    }
  }
  if (def.effect) g.px(13, 1, "#fff").px(14, 2, "#fff").px(12, 2, "#fff").px(13, 3, "#fff");
}
