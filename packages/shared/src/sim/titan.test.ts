import { describe, expect, it } from "vitest";
import { CHARACTERS, WEAPONS, type WeaponDef, type WeaponId } from "../content";
import type { PassiveId } from "../items";
import { TITAN } from "../weaponsTitan";
import { damagePlayer } from "./combat";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { weaponPool } from "./loot";
import { enemy } from "./perkTestUtil";
import { energyNeed } from "./titan";

/** 거인으로 시작, 앞뒤에 허수아비 */
function titan(weapon: WeaponId = "ironArm", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "titan");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 120;
  s.player.y = s.player.prevY = 100;
  const dummy = (id: number, x: number) => ({ ...enemy(id, x, 100, 99999), kind: "dummy" as const, anchor: [x, 100] as [number, number] });
  s.enemies = [dummy(1, 145), dummy(2, 95)];
  return s;
}
const AIM = { ...EMPTY_INPUT, aimX: 100, aimY: 0 };
function hit(s: RunState): void {
  for (let i = 0; i < 400 && s.player.attackCooldown > 0; i++) stepSim(s, AIM);
  stepSim(s, { ...AIM, attack: true });
}
const lost = (s: RunState, i: number) => s.enemies[i]!.maxHp - s.enemies[i]!.hp;

describe("거인", () => {
  it("전용 무기 10개만 얻고, 강철 의수로 시작 · 체력이 높음", () => {
    expect(CHARACTERS.titan.startWeapon).toBe("ironArm");
    expect(CHARACTERS.titan.maxHp).toBeGreaterThan(CHARACTERS.warden.maxHp);
    for (const id of weaponPool(titan(), true)) expect(WEAPONS[id]).toMatchObject({ exclusive: "titan", kind: "titan" });
  });

  it("느린 범위 공격은 앞뒤 적을 모두 맞힘 · 빠른 연타는 약함", () => {
    const s = titan();
    hit(s);
    expect(lost(s, 0)).toBeGreaterThan(0);
    expect(lost(s, 1)).toBeGreaterThan(0);
    expect(s.player.attackCooldown).toBeGreaterThan(60);
    const j = titan("pistonFist");
    hit(j);
    expect(j.player.attackCooldown).toBeLessThan(20);
    expect(lost(j, 0)).toBeLessThan(lost(s, 0));
  });

  it("맞은 피해가 기계팔 에너지로 쌓이고(받는 피해는 덜 받음), 다 차면 다음 공격이 강타", () => {
    const s = titan();
    const hp = s.player.hp;
    s.player.invulnTicks = 0;
    damagePlayer(s, 20);
    expect(hp - s.player.hp).toBeCloseTo(20 * TITAN.taken);
    expect(s.player.tEnergy).toBeCloseTo(20 * TITAN.gain);
    s.player.tEnergy = energyNeed(s.player);
    hit(s);
    expect(s.player.tEnergy).toBe(0);
    const smash = lost(s, 0);
    hit(s);
    expect(smash).toBeGreaterThan((lost(s, 0) - smash) * 2);
  });

  it("무기마다 강타가 문제없이 나감", () => {
    for (const id of Object.keys(WEAPONS).filter((w) => (WEAPONS[w as WeaponId] as WeaponDef).exclusive === "titan") as WeaponId[]) {
      const s = titan(id);
      s.player.tEnergy = energyNeed(s.player);
      hit(s);
      for (let i = 0; i < 200; i++) stepSim(s, AIM);
      expect(s.player.tEnergy, id).toBe(0);
      expect(lost(s, 0) + lost(s, 1), id).toBeGreaterThan(0);
    }
  });

  it("대용량 축전지: 강타에 필요한 에너지가 줄어듦 · 강화 장갑판: 더 덜 받음", () => {
    const s = titan("ironArm", "bigCapacitor", "armorPlate");
    expect(energyNeed(s.player)).toBeLessThan(TITAN.energyMax);
    const hp = s.player.hp;
    s.player.invulnTicks = 0;
    damagePlayer(s, 20);
    expect(hp - s.player.hp).toBeLessThan(20 * TITAN.taken);
  });

  it("대시 대신 패링: 막는 동안 맞으면 피해 없이 그 피해가 그대로 에너지로 · 다시 쓰기까지 기다림", () => {
    const s = titan();
    const hp = s.player.hp;
    stepSim(s, { ...AIM, dash: true });
    expect(s.player.x).toBe(120);
    expect(s.player.tParry).toBeGreaterThan(0);
    expect(s.player.dashCooldown).toBeGreaterThan(TITAN.parryTicks);
    s.player.invulnTicks = 0;
    damagePlayer(s, 20);
    expect(s.player.hp).toBe(hp);
    expect(s.player.tEnergy).toBeCloseTo(20 * TITAN.gain);
    stepSim(s, { ...AIM, dash: true });
    expect(s.player.tParry ?? 0).toBe(0);
  });

  it("드릴 팔 강타: 커다란 드릴과 함께 앞으로 크게 돌진하며 여러 번 깎음", () => {
    const s = titan("drillArm");
    s.enemies = [s.enemies[0]!];
    s.player.tEnergy = energyNeed(s.player);
    hit(s);
    for (let i = 0; i < TITAN.drillTicks + 2; i++) stepSim(s, AIM);
    expect(s.player.x).toBeGreaterThan(130);
    expect(lost(s, 0)).toBeGreaterThan(0);
  });

  it("같은 시드·입력이면 같은 결과", () => {
    const go = () => {
      const s = titan("magnetArm");
      for (let i = 0; i < 600; i++) {
        if (i % 50 === 0) s.player.invulnTicks = 0;
        if (i % 50 === 0) damagePlayer(s, 10);
        stepSim(s, { ...AIM, attack: true });
      }
      return JSON.stringify(s);
    };
    expect(go()).toBe(go());
  });
});
