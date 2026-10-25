// 아티팩터 전용 아이템 10개 + 숨겨진 아이템 5개(제작으로만 나옴, special이라 보상·상점에는 없음). 효과는 sim/artifacter. 수치는 ARTIFACTER_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const S = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "artifacter" as const, effect: true as const });
const H = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "artifacter" as const, effect: true as const, special: true as const });

export const ARTIFACTER_PASSIVES = {
  /** 빛나는 문신: 공격력 +2 */
  afTattoo: { id: "afTattoo", mods: [{ stat: "damage", add: 2 }] as StatMod[], exclusive: "artifacter" as const },
  /** 집속 회로: 반발탄 피해 +25% */
  afFocus: S("afFocus"),
  /** 확산 문양: 반발 폭발 범위 +50% */
  afWide: S("afWide"),
  /** 강한 반발: 밀침 2배 · 맞은 적이 잠깐 멈춤 */
  afPush: S("afPush"),
  /** 쌍발: 반발탄을 두 발 */
  afDouble: S("afDouble"),
  /** 숙련공: 제작 게이지가 30% 빨리 참 */
  afCrafter: S("afCrafter"),
  /** 행운의 손: 숨겨진 아이템이 나올 확률 2배 */
  afLucky: S("afLucky"),
  /** 설계도: 제작할 때 아이템 2개 */
  afBlueprint: S("afBlueprint"),
  /** 반발 보호막: 받는 피해 -15% */
  afShield: S("afShield"),
  /** 회로 폭주: 제작한 뒤 5초 동안 공격 속도 +50% */
  afSurge: S("afSurge"),
  /** (숨겨진) 불사의 문신: 한 번 쓰러지면 체력 50%로 되살아남 */
  afPhoenix: H("afPhoenix"),
  /** (숨겨진) 과부하 문양: 공격 속도 +40% */
  afOverdrive: H("afOverdrive", [{ stat: "attackSpeed", mul: 1.4 }]),
  /** (숨겨진) 수호 골렘 문신: 받는 피해 -30% */
  afGolem: H("afGolem"),
  /** (숨겨진) 특이점: 반발탄이 둘레 적을 끌어당긴 뒤 터짐 · 폭발 범위 2배 */
  afSingularity: H("afSingularity"),
  /** (숨겨진) 무한 회로: 제작 게이지 2배 · 공격력 +5 */
  afInfinity: H("afInfinity", [{ stat: "damage", add: 5 }]),
} as const satisfies Record<string, PassiveDef>;

/** 숨겨진 아이템 (제작으로만) */
export const ARTIFACTER_HIDDEN = ["afPhoenix", "afOverdrive", "afGolem", "afSingularity", "afInfinity"] as const;

/** 아티팩터 아이템 수치 */
export const ARTIFACTER_PERKS = {
  afFocus: { mul: 1.25 },
  afWide: { r: 1.5 },
  afPush: { push: 2, stun: 15 },
  afCrafter: { mul: 1.3 },
  afLucky: { mul: 2 },
  afBlueprint: { n: 2 },
  afShield: { taken: 0.85 },
  afSurge: { ticks: 300, speed: 1.5 },
  afPhoenix: { hp: 0.5 },
  afGolem: { taken: 0.7 },
  afSingularity: { r: 2, pull: 0.5 },
  afInfinity: { mul: 2 },
};
