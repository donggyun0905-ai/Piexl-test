// 영사 전용 아이템 10개. 효과는 sim/silk. 수치는 SILK_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const K = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "silk" as const, effect: true as const });

export const SILK_PASSIVES = {
  /** 빠른 손: 장전 시간 -40% */
  skFast: K("skFast"),
  /** 실타래: 장전 수 +30 */
  skMore: K("skMore"),
  /** 날 선 실: 실 피해 +25% */
  skEdge: K("skEdge"),
  /** 찢는 손: 찢기 피해 +100% */
  skRend: K("skRend"),
  /** 얽힘: 찢는 데 드는 얽힘 -1 */
  skTangle: K("skTangle"),
  /** 폭주: 실 연사가 30가닥 → 20가닥마다 */
  skFrenzy: K("skFrenzy"),
  /** 핏방울: 찢으면 체력 1 회복 */
  skBlood: K("skBlood"),
  /** 가벼운 걸음: 이동 속도 +10% */
  skAgile: { id: "skAgile", mods: [{ stat: "moveSpeed", mul: 1.1 }] as StatMod[], exclusive: "silk" as const },
  /** 손끝 감각: 공격 속도 +15% */
  skHaste: { id: "skHaste", mods: [{ stat: "attackSpeed", mul: 1.15 }] as StatMod[], exclusive: "silk" as const },
  /** 비단 방패: 장전하는 동안 받는 피해 -40% */
  skShield: K("skShield"),
} as const satisfies Record<string, PassiveDef>;

/** 영사 아이템 수치 */
export const SILK_PERKS = {
  skFast: { mul: 0.6 },
  skMore: { n: 30 },
  skEdge: { mul: 1.25 },
  skRend: { add: 1 },
  skTangle: { n: 1 },
  skFrenzy: { every: 20 },
  skBlood: { heal: 1 },
  skShield: { taken: 0.6 },
};
