import { CHARACTER_IDS, HIDDEN_CHARACTERS } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { factionOf } from "./factions";

describe("캐릭터 선택 진영 탭", () => {
  it("보통 캐릭터는 모두 일곱 나라 중 하나", () => {
    for (const c of CHARACTER_IDS) expect(["ascalon", "terracore", "virdia", "helios", "thalassia", "seongguk", "dawn", "silber", "ashvar"], c).toContain(factionOf(c));
  });
  it("숨은 캐릭터는 아카식 레코드 · 차원의 순례자·몰락한 왕은 이방인 · 빛의 사도는 서고의 감시자", () => {
    for (const c of HIDDEN_CHARACTERS) expect(factionOf(c)).toBe(c === "pilgrim" || c === "fallenKing" ? "outsider" : c === "lux" ? "archive" : "akashic");
  });
});
