// 크루세이더 전용 아이템 20개: 성십자가 5 · 속죄의 무게 5 · 성벽 돌진 5 · 성십자가 강림 5 (★ = 새 공격 방식: 여진 · 성주 · 가시 면류관 · 가시 후광 · 돌진 낙인 · 십자가 비 · 성묘)
// 효과는 sim/crusader·crusaderKit. 수치는 CRUSADER_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "crusader" as const, effect: true as const });

export const CRUSADER_PASSIVES = {
  // ── 성십자가 ──
  /** 무거운 십자가: 내려찍기·십자 균열 피해 증가 */
  crHeavy: P("crHeavy", [{ stat: "damage", add: 1 }]),
  /** 갈라지는 대지: 십자 균열 팔이 한 마디씩 더 뻗음 */
  crLong: P("crLong", [{ stat: "range", add: 4 }]),
  /** 단련된 어깨: 십자가를 더 빨리 들어 올림 */
  crQuick: P("crQuick", [{ stat: "attackSpeed", add: 0.05 }]),
  /** ★ 여진: 찍은 자리가 잠시 뒤 한 번 더 무너짐 */
  crAfter: P("crAfter", [{ stat: "maxHp", add: 10 }]),
  /** ★ 성주: 십자 균열 팔 끝마다 돌기둥이 솟음 */
  crPillar: P("crPillar", [{ stat: "damage", add: 1 }]),
  // ── 속죄의 무게 ──
  /** 굳건한 신앙: 버팀 중 받는 피해가 더 줄어듦 */
  crBrace: P("crBrace", [{ stat: "maxHp", add: 10 }]),
  /** 속죄: 무게가 더 빨리 참 */
  crPenance: P("crPenance", [{ stat: "luck", add: 1 }]),
  /** 무거운 심판: 심판의 십자가 피해·범위 증가 */
  crVerdict: P("crVerdict", [{ stat: "damage", add: 1 }]),
  /** ★ 가시 면류관: 버팀 중 맞으면 둘레로 가시가 터짐 */
  crThorn: P("crThorn", [{ stat: "maxHp", add: 10 }]),
  /** ★ 가시 후광: 몇 번째 내려찍기마다 머리 위 후광이 날아갔다 돌아옴 */
  crHalo: P("crHalo", [{ stat: "damage", add: 1 }]),
  // ── 성벽 돌진 ──
  /** 파성추: 돌진 끝 들이받기 피해 증가 */
  crRamPow: P("crRamPow", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 넓은 방패: 돌진이 더 넓게 적을 잡음 */
  crRamWide: P("crRamWide", [{ stat: "range", add: 4 }]),
  /** 성벽 충돌: 벽에 부딪힌 적이 더 아프고 오래 기절 */
  crRamWall: P("crRamWall", [{ stat: "damage", add: 1 }]),
  /** 순례의 길: 돌진으로 잡은 적마다 무게가 참 */
  crRamGain: P("crRamGain", [{ stat: "luck", add: 1 }]),
  /** ★ 돌진 낙인: 돌진이 끝나면 앞 땅에 작은 십자 균열 */
  crRamSlam: P("crRamSlam", [{ stat: "maxHp", add: 10 }]),
  // ── 성십자가 강림 ──
  /** 신앙의 성흔: 성흔이 더 빨리 참 */
  crSense: P("crSense", [{ stat: "luck", add: 1 }]),
  /** 끝없는 강림: 성십자가 강림이 더 오래 감 */
  crEndless: P("crEndless", [{ stat: "maxHp", add: 10 }]),
  /** 거신: 강림 중 받는 피해가 더 줄고 발걸음이 더 넓게 울림 */
  crGiant: P("crGiant", [{ stat: "maxHp", add: 10 }]),
  /** ★ 십자가 비: 강림 중 둘레 적에게 작은 십자가가 떨어짐 */
  crRain: P("crRain", [{ stat: "damage", add: 1 }]),
  /** ★ 성묘: 떨어진 심판의 십자가가 땅에 박혀 남아 둘레를 계속 정화함 */
  crGrave: P("crGrave", [{ stat: "maxHp", add: 10 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const CRUSADER_PERKS = {
  /** 무거운 십자가: 내려찍기·균열 피해 배율 */
  crHeavy: { mul: 1.2 },
  /** 갈라지는 대지: 팔마다 더하는 마디 수 */
  crLong: { more: 1 },
  /** 단련된 어깨: 들어 올리는 시간 배율 */
  crQuick: { time: 0.7 },
  /** 여진: 뒤 틱 · 반지름 배율 · 피해 배율 */
  crAfter: { delay: 30, r: 1.4, mul: 0.8 },
  /** 성주: 반지름 · 피해 배율 · 기절 틱 */
  crPillar: { r: 16, mul: 1, stun: 20 },
  /** 굳건한 신앙: 버팀 중 받는 피해 배율 (원래 0.5 대신) */
  crBrace: { cut: 0.3 },
  /** 속죄: 무게 차는 배율 */
  crPenance: { gain: 1.5 },
  /** 무거운 심판: 피해 배율 · 반지름 배율 */
  crVerdict: { mul: 1.4, r: 1.25 },
  /** 가시 면류관: 반지름 · 피해 배율 · 다시 터지기까지 틱 */
  crThorn: { r: 40, mul: 1, cool: 30 },
  /** 가시 후광: 몇 번째 내려찍기마다 · 나가는 틱 · 빠르기 · 반지름 · 피해 배율 */
  crHalo: { every: 3, out: 22, speed: 5, r: 12, mul: 0.8 },
  /** 파성추: 들이받기 피해 배율 */
  crRamPow: { mul: 1.5 },
  /** 넓은 방패: 잡는 거리 배율 */
  crRamWide: { r: 1.5 },
  /** 성벽 충돌: 벽 피해 배율 · 벽 기절 틱 더함 */
  crRamWall: { mul: 1.6, stun: 30 },
  /** 순례의 길: 잡은 적마다 무게 */
  crRamGain: { weight: 6 },
  /** 돌진 낙인: 피해 배율 · 앞 팔 · 옆 팔 마디 수 */
  crRamSlam: { mul: 0.7, long: 2, side: 1 },
  /** 신앙의 성흔: 차는 양 배율 */
  crSense: { gain: 1.3 },
  /** 끝없는 강림: 각성 틱 더함 */
  crEndless: { more: 90 },
  /** 거신: 받는 피해 배율 (원래 0.6 대신) · 발걸음 반지름 배율 */
  crGiant: { cut: 0.45, r: 1.3 },
  /** 십자가 비: 간격 틱 · 찾는 거리 · 반지름 · 피해 배율 */
  crRain: { every: 40, reach: 170, r: 22, mul: 1 },
  /** 성묘: 남는 틱 · 정화 간격 틱 · 반지름 · 피해 배율 */
  crGrave: { ticks: 180, every: 30, r: 36, mul: 0.45 },
};
