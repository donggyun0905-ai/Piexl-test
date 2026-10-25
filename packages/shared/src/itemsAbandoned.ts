// 버려진 자들 전용 아이템 10개. 효과는 sim/abandoned·abandonedMoves·combat. 수치는 ABANDONED_PERKS
import type { PassiveDef } from "./items";

export const ABANDONED_PASSIVES = {
  /** 골목의 의리: 특수기 피해 +40% */
  alleyBond: { id: "alleyBond", mods: [], exclusive: "abandoned", effect: true },
  /** 빠른 손바꿈: 탭 무적 0.5초 → 0.8초 */
  quickSwap: { id: "quickSwap", mods: [], exclusive: "abandoned", effect: true },
  /** 교대 일격: 탭할 때 들어오는 아이가 앞을 한 번 침 (공격력 80%) */
  tagStrike: { id: "tagStrike", mods: [], exclusive: "abandoned", effect: true },
  /** 맏이의 방패: P1(방패)이 나와 있는 동안 받는 피해 -25% */
  eldestShield: { id: "eldestShield", mods: [], exclusive: "abandoned", effect: true },
  /** 마지막 탄창: P2(총) 공격 피해 +30% */
  lastMag: { id: "lastMag", mods: [], exclusive: "abandoned", effect: true },
  /** 녹슨 칼날: P3(검) 공격 피해 +25%, 맞은 적 출혈 */
  rustyEdge: { id: "rustyEdge", mods: [], exclusive: "abandoned", effect: true },
  /** 함께 자란 아이들: 특수기를 쓰면 최대 체력의 6% 회복 */
  grewTogether: { id: "grewTogether", mods: [], exclusive: "abandoned", effect: true },
  /** 셋이서 하나: 특수기를 쓰면 5초 동안 공격력 +25% */
  threeAsOne: { id: "threeAsOne", mods: [], exclusive: "abandoned", effect: true },
  /** 흉터: 최대 체력 +25 */
  streetScars: { id: "streetScars", mods: [{ stat: "maxHp", add: 25 }], exclusive: "abandoned" },
  /** 뒷골목 질주: 이동 속도 +0.15 */
  backAlleyRun: { id: "backAlleyRun", mods: [{ stat: "moveSpeed", add: 0.15 }], exclusive: "abandoned" },
} as const satisfies Record<string, PassiveDef>;

/** 버려진 자들 아이템 수치 (배율은 1 = 100%, 시간은 틱) */
export const ABANDONED_PERKS = {
  alleyBond: { damage: 1.4 },
  quickSwap: { ticks: 48 },
  tagStrike: { mul: 0.8 },
  eldestShield: { taken: 0.75 },
  lastMag: { damage: 1.3 },
  rustyEdge: { damage: 1.25 },
  grewTogether: { heal: 0.06 },
  threeAsOne: { damage: 1.25, ticks: 300 },
};
