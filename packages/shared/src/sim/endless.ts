// 무한 모드 보스방 단계 (1~6층은 보통 판 그대로):
// 7~10층 보스 2마리 · 11~13층 랜덤 라스트 보스 · 14~16층 라스트 보스 + 보스 2마리
// · 17층부터 끝까지 라스트 보스 3종 (라스트 보스방의 2배 방, 라스트 보스가 늘면 층마다 시드로 서로 다른 3종)
// 7층부터 보스방을 깰 때마다 적 체력·주는 피해가 오름 (endlessPow)
import { BOSS_TIERS, LAST_BOSSES, type BossKind } from "../content";
import { createRng, deriveSeed } from "../rng";
import { spawnBoss } from "./bosses";
import { BIG_COLS, BIG_ROWS } from "./rooms";
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 보스 2마리부터 · 라스트 보스부터 · 라스트 보스 + 보스부터 · 라스트 보스 3종부터 (층) */
  PAIR: 7,
  LAST: 11,
  MIXED: 14,
  TRIPLE: 17,
  /** 17층부터 한 번에 나오는 라스트 보스 수 */
  TRIPLE_N: 3,
  /** 7층부터 보스방을 깰 때마다 적 체력·주는 피해 +12% */
  POW: 0.12,
  /** 여럿이 나올 때 한 마리 체력 배율 (2마리 · 3마리 이상) */
  PAIR_HP: 0.85,
  GROUP_HP: 0.75,
};
export { R as ENDLESS_RULES };

const on = (s: RunState, from: number) => !!s.endless && !s.hero && !s.arenaLv && s.floor >= from;

/** 7층부터 보스방을 깬 수만큼 적이 세짐 (체력·주는 피해 배율) */
export function endlessPow(s: RunState): number {
  return on(s, R.PAIR) ? 1 + R.POW * (s.floor - R.PAIR) : 1;
}

/** 보스방 크기: 라스트 보스가 나오면 큰 방, 라스트 보스 3종은 그 2배. 보통이면 null */
export function endlessSize(s: RunState): { cols: number; rows: number } | null {
  if (!on(s, R.LAST)) return null;
  return on(s, R.TRIPLE) ? { cols: BIG_COLS * 2, rows: BIG_ROWS * 2 } : { cols: BIG_COLS, rows: BIG_ROWS };
}

/** 태초의 빛과 어둠이 나오는 큰 방은 상자 벽 (라스트 보스 3종 방은 넓어서 없음) */
export const endlessPrimeval = (s: RunState): boolean => on(s, R.LAST) && !on(s, R.TRIPLE) && endlessLast(s) === "plight";

function endlessLast(s: RunState): BossKind {
  return createRng(deriveSeed(s.seed, "endlessLast", s.floor)).pick(LAST_BOSSES);
}

/** 보스방 적 (7층부터). 보통 판 그대로면 null */
export function endlessBosses(s: RunState): EnemyState[] | null {
  if (!on(s, R.PAIR)) return null;
  const rng = createRng(deriveSeed(s.seed, "endlessBoss", s.floor));
  const pool = [...BOSS_TIERS.flat()];
  const boss = (): BossKind => pool.splice(rng.int(0, pool.length - 1), 1)[0]!;
  // 태초의 빛과 어둠은 늘 둘이 함께
  const last = (k: BossKind): BossKind[] => (k === "plight" ? ["plight", "pdark"] : [k]);
  let kinds: BossKind[];
  if (on(s, R.TRIPLE)) {
    // 라스트 보스 중 서로 다른 3종 (지금은 3종이라 모두)
    const lasts = [...LAST_BOSSES];
    kinds = Array.from({ length: Math.min(R.TRIPLE_N, lasts.length) }, () => lasts.splice(rng.int(0, lasts.length - 1), 1)[0]!).flatMap(last);
  }
  else if (on(s, R.MIXED)) kinds = [...last(endlessLast(s)), boss(), ...(endlessLast(s) === "plight" ? [] : [boss()])];
  else if (on(s, R.LAST)) kinds = last(endlessLast(s));
  else kinds = [boss(), boss()];
  const list = kinds.map((k) => spawnBoss(s, k));
  const mul = (list.length >= 3 ? R.GROUP_HP : list.length === 2 && !kinds.includes("pdark") ? R.PAIR_HP : 1) * endlessPow(s);
  for (const e of list) e.hp = e.maxHp = Math.round(e.maxHp * mul);
  return list;
}
