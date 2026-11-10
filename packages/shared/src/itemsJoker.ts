// 조커 전용 아이템 15개: 하나하나가 새 기술·능력을 열고 능력치도 올림 (실베르답게 먹을수록 강해짐). 효과는 sim/joker·jokerDraw. 수치는 JOKER_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "joker" as const, effect: true as const });

export const JOKER_PASSIVES = {
  /** 카드뽑기: 게이지가 차면 머리 위 카드 셋 중 한 장 (달 · 붉은 일식 · 세계수) */
  jkDraw: P("jkDraw", [{ stat: "projectileSpeed", mul: 1.1 }]),
  /** 날 선 모서리: 튕길 때 느는 피해 더 */
  jkEdge: P("jkEdge", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 더블 덱: 몇 번째마다 두 장을 갈라 던짐 */
  jkDouble: P("jkDouble", [{ stat: "attackSpeed", add: 0.1 }]),
  /** 마술사의 소매: 판 위 카드 한도 증가 */
  jkSleeve: P("jkSleeve", [{ stat: "maxHp", add: 10 }]),
  /** 불꽃 카드: 맞은 적이 불탐 */
  jkFlame: P("jkFlame", [{ stat: "luck", add: 1 }]),
  /** 서리 카드: 맞은 적이 느려짐 */
  jkFrost: P("jkFrost", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 지휘봉: 대시하면 모든 카드가 조준한 쪽으로 방향을 바꿈 */
  jkRecall: P("jkRecall", [{ stat: "moveSpeed", add: 0.1 }]),
  /** 폭죽 카드: 한도를 넘어 사라지는 카드가 그 자리에서 터짐 */
  jkFirework: P("jkFirework", [{ stat: "maxHp", add: 10 }]),
  /** 분신 카드: 몇 번 튕길 때마다 카드가 한 장 더 갈라져 나옴 */
  jkSplit: P("jkSplit", [{ stat: "projectileSpeed", mul: 1.05 }]),
  /** 에이스: 몇 번째 던지는 카드는 크고 처음부터 셈 */
  jkAce: P("jkAce", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 행운의 7: 맞힐 때 확률로 피해 몇 배 */
  jkSeven: P("jkSeven", [{ stat: "luck", add: 3 }]),
  /** 하트 카드: 카드로 처치하면 회복 */
  jkHeart: P("jkHeart", [{ stat: "maxHp", add: 15 }]),
  /** 가속 카드: 튕길 때마다 카드가 빨라짐 (한도까지) */
  jkAccel: P("jkAccel", [{ stat: "projectileSpeed", mul: 1.1 }]),
  /** 카드 방패: 카드가 적 탄에 닿으면 탄을 지움 */
  jkGuard: P("jkGuard", [{ stat: "maxHp", add: 10 }]),
  /** 풀 하우스: 판 위 카드가 한도만큼 가득이면 모든 카드 피해 배율 */
  jkFullHouse: P("jkFullHouse", [{ stat: "attackSpeed", add: 0.1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const JOKER_PERKS = {
  /** 날 선 모서리: 튕길 때 더 느는 피해 */
  jkEdge: { more: 2 },
  /** 더블 덱: 몇 번째 던질 때마다 · 갈라지는 각도의 [cos, sin] */
  jkDouble: { every: 4, cos: 0.966, sin: 0.259 },
  /** 마술사의 소매: 카드 한도 더함 */
  jkSleeve: { more: 5 },
  /** 불꽃 카드: 불 피해 (카드 피해의 비율) */
  jkFlame: { burn: 0.5 },
  /** 서리 카드: 느려지는 틱 */
  jkFrost: { slow: 60 },
  /** 지휘봉: 다시 쓰기까지 틱 */
  jkRecall: { cool: 60 },
  /** 폭죽 카드: 반지름 · 피해 배율 (사라지는 카드 피해의) */
  jkFirework: { r: 34, mul: 1 },
  /** 분신 카드: 몇 번 튕길 때마다 · 갈라진 카드 피해 배율 (원래 카드의) */
  jkSplit: { every: 8, mul: 0.5 },
  /** 에이스: 몇 번째 던질 때마다 · 처음 고정 피해 · 크기 배율 */
  jkAce: { every: 13, base: 16, size: 2 },
  /** 행운의 7: 확률 · 피해 배율 */
  jkSeven: { chance: 0.07, mul: 7 },
  /** 하트 카드: 처치하면 회복 */
  jkHeart: { heal: 1 },
  /** 가속 카드: 튕길 때마다 빠르기 배율 · 가장 빠른 배율 */
  jkAccel: { per: 1.04, max: 2 },
  /** 카드 방패: 탄을 지우는 거리 (카드 크기 +) */
  jkGuard: { reach: 4 },
  /** 풀 하우스: 가득일 때 피해 배율 */
  jkFullHouse: { mul: 2 },
};
