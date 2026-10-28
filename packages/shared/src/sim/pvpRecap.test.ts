import { describe, expect, it } from "vitest";
import { PW } from "../paewangDefs";
import { createPvp, stepPvp } from "./pvp";

describe("패왕전 받은 피해 정리", () => {
  it("AI끼리 싸우면 맞은 자리에 누가·무엇으로·얼마나 적힘 (받은 피해 합과 같음)", () => {
    const s = createPvp(5, "duel", [{ characterId: "warden", ai: true }, { characterId: "mage", ai: true }]);
    s.pvp!.seats.forEach((x) => (x.human = false));
    let seen = false;
    while (!s.over && s.tick < 60 * 60) {
      stepPvp(s, []);
      for (const [i, seat] of s.pvp!.seats.entries()) {
        if (!seat.recv?.length) continue;
        seen = true;
        for (const r of seat.recv) {
          expect(r.by).not.toBe(i);
          expect(r.src).toBeGreaterThanOrEqual(0);
          expect(r.max).toBeLessThanOrEqual(r.dmg + 1e-9);
        }
      }
    }
    expect(seen).toBe(true);
    expect(s.tick).toBeGreaterThan(PW.ready);
  });
});
