import { ACHIEVEMENT_IDS, CHARACTER_IDS, CHARACTERS } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { CHARACTER_GOALS } from "./characterGoals";

describe("도전과제 캐릭터", () => {
  it("있는 캐릭터·도전과제만 쓰고, 처음부터 열린 캐릭터가 셋 이상", () => {
    for (const [c, goal] of Object.entries(CHARACTER_GOALS)) {
      expect(Object.keys(CHARACTERS)).toContain(c);
      if (goal && "a" in goal) expect(ACHIEVEMENT_IDS).toContain(goal.a);
    }
    expect(Object.keys(CHARACTERS).filter((c) => !(c in CHARACTER_GOALS)).length).toBeGreaterThanOrEqual(3);
    // 숨은 캐릭터를 빼고 파수꾼·떠돌이·마법사만 처음부터
    expect(CHARACTER_IDS.filter((c) => !(c in CHARACTER_GOALS))).toEqual(["warden", "drifter", "mage"]);
  });
});
