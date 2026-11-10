// 래빗 당근 간식: 처치하면 확률로 체력 회복 (sim/faction factionKill이 부름 · 순환 import를 피하려고 가벼운 것만 불러옴)
import { RABBIT_PERKS as K } from "../itemsRabbit";
import { createRng, deriveSeed } from "../rng";
import { healPlayer } from "./combat";
import type { EnemyState, RunState } from "./types";

/** 처치했을 때: 당근 간식 (네잎클로버면 확률 오름) */
export function rabbitKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (!p.passives.includes("rbCarrot")) return;
  const luck = p.passives.includes("rbClover") ? K.rbClover.mul : 1;
  if (createRng(deriveSeed(s.seed, "rbCarrot", s.tick, e.id)).nextFloat() < K.rbCarrot.chance * luck) healPlayer(s, K.rbCarrot.heal);
}
