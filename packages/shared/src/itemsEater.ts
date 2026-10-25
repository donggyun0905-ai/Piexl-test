// 이터 전용 아이템 10개. 효과는 sim/eater. 수치는 EATER_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const E = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "eater" as const, effect: true as const });

export const EATER_PASSIVES = {
  /** 폭식: 먹을 때마다 재생력이 두 배로 참 */
  eaGluttony: E("eaGluttony"),
  /** 끝없는 허기: 재생력 상한 100 → 150 */
  eaHunger: E("eaHunger"),
  /** 커다란 아가리: 공격 범위 +25% */
  eaMaw: E("eaMaw"),
  /** 이빨 갈기: 물기(물어뜯기·심연·세 번 씹기·낚아채기) 피해 +30% */
  eaFang: E("eaFang"),
  /** 심연의 부름: 심연·낚아채기가 두 배로 자주 */
  eaAbyss: E("eaAbyss"),
  /** 통째로 삼키기: 삼키는 체력 기준 25% → 40%, 모든 물기에 적용 */
  eaDevour: E("eaDevour"),
  /** 포식: 적을 먹으면 체력 1 회복 */
  eaFeast: E("eaFeast"),
  /** 굶주린 광기: 먹은 적 50마리마다 공격 속도 +5% (최대 +30%) */
  eaFrenzy: E("eaFrenzy"),
  /** 그림자 몸: 받는 피해 -15% */
  eaShade: E("eaShade"),
  /** 메아리: 20% 확률로 공격이 한 번 더 */
  eaEcho: E("eaEcho"),
} as const satisfies Record<string, PassiveDef>;

/** 이터 아이템 수치 */
export const EATER_PERKS = {
  eaGluttony: { mul: 2 },
  eaHunger: { max: 150 },
  eaMaw: { mul: 1.25 },
  eaFang: { mul: 1.3 },
  eaAbyss: { mul: 2 },
  eaDevour: { below: 0.4 },
  eaFeast: { heal: 1 },
  eaFrenzy: { per: 50, speed: 0.05, max: 0.3 },
  eaShade: { taken: 0.85 },
  eaEcho: { chance: 0.2 },
};
