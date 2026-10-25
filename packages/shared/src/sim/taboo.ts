// 금기의 서 계산 도우미: 걸린 수 · 배율 · 능력치 변화 (금기 표는 ../taboo)
import type { StatMod } from "../stats";
import { TABOOS, type TabooId } from "../taboo";
import type { RunState } from "./types";

/** 이 금기를 건 수 (0이면 안 걸림) */
export function tabooN(s: RunState, id: TabooId): number {
  return Math.min(TABOOS[id].max, s.taboo?.[id] ?? 0);
}

/** 건 수 × 한 번마다 바뀌는 양 */
export const tabooSum = (s: RunState, id: TabooId): number => tabooN(s, id) * TABOOS[id].v;
/** 늘리는 배율 (1 + 합) */
export const tabooUp = (s: RunState, id: TabooId): number => 1 + tabooSum(s, id);
/** 줄이는 배율 (1 - 합, 0 아래로는 안 감) */
export const tabooDown = (s: RunState, id: TabooId): number => Math.max(0, 1 - tabooSum(s, id));

/** 내 몸 금기: 최대 체력·공격력·이동·공격 속도·사거리·행운 (items.recalcStats에서 더함) */
export function tabooMods(s: RunState): StatMod[] {
  if (!s.taboo) return [];
  const out: StatMod[] = [];
  const down = (id: TabooId, stat: StatMod["stat"]) => tabooN(s, id) > 0 && out.push({ stat, mul: tabooDown(s, id) });
  down("weakBody", "maxHp");
  down("dullBlade", "damage");
  down("heavyFeet", "moveSpeed");
  down("slowHands", "attackSpeed");
  down("shortReach", "range");
  if (tabooN(s, "lessLuck") > 0) out.push({ stat: "luck", add: -tabooSum(s, "lessLuck") });
  return out;
}

/** 성급한 손: 이번 틱에 적 공격 준비 시간을 한 번 더 줄일지 (정수로 계산, 시드처럼 늘 같음) */
export function furyTick(s: RunState): boolean {
  const k = Math.round(tabooSum(s, "fury") * 100);
  return k > 0 && (s.tick * k) % 100 < k;
}
