// 블루 플레임(새벽의 성흔, 청염의 맹인): 푸른 불꽃(이능력)으로 만든 활. 스킬 없이 성흔 게이지 (공용 weaponsDawn.STIGMA)
// 기본 공격: 푸른 불꽃 활을 당겨 쏨 · 몸 둘레 세 겹 범위(늘 보임): 조준한 쪽 가장 가까운 적이 안쪽이면 불꽃 감옥 · 가운데면 불꽃 기둥 · 바깥이면 화살
// 모든 공격이 청염 상태이상 (보통 화상보다 조금 셈) · 성흔이 가득 차면 열화상 각성: 화면이 까매지고 적만 푸르게 보임 · 몸은 사라지고(무적) 화면 아래 거대한 활로 직접 조준해 폭격
// 계산은 sim/blueFlame·blueFlameKit
import type { WeaponDef } from "./content";

export const BLUE_FLAME_WEAPONS = {
  /** 청염의 활: 시각을 잃은 대신 악마의 기운을 푸른 불꽃으로 느껴 영혼을 태우는 활 */
  bzBow: { id: "bzBow", kind: "blueFire", damageMul: 1, attackSpeed: 1, range: 150, projectileSpeed: 8, exclusive: "blueFlame" },
} as const satisfies Record<string, WeaponDef>;

/** 블루 플레임 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const BLUE_FLAME = {
  /** 기본 공격 간격 배율 (공격 속도 따름) · 조준한 쪽 적을 고르는 부채꼴 (cos, 0.5 = 양옆 60도) */
  shotTime: 1,
  aimCos: 0.5,
  /** 세 겹 범위: 바깥 = 사거리 · 안쪽 · 가운데 경계 (사거리에 대한 비율) */
  ring1: 0.34,
  ring2: 0.67,
  /** 불꽃 감옥 (안쪽): 피해 배율 · 반지름 · 터질 때까지 틱 · 가두는(묶는) 틱 */
  prisonMul: 1.45,
  prisonR: 24,
  prisonDelay: 16,
  prisonRoot: 30,
  /** 불꽃 기둥 (가운데): 피해 배율 · 반지름 · 솟을 때까지 틱 */
  pillarMul: 1.15,
  pillarR: 16,
  pillarDelay: 10,
  /** 화살 (바깥 · 범위 밖이면 조준한 쪽으로): 피해 배율 · 빠르기 */
  arrowMul: 0.9,
  arrowSpeed: 7,
  /** 청염 상태이상: 지속 틱 · 피해 간격 틱 · 한 번 피해 (공격력 배율, 보통 화상 0.25보다 셈) */
  flameTicks: 150,
  flameEvery: 30,
  flameMul: 0.32,
  /** 성흔: 맞힐 때 · 처치 */
  gainHit: 2,
  gainKill: 4,
  /** 열화상 각성: 한 발 간격 배율 (공격 속도 따름) · 거대한 화살 나는 틱 · 폭격 반지름 · 피해 배율 · 끝난 뒤 무적 틱 */
  ultTime: 0.7,
  ultFly: 14,
  ultR: 44,
  ultMul: 2.4,
  ultInv: 30,
  /** 푸른 날개 화살비: 날개가 떠 있는 틱 · 활이 생기고 쏘기 시작까지 틱 · 화살 수 · 쏘는 간격 틱 · 나는 틱 · 피해 배율 · 맞는 반지름 · 떨어지는 앞 거리 (최소·최대) · 옆 퍼짐 */
  wingTicks: 70,
  rainWait: 18,
  rainCount: 7,
  rainGap: 3,
  rainFly: 20,
  rainMul: 0.7,
  rainR: 14,
  rainNear: 40,
  rainFar: 110,
  rainSpread: 34,
};
