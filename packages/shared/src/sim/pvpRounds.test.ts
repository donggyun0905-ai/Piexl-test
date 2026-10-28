import { describe, expect, it } from "vitest";
import { PW } from "../paewangDefs";
import { allPlayers } from "./party";
import { createPvp, stepPvp } from "./pvp";
import { inPlay } from "./pvpWorld";
import { EMPTY_INPUT, type RunState } from "./types";

/** 상대 편(1)에서 나와 있는 사람을 쓰러뜨림 */
function downFoes(s: RunState): void {
  allPlayers(s).forEach((p, i) => {
    if (s.pvp!.seats[i]!.team === 1 && inPlay(s, i)) p.hp = 0;
  });
}

describe("패왕전 3판 2선승", () => {
  it("2대2: 네 자리, 두 명씩 편", () => {
    const s = createPvp(3, "pair", [{ characterId: "warden" }]);
    expect(s.pvp!.seats.map((x) => x.team)).toEqual([0, 0, 1, 1]);
  });

  it("토너먼트: 상대 셋을 모두 이기면 한 판 · 다음 판은 편마다 첫 사람부터 다시 · 두 판이면 승리", () => {
    const s = createPvp(4, "tourney", [{ characterId: "warden" }]);
    s.tick = PW.ready;
    for (let k = 0; k < 4000 && (s.pvp!.round ?? 1) === 1; k++) {
      allPlayers(s)[0]!.hp = allPlayers(s)[0]!.stats.maxHp;
      downFoes(s);
      stepPvp(s, [EMPTY_INPUT]);
    }
    expect(s.pvp!.round).toBe(2);
    expect(s.pvp!.seats.filter((x) => x.team === 1).map((x) => x.deaths)).toEqual([1, 1, 1]);
    expect(s.pvp!.seats.map((x) => x.on)).toEqual([true, false, false, true, false, false]);
    // 다음 판 준비 동안은 아무도 못 움직임
    expect(s.pvp!.readyAt).toBeGreaterThan(s.tick);
    for (let k = 0; k < 8000 && !s.over; k++) {
      allPlayers(s)[0]!.hp = allPlayers(s)[0]!.stats.maxHp;
      if (s.tick > s.pvp!.readyAt!) downFoes(s);
      stepPvp(s, [EMPTY_INPUT]);
    }
    expect(s.over && s.won).toBe(true);
    expect(s.pvp!.wins).toEqual({ 0: 2 });
  });
});
