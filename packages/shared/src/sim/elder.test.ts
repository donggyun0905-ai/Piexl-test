import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import type { WeaponId } from "../content";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

/** 장로로 시작, 오른쪽에 묶어 둔 적 셋 */
function elder(weapon: WeaponId = "vineGate", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "elder");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 100 + i * 6, 72 + (i - 1) * 4, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const casts = (s: RunState, n: number) => {
  for (let k = 0; k < n; k++) {
    const c = s.player.attackCount;
    for (let i = 0; i < 300 && s.player.attackCount === c; i++) stepSim(s, FIRE);
  }
  for (let i = 0; i < 200; i++) stepSim(s, EMPTY_INPUT);
};

describe("장로", () => {
  it("보통 캐릭터 · 진법 10 · 전용 아이템 10", () => {
    expect(CHARACTER_IDS).toContain("elder");
    expect(CHARACTERS.elder.startWeapon).toBe("vineGate");
    expect(characterWeapons("elder")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "elder")).toHaveLength(10);
  });

  it("진은 적 자리에 깔리고 잠시 뒤 발동", () => {
    const s = elder();
    const c = s.player.attackCount;
    for (let i = 0; i < 300 && s.player.attackCount === c; i++) stepSim(s, FIRE);
    const g = s.player.seals?.[0];
    expect(g).toBeDefined();
    expect(Math.abs((g?.x ?? 0) - 100)).toBeLessThan(2);
    expect(lost(s)).toBe(0);
    for (let i = 0; i < 60; i++) stepSim(s, EMPTY_INPUT);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("모든 진이 피해를 줌 · 한 번에 깔린 진은 셋까지", () => {
    for (const w of characterWeapons("elder")) {
      const s = elder(w);
      casts(s, 2);
      expect(lost(s), w).toBeGreaterThan(0);
    }
    const s = elder("pitTrap");
    for (let k = 0; k < 6; k++) {
      const c = s.player.attackCount;
      for (let i = 0; i < 300 && s.player.attackCount === c; i++) stepSim(s, FIRE);
    }
    expect((s.player.seals ?? []).length).toBeLessThanOrEqual(3);
  });

  it("진법 대가는 피해를 늘림", () => {
    const a = elder();
    casts(a, 2);
    const b = elder("vineGate", "elMaster");
    casts(b, 2);
    expect(lost(b)).toBeGreaterThan(lost(a));
  });
});
