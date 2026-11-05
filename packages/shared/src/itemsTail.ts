// 테일 전용 아이템 10개: 꼬리·마무리 물기 5 · 영역 바다·상어 5. 효과는 sim/tail·tailSea. 수치는 TAIL_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "tail" as const, effect: true as const });

export const TAIL_PASSIVES = {
  // ── 꼬리·마무리 5 ──
  /** 칼 지느러미: 꼬리 공격 범위 + */
  tlFin: P("tlFin"),
  /** 피 냄새: 마무리 물기 피해 + (그만큼 더 많은 적을 한 방에) */
  tlBlood: P("tlBlood"),
  /** 포식: 마무리 물기 흡혈 + */
  tlFeast: P("tlFeast", [{ stat: "maxHp", add: 15 }]),
  /** 연쇄 사냥: 마무리 물기가 더 멀리 · 곧바로 다시 씀 */
  tlChain: P("tlChain"),
  /** 해방의 물결: 이동 속도 + · 받는 피해 줄어듦 */
  tlFreedom: P("tlFreedom", [{ stat: "moveSpeed", add: 0.1 }]),
  // ── 바다·상어 5 ──
  /** 깊은 바다: 영역 바다가 넓어짐 */
  tlDeep: P("tlDeep"),
  /** 상어 떼: 상어가 더 자주 나옴 */
  tlSchool: P("tlSchool"),
  /** 큰 턱: 삼키기 범위·피해 + */
  tlJaws: P("tlJaws"),
  /** 솟구침: 낙하 범위 + · 기절 + */
  tlBreach: P("tlBreach"),
  /** 쌍둥이 돌진: 돌진 상어가 반대편에서 한 마리 더 */
  tlRip: P("tlRip"),
} as const satisfies Record<string, PassiveDef>;

/** 테일 아이템 수치 */
export const TAIL_PERKS = {
  /** 칼 지느러미: 꼬리 거리 배율 */
  tlFin: { reach: 1.3 },
  /** 피 냄새: 마무리 물기 피해 배율 */
  tlBlood: { mul: 1.35 },
  /** 포식: 흡혈 배율 (최대치도 같이) */
  tlFeast: { leech: 2 },
  /** 연쇄 사냥: 찾는 거리 배율 */
  tlChain: { range: 1.4 },
  /** 해방의 물결: 받는 피해 배율 */
  tlFreedom: { taken: 0.9 },
  /** 깊은 바다: 영역 반지름 배율 */
  tlDeep: { r: 1.25 },
  /** 상어 떼: 상어 간격 배율 */
  tlSchool: { every: 0.75 },
  /** 큰 턱: 삼키기 반지름 배율 · 피해 배율 */
  tlJaws: { r: 1.35, mul: 1.25 },
  /** 솟구침: 낙하 반지름 배율 · 기절 배율 */
  tlBreach: { r: 1.3, stun: 1.5 },
  /** 쌍둥이 돌진: 둘째 상어 피해 배율 */
  tlRip: { mul: 0.8 },
};
