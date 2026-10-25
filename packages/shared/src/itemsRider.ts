// 라이더 전용 아이템 10개. 효과는 sim/rider. 수치는 RIDER_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const S = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "rider" as const, effect: true as const });

export const RIDER_PASSIVES = {
  /** 터보 엔진: 이동 속도 +15% */
  rdTurbo: { id: "rdTurbo", mods: [{ stat: "moveSpeed", mul: 1.15 }] as StatMod[], exclusive: "rider" as const },
  /** 니트로 탱크: 게이지가 40% 빨리 참 */
  rdTank: S("rdTank"),
  /** 충격파: 펄스 범위 +40% */
  rdShock: S("rdShock"),
  /** 더블 펄스: 펄스가 0.5초 뒤 한 번 더 (절반 피해) */
  rdDouble: S("rdDouble"),
  /** 슬립스트림: 달리는 동안 받는 피해 -20% */
  rdSlip: S("rdSlip"),
  /** 들이받기: 달리며 닿은 적에게 피해 */
  rdRam: S("rdRam"),
  /** 드리프트: 대시한 뒤 다음 공격 피해 +80% */
  rdDrift: S("rdDrift"),
  /** 하이 기어: 빠를수록 붙는 피해 +50% */
  rdGear: S("rdGear"),
  /** 정비 키트: 펄스가 터지면 체력 2 회복 */
  rdRepair: S("rdRepair"),
  /** 불꽃 바퀴: 달린 자리에 불꽃 자국 */
  rdBurn: S("rdBurn"),
} as const satisfies Record<string, PassiveDef>;

/** 라이더 아이템 수치 */
export const RIDER_PERKS = {
  rdTank: { mul: 1.4 },
  rdShock: { r: 1.4 },
  rdDouble: { delay: 30, mul: 0.5 },
  rdSlip: { taken: 0.8 },
  rdRam: { mul: 0.5, every: 15 },
  rdDrift: { mul: 1.8 },
  rdGear: { mul: 1.5 },
  rdRepair: { heal: 2 },
  rdBurn: { every: 6 },
};
