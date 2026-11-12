// 날아가 때리는 회전체: 웨폰 마스터 검(원소마다 때리는 방식이 다름) · 별똥별 바깥 고리 별
// 웨폰 마스터 검은 자유롭게 날아다님: 휘어지며 날아가 적을 꿰뚫고 지나쳐, 크게 돌아 다시 꿰뚫기를 되풀이한 뒤 돌아옴 (꿰뚫을 때마다 다음 적을 노림)
// 불: 세게 3번 · 물: 약하게 여러 번 · 번개: 빠르게 약하게 5번(치명타) · 땅·풀 검은 날아가지 않고 몸 둘레를 돌며 탄을 막음(orbit·orbitPerks)
import { createRng, deriveSeed } from "../rng";
import { blastAt as blastAt_ } from "./combat";
import { orbHit, type OrbBody } from "./orbit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, markCrit, normalize } from "./util";
import { srcFn, srcEach } from "./dmgSrc";
const blastAt = srcFn("orbitBlades", () => blastAt_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 다 때린 뒤 잠깐 머무는 틱 · 치명타 배율 · 물 검이 따라가다 돌아오는 거리 배율(사거리 기준) */
  LINGER: 3,
  LEASH: 1.5,
  /** 웨폰 마스터 검 날기: 빠르기 · 한 틱에 꺾이는 각도(라디안, 작을수록 크게 휘어 돌아옴) · 오래 날 수 있는 틱 · 같은 적을 다시 꿰뚫기까지 틱 · 꿰뚫는 폭 · 제자리에 닿았다고 보는 거리 · 물 검 최대 꿰뚫기 */
  BLADE_SPEED: 3.6,
  BLADE_TURN: 0.16,
  BLADE_LIFE: 300,
  BLADE_GAP: 16,
  BLADE_HIT: 6,
  BLADE_HOME: 6,
  WATER_HITS: 8,
  /** 적과 이만큼 가까우면 꺾지 않고 곧게 날아감 */
  BLADE_STRAIGHT: 22,
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
    if (e.hp <= 0 || e.immune) continue;
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
  for (const f of srcEach(p.flyers ?? [])) {
    const b = bodies[f.i];
    if (!b?.striker) continue;
    const st = strikeOf(b.tag);
    if (b.tag !== "star") {
      if (bladeFlight(s, f, b, dmg, st)) keep.push(f);
      continue;
    }
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

/** 다음에 노릴 적: 사거리 1.5배 안에서 검에 가까운 적 (방금 꿰뚫은 적은 되도록 빼고) */
function nextTarget(s: RunState, x: number, y: number, skip?: number): EnemyState | null {
  const p = s.player;
  const reach = p.stats.range * R.LEASH;
  let best: EnemyState | null = null;
  let bestD = Infinity;
  for (const e of s.enemies) {
    if (e.hp <= 0 || e.immune || dist2(e, p) > (reach + e.r) ** 2) continue;
    const d = (e.x - x) ** 2 + (e.y - y) ** 2 + (e.id === skip ? 1e6 : 0);
    if (d < bestD) {
      bestD = d;
      best = e;
    }
  }
  return best;
}

/** 날아가는 방향(길이 1)을 노리는 쪽으로 한 틱만큼 돌림 (삼각함수 없이 테일러 급수, 기기마다 같은 결과) */
function steer(vx: number, vy: number, want: readonly [number, number]): [number, number] {
  const cross = vx * want[1] - vy * want[0];
  const dot = vx * want[0] + vy * want[1];
  if (cross * cross < 1e-6 && dot > 0) return [vx, vy];
  const a = R.BLADE_TURN * (cross >= 0 ? 1 : -1);
  const c = 1 - (a * a) / 2 + (a * a * a * a) / 24;
  const sn = a - (a * a * a) / 6 + (a * a * a * a * a) / 120;
  return [vx * c - vy * sn, vx * sn + vy * c];
}

/** 웨폰 마스터 검 한 틱: 노리는 쪽으로 조금씩 꺾이며 날아감(지나치면 크게 돌아옴) · 닿은 적을 꿰뚫음 · 다 하면 제자리로. 계속 날면 true */
function bladeFlight(s: RunState, f: Flyer, b: OrbBody, dmg: number, st: Strike): boolean {
  const p = s.player;
  const homeX = b.homeX ?? b.x;
  const homeY = b.homeY ?? b.y;
  if (f.px === undefined) {
    f.px = homeX;
    f.py = homeY;
    const d = normalize(f.x - homeX, f.y - homeY) ?? [0, -1];
    f.vx = d[0] * R.BLADE_SPEED;
    f.vy = d[1] * R.BLADE_SPEED;
  }
  f.t++;
  const hits = st.hits === Infinity ? R.WATER_HITS : st.hits;
  let e = s.enemies.find((o) => o.id === f.id && o.hp > 0) ?? null;
  const done = (f.n ?? 0) >= hits || f.t > R.BLADE_LIFE || dist2({ x: f.px, y: f.py! }, p) > (p.stats.range * 2.5) ** 2;
  if (!done && !e && (e = nextTarget(s, f.px, f.py!))) f.id = e.id;
  const goal = !done && e ? e : { x: homeX, y: homeY };
  if (done || !e) {
    // 돌아오는 길: 제자리에 닿으면 끝
    if ((goal.x - f.px) ** 2 + (goal.y - f.py!) ** 2 < R.BLADE_HOME ** 2) return false;
  }
  const want = normalize(goal.x - f.px, goal.y - f.py!) ?? [0, 0];
  // 돌아올 때는 곧장 · 날 때는 조금씩 꺾임 (지나치면 크게 돌아옴)
  // 적 가까이에서는 꺾지 않고 곧게 꿰뚫고 지나감 (적 둘레를 맴돌지 않게)
  const near = (goal.x - f.px) ** 2 + (goal.y - f.py!) ** 2 < R.BLADE_STRAIGHT ** 2;
  const v: readonly [number, number] = done || !e ? want : near ? ([f.vx! / R.BLADE_SPEED, f.vy! / R.BLADE_SPEED] as const) : steer(f.vx! / R.BLADE_SPEED, f.vy! / R.BLADE_SPEED, want);
  f.vx = v[0] * R.BLADE_SPEED;
  f.vy = v[1] * R.BLADE_SPEED;
  f.px += f.vx;
  f.py = f.py! + f.vy;
  if (done) return true;
  // 꿰뚫기: 검이 닿은 적 (같은 적은 잠깐 뒤에 다시)
  for (const o of s.enemies) {
    if (o.hp <= 0 || (o.x - f.px) ** 2 + (o.y - f.py) ** 2 > (o.r + R.BLADE_HIT) ** 2) continue;
    if (o.id === f.lastId && f.t - (f.lastT ?? 0) < R.BLADE_GAP) continue;
    f.x = f.px;
    f.y = f.py;
    strike(s, b, f, o, dmg, st);
    f.n = (f.n ?? 0) + 1;
    f.lastId = o.id;
    f.lastT = f.t;
    // 다음엔 다른 적을 노림 (없으면 같은 적을 한 바퀴 돌아 다시)
    f.id = nextTarget(s, f.px, f.py, o.id)?.id ?? o.id;
  }
  return true;
}
