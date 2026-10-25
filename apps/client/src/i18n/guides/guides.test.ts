import { ALL_CHARACTER_IDS } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { charGuide } from "./index";

describe("캐릭터 설명", () => {
  it("모든 캐릭터(히든 포함)가 세 언어 모두 같은 줄 수로 있음", () => {
    for (const c of ALL_CHARACTER_IDS) {
      const ko = charGuide(c, "ko").length;
      expect(ko, c).toBeGreaterThan(2);
      expect(charGuide(c, "en").length, c).toBe(ko);
      expect(charGuide(c, "ja").length, c).toBe(ko);
    }
  });
});
