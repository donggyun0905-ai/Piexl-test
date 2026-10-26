// 날아가 때리는 회전체: 웨폰 마스터 검(원소마다 때리는 방식이 다름) · 별똥별 바깥 고리 별
// 불: 강하게 3번 연속 · 물: 적을 계속 따라다니며 때림 · 번개: 빠르게 약하게 5번(치명타) · 땅: 아주 세게 한 번 범위 피해 · 풀 검은 날아가지 않고 몸 둘레를 돌며 탄을 막음(orbit·orbitPerks)
import { createRng, deriveSeed } from "../rng";
import { blastAt } from "./combat";
import { orbHit, type OrbBody } from "./orbit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, markCrit } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 다 때린 뒤 잠깐 머무는 틱 · 치명타 배율 · 물 검이 따라가다 돌아오는 거리 배율(사거리 기준) */
  LINGER: 3,
  LEASH: 1.5,
};
export { R as ORBIT_BLADES_RULES };

type Flyer = NonNullable<PlayerState["flyers"]>[number];

/** out 날아가는 틱 · hits 때리는 횟수 · gap 때리는 간격 · back 돌아오는 틱 · mul 한 번 피해 배율 · crit 치명타 확률 · area 범위 피해 반경 */
interface Strike {
  out: number;
  hits: number;
  gap: number;
  back: number;
  mul: number;
  crit?: number;
  area?: number;
}

const STRIKES: Partial<Record<OrbBody["tag"], Strike>> = {
  fire: { out: 9, hits: 3, gap: 8, back: 9, mul: 1.4 },
  water: { out: 12, hits: Infinity, gap: 18, back: 10, mul: 0.7 },
  thunder: { out: 5, hits: 5, gap: 4, back: 5, mul: 0.35, crit: 0.15 },
  earth: { out: 14, hits: 1, gap: 1, back: 12, mul: 3, area: 24 },
};
const DEFAULT: Strike = { out: 9, hits: 1, gap: 1, back: 9, mul: 1 };
export const CRIT_MUL = 1.5;

export const strikeOf = (tag: OrbBody["tag"]): Strike => STRIKES[tag] ?? DEFAULT;

/** 제자리(0)에서 노리는 자리(1)까지 얼마나 갔는지 */
export function flyK(f: Flyer, tag: OrbBody["tag"]): number {
  const st = strikeOf(tag);
  if (f.back === undefined) return Math.min(1, f.t / st.out);
  return Math.min(1, f.back / st.out) * Math.max(0, 1 - (f.t - f.back) / st.back);
}

/** 날아가 때릴 적: 사거리 안에서 이 검·별에 가장 가까운 적 (검·별마다 각자 고름) */
export function pickTarget(s: RunState, b: OrbBody): EnemyState | null {
  const p = s.player;
  let best: EnemyState | null = null;
  let bestD = Infinity;
  for (const e of s.enemies) {
    if (e.hp <= 0) continue;
    const reach = p.stats.range + e.r;
    const near = (e.x - b.x) * (e.x - b.x) + (e.y - b.y) * (e.y - b.y);
    if (dist2(e, p) <= reach * reach && near < bestD) {
      bestD = near;
      best = e;
    }
  }
  return best;
}

/** 날아가는 검·별: 노리는 적을 따라가 정해진 만큼 때리고, 다 돌아오면 끝 */
export function flyStrikers(s: RunState, bodies: OrbBody[], dmg: number): void {
  const p = s.player;
  const keep: Flyer[] = [];
  for (const f of p.flyers ?? []) {
    const b = bodies[f.i];
    if (!b?.striker) continue;
    const st = strikeOf(b.tag);
    const e = s.enemies.find((o) => o.id === f.id && o.hp > 0);
    f.t++;
    if (f.back === undefined) {
      if (e) {
        f.x = e.x;
        f.y = e.y;
      }
      const n = f.n ?? 0;
      if (e && f.t >= st.out && n < st.hits && (f.t - st.out) % st.gap === 0) {
        strike(s, b, f, e, dmg, st);
        f.n = n + 1;
      }
      const leash = (p.stats.range * R.LEASH) ** 2;
      const done = (f.n ?? 0) >= st.hits && f.t >= st.out + (st.hits - 1) * st.gap + R.LINGER;
      if (done || (!e && f.t >= st.out) || (e && dist2(e, p) > leash)) f.back = f.t;
    }
    if (f.back === undefined || f.t - f.back < st.back) keep.push(f);
  }
  p.flyers = keep;
}

function strike(s: RunState, b: OrbBody, f: Flyer, e: EnemyState, dmg: number, st: Strike): void {
  let d = dmg * st.mul;
  if (st.crit && createRng(deriveSeed(s.seed, "bladeCrit", e.id, s.tick)).nextFloat() < st.crit) {
    d *= CRIT_MUL;
    markCrit(s, e);
  }
  addEffect(s, { kind: "streak", x: b.x, y: b.y, dirX: 0, dirY: 0, size: b.tag === "star" ? 0 : 1, maxTicks: 6, toX: f.x, toY: f.y });
  orbHit(s, { ...b, x: f.x, y: f.y }, e, d);
  if (st.area) {
    blastAt(s, f.x, f.y, st.area, d, { exclude: e });
    addEffect(s, { kind: "slam", x: f.x, y: f.y, dirX: 0, dirY: 0, size: st.area, maxTicks: 14 });
  }
}
