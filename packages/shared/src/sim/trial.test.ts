import { describe, expect, it } from "vitest";
import "../balanceTables";
import { generateFloor } from "./floor";
import { goThrough, startFloor } from "./rooms";
import { menuCode } from "./station";
import { createRun, stepSim } from "./run";
import { TRIAL_OP, trialBusy, trialUsed } from "./trial";
import { startTrial } from "./trialRun";
import { chestOptions, spillRewards, trialRewardRow } from "./trialRewards";
import { EMPTY_INPUT, type RunState } from "./types";

const menu = (s: RunState, code: number) => stepSim(s, { ...EMPTY_INPUT, menu: code });

/** 4층 시련의 방에 들어간 판 */
function inTrial(seed = 5, c: "warden" | "drifter" = "warden"): RunState {
  const s = createRun(seed, c);
  startFloor(s, 4);
  const room = s.map.rooms.find((r) => r.type === "trial")!;
  const from = s.map.rooms.find((r) => r.exits.includes(room.id))!;
  s.roomId = from.id;
  s.rooms[from.id]!.cleared = true;
  goThrough(s, from.exits.indexOf(room.id));
  return s;
}

describe("시련의 방", () => {
  it("4층부터 층마다 하나 (3층까지는 없음) · 가운데 비석", () => {
    for (let seed = 1; seed < 8; seed++) {
      for (const f of [1, 2, 3]) expect(generateFloor(seed, f).rooms.filter((r) => r.type === "trial")).toHaveLength(0);
      for (const f of [4, 5, 6]) expect(generateFloor(seed, f).rooms.filter((r) => r.type === "trial")).toHaveLength(1);
    }
    const s = inTrial();
    expect(s.map.rooms[s.roomId]!.type).toBe("trial");
    expect(s.rooms[s.roomId]!.pickups.filter((p) => p.kind === "trial")).toHaveLength(1);
  });

  it("NO: 벌칙 하나가 걸리고 비석은 다시 못 씀", () => {
    for (let seed = 1; seed < 12; seed++) {
      const s = inTrial(seed);
      const before = { ...s.player.stats };
      menu(s, menuCode(TRIAL_OP.answer, 0));
      expect(trialUsed(s)).toBe(true);
      const n = s.player.trial!.last!.penalty!;
      expect(n).toBeGreaterThanOrEqual(1);
      if (n === 1) expect(s.player.stats.maxHp).toBeLessThan(before.maxHp);
      if (n === 9) expect(s.player.hp).toBe(1);
      if (n === 10) expect(s.player.stats.moveSpeed).toBeLessThan(before.moveSpeed);
      menu(s, menuCode(TRIAL_OP.answer, 1));
      expect(s.trialRun).toBeUndefined();
    }
  });

  it("YES: 시련이 시작되면 방이 잠기고, 무리·보스를 다 잡으면 1000점 보상", () => {
    const s = inTrial();
    startTrial(s, 3);
    expect(trialBusy(s)).toBe(true);
    for (let round = 0; round < 3; round++) {
      for (let i = 0; i < 80 && s.enemies.length === 0; i++) stepSim(s, EMPTY_INPUT);
      expect(s.rooms[s.roomId]!.cleared).toBe(false);
      s.enemies.forEach((e) => (e.hp = 0));
      s.enemies = [];
    }
    for (let i = 0; i < 80 && s.trialRun; i++) stepSim(s, EMPTY_INPUT);
    expect(s.trialRun).toBeUndefined();
    expect(s.player.trial!.last!.score).toBe(1000);
    // 1000점: 원하는 능력치 3 · 고르는 패시브 3 · 고르는 사용 아이템 2 · 되살아남 1 · 비밀의 방 고르기 1 (상자 10)
    expect(s.rooms[s.roomId]!.pickups.filter((p) => p.kind === "boon")).toHaveLength(10);
  });

  it("끝없는 시련: 처치마다 점수 · 쓰러져도 죽지 않고 그 점수로 끝", () => {
    const s = inTrial();
    const hp = s.player.hp;
    startTrial(s, 4);
    for (let i = 0; i < 70; i++) stepSim(s, EMPTY_INPUT);
    expect(s.enemies.length).toBeGreaterThan(0);
    // 시련 몬스터는 돈 없는 적이라 처치 수(kills)에는 안 들어가도 점수는 오름
    const n = s.enemies.length;
    s.enemies.forEach((e) => (e.hp = 0));
    stepSim(s, EMPTY_INPUT);
    expect(s.trialRun!.score).toBe(n * 10);
    s.trialRun!.got = 25;
    s.player.hp = -5;
    s.player.invulnTicks = 0;
    stepSim(s, EMPTY_INPUT);
    expect(s.over).toBe(false);
    expect(s.player.trial!.last!.score).toBe(250);
    expect(s.player.hp).toBe(hp);
    // 200점대 보상: 무작위 능력치 둘
    expect(s.rooms[s.roomId]!.pickups.filter((p) => p.kind === "boon")).toHaveLength(2);
  });

  it("보상 상자: 바로 받는 것 · 창에서 고르는 것 · 되살아남", () => {
    expect(trialRewardRow(450)).toEqual([0, 0, 3, 0, 0, 0]);
    const s = inTrial();
    spillRewards(s, 1000);
    const room = s.rooms[s.roomId]!;
    const pick = room.pickups.find((p) => p.kind === "boon" && p.itemId.startsWith("pp:"))!;
    const n = s.player.passives.length;
    (s.player.trial ??= { rooms: [] }).open = pick.id;
    menu(s, menuCode(TRIAL_OP.chest, 1));
    expect(s.player.passives.length).toBe(n + 1);
    expect(s.player.passives).toContain(chestOptions(pick.itemId)[1]);
    expect(room.pickups.includes(pick)).toBe(false);
    s.player.trial!.revive = 1;
    s.player.hp = 0;
    stepSim(s, EMPTY_INPUT);
    expect(s.over).toBe(false);
    expect(s.player.hp).toBe(s.player.stats.maxHp);
  });

  it("한 판 합계 1000점: 이미 300점이면 이번 시련은 최대 700점 · 1000점을 채우면 시련의 방이 더 안 나옴", () => {
    const s = inTrial();
    s.player.trial = { rooms: [], total: 300 };
    startTrial(s, 3);
    for (let k = 0; k < 4000 && s.trialRun; k++) {
      s.enemies.forEach((e) => (e.hp = 0));
      stepSim(s, EMPTY_INPUT);
    }
    expect(s.player.trial.last!.score).toBe(700);
    expect(s.player.trial.total).toBe(1000);
    startFloor(s, 5);
    expect(s.map.rooms.some((r) => r.type === "trial")).toBe(false);
  });
});
