import { describe, expect, it } from "vitest";
import { CHARACTERS } from "../characters";
import type { WeaponId } from "../content";
import { WANDERER as W } from "../weaponsWanderer";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

function wanderer(weapon: WeaponId = "wdKatana", ...perks: string[]): RunState {
  const s = createRun(5, "wanderer");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 75, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const IDLE = { ...FIRE, attack: false };

describe("방랑객", () => {
  it("기본: 예리함 25% · 예리함이 터지면 방어가 깎이고 칼빛 효과", () => {
    expect(CHARACTERS.wanderer.sharpness).toBe(0.25);
    const s = wanderer();
    for (let i = 0; i < 400 && !s.enemies[0]!.sharpT; i++) stepSim(s, FIRE);
    expect(s.enemies[0]!.sharpT).toBeGreaterThan(0);
  });

  for (const w of ["wdKatana", "wdIai", "wdZone", "wdStorm", "wdTempest", "wdCrescent", "wdTwin", "wdNodachi", "wdFlurry", "wdMoon"] as WeaponId[]) {
    it(`무기 ${w}: 적에게 피해`, () => {
      const s = wanderer(w);
      // 달빛 일섬은 2초 뒤에 베임
      for (let i = 0; i < 90 + (w === "wdMoon" ? W.moonDelay : 0); i++) stepSim(s, FIRE);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("달빛 일섬: 지나간 줄의 적은 2초 뒤에 베임 · 무심의 원에서 대시하면 원 안 적이 멈추고 크게 베임", () => {
    const m = wanderer("wdMoon");
    for (let i = 0; i < 20 && !m.player.wdMoon?.length; i++) stepSim(m, FIRE);
    expect(m.player.wdMoon?.length).toBe(1);
    const z = wanderer("wdZone");
    z.player.wdZone = { x: z.player.x, y: z.player.y, linger: 99 };
    z.enemies[0]!.x = z.player.x + 30;
    z.enemies[0]!.wdCutT = 999999;
    z.player.dashTicks = 5;
    stepSim(z, { ...FIRE, attack: false });
    expect(z.enemies[0]!.stunTicks).toBeGreaterThan(0);
    expect(lost(z)).toBeGreaterThan(z.player.stats.damage * 3);
  });

  it("무심의 원: 1초 가만히 서면 원이 펼쳐지고, 멀리 있어도 원 안의 적을 바로 벰", () => {
    const s = wanderer("wdZone");
    s.enemies[0]!.x = 50 + W.zoneR - 10;
    for (let i = 0; i < W.zoneStill - 5; i++) stepSim(s, IDLE);
    expect(s.player.wdZone).toBeUndefined();
    expect(lost(s)).toBe(0);
    for (let i = 0; i < 10; i++) stepSim(s, IDLE);
    expect(s.player.wdZone).toBeDefined();
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * W.zoneMul * 0.9);
  });

  it("천검란: 게이지가 차면 방 전체 칼날 폭풍", () => {
    const s = wanderer("wdTempest");
    s.enemies.push({ ...enemy(2, 200, 40, 99999), rootTicks: 99999 });
    s.player.wdGauge = W.tempestNeed;
    stepSim(s, IDLE);
    expect(s.enemies[1]!.hp).toBeLessThan(99999);
    for (let i = 0; i < W.tempestGap * W.tempestHits; i++) stepSim(s, IDLE);
    expect(s.player.wdTempest).toBeUndefined();
    expect(s.player.wdGauge).toBe(0);
  });

  it("같은 시드면 같은 결과", () => {
    const run = () => {
      const s = wanderer("wdFlurry", "wdHone", "wdSheath", "wdRain");
      for (let i = 0; i < 200; i++) stepSim(s, FIRE);
      return lost(s);
    };
    expect(run()).toBe(run());
  });
});
