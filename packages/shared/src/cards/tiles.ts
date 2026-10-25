// 숫자 타일: 1~13 숫자 타일 4색 × 2벌. 같은 숫자·다른 색 3~4개(무리) 또는 같은 색 연속 숫자 3개 이상(줄)을 내려놓음.
// 바닥 묶음에 타일을 붙일 수도 있고, 바닥 타일을 빌려 와 내 타일과 새 묶음을 만들 수도 있음
// (빌려 간 뒤 남은 바닥 묶음도 맞아야 함. 줄 가운데를 빼면 두 줄로 나뉨). 손의 타일을 먼저 다 내면 이김
import type { Rng } from "../rng";
import { shuffleWith, type GameRules } from "./types";

export interface Tile {
  id: number;
  n: number;
  /** 0 빨강 · 1 파랑 · 2 검정 · 3 주황 */
  c: number;
}
export const TILE_COLORS = ["#e0303a", "#2a6ad0", "#2a2a34", "#e88a10"];
export const TILE_HAND = 14;

export function newBag(rng: Rng): Tile[] {
  const out: Tile[] = [];
  for (let k = 0; k < 2; k++) for (let c = 0; c < 4; c++) for (let n = 1; n <= 13; n++) out.push({ id: out.length, n, c });
  return shuffleWith(rng, out);
}

/** 묶음이 맞는지 (무리 또는 줄) */
export function validMeld(tiles: readonly Tile[]): boolean {
  if (tiles.length < 3) return false;
  const nums = new Set(tiles.map((t) => t.n));
  const cols = new Set(tiles.map((t) => t.c));
  if (nums.size === 1 && cols.size === tiles.length && tiles.length <= 4) return true;
  if (cols.size !== 1) return false;
  const s = [...tiles].sort((a, b) => a.n - b.n);
  return s.every((t, i) => i === 0 || t.n === s[i - 1]!.n + 1);
}

export const sortMeld = (m: readonly Tile[]) => [...m].sort((a, b) => a.n - b.n || a.c - b.c);
export const sortHand = (h: readonly Tile[]) => [...h].sort((a, b) => a.c - b.c || a.n - b.n);

/** 손에서 낼 수 있는 묶음 하나 찾기 (긴 줄 먼저, 다음 무리) */
export function findMeld(hand: readonly Tile[]): Tile[] | null {
  for (let c = 0; c < 4; c++) {
    const byN = new Map<number, Tile>();
    for (const t of hand) if (t.c === c && !byN.has(t.n)) byN.set(t.n, t);
    let run: Tile[] = [];
    let best: Tile[] = [];
    for (let n = 1; n <= 14; n++) {
      const t = byN.get(n);
      if (t) run.push(t);
      else {
        if (run.length > best.length) best = run;
        run = [];
      }
    }
    if (best.length >= 3) return best;
  }
  for (let n = 13; n >= 1; n--) {
    const seen = new Map<number, Tile>();
    for (const t of hand) if (t.n === n && !seen.has(t.c)) seen.set(t.c, t);
    if (seen.size >= 3) return [...seen.values()];
  }
  return null;
}

/** 묶음에서 타일을 빼고 남는 묶음들 (없음 · 그대로 · 줄이 둘로 나뉨). 남은 게 맞지 않으면 null */
export function afterTake(meld: readonly Tile[], ids: ReadonlySet<number>): Tile[][] | null {
  const rest = meld.filter((t) => !ids.has(t.id));
  if (rest.length === 0) return [];
  if (validMeld(rest)) return [rest];
  // 같은 색 줄의 가운데를 빼면 이어진 조각마다 3개 이상이어야 함
  if (new Set(rest.map((t) => t.c)).size !== 1) return null;
  const parts: Tile[][] = [];
  for (const t of sortMeld(rest)) {
    const last = parts[parts.length - 1];
    if (last && t.n === last[last.length - 1]!.n + 1) last.push(t);
    else parts.push([t]);
  }
  return parts.every(validMeld) ? parts : null;
}

/**
 * 내 타일(handIds) + 바닥에서 빌린 타일(borrow)로 새 묶음을 내거나(target null) 바닥 묶음 target에 붙임.
 * 내 타일이 한 장 이상 있어야 하고, 빌려 간 묶음과 새 묶음이 모두 맞아야 함. 안 되면 null
 */
