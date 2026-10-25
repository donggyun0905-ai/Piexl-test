import { createPracticeRun } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { DamageTracker, DUMMY_RESET_TICKS } from "./damageNumbers";

describe("피해 숫자·허수아비 기록", () => {
  it("허수아비 평균·초당·직전·총 피해, 오래 안 때리면 처음부터", () => {
    const s = createPracticeRun("warden");
    const dummy = s.enemies.find((e) => e.kind === "dummy")!;
    const d = new DamageTracker();
    d.observe(s);
    for (const dmg of [10, 20, 30]) {
      s.tick += 30;
      dummy.hp -= dmg;
      d.observe(s);
    }
    expect(d.dummyStats(s.tick)).toEqual({ avg: 20, dps: 60, last: 30, total: 60 });
    expect(d.dummyStats(s.tick + DUMMY_RESET_TICKS + 1)).toBeNull();
    s.tick += DUMMY_RESET_TICKS + 1;
    dummy.hp -= 5;
    d.observe(s);
    expect(d.dummyStats(s.tick)).toMatchObject({ total: 5, last: 5 });
  });
});
