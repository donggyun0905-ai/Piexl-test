// 블래스트(새벽의 성흔, 폭멸의 탄환): 산탄총 하나. 초근접일수록 센 부채꼴 산탄 · 초근접 처치는 폭멸(몸이 터져 둘레 피해)
// 맞힐수록 성흔(달빛의 힘) 게이지가 차고 가득 차면 달빛 각성 (공용 규칙 weaponsDawn.STIGMA). 계산은 sim/blast
import type { WeaponDef } from "./content";

export const BLAST_WEAPONS = {
  /** 폭멸의 산탄총: 초근접에서 악마의 형체를 날려 버리는 펌프 산탄총 */
  blShotgun: { id: "blShotgun", kind: "blast", damageMul: 1, attackSpeed: 0.9, range: 60, projectileSpeed: 9, exclusive: "blast" },
} as const satisfies Record<string, WeaponDef>;

/** 블래스트 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const BLAST = {
  /** 두 발 쏘고 펌프질: 발마다 공격 간격 배율 (둘째 발 뒤가 펌프) · 공격할 수 있게 된 뒤 이 틱 동안 안 쏘면 첫 발부터 */
  stepTime: [0.75, 1.35],
  stepGap: 50,
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
