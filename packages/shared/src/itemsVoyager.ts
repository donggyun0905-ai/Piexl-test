// 운명의 여행자 전용 아이템 10개. 효과는 sim/voyager. 수치는 VOYAGER_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const V = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "voyager" as const, effect: true as const });

export const VOYAGER_PASSIVES = {
  /** 두 개의 주사위: 주사위를 두 개 던져 36칸 중 정확한 칸 · 두 눈의 합만큼 세짐 */
  vyTwinDice: V("vyTwinDice"),
  /** 손때 묻은 주사위: 1이 나오지 않음 */
  vyLoadedDie: V("vyLoadedDie"),
  /** 빠른 모래: 모래시계가 40% 빨리 참 */
  vySandglass: V("vySandglass"),
  /** 운명 붙잡기: 운명이 바뀌어도 바로 전 능력이 같이 남음 */
  vyKeepFate: V("vyKeepFate"),
  /** 질긴 시위: 모으는 시간 -30% */
  vyString: V("vyString"),
  /** 화살통: 끝까지 모은 한 발이 하나 더 나감 */
  vyQuiver: V("vyQuiver"),
  /** 월계관: 공격력 +15% */
  vyLaurel: { id: "vyLaurel", mods: [{ stat: "damage", mul: 1.15 }] as StatMod[], exclusive: "voyager" as const },
  /** 뱃사람의 걸음: 이동 속도 +10% · 모으는 동안에도 느려지지 않음 */
  vySeaLegs: { id: "vySeaLegs", mods: [{ stat: "moveSpeed", mul: 1.1 }] as StatMod[], exclusive: "voyager" as const, effect: true as const },
  /** 여섯 눈의 축복: 같은 눈(주사위 하나면 6)이 나오면 버프가 두 배 */
  vyBlessing: V("vyBlessing"),
  /** 귀향의 별: 모래시계가 뒤집힐 때마다 체력 10% 회복 · 보호막 20 */
  vyHomeward: V("vyHomeward"),
} as const satisfies Record<string, PassiveDef>;

/** 운명의 여행자 아이템 수치 */
export const VOYAGER_PERKS = {
  vySandglass: { mul: 1.4 },
  vyString: { mul: 0.7 },
  vyQuiver: { spread: 0.18 },
  vyBlessing: { mul: 2 },
  vyHomeward: { heal: 0.1, shield: 20 },
};
