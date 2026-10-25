// 광야의 새벽에서만 줄이는 것: 적이 아주 많아 처치할 때마다 생기는 효과가 너무 세지 않게 확률로 (다른 모드는 늘 그대로)
import { createRng, deriveSeed } from "../rng";
import { SWARM } from "../swarmDefs";
import type { RunState } from "./types";

/** 처치 효과가 이번에 생기는지 (광야의 새벽이 아니면 늘 true). label·salt로 효과마다 따로 굴림 */
export function swarmLucky(s: RunState, label: string, salt: number, chance: number = SWARM.limits.killProc): boolean {
  if (!s.swarm) return true;
  return createRng(deriveSeed(s.seed, "swarmLimit", label, s.tick, salt)).nextFloat() < chance;
}
