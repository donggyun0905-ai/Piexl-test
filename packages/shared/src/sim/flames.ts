// 불꽃 스택 (라이더 화염 배기 · 붐버 네이팜): 불에 닿을 때마다 x1 → x5까지 쌓여 불 피해가 커짐. 한동안 안 닿으면 사라짐
import type { EnemyState, RunState } from "./types";

/** 최대 스택 · 스택 하나마다 더하는 피해 배율 · 이 틱 동안 안 닿으면 사라짐 */
export const FLAME = { max: 5, per: 0.3, keep: 120 };

/** 지금 쌓인 스택 (화면에 x1~x5) */
export const flameStacks = (s: RunState, e: EnemyState) => (e.flameN && s.tick - (e.flameAt ?? 0) <= FLAME.keep ? e.flameN : 0);

/** 한 스택 쌓고 이번 불 피해 배율을 돌려줌 (x1 = 1배) */
export function addFlame(s: RunState, e: EnemyState): number {
  e.flameN = Math.min(FLAME.max, flameStacks(s, e) + 1);
  e.flameAt = s.tick;
  return 1 + (e.flameN - 1) * FLAME.per;
}
