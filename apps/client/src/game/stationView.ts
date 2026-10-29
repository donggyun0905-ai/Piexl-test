// 작업대 창에 보여 줄 값 (gameLoop가 만들어 LoadoutView.station으로 넘김): 아티팩터 제작대 · 추적자 튜닝소
import { BENCH_OP, benchCan, benchCost, benchLv, benchStats, isHidden, isOwn, TUNE, TUNE_SLOTS, tuneChance, tuneCost, type PassiveId, type RunState, type StationKind, type StationResult } from "@pixel-rogue/shared";

export interface BenchItem {
  id: PassiveId;
  own: boolean;
  hidden: boolean;
  lv: number;
  /** 강화로 바뀐 수치: [이름, 원래, 지금] */
  stats: [string, number, number][];
  /** 기능마다 할 수 있는지 (up · swap · tune · fuse) */
  can: [boolean, boolean, boolean, boolean];
}

export interface TuneSlotView {
  part: number;
  lv: number;
  chance: number;
  upCost: number;
  swapCost: number;
  max: boolean;
}

export interface StationView {
  kind: StationKind;
  gold: number;
  /** 제작대: 내 패시브 차례대로 · 기능마다 값 (up · swap · tune · fuse) */
  items?: BenchItem[];
  costs?: [number, number, number, number];
  /** 튜닝소: 부위마다 */
  slots?: TuneSlotView[];
  last?: StationResult;
}

export function stationView(run: RunState): StationView | undefined {
  const pr = run.prompt;
  if (pr.kind !== "station" || !pr.open) return undefined;
  const p = run.player;
  const base = { kind: pr.station, gold: run.gold, ...(p.stLast ? { last: p.stLast } : {}) };
  if (pr.station === "bench") {
    const ops = [BENCH_OP.up, BENCH_OP.swap, BENCH_OP.tune, BENCH_OP.fuse] as const;
    return {
      ...base,
      items: p.passives.map((id) => ({ id, own: isOwn(id), hidden: isHidden(id), lv: benchLv(p, id), stats: benchStats(p, id), can: ops.map((op) => benchCan(run, op, id)) as BenchItem["can"] })),
      costs: ops.map((op) => benchCost(run, op)) as StationView["costs"],
    };
  }
  return {
    ...base,
    slots: TUNE_SLOTS.map((_, i) => {
      const lv = p.trLv?.[i] ?? 0;
      return { part: p.trParts?.[i] ?? 0, lv, chance: tuneChance(lv), upCost: tuneCost(run, true, i), swapCost: tuneCost(run, false, i), max: lv >= TUNE.maxLv };
    }),
  };
}
