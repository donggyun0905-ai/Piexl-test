// 음양사 전용 부적. 맞힐 때마다 적에게 붙어 세다가 무기마다 추가 효과 (charm, sim/talisman)
import type { WeaponDef } from "./content";

export const MYSTIC_WEAPONS = {
  handcharm: { id: "handcharm", kind: "ranged", damageMul: 0.75, attackSpeed: 2.5, range: 110, projectileSpeed: 3, charm: "ramp", exclusive: "mystic" },
  mightcharm: { id: "mightcharm", kind: "ranged", damageMul: 2, attackSpeed: 1, range: 120, projectileSpeed: 3.2, charm: "smite", exclusive: "mystic" },
  sealcharm: { id: "sealcharm", kind: "ranged", damageMul: 0.6, attackSpeed: 2.2, range: 70, projectileSpeed: 3, charm: "seal", exclusive: "mystic" },
  thundercharm: { id: "thundercharm", kind: "ranged", damageMul: 0.45, attackSpeed: 4.2, range: 120, projectileSpeed: 5.5, charm: "spark", exclusive: "mystic" },
  flamecharm: { id: "flamecharm", kind: "ranged", damageMul: 1.5, attackSpeed: 1.2, range: 75, projectileSpeed: 2.6, charm: "blaze", exclusive: "mystic" },
  frostcharm: { id: "frostcharm", kind: "ranged", damageMul: 1, attackSpeed: 2, range: 110, projectileSpeed: 2, charm: "frost", exclusive: "mystic" },
  blossomcharm: { id: "blossomcharm", kind: "ranged", damageMul: 0.8, attackSpeed: 1.8, range: 130, projectileSpeed: 0.15, pierce: 99, charm: "bloom", exclusive: "mystic" },
  lightcharm: { id: "lightcharm", kind: "ranged", damageMul: 0.8, attackSpeed: 3, range: 125, projectileSpeed: 4.5, charm: "radiant", exclusive: "mystic" },
  darkcharm: { id: "darkcharm", kind: "ranged", damageMul: 0.45, attackSpeed: 1.6, range: 100, projectileSpeed: 3, shots: 5, spread: [0.9848, 0.1736], charm: "shade", exclusive: "mystic" },
  earthcharm: { id: "earthcharm", kind: "ranged", damageMul: 0.9, attackSpeed: 1.5, range: 400, projectileSpeed: 1.6, pierce: 99, charm: "quake", exclusive: "mystic" },
} as const satisfies Record<string, WeaponDef>;
