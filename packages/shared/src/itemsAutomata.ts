// 오토마타 전용 아이템 10개. 효과는 sim/automata. 수치는 AUTOMATA_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const S = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "automata" as const, effect: true as const });

export const AUTOMATA_PASSIVES = {
  /** 동력 코어: 공격 속도 +15% */
  adCore: { id: "adCore", mods: [{ stat: "attackSpeed", mul: 1.15 }] as StatMod[], exclusive: "automata" as const },
  /** 초점 렌즈: 레이저 피해 +25% */
  adFocus: S("adFocus"),
  /** 확산 렌즈: 레이저가 더 굵음 */
  adWide: S("adWide"),
  /** 자매 부르기: 어느 무기든 자매 인형 +1 (자매 인형 무기와도 더해짐) */
  adCall: S("adCall"),
  /** 넷째 자매: 자매 인형 +1 */
  adFourth: S("adFourth"),
  /** 고폭 탄두: 미사일 폭발 +50% */
  adWarhead: S("adWarhead"),
  /** 탄약 증설: 미사일 확률 +20%, 3발 더 */
  adSalvo: S("adSalvo"),
  /** 잔상 회로: 25% 확률로 레이저를 한 번 더 */
  adEcho: S("adEcho"),
  /** 방어 필드: 받는 피해 -15% */
  adShield: S("adShield"),
  /** 깨어난 자아: 적 20마리마다 공격력 +1 (최대 +10) */
  adSoul: S("adSoul"),
} as const satisfies Record<string, PassiveDef>;

/** 오토마타 아이템 수치 */
export const AUTOMATA_PERKS = {
  adFocus: { mul: 1.25 },
  adWide: { add: 3 },
  adCall: { n: 1 },
  adFourth: { n: 1 },
  adWarhead: { r: 1.5 },
  adSalvo: { chance: 0.2, n: 3 },
  adEcho: { chance: 0.25 },
  adShield: { taken: 0.85 },
  adSoul: { every: 20, max: 10 },
};
