import { describe, expect, it } from "vitest";
import { HIDDEN_CHARACTERS } from "../characters";
import { FALLEN_KING_PASSIVES } from "../itemsFallenKing";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { kingKill } from "./fallenKing";
import { enemy, FIRE } from "./perkTestUtil";

function king(...perks: string[]): RunState {
  const s = createRun(9, "fallenKing");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [
    { ...enemy(1, 70, 72, 999999), rootTicks: 999999 },
    { ...enemy(2, 110, 80, 999999), rootTicks: 999999 },
  ];
  return s;
}

describe("몰락한 왕", () => {
  it("히든 캐릭터 · 대검 하나 · 패시브 10", () => {
    expect(HIDDEN_CHARACTERS).toContain("fallenKing");
    expect(createRun(1, "fallenKing").player.weaponId).toBe("fkZwei");
    expect(Object.keys(FALLEN_KING_PASSIVES)).toHaveLength(10);
  });

  it("한 콤보: X자 두 번 → 검기 → 내리꽂기(불꽃 선 · 잠시 뒤 불기둥)", () => {
    const s = king();
    const kinds: string[] = [];
    for (let i = 0; i < 400 && kinds.filter((k) => k === "kgPlant").length < 1; i++) {
      stepSim(s, FIRE);
      for (const f of s.effects) if (f.ticks === f.maxTicks - 1 || f.ticks === f.maxTicks) kinds.push(f.kind);
    }
    const order = kinds.filter((k) => k === "kgSlash" || k === "kgWave" || k === "kgPlant");
    expect(order.slice(0, 2)).toEqual(["kgSlash", "kgSlash"]);
    expect(order).toContain("kgWave");
    expect(order).toContain("kgPlant");
    expect(s.effects.some((f) => f.kind === "kgLine")).toBe(true);
  });

  it("영혼: 처치마다 쌓여 공격력·체력이 오름 · 영혼 수확은 둘씩", () => {
    const s = king();
    const dmg = s.player.stats.damage;
    for (let i = 0; i < 10; i++) kingKill(s, s.enemies[0]!);
    expect(s.player.fkSouls).toBe(10);
    expect(s.player.stats.damage).toBeCloseTo(dmg + 0.12);
    const h = king("fkHarvest");
    kingKill(h, h.enemies[0]!);
    expect(h.player.fkSouls).toBe(2);
    expect(h.effects.some((f) => f.kind === "kgSoul")).toBe(true);
  });
});
