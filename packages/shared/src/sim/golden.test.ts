import { describe, expect, it } from "vitest";
import { spawnGolden } from "./golden";
import { continueToLastFloor } from "./rooms";
import { createRun } from "./run";

describe("여신의 선물", () => {
  it("해금이 적거나 아이템 종류가 적은 캐릭터(풋내기·변희)도 늘 9칸", () => {
    for (const c of ["novice", "byeonhui", "warden"] as const) {
      const run = createRun(5, c);
      continueToLastFloor(run, "dragon");
      run.rooms[1]!.pickups = [];
      spawnGolden(run, 1);
      expect(run.rooms[1]!.pickups.filter((p) => p.kind === "passive")).toHaveLength(9);
    }
  });
});
