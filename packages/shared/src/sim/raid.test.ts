import { describe, expect, it } from "vitest";
import { ENEMIES } from "../content";
import { allPlayers, eachSeat, useSeat } from "./party";
import { stepParty } from "./partyRun";
import { createRaid, RAID_RULES, raidGymPts, raidOwnPassives } from "./raid";
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
    expect(s.map.rooms.map((r) => r.type)).toEqual(["start", "forge", "altar", "gym", "exit", "golden"]);
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

  it("단련의 방: 포인트 30 + 모자란 전용 패시브만큼 (미니게임 없이 바로 강화)", () => {
    const s = make();
    for (let i = 0; i < 3; i++) goThrough(s, 1);
    expect(s.roomId).toBe(RAID_ROOM.gym);
    expect(s.player.gym?.pts).toBe(raidGymPts("warden"));
  });

  it("레이드 방은 라스트 보스 방의 2배 크기 · 한 틱 진행이 됨", () => {
    const s = make();
    for (let i = 0; i < 4; i++) goThrough(s, 1);
    expect(s.roomCols).toBe(RAID_RULES.BOSS_COLS);
    stepParty(s, [EMPTY_INPUT]);
    eachSeat(s, () => expect(s.player.hp).toBeGreaterThan(0));
  });
});

describe("레이드 루시퍼 1페이즈", () => {
  const fight = () => {
    const s = make();
    for (let i = 0; i < 4; i++) goThrough(s, 1);
    return s;
  };
  it("레이드 방: 루시퍼 + 석화의 기둥 4개 · AI도 같이 싸움 · 결정성", () => {
    const a = fight();
    const b = fight();
    expect(a.enemies.filter((e) => e.kind === "lucpillar")).toHaveLength(4);
    expect(a.enemies.find((e) => e.kind === "lucifer")?.maxHp).toBe(248000);
    for (let t = 0; t < 900; t++) {
      stepParty(a, [EMPTY_INPUT]);
      stepParty(b, [EMPTY_INPUT]);
    }
    expect(allPlayers(a).map((p) => [Math.round(p.x), Math.round(p.y), Math.round(p.hp)])).toEqual(allPlayers(b).map((p) => [Math.round(p.x), Math.round(p.y), Math.round(p.hp)]));
    expect(a.raidBoss?.fight?.atkN).toBeGreaterThan(3);
    // 결과표: AI가 준 피해·받은 피해가 기록됨 · 기둥은 보스라 처형·즉사가 걸리지 않음
    expect(allPlayers(a).some((p) => (p.raidStat?.dealt ?? 0) > 0)).toBe(true);
    expect(ENEMIES.lucpillar.boss && ENEMIES.lucsword.boss).toBe(true);
  });

  it("1분마다 석화의 빔: 보호막 10000 (겹치지 않음)", () => {
    const s = fight();
    for (let t = 0; t < 3700; t++) stepParty(s, [EMPTY_INPUT]);
    const boss = s.enemies.find((e) => e.kind === "lucifer")!;
    expect(boss.ward ?? 0).toBeLessThanOrEqual(10000);
    expect(boss.ward ?? 0).toBeGreaterThan(0);
  });

  it("기둥이 부서지면 기절 + 검기 5번 · 넷이면 흰색 돔 → 컷신", () => {
    const s = fight();
    for (const e of s.enemies) if (e.kind === "lucpillar") e.hp = 0;
    for (let t = 0; t < 3; t++) stepParty(s, [EMPTY_INPUT]);
    expect(s.raidBoss?.fight?.down).toBe(4);
    expect(s.raidBoss?.fight?.slashN).toBe(5);
    for (let t = 0; t < 1200 && !s.raidBoss?.fight?.cut; t++) stepParty(s, [EMPTY_INPUT]);
    expect(s.raidBoss?.fight?.cut).toBe("pillars");
  });

  it("1페이즈 체력을 다 깎으면 변신 컷신 → 2페이즈 (넘친 피해 버림)", () => {
    const s = fight();
    const boss = s.enemies.find((e) => e.kind === "lucifer")!;
    boss.hp = 150000;
    stepParty(s, [EMPTY_INPUT]);
    expect(boss.hp).toBe(160000);
    expect(s.raidBoss?.fight?.cut).toBe("change");
    for (let t = 0; t < 200; t++) stepParty(s, [EMPTY_INPUT]);
    expect(s.raidBoss?.fight?.phase).toBe(2);
  });

  it("데스 카운트: 쓰러지면 다시 살아남 · 10번이면 끝", () => {
    const s = fight();
    s.player.hp = 0;
    stepParty(s, [EMPTY_INPUT]);
    expect(s.player.raidDeaths).toBe(1);
    expect(s.over).toBe(false);
    for (let t = 0; t < 200; t++) stepParty(s, [EMPTY_INPUT]);
    expect(s.player.hp).toBeGreaterThan(0);
  });
});

