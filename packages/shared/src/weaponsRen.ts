// 렌(비르디아) 무기: 맨손 하나. 거대한 토목(흙과 나무 덩어리)이 엉키며 적을 타격 → 묶기 → 날려버리기 → 짓뭉개기 → 가두기 차례로 공격 (계산은 sim/ren)
// 둘레를 도는 작은 수호 토목이 렌을 지킴: 몸으로 부딪히는 공격은 맞지만 원거리 탄은 70% 확률로 막음
import type { WeaponDef } from "./content";

export const REN_WEAPONS = {
  /** 맨손 (토목을 부림): 넓고 세지만 느림 */
  renHands: { id: "renHands", kind: "earthwood", damageMul: 2.2, attackSpeed: 0.7, range: 90, projectileSpeed: 0, exclusive: "ren" },
} as const satisfies Record<string, WeaponDef>;

/** 토목 공격 차례: 타격 · 묶기 · 날려버리기 · 짓뭉개기 · 가두기 */
export const REN_MOVES = ["strike", "bind", "launch", "crush", "prison"] as const;
export type RenMove = (typeof REN_MOVES)[number];

/** 렌 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const REN = {
  /** 토목이 떨어지는 반경 · 차례마다 피해 배율 */
  slamR: 30,
  mul: { strike: 1, bind: 0.8, launch: 0.9, crush: 1.6, prison: 0.7 } as Record<RenMove, number>,
  /** 묶기 틱 · 날려버리기 거리 · 가두기(멈춤) 틱 */
  bindTicks: 90,
  launchPush: 26,
  prisonTicks: 120,
  /** 수호 토목: 수 · 도는 반경 · 맞히는 주기(틱) · 피해 배율 · 원거리 탄 막는 확률 */
  guards: 3,
  guardR: 14,
  guardEvery: 20,
  guardMul: 0.3,
  block: 0.7,
  /** 몸으로 부딪히는 근접 공격은 2배로 받음 (원거리 탄을 막는 대신) */
  meleeTaken: 2,
} as const;
