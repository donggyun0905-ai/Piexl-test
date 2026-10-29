// 아티팩터 제작대 (상점 대신, sim/station). 골드를 내고 세 가지를 함
// - 강화: 자기 패시브 하나를 50% 확률로 한 단계 강화 (수치가 단계마다 세짐). 일반 패시브 두 개를 고르면 무작위 자기 패시브 하나로 바꿈 (10% 확률로 히든)
// - 교체: 자기 패시브 → 다른 무작위 자기 패시브 · 일반 패시브 → 다른 무작위 일반 패시브
// - 튜닝: 자기 패시브(히든 아님) 하나를 50% 확률로 무작위 히든 패시브로 · 실패하면 그 패시브가 부서짐
import { ARTIFACTER_HIDDEN, ARTIFACTER_PASSIVES, ARTIFACTER_PERKS } from "../itemsArtifacter";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRng, deriveSeed } from "../rng";
import type { StatMod } from "../stats";
import { recalcStats } from "./items";
import { depth } from "./hero";
import { passivePool } from "./loot";
import type { PlayerState, RunState } from "./types";
import { addEffect } from "./util";
import { stationPay } from "./station";

const R = {
  /** 값 (골드, 층마다 perFloor씩 오름): 강화 · 합치기(일반 둘) · 교체 · 튜닝 */
  upCost: 40,
  fuseCost: 50,
  swapCost: 30,
  tuneCost: 60,
  perFloor: 4,
  /** 강화 성공 · 튜닝 성공 · 합치기에서 히든이 나올 확률 */
  upChance: 0.5,
  tuneChance: 0.5,
  fuseHidden: 0.1,
  /** 강화 한 단계마다 원래 효과의 boost배만큼 더 · 최대 단계 */
  boost: 0.5,
  maxLv: 3,
};
export { R as AF_BENCH_RULES };

/** 작업대 기능 번호 (menu 입력) */
export const BENCH_OP = { up: 1, swap: 2, tune: 3, fuse: 4 } as const;

const OWN = Object.keys(ARTIFACTER_PASSIVES) as PassiveId[];
const HIDDEN: readonly string[] = ARTIFACTER_HIDDEN;
export const isOwn = (id: string) => (OWN as string[]).includes(id);
export const isHidden = (id: string) => HIDDEN.includes(id);
export const benchLv = (p: PlayerState, id: string) => p.benchLv?.[id] ?? 0;

/** 강화 단계를 반영한 아이템 수치 (ARTIFACTER_PERKS 대신 씀). 배율·받는 피해는 1에서, 나머지는 0에서 멀어짐 */
export function afv<I extends keyof typeof ARTIFACTER_PERKS>(p: PlayerState, id: I, key: keyof (typeof ARTIFACTER_PERKS)[I]): number {
  const base = ARTIFACTER_PERKS[id][key] as number;
  const lv = benchLv(p, id);
  if (!lv) return base;
  const neutral = ["mul", "r", "push", "speed", "n", "taken"].includes(String(key)) ? 1 : 0;
  const v = base + (base - neutral) * R.boost * lv;
  return key === "taken" ? Math.max(0.3, v) : v;
}

/** 강화한 능력치 아이템(문신·과부하·무한 회로)의 늘어난 몫 (recalcStats) */
export function benchMods(p: PlayerState): StatMod[] {
  if (!p.benchLv) return [];
  return p.passives.flatMap((id) => {
    const lv = benchLv(p, id);
    if (!lv || !isOwn(id)) return [];
    return (PASSIVES[id].mods as readonly StatMod[]).map((m): StatMod => ({ stat: m.stat, ...(m.add !== undefined ? { add: m.add * R.boost * lv } : {}), ...(m.mul !== undefined ? { mul: 1 + (m.mul - 1) * R.boost * lv } : {}) }));
  });
}

/** 값 (골드) */
export function benchCost(s: RunState, op: number): number {
  const base = op === BENCH_OP.up ? R.upCost : op === BENCH_OP.fuse ? R.fuseCost : op === BENCH_OP.swap ? R.swapCost : R.tuneCost;
  return base + R.perFloor * (depth(s) - 1);
}

