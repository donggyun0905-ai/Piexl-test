// 방랑객 전용 아이템 10개. 효과는 sim/wanderer (숫돌·깊은 상처는 baseStats 예리함). 수치는 WANDERER_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const W = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "wanderer" as const, effect: true as const });

export const WANDERER_PASSIVES = {
  /** 숫돌: 예리함 +15% */
  wdHone: W("wdHone"),
  /** 깊은 상처: 예리함이 터진 적이 받는 피해 25% → 40% */
  wdDeep: W("wdDeep"),
  /** 명경지수: 가만히 서 있을 때 피해 +20% · 무심의 원 +30% */
  wdCalm: W("wdCalm"),
  /** 바람의 칼: 검기·칼날 폭풍 +1 */
  wdWind: W("wdWind"),
  /** 납도: 1초 쉬었다 벤 첫 칼은 피해 2배 */
  wdSheath: W("wdSheath"),
  /** 검기 응축: 천검란 게이지가 50% 빨리 참 */
  wdGauge: W("wdGauge"),
  /** 낭인의 걸음: 이동 속도 +10% */
  wdRonin: { id: "wdRonin", mods: [{ stat: "moveSpeed", mul: 1.1 }] as StatMod[], exclusive: "wanderer" as const },
  /** 집중: 공격 속도 +15% */
  wdFocus: { id: "wdFocus", mods: [{ stat: "attackSpeed", mul: 1.15 }] as StatMod[], exclusive: "wanderer" as const },
  /** 피의 비: 적을 쓰러뜨리면 둘레 적에게 출혈 */
  wdRain: W("wdRain"),
  /** 잔월: 대시한 길을 따라 벰 (공격력 150%) */
  wdBlink: W("wdBlink"),
} as const satisfies Record<string, PassiveDef>;

/** 방랑객 아이템 수치 */
export const WANDERER_PERKS = {
  wdHone: { add: 0.15 },
  wdDeep: { def: 0.4 },
  wdCalm: { mul: 1.2, r: 1.3 },
  wdWind: { n: 1 },
  wdSheath: { rest: 60, mul: 2 },
  wdGauge: { mul: 1.5 },
  wdRain: { r: 50 },
  wdBlink: { mul: 1.5, width: 10 },
};
