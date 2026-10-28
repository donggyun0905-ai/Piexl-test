import { describe, expect, it } from "vitest";
import { PW_MODE } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { inBush } from "./paewangGrid";
import { allPlayers, useSeat } from "./party";
import { createPvp, stepPvp } from "./pvp";
import { createPractice } from "./pvpPractice";
import { EMPTY_INPUT } from "./types";
import { botInput } from "./pvpBot";
import { markHidden, syncProxies } from "./pvpWorld";

describe("패왕전 수풀", () => {
  it("수풀에 숨으면 멀리 있는 AI는 못 노리고, 마지막 본 곳(수풀 쪽)을 찾아가 직접 조준해 때림 · 가까이 오면 보임", () => {
    const arena = PW_MODE.duel.maps.find((m) => PW_ARENAS[m].bushes.length > 0)!;
    const s = createPvp(1, "duel", [{ characterId: "mage" }], arena);
    let spot: { x: number; y: number } | null = null;
    for (let x = ROOM_MIN_X; x < ROOM_MAX_X && !spot; x += 4) for (let y = ROOM_MIN_Y; y < ROOM_MAX_Y && !spot; y += 4) if (inBush(arena, x, y)) spot = { x, y };
    const [me, bot] = allPlayers(s);
    Object.assign(me!, spot);
    Object.assign(bot!, { x: spot!.x + 120, y: spot!.y });
    syncProxies(s);
    useSeat(s, 1);
    markHidden(s);
    expect(s.enemies[0]!.pwHid).toBe(true);
    expect(botInput(s).attack).toBe(false);
    Object.assign(s.pvp!.seats[1]!, { seenX: spot!.x, seenY: spot!.y, seenT: 60 });
    const hunt = botInput(s);
    expect(hunt.autoAim).toBe(false);
    expect(hunt.aimX).toBeLessThan(0);
    Object.assign(s.player, { x: spot!.x + 20 });
    markHidden(s);
    expect(s.enemies[0]!.pwHid).toBe(false);
  });
});

describe("패왕전 연습장", () => {
  it("나 혼자 + 허수아비 셋 · 쓰러져도 바로 다시 참(판이 안 끝남) · 스킬 대기 없음 · 가만히 서 있음", () => {
    const s = createPractice(5, "mage");
    expect(s.pvp!.seats.map((x) => x.on)).toEqual([true, false, false, true, true, true]);
    const dummy = allPlayers(s)[3]!;
    const at = { x: dummy.x, y: dummy.y };
    for (let n = 0; n < 300; n++) stepPvp(s, [EMPTY_INPUT]);
    expect({ x: dummy.x, y: dummy.y }).toEqual(at);
    dummy.hp = -5;
    s.player.pwCd = [99, 99, 99, 99];
    stepPvp(s, [EMPTY_INPUT]);
    expect(dummy.hp).toBe(dummy.stats.maxHp);
    expect(s.player.pwCd).toEqual([0, 0, 0, 0]);
    expect(s.pvp!.winner).toBeUndefined();
  });
});

describe("패왕전 소환물", () => {
  it("소환한 것은 상대 목록에 들어가 맞고, 체력이 다하면 부서짐", () => {
    const s = createPvp(7, "duel", [{ characterId: "engineer" }, { characterId: "mage", ai: true }]);
    s.tick = 400;
    s.player.pwCd = [0, 0, 0, 0];
    stepPvp(s, [{ ...EMPTY_INPUT, skill: 1, aimX: 100, aimY: 0 }]);
    const m = s.pvp!.mins?.[0];
    expect(m?.body?.hp).toBeGreaterThan(0);
    useSeat(s, 1);
    markHidden(s);
    expect(s.enemies).toContain(m!.body);
    useSeat(s, 0);
    m!.body!.hp = 0;
    stepPvp(s, [EMPTY_INPUT]);
    expect(s.pvp!.mins!.length).toBe(0);
  });
});
