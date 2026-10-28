import { describe, expect, it } from "vitest";
import { CHARACTER_IDS } from "./characters";
import { draftAct, draftAuto, draftDone, draftTaken, draftTurns, newDraft } from "./pwDraft";
import { allPlayers } from "./sim/party";
import { createPvp } from "./sim/pvp";

describe("패왕전 밴픽", () => {
  it("차례: 밴을 번갈아 → 픽은 지그재그 (A · BB · AA · B)", () => {
    const t = draftTurns("trio");
    expect(t.filter((x) => x.ban).map((x) => x.team)).toEqual([0, 1, 0, 1]);
    expect(t.filter((x) => !x.ban).map((x) => x.seat)).toEqual([0, 3, 4, 1, 2, 5]);
    expect(draftTurns("duel").map((x) => (x.ban ? "b" : x.seat))).toEqual(["b", "b", 0, 1]);
  });
  it("막히거나 골라진 캐릭터는 다시 못 고름 · 픽은 넘길 수 없음 · 끝까지 가면 모든 자리가 다름", () => {
    const d = newDraft("pair");
    expect(draftAct(d, "warden")).toBe(true);
    expect(draftAct(d, "warden")).toBe(false);
    expect(draftAct(d, null)).toBe(true);
    expect(draftAct(d, null)).toBe(false);
    let n = 0;
    while (!draftDone(d)) draftAct(d, draftAuto(d, () => (n++ * 0.37) % 1));
    expect(new Set(d.picks).size).toBe(4);
    expect(d.picks).not.toContain("warden");
    expect(draftTaken(d).size).toBe(5);
    expect(d.picks.every((c) => c && CHARACTER_IDS.includes(c))).toBe(true);
  });
  it("밴픽으로 정한 AI 자리는 그 캐릭터로 AI가 됨", () => {
    const s = createPvp(3, "duel", [{ characterId: "mage" }, { characterId: "ninja", ai: true }]);
    expect(s.pvp!.seats.map((x) => x.human)).toEqual([true, false]);
    expect(allPlayers(s)[1]!.characterId).toBe("ninja");
  });
});
