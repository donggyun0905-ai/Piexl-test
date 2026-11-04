import { describe, expect, it } from "vitest";
import "../balanceTables";
import { PASSIVE_IDS } from "../items";
import { passiveTag } from "../itemsTags";
import { createRng } from "../rng";
import { biasOf, pickPassives } from "./buildBias";
import { recalcStats } from "./items";
import { passivePool } from "./loot";
import { createRun } from "./run";

describe("보상 편향", () => {
  it("꼬리표가 없으면 편향 없음", () => {
    expect(biasOf(createRun(3, "warden"))).toBeNull();
  });

  it("가장 많이 가진 꼬리표가 더 잘 나오고, 셋 중 한 칸은 다른 꼬리표", () => {
    const s = createRun(3, "warden");
    s.player.passives.push(...PASSIVE_IDS.filter((id) => passiveTag(id) === "sharp").slice(0, 6));
    recalcStats(s);
    expect(biasOf(s)).toEqual({ tag: "sharp", mul: 2.5 });
    const pool = passivePool(s);
    const base = pool.filter((id) => passiveTag(id) === "sharp").length / pool.length;
    let hit = 0;
    let total = 0;
    for (let i = 0; i < 400; i++) {
      const got = pickPassives(s, createRng(i + 1), pool, 3);
      expect(got.some((id) => passiveTag(id) !== "sharp")).toBe(true);
      hit += got.filter((id) => passiveTag(id) === "sharp").length;
      total += got.length;
    }
    expect(hit / total).toBeGreaterThan(base * 1.3);
  });
});
