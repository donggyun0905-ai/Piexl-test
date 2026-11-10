// 인형술사 시체 폭발: 처치하면 확률로 그 자리에 앉은 거대 인형이 놓임 (터지는 건 sim/puppetDolls의 바닥 것)
// sim/faction factionKill이 부름 · 순환 import를 피하려고 가벼운 것만 불러옴
import { PUPPET_PERKS as K } from "../itemsPuppet";
import { createRng, deriveSeed } from "../rng";
import type { EnemyState, RunState } from "./types";

/** 처치했을 때: 시체 폭발 인형 */
export function puppetKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (!p.passives.includes("ppCorpse")) return;
  const spots = (p.ppSpots ??= []);
  if (spots.filter((o) => o.kind === 0).length >= K.ppCorpse.max) return;
  if (createRng(deriveSeed(s.seed, "ppCorpse", s.tick, e.id)).nextFloat() >= K.ppCorpse.chance) return;
  spots.push({ x: e.x, y: e.y, kind: 0, age: 0, life: K.ppCorpse.delay, r: K.ppCorpse.r });
}
