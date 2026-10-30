// 빛의 사도(한정, 서고의 감시자): 빛의 검 하나 · 평타는 사거리 안 적 자리에 작은 빛의 검 · 몇 번째 공격마다 적 자리에 '+' 빛의 검 (sim/lux)
import type { WeaponDef } from "./content";

export const LUX_WEAPONS = {
  /** 빛의 검: 빠른 공격 속도 · 짧은 사거리(이 안의 적 자리에 빛의 검) · 낮은 공격력 */
  luxBlade: { id: "luxBlade", kind: "radiant", damageMul: 1, attackSpeed: 2.6, range: 45, projectileSpeed: 7, exclusive: "lux" },
} as const satisfies Record<string, WeaponDef>;

/** 빛의 사도 수치 */
export const LUX = {
  /** 이 공격마다 빛의 검 생성 · 노리는 거리(사거리 배율) · 처음 노리는 적 수 · 적마다 생기는 검 수 · 검 사이 틱 · 평타 검 팔 길이 */
  every: 3,
  reach: 2.5,
  targets: 2,
  hits: 2,
  gap: 6,
  stab: 10,
  /** '+' 빛의 검: 공격력 배율 · 팔 길이 · 폭 · 조각 하나마다 피해 + */
  cross: 0.9,
  arm: 18,
  width: 6,
  perShard: 0.04,
  /** 조각 몇 개마다 한 단계 (몸이 커짐 · 노리는 적 +1 · 팔 +15%) · 최대 단계 */
  perStage: 6,
  maxStage: 3,
  /** 빛의 적: 층마다 수 · 강해진 몬스터 체력 배율 · 빛을 얻은 보스 체력 배율 · 빛을 훔친 그림자(1대1) 체력 배율 */
  foes: 3,
  packHp: 3,
  bossHp: 0.55,
  duelHp: 8,
};
