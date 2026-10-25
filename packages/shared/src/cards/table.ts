// 카드·타일 게임 방 규칙 (서버 CardRoom이 씀): 들어오기·나가기·시작(빈자리는 컴퓨터)·한 수·시간 초과·컴퓨터 차례
// 랜덤은 방 시드 + 몇 번째 수로만 (같은 입력이면 같은 결과)
import { createRng, deriveSeed } from "../rng";
import { BJ_RULES } from "./blackjack";
import { JOKER_RULES } from "./joker";
import { TILES_RULES } from "./tiles";
import { CARD_CPU_MS, CARD_QUICK_WAIT_MS, CARD_SEATS, CARD_TURN_MS, type CardClientMsg, type CardGame, type GameRules, type Seat, type TableView } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RULES: Record<CardGame, GameRules<any, any>> = { blackjack: BJ_RULES, tiles: TILES_RULES, joker: JOKER_RULES };

export interface TableData {
  code: string;
  game: CardGame;
  mode: "quick" | "private";
  phase: "lobby" | "playing" | "done";
  seats: Seat[];
  host: string | null;
  createdAt: number;
  state: unknown;
  /** 지금 차례(또는 저절로 진행)의 끝 시각 · 컴퓨터가 둘 시각 */
  deadline: number;
  cpuAt: number;
  seed: number;
  step: number;
}

export function newTable(code: string, game: CardGame, mode: "quick" | "private", now: number, seed: number): TableData {
  return { code, game, mode, phase: "lobby", seats: [], host: null, createdAt: now, state: null, deadline: 0, cpuAt: 0, seed, step: 0 };
}

export class TableLogic {
  /** 저장해야 하는지 */
  dirty = false;

  constructor(
    readonly data: TableData,
    private now: () => number,
  ) {}

  private get rules() {
    return RULES[this.data.game];
  }
  private rng() {
    return createRng(deriveSeed(this.data.seed, "card", this.data.step++));
  }

  /** 들어오기. 실패하면 오류 이름 */
  join(pid: string, name: string): string | null {
    const d = this.data;
    const mine = d.seats.find((s) => s.pid === pid);
    if (mine) {
      mine.connected = true;
      this.dirty = true;
      return null;
    }
    const clean = name.slice(0, 16) || "Player";
    if (d.phase === "lobby") {
      if (d.seats.length >= CARD_SEATS[d.game]) return "full";
      d.seats.push({ pid, name: clean, connected: true });
      d.host ??= pid;
    } else if (d.game === "blackjack") {
      // 블랙잭은 하는 중에도 컴퓨터 자리를 이어받아 들어옴
      const cpu = d.seats.find((s) => s.pid === null);
      if (!cpu) return "full";
      Object.assign(cpu, { pid, name: clean, connected: true });
    } else return "started";
    this.dirty = true;
    return null;
  }

  leave(pid: string): void {
    const d = this.data;
    const seat = d.seats.find((s) => s.pid === pid);
    if (!seat) return;
    if (d.phase === "lobby") d.seats = d.seats.filter((s) => s !== seat);
    else seat.connected = false;
    if (d.host === pid) d.host = d.seats.find((s) => s.pid && s.connected)?.pid ?? null;
    this.dirty = true;
  }

  private start(): void {
    const d = this.data;
    while (d.seats.length < CARD_SEATS[d.game]) d.seats.push({ pid: null, name: "", connected: true });
    d.phase = "playing";
    d.state = this.rules.start(d.seats.length, this.rng());
    this.afterChange();
  }

  /** 상태가 바뀐 뒤: 끝났는지 · 다음 시간 */
  private afterChange(): void {
    const d = this.data;
    const now = this.now();
    if (this.rules.over(d.state)) d.phase = "done";
    const turn = this.rules.turn(d.state);
    d.deadline = now + (turn >= 0 ? CARD_TURN_MS[d.game] : (this.rules.advanceMs?.(d.state) ?? 0));
    d.cpuAt = now + CARD_CPU_MS;
    this.dirty = true;
  }

  private apply(seat: number, a: unknown): boolean {
    const next = this.rules.act(this.data.state, seat, a, this.rng());
    if (!next) return false;
    this.data.state = next;
    this.afterChange();
    return true;
  }

  handle(pid: string, msg: CardClientMsg): void {
    const d = this.data;
    if (msg.t === "start" && d.phase === "lobby" && d.host === pid) this.start();
    else if (msg.t === "again" && d.phase === "done" && d.host === pid) {
      d.seats = d.seats.filter((s) => s.pid && s.connected);
      this.start();
    } else if (msg.t === "act" && d.phase === "playing") {
      const seat = d.seats.findIndex((s) => s.pid === pid);
      if (seat >= 0) this.apply(seat, msg.a);
    }
  }

  /** 컴퓨터가 두는 자리인지 (나간 사람도 컴퓨터처럼 바로) */
  private isAuto(i: number): boolean {
    const s = this.data.seats[i];
    return !s || s.pid === null || !s.connected;
  }

  /** 시간이 된 일 처리 (알람) */
  tick(): void {
    const d = this.data;
    const now = this.now();
    if (d.phase === "lobby") {
      if (d.mode === "quick" && d.seats.length > 0 && now >= d.createdAt + CARD_QUICK_WAIT_MS) this.start();
      return;
    }
    for (let guard = 0; guard < 40 && d.phase === "playing"; guard++) {
      const turn = this.rules.turn(d.state);
      const waiting = this.rules.waiting?.(d.state).filter((i) => this.isAuto(i)) ?? [];
      if (turn >= 0 && ((this.isAuto(turn) && now >= d.cpuAt) || now >= d.deadline)) this.apply(turn, this.rules.auto(d.state, turn, this.rng()));
      else if (turn < 0 && waiting.length && now >= d.cpuAt) this.apply(waiting[0]!, this.rules.auto(d.state, waiting[0]!, this.rng()));
      else if (turn < 0 && this.rules.advance && now >= d.deadline) {
        const next = this.rules.advance(d.state, this.rng());
        if (!next) break;
        d.state = next;
        this.afterChange();
      } else break;
    }
  }

  /** 다음 알람 시각 (0 = 없음) */
  nextAlarm(): number {
    const d = this.data;
    if (d.phase === "lobby") return d.mode === "quick" && d.seats.length > 0 ? d.createdAt + CARD_QUICK_WAIT_MS : 0;
    if (d.phase !== "playing") return 0;
    const turn = this.rules.turn(d.state);
    const cpuWaiting = (this.rules.waiting?.(d.state) ?? []).some((i) => this.isAuto(i));
    return (turn >= 0 && this.isAuto(turn)) || (turn < 0 && cpuWaiting) ? Math.min(d.cpuAt, d.deadline) : d.deadline;
  }

  view(pid: string): TableView {
    const d = this.data;
    const you = d.seats.findIndex((s) => s.pid === pid);
    return {
      code: d.code,
      game: d.game,
      phase: d.phase,
      seats: d.seats.map((s) => ({ name: s.name, cpu: s.pid === null, connected: s.connected })),
      you,
      host: d.host === pid,
      turn: d.state ? this.rules.turn(d.state) : -1,
      deadline: d.deadline,
      now: this.now(),
      game_: d.state ? this.rules.view(d.state, you) : null,
    };
  }
}
