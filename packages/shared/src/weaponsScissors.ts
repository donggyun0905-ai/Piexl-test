// 시저스(새벽의 성흔, 단죄의 가위): 거대한 쌍가위 하나. 스킬 없이 성흔 게이지 (공용 weaponsDawn.STIGMA)
// 기본 공격은 가위질 두 박자: 열기(넓게 휘두름) → 닫기(앞에서 두 날이 맞물리는 X자 절단, 맞힌 적에게 운명의 실을 묶음)
// 운명의 실: 나와 적을 잇는 붉은 실 · 대시하면 묶인 실을 모두 끊어 그 적을 벰 (멀어서 팽팽할수록 셈 · 실이 지나는 적도 벰)
// 단죄: 체력이 적게 남은 적은 닫기·실 끊기로 목을 잘라 바로 처치 (보스는 크게 더 아픔). 계산은 sim/scissors·scissorsKit
import type { WeaponDef } from "./content";

export const SCISSORS_WEAPONS = {
  /** 단죄의 쌍가위: 악마의 목과 운명의 실을 서슴없이 잘라 버리는 거대한 가위 두 자루 */
  sxShears: { id: "sxShears", kind: "shears", damageMul: 1, attackSpeed: 1, range: 56, projectileSpeed: 8, exclusive: "scissors" },
} as const satisfies Record<string, WeaponDef>;

/** 시저스 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const SCISSORS = {
  /** 가위질 간격 배율 (열기 · 닫기, 공격 속도 따름) · 공격할 수 있게 된 뒤 이 틱 동안 안 치면 다시 열기부터 */
  stepTime: [0.7, 1],
  comboGap: 50,
  /** 열기: 닿는 거리 · 부채꼴 폭(cos) · 피해 배율 · 밀침 */
  openR: 52,
  openCos: -0.2,
  openMul: 0.8,
  openPush: 3,
  /** 닫기: 닿는 거리 · 부채꼴 폭(cos) · 피해 배율 · 밀침 */
  closeR: 60,
  closeCos: 0.45,
  closeMul: 1.5,
  closePush: 6,
  /** 운명의 실: 최대 수 · 유지 틱 · 팽팽해지기 시작하는 거리 · 가장 팽팽한 거리 */
  threadMax: 6,
  threadTicks: 480,
  slackAt: 60,
  tautAt: 180,
  /** 실 끊기(대시): 기본 피해 배율 · 가장 팽팽할 때 더하는 배율 · 실이 지나는 적 피해 배율 · 실 굵기(적 크기에 더함) */
  cutMul: 0.8,
  cutTaut: 1.7,
  lineMul: 0.5,
  lineW: 6,
  /** 단죄: 이 체력 비율 이하인 보통 적은 목을 잘라 처치 · 보스는 이 비율 이하일 때 피해 배율 */
  execAt: 0.2,
  bossAt: 0.3,
  bossMul: 1.4,
  /** 성흔: 열기로 맞힌 적마다 · 닫기로 맞힌 적마다 · 끊은 실마다 · 단죄 */
  gainOpen: 2,
  gainClose: 4,
  gainCut: 5,
  gainExec: 10,
  /** 달빛 각성: 피해 배율 · 가위 거리 배율 · 저절로 실을 끊는 틱 · 각성 순간 달빛 폭발 반지름 · 피해 배율 · 무적 틱 */
  awakeMul: 1.3,
  awakeReach: 1.35,
  awakeSnip: 90,
  awakeBurstR: 90,
  awakeBurstMul: 1.5,
  awakeInv: 30,
};
