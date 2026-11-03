// 수집가(테라코어, 시즌 3): 푸른 머리의 무기 수집가. 무기는 기본 검 하나 (잃지 않음) · 수집 무기 30개는 패시브(itemsCollector)로 얻음
// 수집 무기를 하나 얻을 때마다 공격 콤보가 한 칸씩 늘어남 (공격 한 번에 콤보 전체가 짧은 간격으로 이어짐) · 계산은 sim/collector
import type { WeaponDef } from "./content";

export const COLLECTOR_WEAPONS = {
  /** 수집가의 검 (처음 무기, 하나뿐): 앞을 반원으로 벰 · 콤보의 첫 칸 */
  clBlade: { id: "clBlade", kind: "hoard", damageMul: 1, attackSpeed: 1.7, range: 120, projectileSpeed: 4, exclusive: "collector" },
} as const satisfies Record<string, WeaponDef>;

/** 수집가 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const COLLECTOR = {
  /** 기본 검: 닿는 거리 · 부채꼴 cos(0 = 반원) */
  baseReach: 30,
  baseArc: 0,
  /** 콤보: 한 번 공격하면 기본 검 → 수집 무기를 얻은 차례대로 이 틱 간격으로 이어서 (다 끝나면 공격 대기) */
  gap: 5,
  /** 노릴 적을 찾는 거리 (사거리 배율) */
  aim: 1.4,
};
