import { describe, expect, it } from "vitest";
import { lucCovers, LUC_COVER_RULES as C } from "./lucCover";
import { LUC_RULES } from "./lucKit";
import { damageEnemy, damagePlayer } from "./combat";
import { stepParty } from "./partyRun";
import { createRaid, raidGymPts, raidLocked, raidOwnPassives, type RaidMember } from "./raid";
import { RAID_OP, RAID_PREP_RULES as P, raidCdLeft } from "./raidPrep";
import { RAID_ROOM } from "./raidTypes";
import { goThrough } from "./rooms";
import { stationAt, stationMenu } from "./station";
import { EMPTY_INPUT, type RunState, type TickInput } from "./types";

const make = (c: RaidMember["characterId"] = "warden") => createRaid(7, "lucifer", [{ characterId: c, unlocks: [] }]);
const go = (s: RunState, n: number) => {
  for (let i = 0; i < n; i++) goThrough(s, 1);
};
const press = (input: Partial<TickInput>) => ({ ...EMPTY_INPUT, ...input });

describe("레이드 준비 고치기", () => {
  it("전용 패시브가 30개보다 적으면 하나마다 단련 3 · 변희는 동물 능력도 모두", () => {
    expect(raidGymPts("collector")).toBe(30);
    expect(raidGymPts("warden")).toBe(30 + 20 * 3);
    expect(raidGymPts("novice")).toBe(30 + 30 * 3);
    expect(raidOwnPassives("byeonhui").length).toBe(30);
  });

  it("풋내기: 레벨 30 · 스탯 포인트 29 · 진영 특징 꺼짐", () => {
    const s = make("novice");
    expect(s.player.lv).toBe(30);
    expect(s.player.points).toBe(29);
    expect(s.noFaction).toBe(true);
  });

  it("준비 방은 앞 방으로 돌아갈 수 있음 (레이드 방은 못 돌아감) · 성좌는 앞 방으로는 잠기지 않음", () => {
    const s = make();
    go(s, 2);
    expect(s.roomId).toBe(RAID_ROOM.altar);
    expect(raidLocked(s, 0)).toBe(false);
    expect(raidLocked(s, 1)).toBe(true);
    goThrough(s, 0);
    expect(s.roomId).toBe(RAID_ROOM.forge);
    expect(s.map.rooms[RAID_ROOM.boss]!.exits[0]).toBe(-1);
  });

  it("성좌: 다른 제단에서 대가 없이 바꿈 (증강은 늘 하나)", () => {
    const s = make();
    go(s, 2);
    const stands = s.rooms[s.roomId]!.pickups.filter((pk) => pk.kind === "altar" && pk.owner === 0);
    stationAt(s, stands[2]!, true);
    s.prompt = { kind: "none" };
    stationAt(s, stands[5]!, true);
    expect(s.player.augments).toHaveLength(1);
    expect(s.player.augments![0]!.alt).not.toBe("hawk");
    expect(s.player.altar?.got).toHaveLength(1);
  });

  it("대장간 처음부터 다시 (999원, 3번까지) · 단련 포인트 되돌리기", () => {
    const s = make();
    go(s, 1);
    s.gold = 10;
    s.player.forge = { [s.player.weaponId]: { lv: 3 } };
    for (let k = 0; k < 4; k++) stationMenu(s, RAID_OP.forgeReset * 4096);
    expect(s.gold).toBe(P.FORGE_GOLD);
    expect(s.player.forge).toBeUndefined();
    expect(s.player.raidResets).toBe(P.FORGE_RESETS);
    go(s, 2);
    const g = s.player.gym!;
    const pts = g.pts;
    stationMenu(s, 10 * 4096 + 0 * 64);
    expect(g.pts).toBe(pts - 1);
    stationMenu(s, RAID_OP.gymDown * 4096 + 0 * 64);
    expect(g.pts).toBe(pts);
    expect(g.lv.damage).toBeUndefined();
  });

  it("단련의 방 샌드백: 쓰러지지 않음", () => {
    const s = make();
    go(s, 3);
    for (let t = 0; t < 3; t++) stepParty(s, [EMPTY_INPUT]);
    const bag = s.enemies.find((e) => e.kind === "dummy")!;
    expect(bag).toBeDefined();
    bag.hp = 10;
    stepParty(s, [EMPTY_INPUT]);
    expect(bag.hp).toBe(bag.maxHp);
  });

  it("사용 아이템: 써도 사라지지 않고 쿨타임 (회복약 10초)", () => {
    const s = make();
    go(s, 4);
    s.player.useSlots = ["potion", "bomb"];
    stepParty(s, [press({ useSlot: 1 })]);
    expect(s.player.useSlots[0]).toBe("potion");
    expect(raidCdLeft(s, 0)).toBeGreaterThan(0.9);
    expect(s.player.raidCd?.[0]).toBe(s.tick + P.CD_POTION);
  });
});

describe("레이드 방 돌기둥·루시퍼 방어", () => {
  const fight = () => {
    const s = make();
    go(s, 4);
    stepParty(s, [EMPTY_INPUT]);
    return s;
  };

  it("처음부터 보호막 · 기둥이 남아 있으면 받는 피해 -25%", () => {
    const s = fight();
    const boss = s.enemies.find((e) => e.kind === "lucifer")!;
    expect(boss.ward).toBe(LUC_RULES.SHIELD);
    boss.ward = 0;
    const hp = boss.hp;
    damageEnemy(s, boss, 100, 1, 0, false);
    expect(hp - boss.hp).toBeCloseTo(75, 0);
  });

  it("돌기둥 옆이면 루시퍼 공격을 막고, 정해진 횟수면 부서졌다 다시 생김", () => {
    const s = fight();
    const c = lucCovers(s)[0]!;
    const p = s.player;
    p.invulnTicks = 0;
    [p.x, p.y] = [c[0]! + C.RADIUS + p.r + 2, c[1]!];
    const hp = p.hp;
    for (let k = 0; k < C.HITS; k++) damagePlayer(s, 10, "lucifer");
    expect(p.hp).toBe(hp);
    expect(c[2]).toBe(0);
    damagePlayer(s, 10, "lucifer");
    expect(p.hp).toBeLessThan(hp);
    s.tick = c[3]!;
    stepParty(s, [EMPTY_INPUT]);
    expect(c[2]).toBe(C.HITS);
  });

  it("석화의 기둥은 밀리지 않음", () => {
    const s = fight();
    const pillar = s.enemies.find((e) => e.kind === "lucpillar")!;
    stepParty(s, [EMPTY_INPUT]);
    const x = pillar.x;
    pillar.x += 80;
    stepParty(s, [EMPTY_INPUT]);
    expect(Math.abs(pillar.x - x)).toBeLessThan(1);
  });
});
