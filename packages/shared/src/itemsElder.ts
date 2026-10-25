// 장로 전용 아이템 10개. 효과는 sim/elder. 수치는 ELDER_PERKS
import type { PassiveDef } from "./items";

export const ELDER_PASSIVES = {
  /** 지혜: 진이 30% 빨리 발동 */
  elSage: { id: "elSage", mods: [], exclusive: "elder", effect: true },
  /** 진 넓히기: 진 크기 +30% */
  elExpand: { id: "elExpand", mods: [], exclusive: "elder", effect: true },
  /** 겹진: 한 번에 깔 수 있는 진 +2 */
  elMore: { id: "elMore", mods: [], exclusive: "elder", effect: true },
  /** 오래가는 진: 진이 남는 시간 +50% */
  elLinger: { id: "elLinger", mods: [], exclusive: "elder", effect: true },
  /** 쌍진: 네 번째마다 다른 적 자리에도 진을 하나 더 */
  elDouble: { id: "elDouble", mods: [], exclusive: "elder", effect: true },
  /** 지팡이 짚기: 진을 깔 때 가까운 적을 지팡이로 때려 밀침 */
  elStaff: { id: "elStaff", mods: [], exclusive: "elder", effect: true },
  /** 차 한 잔: 가만히 서 있으면 1초마다 체력 1 회복 */
  elTea: { id: "elTea", mods: [], exclusive: "elder", effect: true },
  /** 긴 수염: 최대 체력 +20 */
  elBeard: { id: "elBeard", mods: [{ stat: "maxHp", add: 20 }], exclusive: "elder" },
  /** 결계: 내 진 안에 서 있으면 받는 피해 -30% */
  elWard: { id: "elWard", mods: [], exclusive: "elder", effect: true },
  /** 진법 대가: 진 피해 +35% */
  elMaster: { id: "elMaster", mods: [], exclusive: "elder", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 장로 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const ELDER_PERKS = {
  elSage: { arm: 0.7 },
  elExpand: { r: 1.3 },
  elMore: { seals: 2 },
  elLinger: { dur: 1.5 },
  elDouble: { every: 4 },
  elStaff: { r: 20, mul: 0.8, push: 10 },
  elTea: { every: 60, heal: 1 },
  elWard: { taken: 0.7 },
  elMaster: { mul: 1.35 },
};
