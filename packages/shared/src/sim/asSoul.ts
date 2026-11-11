// 아수라 혼백 흡수: 처치하면 확률로 체력 회복 (sim/faction factionKill이 부름 · 순환 import를 피하려고 따로 둠)
import { ASURA_PERKS as K } from "../itemsAsura";
import { createRng, deriveSeed } from "../rng";
import { healPlayer } from "./combat";
import type { EnemyState, RunState } from "./types";

/** 처치했을 때: 혼백 흡수 */
export function asuraKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (p.characterId !== "asura" || !p.passives.includes("asSoul")) return;
  if (createRng(deriveSeed(s.seed, "asSoul", s.tick, e.id)).nextFloat() < K.asSoul.chance) healPlayer(s, K.asSoul.heal);
}
