// 수집가(테라코어, 시즌 3): 푸른 머리의 무기 수집가. 무기는 기본 검 하나 (잃지 않음) · 수집 무기 30개는 패시브(itemsCollector)로 얻음
// 수집 무기를 하나 얻을 때마다 공격 콤보가 한 칸씩 늘어남 · 계산은 sim/collector
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
  /** 콤보에 쓴 수집 무기가 방 어딘가에 박힘: 박힐 자리를 고를 때 나와 떨어진 거리(최소·최대) */
  stickMin: 50,
  stickMax: 150,
  /** 박힌 무기에 닿았다고 보는 거리 (내 반지름에 더함) · 닿아 발동할 때 피해 배율 */
  touch: 8,
  touchMul: 1.2,
  /** 닿아 발동한 뒤 같은 무기가 다시 콤보에 들어오기까지 틱 (바로 또 박히지 않게) */
  rest: 30,
  /** 노릴 적을 찾는 거리 (사거리 배율) */
  aim: 1.4,
};
