import { describe, expect, it } from "vitest";
import { allPlayers, eachSeat, useSeat } from "./party";
import { stepParty } from "./partyRun";
import { createRaid, RAID_RULES, raidOwnPassives } from "./raid";
import { RAID_ROOM } from "./raidTypes";
import { goThrough } from "./rooms";
import { stationAt } from "./station";
import { EMPTY_INPUT } from "./types";

const make = () => createRaid(7, "lucifer", [{ characterId: "warden", unlocks: [] }]);

describe("레이드 준비", () => {
  it("빈자리는 AI로 채워 늘 5명 · 전용 패시브 전부 + 여신의 축복 · 999원", () => {
    const s = make();
    expect(s.party).toHaveLength(RAID_RULES.SEATS);
    expect(s.raidBoss?.ai).toEqual([false, true, true, true, true]);
    expect(s.player.passives).toEqual([...raidOwnPassives("warden"), "goddessBlessing"]);
    expect(s.gold).toBe(RAID_RULES.GOLD);
    expect(s.player.useSlots).toEqual([null, null]);
    expect(s.map.rooms.map((r) => r.type)).toEqual(["start", "forge", "altar", "gym", "exit"]);
  });

  it("같은 시드면 같은 AI (결정성)", () => {
    const a = make();
    const b = make();
    expect(allPlayers(a).map((p) => [p.characterId, p.weaponId, p.useSlots])).toEqual(allPlayers(b).map((p) => [p.characterId, p.weaponId, p.useSlots]));
    // AI는 성좌 증강·단련을 미리 받음
    useSeat(a, 1);
    expect(a.player.augments).toHaveLength(1);
    expect(Object.values(a.player.gym?.lv ?? {}).reduce((x, y) => x + y, 0)).toBeGreaterThan(0);
  });

  it("무장실: 무기 전부·사용 아이템 (사람마다)", () => {
    const s = make();
    const mine = s.rooms[RAID_ROOM.armory]!.pickups.filter((pk) => pk.owner === 0);
    expect(mine.some((pk) => pk.kind === "weapon")).toBe(true);
    expect(mine.filter((pk) => pk.kind === "use").length).toBeGreaterThan(2);
    // AI 자리에는 놓지 않아도 됨 (AI 것도 놓이지만 자기 것만 보임)
    expect(s.rooms[RAID_ROOM.armory]!.pickups.every((pk) => pk.owner !== undefined)).toBe(true);
  });

  it("성좌의 방: 제단 8개 · F로 가운데 카드 증강을 대가 없이 · 고르기 전에는 못 나감", () => {
    const s = make();
    goThrough(s, 1);
    goThrough(s, 1);
    expect(s.roomId).toBe(RAID_ROOM.altar);
    const stands = s.rooms[s.roomId]!.pickups.filter((pk) => pk.kind === "altar" && pk.owner === 0);
    expect(stands).toHaveLength(8);
    const before = s.player.passives.length;
    stationAt(s, stands[2]!, true);
    expect(s.player.augments).toHaveLength(1);
    expect(s.player.augments![0]!.alt).toBe("hawk");
    expect(s.player.passives.length).toBe(before);
    expect(s.player.altar?.last?.card).toBe(1);
  });

  it("단련의 방: 포인트 30 (미니게임 없이 바로 강화)", () => {
    const s = make();
    for (let i = 0; i < 3; i++) goThrough(s, 1);
    expect(s.roomId).toBe(RAID_ROOM.gym);
    expect(s.player.gym?.pts).toBe(RAID_RULES.GYM_PTS);
  });

  it("레이드 방은 라스트 보스 방의 2배 크기 · 한 틱 진행이 됨", () => {
    const s = make();
    for (let i = 0; i < 4; i++) goThrough(s, 1);
    expect(s.roomCols).toBe(RAID_RULES.BOSS_COLS);
    stepParty(s, [EMPTY_INPUT]);
    eachSeat(s, () => expect(s.player.hp).toBeGreaterThan(0));
  });
});
