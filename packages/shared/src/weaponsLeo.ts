// 레오(아스칼론, 영물): 뇌전의 사자. 머리 가운데 보석 하나 · 무기는 뇌전 발톱 하나뿐
// 가까이서는 발톱·물기로 크게, 멀리 있는 적은 보석 낙뢰·사자후로 방 전체를 장악 (계산은 sim/leo, 아이템은 itemsLeo)
import type { WeaponDef } from "./content";

export const LEO_WEAPONS = {
  /** 뇌전 발톱(처음이자 하나뿐인 무기): 앞쪽을 왼발·오른발 번갈아 할큄 · 세 번째마다 번개 물기 */
  leClaw: { id: "leClaw", kind: "lion", damageMul: 1.3, attackSpeed: 2.6, range: 34, projectileSpeed: 0, exclusive: "leo" },
} as const satisfies Record<string, WeaponDef>;

/** 레오 수치 */
export const LEO = {
  /** 발톱 부채꼴 넓이 (1 = 한 줄, 0 = 반원) · 물기 밀침 */
  arcCos: 0.15,
  push: 6,
  /** 번개 물기: 몇 번째 공격마다 · 피해 배율 · 앞으로 얼마나 · 반지름 · 기절 틱 */
  biteEvery: 3,
  biteMul: 2,
  biteAhead: 18,
  biteR: 22,
  biteStun: 14,
  /** 뇌인(번개 표식): 최대 겹 · 남는 틱 · 겹마다 발톱 피해 + */
  markMax: 3,
  markTicks: 300,
  markMul: 0.12,
  /** 전하: 적을 맞힐 때마다 + · 가득(이만큼)이면 사자후 */
  voltHit: 7,
  voltMax: 100,
  /** 사자후: 방 안 모든 적에게 낙뢰 (피해 배율 + 뇌인 겹마다 +) · 기절 틱 */
  roarMul: 2.2,
  roarPerMark: 0.7,
  roarStun: 40,
  /** 보석 낙뢰: 간격(틱) · 피해 배율 (가장 먼 적에게, 뇌인 +1) */
  gemEvery: 150,
  gemMul: 1.6,
};
