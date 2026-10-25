// 이드라(비르디아, 세계수의 아이) 무기: 가이아 하나. 대시 키로 대궁 → 단검 → 방패 → 채찍 차례로 모습이 바뀜 (계산은 sim/idra)
import type { WeaponDef } from "./content";

export const IDRA_WEAPONS = {
  /** 가이아: 사거리는 형태마다 이 값에 곱함 */
  gaia: { id: "gaia", kind: "gaia", damageMul: 1, attackSpeed: 2, range: 100, projectileSpeed: 3.6, exclusive: "idra" },
} as const satisfies Record<string, WeaponDef>;

/** 가이아의 네 모습: 대궁(세계수 대궁) · 단검(우드브레이커) · 방패(가이아 버클러) · 채찍(브라이어 스커지) */
export const GAIA_FORMS = ["bow", "dagger", "shield", "whip"] as const;
export type GaiaForm = (typeof GAIA_FORMS)[number];

/** 이드라 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀 또는 사거리 배율) */
export const IDRA = {
  /** 형태마다: 공격 속도 배율 · 사거리 배율 · 피해 배율 */
  form: {
    bow: { speed: 0.6, reach: 1.5, dmg: 1.8 },
    dagger: { speed: 2.2, reach: 0.26, dmg: 0.6 },
    shield: { speed: 0.8, reach: 0.3, dmg: 1.2 },
    whip: { speed: 1, reach: 0.6, dmg: 1 },
  },
  /** 대궁: 화살이 뚫는 적 수 · 갈래 화살 각도 */
  arrowPierce: 2,
  arrowSpread: 0.2,
  /** 단검: 앞쪽 범위(cos) · 몇 번째마다 우드브레이커 일격 · 그 배율 · 묶는 틱 */
  daggerArc: 0.4,
  breakEvery: 5,
  breakMul: 3,
  breakRoot: 40,
  /** 방패: 범위(cos, 0 = 앞쪽 반원) · 밀침 · 맞힌 적마다 보호막 · 보호막 최대(최대 체력 비율) · 방패 모습일 때 받는 피해 */
  shieldArc: 0,
  shieldPush: 10,
  shieldGain: 2,
  shieldMax: 0.25,
  shieldTaken: 0.7,
  /** 채찍: 폭 · 가시 독(공격력 배율, 0.5초마다) · 독 틱 */
  whipWidth: 8,
  thorn: 0.2,
  thornTicks: 120,
  /** 모습을 바꿀 때 변환 일격: 반경 · 공격력 배율 */
  swapR: 26,
  swapMul: 1,
} as const;
