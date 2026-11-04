// 빌드 보상 편향: 가장 많이 가진 꼬리표(buildSets.tagCounts)의 패시브가 보상·상점·여신의 선물에 더 잘 나옴 (수치 buildSetDefs.SET_BIAS)
// 셋 이상 고르는 보상은 한 칸을 늘 다른 꼬리표로 (방향을 바꿀 기회) · 꼬리표가 없거나 세트가 꺼진 모드는 원래 뽑기 그대로
import { SET_BIAS } from "../buildSetDefs";
import type { PassiveId } from "../items";
import { ITEM_TAGS, passiveTag, type ItemTag } from "../itemsTags";
import type { Rng } from "../rng";
import { setsOn, tagCounts } from "./buildSets";
import { pickDistinct } from "./loot";
import type { RunState } from "./types";

/** 편향할 꼬리표와 배율 (가장 많이 가진 것, 같으면 꼬리표 차례가 앞인 것) */
export function biasOf(s: RunState): { tag: ItemTag; mul: number } | null {
  if (!setsOn(s)) return null;
  const n = tagCounts(s.player);
  let best: ItemTag | null = null;
  for (const t of ITEM_TAGS) if (n[t] > 0 && (!best || n[t] > n[best])) best = t;
  return best ? { tag: best, mul: Math.min(SET_BIAS.max, 1 + SET_BIAS.per * n[best]) } : null;
}

/** 무게를 붙여 하나 뽑기 */
function pickOne(rng: Rng, pool: readonly PassiveId[], bias: { tag: ItemTag; mul: number }): PassiveId {
  const w = (id: PassiveId) => (passiveTag(id) === bias.tag ? bias.mul : 1);
  let r = rng.nextFloat() * pool.reduce((a, id) => a + w(id), 0);
  for (const id of pool) if ((r -= w(id)) < 0) return id;
  return pool[pool.length - 1]!;
}

/** 패시브 하나 (상점 진열·새로고침·여신의 선물 칸) */
export function pickPassive(s: RunState, rng: Rng, pool: readonly PassiveId[]): PassiveId {
  const bias = biasOf(s);
  return bias && pool.length > 0 ? pickOne(rng, pool, bias) : rng.pick(pool);
}

/** 서로 다른 패시브 n개 (층 보상 등) · 셋 이상이면 한 칸은 다른 꼬리표 */
export function pickPassives(s: RunState, rng: Rng, pool: readonly PassiveId[], n: number): PassiveId[] {
  const bias = biasOf(s);
  if (!bias) return pickDistinct(rng, pool, n);
  const out: PassiveId[] = [];
  let left = [...pool];
  while (out.length < n && left.length > 0) {
    const id = pickOne(rng, left, bias);
    out.push(id);
    left = left.filter((x) => x !== id);
  }
  const other = left.filter((id) => passiveTag(id) !== bias.tag);
  if (out.length >= 3 && out.every((id) => passiveTag(id) === bias.tag) && other.length > 0) out[out.length - 1] = rng.pick(other);
  return out;
}
