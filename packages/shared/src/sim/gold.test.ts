import { describe, expect, it } from "vitest";
import { addGold, killGold } from "./loot";
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
    expect(killGold(run, a)).toBe(1);
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
