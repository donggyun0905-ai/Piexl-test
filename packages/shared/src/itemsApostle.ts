// 악의 사도 전용 아이템 10개. 효과는 sim/apostle·apostleFields·combat. 수치는 APOSTLE_PERKS
import type { PassiveDef } from "./items";

export const APOSTLE_PASSIVES = {
  /** 영혼 포식: 영혼 회복량 10% → 15% */
  soulFeast: { id: "soulFeast", mods: [], exclusive: "apostle", effect: true },
  /** 영혼 끌림: 영혼을 멀리서도 줍고, 가까운 영혼이 나에게 끌려옴 */
  soulMagnet: { id: "soulMagnet", mods: [], exclusive: "apostle", effect: true },
  /** 타락한 성배: 회복약을 먹어도 피해를 받지 않고, 대신 10초 동안 공격력 +20% */
  fallenGrail: { id: "fallenGrail", mods: [], exclusive: "apostle", effect: true },
  /** 죄의 무게: 장판·짓누르는 범위 +30% */
  sinWeight: { id: "sinWeight", mods: [], exclusive: "apostle", effect: true },
  /** 긴 저주: 장판 지속 +50% */
  longCurse: { id: "longCurse", mods: [], exclusive: "apostle", effect: true },
  /** 피의 계약: 영혼을 먹으면 3초 동안 공격 속도 빨라짐 */
  bloodPact: { id: "bloodPact", mods: [], exclusive: "apostle", effect: true },
  /** 검은 미사: 적을 쓰러뜨리면 보호막 3 (이 아이템으로는 최대 15) */
  blackMass: { id: "blackMass", mods: [], exclusive: "apostle", effect: true },
  /** 영혼 폭발: 영혼을 먹을 때 그 자리 둘레 적에게 공격력 100% */
  soulBurst: { id: "soulBurst", mods: [], exclusive: "apostle", effect: true },
  /** 배교자: 최대 체력 +20 */
  apostate: { id: "apostate", mods: [{ stat: "maxHp", add: 20 }], exclusive: "apostle" },
  /** 악의: 공격력 +15%, 상태이상(화상·독·부패·죽음·업화) 피해 +25% */
  malice: { id: "malice", mods: [{ stat: "damage", mul: 1.15 }], exclusive: "apostle", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 악의 사도 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const APOSTLE_PERKS = {
  soulFeast: { heal: 0.15 },
  soulMagnet: { pick: 40, pull: 1.5 },
  fallenGrail: { damage: 1.2, ticks: 600 },
  sinWeight: { area: 1.3 },
  longCurse: { ticks: 1.5 },
  bloodPact: { ticks: 180 },
  blackMass: { shield: 3, max: 15 },
  soulBurst: { mul: 1, radius: 30 },
  malice: { dot: 1.25 },
};
