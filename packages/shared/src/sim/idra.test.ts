import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS, WEAPONS, type WeaponDef } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons, passivePool } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

/** 이드라로 시작, 오른쪽 가까이에 묶어 둔 적 셋 (form: 가이아 모습) */
function idra(form = 0, ...perks: PassiveId[]): RunState {
  const s = createRun(3, "idra");
  s.player.passives.push(...perks);
  s.player.gForm = form;
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 74 + i * 6, 72 + (i - 1) * 3, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const attacks = (s: RunState, n: number) => {
  for (let k = 0; k < n; k++) {
    const c = s.player.attackCount;
    for (let i = 0; i < 300 && s.player.attackCount === c; i++) stepSim(s, FIRE);
  }
  for (let i = 0; i < 40; i++) stepSim(s, EMPTY_INPUT);
};

describe("이드라", () => {
  it("보통 캐릭터 · 무기는 가이아 하나 · 전용 아이템 20개만 나옴", () => {
    expect(CHARACTER_IDS).toContain("idra");
    expect(CHARACTERS.idra.startWeapon).toBe("gaia");
    expect(characterWeapons("idra")).toEqual(["gaia"]);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "idra")).toHaveLength(20);
    const pool = passivePool(createRun(1, "idra"));
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every((id) => (PASSIVES[id] as PassiveDef).exclusive === "idra")).toBe(true);
    expect((WEAPONS.gaia as WeaponDef).kind).toBe("gaia");
  });

  it("대시 키로 대궁 → 단검 → 방패 → 채찍 → 대궁, 바꿀 때 둘레에 변환 일격", () => {
    const s = idra();
    for (const want of [1, 2, 3, 0]) {
      stepSim(s, { ...EMPTY_INPUT, dash: true });
      expect(s.player.gForm).toBe(want);
      for (let i = 0; i < 80; i++) stepSim(s, EMPTY_INPUT);
    }
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("네 모습 모두 피해를 줌 · 방패는 보호막", () => {
    for (const form of [0, 1, 2, 3]) {
      const s = idra(form);
      attacks(s, 3);
      expect(lost(s), `form ${form}`).toBeGreaterThan(0);
      if (form === 2) expect(s.player.shieldPts ?? 0).toBeGreaterThan(0);
    }
  });

  it("쌍단검은 단검 피해를 늘림 · 사계는 네 모습을 돌면 켜짐", () => {
    const a = idra(1);
    attacks(a, 4);
    const b = idra(1, "idTwinStab");
    attacks(b, 4);
    expect(lost(b)).toBeGreaterThan(lost(a));
    const s = idra(0, "idFourSeasons");
    for (let k = 0; k < 4; k++) {
      stepSim(s, { ...EMPTY_INPUT, dash: true });
      for (let i = 0; i < 80; i++) stepSim(s, EMPTY_INPUT);
    }
    expect(s.player.gSeason ?? 0).toBeGreaterThan(0);
  });
});
