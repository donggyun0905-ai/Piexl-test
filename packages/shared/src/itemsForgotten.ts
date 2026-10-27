// 잊혀진 자 전용 아이템 10개. 효과는 sim/forgotten. 수치는 FORGOTTEN_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const F = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "forgotten" as const, effect: true as const });

export const FORGOTTEN_PASSIVES = {
  /** 잊힌 기억: 빛의 고리가 더 빨리 참 (25 → 16마리) */
  fgMemory: F("fgMemory"),
  /** 신의 잔향: 신족 10초 → 15초 */
  fgEcho: F("fgEcho"),
  /** 빛기둥 강화: 빛기둥 피해 30% → 50% */
  fgPillar: F("fgPillar"),
  /** 늘어나는 기둥: 빛기둥 +2 */
  fgMany: F("fgMany"),
  /** 신의 가호: 신족인 동안 받는 피해 -30% */
  fgBless: F("fgBless"),
  /** 광휘: 빛 공격이 광휘를 남김 (1초마다 피해의 20%, 3초) */
  fgShine: F("fgShine"),
  /** 성흔: 8번째 공격마다 가까운 적 위로 빛 십자가 */
  fgCross: F("fgCross"),
  /** 빛의 박동: 공격 속도 +15% */
  fgPulse: { id: "fgPulse", mods: [{ stat: "attackSpeed", mul: 1.15 }] as StatMod[], exclusive: "forgotten" as const },
  /** 깨어남: 신족이 될 때 최대 체력 30% 회복 */
  fgHeal: F("fgHeal"),
  /** 잔광: 신족이 끝날 때 둘레에 큰 빛 폭발 (공격력 300%) */
  fgAfter: F("fgAfter"),
} as const satisfies Record<string, PassiveDef>;

/** 잊혀진 자 아이템 수치 */
export const FORGOTTEN_PERKS = {
  fgMemory: { kills: 16 },
  fgEcho: { ticks: 900 },
  fgPillar: { mul: 0.5 },
  fgMany: { n: 2 },
  fgBless: { taken: 0.7 },
  fgShine: { mul: 0.2, ticks: 180 },
  fgCross: { every: 8, r: 20, mul: 1.2, delay: 20 },
  fgHeal: { hp: 0.3 },
  fgAfter: { r: 80, mul: 3 },
};
