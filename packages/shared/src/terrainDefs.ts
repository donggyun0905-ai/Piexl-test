// 던전 지형 (sim/terrain): 층 보스마다 그 층 방에 깔리는 진흙 · 용암 · 얕은 물 · 가시 함정 수 · 수치
import type { BossKind } from "./enemyDefs";

export type TerrainKind = "mud" | "lava" | "water" | "spikes";

/** 방 하나에 놓는 지형 덩어리 수 (전투방·강한 적 방·보스방) */
export const TERRAIN_BY_BOSS: Partial<Record<BossKind, Partial<Record<TerrainKind, number>>>> = {
  // 시즌 2 새 보스 층
  toad: { mud: 3, water: 2 },
  salamander: { lava: 3, spikes: 1 },
  jelly: { water: 4 },
  captain: { water: 2, spikes: 2 },
  // 원래 보스 층에도 컨셉에 맞게 조금씩
  plant: { mud: 2 },
  brood: { mud: 1, spikes: 1 },
  siren: { water: 2 },
  centaur: { mud: 1 },
  hulk: { spikes: 1 },
  reaper: { spikes: 2 },
  swordgod: { spikes: 1 },
};

export const TERRAIN = {
  /** 진흙: 움직임 배율 · 얕은 물: 움직임 배율 */
  mudSlow: 0.55,
  waterSlow: 0.8,
  /** 용암: 몇 틱마다 · 피해(층 세기에 더함) */
  lavaEvery: 30,
  lavaDamage: 3,
  /** 가시 함정: 한 바퀴 틱 · 솟기 전 예고 틱 · 솟아 있는 틱 · 피해 */
  spikeCycle: 150,
  spikeWarn: 40,
  spikeUp: 30,
  spikeDamage: 6,
  /** 감전된 물: 몇 틱마다 피해 · 피해 */
  shockEvery: 20,
  shockDamage: 5,
  /** 덩어리 크기 (칸): 너비 · 높이 범위 */
  minW: 2,
  maxW: 4,
  minH: 2,
  maxH: 3,
};
