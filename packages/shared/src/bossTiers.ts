// 층마다 나오는 보스 (enemyDefs가 커서 나눔, enemyDefs에서 다시 내보냄)
import type { BossKind } from "./enemyDefs";
import { createRng, deriveSeed } from "./rng";

/** 단계마다 나올 수 있는 보스 (1·2층 · 3·4층 · 5·6층) */
export const BOSS_TIERS: readonly (readonly BossKind[])[] = [
  ["hulk", "knight", "archer", "toad", "salamander", "gatekeeper"],
  ["brood", "siren", "centaur", "plant", "jelly", "twinlu"],
  ["seer", "reaper", "swordgod", "archangel", "captain", "mooneater"],
];

/** 층마다 나오는 보스: 그 단계 보스 중 시드로 하나 (무한 모드 7층부터는 모든 보스 중) */
export function bossForFloor(floor: number, seed: number): BossKind {
  const tier = floor > 6 ? BOSS_TIERS.flat() : BOSS_TIERS[Math.min(2, Math.floor((floor - 1) / 2))]!;
  return tier[createRng(deriveSeed(seed, "bossKind", floor)).int(0, tier.length - 1)]!;
}
