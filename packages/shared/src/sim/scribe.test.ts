import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS, HIDDEN_CHARACTERS, WEAPONS, type WeaponDef, type WeaponId } from "../content";
import { PASSIVES, type PassiveId } from "../items";
import { SCRIBE } from "../weaponsScribe";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

/** 서기관으로 시작, 오른쪽에 묶어 둔 적 셋 */
function scribe(weapon: WeaponId = "quillPen", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "scribe");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 100 + i * 6, 72 + (i - 1) * 4, 99999), rootTicks: 99999 }));
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

describe("서기관 (히든)", () => {
  it("숨은 캐릭터 · 전용 무기 10 · 전용 아이템 10 · 깃펜으로 시작", () => {
    expect(HIDDEN_CHARACTERS).toContain("scribe");
    expect(CHARACTER_IDS).not.toContain("scribe");
    expect(CHARACTERS.scribe.startWeapon).toBe("quillPen");
    expect(Object.values(WEAPONS).filter((w) => (w as WeaponDef).exclusive === "scribe")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((p) => (p as { exclusive?: string }).exclusive === "scribe")).toHaveLength(10);
    expect(characterWeapons("scribe")).toContain("akashicOrigin");
  });

  it("잉크 탄에 맞은 적에게 기록이 쌓이고, 몇 번째마다 글자가 써짐", () => {
    const s = scribe();
    attacks(s, 1);
    expect(s.enemies.some((e) => (e.ink ?? 0) > 0)).toBe(true);
    attacks(s, SCRIBE.every);
    expect(s.effects.some((fx) => fx.kind === "scWord") || lost(s) > s.player.stats.damage * 3).toBe(true);
  });

  it("모든 무기가 글자로 피해를 줌", () => {
    for (const w of characterWeapons("scribe")) {
      const s = scribe(w);
      attacks(s, SCRIBE.every + 1);
      expect(lost(s), w).toBeGreaterThan(s.player.stats.damage * 2);
    }
  });

  it("잉크병은 글자를 더 자주 · 낙관은 글자를 더 세게", () => {
    const plain = scribe("inkBrush");
    attacks(plain, 4);
    const well = scribe("inkBrush", "inkWell");
    attacks(well, 4);
    expect(lost(well)).toBeGreaterThan(lost(plain));
    const stamp = scribe("inkBrush", "sealStamp");
    attacks(stamp, SCRIBE.every);
    const base = scribe("inkBrush");
    attacks(base, SCRIBE.every);
    expect(lost(stamp)).toBeGreaterThan(lost(base));
  });
});
