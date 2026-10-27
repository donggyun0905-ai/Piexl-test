import { describe, expect, it } from "vitest";
import { HIDDEN_CHARACTERS } from "../characters";
import { FATES } from "../voyagerFates";
import { VOYAGER as V } from "../weaponsVoyager";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

function voyager(...perks: string[]): RunState {
  const s = createRun(7, "voyager");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 110, 72, 999999), rootTicks: 999999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("운명의 여행자", () => {
  it("히든 · 운명 36칸 (버프·기술·능력)", () => {
    expect(HIDDEN_CHARACTERS).toContain("voyager");
    expect(FATES).toHaveLength(36);
  });

  it("처음부터 운명이 있고, 모래시계가 다 차면 뒤집혀 새 운명", () => {
    const s = voyager();
    stepSim(s, FIRE);
    expect(s.player.vyFate).toBeDefined();
    expect(s.player.vyFate!.dice).toHaveLength(1);
    for (let i = 0; i < V.glass + 2; i++) stepSim(s, FIRE);
    expect(s.player.vyFlips).toBe(2);
  });

  it("주사위 하나는 첫 눈의 줄 · 두 개의 주사위는 정확한 칸 · 손때 묻은 주사위는 1이 없음", () => {
    for (let seed = 1; seed < 30; seed++) {
      const one = createRun(seed, "voyager");
      stepSim(one, FIRE);
      const f = one.player.vyFate!;
      expect(Math.floor(f.i / 6)).toBe(f.dice[0]! - 1);
      const two = createRun(seed, "voyager");
      two.player.passives.push("vyTwinDice", "vyLoadedDie" as never);
      stepSim(two, FIRE);
      const g = two.player.vyFate!;
      expect(g.i).toBe((g.dice[0]! - 1) * 6 + g.dice[1]! - 1);
      expect(Math.min(...g.dice)).toBeGreaterThan(1);
    }
  });

  it("모은 한 발은 덜 모은 것보다 셈", () => {
    const s = voyager();
    for (let i = 0; i < 200 && lost(s) === 0; i++) stepSim(s, FIRE);
    expect(lost(s)).toBeGreaterThan(s.player.stats.damage);
  });

  it("36칸 운명 모두: 쏘고 능력이 돌아도 오류 없이 적에게 피해", () => {
    for (let i = 0; i < 36; i++) {
      const s = voyager();
      stepSim(s, FIRE);
      s.player.vyFate = { i, dice: [Math.floor(i / 6) + 1], pips: 3 };
      s.enemies.push({ ...enemy(2, 80, 100, 999999), rootTicks: 999999 });
      for (let t = 0; t < 700; t++) stepSim(s, FIRE);
      expect(lost(s), `운명 ${i}`).toBeGreaterThan(0);
    }
  });
});
