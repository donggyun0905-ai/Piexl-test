// 붐버 전용 아이템 10개. 효과는 sim/bomber. 수치는 BOMBER_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const S = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "bomber" as const, effect: true as const });

export const BOMBER_PASSIVES = {
  /** 화약 증량: 폭발 피해 +25% */
  bmPowder: S("bmPowder"),
  /** 넓은 폭발: 폭발 반경 +25% */
  bmWide: S("bmWide"),
  /** 짧은 도화선: 공격 속도 +15% */
  bmFuse: { id: "bmFuse", mods: [{ stat: "attackSpeed", mul: 1.15 }] as StatMod[], exclusive: "bomber" as const },
  /** 하나 더: 한 번에 폭탄 +1 */
  bmMore: S("bmMore"),
  /** 파편: 터질 때 파편 4개가 사방으로 */
  bmShrapnel: S("bmShrapnel"),
  /** 방폭복: 받는 피해 -20% */
  bmSuit: S("bmSuit"),
  /** 예술가의 혼: 예술 연쇄 최대 칸 10 → 20 */
  bmArtist: S("bmArtist"),
  /** 여진: 30% 확률로 0.3초 뒤 같은 자리가 한 번 더 (절반) */
  bmEcho: S("bmEcho"),
  /** 불꽃 예술: 모든 폭발이 불태움 */
  bmBurn: S("bmBurn"),
  /** 피날레: 터져 쓰러진 적의 여진이 공격력 100% */
  bmFinale: S("bmFinale"),
} as const satisfies Record<string, PassiveDef>;

/** 붐버 아이템 수치 */
export const BOMBER_PERKS = {
  bmPowder: { mul: 1.25 },
  bmWide: { r: 1.25 },
  bmMore: { n: 1 },
  bmShrapnel: { n: 4, mul: 0.4 },
  bmSuit: { taken: 0.8 },
  bmArtist: { max: 20 },
  bmEcho: { chance: 0.3, delay: 18, mul: 0.5 },
  bmFinale: { mul: 1 },
};