export function playTiles(hand: readonly Tile[], table: readonly Tile[][], handIds: readonly number[], borrow: readonly number[], target: number | null): { hand: Tile[]; table: Tile[][]; used: number } | null {
  const hs = new Set(handIds);
  const bs = new Set(borrow);
  const mine = hand.filter((t) => hs.has(t.id));
  if (!mine.length || mine.length !== hs.size || hs.size !== handIds.length || bs.size !== borrow.length) return null;
  if (target !== null && (!table[target] || table[target]!.some((t) => bs.has(t.id)))) return null;
  const lent: Tile[] = [];
  const out: Tile[][] = [];
  let at = -1;
  for (let i = 0; i < table.length; i++) {
    const m = table[i]!;
    const took = m.filter((t) => bs.has(t.id));
    if (i === target) {
      at = out.length;
      out.push([]);
      continue;
    }
    if (!took.length) out.push(m);
    else {
      const rest = afterTake(m, bs);
      if (!rest) return null;
      lent.push(...took);
      out.push(...rest);
    }
  }
  if (lent.length !== bs.size) return null;
  const meld = [...(target === null ? [] : table[target]!), ...lent, ...mine];
  if (!validMeld(meld)) return null;
  if (at >= 0) out[at] = sortMeld(meld);
  else out.push(sortMeld(meld));
  return { hand: hand.filter((t) => !hs.has(t.id)), table: out, used: mine.length };
}

/** 컴퓨터 한 턴: 낼 수 있는 묶음을 모두 내고, 남은 타일을 바닥 묶음에 붙임. 하나도 못 내면 한 장 가져옴 */
export function cpuTurn(hand: readonly Tile[], table: readonly Tile[][], bag: readonly Tile[]): { hand: Tile[]; table: Tile[][]; bag: Tile[]; played: number } {
  let h = [...hand];
  const tb = table.map((m) => [...m]);
  let played = 0;
  for (let m = findMeld(h); m; m = findMeld(h)) {
    const ids = new Set(m.map((t) => t.id));
    h = h.filter((t) => !ids.has(t.id));
    tb.push(sortMeld(m));
    played += m.length;
  }
  for (const t of [...h]) {
    const i = tb.findIndex((m) => validMeld([...m, t]));
    if (i >= 0) {
      tb[i] = sortMeld([...tb[i]!, t]);
      h = h.filter((x) => x.id !== t.id);
      played++;
    }
  }
  const b = [...bag];
  if (played === 0 && b.length) h.push(b.pop()!);
  return { hand: h, table: tb, bag: b, played };
}

// ───────── 같이 하기 규칙 ─────────

export interface TilesState {
  hands: Tile[][];
  table: Tile[][];
  bag: Tile[];
  turn: number;
  /** 이번 차례에 낸 타일 수 */
  played: number;
  winner: number;
  /** 주머니가 비었는데 아무도 못 낸 차례 수 (한 바퀴 돌면 타일이 가장 적은 사람이 이김) */
  passes: number;
}
/** borrow: 바닥에서 빌려 오는 타일 id */
export type TilesAction = { meld: number[]; borrow?: number[] } | { add: number; ids: number[]; borrow?: number[] } | { end: true } | { cpu: true };

function nextTurn(s: TilesState, played: number): TilesState {
  const passes = played === 0 && s.bag.length === 0 ? s.passes + 1 : 0;
  let winner = s.winner;
  if (winner < 0 && passes >= s.hands.length) {
    const counts = s.hands.map((h) => h.length);
    winner = counts.indexOf(Math.min(...counts));
  }
  return { ...s, turn: (s.turn + 1) % s.hands.length, played: 0, passes, winner };
}

export const TILES_RULES: GameRules<TilesState, TilesAction> = {
  start(seats, rng) {
    const bag = newBag(rng);
    return { hands: Array.from({ length: seats }, () => sortHand(bag.splice(0, TILE_HAND))), table: [], bag, turn: 0, played: 0, winner: -1, passes: 0 };
  },
  turn: (s) => (s.winner >= 0 ? -1 : s.turn),
  act(s, seat, a) {
    if (seat !== s.turn || s.winner >= 0) return null;
    const hands = s.hands.map((h) => [...h]);
    if ("cpu" in a) {
      const r = cpuTurn(hands[seat]!, s.table, s.bag);
      hands[seat] = sortHand(r.hand);
      return nextTurn({ ...s, hands, table: r.table, bag: r.bag, winner: r.hand.length === 0 ? seat : -1 }, r.played);
    }
    if ("end" in a) {
      const bag = [...s.bag];
      if (s.played === 0 && bag.length) hands[seat] = sortHand([...hands[seat]!, bag.pop()!]);
      return nextTurn({ ...s, hands, bag }, s.played);
    }
    const ids = "meld" in a ? a.meld : a.ids;
    const borrow = a.borrow ?? [];
    if (!Array.isArray(ids) || !Array.isArray(borrow)) return null;
    const got = playTiles(hands[seat]!, s.table, ids.map(Number), borrow.map(Number), "meld" in a ? null : Number(a.add));
    if (!got) return null;
    hands[seat] = got.hand;
    return { ...s, hands, table: got.table, played: s.played + got.used, winner: got.hand.length === 0 ? seat : -1 };
  },
  auto: () => ({ cpu: true }),
  over: (s) => s.winner >= 0,
  view: (s, seat) => ({ hand: s.hands[seat] ?? [], counts: s.hands.map((h) => h.length), table: s.table, bag: s.bag.length, played: s.played, winner: s.winner }),
};

export interface TilesView {
  hand: Tile[];
  counts: number[];
  table: Tile[][];
  bag: number;
  played: number;
  winner: number;
}
