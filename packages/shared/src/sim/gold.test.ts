import { describe, expect, it } from "vitest";
import { addGold, killGold, LOOT_RULES } from "./loot";
import { createRun } from "./run";
import { makeEnemy } from "./util";

describe("던전 돈", () => {
  it("몬스터 하나에 1 · 정예 10 · 날벌레 무리는 마지막 하나를 잡을 때만 1", () => {
    const run = createRun(3, "warden");
    const champ = Object.assign(makeEnemy(run, "golem", 50, 50, 1, 30), { champ: true, champK: 2 });
    const a = Object.assign(makeEnemy(run, "gnat", 60, 50, 1, 30), { flock: 77 });
    const b = Object.assign(makeEnemy(run, "gnat", 62, 50, 1, 30), { flock: 77 });
    run.enemies = [a, b];
    expect(killGold(run, champ)).toBe(10);
    expect(killGold(run, a)).toBe(0);
    b.hp = 0;
    const chance = LOOT_RULES.GOLD_CHANCE;
    LOOT_RULES.GOLD_CHANCE = 1;
    expect(killGold(run, a)).toBe(1);
    LOOT_RULES.GOLD_CHANCE = chance;
  });

  it("보통 몬스터는 확률로만 돈 (시드로 정해짐, 같은 적은 늘 같은 결과) · 라스트 보스 층은 0", () => {
    const run = createRun(3, "warden");
    const foes = Array.from({ length: 200 }, (_, i) => Object.assign(makeEnemy(run, "golem", 50, 50, 1, 30), { id: 5000 + i }));
    const got = foes.filter((e) => killGold(run, e) > 0).length;
    expect(got / foes.length).toBeGreaterThan(LOOT_RULES.GOLD_CHANCE - 0.12);
    expect(got / foes.length).toBeLessThan(LOOT_RULES.GOLD_CHANCE + 0.12);
    expect(foes.map((e) => killGold(run, e))).toEqual(foes.map((e) => killGold(run, e)));
    run.lastBoss = "dragon";
    run.floor = 7;
    expect(foes.every((e) => killGold(run, e) === 0)).toBe(true);
  });

  it("돈은 999까지만 (넘친 만큼은 번 돈에도 안 들어감)", () => {
    const run = createRun(3, "warden");
    run.gold = 995;
    const earned = run.goldEarned;
    addGold(run, 20);
    expect(run.gold).toBe(999);
    expect(run.goldEarned).toBe(earned + 4);
  });
});
