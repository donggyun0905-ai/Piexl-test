// 제우스 전용 아이템 10개. 효과는 sim/zeus·zeusPower. 수치는 ZEUS_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const Z = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "zeus" as const, effect: true as const });

export const ZEUS_PASSIVES = {
  /** 올림포스의 왕: 공격력 +20% */
  zsKing: { id: "zsKing", mods: [{ stat: "damage", mul: 1.2 }] as StatMod[], exclusive: "zeus" as const },
  /** 구름 타기: 이동 속도 +15% */
  zsCloud: { id: "zsCloud", mods: [{ stat: "moveSpeed", mul: 1.15 }] as StatMod[], exclusive: "zeus" as const },
  /** 신들의 술: 최대 체력 +40 */
  zsNectar: { id: "zsNectar", mods: [{ stat: "maxHp", add: 40 }] as StatMod[], exclusive: "zeus" as const },
  /** 높은 하늘의 눈: 사거리 +30 */
  zsSkyEye: { id: "zsSkyEye", mods: [{ stat: "range", add: 30 }] as StatMod[], exclusive: "zeus" as const },
  /** 전도: 번개가 2번 더 옮겨 붙음 */
  zsConductor: Z("zsConductor"),
  /** 과부하: 감전이 다 쌓인 적은 터지며 둘레를 지짐 */
  zsOverload: Z("zsOverload"),
  /** 분노한 신: 천벌 게이지가 두 배로 참 */
  zsWrath: Z("zsWrath"),
  /** 번개 걸음: 대시한 길의 번개가 두 배 · 대시하는 동안 무적 */
  zsStep: Z("zsStep"),
  /** 신들의 왕의 응징: 맞으면 30% 확률로 적 셋에게 벼락 */
  zsRetort: Z("zsRetort"),
  /** 거인 학살자: 보스에게 피해 +50% */
  zsGiant: Z("zsGiant"),
} as const satisfies Record<string, PassiveDef>;

/** 제우스 아이템 수치 */
export const ZEUS_PERKS = {
  zsConductor: { n: 2 },
  zsOverload: { r: 44, mul: 2.5 },
  zsWrath: { mul: 2 },
  zsStep: { mul: 2 },
  zsRetort: { chance: 0.3, n: 3, mul: 2 },
  zsGiant: { mul: 1.5 },
};
