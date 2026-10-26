import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS, SLAYER, type WeaponId } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons, passivePool } from "./loot";
import { recalcStats } from "./items";
import { damagePlayer, healPlayer } from "./combat";
import { enemy, FIRE } from "./perkTestUtil";

function sl(weapon: WeaponId = "bloodScythe", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "slayer");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 80 + i * 10, 72, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("학살자", () => {
  it("전용 아이템을 다 모으면 공용 아이템이 나옴 (상점 진열대가 비어 멈추지 않게)", () => {
    const own = Object.keys(PASSIVES).filter((id) => (PASSIVES[id as PassiveId] as PassiveDef).exclusive === "slayer") as PassiveId[];
    expect(passivePool(sl()).every((id) => own.includes(id))).toBe(true);
    expect(passivePool(sl("bloodScythe", ...own)).length).toBeGreaterThan(0);
  });
  it("헬리오스 보통 캐릭터 · 체력 280 · 대낫 10 · 전용 아이템 10", () => {
    expect(CHARACTER_IDS).toContain("slayer");
    expect(CHARACTERS.slayer.maxHp).toBe(280);
    expect(characterWeapons("slayer")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "slayer")).toHaveLength(10);
  });

  it("한 번 누르면 5연속 콤보 · 기술마다 체력 5 · 체력 40 아래로는 안 내려감", () => {
    const s = sl();
    s.enemies = [];
    stepSim(s, FIRE);
    for (let i = 0; i < 40; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.hp).toBe(280 - SLAYER.hpCost * 5);
    const low = sl();
    low.enemies = [];
    low.player.hp = 47;
    stepSim(low, FIRE);
    for (let i = 0; i < 40; i++) stepSim(low, EMPTY_INPUT);
    expect(low.player.hp).toBe(SLAYER.hpFloor);
  });

  it("콤보가 끝나면 보통 공격 속도만큼 쉼", () => {
    const s = sl();
    s.enemies = [];
    let starts = 0;
    for (let i = 0; i < 120; i++) {
      const before = s.player.attackCount;
      stepSim(s, FIRE);
      if (s.player.attackCount > before) starts++;
    }
    // 콤보 약 30틱 + 쉼 60틱 → 2분 동안 두 번
    expect(starts).toBe(2);
  });

  it("흡혈은 피의 학살 중에만 (입힌 피해의 50%) · 받는 피해 +50%", () => {
    const n = sl();
    n.player.hp = 100;
    stepSim(n, FIRE);
    for (let i = 0; i < 40; i++) stepSim(n, EMPTY_INPUT);
    expect(n.player.hp).toBeLessThan(100);
    const t = sl();
    t.enemies = [];
    damagePlayer(t, 10);
    expect(280 - t.player.hp).toBeCloseTo(SLAYER.taken * 10);
    const s = sl();
    s.player.slRage = 600;
    s.player.hp = 100;
    stepSim(s, FIRE);
    for (let i = 0; i < 40; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.hp).toBeGreaterThan(100);
  });

  it("모든 대낫이 피해를 줌", () => {
    for (const w of characterWeapons("slayer")) {
      const s = sl(w);
      for (let i = 0; i < 120; i++) stepSim(s, FIRE);
      expect(lost(s), w).toBeGreaterThan(0);
    }
  });

  it("회복이 듣지 않음 · 체력이 낮을수록 세짐", () => {
    const s = sl();
    s.player.hp = 100;
    healPlayer(s, 50);
    expect(s.player.hp).toBe(100);
    const a = sl();
    a.player.hp = 280;
    const b = sl();
    b.player.hp = 30;
    stepSim(a, FIRE);
    stepSim(b, FIRE);
    for (let i = 0; i < 2; i++) {
      stepSim(a, EMPTY_INPUT);
      stepSim(b, EMPTY_INPUT);
    }
    expect(lost(b)).toBeGreaterThan(lost(a));
  });

  it("게이지가 차면 피의 학살 (체력 소모 없음)", () => {
    const s = sl();
    s.enemies = [];
    s.player.slGauge = SLAYER.gaugeMax;
    stepSim(s, EMPTY_INPUT);
    expect(s.player.slRage ?? 0).toBeGreaterThan(0);
    stepSim(s, FIRE);
    for (let i = 0; i < 40; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.hp).toBe(280);
  });

  it("공용 아이템은 나오지 않음", () => {
    const s = sl();
    const own = Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "slayer").length;
    expect(own).toBe(10);
    expect(s.player.characterId).toBe("slayer");
  });
});
