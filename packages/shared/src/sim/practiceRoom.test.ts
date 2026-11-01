import { describe, expect, it } from "vitest";
import { createPracticeRun } from "./practice";
import { GYM_OP } from "./gym";
import { practiceRoom, practiceRoomOff } from "./practiceRoom";
import { menuCode } from "./station";
import { stepSim } from "./run";
import { EMPTY_INPUT } from "./types";

describe("연습장 방 시험", () => {
  it("상점·천상의 상점·여신의 선물·단련의 방으로 바꾸고 되돌림", () => {
    const s = createPracticeRun("warden");
    practiceRoom(s, "heaven");
    expect(s.map.rooms[s.roomId]!.type).toBe("shop");
    expect(s.map.rooms[s.roomId]!.heaven).toBe(true);
    expect(s.rooms[s.roomId]!.pickups.some((p) => p.kind === "reroll")).toBe(true);
    practiceRoom(s, "golden");
    expect(s.map.rooms[s.roomId]!.heaven).toBeUndefined();
    expect(s.rooms[s.roomId]!.pickups.filter((p) => p.kind === "passive")).toHaveLength(9);
    // 단련의 방은 다시 놓으면 또 쓸 수 있음
    for (let k = 0; k < 2; k++) {
      practiceRoom(s, "gym");
      expect(s.rooms[s.roomId]!.pickups.filter((p) => p.kind === "gym")).toHaveLength(3);
      stepSim(s, { ...EMPTY_INPUT, menu: menuCode(GYM_OP.result, 0, 500 / 20) });
    }
    expect(s.player.gym!.pts).toBe(10);
    practiceRoomOff(s);
    expect(s.map.rooms[s.roomId]!.type).toBe("start");
    expect(s.rooms[s.roomId]!.pickups).toHaveLength(0);
  });
});
