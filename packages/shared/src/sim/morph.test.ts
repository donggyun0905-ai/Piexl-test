import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS, WEAPONS, type WeaponDef, type WeaponId } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

/** 변희로 시작, 오른쪽 가까이에 묶어 둔 적 셋 */
function morph(weapon: WeaponId = "wolfForm", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "byeonhui");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 76 + i * 6, 72 + (i - 1) * 3, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const attacks = (s: RunState, n: number) => {
  for (let k = 0; k < n; k++) {
    const c = s.player.attackCount;
    for (let i = 0; i < 300 && s.player.attackCount === c; i++) stepSim(s, FIRE);
  }
  for (let i = 0; i < 60; i++) stepSim(s, EMPTY_INPUT);
};

describe("변희", () => {
  it("보통 캐릭터 · 동물 무기 10 · 동물마다 전용 아이템 셋 (그 동물일 때만)", () => {
    expect(CHARACTER_IDS).toContain("byeonhui");
    expect(CHARACTERS.byeonhui.startWeapon).toBe("wolfForm");
    const weapons = characterWeapons("byeonhui");
    expect(weapons).toHaveLength(10);
    const own = Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "byeonhui") as PassiveDef[];
    expect(own).toHaveLength(30);
    for (const w of weapons) expect(own.filter((p) => p.forWeapon === w), w).toHaveLength(3);
    expect(new Set(weapons.map((w) => (WEAPONS[w] as WeaponDef).animal)).size).toBe(10);
  });

  it("모든 동물이 피해를 줌", () => {
    for (const w of characterWeapons("byeonhui")) {
      const s = morph(w);
      attacks(s, 3);
      expect(lost(s), w).toBeGreaterThan(0);
    }
  });

  it("뱀은 중독 · 멧돼지는 돌진해 앞으로 나감 · 코끼리는 기절", () => {
    const snake = morph("snakeForm");
    attacks(snake, 1);
    expect(snake.enemies.some((e) => (e.poisonTicks ?? 0) > 0 || e.hp < e.maxHp)).toBe(true);
    const boar = morph("boarForm");
    const x0 = boar.player.x;
    attacks(boar, 1);
    expect(boar.player.x).toBeGreaterThan(x0);
    const ele = morph("elephantForm");
    ele.player.x = 80;
    const c = ele.player.attackCount;
    for (let i = 0; i < 300 && ele.player.attackCount === c; i++) stepSim(ele, FIRE);
    expect(ele.enemies.some((e) => (e.stunTicks ?? 0) > 0)).toBe(true);
  });

  it("우두머리는 늑대 피해를 늘림 · 깃털 폭풍은 깃털이 다섯", () => {
    const a = morph("wolfForm");
    attacks(a, 4);
    const b = morph("wolfForm", "wolfPack");
    attacks(b, 4);
    expect(lost(b)).toBeGreaterThan(lost(a));
    const e = morph("eagleForm", "eagleStorm");
    e.enemies = [];
    stepSim(e, FIRE);
    expect(e.projectiles.filter((p) => p.spirit === "eagleFeather")).toHaveLength(5);
  });
});
