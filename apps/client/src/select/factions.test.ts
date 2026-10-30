import { CHARACTER_IDS, HIDDEN_CHARACTERS } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { factionOf } from "./factions";

describe("캐릭터 선택 진영 탭", () => {
  it("보통 캐릭터는 모두 네 나라 중 하나", () => {
    for (const c of CHARACTER_IDS) expect(["ascalon", "terracore", "virdia", "helios"], c).toContain(factionOf(c));
  });
  it("숨은 캐릭터는 아카식 레코드 · 차원의 순례자·몰락한 왕은 이방인", () => {
    for (const c of HIDDEN_CHARACTERS) expect(factionOf(c)).toBe(c === "pilgrim" || c === "fallenKing" ? "outsider" : "akashic");
  });
});
