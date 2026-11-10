// 이안(성국, 침묵의 서기관): 집행의 펜 & 강철 실타래 하나 + 스킬 넷(1 인과의 실 · 2 그림자 걸음 · 3 기록 집행 · 4 인과율 속박)
// 기본 공격: 펜 찌르기 · 펜 찌르기 → 3타 강철 실이 앞을 휘감아 끌어당김. 맞힌 적에게 '기록'이 쌓임(최대 5) → 5면 '속박'(멈춤 · 받는 피해 증가)
// 속박된 적을 찌르면 '급소'(큰 피해). 계산은 sim/ian·ianSkills·ianKit
import type { WeaponDef } from "./content";

export const IAN_WEAPONS = {
  /** 집행의 펜 & 강철 실타래: 얇고 긴 자와 칼날이 하나가 된 펜, 인과의 저주가 깃든 강철 실 */
  iaPen: { id: "iaPen", kind: "causality", damageMul: 1.15, attackSpeed: 1.1, range: 60, projectileSpeed: 7, exclusive: "ian" },
} as const satisfies Record<string, WeaponDef>;

/** 이안 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const IAN = {
  /** 기본 3연격 간격 (공격 간격 배율) · 이 틱 동안 안 찌르면 처음으로 */
  stepTime: [0.45, 0.45, 0.85],
  comboGap: 60,
  /** 1·2타 펜 찌르기: 길이 · 맞는 폭(절반) · 피해 배율 */
  thrustLen: 58,
  thrustW: 9,
  thrustMul: 1,
  /** 3타 실 휘감기: 닿는 거리 · 부채꼴 폭(cos) · 피해 배율 · 끌어당김 · 더하는 기록 */
  whipR: 66,
  whipCos: 0.25,
  whipMul: 1.3,
  whipPull: 8,
  whipRec: 2,
  /** 기록: 최대 (차면 속박) · 속박 틱 · 보스 속박 틱 배율 · 속박된 적이 받는 피해 더함 */
  recMax: 5,
  bindTicks: 90,
  bindBoss: 0.5,
  bindTaken: 0.2,
  /** 급소: 속박된 적·그림자 걸음 뒤 첫 공격의 피해 배율 */
  vitalMul: 1.8,
  /** 스킬 대기 틱 (1 인과의 실 · 2 그림자 걸음 · 3 기록 집행 · 4 인과율 속박) */
  cooldowns: [600, 360, 720, 2700],
  /** 1 인과의 실: 빠르기 · 거리 · 폭(절반) · 피해 배율 · 더하는 기록 · 끌어당김 */
  threadSpeed: 10,
  threadRange: 260,
  threadW: 12,
  threadMul: 1.2,
  threadRec: 2,
  threadPull: 10,
  /** 2 그림자 걸음: 돌진 틱 · 한 틱 거리 · 지나가며 찌르는 폭(절반) · 피해 배율 */
  stepTicks: 9,
  stepDist: 12,
  stepW: 20,
  stepMul: 1,
  /** 3 기록 집행: 기록 하나마다 피해 배율 (속박된 적은 기록이 가득 찬 것으로 침) */
  writMul: 0.5,
  /** 4 인과율 속박: 유지 틱 (방의 모든 적 속박) · 그동안 이안이 준 피해 가운데 끝날 때 되돌려 터뜨리는 몫 */
  lawTicks: 300,
  lawDebt: 0.4,
};
