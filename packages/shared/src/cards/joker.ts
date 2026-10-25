// 조커 게임 (4명): 같은 숫자 두 장은 버림. 차례에 다음 사람(카드가 남은)의 뒤집힌 카드 한 장을 뽑음. 마지막까지 조커를 가진 사람이 짐
// 뽑은 카드와 짝이 손에 있으면 뽑은 사람이 그 짝을 직접 눌러 버림 (짝이 없으면 바로 손에 들어감)
import type { Rng } from "../rng";
import { shuffleWith, type GameRules } from "./types";

export const JOKER = 0;

export interface JokerState {
  hands: number[][];
  turn: number;
  loser: number;
  /** 마지막에 뽑힌 카드 (뽑은 사람에게만 보임) */
  last: { seat: number; card: number } | null;
  /** 뽑은 카드가 손의 짝을 기다리는 중 (뽑은 사람이 짝을 눌러야 차례가 넘어감) */
  pending: boolean;
}
export type JokerAction = { pick: number } | { match: number };

/** 같은 숫자 두 장씩 버림 */
function dropPairs(hand: number[], rng: Rng): number[] {
  const count = new Map<number, number>();
  for (const c of hand) count.set(c, (count.get(c) ?? 0) + 1);
  const out: number[] = [];
  for (const [c, n] of count) if (n % 2 === 1) out.push(c);
  return shuffleWith(rng, out);
}

/** from 다음으로 카드가 남은 사람 */
export function jokerNext(hands: readonly number[][], from: number): number {
  for (let k = 1; k <= hands.length; k++) {
    const i = (from + k) % hands.length;
    if (hands[i]!.length) return i;
  }
  return from;
}

function settle(s: JokerState): JokerState {
  const alive = s.hands.filter((h) => h.length).length;
  if (alive > 1) return s;
  return { ...s, loser: s.hands.findIndex((h) => h.length), turn: -1 };
}

export const JOKER_RULES: GameRules<JokerState, JokerAction> = {
  start(seats, rng) {
    const deck = shuffleWith(rng, [JOKER, ...Array.from({ length: 52 }, (_, i) => (i % 13) + 1)]);
    const hands: number[][] = Array.from({ length: seats }, () => []);
    deck.forEach((c, i) => hands[i % seats]!.push(c));
    const dealt = hands.map((h) => dropPairs(h, rng));
    const turn = dealt[0]!.length ? 0 : jokerNext(dealt, 0);
    return settle({ hands: dealt, turn, loser: -1, last: null, pending: false });
  },
  turn: (s) => s.turn,
  act(s, seat, a, rng) {
    if (seat !== s.turn || s.loser >= 0) return null;
    const hands = s.hands.map((h) => [...h]);
    if ("match" in a) {
      // 손에서 뽑은 카드의 짝을 눌러 둘 다 버림
      const i = Number(a.match);
      if (!s.pending || !s.last || hands[seat]![i] !== s.last.card) return null;
      hands[seat]!.splice(i, 1);
      return settle({ ...s, hands, turn: jokerNext(hands, seat), pending: false });
    }
    if (s.pending) return null;
    const from = jokerNext(s.hands, seat);
    const i = Number(a.pick);
    if (from === seat || !Number.isInteger(i) || i < 0 || i >= s.hands[from]!.length) return null;
    const card = hands[from]!.splice(i, 1)[0]!;
    const last = { seat, card };
    if (card !== JOKER && hands[seat]!.includes(card)) return { ...s, hands, last, pending: true };
    hands[seat] = shuffleWith(rng, [...hands[seat]!, card]);
    return settle({ ...s, hands, turn: jokerNext(hands, seat), last, pending: false });
  },
  auto: (s, seat, rng) =>
    s.pending && s.last ? { match: s.hands[seat]!.indexOf(s.last.card) } : { pick: rng.int(0, Math.max(0, s.hands[jokerNext(s.hands, seat)]!.length - 1)) },
  over: (s) => s.loser >= 0,
  view: (s, seat) => ({
    hand: s.hands[seat] ?? [],
    counts: s.hands.map((h) => h.length),
    from: s.turn >= 0 ? jokerNext(s.hands, s.turn) : -1,
    loser: s.loser,
    got: s.last && s.last.seat === seat ? s.last.card : null,
    pending: s.pending && s.last?.seat === seat,
  }),
};

export interface JokerView {
  hand: number[];
  counts: number[];
  from: number;
  loser: number;
  got: number | null;
  /** 뽑은 카드(got)의 짝을 손에서 눌러야 함 */
  pending: boolean;
}
