// 수집가(테라코어, 시즌 3): 푸른 머리의 무기 수집가. 무기는 기본 검 하나 (잃지 않음) · 수집 무기 30개는 패시브(itemsCollector)로 얻음
// 수집 무기를 하나 얻을 때마다 공격 콤보가 한 칸씩 늘어남 (공격할 때마다 한 칸씩, 잠깐 쉬면 처음부터) · 계산은 sim/collector
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
  /** 콤보: 공격할 때마다 한 칸 · 칸 사이 간격 배율(공격 속도 간격 ×, 작을수록 빠름) · 이만큼(틱) 안 누르면 처음부터 · 날아 나간 무기가 등 뒤에서 빠져 있는 틱 */
  pace: 0.6,
  reset: 60,
  out: 14,
  /** 노릴 적을 찾는 거리 (사거리 배율) */
  aim: 1.4,
};
