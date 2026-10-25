// 원소술사 전용 아이템 (회전체 무기일 때 효과). 효과는 sim/orbit
import type { PassiveDef } from "./items";

export const ELEMENTAL_PASSIVES = {
  /** 공격력 +3, 이동 속도 -0.1 */
  perfectCircle: { id: "perfectCircle", mods: [{ stat: "damage", add: 3 }, { stat: "moveSpeed", add: -0.1 }], exclusive: "elementalist", effect: true },
  /** 맞으면 3초 동안 이동 속도 +30%, 도는 빠르기 2.5배 */
  cleanFreak: { id: "cleanFreak", mods: [], exclusive: "elementalist", effect: true },
  /** 회전체 +1 (여러 개 가질 수 있음) */
  genesis: { id: "genesis", mods: [], exclusive: "elementalist" },
  /** 이웃한 회전체 사이에 전깃줄: 닿아 있는 동안 0.15초마다 피해 (초당 공격력의 30%) */
  electronic: { id: "electronic", mods: [], exclusive: "elementalist", effect: true },
  /** 적 탄이 회전체에 닿으면 30% 확률로 튕겨 나가 적을 맞힘 */
  luckyDeflect: { id: "luckyDeflect", mods: [], exclusive: "elementalist", effect: true },
  /** 새빨간 회전체 하나가 1초마다 유도탄 (공격력 50%) */
  pet: { id: "pet", mods: [], exclusive: "elementalist", effect: true },
  /** 사거리(도는 반경) +10 */
  bigger: { id: "bigger", mods: [{ stat: "range", add: 10 }], exclusive: "elementalist", effect: true },
  /** 도는 빠르기 +30%, 공격 속도 +15% */
  beautiful: { id: "beautiful", mods: [{ stat: "projectileSpeed", mul: 1.3 }, { stat: "attackSpeed", mul: 1.15 }], exclusive: "elementalist", effect: true },
  /** 때릴 때마다 15% 확률로 원소(불·물·풀·땅·번개) 효과 하나 더 */
  flashy: { id: "flashy", mods: [], exclusive: "elementalist", effect: true },
  /** 최대 체력 +80 */
  steadfast: { id: "steadfast", mods: [{ stat: "maxHp", add: 80 }], exclusive: "elementalist", effect: true },
} as const satisfies Record<string, PassiveDef>;
