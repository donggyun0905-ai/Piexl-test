// 에테르 광부 전용 아이템 10개. 효과는 sim/miner. 수치는 MINER_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const M = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "miner" as const, effect: true as const });

export const MINER_PASSIVES = {
  /** 광부의 등불: 행운 +2 */
  mnLamp: { id: "mnLamp", mods: [{ stat: "luck", add: 2 }] as StatMod[], exclusive: "miner" as const },
  /** 안전모: 최대 체력 +30 */
  mnHelmet: { id: "mnHelmet", mods: [{ stat: "maxHp", add: 30 }] as StatMod[], exclusive: "miner" as const },
  /** 광부의 근력: 공격력 +15% */
  mnMuscle: { id: "mnMuscle", mods: [{ stat: "damage", mul: 1.15 }] as StatMod[], exclusive: "miner" as const },
  /** 광맥 감지: 원석이 두 배로 나옴 */
  mnVein: M("mnVein"),
  /** 금맥: 원석을 캘 때마다 돈 +1 */
  mnGold: M("mnGold"),
  /** 카나리아: 체력이 40% 아래로 맞으면 카나리아가 울어 보통 적이 모두 2초 기절 (15초마다) */
  mnCanary: M("mnCanary"),
  /** 연쇄 발파: 결정을 깨면 폭발 · 광산 붕괴 바위 두 배 */
  mnChain: M("mnChain"),
  /** 두더지: 땅굴에서 나올 때 범위 1.5배 · 피해 두 배 */
  mnMole: M("mnMole"),
  /** 붕괴 전문가: 광산 붕괴에 필요한 원석 절반 */
  mnExpert: M("mnExpert"),
  /** 대박 원석: 맞힐 때마다 3% 확률로 보통 적이 그대로 에테르 결정이 됨 */
  mnJackpot: M("mnJackpot"),
} as const satisfies Record<string, PassiveDef>;

/** 에테르 광부 아이템 수치 */
export const MINER_PERKS = {
  mnVein: { mul: 2 },
  mnGold: { gold: 1 },
  mnCanary: { hp: 0.4, stun: 120, cool: 900 },
  mnChain: { r: 40, mul: 2, rocks: 2 },
  mnMole: { r: 1.5, mul: 2 },
  mnExpert: { mul: 0.5 },
  mnJackpot: { chance: 0.03 },
};
