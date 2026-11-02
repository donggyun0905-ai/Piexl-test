// 작업대 창에 보여 줄 값 (gameLoop가 만들어 LoadoutView.station으로 넘김): 아티팩터 제작대 · 추적자 튜닝소 · 단련의 방 · 시련의 비석·보상 상자
import { altarAugOk, altarAugTaken, auctionHere, gambleNow, type AuctionState, altarOf, chestOptions, trialUsed, type AltarId, GYM_OFF, GYM_STATS, gymBlocked, gymPassives, gymUsed, BENCH_OP, benchCan, benchCost, benchLv, benchStats, isHidden, isOwn, TUNE, TUNE_SLOTS, tuneChance, tuneCost, type PassiveId, type RunState, type StationKind, type StationResult } from "@pixel-rogue/shared";

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
  /** 단련의 방: 기구 번호 · 이 방 기구를 썼는지 · 남은 포인트 · 마지막 미니게임 결과 · 항목마다 단계 · 가진 패시브 */
  gym?: { device: number; used: boolean; pts: number; blocked: string[]; oni: boolean; last?: { device: number; score: number; pts: number }; lv: Record<string, number>; passives: PassiveId[] };
  /** 시련의 비석 (이미 썼는지) · 보상 상자 (상자 내용 · 고를 것) */
  trial?: { used: boolean };
  chest?: { code: string; options: string[] };
  /** 제단의 방: 이 방 성좌 · 바칠 패시브가 있는지 */
  altar?: { id: AltarId; passives: number; augTaken: boolean; augOk: boolean };
  /** 비밀의 방: 야바위 (0 시작 전 · 1 고르기 · 2 끝) · 경매 (지금 상태 · 틱 · 증강을 붙일 패시브) */
  gamble?: { phase: number; win?: boolean };
  auction?: { a: AuctionState; tick: number; passives: PassiveId[] };
}

export function stationView(run: RunState): StationView | undefined {
  const pr = run.prompt;
  if (pr.kind !== "station" || !pr.open) return undefined;
  const p = run.player;
  const base = { kind: pr.station, gold: run.gold, ...(p.stLast ? { last: p.stLast } : {}) };
  if (pr.station === "altar") return { ...base, altar: { id: altarOf(run), passives: p.passives.length, augTaken: altarAugTaken(p), augOk: altarAugOk(p) } };
  if (pr.station === "trial") return { ...base, trial: { used: trialUsed(run) } };
  if (pr.station === "gambler") {
    const g = gambleNow(run);
    return { ...base, gamble: { phase: !g ? 0 : g.pick === undefined ? 1 : 2, ...(g?.win !== undefined ? { win: g.win } : {}) } };
  }
  if (pr.station === "auction") {
    const a = auctionHere(run);
    return a ? { ...base, auction: { a: JSON.parse(JSON.stringify(a)) as AuctionState, tick: run.tick, passives: [...p.passives] } } : undefined;
  }
  if (pr.station === "boon") {
    const pk = run.rooms[run.roomId]?.pickups.find((x) => x.id === p.trial?.open);
    return pk ? { ...base, chest: { code: pk.itemId, options: chestOptions(pk.itemId) } } : undefined;
  }
  if (pr.station === "gym") {
    const g = p.gym;
    return { ...base, gym: { device: pr.device ?? 0, used: gymUsed(run), pts: g?.pts ?? 0, blocked: GYM_STATS.filter((k) => !GYM_OFF.includes(k) && gymBlocked(p, k)), oni: p.characterId === "oni", ...(g?.last ? { last: g.last } : {}), lv: { ...(g?.lv ?? {}) }, passives: gymPassives(p) } };
  }
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
