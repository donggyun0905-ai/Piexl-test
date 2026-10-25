// 로비 카드·타일 게임 같이 하기 (블랙잭 · 숫자 타일 · 조커 게임): 자리 · 방 · 주고받는 메시지
import type { Rng } from "../rng";

export type CardGame = "blackjack" | "tiles" | "joker";
export const CARD_GAMES: readonly CardGame[] = ["blackjack", "tiles", "joker"];
/** 게임마다 자리 수 (빈자리는 시작할 때 컴퓨터가 채움) */
export const CARD_SEATS: Record<CardGame, number> = { blackjack: 4, tiles: 4, joker: 4 };
/** 빠른 시작: 첫 사람이 들어온 뒤 이만큼 기다리다 시작 */
export const CARD_QUICK_WAIT_MS = 15_000;
/** 차례 제한 시간 (넘기면 컴퓨터처럼 대신 둠) */
export const CARD_TURN_MS: Record<CardGame, number> = { blackjack: 20_000, tiles: 60_000, joker: 20_000 };
/** 컴퓨터가 두기까지 기다리는 시간 (사람처럼 보이게) */
export const CARD_CPU_MS = 900;

export interface Seat {
  /** 사람은 참가 id, 컴퓨터는 null */
  pid: string | null;
  name: string;
  connected: boolean;
}

/** 게임마다 규칙 모듈 (서버가 판정, 화면은 보기만) */
export interface GameRules<S, A> {
  start(seats: number, rng: Rng): S;
  /** 지금 둘 차례인 자리 (-1 = 아무도) */
  turn(s: S): number;
  /** 자리 i의 한 수. 맞지 않으면 null */
  act(s: S, seat: number, a: A, rng: Rng): S | null;
  /** 컴퓨터(또는 시간이 다 된 사람)의 한 수 */
  auto(s: S, seat: number, rng: Rng): A;
  /** 차례가 아닌데 시간이 지나면 저절로 진행 (블랙잭 걸기 끝·다음 판). 없으면 null */
  advance?(s: S, rng: Rng): S | null;
  /** advance까지 기다리는 시간 */
  advanceMs?(s: S): number;
  /** 차례와 상관없이 동시에 둘 자리 (블랙잭 걸기). 컴퓨터 자리는 바로 둠 */
  waiting?(s: S): number[];
  /** 끝났는지 */
  over(s: S): boolean;
  /** 자리 i에게 보여 줄 것 (남의 패는 숨김) */
  view(s: S, seat: number): unknown;
}

export type CardClientMsg =
  | { t: "hello"; pid: string; name: string }
  | { t: "start" }
  | { t: "act"; a: unknown }
  | { t: "again" };

export interface TableView {
  code: string;
  game: CardGame;
  phase: "lobby" | "playing" | "done";
  seats: { name: string; cpu: boolean; connected: boolean }[];
  /** 내 자리 · 방장인지 */
  you: number;
  host: boolean;
  turn: number;
  /** 차례 끝 시각 (서버 시계) · 지금 서버 시각 */
  deadline: number;
  now: number;
  game_: unknown;
}

export type CardServerMsg = { t: "table"; view: TableView } | { t: "error"; error: string };

export function shuffleWith<T>(rng: Rng, list: T[]): T[] {
  for (let i = list.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [list[i], list[j]] = [list[j]!, list[i]!];
  }
  return list;
}
