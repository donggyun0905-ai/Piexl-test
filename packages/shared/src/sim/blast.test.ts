import { describe, expect, it } from "vitest";
import { BLAST as B } from "../weaponsBlast";
import { STIGMA } from "../weaponsDawn";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";
import { stigmaGauge } from "./stigma";

function blast(...perks: string[]): RunState {
  const s = createRun(5, "blast");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 100;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.enemies = [];
  return s;
}
function shot(s: RunState): void {
  s.player.attackCooldown = 0;
  stepSim(s, FIRE);
}
const lost = (s: RunState, i = 0) => s.enemies[i]!.maxHp - s.enemies[i]!.hp;

describe("블래스트", () => {
  it("초근접일수록 셈 · 멀면 약함", () => {
    const a = blast();
    a.enemies = [{ ...enemy(1, 120, 100, 99999), rootTicks: 99999 }];
    shot(a);
    const b = blast();
    b.enemies = [{ ...enemy(1, 100 + B.reach - 4, 100, 99999), rootTicks: 99999 }];
    shot(b);
    expect(lost(a)).toBeGreaterThan(lost(b) * 2);
  });

  it("뒤에 있는 적은 안 맞음", () => {
    const s = blast();
    s.enemies = [{ ...enemy(1, 60, 100, 99999), rootTicks: 99999 }];
    shot(s);
    expect(lost(s)).toBe(0);
  });

  it("초근접 처치는 폭멸: 둘레 적도 맞음", () => {
    const s = blast();
    s.enemies = [{ ...enemy(1, 115, 100, 1), rootTicks: 99999 }, { ...enemy(2, 115, 60, 99999), rootTicks: 99999 }];
    shot(s);
    expect(s.effects.some((f) => f.kind === "blBurstFx")).toBe(true);
    expect(s.enemies.find((e) => e.id === 2)!.hp).toBeLessThan(99999);
  });

  it("성흔: 맞히면 차고 가득 차면 달빛 각성 → 끝나면 0", () => {
    const s = blast();
    s.enemies = [{ ...enemy(1, 120, 100, 9999999), rootTicks: 99999 }];
    expect(stigmaGauge(s.player)).toEqual({ v: 0, awake: false });
    shot(s);
    expect(s.player.sgGauge).toBe(B.gainHit + B.gainNear);
    for (let i = 0; i < 40 && !s.player.sgAwake; i++) shot(s);
    expect(stigmaGauge(s.player)!.awake).toBe(true);
    expect(s.effects.some((f) => f.kind === "blAwakeFx")).toBe(true);
    const before = s.projectiles.length;
    shot(s);
    expect(s.projectiles.length).toBeGreaterThan(before);
    for (let i = 0; i < STIGMA.awakeTicks + 5; i++) stepSim(s, { ...FIRE, attack: false });
    expect(s.player.sgAwake).toBeUndefined();
    expect(s.player.sgGauge).toBe(0);
  });

  it("두 발 쏘고 펌프질이 더 김", () => {
    const s = blast();
    stepSim(s, FIRE);
    const first = s.player.attackCooldown;
    s.player.attackCooldown = 0;
    stepSim(s, FIRE);
    expect(s.player.attackCooldown).toBeGreaterThan(first);
  });

  it("아이템: 남은 달빛은 각성 뒤 성흔이 남음", () => {
    const s = blast("blRemain");
    s.player.sgAwake = s.player.sgAwakeMax = 2;
    stepSim(s, { ...FIRE, attack: false });
    stepSim(s, { ...FIRE, attack: false });
    expect(s.player.sgGauge).toBeCloseTo(STIGMA.max * 0.3);
  });
});
