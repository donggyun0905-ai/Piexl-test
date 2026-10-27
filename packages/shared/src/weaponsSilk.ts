// 영사(아스칼론, 시즌 2): 실을 다루는 여자 · 실 100가닥을 장전해 아주 빠르게 쏨 · 무기 10개 (계산은 sim/silk)
import type { WeaponDef } from "./content";

/** 한 번에 쏘는 실 수 · 사이 각도 · 찢는 데 드는 얽힘 · 찢기 피해 배율 · 장전 수 · 맞으면 느려짐(틱)
 *  · 실이 남아 계속 벰(하프 현) · 찢을 때 둘레 적을 끌어당김(마리오네트) · 찢긴 적을 감쌈(고치, 멈춤 틱) */
export interface SilkStyle {
  n: number;
  spread: number;
  stacks: number;
  rendMul: number;
  ammo: number;
  slow?: number;
  linger?: boolean;
  pull?: boolean;
  cocoon?: number;
}

const S = (id: string, damageMul: number, attackSpeed: number, range: number, silk: SilkStyle) =>
  ({ id, kind: "thread", damageMul, attackSpeed, range, projectileSpeed: 6, silk, exclusive: "silk" }) as const;

export const SILK_WEAPONS = {
  /** 영사의 실 (처음 무기): 한 가닥씩 아주 빠르게 */
  skThread: S("skThread", 0.25, 6, 160, { n: 1, spread: 0, stacks: 5, rendMul: 2.5, ammo: 100 }),
  /** 쌍실: 두 가닥 */
  skTwin: S("skTwin", 0.2, 5.5, 160, { n: 2, spread: 0.12, stacks: 5, rendMul: 2.5, ammo: 100 }),
  /** 거미줄: 세 가닥을 넓게 */
  skWeb: S("skWeb", 0.2, 4, 150, { n: 3, spread: 0.3, stacks: 5, rendMul: 2.5, ammo: 100 }),
  /** 강철실: 굵고 무거움, 맞으면 느려짐 */
  skSteel: S("skSteel", 0.45, 4.5, 160, { n: 1, spread: 0, stacks: 5, rendMul: 2.5, ammo: 100, slow: 30 }),
  /** 핏빛 실: 찢기 350% */
  skCrimson: S("skCrimson", 0.25, 6, 160, { n: 1, spread: 0, stacks: 5, rendMul: 3.5, ammo: 100 }),
  /** 바늘실: 얽힘 넷이면 찢음 */
  skNeedle: S("skNeedle", 0.22, 6, 160, { n: 1, spread: 0, stacks: 4, rendMul: 2.5, ammo: 100 }),
  /** 하프 현: 쏜 실이 1초 동안 남아 닿는 적을 계속 벰 */
  skHarp: S("skHarp", 0.2, 5, 160, { n: 1, spread: 0, stacks: 5, rendMul: 2.5, ammo: 100, linger: true }),
  /** 큰 실패: 160가닥 장전 */
  skSpool: S("skSpool", 0.25, 6, 160, { n: 1, spread: 0, stacks: 5, rendMul: 2.5, ammo: 160 }),
  /** 마리오네트: 찢을 때 둘레 적을 끌어당기고 얽힘 +1 */
  skMarionette: S("skMarionette", 0.24, 5.5, 160, { n: 1, spread: 0, stacks: 5, rendMul: 2.5, ammo: 100, pull: true }),
  /** 고치: 찢긴 적을 실로 감싸 멈춤 */
  skCocoon: S("skCocoon", 0.25, 5.5, 160, { n: 1, spread: 0, stacks: 5, rendMul: 2.5, ammo: 100, cocoon: 90 }),
} as const satisfies Record<string, WeaponDef>;

/** 영사 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const SILK = {
  /** 실 폭 · 실선이 보이는 틱 */
  width: 3,
  lineTicks: 60,
  /** 장전 틱 (탄창이 비면) */
  reload: 90,
  /** 실을 이만큼 쓸 때마다 노리는 적을 가로지르는 실 연사 (남은 실이 10 이하일 때 쏜 실은 안 셈) · 연사 수 · 사이 틱 · 한 가닥 피해 배율 */
  burstEvery: 30,
  burstLow: 10,
  burstN: 30,
  burstGap: 2,
  burstMul: 0.5,
  /** 하프 현: 남은 실이 베는 간격 */
  lingerGap: 15,
  /** 마리오네트 끌어당기는 범위·거리 */
  pullR: 60,
  pullBy: 20,
  /** 실 한 가닥 피해: 아이템을 뺀 기본 공격력의 이 배율 (공격력 아이템은 찢기·과다출혈만 세짐) */
  threadMul: 0.5,
  /** 실에 맞을 때마다 출혈 스택 하나 (출혈 피해는 그대로) · 다 쌓이면 과다출혈 (공격력 배율) */
  bleedMax: 30,
  overbleedMul: 5,
};
