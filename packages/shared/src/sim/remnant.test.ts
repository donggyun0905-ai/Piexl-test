import { describe, expect, it } from "vitest";
import { CHARACTERS } from "../characters";
import { WEAPONS, type WeaponId } from "../content";
import { REMNANT_PERKS as K } from "../itemsRemnant";
import { REMNANT as R } from "../weaponsRemnant";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

function remnant(weapon: WeaponId = "rmDagger", ...perks: string[]): RunState {
  const s = createRun(5, "remnant");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 120, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const IDLE = { ...FIRE, attack: false };

describe("잔영", () => {
  it("기본: 치명타 25% · 치명타 피해 250%", () => {
    expect(CHARACTERS.remnant).toMatchObject({ critChance: 0.25, critDamage: 2.5 });
  });

  it("멀리 있는 적 등 뒤 떨어진 곳으로 순간이동해 그림자(무적) · 떠난 자리에 분신 · 다음 공격은 뒤치기로 크게 벰", () => {
    const s = remnant();
    stepSim(s, FIRE);
    const e = s.enemies[0]!;
    expect(s.player.x).toBeGreaterThan(e.x + e.r + R.blinkBack);
    expect(s.player.rmEchoes?.length).toBe(1);
    expect(s.player.rmShade).toBeGreaterThan(0);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    expect(s.player.rmBlink).toBeGreaterThan(0);
    for (let i = 0; i < 30 && (s.player.rmShade ?? 0) > 0; i++) stepSim(s, FIRE);
    expect(s.player.rmShade).toBe(0);
    expect(lost(s)).toBeGreaterThan(s.player.stats.damage * R.shadeMul);
  });

  it("분신이 있는 동안 적은 분신을 쫓음 (어그로)", () => {
    const s = remnant();
    const e = s.enemies[0]!;
    e.rootTicks = 0;
    stepSim(s, FIRE);
    const decoy = s.player.rmEchoes![0]!;
    const d0 = Math.hypot(e.x - decoy.x, e.y - decoy.y);
    for (let i = 0; i < 20; i++) stepSim(s, IDLE);
    expect(Math.hypot(e.x - decoy.x, e.y - decoy.y)).toBeLessThan(d0);
  });

  for (const w of ["rmDagger", "rmTwin", "rmClaw", "rmStiletto", "rmKunai", "rmSpin", "rmFlash", "rmReaper", "rmFang", "rmEclipse"] as WeaponId[]) {
    it(`무기 ${w}: 적에게 피해`, () => {
      const s = remnant(w);
      for (let i = 0; i < 60; i++) stepSim(s, FIRE);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("뒤에서 치면 더 아픔 (순간이동 직후)", () => {
    const a = remnant("rmStiletto");
    a.enemies[0]!.x = 70;
    a.player.rmBack = R.backWindow;
    a.enemies[0]!.dirX = 1;
    const b = remnant("rmStiletto");
    b.enemies[0]!.x = 70;
    b.enemies[0]!.dirX = -1;
    stepSim(a, FIRE);
    stepSim(b, FIRE);
    expect(lost(a)).toBeGreaterThan(lost(b));
  });

  it("상태이상 면역: 어둠·거울·깜깜함이 바로 사라짐", () => {
    const s = remnant();
    s.player.darkStacks = 3;
    s.player.mirrorTicks = 100;
    s.player.blindTicks = 100;
    stepSim(s, IDLE);
    expect(s.player.darkStacks).toBe(0);
    expect(s.player.mirrorTicks).toBe(0);
    expect(s.player.blindTicks).toBe(0);
  });

  it("사라짐: 뒤치기 뒤 무적 · 그림자 숨기: 대시로 순간이동", () => {
    const s = remnant("rmDagger", "rmVanish", "rmShroud");
    s.player.dashTicks = 5;
    stepSim(s, IDLE);
    expect(s.player.x).toBeGreaterThan(110);
    for (let i = 0; i < 30 && (s.player.rmShade ?? 0) > 0; i++) stepSim(s, FIRE);
    expect(s.player.invulnTicks).toBeGreaterThan(K.rmVanish.ticks - 5);
  });

  it("같은 시드면 같은 결과", () => {
    const run = () => {
      const s = remnant("rmEclipse", "rmEcho", "rmBlood");
      for (let i = 0; i < 200; i++) stepSim(s, FIRE);
      return [lost(s), s.player.x];
    };
    expect(run()).toEqual(run());
  });

  it("공격 속도는 무기 그대로 (아이템으로 안 오름) · 그림자에서 친 뒤치기는 반드시 치명타", () => {
    const a = remnant();
    a.enemies[0]!.x = 70;
    a.player.stats.attackSpeed *= 3;
    stepSim(a, FIRE);
    expect(a.player.attackCooldown).toBe(Math.round(60 / (WEAPONS.rmDagger as { attackSpeed: number }).attackSpeed));
    let crit = 0;
    for (let k = 0; k < 6; k++) {
      const s = remnant();
      stepSim(s, FIRE);
      const before = s.crits ?? 0;
      for (let i = 0; i < 30 && (s.player.rmShade ?? 0) > 0; i++) stepSim(s, FIRE);
      if ((s.crits ?? 0) > before) crit++;
    }
    expect(crit).toBe(6);
  });
});
