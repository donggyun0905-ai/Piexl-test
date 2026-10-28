// 효과 아이템(패시브)·상점의 수치 표. 관리자 페이지에서 바꿀 수 있음 (balanceFields.ts). 쓰는 곳은 sim
// 판 도중에는 바뀌지 않음 (판을 시작할 때만 넣음)
import { NINJA_PERKS } from "./itemsNinja";
import { CHRONO_PERKS } from "./itemsChrono";
import { SUMMON_PERKS } from "./itemsSummon";
import { BEDOUIN_PERKS } from "./itemsBedouin";
import { GENERAL_PERKS } from "./itemsGeneral";
import { IMUGI_PERKS } from "./itemsImugi";
import { APOSTLE_PERKS } from "./itemsApostle";
import { STAR_PERKS } from "./itemsStar";
import { DUCK_PERKS } from "./itemsDuck";
import { SCRIBE_PERKS } from "./itemsScribe";
import { ABANDONED_PERKS } from "./itemsAbandoned";
import { TITAN_PERKS } from "./itemsTitan";
import { ONI_PERKS } from "./itemsOni";
import { S2_PERKS } from "./itemsSeason2";

/** 효과 패시브 수치 (배율·비율은 1 = 100%, 시간은 틱 = 1/60초) */
export const PERKS = {
  /** 쓰러질 때 최대 체력의 hp만큼으로 되살아남 */
  secondWind: { hp: 0.3 },
  /** 방을 정리할 때마다 최대 체력의 heal만큼 회복 */
  regenCharm: { heal: 0.08 },
  /** 얻는 돈 × gold */
  goldPouch: { gold: 1.5 },
  /** 대시 대기 시간 × cooldown */
  dashCloak: { cooldown: 0.6 },
  ricochet: { bounces: 2 },
  splitHead: { damage: 0.5 },
  /** 휘어지는 정도 · 적을 찾는 거리 */
  seekerFeather: { turn: 0.15, reach: 90 },
  backQuiver: { damage: 0.6 },
  /** 처치할 때마다 공격 속도 +speed, 최대 stacks번, ticks 안에 또 처치해야 이어짐 */
  huntFrenzy: { speed: 0.1, stacks: 5, ticks: 180 },
  steadyBreath: { damage: 1.5 },
  /** 떠돌이 기습(특징 2배)을 키움: × damage · 맞힌 적 최대 체력 × hpCut (보스는 × bossCut, 공격력의 cap배까지) */
  ambush: { damage: 2.5, ticks: 90, hpCut: 0.06, bossCut: 0.25, cap: 4 },
  volleyCharm: { every: 4 },
  chaseSteps: { ticks: 15 },
  /** 맞으면 충격파 + 파수꾼 반격(특징 1.5배 한 바퀴 베기)을 × swing · 범위 × reach로 키움 */
  counterGuard: { damage: 1, radius: 34, push: 8, swing: 2, reach: 1.3 },
  spinCleave: { every: 3 },
  waveSlash: { damage: 0.5, pierce: 3 },
  /** 체력이 below 이하인 적에게 × damage */
  executioner: { below: 0.25, damage: 2 },
  lifeLeech: { heal: 0.03 },
  /** 체력이 바닥일 때 공격력 +damage */
  rage: { damage: 0.6 },
  dashSlash: { damage: 1.5 },
  earthshaker: { damage: 1, radius: 40, push: 6 },
  /** 체력이 below 이하면 무적 시간 × invuln */
  lastStand: { below: 0.3, invuln: 2 },
  bulwarkStance: { taken: 0.5 },
  chainBurst: { damage: 0.5, radius: 22 },
  /** 폭발 범위 × blast, 주변 피해 splash */
  wideBlast: { blast: 1.5, splash: 0.7 },
  arcaneShield: { ticks: 120 },
  starShower: { every: 5, damage: 0.8, radius: 16 },
  overcharge: { speed: 1.4 },
  /** 2초 동안 0.5초마다 공격력 × damage */
  igniteTip: { damage: 0.25 },
  tempestBreath: { push: 14 },
  echoBolt: { damage: 0.5, ticks: 60 },
  /** 한 번에 hits명 이상 맞히면 체력 heal 회복 */
  manaDrain: { hits: 3, heal: 5 },
  piercingBolt: { pierce: 1 },
  ...NINJA_PERKS,
  ...CHRONO_PERKS,
  ...SUMMON_PERKS,
  ...BEDOUIN_PERKS,
  ...GENERAL_PERKS,
  ...IMUGI_PERKS,
  ...APOSTLE_PERKS,
  ...STAR_PERKS,
  ...DUCK_PERKS,
  ...SCRIBE_PERKS,
  ...ABANDONED_PERKS,
  ...TITAN_PERKS,
  ...ONI_PERKS,
  ...S2_PERKS,
};

/** 상점 가격 */
export const SHOP_PRICES = {
  price: {
    passive: 30,
    weapon: 22,
    use: 12,
    potion: 14,
    elixir: 30,
    /** 새로고침 처음 가격 · 누를 때마다 오르는 양 */
    reroll: 5,
    rerollStep: 5,
    /** 층마다 오르는 양 */
    perFloor: 3,
    /** 행운 1마다 깎아 주는 비율 · 최대 */
    luckDiscount: 0.05,
    maxDiscount: 0.3,
  },
};
