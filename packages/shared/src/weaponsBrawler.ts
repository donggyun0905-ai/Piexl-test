// 격투가 전용. 공격 키를 누를 때마다 콤보의 다음 기술 (combos), 공격 속도 = 기술 사이 간격. 근접이라 피해를 높게 (0.35.6에서 1.4배, 0.48.126에서 쌍광연격·택견 빼고 1.15배)
import type { WeaponDef } from "./content";

export const BRAWLER_WEAPONS = {
  fist: { id: "fist", kind: "combo", damageMul: 1.61, attackSpeed: 2, range: 28, projectileSpeed: 0, combo: "fist", exclusive: "brawler" },
  boxinggloves: { id: "boxinggloves", kind: "combo", damageMul: 0.72, attackSpeed: 3.2, range: 26, projectileSpeed: 0, combo: "boxing", exclusive: "brawler" },
  kick: { id: "kick", kind: "combo", damageMul: 2.42, attackSpeed: 1.2, range: 30, projectileSpeed: 0, combo: "kick", exclusive: "brawler" },
  muaythai: { id: "muaythai", kind: "combo", damageMul: 0.97, attackSpeed: 3, range: 30, projectileSpeed: 0, combo: "muaythai", exclusive: "brawler" },
  judo: { id: "judo", kind: "combo", damageMul: 1.93, attackSpeed: 2, range: 28, projectileSpeed: 0, combo: "judo", exclusive: "brawler" },
  jiujitsu: { id: "jiujitsu", kind: "combo", damageMul: 0.7, attackSpeed: 2.5, range: 30, projectileSpeed: 0, combo: "jiujitsu", exclusive: "brawler" },
  mma: { id: "mma", kind: "combo", damageMul: 1.61, attackSpeed: 2, range: 30, projectileSpeed: 0, combo: "mma", exclusive: "brawler" },
  karate: { id: "karate", kind: "combo", damageMul: 1.35, attackSpeed: 1.8, range: 40, projectileSpeed: 0, combo: "karate", exclusive: "brawler" },
  taekkyon: { id: "taekkyon", kind: "combo", damageMul: 0.49, attackSpeed: 5, range: 30, projectileSpeed: 0, combo: "taekkyon", exclusive: "brawler" },
  energywave: { id: "energywave", kind: "combo", damageMul: 0.57, attackSpeed: 2, range: 170, projectileSpeed: 3.5, combo: "energy", exclusive: "brawler" },
} as const satisfies Record<string, WeaponDef>;
