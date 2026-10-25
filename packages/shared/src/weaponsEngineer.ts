// 기계공학자 전용. 공격 속도 1당 초당 10/3번 틱 피해 (2 = 0.15초마다), 초당 피해는 다른 무기처럼 공격력 × 공격 속도.
// 무기마다 공격 방식이 다름 (gear, sim/laserWeapons): 포탑 던지기 · 드론 빔 · 번개 · 자력 펄스 · 해머 내려찍기 · 지뢰 던지기 · 위성 포 등
import type { WeaponDef } from "./content";

/** 기계공학자 무기의 공격 방식 (없으면 레이저, sim/laserWeapons) */
export type LaserGear = "turret" | "drone" | "focus" | "cutter" | "tesla" | "magnet" | "hammer" | "reactor" | "mines" | "orbital";

export const ENGINEER_WEAPONS = {
  beamer: { id: "beamer", kind: "laser", damageMul: 1.6, attackSpeed: 2, range: 103, projectileSpeed: 0, exclusive: "engineer" },
  laserturret: { id: "laserturret", kind: "laser", damageMul: 1.4, attackSpeed: 2, range: 98, projectileSpeed: 0, gear: "turret", exclusive: "engineer" },
  mirrordrone: { id: "mirrordrone", kind: "laser", damageMul: 1.4, attackSpeed: 2, range: 103, projectileSpeed: 0, gear: "drone", exclusive: "engineer" },
  focuscannon: { id: "focuscannon", kind: "laser", damageMul: 2.62, attackSpeed: 2, range: 115, projectileSpeed: 0, gear: "focus", exclusive: "engineer" },
  plasmacutter: { id: "plasmacutter", kind: "laser", damageMul: 2.01, attackSpeed: 2, range: 48, projectileSpeed: 0, arcCos: 0.6, gear: "cutter", exclusive: "engineer" },
  teslacoil: { id: "teslacoil", kind: "laser", damageMul: 1.61, attackSpeed: 2, range: 92, projectileSpeed: 0, gear: "tesla", exclusive: "engineer" },
  magnetfield: { id: "magnetfield", kind: "laser", damageMul: 1.71, attackSpeed: 2, range: 69, projectileSpeed: 0, gear: "magnet", moveMul: 0.9, exclusive: "engineer" },
  hydraulichammer: { id: "hydraulichammer", kind: "laser", damageMul: 1.5, attackSpeed: 2, range: 44, projectileSpeed: 0, gear: "hammer", exclusive: "engineer" },
  overreactor: { id: "overreactor", kind: "laser", damageMul: 1.71, attackSpeed: 2, range: 103, projectileSpeed: 0, gear: "reactor", exclusive: "engineer" },
  minelauncher: { id: "minelauncher", kind: "laser", damageMul: 1.61, attackSpeed: 2, range: 109, projectileSpeed: 0, gear: "mines", exclusive: "engineer" },
  orbitalcannon: { id: "orbitalcannon", kind: "laser", damageMul: 1.71, attackSpeed: 2, range: 115, projectileSpeed: 0, gear: "orbital", exclusive: "engineer" },
} as const satisfies Record<string, WeaponDef>;
