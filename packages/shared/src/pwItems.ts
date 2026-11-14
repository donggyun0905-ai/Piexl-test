// 패왕전 전용 사용 아이템 수치 (던전 USE_ITEMS와 따로, 관리자 '패왕전 수치 · 사용 아이템'에서 바꿈). 얼음 시계는 PW 규칙(iceRange·iceRadius 등)
import { USE_ITEMS } from "./items";

export const PW_ITEMS = {
  /** 회복약: 체력 이만큼 회복 (고정 수치) */
  potion: { heal: 40 },
  /** 명약: 최대 체력의 이 비율 회복 */
  elixir: { healRatio: 1 },
  /** 폭탄: 주변 상대에게 피해 · 범위 (던전 45보다 약하게) · 기간토마키아 피해 */
  bomb: { damage: 20, radius: 44 },
  /** 수호부: 피해를 받지 않는 시간 (틱, 60 = 1초) */
  ward: { ticks: 180 },
};

type PwItem = keyof typeof PW_ITEMS;

/** 회복약·명약 회복량: 회복약은 고정 수치, 명약은 최대 체력 비율 */
export function healAmount(pvp: boolean, id: "potion" | "elixir", maxHp: number): number {
  return id === "potion" ? Math.min(maxHp, itemVal(pvp, "potion").heal) : maxHp * itemVal(pvp, "elixir").healRatio;
}

/** 지금 판에 쓰는 사용 아이템 수치 (패왕전이면 PW_ITEMS, 아니면 USE_ITEMS) */
export function itemVal<I extends PwItem>(pvp: boolean, id: I): (typeof PW_ITEMS)[I] {
  return (pvp ? PW_ITEMS[id] : USE_ITEMS[id]) as (typeof PW_ITEMS)[I];
}
