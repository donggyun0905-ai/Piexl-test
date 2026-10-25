import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, MUKIN, type WeaponId } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { mukinDef } from "./mukin";
import { enemy, FIRE } from "./perkTestUtil";

function mk(weapon: WeaponId = "ironHorn", ...perks: PassiveId[]): RunState {
  const s = createRun(4, "mukin");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 80 + i * 10, 72, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const idle = { ...FIRE, attack: false };

describe("묵인", () => {
  it("헬리오스 보통 캐릭터 · 무기 10 · 전용 아이템 10", () => {
    expect(CHARACTER_IDS).toContain("mukin");
    expect(characterWeapons("mukin")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "mukin")).toHaveLength(10);
  });

  it("방어력 30: 받는 피해 30% 무시 · 적어도 1 · 맞은 뒤 무적이 거의 없음", () => {
    const s = mk();
    const hp = s.player.hp;
    damagePlayer(s, 10);
    expect(hp - s.player.hp).toBeCloseTo(7);
    expect(s.player.invulnTicks).toBeLessThanOrEqual(MUKIN.hurtTicks);
    s.player.invulnTicks = 0;
    const h2 = s.player.hp;
    damagePlayer(s, 0.5);
    expect(h2 - s.player.hp).toBe(1);
  });

  it("돌진 피해 = 방어력 300% + 공격력", () => {
    const s = mk();
    s.enemies = [{ ...enemy(1, 70, 72, 99999), rootTicks: 99999 }];
    stepSim(s, FIRE);
    for (let i = 0; i < 20; i++) stepSim(s, idle);
    expect(lost(s)).toBeCloseTo(mukinDef(s.player) * 3 + s.player.stats.damage, 0);
  });

  it("모든 무기가 피해를 줌", () => {
    for (const w of characterWeapons("mukin")) {
      const s = mk(w);
      for (let i = 0; i < 120; i++) stepSim(s, FIRE);
      expect(lost(s), w).toBeGreaterThan(0);
    }
  });

  it("회복약은 천천히 차오름 · 재생력 10", () => {
    const s = mk();
    s.enemies = [];
    s.player.hp = 40;
    s.player.useSlots = ["potion", null];
    stepSim(s, { ...idle, useSlot: 1 });
    expect(s.player.hp).toBeLessThan(45);
    for (let i = 0; i < 600; i++) stepSim(s, idle);
    expect(s.player.hp).toBeGreaterThan(60);
  });
});
