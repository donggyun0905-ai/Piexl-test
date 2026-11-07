// 블래스트(새벽의 성흔, 폭멸의 탄환): 산탄총 하나. 초근접일수록 센 부채꼴 산탄 · 초근접 처치는 폭멸(몸이 터져 둘레 피해)
// 맞힐수록 성흔(달빛의 힘) 게이지가 차고 가득 차면 달빛 각성 (공용 규칙 weaponsDawn.STIGMA). 계산은 sim/blast
import type { WeaponDef } from "./content";

export const BLAST_WEAPONS = {
  /** 폭멸의 산탄총: 초근접에서 악마의 형체를 날려 버리는 펌프 산탄총 */
  blShotgun: { id: "blShotgun", kind: "blast", damageMul: 1, attackSpeed: 0.9, range: 60, projectileSpeed: 9, exclusive: "blast" },
} as const satisfies Record<string, WeaponDef>;

/** 블래스트 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const BLAST = {
  /** 탄창: 탄 수 · 한 발 쏘는 간격 배율 (공격 속도 따름) · 한 발씩 장전하는 틱 (쏘지 않을 때·탄이 없을 때) · 이 발마다 확정 치명타 (탄창 마지막 발) */
  mag: 5,
  shotTime: 0.6,
  loadTicks: 24,
  critEvery: 5,
  /** 대시 슬로우모션 (로그만): 틱 · 다시 쓰기까지 틱 · 내 이동 배율 · 적이 쉬는 틱(일반 n틱 중 n-1 · 보스 n틱 중 n-1) · 적 탄 빠르기 배율 · 바로 장전되는 파란 탄 수 */
  slowTicks: 120,
  slowCd: 420,
  slowMove: 0.5,
  slowEvery: 3,
  bossEvery: 2,
  shotSlow: 0.4,
  blueN: 4,
  /** 산탄: 닿는 거리 · 부채꼴(cos 이상) · 한 발 피해 배율 */
  reach: 130,
  arcCos: 0.6,
  shotMul: 2.2,
  /** 거리 감쇠: 이 거리 안은 초근접(피해 그대로·크게 밀침) · 끝 거리에서 피해 배율 */
  nearR: 46,
  farMul: 0.35,
  nearPush: 14,
  farPush: 3,
  /** 폭멸: 초근접으로 처치한 적이 터져 둘레 반지름 · 피해 배율 */
  burstR: 42,
  burstMul: 0.6,
  /** 성흔 차는 양: 맞힌 적마다 · 초근접이면 더 · 처치하면 더 */
  gainHit: 4,
  gainNear: 3,
  gainKill: 6,
  /** 달빛 각성 중: 피해 배율 · 거리 배율 · 부채꼴(cos) · 공격 속도 배율 · 같이 나가는 달빛 산탄 수·퍼짐·피해·거리 */
  awakeMul: 1.4,
  awakeReach: 1.25,
  awakeArc: 0.45,
  awakeSpeed: 1.3,
  moonN: 5,
  moonSpread: 0.16,
  moonMul: 0.5,
  moonRange: 220,
  /** 각성하는 순간 둘레 달빛 폭발: 반지름 · 피해 배율 · 무적 틱 */
  awakeBurstR: 90,
  awakeBurstMul: 1.5,
  awakeInv: 30,
};
