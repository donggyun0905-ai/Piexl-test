import { describe, expect, it } from "vitest";
import { ENEMIES } from "../content";
import { removeDead } from "./combat";
import { minionKinds } from "./critters";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { spawnEnemies, startFloor } from "./rooms";
import { makeEnemy } from "./util";

function room(): RunState {
  const s = createRun(3, "warden");
  s.enemies = [];
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  return s;
}

describe("던전의 타워 디펜스 적 8종", () => {
  it("층마다: 슬라임 1층부터 · 도마뱀·박쥐 2층 · 딱정벌레·도깨비불 3층 · 주술사·알주머니 4층 · 골렘 5층 (한 방에 한 마리)", () => {
    expect(minionKinds(1)).toContain("slime");
    expect(minionKinds(1)).not.toContain("runner");
    expect(minionKinds(2)).toEqual(expect.arrayContaining(["runner", "bat"]));
    expect(minionKinds(3)).toEqual(expect.arrayContaining(["beetle", "wisp"]));
    expect(minionKinds(3)).not.toContain("shaman");
    expect(minionKinds(4)).toEqual(expect.arrayContaining(["shaman", "eggsac"]));
    expect(minionKinds(4)).not.toContain("golem");
    expect(minionKinds(5)).toContain("golem");
    let golems = 0;
    for (let seed = 1; seed < 40; seed++) {
      const s = createRun(seed, "warden");
      startFloor(s, 6);
      for (const r of s.map.rooms) {
        if (r.type !== "combat" && r.type !== "elite") continue;
        const n = spawnEnemies(s, r.id, r.type === "elite").filter((e) => e.kind === "golem").length;
        expect(n).toBeLessThanOrEqual(1);
        golems += n;
      }
    }
    expect(golems).toBeGreaterThan(0);
    for (const k of ["slime", "runner", "bat", "beetle", "golem", "shaman", "eggsac", "wisp"] as const) expect(ENEMIES[k].contactDamage).toBeGreaterThan(0);
  });

  it("알주머니가 터지면 돈 없는 작은 슬라임 셋 (타워 디펜스 알주머니는 따로)", () => {
    const s = room();
    const egg = makeEnemy(s, "eggsac", 120, 72, 1, 0);
    egg.hp = 0;
    s.enemies = [egg];
    removeDead(s);
    expect(s.enemies.map((e) => e.kind)).toEqual(["slime", "slime", "slime"]);
    expect(s.enemies.every((e) => e.noGold)).toBe(true);
    const t = room();
    const tdEgg = { ...makeEnemy(t, "eggsac", 120, 72, 1, 0), hp: 0, tdPath: 0 };
    t.enemies = [tdEgg];
    removeDead(t);
    expect(t.enemies).toHaveLength(0);
  });

  it("주술사는 주변 적을 회복 · 도깨비불은 플레이어 쪽으로 순간이동", () => {
    const s = room();
    const shaman = makeEnemy(s, "shaman", 150, 72, 1, 1);
    const ally = makeEnemy(s, "crawler", 160, 72, 1, 99);
    ally.hp = 10;
    s.enemies = [shaman, ally];
    stepSim(s, EMPTY_INPUT);
    expect(ally.hp).toBeGreaterThan(10);
    const t = room();
    const wisp = makeEnemy(t, "wisp", 180, 72, 1, 1);
    t.enemies = [wisp];
    stepSim(t, EMPTY_INPUT);
    expect(wisp.x).toBeLessThan(150);
  });
});
