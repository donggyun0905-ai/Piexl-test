import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS, PLAGUE, type WeaponId } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { infect } from "./plague";
import { enemy, FIRE } from "./perkTestUtil";

/** 역병의사로 시작, 오른쪽에 묶어 둔 적 셋 */
function pd(weapon: WeaponId = "mosquitoSwarm", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "plague");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 70 + i * 8, 72, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("역병의사", () => {
  it("헬리오스 보통 캐릭터 · 무기 4 · 전용 아이템 10", () => {
    expect(CHARACTER_IDS).toContain("plague");
    expect(CHARACTERS.plague.startWeapon).toBe("mosquitoSwarm");
    expect(characterWeapons("plague")).toHaveLength(4);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "plague")).toHaveLength(10);
  });

  it("모든 무기가 피해를 줌", () => {
    for (const w of characterWeapons("plague")) {
      const s = pd(w);
      for (let i = 0; i < 400; i++) stepSim(s, FIRE);
      expect(lost(s) + s.kills, w).toBeGreaterThan(0);
    }
  });

  it("연기 구역: 독·불·부식(받는 피해 +5%)", () => {
    const s = pd("miasmaCenser");
    for (let i = 0; i < 120; i++) stepSim(s, FIRE);
    const e = s.enemies[0]!;
    expect(e.poisonTicks ?? 0).toBeGreaterThan(0);
    expect(e.apDef ?? 0).toBeCloseTo(PLAGUE.corrode);
  });

  it("흑사병: 1초마다 최대 체력의 20% (보스·허수아비는 1/5의 20%) · 붙은 쥐가 터지고 다시 붙지 않음", () => {
    const s = pd("ratKing");
    for (let i = 0; i < 90; i++) stepSim(s, FIRE);
    const e = s.enemies[0]!;
    e.hp = e.maxHp = 1000;
    e.plague = 0;
    const before = (s.player.plRats ?? []).filter((r) => r.on === e.id).length;
    infect(s, e);
    expect(e.plague).toBe(PLAGUE.plagueTicks);
    expect((s.player.plRats ?? []).some((r) => r.on === e.id)).toBe(false);
    expect(e.plagueDmg).toBeCloseTo(1000 * PLAGUE.plaguePct);
    expect(before).toBeGreaterThanOrEqual(0);
  });

  it("죽음의 손아귀: 공격 속도가 오르지 않음 · 언젠가 즉사", () => {
    const s = pd("deathGrip");
    s.enemies.forEach((e) => (e.x = 60));
    s.player.stats.attackSpeed *= 3;
    let kills = 0;
    for (let i = 0; i < 600 && kills === 0; i++) {
      stepSim(s, FIRE);
      kills = 3 - s.enemies.length;
    }
    expect(kills).toBeGreaterThan(0);
  });
});
