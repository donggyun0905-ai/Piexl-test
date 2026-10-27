// 운명의 여행자(히든, 시즌 2): 운명의 활 하나 · 모아 쏘는 강한 한 발 · 모래시계가 뒤집힐 때마다 주사위로 운명(버프·기술·능력)이 바뀜
// 계산은 sim/voyager, 운명 36칸 표는 voyagerFates
import type { WeaponDef } from "./content";

export const VOYAGER_WEAPONS = {
  /** 운명의 활 (처음이자 유일한 무기): 아주 느리지만 모을수록 강한 한 발 */
  vyBow: { id: "vyBow", kind: "fate", damageMul: 1, attackSpeed: 0.5, range: 190, projectileSpeed: 5, exclusive: "voyager" },
} as const satisfies Record<string, WeaponDef>;

/** 운명의 여행자 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const VOYAGER = {
  /** 모래시계가 다 차는 틱 (다 차면 뒤집히며 주사위) */
  glass: 900,
  /** 공격 속도 1일 때 끝까지 모으는 틱 (공격 속도가 느리면 더 오래) · 이만큼은 모아야 쏨 · 쏜 뒤 쉬는 틱 */
  charge: 60,
  minCharge: 0.2,
  rest: 18,
  /** 모은 만큼 피해: 최소 배율 + 끝까지 모으면 더하는 배율 · 끝까지 모으면 한 번 더 곱함 */
  baseMul: 0.6,
  chargeMul: 3.4,
  fullMul: 1.5,
  /** 주사위 눈 하나마다 한 발이 세지는 비율 */
  pip: 0.08,
  /** 모으는 동안 이동 속도 */
  chargeMove: 0.6,
  /** 화살 크기 · 마력 화살 크기 */
  arrowR: 3,
  giantR: 9,
};
