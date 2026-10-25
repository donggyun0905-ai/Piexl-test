// 거너 전용 총. 탄창(mag)을 다 쓰면 장전(reload틱), 샷건은 쏘면서 한 발씩 장전 (sim/gun)
// 공격 속도 = 초당 발사 수 · 투사체 속도 = 탄 빠르기. 드론은 본인이 쏘지 않고 드론이 쏨
import type { WeaponDef } from "./content";

/**
 * pistol 권총 · sniper 저격총(관통) · shotgun 샷건(부채꼴, 쏘면서 장전) · bayonet 총검(쏠 때 찌르기 + 대시 범위) · dual 쌍권총
 * merc 특수용병(4단 콤보) · smg 기관단총(쏘는 동안 느려짐) · minigun 미니건(2초 예열, 느려짐) · grenade 수류탄(던지면 터짐) · drone 드론(10마리마다 +1)
 */
export type GunStyle = "pistol" | "sniper" | "shotgun" | "bayonet" | "dual" | "merc" | "smg" | "minigun" | "grenade" | "drone";

export const GUNNER_WEAPONS = {
  pistol: { id: "pistol", kind: "gun", damageMul: 1, attackSpeed: 3, range: 120, projectileSpeed: 4.5, gun: "pistol", mag: 8, reload: 72, exclusive: "gunner" },
  sniper: { id: "sniper", kind: "gun", damageMul: 3.5, attackSpeed: 1, range: 200, projectileSpeed: 8, pierce: 5, gun: "sniper", mag: 4, reload: 150, exclusive: "gunner" },
  shotgun: { id: "shotgun", kind: "gun", damageMul: 0.5, attackSpeed: 1.5, range: 80, projectileSpeed: 5, shots: 5, spread: [0.9848, 0.1736], gun: "shotgun", mag: 8, reload: 90, exclusive: "gunner" },
  bayonet: { id: "bayonet", kind: "gun", damageMul: 0.9, attackSpeed: 2.6, range: 110, projectileSpeed: 4.5, gun: "bayonet", mag: 8, reload: 72, exclusive: "gunner" },
  dualpistol: { id: "dualpistol", kind: "gun", damageMul: 0.5, attackSpeed: 3.5, range: 115, projectileSpeed: 4.5, gun: "dual", mag: 16, reload: 84, exclusive: "gunner" },
  mercenary: { id: "mercenary", kind: "gun", damageMul: 1, attackSpeed: 1.75, range: 100, projectileSpeed: 4.5, gun: "merc", exclusive: "gunner" },
  smg: { id: "smg", kind: "gun", damageMul: 0.35, attackSpeed: 9, range: 110, projectileSpeed: 5, gun: "smg", mag: 35, reload: 90, exclusive: "gunner" },
  minigun: { id: "minigun", kind: "gun", damageMul: 0.3, attackSpeed: 12, range: 120, projectileSpeed: 5.5, gun: "minigun", mag: 100, reload: 180, exclusive: "gunner" },
  grenade: { id: "grenade", kind: "gun", damageMul: 3, attackSpeed: 0.8, range: 110, projectileSpeed: 2.5, blast: 40, gun: "grenade", exclusive: "gunner" },
  drone: { id: "drone", kind: "gun", damageMul: 0.8, attackSpeed: 1.5, range: 110, projectileSpeed: 4, gun: "drone", exclusive: "gunner" },
} as const satisfies Record<string, WeaponDef>;
