// 레오 전용 아이템 10개. 효과는 sim/leo·leoPerks. 수치는 LEO_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "leo" as const, effect: true as const });

export const LEO_PASSIVES = {
  /** 번개 갈기: 몸 둘레 적에게 정전기가 계속 튐 */
  leMane: P("leMane"),
  /** 천뢰 보석: 보석 낙뢰가 더 자주, 한 번에 두 갈래 */
  leSky: P("leSky"),
  /** 우레 포효: 사자후 기절이 길어지고 방 안 적 탄을 모두 지움 */
  leRoar: P("leRoar"),
  /** 뇌광 도약: 대시하면 앞쪽 적에게 번개처럼 뛰어들어 내려침 */
  lePounce: P("lePounce"),
  /** 연쇄 뇌전: 발톱에 맞은 적에서 번개가 가까운 적들에게 튐 */
  leChain: P("leChain"),
  /** 뇌운: 몇 초마다 방 어딘가의 적에게 낙뢰 */
  leStorm: P("leStorm"),
  /** 사자의 긍지: 둘레 적이 많을수록 피해 + */
  lePride: P("lePride"),
  /** 번개 송곳니: 물기가 더 자주, 더 세게 */
  leFang: P("leFang"),
  /** 황금 갑주: 받는 피해 - · 맞으면 둘레에 방전 */
  leArmor: P("leArmor"),
  /** 백수의 왕: 뇌인 최대 겹 + · 사자후에 필요한 전하 - */
  leKing: P("leKing"),
} as const satisfies Record<string, PassiveDef>;

/** 레오 아이템 수치 */
export const LEO_PERKS = {
  /** 번개 갈기: 반지름 · 때리는 간격(틱) · 한 번 피해(공격력 배율) */
  leMane: { r: 30, gap: 20, mul: 0.3 },
  /** 천뢰 보석: 간격 배율 · 한 번에 맞히는 적 수 */
  leSky: { gap: 0.6, n: 2 },
  /** 우레 포효: 기절 배율 */
  leRoar: { stun: 2 },
  /** 뇌광 도약: 적을 찾는 거리 · 내려칠 때 반지름 · 피해 배율 · 기절 틱 */
  lePounce: { reach: 110, r: 26, mul: 1.8, stun: 20 },
  /** 연쇄 뇌전: 튀는 적 수 · 튀는 거리 · 피해 배율 */
  leChain: { n: 2, reach: 70, mul: 0.5 },
  /** 뇌운: 간격(틱) · 피해 배율 */
  leStorm: { gap: 90, mul: 1.2 },
  /** 사자의 긍지: 둘레 거리 · 적 하나마다 피해 + · 최대 */
  lePride: { r: 60, per: 0.06, max: 0.36 },
  /** 번개 송곳니: 몇 번째 공격마다 물기 · 물기 피해 배율 더함 */
  leFang: { every: 2, mul: 0.6 },
  /** 황금 갑주: 받는 피해 배율 · 방전 반지름 · 피해 배율 · 다시 방전까지 틱 */
  leArmor: { taken: 0.85, r: 44, mul: 1.2, gap: 30 },
  /** 백수의 왕: 뇌인 최대 겹 · 필요한 전하 배율 */
  leKing: { marks: 5, volt: 0.7 },
};
