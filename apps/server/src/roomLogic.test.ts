import { BATTLE_COUNTDOWN_MS, BATTLE_DURATION_MS, QUICK_WAIT_MS, RECONNECT_MS, rankPlayers } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { newRoom, RoomLogic } from "./roomLogic";

function room(mode: "quick" | "private") {
  let t = 1_000_000;
  const logic = new RoomLogic(newRoom("ABCDEF", mode), () => t, () => "SEEDSEED");
  return { logic, later: (ms: number) => (t += ms), now: () => t };
}

const PID = (n: number) => `player-${n}-xxxx`;
const status = (score: number) => ({ t: "status" as const, floor: 2, roomId: 3, hp: 50, maxHp: 100, score, kills: 4 });

describe("배틀 방", () => {
  it("방 만들기: 방장이 시작, 시드·끝 시각 정해짐, 시작 뒤에는 새로 못 들어옴", () => {
    const { logic, now } = room("private");
    logic.join(PID(1), "A", "warden");
    logic.join(PID(2), "B", "drifter");
    expect(logic.data.hostPid).toBe(PID(1));
    expect(logic.handle(PID(2), { t: "start" })).toEqual([]);
    logic.handle(PID(1), { t: "start" });
    expect(logic.data.phase).toBe("playing");
    expect(logic.data.seedText).toBe("SEEDSEED");
    expect(logic.data.endAt - now()).toBe(BATTLE_COUNTDOWN_MS + BATTLE_DURATION_MS);
    expect(logic.join(PID(3), "C", "warden")).toEqual({ t: "error", error: "started" });
  });

  it("빠른 매칭: 두 명이 되면 기다렸다 자동 시작", () => {
    const { logic, later } = room("quick");
    logic.join(PID(1), "A", "warden");
    expect(logic.nextAlarm()).toBe(0);
    logic.join(PID(2), "B", "warden");
    expect(logic.nextAlarm()).toBeGreaterThan(0);
    later(QUICK_WAIT_MS);
    logic.tick();
    expect(logic.data.phase).toBe("playing");
  });

  it("상태 전달 → 모두 끝나면 판 끝, 순위는 점수·먼저 끝낸 순", () => {
    const { logic, later } = room("private");
    logic.join(PID(1), "A", "warden");
    logic.join(PID(2), "B", "drifter");
    logic.handle(PID(1), { t: "start" });
    // 시작 전(카운트다운) 상태는 받지 않음
    logic.handle(PID(1), status(100));
    expect(logic.data.players[0]!.score).toBe(0);
    later(BATTLE_COUNTDOWN_MS + 1000);
    logic.handle(PID(1), status(100));
    expect(logic.data.players[0]).toMatchObject({ floor: 2, roomId: 3, hp: 50, score: 100 });
    logic.handle(PID(1), { t: "end", state: "dead", floor: 2, roomId: 3, hp: 0, score: 900, kills: 9 });
    later(1000);
    logic.handle(PID(2), { t: "end", state: "cleared", floor: 6, roomId: 1, hp: 10, score: 900, kills: 30 });
    expect(logic.data.phase).toBe("done");
    expect(rankPlayers(logic.data.players).map((p) => p.pid)).toEqual([PID(1), PID(2)]);
  });

  it("끊기면 1분 안에 돌아오면 이어서, 아니면 기권패", () => {
    const { logic, later } = room("private");
    logic.join(PID(1), "A", "warden");
    logic.join(PID(2), "B", "warden");
    logic.handle(PID(1), { t: "start" });
    later(BATTLE_COUNTDOWN_MS);
    logic.leave(PID(2));
    later(30_000);
    logic.join(PID(2), "B", "warden");
    expect(logic.data.players[1]!.connected).toBe(true);
    logic.leave(PID(2));
    expect(logic.nextAlarm()).toBe(logic.data.players[1]!.leftAt + RECONNECT_MS);
    later(RECONNECT_MS);
    logic.tick();
    expect(logic.data.players[1]!.state).toBe("forfeit");
    expect(logic.join(PID(2), "B", "warden")).toEqual({ t: "error", error: "started" });
  });

  it("시간이 끝나면 남은 사람은 그 점수로 끝", () => {
    const { logic, later } = room("private");
    logic.join(PID(1), "A", "warden");
    logic.handle(PID(1), { t: "start" });
    later(BATTLE_COUNTDOWN_MS + 1000);
    logic.handle(PID(1), status(300));
    later(BATTLE_DURATION_MS);
    logic.tick();
    expect(logic.data.phase).toBe("done");
    expect(logic.data.players[0]).toMatchObject({ state: "timeout", score: 300 });
  });

  it("채팅은 대기실에선 모두, 게임 중엔 끝난 사람끼리만, 금칙어 가림", () => {
    const { logic, later } = room("private");
    logic.join(PID(1), "A", "warden");
    logic.join(PID(2), "B", "warden");
    logic.join(PID(3), "C", "warden");
    const hello = logic.handle(PID(2), { t: "chat", text: "hello" });
    expect(hello[0]!.to).toEqual([PID(1), PID(2), PID(3)]);
    logic.handle(PID(1), { t: "start" });
    later(BATTLE_COUNTDOWN_MS + 1);
    expect(logic.handle(PID(1), { t: "chat", text: "hi" })).toEqual([]);
    logic.handle(PID(1), { t: "end", state: "dead", floor: 1, roomId: 0, hp: 0, score: 0, kills: 0 });
    logic.handle(PID(2), { t: "end", state: "dead", floor: 1, roomId: 0, hp: 0, score: 0, kills: 0 });
    const out = logic.handle(PID(1), { t: "chat", text: "gg shit" });
    expect(out[0]!.to).toEqual([PID(1), PID(2)]);
    expect(out[0]!.msg).toMatchObject({ t: "chat", name: "A", text: "gg ****" });
  });

  it("시작 전에 나가면 바로 빠지고 방장이 넘어감, 10명까지", () => {
    const { logic } = room("private");
    for (let i = 1; i <= 10; i++) logic.join(PID(i), `P${i}`, "warden");
    expect(logic.join(PID(11), "X", "warden")).toEqual({ t: "error", error: "full" });
    logic.leave(PID(1));
    expect(logic.data.players).toHaveLength(9);
    expect(logic.data.hostPid).toBe(PID(2));
  });
});
