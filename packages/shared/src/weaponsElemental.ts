// 원소술사 전용. 몸 둘레를 도는 구슬(회전체)이 닿은 적을 때림 (sim/orbit). 무기마다 구슬 수·도는 반경·특수 공격이 다름
// 공격 속도 = 구슬 하나가 다시 때릴 수 있는 빠르기 · 투사체 속도 = 도는 빠르기 · 사거리 = 도는 반경 (ringR이 있으면 반경은 고정, 사거리는 쏘는 거리)
import type { WeaponDef } from "./content";

/**
 * 원소술사 무기 (sim/orbit): elements 원소구슬 · light 빛 구슬(경직) · galaxy 은하수(따라다니는 장판) · planets 행성 8개
 * blades 웨폰 마스터(검이 날아가 때림) · gravity 중력(둔화·내려찍기) · hand 갓 핸드(잡아 내려찍기) · stars 별똥별(세 겹) · steel 강철 구슬(막기·총알) · trigger 트리거(구슬을 쏨)
 */
export type OrbitKind = "elements" | "light" | "galaxy" | "planets" | "blades" | "gravity" | "hand" | "stars" | "steel" | "trigger";

export const ELEMENTAL_WEAPONS = {
  elemorb: { id: "elemorb", kind: "orbit", damageMul: 1, attackSpeed: 1.6, range: 32, projectileSpeed: 4, orbit: "elements", orbs: 5, exclusive: "elementalist" },
  lightorb: { id: "lightorb", kind: "orbit", damageMul: 0.45, attackSpeed: 3, range: 22, projectileSpeed: 8, orbit: "light", orbs: 4, exclusive: "elementalist" },
  galaxy: { id: "galaxy", kind: "orbit", damageMul: 0.5, attackSpeed: 2, range: 56, projectileSpeed: 1, orbit: "galaxy", orbs: 0, exclusive: "elementalist" },
  planets: { id: "planets", kind: "orbit", damageMul: 2.2, attackSpeed: 0.8, range: 42, projectileSpeed: 1.2, orbit: "planets", orbs: 8, exclusive: "elementalist" },
  bladelord: { id: "bladelord", kind: "orbit", damageMul: 0.35, attackSpeed: 1.2, range: 80, projectileSpeed: 1, orbit: "blades", orbs: 5, ringR: 14, exclusive: "elementalist" },
  gravity: { id: "gravity", kind: "orbit", damageMul: 3.2, attackSpeed: 0.45, range: 60, projectileSpeed: 1, orbit: "gravity", orbs: 0, exclusive: "elementalist" },
  godhand: { id: "godhand", kind: "orbit", damageMul: 2.6, attackSpeed: 0.6, range: 70, projectileSpeed: 1, orbit: "hand", orbs: 0, exclusive: "elementalist" },
  meteors: { id: "meteors", kind: "orbit", damageMul: 0.5, attackSpeed: 2, range: 90, projectileSpeed: 6, orbit: "stars", orbs: 3, ringR: 16, exclusive: "elementalist" },
  steelorb: { id: "steelorb", kind: "orbit", damageMul: 1.4, attackSpeed: 2, range: 110, projectileSpeed: 3, orbit: "steel", orbs: 5, ringR: 20, exclusive: "elementalist" },
  trigger: { id: "trigger", kind: "orbit", damageMul: 0.9, attackSpeed: 2.5, range: 140, projectileSpeed: 3, orbit: "trigger", orbs: 5, ringR: 20, exclusive: "elementalist" },
} as const satisfies Record<string, WeaponDef>;
