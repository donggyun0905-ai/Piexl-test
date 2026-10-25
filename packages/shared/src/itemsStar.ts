// 별지기(히든) 전용 아이템 10개. 효과는 sim/star. 수치는 STAR_PERKS
import type { PassiveDef } from "./items";

export const STAR_PASSIVES = {
  /** 밝은 별: 빛줄기 피해 +40% */
  brightStar: { id: "brightStar", mods: [], exclusive: "stargazer", effect: true },
  /** 긴 밤: 별이 50% 더 오래 남음 */
  longNight: { id: "longNight", mods: [], exclusive: "stargazer", effect: true },
  /** 넓은 하늘: 빛줄기가 이어지는 거리 +35% */
  wideSky: { id: "wideSky", mods: [], exclusive: "stargazer", effect: true },
  /** 별 하나 더: 별자리에 별 +1 (빛줄기가 더 많아짐) */
  extraStar: { id: "extraStar", mods: [], exclusive: "stargazer", effect: true },
  /** 별똥별: 별을 박을 때 25% 확률로 둘레에 별 하나 더 */
  starfall: { id: "starfall", mods: [], exclusive: "stargazer", effect: true },
  /** 별가루: 별자리가 완성될 때마다 최대 체력의 8% 회복 */
  stardust: { id: "stardust", mods: [], exclusive: "stargazer", effect: true },
  /** 별의 가호: 별자리가 완성될 때마다 보호막 6 (이 아이템으로는 최대 24) */
  starWard: { id: "starWard", mods: [], exclusive: "stargazer", effect: true },
  /** 황도 12궁: 별을 12개 박을 때마다 다음 별자리 터짐 3배 */
  zodiac: { id: "zodiac", mods: [], exclusive: "stargazer", effect: true },
  /** 일식: 별자리가 터질 때 맞은 적이 1초 기절 */
  eclipse: { id: "eclipse", mods: [], exclusive: "stargazer", effect: true },
  /** 천구의: 공격력 +20%, 공격 속도 +20% */
  armillary: { id: "armillary", mods: [{ stat: "damage", mul: 1.2 }, { stat: "attackSpeed", mul: 1.2 }], exclusive: "stargazer" },
} as const satisfies Record<string, PassiveDef>;

/** 별지기 아이템 수치 */
export const STAR_PERKS = {
  brightStar: { line: 1.4 },
  longNight: { life: 1.5 },
  wideSky: { link: 1.35 },
  extraStar: { more: 1 },
  starfall: { chance: 0.25, spread: 24 },
  stardust: { heal: 0.08 },
  starWard: { shield: 6, max: 24 },
  zodiac: { every: 12, mul: 3 },
  eclipse: { stun: 60 },
};
