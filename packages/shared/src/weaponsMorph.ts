// 변희(비르디아, 만물의 소녀) 무기: 동물 그 자체. 든 무기의 동물로 변해 그 동물처럼 싸움 (계산은 sim/morph)
import type { WeaponDef } from "./content";

/** 동물: 공격 방식이 모두 다름 (sim/morph) */
export type AnimalKind = "wolf" | "bear" | "eagle" | "snake" | "boar" | "scorpion" | "bat" | "elephant" | "spider" | "phoenix";

const M = (id: string, animal: AnimalKind, damageMul: number, attackSpeed: number, range: number, moveMul: number, projectileSpeed = 0) =>
  ({ id, kind: "morph", damageMul, attackSpeed, range, projectileSpeed, moveMul, animal, exclusive: "byeonhui" }) as const;

export const MORPH_WEAPONS = {
  /** 늑대 (처음 무기): 빠른 물기, 세 번째마다 세게 */
  wolfForm: M("wolfForm", "wolf", 0.8, 2.4, 26, 1.15),
  /** 곰: 느리고 넓은 앞발 할퀴기, 멀리 밀침 */
  bearForm: M("bearForm", "bear", 2, 0.9, 34, 0.9),
  /** 독수리: 깃털 셋을 날림 */
  eagleForm: M("eagleForm", "eagle", 0.6, 2, 140, 1.1, 4),
  /** 뱀: 앞으로 뻗는 독 물기 */
  snakeForm: M("snakeForm", "snake", 0.8, 1.6, 36, 1),
  /** 멧돼지: 앞으로 돌진하며 들이받음 */
  boarForm: M("boarForm", "boar", 1.8, 0.9, 50, 1.05),
  /** 전갈: 멀리 찌르는 꼬리, 맞은 적이 잠깐 멈춤 */
  scorpionForm: M("scorpionForm", "scorpion", 1.4, 1.2, 48, 1),
  /** 박쥐: 부채꼴 음파, 피를 빨아 회복 */
  batForm: M("batForm", "bat", 0.9, 1.7, 52, 1.2),
  /** 코끼리: 둘레를 짓밟아 기절 */
  elephantForm: M("elephantForm", "elephant", 2.4, 0.7, 40, 0.85),
  /** 거미: 거미줄을 쏘아 느리게 */
  spiderForm: M("spiderForm", "spider", 1, 1.4, 120, 1, 3),
  /** 불사조: 터지는 불덩이, 불태움 */
  phoenixForm: M("phoenixForm", "phoenix", 1.3, 1.2, 120, 1.05, 3),
} as const satisfies Record<string, WeaponDef>;

/** 변희 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const MORPH = {
  /** 늑대: 몇 번째마다 세게 · 그 배율 · 물기 범위(cos) */
  wolfEvery: 3,
  wolfMul: 2,
  biteArc: 0.3,
  /** 곰: 범위(cos) · 밀침 */
  bearArc: -0.2,
  bearPush: 10,
  /** 독수리: 깃털 수 · 사이 각도 */
  feathers: 3,
  featherSpread: 0.18,
  /** 뱀: 폭 · 독(공격력 배율, 0.5초마다) · 독 틱 */
  snakeWidth: 8,
  venom: 0.3,
  venomTicks: 180,
  /** 멧돼지: 돌진 틱 */
  rushTicks: 8,
  /** 전갈: 폭 · 멈춤 틱 */
  stingWidth: 5,
  stingStun: 20,
  /** 박쥐: 범위(cos) · 준 피해 중 회복 비율 */
  sonicArc: 0.5,
  leech: 0.05,
  /** 코끼리: 기절 틱 */
  stompStun: 30,
  /** 거미: 느려지는 틱 */
  webSlow: 90,
  /** 불사조: 터지는 반경 */
  fireR: 22,
} as const;
