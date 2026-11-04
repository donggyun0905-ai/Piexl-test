// 오닉스 전용 아이템 10개. 효과는 sim/onyx·onyxGems. 수치는 ONYX_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "onyx" as const, effect: true as const });

export const ONYX_PASSIVES = {
  /** 연마된 보석: 모든 보석의 반응 확률 + */
  oxPolish: P("oxPolish"),
  /** 보석 왕관: 보석 공격 피해 + */
  oxCrown: P("oxCrown"),
  /** 비상의 날개: 비행이 더 빠르고 보석이 더 자주 반응 */
  oxWings: P("oxWings"),
  /** 낙하 충격: 비행을 끄고 내려앉으면 둘레에 충격파 + 기절 */
  oxLanding: P("oxLanding"),
  /** 공명석: 칠보 공명에 필요한 보석 수 - */
  oxResonance: P("oxResonance"),
  /** 광물 갑피: 땅에 서 있을 때 받는 피해 - */
  oxBulwark: P("oxBulwark"),
  /** 프리즘 광륜: 광륜 공격마다 보석 하나가 같이 반응 */
  oxPrism: P("oxPrism"),
  /** 수정 반격: 맞으면 보석들이 반쯤 확률로 반응 */
  oxShard: P("oxShard"),
  /** 빠른 집광: 광륜을 쏠 때 묶이는 시간 - */
  oxQuick: P("oxQuick"),
  /** 보석 꼬리: 날아가는 동안 몸 둘레 적에게 보석 가루 피해 */
  oxTrail: P("oxTrail"),
} as const satisfies Record<string, PassiveDef>;

/** 오닉스 아이템 수치 */
export const ONYX_PERKS = {
  /** 연마된 보석: 반응 확률 더함 */
  oxPolish: { add: 0.12 },
  /** 보석 왕관: 보석 피해 배율 */
  oxCrown: { mul: 1.35 },
  /** 비상의 날개: 비행 속도 배율 · 반응 간격 배율 */
  oxWings: { speed: 1.25, pulse: 0.65 },
  /** 낙하 충격: 반지름 · 피해 배율 · 기절 틱 */
  oxLanding: { r: 64, mul: 2.2, stun: 30 },
  /** 공명석: 공명에 필요한 보석 수 */
  oxResonance: { need: 5 },
  /** 광물 갑피: 받는 피해 배율 */
  oxBulwark: { taken: 0.75 },
  /** 수정 반격: 반응 확률 배율 · 다시 반격까지 틱 */
  oxShard: { chance: 0.5, gap: 90 },
  /** 빠른 집광: 묶이는 시간 배율 */
  oxQuick: { cast: 0.5 },
  /** 보석 꼬리: 반지름 · 간격(틱) · 피해 배율 */
  oxTrail: { r: 26, gap: 12, mul: 0.4 },
};
