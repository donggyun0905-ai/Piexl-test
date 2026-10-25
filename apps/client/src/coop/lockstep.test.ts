import { createParty, EMPTY_INPUT, type RunState, type TickInput } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { GuestSync } from "./guestSync";
import { HostSync } from "./hostSync";
import { stateHash, type CoopMsg } from "./lockstep";

const members = [
  { characterId: "warden" as const, unlocks: [] },
  { characterId: "mage" as const, unlocks: [] },
];

/** 방장·손님을 delay(frame)프레임 늦게 닿는 망으로 이어 frames만큼 돌림 */
function simulate(opts: { delay: (frame: number) => number; frames: number; guestInput: (frame: number) => TickInput; hostInput?: (frame: number) => TickInput }) {
  let frame = 0;
  const toGuest: { at: number; msg: CoopMsg }[] = [];
  const toHost: { at: number; msg: CoopMsg }[] = [];
  const copy = (m: CoopMsg) => JSON.parse(JSON.stringify(m)) as CoopMsg;
  const host = new HostSync(createParty(9, members), ["h", "g"], {
    send: (_pid, msg) => toGuest.push({ at: frame + opts.delay(frame), msg: copy(msg) }),
    isOpen: () => true,
  });
  let resyncs = 0;
  const guest = new GuestSync((msg) => {
    if (msg.t === "resync") resyncs++;
    toHost.push({ at: frame + opts.delay(frame), msg: copy(msg) });
  });
  const hostRun = {} as RunState;
  const guestRun = {} as RunState;
  const deliver = (all = false) => {
    for (const m of toHost.filter((x) => all || x.at <= frame)) {
      if (m.msg.t === "in") host.onGuestInput("g", m.msg.n, m.msg.i);
      else if (m.msg.t === "resync") host.sendState("g");
    }
    toHost.splice(0, toHost.length, ...(all ? [] : toHost.filter((x) => x.at > frame)));
    for (const m of toGuest.filter((x) => all || x.at <= frame)) {
      if (m.msg.t === "state") guest.onState(guestRun, m.msg);
      else if (m.msg.t === "ticks") guest.onTicks(m.msg);
    }
    toGuest.splice(0, toGuest.length, ...(all ? [] : toGuest.filter((x) => x.at > frame)));
  };
  host.sendState("g");
  const guestX: number[] = [];
  for (frame = 0; frame < opts.frames; frame++) {
    deliver();
    host.step(hostRun, opts.hostInput?.(frame) ?? EMPTY_INPUT);
    host.show(hostRun);
    guest.step(guestRun, opts.guestInput(frame));
    guest.show(guestRun);
    guestX.push(guestRun.player?.x ?? 0);
  }
  return { host, guest, guestRun, guestX, resyncs, deliver };
}

const right = (from: number, to: number) => (f: number) => ({ ...EMPTY_INPUT, moveX: f >= from && f < to ? 100 : 0 });

describe("협동 짐작 진행", () => {
  it("손님이 누른 그 프레임에 손님 화면의 내 캐릭터가 움직임 (지연 0.1초)", () => {
    const { guestX, resyncs } = simulate({ delay: () => 6, frames: 300, guestInput: right(100, 160) });
    expect(guestX[100]!).toBeGreaterThan(guestX[99]!);
    expect(resyncs).toBe(0);
  });

  it("모두 확정되면 방장·손님 계산이 같음 (지연이 들쭉날쭉해도)", () => {
    const { host, guest, deliver, resyncs } = simulate({
      delay: (f) => 3 + (f % 15 < 6 ? 6 - (f % 15) : 0),
      frames: 900,
      guestInput: (f) => ({ ...EMPTY_INPUT, moveX: f % 120 < 60 ? 100 : -100, attack: f % 50 < 10 }),
      hostInput: (f) => ({ ...EMPTY_INPUT, moveY: f % 90 < 45 ? 100 : -100 }),
    });
    deliver(true);
    expect(resyncs).toBe(0);
    expect(guest.confirmed!.tick).toBe(host.confirmed.tick);
    expect(stateHash(guest.confirmed!)).toBe(stateHash(host.confirmed));
  });

  it("손님 입력이 마감보다 늦어도 손님 화면이 확정을 따라 고쳐짐", () => {
    const { host, guest, deliver } = simulate({ delay: () => 30, frames: 400, guestInput: right(100, 200) });
    deliver(true);
    expect(stateHash(guest.confirmed!)).toBe(stateHash(host.confirmed));
  });
});
