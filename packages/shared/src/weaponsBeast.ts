// 야수(고양이 수인) 전용. 무기마다 본인 공격 방식(beast)과 데리고 다니는 고양이(pets)가 다름 (sim/beast·pets)
// 고양이는 스스로 가까운 적에게 달려가 할퀴고, 피해는 공격력 기준
import type { WeaponDef } from "./content";

/** swipe 할퀴기 · pounce 덮치기(가까운 적에게 뛰어듦) · yarn 털실(벽에 튕김) · hairball 헤어볼(끈적: 둔화·불탐) · catnip 캣닢 구름(3초 동안 피해) · bell 방울(둘레 기절) */
export type BeastStyle = "swipe" | "pounce" | "yarn" | "hairball" | "catnip" | "bell";
/** cat 고양이 · lion 사자(크고 느리게, 둘레까지 물어뜯음) · shadow 그림자 고양이(적 옆으로 순간이동) */
export type PetKind = "cat" | "lion" | "shadow";

export const BEAST_WEAPONS = {
  claws: { id: "claws", kind: "beast", damageMul: 0.85, attackSpeed: 3.2, range: 22, projectileSpeed: 0, arcCos: 0.3, beast: "swipe", pets: ["cat"], exclusive: "beast" },
  pouncers: { id: "pouncers", kind: "beast", damageMul: 1.5, attackSpeed: 1.6, range: 40, projectileSpeed: 0, beast: "pounce", pets: ["cat"], exclusive: "beast" },
  yarnball: { id: "yarnball", kind: "beast", damageMul: 0.8, attackSpeed: 2.2, range: 120, projectileSpeed: 3, beast: "yarn", pets: ["cat"], exclusive: "beast" },
  catpack: { id: "catpack", kind: "beast", damageMul: 0.5, attackSpeed: 2, range: 22, projectileSpeed: 0, arcCos: 0.3, beast: "swipe", pets: ["cat", "cat", "cat"], exclusive: "beast" },
  lionheart: { id: "lionheart", kind: "beast", damageMul: 0.9, attackSpeed: 2.4, range: 24, projectileSpeed: 0, arcCos: 0.3, beast: "swipe", pets: ["lion"], exclusive: "beast" },
  hairball: { id: "hairball", kind: "beast", damageMul: 0.7, attackSpeed: 1.8, range: 100, projectileSpeed: 2.6, beast: "hairball", pets: ["cat"], exclusive: "beast" },
  catnip: { id: "catnip", kind: "beast", damageMul: 0.35, attackSpeed: 0.7, range: 100, projectileSpeed: 0, beast: "catnip", pets: ["cat"], exclusive: "beast" },
  catbell: { id: "catbell", kind: "beast", damageMul: 1, attackSpeed: 1.2, range: 34, projectileSpeed: 0, beast: "bell", pets: ["cat", "cat"], exclusive: "beast" },
  shadowpaw: { id: "shadowpaw", kind: "beast", damageMul: 0.8, attackSpeed: 3, range: 22, projectileSpeed: 0, arcCos: 0.3, beast: "swipe", pets: ["shadow", "shadow"], exclusive: "beast" },
  tigerclaw: { id: "tigerclaw", kind: "beast", damageMul: 2.2, attackSpeed: 1.3, range: 28, projectileSpeed: 0, arcCos: 0, beast: "swipe", pets: ["cat"], exclusive: "beast" },
} as const satisfies Record<string, WeaponDef>;

/** 덮치기 호랑이 변신: 덮쳐 맞힌 적 하나마다 게이지 +perHit, full이면 거대한 호랑이로 ticks(10초) 동안
 * 추가 체력 hp(먼저 깎임) · 뛰어드는 거리 · 할퀴는 범위 · 피해 배율 · 그리기 크기 배율 */
export const TIGER = { full: 100, perHit: 10, ticks: 600, hp: 50, leap: 64, reach: 34, mul: 1.6, scale: 2.4 };
