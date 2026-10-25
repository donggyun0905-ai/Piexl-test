import { describe, expect, it } from "vitest";
import { computeStats, type Stats } from "./stats";

const base: Stats = { maxHp: 100, damage: 10, attackSpeed: 2, range: 30, moveSpeed: 1.2, projectileSpeed: 3, luck: 0 };

describe("능력치", () => {
  it("아이템이 없으면 기본값", () => {
    expect(computeStats(base, [])).toEqual(base);
  });

  it("더하기 먼저, 곱하기 나중", () => {
    const s = computeStats(base, [
      { stat: "damage", mul: 1.5 },
      { stat: "damage", add: 2 },
    ]);
    expect(s.damage).toBe((10 + 2) * 1.5);
  });

  it("같은 종류 효과는 중첩", () => {
    const s = computeStats(base, [
      { stat: "maxHp", add: 20 },
      { stat: "maxHp", add: 30 },
      { stat: "maxHp", mul: 1.1 },
      { stat: "maxHp", mul: 1.1 },
    ]);
    expect(s.maxHp).toBeCloseTo(150 * 1.21);
  });

  it("상한·하한", () => {
    const s = computeStats(base, [
      { stat: "attackSpeed", mul: 100 },
      { stat: "moveSpeed", add: 10 },
      { stat: "damage", add: -100 },
      { stat: "range", mul: 0 },
    ]);
    expect(s.attackSpeed).toBe(10);
    expect(s.moveSpeed).toBe(2.6);
    expect(s.damage).toBe(1);
    expect(s.range).toBe(12);
  });
});
