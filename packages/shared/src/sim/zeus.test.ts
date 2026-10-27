import { describe, expect, it } from "vitest";
import { HIDDEN_CHARACTERS } from "../characters";
import type { WeaponId } from "../content";
import { ZEUS as Z } from "../weaponsZeus";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

function zeus(weapon: WeaponId = "zsBolt", ...perks: string[]): RunState {
  const s = createRun(9, "zeus");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [
    { ...enemy(1, 80, 72, 999999), rootTicks: 999999 },
    { ...enemy(2, 110, 80, 999999), rootTicks: 999999 },
  ];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("제우스", () => {
  it("히든 캐릭터", () => expect(HIDDEN_CHARACTERS).toContain("zeus"));

  for (const w of ["zsBolt", "zsSky", "zsChain", "zsStorm", "zsAegis", "zsEagle", "zsClap", "zsSpear", "zsOrb", "zsTitan"] as WeaponId[]) {
    it(`무기 ${w}: 적에게 피해 · 감전`, () => {
      const s = zeus(w);
      for (let i = 0; i < 240; i++) stepSim(s, FIRE);
      expect(lost(s)).toBeGreaterThan(0);
      expect(s.enemies.some((e) => (e.zsShock ?? 0) > 0)).toBe(true);
    });
  }

  it("번개창은 맞힌 적 둘레로 옮겨 붙음", () => {
    const s = zeus("zsBolt");
    for (let i = 0; i < 120; i++) stepSim(s, FIRE);
    expect(s.enemies[1]!.hp).toBeLessThan(s.enemies[1]!.maxHp);
  });

  it("천벌 게이지가 다 차면 제우스 강림 (무적)", () => {
    const s = zeus("zsChain");
    s.player.zsWrath = Z.wrathNeed;
    stepSim(s, FIRE);
    expect(s.player.zsGod).toBeGreaterThan(0);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
  });
});