/** 이 패시브로 할 수 있는지 (화면 단추도 씀) */
export function benchCan(s: RunState, op: number, id: string | undefined): boolean {
  const p = s.player;
  if (!id) return false;
  if (op === BENCH_OP.up) return isOwn(id) && benchLv(p, id) < R.maxLv;
  if (op === BENCH_OP.swap) return isOwn(id) ? ownPool(p, false).length > 0 : !(PASSIVES[id as PassiveId] as PassiveDef).special && normalPool(s, id).length > 0;
  if (op === BENCH_OP.tune) return isOwn(id) && !isHidden(id) && ownPool(p, true).length > 0;
  if (op === BENCH_OP.fuse) return !isOwn(id) && !(PASSIVES[id as PassiveId] as PassiveDef).special && OWN.some((o) => !p.passives.includes(o));
  return false;
}

/** 아직 없는 자기 패시브 (hidden: 히든만 · 아니면 히든 빼고) */
function ownPool(p: PlayerState, hidden: boolean): PassiveId[] {
  return OWN.filter((id) => isHidden(id) === hidden && !p.passives.includes(id));
}

const normalPool = (s: RunState, not: string) => passivePool(s).filter((id) => !isOwn(id) && id !== not);


/** 결과 남기기 (창 연출) + 제작대 위 효과: 성공 금빛·푸른빛 · 실패 연기 · 파괴 산산조각 */
function result(s: RunState, op: number, ok: 0 | 1 | 2, id?: string): void {
  const p = s.player;
  p.stLast = { op, ok, ...(id ? { id } : {}), tick: s.tick };
  const kind = ok === 1 ? "stOk" : ok === 2 ? "stBreak" : "stFail";
  addEffect(s, { kind, x: p.x, y: p.y - 10, dirX: 0, dirY: 0, size: id && isHidden(id) ? 26 : 18, maxTicks: ok === 2 ? 50 : 40 });
}

/** 제작대 한 번 (i·j: 내 패시브 차례 번호, j는 합치기만) */
export function benchUse(s: RunState, op: number, i: number, j: number): void {
  const p = s.player;
  const id = p.passives[i];
  if (!benchCan(s, op, id)) return;
  if (op === BENCH_OP.fuse && (i === j || !benchCan(s, op, p.passives[j]))) return;
  if (!stationPay(s, "bench", op, benchCost(s, op))) return;
  const n = (p.stN = (p.stN ?? 0) + 1);
  const rng = createRng(deriveSeed(s.seed, "afBench", n));
  const swapAt = (k: number, to: PassiveId) => {
    const old = p.passives[k]!;
    if (p.benchLv) delete p.benchLv[old];
    p.passives[k] = to;
  };
  if (op === BENCH_OP.up) {
    const ok = rng.nextFloat() < R.upChance;
    if (ok) (p.benchLv ??= {})[id!] = benchLv(p, id!) + 1;
    result(s, op, ok ? 1 : 0, id);
  } else if (op === BENCH_OP.swap) {
    const to = rng.pick(isOwn(id!) ? ownPool(p, false) : normalPool(s, id!));
    swapAt(i, to);
    result(s, op, 1, to);
  } else if (op === BENCH_OP.tune) {
    if (rng.nextFloat() < R.tuneChance) {
      const to = rng.pick(ownPool(p, true));
      swapAt(i, to);
      result(s, op, 1, to);
    } else {
      // 실패: 부서짐
      if (p.benchLv) delete p.benchLv[id!];
      p.passives.splice(i, 1);
      result(s, op, 2, id);
    }
  } else {
    // 일반 패시브 둘 → 자기 패시브 하나 (히든은 가끔)
    const hidden = ownPool(p, true);
    const pool = hidden.length && rng.nextFloat() < R.fuseHidden ? hidden : ownPool(p, false);
    const to = pool.length ? rng.pick(pool) : undefined;
    if (!to) return;
    p.passives.splice(Math.max(i, j), 1);
    p.passives.splice(Math.min(i, j), 1, to);
    result(s, op, 1, to);
  }
  recalcStats(s);
}
