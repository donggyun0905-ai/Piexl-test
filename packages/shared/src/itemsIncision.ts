// 인시전 전용 아이템 20개: 쌍도끼 5 · 도륙 콤보 5 · 도살 도약 5 · 돌진·광란 5 (★ = 새 공격 방식: 날아가는 초승달 · 피의 소용돌이 · 도륙 폭발 · 갈라진 땅 · 연속 도약 · 피의 길 · 학살)
// 효과는 sim/incision·incisionKit. 수치는 INCISION_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "incision" as const, effect: true as const });

export const INCISION_PASSIVES = {
  // ── 쌍도끼 ──
  /** 무거운 도끼날: 네 박자 피해 증가 */
  icHeavy: P("icHeavy", [{ stat: "damage", add: 1 }]),
  /** 크게 휘두르기: 베기·교차·회오리가 더 넓게 닿음 */
  icWide: P("icWide", [{ stat: "range", add: 4 }]),
  /** 피에 젖은 손잡이: 박자 간격이 짧아짐 */
  icSwift: P("icSwift", [{ stat: "attackSpeed", add: 0.05 }]),
  /** ★ 날아가는 초승달: 교차 베기 때 붉은 초승달 참격 둘이 앞으로 날아가 꿰뚫음 */
  icThrow: P("icThrow", [{ stat: "damage", add: 1 }]),
  /** ★ 피의 소용돌이: 회오리 베기가 몸 둘레에 잠깐 남아 계속 벰 */
  icVortex: P("icVortex", [{ stat: "maxHp", add: 10 }]),
  // ── 도륙 콤보 ──
  /** 끈질긴 광기: 콤보가 끊기기까지 더 오래 버팀 */
  icKeep: P("icKeep", [{ stat: "luck", add: 1 }]),
  /** 흔들리지 않는 광기: 맞아도 콤보를 조금만 잃음 */
  icIron: P("icIron", [{ stat: "maxHp", add: 10 }]),
  /** 끝없는 광란: 콤보 단계가 더 높이 오름 */
  icRampage: P("icRampage", [{ stat: "damage", add: 1 }]),
  /** 피의 연타: 콤보가 높으면 맞힐 때마다 체력 회복 */
  icDrink: P("icDrink", [{ stat: "maxHp", add: 10 }]),
  /** ★ 도륙 폭발: 콤보 10마다 몸 둘레가 피로 터짐 */
  icBurst: P("icBurst", [{ stat: "damage", add: 1 }]),
  // ── 도살 도약 ──
  /** 사냥감 냄새: 도살 도약이 더 자주 나옴 */
  icLeapOften: P("icLeapOften", [{ stat: "luck", add: 1 }]),
  /** 무너지는 땅: 도약 착지 범위 증가 */
  icLeapBig: P("icLeapBig", [{ stat: "range", add: 4 }]),
  /** 도살자의 무게: 도약 피해 증가 */
  icLeapPow: P("icLeapPow", [{ stat: "damage", add: 1 }]),
  /** ★ 갈라진 땅: 착지한 자리가 붉게 갈라져 그 위 적을 계속 벰 */
  icQuake: P("icQuake", [{ stat: "maxHp", add: 10 }]),
  /** ★ 연속 도약: 착지 뒤 가까운 다른 적에게 한 번 더 뛰어듦 */
  icDouble: P("icDouble", [{ stat: "moveSpeed", add: 0.05 }]),
  // ── 돌진·광란 ──
  /** 짓밟는 돌진: 돌진 연참 피해 증가 · 한 번 더 벰 */
  icRushPow: P("icRushPow", [{ stat: "moveSpeed", add: 0.05 }]),
  /** ★ 피의 길: 돌진이 끝나면 지나온 길이 피로 터짐 */
  icTrail: P("icTrail", [{ stat: "damage", add: 1 }]),
  /** 광기의 성흔: 성흔이 더 빨리 참 */
  icSense: P("icSense", [{ stat: "luck", add: 1 }]),
  /** 멈추지 않는 광란: 광란 각성이 더 오래 감 */
  icEndless: P("icEndless", [{ stat: "maxHp", add: 10 }]),
  /** ★ 학살: 광란 각성 중 처치한 적 자리에서 피가 터짐 */
  icCarnage: P("icCarnage", [{ stat: "damage", add: 1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const INCISION_PERKS = {
  /** 무거운 도끼날: 네 박자 피해 배율 */
  icHeavy: { mul: 1.2 },
  /** 크게 휘두르기: 거리 배율 */
  icWide: { r: 1.25 },
  /** 피에 젖은 손잡이: 박자 간격 배율 */
  icSwift: { time: 0.85 },
  /** 날아가는 초승달: 피해 배율 · 빠르기 · 나는 틱 · 반지름 · 좌우로 벌어지는 각도 */
  icThrow: { mul: 0.6, speed: 5, ticks: 24, r: 10, spread: 0.3 },
  /** 피의 소용돌이: 한 번 피해 배율 · 베는 간격 틱 · 남는 틱 */
  icVortex: { mul: 0.3, every: 15, ticks: 60 },
  /** 끈질긴 광기: 끊기는 시간 배율 */
  icKeep: { hold: 1.75 },
  /** 흔들리지 않는 광기: 맞을 때 남는 비율 (원래 0.5 대신) */
  icIron: { keep: 0.85 },
  /** 끝없는 광란: 최대 단계 (원래 6 대신) */
  icRampage: { max: 9 },
  /** 피의 연타: 이 콤보 이상 · 적마다 회복(최대 체력 비율) · 한 번 휘두를 때 최대 */
  icDrink: { min: 30, heal: 0.003, cap: 0.015 },
  /** 도륙 폭발: 몇 콤보마다 · 반지름 · 피해 배율 */
  icBurst: { every: 10, r: 46, mul: 0.9 },
  /** 사냥감 냄새: 도약 간격 콤보 (원래 30 대신) */
  icLeapOften: { every: 20 },
  /** 무너지는 땅: 착지 반지름 배율 */
  icLeapBig: { r: 1.35 },
  /** 도살자의 무게: 도약 피해 배율 */
  icLeapPow: { mul: 1.35 },
  /** 갈라진 땅: 남는 틱 · 베는 간격 틱 · 피해 배율 */
  icQuake: { ticks: 180, every: 30, mul: 0.35 },
  /** 연속 도약: 다음 적 찾는 거리 · 피해 배율 */
  icDouble: { reach: 130, mul: 0.6 },
  /** 짓밟는 돌진: 피해 배율 · 적마다 맞히는 수 */
  icRushPow: { mul: 1.4, hits: 3 },
  /** 피의 길: 돌진 끝나고 터지기까지 틱 · 피해 배율 · 폭(반) */
  icTrail: { delay: 18, mul: 1, w: 14 },
  /** 광기의 성흔: 차는 양 배율 */
  icSense: { gain: 1.3 },
  /** 멈추지 않는 광란: 각성 틱 더함 */
  icEndless: { more: 90 },
  /** 학살: 반지름 · 피해 배율 */
  icCarnage: { r: 36, mul: 0.7 },
};
