// 블랙잭 테이블 (딜러와 여러 명): 판마다 걸기 → 두 장씩 → 자리 차례로 받기·멈추기·더블 → 딜러(17까지) → 결과 → 다음 판
// 칩은 놀이용이라 각자 화면에서 셈 (서버는 판돈·배수만 알려 줌)
import type { Rng } from "../rng";
import { shuffleWith, type GameRules } from "./types";

export const BJ_BETS = [10, 50, 100, 500];
const DEALER_STOP = 17;

/** 카드 = 0~51 (무늬 · 숫자) */
export const cardRank = (c: number) => c % 13;
export const cardSuit = (c: number) => Math.floor(c / 13);
const value = (c: number) => Math.min(10, cardRank(c) + 1);

/** 합 (A는 넘지 않으면 11로) */
export function bjTotal(hand: readonly number[]): number {
  let s = hand.reduce((a, c) => a + value(c), 0);
  if (hand.some((c) => cardRank(c) === 0) && s + 10 <= 21) s += 10;
  return s;
}
export const isBlackjack = (h: readonly number[]) => h.length === 2 && bjTotal(h) === 21;

export type BjResult = "blackjack" | "win" | "lose" | "push" | "bust";
/** 결과마다 판돈의 몇 배를 돌려받는지 */
export const BJ_PAY: Record<BjResult, number> = { blackjack: 2.5, win: 2, push: 1, lose: 0, bust: 0 };

export interface BjState {
  phase: "bet" | "play" | "result";
  round: number;
  deck: number[];
  dealer: number[];
  hands: number[][];
  bets: number[];
  /** 걸기를 마친 자리 */
  ready: boolean[];
  done: boolean[];
  results: (BjResult | null)[];
  turn: number;
}
export type BjAction = { bet: number } | { hit: true } | { stand: true } | { double: true } | { next: true };

function nextOpen(s: BjState, from: number): number {
  for (let i = from; i < s.hands.length; i++) if (!s.done[i]) return i;
  return -1;
}

/** 모두 걸면 두 장씩 나눔 */
function deal(s: BjState, rng: Rng): BjState {
  const deck = shuffleWith(rng, Array.from({ length: 52 }, (_, i) => i));
  const hands = s.hands.map(() => [deck.pop()!, deck.pop()!]);
  const dealer = [deck.pop()!, deck.pop()!];
  const done = hands.map((h) => isBlackjack(h));
  const n = { ...s, phase: "play" as const, deck, dealer, hands, done, results: hands.map(() => null) };
  const turn = nextOpen(n, 0);
  return turn < 0 ? finish({ ...n, turn }) : { ...n, turn };
}

/** 딜러가 받고 결과 */
function finish(s: BjState): BjState {
  const deck = [...s.deck];
  const dealer = [...s.dealer];
  const anyLive = s.hands.some((h) => bjTotal(h) <= 21 && !isBlackjack(h));
  while (anyLive && bjTotal(dealer) < DEALER_STOP) dealer.push(deck.pop()!);
  const d = bjTotal(dealer);
  const results = s.hands.map((h): BjResult => {
    if (isBlackjack(h)) return isBlackjack(dealer) ? "push" : "blackjack";
    const a = bjTotal(h);
    if (a > 21) return "bust";
    return d > 21 || a > d ? "win" : a < d ? "lose" : "push";
  });
  return { ...s, phase: "result", deck, dealer, results, turn: -1 };
}

function afterMove(s: BjState, seat: number, hand: number[], stop: boolean): BjState {
  const hands = s.hands.map((h, i) => (i === seat ? hand : h));
  const done = s.done.map((d, i) => d || (i === seat && (stop || bjTotal(hand) >= 21)));
  const n = { ...s, hands, done };
  const turn = nextOpen(n, seat);
  return turn < 0 ? finish({ ...n, turn }) : { ...n, turn };
}

export const BJ_RULES: GameRules<BjState, BjAction> = {
  start: (seats) => ({ phase: "bet", round: 1, deck: [], dealer: [], hands: Array.from({ length: seats }, () => []), bets: Array<number>(seats).fill(10), ready: Array<boolean>(seats).fill(false), done: Array<boolean>(seats).fill(false), results: Array<null>(seats).fill(null), turn: -1 }),
  turn: (s) => (s.phase === "play" ? s.turn : -1),
  act(s, seat, a, rng) {
    if ("bet" in a) {
      if (s.phase !== "bet" || s.ready[seat] || !BJ_BETS.includes(Number(a.bet))) return null;
      const bets = s.bets.map((b, i) => (i === seat ? Number(a.bet) : b));
      const ready = s.ready.map((r, i) => r || i === seat);
      const n = { ...s, bets, ready };
      return ready.every(Boolean) ? deal(n, rng) : n;
    }
    if (s.phase !== "play" || seat !== s.turn) return null;
    const deck = [...s.deck];
    if ("hit" in a) return afterMove({ ...s, deck }, seat, [...s.hands[seat]!, deck.pop()!], false);
    if ("stand" in a) return afterMove(s, seat, s.hands[seat]!, true);
    if ("double" in a && s.hands[seat]!.length === 2) {
      const bets = s.bets.map((b, i) => (i === seat ? b * 2 : b));
      return afterMove({ ...s, deck, bets }, seat, [...s.hands[seat]!, deck.pop()!], true);
    }
    return null;
  },
  /** 컴퓨터·시간 초과: 걸기는 10, 차례면 16 이하일 때 받기 */
  auto: (s, seat) => (s.phase === "bet" ? { bet: 10 } : bjTotal(s.hands[seat] ?? []) <= 16 ? { hit: true } : { stand: true }),
  /** 걸기 시간이 끝나면 안 건 자리는 10으로 · 결과 다음은 새 판 */
  advance(s, rng) {
    if (s.phase === "bet") return deal({ ...s, ready: s.ready.map(() => true) }, rng);
    if (s.phase === "result") return { ...BJ_RULES.start(s.hands.length, rng), round: s.round + 1 };
    return null;
  },
  advanceMs: (s) => (s.phase === "bet" ? 15_000 : 5_000),
  waiting: (s) => (s.phase === "bet" ? s.ready.flatMap((r, i) => (r ? [] : [i])) : []),
  over: () => false,
  view: (s) => ({ ...s, deck: undefined, dealer: s.phase === "result" ? s.dealer : s.dealer.slice(0, 1) }),
};

export type BjView = Omit<BjState, "deck">;
