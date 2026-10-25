import { ACHIEVEMENT_IDS, CHARACTERS } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { CHARACTER_GOALS } from "./characterGoals";

describe("도전과제 캐릭터", () => {
  it("있는 캐릭터·도전과제만 쓰고, 처음부터 열린 캐릭터가 셋 이상", () => {
    for (const [c, goal] of Object.entries(CHARACTER_GOALS)) {
      expect(Object.keys(CHARACTERS)).toContain(c);
      expect(ACHIEVEMENT_IDS).toContain(goal);
    }
    expect(Object.keys(CHARACTERS).filter((c) => !(c in CHARACTER_GOALS)).length).toBeGreaterThanOrEqual(3);
  });
});
