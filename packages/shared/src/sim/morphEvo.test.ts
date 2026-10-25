import { describe, expect, it } from "vitest";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { morphEvolved, MORPH_EVO } from "./morphEvo";
import { enemy, FIRE } from "./perkTestUtil";

function evolved(weapon: "wolfForm" | "eagleForm", perks: string[]): RunState {
  const s = createRun(3, "byeonhui");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 76 + i * 6, 72, 99999), rootTicks: 99999 }));
  return s;
}

describe("변희 각성", () => {
  it("그 동물 전용 아이템 셋을 모두 가지면 각성: 체력 +20 · 공격력 +3 · 사거리 증가", () => {
    const base = evolved("wolfForm", ["wolfPack", "wolfHowl"]);
    expect(morphEvolved(base.player)).toBe(false);
    const evo = evolved("wolfForm", ["wolfPack", "wolfHowl", "wolfFang"]);
    const plain = evolved("wolfForm", ["wolfFang"]);
    expect(morphEvolved(evo.player)).toBe(true);
    expect(evo.player.stats.maxHp).toBe(plain.player.stats.maxHp + MORPH_EVO.hp);
    expect(evo.player.stats.range).toBeGreaterThan(plain.player.stats.range);
  });

  it("각성한 독수리는 가끔 공중으로 날아 세 번 내리긋고(그동안 무적) 내려앉음", () => {
    const s = evolved("eagleForm", ["eagleEye", "eagleStorm", "eagleDive"]);
    let raided = false;
    for (let i = 0; i < 3000 && !raided; i++) {
      stepSim(s, FIRE);
      if (s.player.mRaid) raided = true;
    }
    expect(raided).toBe(true);
    stepSim(s, EMPTY_INPUT);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    for (let i = 0; i < MORPH_EVO.passes * MORPH_EVO.passTicks + 5; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.mRaid).toBeUndefined();
    expect(s.effects.some((fx) => fx.kind === "mRaid") || s.enemies.some((e) => e.hp < e.maxHp)).toBe(true);
  });
});
