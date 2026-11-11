// 백인장 공용 도우미 (sim/baekinjang·bjDrones·bjVolley·bjProcs·bjSkills·classTaken·novice가 같이 씀): 굴림·한 대·범위·표식
// 가벼운 것만 불러옴 (classTaken·novice가 부름)
import { BJ_PERKS as K } from "../itemsBaekinjang";
import { createRng, deriveSeed } from "../rng";
import type { EnemyState, RunState } from "./types";

type P = RunState["player"];

export const isBaekinjang = (p: P) => p.characterId === "baekinjang";
export const hasBj = (p: P, id: string) => p.passives.includes(id as never);
export const bjAlive = (e: EnemyState) => e.hp > 0 && !e.immune && !e.pwHid;

/** 시드 확률 (굴릴 때마다 다른 값) */
export function bjRoll(s: RunState, tag: string): number {
  const p = s.player;
  p.bjRolls = (p.bjRolls ?? 0) + 1;
  return createRng(deriveSeed(s.seed, tag, s.tick, p.bjRolls)).nextFloat();
}

/** 적안 표식이 붙은 적인지 */
export const bjMarked = (s: RunState, e: EnemyState) => (e.bjMark ?? 0) > s.tick;

/** 표식 붙은 적이 받는 피해 배율 */
export const bjTaken = (s: RunState, e: EnemyState) => (bjMarked(s, e) ? 1 + K.bjEye.taken : 1);

/** 표식 붙은 적이 치명타로 맞을 확률 증가 */
export const bjCritAdd = (s: RunState, e: EnemyState) => (bjMarked(s, e) ? K.bjEye.crit : 0);

/** 가장 가까운 적 (x·y에서 dist 안, 바라보는 쪽을 조금 먼저) */
export function bjNearest(s: RunState, x: number, y: number, dist: number, fx = 0, fy = 0): EnemyState | null {
  let best: EnemyState | null = null;
  let score = Infinity;
  for (const e of s.enemies) {
    if (!bjAlive(e)) continue;
    const dx = e.x - x;
    const dy = e.y - y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > dist + e.r) continue;
    const v = d - (d > 0 ? ((dx * fx + dy * fy) / d) * 40 : 0);
    if (v < score) [best, score] = [e, v];
  }
  return best;
}
