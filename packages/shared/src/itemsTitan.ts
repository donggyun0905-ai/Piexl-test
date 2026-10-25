// 거인 전용 아이템 10개 (탱커). 효과는 sim/titan·combat. 수치는 TITAN_PERKS
import type { PassiveDef } from "./items";

export const TITAN_PASSIVES = {
  /** 강화 장갑판: 받는 피해 -15% */
  armorPlate: { id: "armorPlate", mods: [], exclusive: "titan", effect: true },
  /** 대용량 축전지: 강타에 필요한 에너지 -30% */
  bigCapacitor: { id: "bigCapacitor", mods: [], exclusive: "titan", effect: true },
  /** 과부하 회로: 강타 피해 +40% */
  overdriveCircuit: { id: "overdriveCircuit", mods: [], exclusive: "titan", effect: true },
  /** 유압 관절: 평소 공격 범위 +25% */
  hydraulicJoint: { id: "hydraulicJoint", mods: [], exclusive: "titan", effect: true },
  /** 고철 수리: 강타를 쓰면 최대 체력의 10% 회복 */
  scrapRepair: { id: "scrapRepair", mods: [], exclusive: "titan", effect: true },
  /** 여진: 느린 범위 공격(heavy)이 맞은 적을 0.4초 기절 */
  aftershock: { id: "aftershock", mods: [], exclusive: "titan", effect: true },
  /** 반격 코일: 맞으면 둘레 적에게 공격력 60% (1초에 한 번) */
  counterCoil: { id: "counterCoil", mods: [], exclusive: "titan", effect: true },
  /** 충전 너클: 빠른 공격(jab·리벳)이 맞힐 때마다 에너지 +1 */
  chargeKnuckle: { id: "chargeKnuckle", mods: [], exclusive: "titan", effect: true },
  /** 자이로 안정기: 강타 뒤 3초 동안 받는 피해 -50% */
  gyroStabilizer: { id: "gyroStabilizer", mods: [], exclusive: "titan", effect: true },
  /** 무쇠 선체: 최대 체력 +40, 이동 속도 -0.05 */
  titanHull: { id: "titanHull", mods: [{ stat: "maxHp", add: 40 }, { stat: "moveSpeed", add: -0.05 }], exclusive: "titan" },
} as const satisfies Record<string, PassiveDef>;

/** 거인 아이템 수치 (배율은 1 = 100%, 시간은 틱) */
export const TITAN_PERKS = {
  armorPlate: { taken: 0.85 },
  bigCapacitor: { need: 0.7 },
  overdriveCircuit: { damage: 1.4 },
  hydraulicJoint: { area: 1.25 },
  scrapRepair: { heal: 0.1 },
  aftershock: { stun: 24 },
  counterCoil: { mul: 0.6, radius: 34, cd: 60 },
  chargeKnuckle: { energy: 1 },
  gyroStabilizer: { taken: 0.5, ticks: 180 },
};
