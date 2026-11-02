// 잔영(아스칼론, 시즌 2): 그림자 속 암살자 · 짧은 단검 내려찍기 · 대시로 적 공격을 피하면 슬로우모션 · 그 안에 클릭하면 확정 치명타 연속 베기 · 무기 10개 (계산은 sim/remnant)
import type { WeaponDef } from "./content";

/** 내려찍는 거리 · 내려찍는 넓이(코사인) · 한 번에 찍는 수 · 슬로우모션 틱 · 연속 베기 한 번 피해 배율 · 연속 베기 반경
 *  · 연속 베기 횟수(없으면 3) · 마지막 베기는 몸 둘레 모두 · 같이 던지는 그림자 칼 수 · 독 · 마지막 베기 뒤 터짐(반경 배율) */
export interface PhantomStyle {
  reach: number;
  arc: number;
  hits?: number;
  slow: number;
  flurryMul: number;
  flurryReach: number;
  cuts?: number;
  spin?: boolean;
  throws?: number;
  venom?: number;
  burst?: number;
}

const P = (id: string, damageMul: number, attackSpeed: number, phantom: PhantomStyle) =>
  ({ id, kind: "phantom", damageMul, attackSpeed, range: 90, projectileSpeed: 5, phantom, exclusive: "remnant" }) as const;

export const REMNANT_WEAPONS = {
  /** 잔영 단검 (처음 무기): 짧게 내려찍기 */
  rmDagger: P("rmDagger", 0.9, 2.2, { reach: 20, arc: 0.4, slow: 90, flurryMul: 1.6, flurryReach: 46 }),
  /** 쌍단검: 한 번에 두 번 찍음 */
  rmTwin: P("rmTwin", 0.6, 2, { reach: 20, arc: 0.4, hits: 2, slow: 90, flurryMul: 1.4, flurryReach: 46 }),
  /** 그림자 발톱: 앞을 넓게 찍음 */
  rmClaw: P("rmClaw", 0.8, 2.1, { reach: 22, arc: -0.2, slow: 90, flurryMul: 1.5, flurryReach: 50 }),
  /** 스틸레토: 좁고 깊게 · 연속 베기가 아주 아픔 */
  rmStiletto: P("rmStiletto", 1.2, 1.8, { reach: 26, arc: 0.8, slow: 90, flurryMul: 2.4, flurryReach: 40 }),
  /** 그림자 투척: 찍을 때 그림자 칼 둘을 같이 던짐 */
  rmKunai: P("rmKunai", 0.7, 2, { reach: 20, arc: 0.4, slow: 90, flurryMul: 1.5, flurryReach: 46, throws: 2 }),
  /** 회전 칼날: 연속 베기가 모두 몸 둘레를 벰 */
  rmSpin: P("rmSpin", 0.8, 2.1, { reach: 22, arc: 0, slow: 90, flurryMul: 1.3, flurryReach: 58, spin: true }),
  /** 섬영: 슬로우모션이 2.5초 · 연속 베기 다섯 번 */
  rmFlash: P("rmFlash", 0.8, 2.2, { reach: 20, arc: 0.4, slow: 150, flurryMul: 1.2, flurryReach: 46, cuts: 5 }),
  /** 그림자 낫: 느리지만 연속 베기가 크고 넓음 */
  rmReaper: P("rmReaper", 1.1, 1.6, { reach: 28, arc: 0.2, slow: 90, flurryMul: 1.9, flurryReach: 66 }),
  /** 독니: 찍을 때마다 독 */
  rmFang: P("rmFang", 0.8, 2.2, { reach: 20, arc: 0.4, slow: 90, flurryMul: 1.5, flurryReach: 46, venom: 0.4 }),
  /** 월식: 마지막 베기 뒤 검은 달이 크게 터짐 */
  rmEclipse: P("rmEclipse", 0.9, 2, { reach: 20, arc: 0.4, slow: 90, flurryMul: 1.5, flurryReach: 46, burst: 1.5 }),
} as const satisfies Record<string, WeaponDef>;

/** 잔영 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const REMNANT = {
  /** 슬로우모션 중 적이 쉬는 틱 (일반 적은 네 틱 중 세 틱, 보스는 두 틱 중 한 틱) · 적 탄 빠르기 배율 */
  slowEvery: 4,
  bossEvery: 2,
  shotSlow: 0.25,
  /** 연속 베기 사이 틱 · 베기마다 앞으로 내딛는 거리 · 연속 베기 동안 무적에 더하는 틱 */
  cutGap: 7,
  cutStep: 8,
  cutGuard: 12,
  /** 독: 0.5초마다 피해의 venom배, 이 틱 동안 */
  venomTicks: 120,
  /** 그림자 칼 탄 크기 · 사이 각도 · 피해 배율 */
  throwR: 2,
  throwSpread: 0.2,
  throwMul: 0.6,
};
