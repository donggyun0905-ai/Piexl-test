// 정령사 전용 아이템 10개. 효과는 sim/spirit. 수치는 SPIRIT_PERKS
import type { PassiveDef } from "./items";

export const SPIRIT_PASSIVES = {
  /** 계약: 곁의 작은 정령 +1 */
  spBond: { id: "spBond", mods: [], exclusive: "spiritist", effect: true },
  /** 오래 머묾: 작은 정령이 바뀌는 주기 30초 → 45초 */
  spLonger: { id: "spLonger", mods: [], exclusive: "spiritist", effect: true },
  /** 정령의 분노: 작은 정령 피해 +50% */
  spFury: { id: "spFury", mods: [], exclusive: "spiritist", effect: true },
  /** 대정령 각성: 대정령이 30% 더 자주 공격 */
  spAwaken: { id: "spAwaken", mods: [], exclusive: "spiritist", effect: true },
  /** 대정령의 힘: 대정령 피해 +40% */
  spGreatPower: { id: "spGreatPower", mods: [], exclusive: "spiritist", effect: true },
  /** 쌍 미사일: 매직 미사일이 두 발 */
  spMissile: { id: "spMissile", mods: [], exclusive: "spiritist", effect: true },
  /** 작별 선물: 떠나는 작은 정령이 그 자리에서 터짐 */
  spFarewell: { id: "spFarewell", mods: [], exclusive: "spiritist", effect: true },
  /** 조화: 곁의 작은 정령 종류가 다를수록 정령 피해 증가 (종류마다 +6%) */
  spHarmony: { id: "spHarmony", mods: [], exclusive: "spiritist", effect: true },
  /** 교복 리본: 최대 체력 +15 */
  spRibbon: { id: "spRibbon", mods: [{ stat: "maxHp", add: 15 }], exclusive: "spiritist" },
  /** 정령의 가호: 새 정령이 올 때마다 보호막 8 (최대 체력의 30%까지) */
  spShield: { id: "spShield", mods: [], exclusive: "spiritist", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 정령사 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱) */
export const SPIRIT_PERKS = {
  spBond: { extra: 1 },
  spLonger: { ticks: 2700 },
  spFury: { mul: 1.5 },
  spAwaken: { every: 0.7 },
  spGreatPower: { mul: 1.4 },
  spFarewell: { r: 24, mul: 2 },
  spHarmony: { per: 0.06 },
  spShield: { shield: 8, max: 0.3 },
};
