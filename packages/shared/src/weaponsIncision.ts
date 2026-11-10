// 인시전(새벽의 성흔, 쌍도끼의 도살자 · 광전사): 붉은 쌍도끼. 스킬 없이 성흔 게이지 (공용 weaponsDawn.STIGMA) + 도륙 콤보
// 기본 공격은 쌍도끼 네 박자: 1 오른 도끼 베기 → 2 왼 도끼 베기 (앞 부채꼴 초승달) → 3 쌍도끼 교차 베기 (X자) → 4 회오리 베기 (몸 둘레)
// 도륙 콤보: 맞힌 적마다 +1 · 10마다 공격 속도·피해 증가 · 2초 안 맞히면 끊김 · 맞으면 반으로 · 30마다 다음 공격이 도살 도약(적에게 뛰어들어 내려찍기)
// 대시: 돌진 연참 (지나가는 적을 두 번 벰) · 성흔이 가득 차면 광란 각성 (쌍도끼 강타 · 공격 속도 · 콤보 두 배 · 안 끊김). 계산은 sim/incision·incisionKit
import type { WeaponDef } from "./content";

export const INCISION_WEAPONS = {
  /** 도살자의 쌍도끼: 자비 없이 악마를 찢어발기는 붉은 쌍도끼 */
  icAxes: { id: "icAxes", kind: "twinAxe", damageMul: 1, attackSpeed: 1.3, range: 54, projectileSpeed: 8, exclusive: "incision" },
} as const satisfies Record<string, WeaponDef>;

/** 인시전 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const INCISION = {
  /** 박자 간격 배율 (오른 베기 · 왼 베기 · 교차 · 회오리, 공격 속도 따름) · 공격할 수 있게 된 뒤 이 틱 동안 안 치면 다시 1타부터 */
  stepTime: [0.32, 0.32, 0.45, 0.6],
  comboGap: 50,
  /** 1·2타 베기: 닿는 거리 (사거리 증가 따름) · 부채꼴 폭(cos, 작을수록 넓음) · 피해 배율 · 밀침 */
  slashR: 50,
  slashCos: 0.1,
  slashMul: 0.75,
  slashPush: 0,
  /** 3타 교차 베기: 거리 · 부채꼴 폭(cos) · 피해 배율 · 밀침 */
  crossR: 58,
  crossCos: 0.35,
  crossMul: 1.15,
  crossPush: 1,
  /** 4타 회오리 베기: 몸 둘레 반지름 · 피해 배율 · 밀침 */
  whirlR: 54,
  whirlMul: 1.4,
  whirlPush: 3,
  /** 도륙 콤보: 이 틱 동안 못 맞히면 끊김 · 몇 콤보마다 한 단계 · 단계마다 공격 속도 · 단계마다 피해 · 최대 단계 · 맞으면 남는 비율 · 한 번 휘두를 때 오르는 최대 */
  comboHold: 120,
  comboStep: 10,
  tierSpeed: 0.05,
  tierDmg: 0.04,
  tierMax: 6,
  hitKeep: 0.5,
  swingMax: 4,
  /** 도살 도약: 몇 콤보마다 · 적을 찾는 거리 · 착지 반지름 · 피해 배율 · 기절 틱 · 공중 틱(무적) · 밀침 */
  leapEvery: 30,
  leapRange: 170,
  leapR: 48,
  leapMul: 2.2,
  leapStun: 30,
  leapAir: 18,
  leapPush: 10,
  /** 돌진 연참 (대시): 몸 둘레 맞는 반지름 · 한 번 피해 배율 · 적마다 맞히는 수 · 사이 틱 · 밀침 */
  dashR: 18,
  dashMul: 0.6,
  dashHits: 2,
  dashGap: 5,
  dashPush: 2,
  /** 성흔: 맞힐 때 · 처치 · 도살 도약 */
  gainHit: 1,
  gainKill: 3,
  gainLeap: 8,
  /** 광란 각성: 공격 속도 배율 · 피해 배율 · 콤보 오르는 배율 · 시작 쌍도끼 강타 반지름 · 피해 배율 · 잠깐 무적 틱 */
  awakeSpeed: 1.4,
  awakeDmg: 1.2,
  awakeCombo: 2,
  awakeR: 80,
  awakeMul: 1.8,
  awakeInv: 30,
};
