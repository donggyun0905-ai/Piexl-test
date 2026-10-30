import { describe, expect, it } from "vitest";
import { PW_ARENAS, PW_MAP_SETS } from "./paewangMaps";

describe("1대1·토너먼트 경기장 1.5배", () => {
  it("칸 수가 커지고 좌우 거울이 그대로 (공평)", () => {
    for (const id of PW_MAP_SETS.duel) {
      const a = PW_ARENAS[id];
      expect(a.cols).toBeGreaterThanOrEqual(31);
      expect(a.rows).toBeGreaterThanOrEqual(19);
      for (const k of ["walls", "rocks", "ponds", "bushes", "traps", "mud", "lava", "water", "spikes"] as const) {
        const l = a[k] ?? [];
        for (const [c, r, w, h] of l) expect(l.some(([c2, r2, w2, h2]) => c2 === a.cols - c - w && r2 === r && w2 === w && h2 === h), `${id} ${k} ${c},${r}`).toBe(true);
      }
      a.teamA.forEach(([c, r], i) => expect(a.teamB[i]).toEqual([a.cols - 1 - c, r]));
    }
  });
});
