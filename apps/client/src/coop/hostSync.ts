// 협동 방장: 모두의 입력을 틱마다 확정해 손님에게 나눠 줌 (확정 계산은 모든 화면이 같음).
// 손님은 조금 앞서 가며 입력을 미리 보내므로 보통 바로 확정됨. 늦는 손님은 DEADLINE까지만 기다리고
// 그 뒤엔 그 사람의 마지막 입력으로 확정 (그 손님 화면은 확정을 받아 고쳐짐)
import { EMPTY_INPUT, stepParty, syncSeat, type RunState, type TickInput } from "@pixel-rogue/shared";
import { HASH_EVERY, held, packInput, SEND_EVERY, showPredicted, stateHash, unpackInput, type CoopMsg } from "./lockstep";

/** 손님 입력을 기다리는 최대 틱 (0.3초) */
const DEADLINE = 18;

export interface HostLink {
  send: (pid: string, msg: CoopMsg) => void;
  isOpen: (pid: string) => boolean;
}

/** seats[i] = i번 자리 사람 id, mySeat = 방장 자리 (처음엔 0, 이어받으면 다른 자리) */
export class HostSync {
  /** 지금 틱 (확정은 여기까지 따라옴) */
  tickNow: number;
  /** 자리마다 틱별 입력 (방장 자신 포함) */
  private ins: Map<number, TickInput>[];
  /** 자리마다 마지막 확정 입력 (늦은 손님·짐작용) */
  private last: TickInput[];
  /** 확정했지만 아직 안 보낸 틱들 (from 틱부터) */
  private frames: number[][][] = [];
  private from = 0;
  /** 게임 중에 들어와 보기만 하는 사람 (확정 입력만 받음) */
  private watchers = new Set<string>();

  constructor(
    readonly confirmed: RunState,
    private seats: readonly string[],
    private link: HostLink,
    private mySeat = 0,
  ) {
    this.tickNow = confirmed.tick;
    this.ins = seats.map(() => new Map());
    this.last = seats.map(() => EMPTY_INPUT);
  }

  onGuestLeft(pid: string): void {
    this.watchers.delete(pid);
  }

  onGuestInput(pid: string, n: number, packed: number[][]): void {
    const seat = this.seats.indexOf(pid);
    if (seat < 0 || seat === this.mySeat) return;
    packed.slice(0, 30).forEach((p, k) => {
      // 이미 확정된 틱이나 너무 먼 틱은 버림
      const t = n + k;
      if (t > this.confirmed.tick && t <= this.tickNow + 120) this.ins[seat]!.set(t, unpackInput(p));
    });
  }

  /** 연결되거나 어긋났다는 손님에게 확정 상태 */
  sendState(pid: string): void {
    const seat = this.seats.indexOf(pid);
    if (seat === this.mySeat) return;
    syncSeat(this.confirmed);
    // 자리가 없는 사람은 관전자 (0번 자리를 보며 확정 입력만 받음)
    if (seat < 0) this.watchers.add(pid);
    this.link.send(pid, { t: "state", seat: Math.max(0, seat), s: this.confirmed, at: this.tickNow, ...(seat < 0 ? { watch: true } : {}) });
  }

  /** 한 틱 (게임 화면이 틱마다 부름): 내 입력 기록 → 확정할 수 있는 만큼 확정 */
  step = (_display: RunState, local: TickInput): boolean => {
    this.tickNow++;
    this.ins[this.mySeat]!.set(this.tickNow, local);
    this.confirm();
    return true;
  };

  /** 화면: 확정 + 지금 틱까지 짐작 (프레임마다 한 번) */
  show = (display: RunState): void => {
    showPredicted(display, this.confirmed, this.tickNow, (t) => this.seats.map((_, i) => this.ins[i]!.get(t) ?? held(this.last[i]!)));
  };

  /** 확정 입력: 받은 것, 끊긴 손님·마감 지난 틱은 마지막 입력. 아직 기다려야 하면 null */
  private finalInput(seat: number, t: number): TickInput | null {
    const got = this.ins[seat]!.get(t);
    if (got) return got;
    if (seat !== this.mySeat && this.link.isOpen(this.seats[seat]!) && this.tickNow - t < DEADLINE) return null;
    return held(this.last[seat]!);
  }

  private confirm(): void {
    while (this.confirmed.tick < this.tickNow && !this.confirmed.over) {
      const t = this.confirmed.tick + 1;
      const inputs: TickInput[] = [];
      for (let i = 0; i < this.seats.length; i++) {
        const x = this.finalInput(i, t);
        if (!x) break;
        inputs.push(x);
      }
      if (inputs.length < this.seats.length) break;
      stepParty(this.confirmed, inputs);
      this.last = inputs;
      for (const m of this.ins) m.delete(t);
      if (this.frames.length === 0) this.from = t;
      this.frames.push(inputs.map(packInput));
      if (t % HASH_EVERY === 0 || this.confirmed.over) this.flush(stateHash(this.confirmed));
    }
    if (this.frames.length >= SEND_EVERY) this.flush();
  }

  private flush(h?: number): void {
    const msg: CoopMsg = { t: "ticks", n: this.from, ins: this.frames, at: this.tickNow, ...(h !== undefined ? { h } : {}) };
    this.seats.forEach((pid, i) => {
      if (i !== this.mySeat && this.link.isOpen(pid)) this.link.send(pid, msg);
    });
    for (const pid of this.watchers) if (this.link.isOpen(pid)) this.link.send(pid, msg);
    this.frames = [];
  }
}
