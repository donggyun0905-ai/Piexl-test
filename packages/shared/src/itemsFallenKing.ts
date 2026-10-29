// 몰락한 왕 전용 아이템 10개. 효과는 sim/fallenKing·kingBlade. 수치는 FALLEN_KING_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const E = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "fallenKing" as const, effect: true as const });
const M = <T extends string>(id: T, mods: StatMod[]) => ({ id, mods, exclusive: "fallenKing" as const });

export const FALLEN_KING_PASSIVES = {
  /** 녹슨 제국 문장: 공격력 +15% */
  fkCrest: M("fkCrest", [{ stat: "damage", mul: 1.15 }]),
  /** 푸른 불꽃 흉갑: 최대 체력 +40 */
  fkPlate: M("fkPlate", [{ stat: "maxHp", add: 40 }]),
  /** 왕의 손아귀: 공격 속도 +12% */
  fkGrip: M("fkGrip", [{ stat: "attackSpeed", mul: 1.12 }]),
  /** 긴 칼날: 사거리 +18 */
  fkReach: M("fkReach", [{ stat: "range", add: 18 }]),
  /** 영혼 수확: 처치마다 영혼을 하나 더 거둠 */
  fkHarvest: E("fkHarvest"),
  /** 장작불: 불기둥 범위 +40% · 피해 +30% */
  fkPyre: E("fkPyre"),
  /** 끝없는 점화선: 불꽃 선이 3개 더 */
  fkLines: E("fkLines"),
  /** 십자 처형: X자 베기 피해 +50% */
  fkCross: E("fkCross"),
  /** 왕의 위엄: 영혼 50개마다 받는 피해 -2% (최대 -30%) */
  fkMajesty: E("fkMajesty"),
  /** 진혼곡: 불기둥이 터질 때마다 최대 체력의 1% 회복 */
  fkRequiem: E("fkRequiem"),
} as const satisfies Record<string, PassiveDef>;

export const FALLEN_KING_PERKS = {
  fkHarvest: { extra: 1 },
  fkPyre: { r: 1.4, mul: 1.3 },
  fkLines: { add: 3 },
  fkCross: { mul: 1.5 },
  fkMajesty: { per: 50, cut: 0.02, max: 0.3 },
  fkRequiem: { heal: 0.01 },
};
