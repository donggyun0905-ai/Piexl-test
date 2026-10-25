// 무기 표: 파수꾼·떠돌이·마법사 무기 · 공용 무기(풋내기는 공용 무기 전부) · 업적으로 해금하는 무기 · 풋내기 맨손. content에서 WEAPONS로 합침
import type { WeaponDef } from "./content";

export const BASE_WEAPONS = {
  // 시작 무기
  greatblade: { id: "greatblade", kind: "melee", damageMul: 1.4, attackSpeed: 2.2, range: 32, projectileSpeed: 0, arcCos: 0.5, exclusive: "warden" },
  crossbow: { id: "crossbow", kind: "ranged", damageMul: 1, attackSpeed: 3, range: 120, projectileSpeed: 3.2, exclusive: "drifter" },
  emberstaff: { id: "emberstaff", kind: "ranged", damageMul: 1.1, attackSpeed: 1.8, range: 105, projectileSpeed: 2.4, exclusive: "mage" },
  // 공용
  shortsword: { id: "shortsword", kind: "melee", damageMul: 0.9, attackSpeed: 3.6, range: 20, projectileSpeed: 0, arcCos: 0.3 },
  spear: { id: "spear", kind: "melee", damageMul: 1.2, attackSpeed: 2, range: 36, projectileSpeed: 0, arcCos: 0.85 },
  sling: { id: "sling", kind: "ranged", damageMul: 1.5, attackSpeed: 1.6, range: 100, projectileSpeed: 2.6 },
  repeater: { id: "repeater", kind: "ranged", damageMul: 0.5, attackSpeed: 5.5, range: 90, projectileSpeed: 3.6 },
  // 파수꾼 전용 (근접)
  warhammer: { id: "warhammer", kind: "melee", damageMul: 2.4, attackSpeed: 1.2, range: 28, projectileSpeed: 0, arcCos: 0.2, exclusive: "warden" },
  twinaxes: { id: "twinaxes", kind: "melee", damageMul: 0.75, attackSpeed: 4.4, range: 22, projectileSpeed: 0, arcCos: 0.4, exclusive: "warden" },
  halberd: { id: "halberd", kind: "melee", damageMul: 1.5, attackSpeed: 1.6, range: 42, projectileSpeed: 0, arcCos: 0.7, exclusive: "warden" },
  whirlblade: { id: "whirlblade", kind: "melee", damageMul: 1, attackSpeed: 1.8, range: 26, projectileSpeed: 0, arcCos: -1, exclusive: "warden" },
  broadaxe: { id: "broadaxe", kind: "melee", damageMul: 1.9, attackSpeed: 1.45, range: 30, projectileSpeed: 0, arcCos: 0.3, exclusive: "warden" },
  flail: { id: "flail", kind: "melee", damageMul: 1.3, attackSpeed: 1.3, range: 34, projectileSpeed: 0, arcCos: -1, exclusive: "warden" },
  sabre: { id: "sabre", kind: "melee", damageMul: 1, attackSpeed: 3.2, range: 26, projectileSpeed: 0, arcCos: 0.45, exclusive: "warden" },
  towershield: { id: "towershield", kind: "melee", damageMul: 1.2, attackSpeed: 2.4, range: 20, projectileSpeed: 0, arcCos: 0, exclusive: "warden" },
  runeblade: { id: "runeblade", kind: "melee", damageMul: 1.6, attackSpeed: 2, range: 30, projectileSpeed: 0, arcCos: 0.55, exclusive: "warden" },
  // 떠돌이 전용 (원거리)
  longbow: { id: "longbow", kind: "ranged", damageMul: 1.3, attackSpeed: 2, range: 160, projectileSpeed: 4.2, exclusive: "drifter" },
  shortbow: { id: "shortbow", kind: "ranged", damageMul: 0.7, attackSpeed: 4, range: 100, projectileSpeed: 3.4, exclusive: "drifter" },
  scatterbow: { id: "scatterbow", kind: "ranged", damageMul: 0.6, attackSpeed: 1.8, range: 80, projectileSpeed: 3.4, shots: 3, spread: [0.9659, 0.2588], exclusive: "drifter" },
  arbalest: { id: "arbalest", kind: "ranged", damageMul: 1.4, attackSpeed: 1.5, range: 140, projectileSpeed: 4.5, pierce: 2, exclusive: "drifter" },
  knives: { id: "knives", kind: "ranged", damageMul: 0.55, attackSpeed: 6, range: 75, projectileSpeed: 4, exclusive: "drifter" },
  huntingbow: { id: "huntingbow", kind: "ranged", damageMul: 0.65, attackSpeed: 2.4, range: 130, projectileSpeed: 3.8, shots: 3, spread: [0.9945, 0.1045], exclusive: "drifter" },
  heavycrossbow: { id: "heavycrossbow", kind: "ranged", damageMul: 2.3, attackSpeed: 1, range: 150, projectileSpeed: 5, exclusive: "drifter" },
  chakram: { id: "chakram", kind: "ranged", damageMul: 0.9, attackSpeed: 2.2, range: 95, projectileSpeed: 2.8, pierce: 3, exclusive: "drifter" },
  volleybow: { id: "volleybow", kind: "ranged", damageMul: 0.45, attackSpeed: 1.5, range: 110, projectileSpeed: 3.6, shots: 5, spread: [0.9848, 0.1736], exclusive: "drifter" },
  // 마법사 전용 (마법탄)
  stormstaff: { id: "stormstaff", kind: "ranged", damageMul: 1.7, attackSpeed: 1.1, range: 130, projectileSpeed: 2.8, blast: 28, exclusive: "mage" },
  frostwand: { id: "frostwand", kind: "ranged", damageMul: 0.8, attackSpeed: 3.2, range: 110, projectileSpeed: 3.2, blast: 10, exclusive: "mage" },
  lightningrod: { id: "lightningrod", kind: "ranged", damageMul: 0.9, attackSpeed: 2, range: 140, projectileSpeed: 5, pierce: 4, exclusive: "mage" },
  cometstaff: { id: "cometstaff", kind: "ranged", damageMul: 2.4, attackSpeed: 0.8, range: 120, projectileSpeed: 2, blast: 36, exclusive: "mage" },
  triorb: { id: "triorb", kind: "ranged", damageMul: 0.7, attackSpeed: 1.8, range: 105, projectileSpeed: 2.8, blast: 12, shots: 3, spread: [0.9903, 0.1392], exclusive: "mage" },
  starfall: { id: "starfall", kind: "ranged", damageMul: 0.5, attackSpeed: 1.4, range: 100, projectileSpeed: 2.6, blast: 10, shots: 5, spread: [0.9659, 0.2588], exclusive: "mage" },
  shadowstaff: { id: "shadowstaff", kind: "ranged", damageMul: 1.2, attackSpeed: 1.5, range: 120, projectileSpeed: 3, blast: 14, pierce: 2, exclusive: "mage" },
  flameglove: { id: "flameglove", kind: "ranged", damageMul: 0.6, attackSpeed: 4.5, range: 60, projectileSpeed: 2.6, blast: 12, exclusive: "mage" },
  voidorb: { id: "voidorb", kind: "ranged", damageMul: 1.5, attackSpeed: 1.2, range: 140, projectileSpeed: 1.6, blast: 22, pierce: 2, exclusive: "mage" },
  // 공용 (0.48.0 추가)
  club: { id: "club", kind: "melee", damageMul: 1.6, attackSpeed: 1.4, range: 26, projectileSpeed: 0, arcCos: 0.4 },
  dagger: { id: "dagger", kind: "melee", damageMul: 0.7, attackSpeed: 4.2, range: 18, projectileSpeed: 0, arcCos: 0.5 },
  javelin: { id: "javelin", kind: "ranged", damageMul: 1.6, attackSpeed: 1.2, range: 130, projectileSpeed: 4, pierce: 2 },
  boomerang: { id: "boomerang", kind: "ranged", damageMul: 0.9, attackSpeed: 1.6, range: 90, projectileSpeed: 3, pierce: 3, returns: true },
  // 풋내기 시작 무기 (맨손)
  fists: { id: "fists", kind: "melee", damageMul: 0.8, attackSpeed: 3.2, range: 18, projectileSpeed: 0, arcCos: 0.4, exclusive: "novice" },
  // 업적으로 해금
  glaive: { id: "glaive", kind: "melee", damageMul: 1.1, attackSpeed: 2.6, range: 32, projectileSpeed: 0, arcCos: 0.4 },
  starwand: { id: "starwand", kind: "ranged", damageMul: 1, attackSpeed: 2.4, range: 115, projectileSpeed: 3 },
} as const satisfies Record<string, WeaponDef>;
