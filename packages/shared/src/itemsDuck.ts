// 오리 전용 아이템 10개. 효과는 sim/duck·ducklings. 수치는 DUCK_PERKS
import type { PassiveDef } from "./items";

export const DUCK_PASSIVES = {
  /** 새끼 오리 +1 (여러 개 가질 수 있음) */
  extraDuckling: { id: "extraDuckling", mods: [], exclusive: "duck" },
  /** 우렁찬 꽥: 사거리 +25%, 공격력 +2 */
  loudQuack: { id: "loudQuack", mods: [{ stat: "range", mul: 1.25 }, { stat: "damage", add: 2 }], exclusive: "duck" },
  /** 황금 깃털: 행운 +3, 최대 체력 +25 */
  goldenFeather: { id: "goldenFeather", mods: [{ stat: "luck", add: 3 }, { stat: "maxHp", add: 25 }], exclusive: "duck" },
  /** 뒤뚱 걸음: 이동 속도 +0.2, 공격 속도 +10% */
  duckWalk: { id: "duckWalk", mods: [{ stat: "moveSpeed", add: 0.2 }, { stat: "attackSpeed", mul: 1.1 }], exclusive: "duck" },
  /** 큰 꽥 연습: 큰 꽥이 한 번 더 자주(최소 2번째마다), 큰 꽥 피해 +50% */
  bigQuack: { id: "bigQuack", mods: [], exclusive: "duck", effect: true },
  /** 오리 가족: 새끼 오리 한 마리당 피해 +5% */
  duckFamily: { id: "duckFamily", mods: [], exclusive: "duck", effect: true },
  /** 빵 간식: 새끼 오리가 탄을 막을 때마다 체력 1 회복 */
  breadSnack: { id: "breadSnack", mods: [], exclusive: "duck", effect: true },
  /** 메아리: 새끼 오리 꽥 피해 40% → 70%, 범위 +30% */
  echoQuack: { id: "echoQuack", mods: [], exclusive: "duck", effect: true },
  /** 깃털 방패: 큰 꽥을 하면 보호막 8 (최대 체력의 30%까지) */
  featherShield: { id: "featherShield", mods: [], exclusive: "duck", effect: true },
  /** 용감한 새끼: 새끼 오리가 탄을 막은 뒤 다시 막기까지 1초 → 0.5초 */
  braveDuckling: { id: "braveDuckling", mods: [], exclusive: "duck", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 오리 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱) */
export const DUCK_PERKS = {
  bigQuack: { every: 1, damage: 1.5 },
  duckFamily: { per: 0.05 },
  breadSnack: { heal: 1 },
  echoQuack: { echo: 0.7, range: 1.3 },
  featherShield: { shield: 8, max: 0.3 },
  braveDuckling: { block: 30 },
};
