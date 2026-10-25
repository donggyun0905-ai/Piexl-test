// 소환술사 전용 무기(채찍): 본인은 채찍으로 앞을 길게 치고, 맞힌 적 수가 summonEvery만큼 쌓이면 무기마다 정해진 소환수가 나옴 (sim/summon·summons)
import type { WeaponDef } from "./content";

/**
 * skeleton 해골 병사(달려가 벰) · imp 임프(거리를 두고 불덩이) · golem 돌 골렘(느리지만 둘레를 크게 내려침) · archer 해골 궁수(관통 화살)
 * flame 불꽃 정령(달려가 터지고 사라짐) · shroom 독버섯(제자리에서 포자, 맞으면 느려짐) · wolf 늑대(빠르게 물어뜯음, 둘씩)
 * fairy 요정(내 둘레를 돌며 유도 별) · bat 박쥐 떼(셋씩, 아주 빠름) · drake 새끼 용(날아다니며 터지는 불덩이)
 */
export type SummonKind = "skeleton" | "imp" | "golem" | "archer" | "flame" | "shroom" | "wolf" | "fairy" | "bat" | "drake";

export const SUMMON_WEAPONS = {
  leatherwhip: { id: "leatherwhip", kind: "summon", damageMul: 0.8, attackSpeed: 2, range: 48, projectileSpeed: 0, arcCos: 0.75, summon: "skeleton", summonEvery: 3, summonMax: 3, exclusive: "summoner" },
  thornwhip: { id: "thornwhip", kind: "summon", damageMul: 0.82, attackSpeed: 2, range: 48, projectileSpeed: 0, arcCos: 0.75, summon: "imp", summonEvery: 3, summonMax: 3, exclusive: "summoner" },
  chainwhip: { id: "chainwhip", kind: "summon", damageMul: 1.15, attackSpeed: 1.5, range: 52, projectileSpeed: 0, arcCos: 0.7, summon: "golem", summonEvery: 5, summonMax: 2, exclusive: "summoner" },
  bonewhip: { id: "bonewhip", kind: "summon", damageMul: 0.82, attackSpeed: 2, range: 48, projectileSpeed: 0, arcCos: 0.75, summon: "archer", summonEvery: 3, summonMax: 3, exclusive: "summoner" },
  flamewhip: { id: "flamewhip", kind: "summon", damageMul: 0.86, attackSpeed: 2.2, range: 46, projectileSpeed: 0, arcCos: 0.75, summon: "flame", summonEvery: 3, summonMax: 4, exclusive: "summoner" },
  vinewhip: { id: "vinewhip", kind: "summon", damageMul: 0.86, attackSpeed: 2, range: 50, projectileSpeed: 0, arcCos: 0.7, summon: "shroom", summonEvery: 3, summonMax: 4, exclusive: "summoner" },
  shadowwhip: { id: "shadowwhip", kind: "summon", damageMul: 0.82, attackSpeed: 2.2, range: 48, projectileSpeed: 0, arcCos: 0.75, summon: "wolf", summonEvery: 4, summonMax: 4, exclusive: "summoner" },
  starwhip: { id: "starwhip", kind: "summon", damageMul: 0.77, attackSpeed: 2.2, range: 48, projectileSpeed: 0, arcCos: 0.75, summon: "fairy", summonEvery: 3, summonMax: 3, exclusive: "summoner" },
  stormwhip: { id: "stormwhip", kind: "summon", damageMul: 0.82, attackSpeed: 2.4, range: 46, projectileSpeed: 0, arcCos: 0.75, summon: "bat", summonEvery: 4, summonMax: 6, exclusive: "summoner" },
  dragonwhip: { id: "dragonwhip", kind: "summon", damageMul: 0.96, attackSpeed: 1.8, range: 52, projectileSpeed: 0, arcCos: 0.7, summon: "drake", summonEvery: 6, summonMax: 1, exclusive: "summoner" },
} as const satisfies Record<string, WeaponDef>;

/** 소환수마다: 피해 배율 · 공격 간격(틱) · 빠르기 · 크기 · 공격 거리 · 한 번에 나오는 수 */
export interface SummonStat {
  dmg: number;
  every: number;
  speed: number;
  r: number;
  reach: number;
  count: number;
}

export const SUMMON_STATS: Record<SummonKind, SummonStat> = {
  skeleton: { dmg: 0.62, every: 48, speed: 1, r: 4, reach: 10, count: 1 },
  imp: { dmg: 0.7, every: 60, speed: 0.9, r: 3, reach: 70, count: 1 },
  golem: { dmg: 1.41, every: 90, speed: 0.5, r: 6, reach: 14, count: 1 },
  archer: { dmg: 0.56, every: 54, speed: 0.8, r: 4, reach: 100, count: 1 },
  flame: { dmg: 1.22, every: 1, speed: 1.4, r: 3, reach: 6, count: 1 },
  shroom: { dmg: 0.38, every: 48, speed: 0, r: 4, reach: 80, count: 1 },
  wolf: { dmg: 0.36, every: 30, speed: 1.6, r: 4, reach: 8, count: 2 },
  fairy: { dmg: 0.42, every: 42, speed: 1.2, r: 2, reach: 100, count: 1 },
  bat: { dmg: 0.19, every: 24, speed: 2, r: 2, reach: 6, count: 3 },
  drake: { dmg: 1.69, every: 60, speed: 1, r: 6, reach: 90, count: 1 },
};
