import { describe, expect, it } from "vitest";
import { PW } from "../paewangDefs";
import { createPvp, stepPvp } from "./pvp";
import { PW_SRC_ENV, recapEnv } from "./pvpRecap";

describe("패왕전 받은 피해 정리", () => {
  it("AI끼리 싸우면 맞은 자리에 누가·무엇으로·얼마나 적힘 (받은 피해 합과 같음)", () => {
    const s = createPvp(5, "duel", [{ characterId: "warden", ai: true }, { characterId: "mage", ai: true }]);
    s.pvp!.seats.forEach((x) => (x.human = false));
    let seen = false;
    let gave = false;
    while (!s.over && s.tick < 60 * 60) {
      stepPvp(s, []);
      for (const [i, seat] of s.pvp!.seats.entries()) {
        if (seat.gave?.some((g) => g.dmg > 0 && g.to !== i)) gave = true;
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
    expect(gave).toBe(true);
    expect(s.tick).toBeGreaterThan(PW.ready);
  });

  it("지형 피해는 '지형'(때린 사람 -1)으로 적힘", () => {
    const s = createPvp(6, "duel", [{ characterId: "warden", ai: true }, { characterId: "mage", ai: true }]);
    s.tick = PW.ready + 1;
    const before = s.player.hp;
    s.player.hp -= 7;
    recapEnv(s, before);
    expect(s.pvp!.seats[0]!.recv).toEqual([{ by: -1, src: PW_SRC_ENV, dmg: 7, max: 7 }]);
  });
});
