import { COOP_MAX_PLAYERS } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { newRoom, RoomLogic } from "./roomLogic";

const PID = (n: number) => `player-${n}-xxxx`;

function coop() {
  return new RoomLogic(newRoom("ABCDEF", "private", "coop"), () => 1_000_000, () => "SEEDSEED");
}

describe("협동 방 (배틀 대기실을 같이 씀)", () => {
  it("최대 5명", () => {
    const logic = coop();
    for (let i = 1; i <= COOP_MAX_PLAYERS; i++) expect(Array.isArray(logic.join(PID(i), "P", "warden"))).toBe(true);
    expect(logic.join(PID(9), "P", "warden")).toEqual({ t: "error", error: "full" });
    expect(logic.view().kind).toBe("coop");
  });

  it("연결 주선 내용은 같은 방 사람에게만 그대로 전달 (배틀 방·너무 긴 내용은 안 됨)", () => {
    const logic = coop();
    logic.join(PID(1), "A", "warden");
    logic.join(PID(2), "B", "mage");
    expect(logic.handle(PID(1), { t: "signal", to: PID(2), data: "offer" })).toEqual([
      { to: [PID(2)], msg: { t: "signal", from: PID(1), data: "offer" } },
    ]);
    expect(logic.handle(PID(1), { t: "signal", to: PID(7), data: "x" })).toEqual([]);
    expect(logic.handle(PID(1), { t: "signal", to: PID(2), data: "x".repeat(7000) })).toEqual([]);
    const battle = new RoomLogic(newRoom("ABCDEF", "private"), () => 0, () => "S");
    battle.join(PID(1), "A", "warden");
    battle.join(PID(2), "B", "warden");
    expect(battle.handle(PID(1), { t: "signal", to: PID(2), data: "x" })).toEqual([]);
  });

  it("게임 중 방장이 나가면 연결된 다음 사람이 방장 (돌아와도 그대로)", () => {
    const logic = coop();
    for (let i = 1; i <= 3; i++) logic.join(PID(i), "P", "warden");
    logic.handle(PID(1), { t: "start" });
    logic.leave(PID(2));
    logic.leave(PID(1));
    expect(logic.data.hostPid).toBe(PID(3));
    logic.join(PID(1), "P", "warden");
    expect(logic.data.hostPid).toBe(PID(3));
  });

  it("게임 중에 들어오면 관전 · 방장이 방으로 돌아가면 나간 사람은 빠지고 관전자도 같이", () => {
    const logic = coop();
    for (let i = 1; i <= 2; i++) logic.join(PID(i), "P", "warden");
    logic.handle(PID(1), { t: "start" });
    expect(Array.isArray(logic.join(PID(3), "W", "mage"))).toBe(true);
    expect(logic.data.players.find((p) => p.pid === PID(3))?.state).toBe("watch");
    logic.leave(PID(2));
    expect(logic.handle(PID(3), { t: "lobby" })).toEqual([]);
    logic.handle(PID(1), { t: "lobby" });
    expect(logic.data.phase).toBe("lobby");
    expect(logic.data.players.map((p) => [p.pid, p.state])).toEqual([
      [PID(1), "alive"],
      [PID(3), "alive"],
    ]);
    // 배틀 방은 시작 뒤 못 들어옴
    const battle = new RoomLogic(newRoom("ABCDEF", "private"), () => 0, () => "S");
    battle.join(PID(1), "A", "warden");
    battle.join(PID(2), "B", "warden");
    battle.handle(PID(1), { t: "start" });
    expect(battle.join(PID(3), "C", "warden")).toEqual({ t: "error", error: "started" });
  });
});
