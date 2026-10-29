import { describe, expect, it } from "vitest";
import { TICK_RATE } from "../constants";
import { PW, PW_MODE } from "../paewangDefs";
import { allPlayers } from "./party";
import { createPvp, stepPvp } from "./pvp";
import { pvpTimeLeft, pvpZone, roundEnd, timeWinner } from "./pvpZone";
import { EMPTY_INPUT } from "./types";

describe("패왕전 시간 제한 · 자기장", () => {
  it("모드마다 시간 제한 (1대1 3분 · 3대3 5분 · 5대5 10분 · 토너먼트 7분 · 대난투 10분 · 데스매치 30분)", () => {
    expect([PW_MODE.duel, PW_MODE.trio, PW_MODE.squad, PW_MODE.tourney, PW_MODE.brawl, PW_MODE.gungame].map((m) => m.timeSec)).toEqual([180, 300, 600, 420, 600, 1800]);
    expect(Object.entries(PW_MODE).filter(([, m]) => m.zone).map(([k]) => k)).toEqual(["squad", "brawl", "giganto"]);
  });

  it("시간이 다 되면 체력 비율이 높은 편이 그 판을 이김", () => {
    const s = createPvp(5, "duel", [{ characterId: "warden" }]);
    expect(pvpTimeLeft(s)).toBe(180);
    s.tick = roundEnd(s);
    const [me, foe] = allPlayers(s);
    me!.hp = me!.stats.maxHp;
    foe!.hp = foe!.stats.maxHp / 3;
    expect(timeWinner(s)).toBe(0);
  });

  it("자기장: 1분마다 다음 원으로 줄어들고 원 밖은 아픔 · 1대1은 자기장 없음", () => {
    const duel = createPvp(5, "duel", [{ characterId: "warden" }]);
    expect(pvpZone(duel)).toBeUndefined();
    const s = createPvp(6, "brawl", [{ characterId: "warden" }]);
    const z0 = pvpZone(s)!;
    s.tick = PW.ready + 60 * TICK_RATE;
    const z1 = pvpZone(s)!;
    expect(z1.r).toBeLessThan(z0.r);
    expect(z1.r).toBeCloseTo(z0.tr);
    expect(z1.tr).toBeLessThan(z1.r);
    // 원 밖에 세워 두면 체력이 깎임
    s.tick = PW.ready + 9 * 60 * TICK_RATE;
    const me = allPlayers(s)[0]!;
    const z = pvpZone(s)!;
    me.x = me.prevX = z.x + z.r + 40;
    me.y = me.prevY = z.y;
    const hp = me.hp;
    for (let i = 0; i < PW.zone.every * 2; i++) {
      me.x = z.x + z.r + 40;
      me.y = z.y;
      me.invulnTicks = 0;
      stepPvp(s, [EMPTY_INPUT]);
    }
    expect(me.hp).toBeLessThan(hp);
  });
});
