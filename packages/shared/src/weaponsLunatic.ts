// 루나틱(새벽의 성흔, 월광의 검사 · 집단의 리더): 새하얀 레이피어(세검). 스킬 없이 성흔 게이지 (공용 weaponsDawn.STIGMA)
// 기본 공격: 매우 빠른 찌르기 + 약간 앞으로 돌진 · 달빛이 없어도 약점 공격 30% (sim/moonlight) · 대시하면 지나가는 길의 적을 찌름
// 패시브 '월광 표적': 가끔 적 머리 위에 조준점 → 그 적에게 약점 공격이 터지면 확정 치명타 + 빠른 달빛 베기(달빛 상태이상 피해)
// 성흔이 가득 차면 만월 각성: 공격 속도 증가 · 모든 적이 표적 (약점 공격마다 달빛 베기). 계산은 sim/lunatic·lunaticKit
import type { WeaponDef } from "./content";

export const LUNATIC_WEAPONS = {
  /** 월광의 세검: 달빛처럼 차갑고 아름다운 궤적으로 악마의 급소만 찌르는 새하얀 레이피어 */
  lnRapier: { id: "lnRapier", kind: "moonRapier", damageMul: 1, attackSpeed: 1.5, range: 130, projectileSpeed: 8, exclusive: "lunatic" },
} as const satisfies Record<string, WeaponDef>;

/** 루나틱 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const LUNATIC = {
  /** 찌르기 간격 배율 (공격 속도 따름, 작을수록 빠름) */
  thrustTime: 0.42,
  /** 찌르기: 앞으로 닿는 길이 (사거리 증가 따름) · 폭(반) · 피해 배율 · 밀침 */
  thrustLen: 130,
  thrustW: 9,
  thrustMul: 0.85,
  thrustPush: 1,
  /** 찌를 때 앞으로 조금 돌진하는 거리 (적에게 닿기 전에 멈춤) */
  lunge: 5,
  /** 약점 공격 기본 확률 (달빛이 없어도 · 달빛 스택 확률에 더함) */
  weakBase: 0.3,
  /** 대시 찌르기: 대시 중 몸 둘레 맞는 반지름 · 피해 배율 · 밀침 */
  dashR: 16,
  dashMul: 1.3,
  dashPush: 4,
  /** 월광 표적(조준점): 새로 뜨는 간격 틱 · 떠 있는 틱 · 첫 표적까지 틱 */
  markEvery: 150,
  markTicks: 240,
  markFirst: 60,
  /** 표적 약점 공격 치명타 배율 (약점 추가 피해에 곱함) */
  markCrit: 1.5,
  /** 달빛 베기: 약점 공격 뒤 터지기까지 틱 · 반지름 · 피해 배율(공격력, 확정 치명타) · 거는 달빛 스택 */
  slashDelay: 4,
  slashR: 30,
  slashMul: 2.2,
  slashMoon: 2,
  /** 성흔: 맞힐 때 · 처치 · 달빛 베기 */
  gainHit: 1,
  gainKill: 3,
  gainSlash: 4,
  /** 만월 각성: 공격 속도 배율 · 시작 달빛 폭발 반지름 · 피해 배율 · 잠깐 무적 틱 · 각성 중 달빛 베기 사이 최소 틱 (적마다) */
  awakeSpeed: 1.35,
  awakeR: 70,
  awakeMul: 1.8,
  awakeInv: 30,
  awakeSlashGap: 20,
};
