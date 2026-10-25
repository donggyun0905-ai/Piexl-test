// 협동 손님: 방장이 확정한 입력으로 확정 상태를 계산하고, 내 입력은 바로 반영해 지금 틱까지 짐작해 보여 줌.
// 내 입력이 방장에게 제때 닿게 방장보다 (왕복 시간의 절반 + 조금) 앞서 감
import { EMPTY_INPUT, stepParty, TICK_MS, useSeat, type RunState, type TickInput } from "@pixel-rogue/shared";
import { HASH_EVERY, held, MAX_AHEAD, packInput, SEND_EVERY, replaceRun, showPredicted, stateHash, unpackInput, type CoopMsg } from "./lockstep";

/** 방장보다 더 앞서 가는 여유 틱 */
const MARGIN = 2;

export class GuestSync {
  seat = -1;
  confirmed: RunState | null = null;
  /** 지금 틱 (짐작해서 보여 주는 곳) */
  tickNow = 0;
  /** 틱별 내 입력 (확정될 때까지) */
  private mine = new Map<number, TickInput>();
  /** 자리마다 마지막 확정 입력 (남의 입력 짐작용) */
  private last: TickInput[] = [];
  /** 방장의 틱과 그걸 받은 시각 */
  private hostAt = 0;
  private hostAtTime = 0;
  /** 앞서 가지 못해 미뤄 둔 한 번 누르는 입력 */
  private pending: TickInput | null = null;
  private askedAt = -1;
  /** 상태를 아직 못 받았을 때 다시 달라고 한 뒤 지난 프레임 수 */
  private waiting = 0;
  /** 아직 안 보낸 내 입력 (outFrom 틱부터) */
  private out: number[][] = [];
  private outFrom = 0;

  constructor(
    private send: (msg: CoopMsg) => void,
    /** 방장과의 왕복 지연 (ms, 모르면 undefined) */
    private rttMs: () => number | undefined = () => undefined,
  ) {}

  private hostNow(): number {
    return this.hostAt + (performance.now() - this.hostAtTime) / TICK_MS;
  }

  onState(display: RunState, msg: { seat: number; s: RunState; at: number }): void {
    this.seat = msg.seat;
    // 확정 상태도 내 자리를 꺼내 놓음 (짐작 계산·화면이 내 자리 기준)
    useSeat(msg.s, msg.seat);
    this.confirmed = msg.s;
    this.last = (msg.s.party ?? []).map(() => EMPTY_INPUT);
    this.hostAt = msg.at;
    this.hostAtTime = performance.now();
    for (const t of this.mine.keys()) if (t <= msg.s.tick) this.mine.delete(t);
    this.tickNow = Math.max(this.tickNow, msg.s.tick);
    this.askedAt = -1;
    replaceRun(display, structuredClone(msg.s), msg.seat);
  }

  onTicks(msg: { n: number; ins: number[][][]; h?: number; at: number }): void {
    const c = this.confirmed;
    if (!c) return;
    this.hostAt = msg.at;
    this.hostAtTime = performance.now();
    if (msg.n > c.tick + 1) return this.resync();
    msg.ins.forEach((frame, k) => {
      const t = msg.n + k;
      if (t <= c.tick) return;
      const inputs = frame.map(unpackInput);
      stepParty(c, inputs);
      this.last = inputs;
      this.mine.delete(t);
    });
    if (msg.h !== undefined && (c.tick % HASH_EVERY === 0 || c.over) && stateHash(c) !== msg.h) this.resync();
  }

  private resync(): void {
    const c = this.confirmed;
    if (!c || this.askedAt === c.tick) return;
    this.askedAt = c.tick;
    this.send({ t: "resync" });
  }

  /** 한 틱 (게임 화면이 틱마다 부름): 방장과 맞춰 지금 틱을 0~2 늘리고 그 틱의 내 입력을 보냄 */
  step = (_display: RunState, local: TickInput): boolean => {
    const c = this.confirmed;
    if (!c) {
      // 첫 상태를 놓쳤으면 1초마다 다시 요청
      if (this.waiting++ % 60 === 59) this.send({ t: "resync" });
      return false;
    }
    const rtt = this.rttMs();
    const target = this.hostNow() + (rtt === undefined ? 3 : rtt / 2 / TICK_MS) + MARGIN;
    const diff = target - this.tickNow;
    let todo = diff > 6 ? 2 : diff < -6 ? 0 : 1;
    if (this.tickNow - c.tick >= MAX_AHEAD) todo = 0;
    let input = this.pending ? { ...local, ...onceOf(this.pending, local) } : local;
    if (todo === 0) {
      this.pending = input;
      return true;
    }
    this.pending = null;
    for (let k = 0; k < todo; k++) {
      this.tickNow++;
      this.mine.set(this.tickNow, input);
      if (this.out.length === 0) this.outFrom = this.tickNow;
      this.out.push(packInput(input));
      input = held(input);
    }
    if (this.out.length >= SEND_EVERY) {
      this.send({ t: "in", n: this.outFrom, i: this.out });
      this.out = [];
    }
    return true;
  };

  /** 화면: 확정 + 지금 틱까지 짐작 (프레임마다 한 번) */
  show = (display: RunState): void => {
    const c = this.confirmed;
    if (!c || this.seat < 0) return;
    showPredicted(display, c, this.tickNow, (t) => this.last.map((x, i) => (i === this.seat ? (this.mine.get(t) ?? held(x)) : held(x))));
  };
}

/** 미뤄 둔 한 번 누르는 값을 이번 입력에 합침 */
function onceOf(a: TickInput, b: TickInput): Partial<TickInput> {
  return { dash: a.dash || b.dash, interact: a.interact || b.interact, useSlot: a.useSlot || b.useSlot, pickChoice: a.pickChoice || b.pickChoice };
}
