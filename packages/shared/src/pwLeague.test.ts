import { describe, expect, it } from "vitest";
import { advanceLeague, createLeague, decideMode, LEAGUE_MODES, leagueOut, myMatch, quickWinner } from "./pwLeague";

describe("월드 워 리그", () => {
  it("8팀 → 8강 넷 → 4강 둘 → 결승 하나 · 같은 시드는 같은 대진", () => {
    const l = createLeague(3);
    expect(l.teams).toHaveLength(8);
    expect(createLeague(3)).toEqual(l);
    for (let r = 0; r < 3; r++) {
      for (const m of l.rounds[r]!) m.winner = m.a === 0 || m.b === 0 ? 0 : quickWinner(l, m);
      const champ = advanceLeague(l);
      if (r < 2) expect(l.rounds[r + 1]).toHaveLength(2 - r === 2 ? 2 : 1);
      else expect(champ).toBe(0);
    }
    expect(leagueOut(l)).toBe(false);
  });
  it("대결 유형: 두 팀 선택이 같으면 그대로, 다르면 둘 중 하나", () => {
    const l = createLeague(5);
    const m = myMatch(l)!;
    for (const mine of LEAGUE_MODES) expect(LEAGUE_MODES).toContain(decideMode(l, m, mine));
  });
});
