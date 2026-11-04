import { describe, expect, it } from "vitest";
import { createRun, stepSim } from "./run";
import { practiceHidden, practiceRoomOff, PRACTICE_HIDDEN } from "./practiceRoom";
import { EMPTY_INPUT } from "./types";

describe("연습장 숨은 시련", () => {
  for (const k of PRACTICE_HIDDEN) {
    it(`${k}번: 지금 방에서 바로 시작하고, 보통 방으로 되돌리면 끝남`, () => {
      const s = createRun(4, "warden");
      practiceHidden(s, k);
      expect(s.hidden?.on).toBe(true);
      expect(s.hidden?.room).toBe(s.roomId);
      expect(s.enemies.length).toBeGreaterThan(0);
      for (let i = 0; i < 30; i++) stepSim(s, EMPTY_INPUT);
      practiceRoomOff(s);
      expect(s.hidden).toBeUndefined();
      expect(s.enemies.length).toBe(0);
    });
  }
});
