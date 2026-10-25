// 베두인 전용 무기(대형 차크람 하나뿐): 처음엔 몸을 한 바퀴 돌려 베고, 다음 공격에 아주 멀리 던짐.
// 던진 차크람은 떨어진 자리에 남고, 대시로 지나가며 주워야 다시 공격 (주울 때 모래와 함께 크게 한 바퀴 벰). 계산은 sim/bedouin
import type { WeaponDef } from "./content";

export const BEDOUIN_WEAPONS = {
  /** range = 던지는 거리 (회전 베기 반경은 BEDOUIN.spinR) */
  sandChakram: { id: "sandChakram", kind: "chakram", damageMul: 1, attackSpeed: 1.5, range: 200, projectileSpeed: 4.5, arcCos: -1, exclusive: "bedouin" },
} as const satisfies Record<string, WeaponDef>;

/** 베두인 공격 수치 (배율은 1 = 100%, 거리는 픽셀, 시간은 틱) */
export const BEDOUIN = {
  /** 회전 베기 반경·피해 */
  spinR: 30,
  spinMul: 1,
  /** 던진 차크람 크기·피해 */
  ckR: 10.5,
  throwMul: 1.2,
  /** 대시로 지나갈 때 줍는 거리 · 주울 때 모래 베기 반경·피해 */
  pickR: 12,
  pickR2: 46,
  pickMul: 1.6,
  /** 차크람을 던져 손이 비어 있는 동안 이동 속도 + */
  emptySpeed: 0.2,
  /** 대시 거리 배율 (대시 빠르기에 곱함, 시간은 그대로) */
  dashReach: 1.4,
  /** 대시로 지나간 적에게 (한 대시에 한 번씩) 공격력 30% */
  dashMul: 0.3,
  /** 대시 충전 하나가 다시 차는 틱 (기본 대시와 같음) */
};
