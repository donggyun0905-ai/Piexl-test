import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS, SPIRIT, type WeaponId } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

/** 정령사로 시작, 오른쪽에 묶어 둔 적 셋 */
function sp(weapon: WeaponId = "titanCoreSpirit", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "spiritist");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 90 + i * 6, 72 + (i - 1) * 4, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("정령사", () => {
  it("보통 캐릭터 · 대정령 10 · 전용 아이템 10", () => {
    expect(CHARACTER_IDS).toContain("spiritist");
    expect(CHARACTERS.spiritist.startWeapon).toBe("titanCoreSpirit");
    expect(characterWeapons("spiritist")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "spiritist")).toHaveLength(10);
  });

  it("작은 정령 셋이 곁에 있고 30초마다 하나가 바뀜 (시드가 같으면 같게)", () => {
    const a = sp();
    stepSim(a, EMPTY_INPUT);
    expect(a.player.spirits).toHaveLength(SPIRIT.small);
    const first = a.player.spirits?.[0]?.kind;
    const count = a.player.spCount;
    for (let i = 0; i < SPIRIT.swapTicks; i++) stepSim(a, EMPTY_INPUT);
    expect(a.player.spirits).toHaveLength(SPIRIT.small);
    expect(a.player.spCount).toBe((count ?? 0) + 1);
    const b = sp();
    stepSim(b, EMPTY_INPUT);
    expect(b.player.spirits?.[0]?.kind).toBe(first);
  });

  it("공격하지 않아도 정령·대정령이 싸움 · 모든 대정령이 피해를 줌", () => {
    for (const w of characterWeapons("spiritist")) {
      const s = sp(w);
      for (let i = 0; i < 300; i++) stepSim(s, EMPTY_INPUT);
      expect(lost(s), w).toBeGreaterThan(0);
    }
  });

  it("매직 미사일은 약함 · 계약은 정령을 하나 더", () => {
    const s = sp("titanCoreSpirit", "spBond");
    stepSim(s, FIRE);
    expect(s.player.spirits).toHaveLength(SPIRIT.small + 1);
    expect(s.projectiles.some((p) => p.spirit === "magicMissile")).toBe(true);
  });

  it("대정령 기술: 돌주먹·입방체는 떨어진 뒤에 맞힘 · 실반가드는 주문 뒤 거대 화살 · 베놈하이드 독가스 넷 · 머리 위 마법 문자", () => {
    const seen = (w: WeaponId, until: (s: RunState) => boolean) => {
      const s = sp(w);
      for (let i = 0; i < 400 && !until(s); i++) stepSim(s, EMPTY_INPUT);
      return s;
    };
    const t = seen("titanCoreSpirit", (s) => !!s.player.spDrops);
    expect(t.player.spDrops?.[0]?.kind).toBe(0);
    expect(t.effects.some((e) => e.kind === "gsRune")).toBe(true);
    for (let i = 0; i < 20; i++) stepSim(t, EMPTY_INPUT);
    expect(t.player.spDrops).toBeUndefined();
    expect(seen("abyssRuin", (s) => !!s.player.spDrops).player.spDrops).toHaveLength(3);
    const v = seen("venomHide", (s) => !!s.player.spGas);
    expect(v.player.spGas).toHaveLength(SPIRIT.gasClouds);
    const g = seen("sylvanGuard", (s) => !!s.player.spCharge);
    for (let i = 0; i < SPIRIT.chantTicks; i++) stepSim(g, EMPTY_INPUT);
    expect(g.player.spCharge).toBeUndefined();
    expect(g.effects.some((e) => e.kind === "gsArrow")).toBe(true);
    const u = seen("umbra", (s) => s.effects.some((e) => e.kind === "gsBeam"));
    expect(u.effects.some((e) => e.kind === "gsBeam")).toBe(true);
  });
});
