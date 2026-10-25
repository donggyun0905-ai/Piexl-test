import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, EATER, type WeaponId } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { eaterRegen, mawMove } from "./eater";
import { enemy, FIRE } from "./perkTestUtil";

function ea(...perks: PassiveId[]): RunState {
  const s = createRun(5, "eater");
  s.player.weaponId = "shadowMaw" as WeaponId;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 80 + i * 10, 72, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("이터", () => {
  it("헬리오스 보통 캐릭터 · 무기 1 · 전용 아이템 10", () => {
    expect(CHARACTER_IDS).toContain("eater");
    expect(characterWeapons("eater")).toHaveLength(1);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "eater")).toHaveLength(10);
  });

  it("열 가지 공격이 모두 피해를 줌", () => {
    for (const m of Object.keys(EATER.moves) as (keyof typeof EATER.moves)[]) {
      const s = ea();
      mawMove(s, m);
      for (let i = 0; i < 60; i++) stepSim(s, { ...FIRE, attack: false });
      expect(lost(s), m).toBeGreaterThan(0);
    }
  });

  it("누르고 있으면 확률로 여러 공격이 나옴 (시드로 같음)", () => {
    const a = ea();
    const b = ea();
    for (let i = 0; i < 600; i++) {
      stepSim(a, FIRE);
      stepSim(b, FIRE);
    }
    expect(lost(a)).toBeGreaterThan(0);
    expect(lost(a)).toBe(lost(b));
  });

  it("먹은 적마다 재생력 +0.1 (상한 100 · 끝없는 허기 150) · 재생력 10마다 공격력 +3", () => {
    const s = ea();
    s.enemies = [{ ...enemy(9, 70, 72, 5), rootTicks: 99 }];
    mawMove(s, "slash");
    expect(s.player.eaEaten).toBe(1);
    expect(eaterRegen(s.player)).toBeCloseTo(0.1);
    const base = s.player.stats.damage;
    s.player.eaEaten = 5000;
    expect(eaterRegen(s.player)).toBe(100);
    recalcStats(s);
    expect(s.player.stats.damage).toBeCloseTo(base + 30);
    s.player.passives.push("eaHunger");
    expect(eaterRegen(s.player)).toBe(150);
  });

  it("재생력만큼 10초에 회복", () => {
    const s = ea();
    s.enemies = [];
    s.player.eaEaten = 100;
    s.player.hp = 50;
    for (let i = 0; i < 600; i++) stepSim(s, { ...FIRE, attack: false });
    expect(s.player.hp).toBeCloseTo(60, 0);
  });
});
