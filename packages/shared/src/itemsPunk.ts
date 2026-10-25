// 펑크 전용 아이템 10개: 몸에 심는 능력(사이버웨어). 효과는 sim/punk. 수치는 PUNK_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const S = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "punk" as const, effect: true as const });

export const PUNK_PASSIVES = {
  /** 크롬 눈: 15% 확률로 치명타 (1.5배) */
  cyOptics: S("cyOptics"),
  /** 반사 신경: 이동 속도 +15% */
  cyReflex: { id: "cyReflex", mods: [{ stat: "moveSpeed", mul: 1.15 }] as StatMod[], exclusive: "punk" as const },
  /** 가속기 증폭: 신경 가속이 50% 오래 */
  cyBoost: S("cyBoost"),
  /** 빠른 충전: 신경 가속 게이지가 40% 빨리 참 */
  cyCharge: S("cyCharge"),
  /** 광전사 칩: 신경 가속 중 피해 +40% */
  cyBerserk: S("cyBerserk"),
  /** 혈액 정화기: 8번 맞힐 때마다 체력 1 회복 */
  cyLeech: S("cyLeech"),
  /** 피하 장갑: 받는 피해 -20% */
  cySkin: S("cySkin"),
  /** 광학 위장: 대시한 뒤 0.5초 무적 */
  cyCloak: S("cyCloak"),
  /** 오버클럭: 공격 속도 +20% */
  cyOverclock: { id: "cyOverclock", mods: [{ stat: "attackSpeed", mul: 1.2 }] as StatMod[], exclusive: "punk" as const },
  /** 잔상 분신: 신경 가속 중 공격마다 잔상이 한 번 더 (절반 피해) */
  cyEcho: S("cyEcho"),
} as const satisfies Record<string, PassiveDef>;

/** 펑크 아이템 수치 */
export const PUNK_PERKS = {
  cyOptics: { chance: 0.15, mul: 1.5 },
  cyBoost: { mul: 1.5 },
  cyCharge: { mul: 1.4 },
  cyBerserk: { mul: 1.4 },
  cyLeech: { every: 8, heal: 1 },
  cySkin: { taken: 0.8 },
  cyCloak: { ticks: 30 },
  cyEcho: { mul: 0.5 },
};
