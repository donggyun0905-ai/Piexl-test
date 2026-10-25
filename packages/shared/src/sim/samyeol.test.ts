import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, SAMYEOL, type WeaponId } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

function sm(weapon: WeaponId = "tangNeedle", ...perks: PassiveId[]): RunState {
  const s = createRun(6, "samyeol");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 90 + i * 10, 72, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const idle = { ...FIRE, attack: false };

describe("사멸", () => {
  it("헬리오스 보통 캐릭터 · 독침 10 · 전용 아이템 10", () => {
    expect(CHARACTER_IDS).toContain("samyeol");
    expect(characterWeapons("samyeol")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "samyeol")).toHaveLength(10);
  });

  it("모든 침에 독 + 죽음", () => {
    const s = sm();
    for (let i = 0; i < 60; i++) stepSim(s, FIRE);
    const e = s.enemies[0]!;
    expect(e.poisonTicks ?? 0).toBeGreaterThan(0);
    expect(e.smDeath ?? 0).toBeGreaterThan(0);
    const before = lost(s);
    for (let i = 0; i < 120; i++) stepSim(s, idle);
    expect(lost(s)).toBeGreaterThan(before);
  });

  it("침을 많이 던지면 독가스가 생김 (최대 6)", () => {
    const s = sm("thousandNeedles");
    for (let i = 0; i < 1200; i++) stepSim(s, FIRE);
    expect(s.player.smGas?.length ?? 0).toBeGreaterThan(0);
    expect(s.player.smGas!.length).toBeLessThanOrEqual(SAMYEOL.gasMax);
  });

  it("모든 독침이 피해를 줌", () => {
    for (const w of characterWeapons("samyeol")) {
      const s = sm(w);
      for (let i = 0; i < 120; i++) stepSim(s, FIRE);
      expect(lost(s), w).toBeGreaterThan(0);
    }
  });
});
