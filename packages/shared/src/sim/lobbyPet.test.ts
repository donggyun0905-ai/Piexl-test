import { describe, expect, it } from "vitest";
import { createRun, EMPTY_INPUT, stepSim } from "./index";
import { addGold, damagePlayer } from "./combat";
import { recalcStats } from "./items";
import { checkDeath } from "./run";
import { enemy } from "./perkTestUtil";

describe("로비 펫", () => {
  it("고양이는 가까운 적을 같이 할큄", () => {
    const s = createRun(3, "warden");
    s.pet = "cat";
    s.player.x = s.player.prevX = 60;
    s.player.y = s.player.prevY = 72;
    s.enemies = [{ ...enemy(1, 90, 72, 9999), rootTicks: 9999 }];
    for (let i = 0; i < 70; i++) stepSim(s, EMPTY_INPUT);
    expect(s.enemies[0]!.hp).toBeLessThan(s.enemies[0]!.maxHp);
  });

  it("불사조는 한 번 되살림 · 황금 거북은 돈 +20% · 토끼는 이동 속도 +10%", () => {
    const s = createRun(3, "warden");
    s.pet = "phoenix";
    s.player.hp = 0;
    expect(checkDeath(s)).toBe(false);
    expect(s.player.hp).toBeGreaterThan(0);
    s.player.hp = 0;
    expect(checkDeath(s)).toBe(true);
    const g = createRun(3, "warden");
    g.pet = "turtle";
    addGold(g, 10);
    expect(g.goldEarned).toBe(12);
    const b = createRun(3, "warden");
    const speed = b.player.stats.moveSpeed;
    b.pet = "bunny";
    recalcStats(b);
    expect(b.player.stats.moveSpeed).toBeCloseTo(speed * 1.1);
  });

  it("슬라임은 받는 피해를 줄임", () => {
    const a = createRun(3, "warden");
    const b = createRun(3, "warden");
    b.pet = "slime";
    damagePlayer(a, 20);
    damagePlayer(b, 20);
    expect(b.player.hp).toBeGreaterThan(a.player.hp);
  });
});
