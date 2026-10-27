// 잔영(아스칼론, 시즌 2): 그림자 속 암살자 · 아주 빠른 단검 공격 · 적 뒤로 순간이동 · 무기 10개 (계산은 sim/remnant)
import type { WeaponDef } from "./content";

/** 베는 거리 · 베는 넓이(코사인, -1이면 사방) · 한 번에 베는 수 · 순간이동 대기(틱) · 뒤에서 친 피해 배율
 *  · 같이 던지는 그림자 칼 수 · 독 · 잔영이 터짐(반경 배율) */
export interface PhantomStyle {
  reach: number;
  arc: number;
  hits: number;
  blinkGap: number;
  backMul: number;
  throws?: number;
  venom?: number;
  burst?: number;
}

const P = (id: string, damageMul: number, attackSpeed: number, range: number, phantom: PhantomStyle) =>
  ({ id, kind: "phantom", damageMul, attackSpeed, range, projectileSpeed: 5, phantom, exclusive: "remnant" }) as const;

export const REMNANT_WEAPONS = {
  /** 잔영 단검 (처음 무기): 빠른 찌르기 */
  rmDagger: P("rmDagger", 0.55, 3, 110, { reach: 26, arc: 0.3, hits: 1, blinkGap: 45, backMul: 1.5 }),
  /** 쌍단검: 한 번에 두 번 벰 */
  rmTwin: P("rmTwin", 0.45, 2.6, 110, { reach: 26, arc: 0.3, hits: 2, blinkGap: 45, backMul: 1.5 }),
  /** 그림자 발톱: 넓게 할큄 */
  rmClaw: P("rmClaw", 0.5, 2.8, 100, { reach: 28, arc: -0.2, hits: 1, blinkGap: 45, backMul: 1.5 }),
  /** 스틸레토: 좁고 깊게, 뒤에서 치면 2.5배 */
  rmStiletto: P("rmStiletto", 0.8, 2.6, 120, { reach: 32, arc: 0.8, hits: 1, blinkGap: 40, backMul: 2.5 }),
  /** 그림자 투척: 벨 때 그림자 칼 셋을 같이 던짐 */
  rmKunai: P("rmKunai", 0.4, 2.4, 140, { reach: 24, arc: 0.3, hits: 1, blinkGap: 50, backMul: 1.5, throws: 3 }),
  /** 회전 칼날: 몸 둘레를 모두 벰 */
  rmSpin: P("rmSpin", 0.45, 2.6, 100, { reach: 24, arc: -1, hits: 1, blinkGap: 45, backMul: 1.5 }),
  /** 섬영: 아주 자주 순간이동 */
  rmFlash: P("rmFlash", 0.55, 2.8, 130, { reach: 26, arc: 0.3, hits: 1, blinkGap: 20, backMul: 1.5 }),
  /** 그림자 낫: 길고 넓게 */
  rmReaper: P("rmReaper", 0.7, 2.2, 110, { reach: 36, arc: 0, hits: 1, blinkGap: 50, backMul: 1.5 }),
  /** 독니: 벨 때마다 독 */
  rmFang: P("rmFang", 0.5, 3, 110, { reach: 26, arc: 0.3, hits: 1, blinkGap: 45, backMul: 1.5, venom: 0.3 }),
  /** 월식: 남긴 잔영이 크게 터짐 */
  rmEclipse: P("rmEclipse", 0.6, 2.6, 120, { reach: 26, arc: 0.3, hits: 1, blinkGap: 40, backMul: 1.5, burst: 1.6 }),
} as const satisfies Record<string, WeaponDef>;

/** 잔영 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const REMNANT = {
  /** 뒤로 순간이동한 뒤 이 틱 동안은 뒤에서 친 것으로 셈 */
  backWindow: 20,
  /** 남긴 잔영: 이 틱 뒤에 그 자리에서 한 번 벰 (반경 · 공격력 배율) */
  echoDelay: 20,
  echoR: 22,
  echoMul: 0.5,
  /** 독: 0.5초마다 피해의 venom배, 이 틱 동안 */
  venomTicks: 120,
  /** 그림자 칼 탄 크기 · 사이 각도 */
  throwR: 2,
  throwSpread: 0.18,
};
