// 오닉스(아스칼론, 영물): 몸에 일곱 보석이 박힌 광석 영물. 무기는 칠보 광륜 하나
// 공격은 방 전체(맵 전체)를 한 번에 치지만 그동안 몸을 못 움직임 · 대시는 켜고 끄는 비행 · 비행 중 보석 7개가 저마다 확률로 반응해 공격
// (계산은 sim/onyx·onyxGems, 아이템은 itemsOnyx)
import type { WeaponDef } from "./content";

export const ONYX_WEAPONS = {
  /** 칠보 광륜(처음이자 하나뿐인 무기): 가운데 자수정에서 방 안 모든 적에게 빛줄기 */
  oxHalo: { id: "oxHalo", kind: "gem", damageMul: 1.4, attackSpeed: 0.9, range: 999, projectileSpeed: 0, exclusive: "onyx" },
} as const satisfies Record<string, WeaponDef>;

/** 보석 일곱 (순서 = 광륜 위 자리: 홍옥·호박·황옥·비취 / 청옥·남옥·자수정) */
export const ONYX_GEM_IDS = ["ruby", "amber", "topaz", "jade", "sapphire", "aqua", "amethyst"] as const;
export type OnyxGem = (typeof ONYX_GEM_IDS)[number];

/** 오닉스 수치 */
export const ONYX = {
  /** 광륜 공격: 몸이 묶이는 틱 · 한 번에 맞히는 적 수 상한 */
  castTicks: 26,
  maxTargets: 40,
  /** 비행: 이동 속도 배율 · 켜고 끄는 사이 최소 틱 · 비행 중 보석이 다시 반응하는 간격(틱) */
  flySpeed: 2.3,
  toggleGap: 12,
  pulse: 42,
  /** 맞은 뒤 무적 틱 (묵인처럼 아주 짧게) */
  hurtTicks: 6,
  /** 칠보 공명: 한 번에 이만큼 넘게 반응하면 방 전체 공명 폭발 · 피해 배율 · 기절 틱 */
  resonNeed: 7,
  resonMul: 3,
  resonStun: 50,
};

/** 보석마다: 반응 확률(0~1, 저마다 따로 굴림) · 피해 배율 · 크기 등 */
export const ONYX_GEMS = {
  /** 홍옥: 가장 가까운 적 자리에 불기둥 (반지름 · 화상 틱) */
  ruby: { chance: 0.35, mul: 1.8, r: 30, burn: 180 },
  /** 호박: 무작위 적 n에게 운석 */
  amber: { chance: 0.3, mul: 1.3, r: 20, n: 3 },
  /** 황옥: 번개가 적 n에게 차례로 튐 */
  topaz: { chance: 0.3, mul: 1.1, n: 5, reach: 120 },
  /** 비취: 몸 둘레 덩굴 가시 (반지름 · 독 0.5초마다 · 독 틱 · 회복 최대 체력 비율) */
  jade: { chance: 0.3, mul: 0.8, r: 56, poison: 4, ticks: 240, heal: 0.02 },
  /** 청옥: 방 안 모든 적에 서리 (둔화 틱) */
  sapphire: { chance: 0.25, mul: 0.6, slow: 120 },
  /** 남옥: 나는 쪽으로 꿰뚫는 빛줄기 (길이 · 폭 절반) */
  aqua: { chance: 0.25, mul: 2.2, len: 240, w: 12 },
  /** 자수정: 체력이 가장 많은 적에게 공허 붕괴 (둘레 끌어당김 반지름) */
  amethyst: { chance: 0.2, mul: 3.2, r: 44, pull: 10 },
};
