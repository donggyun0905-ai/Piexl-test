import { describe, expect, it } from "vitest";
import { BOSS_TIERS, LAST_BOSSES } from "../content";
import { raidCleared } from "../raid";
import { spawnBoss } from "./bosses";
import { depth, HERO_FLOORS, heroBosses, heroNext, heroPair } from "./hero";
import { createRun } from "./index";
import { startFloor } from "./rooms";

const hero = (seed = 3) => createRun(seed, "warden", [], false, false, false, true);

describe("영웅의 길", () => {
  it("13단계: 4단계씩 1·2·3단계 보스, 묶음 앞 둘은 1마리 · 뒤 둘은 서로 다른 2마리", () => {
    for (let seed = 1; seed < 30; seed++) {
      const s = hero(seed);
      for (let f = 1; f <= 12; f++) {
        s.floor = f;
        const list = heroBosses(s);
        expect(list).toHaveLength((f - 1) % 4 < 2 ? 1 : 2);
        expect(new Set(list).size).toBe(list.length);
        for (const b of list) expect(BOSS_TIERS[Math.floor((f - 1) / 4)]).toContain(b);
      }
    }
  });

  it("세기는 보통 판에 맞춤 (12단계 = 6.5층, 13단계 = 라스트 보스 층), 보통 판은 층 그대로", () => {
    const s = hero();
    s.floor = 1;
    expect(depth(s)).toBe(1);
    s.floor = 12;
    expect(depth(s)).toBe(6.5);
    s.floor = 13;
    expect(depth(s)).toBe(7);
    const n = createRun(3, "warden");
    n.floor = 5;
    expect(depth(n)).toBe(5);
  });

  it("보스 2마리 단계는 한 마리마다 체력 80%", () => {
    const s = hero();
    s.floor = 3;
    const one = spawnBoss(s, "hulk").maxHp;
    const pair = heroPair([spawnBoss(s, "hulk"), spawnBoss(s, "brood")]);
    expect(pair[0]!.maxHp).toBe(Math.round(one * 0.8));
  });

  it("12단계 계단 → 랜덤 라스트 보스 13단계, 13단계 계단 → 완료 (레이드 기록에는 들어가지 않음)", () => {
    const s = hero();
    startFloor(s, 12);
    heroNext(s, startFloor);
    expect(s.floor).toBe(HERO_FLOORS);
    expect(LAST_BOSSES).toContain(s.lastBoss);
    expect(s.map.rooms[s.map.exitId]!.type).toBe("exit");
    expect(s.map.rooms.length).toBeLessThan(6); // 라스트 보스 층 지도 (짧음)
    heroNext(s, startFloor);
    expect(s.won).toBe(true);
    s.raidTicks = 100;
    expect(raidCleared(s)).toBe(false);
  });
});
