import { describe, expect, it } from "vitest";
import { CHARACTERS } from "../characters";
import { WEAPONS, type WeaponId } from "../content";
import { REMNANT_PERKS as K } from "../itemsRemnant";
import { REMNANT_WEAPONS } from "../weaponsRemnant";
import { damagePlayer, envDamage } from "./combat";
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
  s.enemies = [{ ...enemy(1, 64, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const IDLE = { ...FIRE, attack: false };
const CLICK = { ...IDLE, skill: 1 };

/** 대시 중에 적 공격이 닿음 → 회피 성공 */
function dodge(s: RunState): void {
  s.player.dashTicks = 5;
  damagePlayer(s, 10);
  s.player.dashTicks = 0;
}

describe("잔영", () => {
  it("기본: 치명타 45% · 치명타 피해 250% · 체력 45(체력 아이템으로 늘어남) · 짧은 내려찍기", () => {
    expect(CHARACTERS.remnant).toMatchObject({ critChance: 0.45, critDamage: 2.5 });
    const s = remnant("rmDagger", "sturdyHeart");
    expect(s.player.stats.maxHp).toBeGreaterThan(45);
    stepSim(s, FIRE);
    expect(lost(s)).toBeGreaterThan(0);
    const far = remnant();
    far.enemies[0]!.x = 110;
    for (let i = 0; i < 30; i++) stepSim(far, FIRE);
    expect(lost(far)).toBe(0);
  });

  it("대시로 적 공격을 피하면 슬로우모션 (지형 피해·대시가 아닐 때는 아님)", () => {
    const s = remnant();
    s.player.dashTicks = 5;
    envDamage(s, 10);
    expect(s.player.rmSlow ?? 0).toBe(0);
    dodge(s);
    expect(s.player.rmSlow).toBe(REMNANT_WEAPONS.rmDagger.phantom.slow);
    expect(s.player.hp).toBe(s.player.stats.maxHp);
    // 클릭하지 않으면 1.5초 뒤 끝남
    for (let i = 0; i < 95; i++) stepSim(s, IDLE);
    expect(s.player.rmSlow ?? 0).toBe(0);
  });

  it("적 탄(원거리)·위험 표시(휘두르기) 공격도 대시로 피하면 슬로우모션", () => {
    const s = remnant();
    s.enemies = [];
    s.player.dashTicks = 5;
    s.projectiles.push({ id: 900, fromPlayer: false, x: s.player.x, y: s.player.y, prevX: s.player.x, prevY: s.player.y, r: 3, vx: 0, vy: 0, damage: 10, ticksLeft: 30 });
    stepSim(s, IDLE);
    expect(s.player.rmSlow).toBeGreaterThan(0);
    const h = remnant();
    h.enemies = [];
    h.player.dashTicks = 5;
    (h.hazards ??= []).push({ x: h.player.x, y: h.player.y, radius: 20, damage: 10, tick: h.tick, start: h.tick });
    stepSim(h, IDLE);
    expect(h.player.rmSlow).toBeGreaterThan(0);
    expect(h.player.hp).toBe(h.player.stats.maxHp);
  });

  it("슬로우모션 중 적과 적 탄이 느려지고, 끝나면 원래 빠르기로", () => {
    const s = remnant();
    s.enemies = [];
    s.projectiles.push({ id: 99, x: 100, y: 72, vx: -2, vy: 0, r: 2, damage: 1, ticksLeft: 200, fromPlayer: false } as never);
    dodge(s);
    stepSim(s, IDLE);
    expect(Math.abs(s.projectiles[0]!.vx)).toBeLessThan(1);
    for (let i = 0; i < 95; i++) stepSim(s, IDLE);
    expect(Math.abs(s.projectiles[0]?.vx ?? -2)).toBeCloseTo(2);
  });

  it("슬로우모션 중 클릭하면 확정 치명타 3연속 큰 베기 (여러 적) → 슬로우모션 끝", () => {
    const s = remnant();
    s.enemies = [enemy(1, 80, 72, 99999), enemy(2, 50, 100, 99999), enemy(3, 30, 60, 99999)].map((e) => ({ ...e, rootTicks: 99999 }));
    dodge(s);
    const crits = s.crits ?? 0;
    stepSim(s, CLICK);
    for (let i = 0; i < 30; i++) stepSim(s, IDLE);
    expect(s.enemies.every((e) => e.hp < e.maxHp)).toBe(true);
    expect((s.crits ?? 0) - crits).toBeGreaterThanOrEqual(3);
    expect(s.player.rmSlow ?? 0).toBe(0);
    expect(s.player.rmFlurry).toBeUndefined();
  });

  it("슬로우모션이 아닐 때 클릭은 아무것도 아님", () => {
    const s = remnant();
    s.enemies[0]!.x = 120;
    for (let i = 0; i < 20; i++) stepSim(s, CLICK);
    expect(s.player.rmFlurry).toBeUndefined();
    expect(lost(s)).toBe(0);
  });

  it("섬영: 다섯 번 베기 · 겹친 칼: 한 번 더 · 사라짐: 회피하면 회복", () => {
    const s = remnant("rmFlash", "rmEcho", "rmVanish");
    s.player.hp = 20;
    dodge(s);
    expect(s.player.hp).toBe(20 + K.rmVanish.heal);
    stepSim(s, CLICK);
    expect(s.player.rmFlurry?.n).toBe(6);
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

  it("공격 속도는 무기 그대로 (아이템으로 안 오름)", () => {
    const a = remnant();
    a.player.stats.attackSpeed *= 3;
    stepSim(a, FIRE);
    expect(a.player.attackCooldown).toBe(Math.round(60 / (WEAPONS.rmDagger as { attackSpeed: number }).attackSpeed));
  });

  it("같은 시드면 같은 결과", () => {
    const run = () => {
      const s = remnant("rmEclipse", "rmEcho", "rmBlood");
      for (let i = 0; i < 200; i++) {
        if (i % 50 === 10) dodge(s);
        stepSim(s, i % 50 === 20 ? { ...FIRE, skill: 1 } : FIRE);
      }
      return [lost(s), s.player.x];
    };
    expect(run()).toEqual(run());
  });
});
