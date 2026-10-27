import { describe, expect, it } from "vitest";
import type { WeaponId } from "../content";
import { SILK as S } from "../weaponsSilk";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

function silk(weapon: WeaponId = "skThread", ...perks: string[]): RunState {
  const s = createRun(5, "silk");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 110, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("영사", () => {
  it("실 100가닥 장전 · 쏠 때마다 하나씩 줄고 다 쓰면 장전", () => {
    const s = silk();
    stepSim(s, FIRE);
    expect(s.player.skAmmo).toBe(99);
    s.player.skAmmo = 1;
    s.player.attackCooldown = 0;
    stepSim(s, FIRE);
    expect(s.player.skAmmo).toBe(0);
    expect(s.player.skReload).toBeGreaterThan(0);
    for (let i = 0; i < S.reload + 2; i++) stepSim(s, { ...FIRE, attack: false });
    expect(s.player.skAmmo).toBe(100);
  });

  it("실은 방 끝에서 끝까지: 멀리 있는 적도 맞음", () => {
    const s = silk();
    s.enemies[0]!.x = 300;
    stepSim(s, FIRE);
    expect(s.enemies[0]!.skStacks).toBe(1);
  });

  it("얽힘 5면 찢기 (250% + 출혈)", () => {
    const s = silk();
    s.enemies[0]!.skStacks = 4;
    stepSim(s, FIRE);
    expect(s.enemies[0]!.skStacks).toBe(0);
    expect(s.enemies[0]!.bleedTicks).toBeGreaterThan(0);
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * 2.5);
  });

  it("30가닥을 쓰면 노리는 적을 가로지르는 실 30가닥 연사 · 남은 실이 10 이하일 때 쏜 건 안 셈", () => {
    const s = silk();
    s.player.skUsed = S.burstEvery - 1;
    stepSim(s, FIRE);
    expect(s.player.skBurst?.id).toBe(1);
    const t = silk();
    t.player.skAmmo = S.burstLow;
    t.player.skUsed = S.burstEvery - 1;
    stepSim(t, FIRE);
    expect(t.player.skBurst).toBeUndefined();
  });

  for (const w of ["skThread", "skTwin", "skWeb", "skSteel", "skCrimson", "skNeedle", "skHarp", "skSpool", "skMarionette", "skCocoon"] as WeaponId[]) {
    it(`무기 ${w}: 적에게 피해`, () => {
      const s = silk(w);
      for (let i = 0; i < 60; i++) stepSim(s, FIRE);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("같은 시드면 같은 결과", () => {
    const run = () => {
      const s = silk("skHarp", "skFrenzy", "skTangle");
      for (let i = 0; i < 300; i++) stepSim(s, FIRE);
      return lost(s);
    };
    expect(run()).toBe(run());
  });
});