describe("레이드 루시퍼 2페이즈", () => {
  const phase2 = () => {
    const s = make();
    for (let i = 0; i < 4; i++) goThrough(s, 1);
    const boss = s.enemies.find((e) => e.kind === "lucifer")!;
    boss.hp = 150000;
    for (let t = 0; t < 200; t++) stepParty(s, [EMPTY_INPUT]);
    return { s, boss };
  };
  it("변신 뒤 절망의 검 4개 · 다 부수면 컷신 → 낙하 검 → 사슬 → 1대5", () => {
    const { s } = phase2();
    expect(s.raidBoss?.fight?.p2).toBe("swords");
    expect(s.enemies.filter((e) => e.kind === "lucsword")).toHaveLength(4);
    for (const e of s.enemies) if (e.kind === "lucsword") e.hp = 0;
    for (let t = 0; t < 5; t++) stepParty(s, [EMPTY_INPUT]);
    expect(s.raidBoss?.fight?.cut).toBe("p2");
    for (let t = 0; t < 900 && s.raidBoss?.fight?.p2 !== "chain"; t++) stepParty(s, [EMPTY_INPUT]);
    expect(s.raidBoss?.fight?.p2).toBe("chain");
    for (let t = 0; t < 400; t++) stepParty(s, [EMPTY_INPUT]);
    expect(s.raidBoss?.fight?.p2).toBe("open");
  });

  it("30줄 이하: 날개 → 바닥이 꺼지면 날개 없는 사람은 끝 · 체력 0이면 쓰러지는 컷신 → 보상 방 상자 → 승리", () => {
    const { s, boss } = phase2();
    for (const e of s.enemies) if (e.kind === "lucsword") e.hp = 0;
    for (let t = 0; t < 1400 && s.raidBoss?.fight?.p2 !== "open"; t++) stepParty(s, [EMPTY_INPUT]);
    boss.hp = 10000;
    stepParty(s, [EMPTY_INPUT]);
    expect(s.raidBoss?.fight?.p2).toBe("wings");
    s.player.raidWing = true;
    for (let t = 0; t < 700; t++) stepParty(s, [EMPTY_INPUT]);
    expect(s.raidBoss?.fight?.p2).toBe("sky");
    expect(s.player.hp).toBeGreaterThan(0);
    boss.hp = 0;
    for (let t = 0; t < 200 && s.roomId !== RAID_ROOM.reward; t++) stepParty(s, [EMPTY_INPUT]);
    // 보상 방: 모두 살아나고 가운데 상자 · 부수면 열리고 잠시 뒤 승리
    expect(s.roomId).toBe(RAID_ROOM.reward);
    eachSeat(s, () => expect(s.player.hp).toBeGreaterThan(0));
    const chest = s.enemies.find((e) => e.kind === "lucchest")!;
    expect(chest).toBeDefined();
    chest.hp = 0;
    stepParty(s, [EMPTY_INPUT]);
    expect(s.raidBoss?.fight?.opened).toBeDefined();
    for (let t = 0; t < 600 && !s.over; t++) stepParty(s, [EMPTY_INPUT]);
    expect(s.won).toBe(true);
  });
});
