// 매드퀸 전용 아이템 10개: 대포 3 · 폭발 · 터렛 2 · 날개 2 · 일제사격 · 자유. 효과는 sim/madQueen·madQueenArms. 수치는 MADQUEEN_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "madQueen" as const, effect: true as const });

export const MADQUEEN_PASSIVES = {
  // ── 대포 (셋 다 모으면 대포 4문) ──
  /** 쌍열 포신: 머리 위 대포 + 1 */
  mqTwin: P("mqTwin"),
  /** 현측 포열: 머리 위 대포 + 1 · 공격 속도 + */
  mqBroadside: P("mqBroadside", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 기함의 위엄: 머리 위 대포 + 1 · 최대 체력 + */
  mqFlagship: P("mqFlagship", [{ stat: "maxHp", add: 15 }]),
  /** 고폭 탄두: 모든 폭발이 커짐 */
  mqWarhead: P("mqWarhead"),
  // ── 터렛·날개 ──
  /** 신속 설치: 터렛이 더 잘 나옴 */
  mqRig: P("mqRig"),
  /** 과충전 포탑: 터렛 사거리 + · 더 자주 쏨 */
  mqOverclock: P("mqOverclock"),
  /** 날개 편대: 날개 무기가 더 잘 나옴 */
  mqSquadron: P("mqSquadron"),
  /** 프리즘 렌즈: 날개 레이저가 굵고 셈 */
  mqPrism: P("mqPrism"),
  // ── 일제사격·자유 ──
  /** 해방의 포격: 전탄 일제사격 포탄이 많고 셈 */
  mqBarrage: P("mqBarrage"),
  /** 자유의 바다: 이동 속도 + · 받는 피해 줄어듦 */
  mqFreedom: P("mqFreedom", [{ stat: "moveSpeed", add: 0.1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 대포를 하나씩 늘리는 아이템 (대포 수 = 1 + 가진 수, 최대 MADQUEEN.cannonMax) */
export const MQ_CANNON_PERKS = ["mqTwin", "mqBroadside", "mqFlagship"] as const;

/** 매드퀸 아이템 수치 */
export const MADQUEEN_PERKS = {
  /** 고폭 탄두: 폭발 반지름 배율 */
  mqWarhead: { boom: 1.35 },
  /** 신속 설치: 터렛 확률 더함 */
  mqRig: { chance: 0.15 },
  /** 과충전 포탑: 터렛 사거리 배율 · 쏘는 간격 배율 */
  mqOverclock: { range: 1.3, every: 0.75 },
  /** 날개 편대: 날개 확률 더함 */
  mqSquadron: { chance: 0.15 },
  /** 프리즘 렌즈: 레이저 피해 배율 · 굵기 배율 */
  mqPrism: { mul: 1.5, width: 1.5 },
  /** 해방의 포격: 포탄 수 배율 · 피해 배율 */
  mqBarrage: { shots: 1.5, mul: 1.25 },
  /** 자유의 바다: 받는 피해 배율 */
  mqFreedom: { taken: 0.9 },
};
