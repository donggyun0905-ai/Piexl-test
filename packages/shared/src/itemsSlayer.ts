// 학살자 전용 아이템 10개 (공용 아이템은 나오지 않음). 효과는 sim/slayer. 수치는 SLAYER_PERKS
import type { PassiveDef } from "./items";

export const SLAYER_PASSIVES = {
  /** 피의 계약: 피의 학살 +3초 */
  slPact: { id: "slPact", mods: [], exclusive: "slayer", effect: true },
  /** 광기: 게이지가 40% 빨리 참 */
  slMadness: { id: "slMadness", mods: [], exclusive: "slayer", effect: true },
  /** 갈증: 피의 학살 흡혈 +15% (50% → 65%) */
  slThirst: { id: "slThirst", mods: [], exclusive: "slayer", effect: true },
  /** 무딘 고통: 기술마다 체력 소모 5 → 4 */
  slNumb: { id: "slNumb", mods: [], exclusive: "slayer", effect: true },
  /** 광전사: 체력이 낮을 때 공격력이 최대 2배 → 2.5배 */
  slBerserk: { id: "slBerserk", mods: [], exclusive: "slayer", effect: true },
  /** 섬뜩한 미소: 적을 쓰러뜨리면 게이지 +4 */
  slGrin: { id: "slGrin", mods: [], exclusive: "slayer", effect: true },
  /** 붉은 날: 검기·날린 대낫 피해 +30% */
  slCrimson: { id: "slCrimson", mods: [], exclusive: "slayer", effect: true },
  /** 사냥개: 급습·돌진·백스텝 거리 +40% */
  slHound: { id: "slHound", mods: [], exclusive: "slayer", effect: true },
  /** 마지막 숨: 한 판에 한 번, 쓰러질 피해를 받으면 체력 1로 버팀 */
  slLastBreath: { id: "slLastBreath", mods: [], exclusive: "slayer", effect: true },
  /** 대학살: 피의 학살 중 적을 쓰러뜨리면 그 자리가 터짐 */
  slMassacre: { id: "slMassacre", mods: [], exclusive: "slayer", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 학살자 아이템 수치 */
export const SLAYER_PERKS = {
  slPact: { ticks: 180 },
  slMadness: { mul: 1.4 },
  slThirst: { leech: 0.15 },
  slNumb: { cost: 4 },
  slBerserk: { max: 2.5 },
  slGrin: { gauge: 4 },
  slCrimson: { mul: 1.3 },
  slHound: { mul: 1.4 },
  slMassacre: { r: 26, mul: 0.8 },
};
