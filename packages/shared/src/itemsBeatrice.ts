// 베아트리스 전용 아이템 20개: 악·처단 5 · 화염 5 · 재생 5 · 스킬 5. 효과는 sim/beatrice·beatriceSkills·beatriceKit. 수치는 BEATRICE_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "beatrice" as const, effect: true as const });

export const BEATRICE_PASSIVES = {
  // ── 악·처단 ──
  /** 원한의 낙인: 악이 쌓일 때 가끔 하나 더 */
  btGrudge: P("btGrudge"),
  /** 죄의 무게: 악 하나마다 받는 피해가 더 늘어남 */
  btSin: P("btSin", [{ stat: "damage", add: 1 }]),
  /** 처단자: 처단 X자가 더 많고 더 셈 */
  btExecutor: P("btExecutor"),
  /** 최후의 심판: 심판에 필요한 악이 줄어듦 */
  btVerdict: P("btVerdict"),
  /** 증인: 처단할 때 둘레 적에게도 악이 쌓임 */
  btWitness: P("btWitness"),
  // ── 화염 ──
  /** 불씨: 화상이 더 많이 겹침 */
  btEmber: P("btEmber"),
  /** 태양의 핵: 화염 계수가 늘 조금 더 높음 */
  btCore: P("btCore", [{ stat: "damage", add: 1 }]),
  /** 작열: 화상 피해가 더 셈 */
  btScorch: P("btScorch"),
  /** 홍염: 화상이 가득 겹친 적이 쓰러지면 불꽃으로 터짐 */
  btFlare: P("btFlare"),
  /** 낙인 각인: 태양의 낙인이 더 넓고 악을 더 쌓음 */
  btBrand: P("btBrand", [{ stat: "range", add: 5 }]),
  // ── 재생 ──
  /** 꺼지지 않는 불꽃: 재생력 최대가 더 높음 */
  btUndying: P("btUndying", [{ stat: "maxHp", add: 10 }]),
  /** 성녀의 서약: 체력이 절반 아래면 받는 피해가 줄어듦 */
  btVow: P("btVow", [{ stat: "maxHp", add: 10 }]),
  /** 피의 맹세: 처단할 때 체력 회복 */
  btOath: P("btOath"),
  /** 은총: 자애 뒤 회복 불가 시간이 짧아짐 */
  btGrace: P("btGrace", [{ stat: "maxHp", add: 5 }]),
  /** 백은의 갑주: 받는 피해가 조금 줄고 맞으면 잠깐 재생력이 더 오름 */
  btSilver: P("btSilver", [{ stat: "maxHp", add: 15 }]),
  // ── 스킬 ──
  /** 정오의 태양: 태양 검날이 더 오래 감 */
  btNoon: P("btNoon", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 개기일식: 일식의 춤이 더 멀리 가고 강화 베기가 셋 */
  btTotality: P("btTotality", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 성국의 신속: 모든 스킬 대기가 짧아짐 */
  btSwift: P("btSwift", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 무한한 자애: 자애 대기가 짧아짐 */
  btMercy: P("btMercy"),
  /** 성채 파쇄: 3타 X자가 더 크고 보스에게 더 셈 */
  btBreaker: P("btBreaker", [{ stat: "damage", add: 1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const BEATRICE_PERKS = {
  /** 원한의 낙인: 악 하나 더 쌓일 확률 */
  btGrudge: { chance: 0.3 },
  /** 죄의 무게: 악 하나마다 받는 피해 더함 (원래 값 대신) */
  btSin: { taken: 0.06 },
  /** 처단자: X자 더함 · 피해 배율 */
  btExecutor: { more: 2, mul: 1.3 },
  /** 최후의 심판: 심판에 필요한 악 */
  btVerdict: { at: 70 },
  /** 증인: 둘레 반지름 · 더하는 악 */
  btWitness: { r: 70, evil: 1 },
  /** 불씨: 화상 최대 겹 */
  btEmber: { max: 8 },
  /** 태양의 핵: 화염 계수 더함 */
  btCore: { fire: 0.3 },
  /** 작열: 화상 피해 배율 */
  btScorch: { mul: 1.5 },
  /** 홍염: 터지는 반지름 · 피해(공격력 × 화염 계수 배율) */
  btFlare: { r: 44, mul: 0.6 },
  /** 낙인 각인: 폭 배율 · 더하는 악 */
  btBrand: { width: 1.4, evil: 3 },
  /** 꺼지지 않는 불꽃: 재생력 최대 */
  btUndying: { regen: 42 },
  /** 성녀의 서약: 체력 비율 기준 · 받는 피해 배율 */
  btVow: { below: 0.5, taken: 0.85 },
  /** 피의 맹세: 처단할 때 회복 (최대 체력 비율) */
  btOath: { heal: 0.04 },
  /** 은총: 자애 뒤 회복 불가 틱 */
  btGrace: { ticks: 300 },
  /** 백은의 갑주: 받는 피해 배율 · 맞은 뒤 재생력 더함 · 그 틱 */
  btSilver: { taken: 0.92, regen: 10, ticks: 180 },
  /** 정오의 태양: 태양 검날 유지 더함 (틱) */
  btNoon: { more: 240 },
  /** 개기일식: 돌진 거리 배율 · 강화 베기 수 */
  btTotality: { dash: 1.3, twins: 3 },
  /** 성국의 신속: 스킬 대기 배율 */
  btSwift: { cd: 0.85 },
  /** 무한한 자애: 자애 대기 (틱) */
  btMercy: { cd: 2700 },
  /** 성채 파쇄: X자 반지름 배율 · 보스 피해 배율 */
  btBreaker: { r: 1.3, boss: 1.25 },
};
