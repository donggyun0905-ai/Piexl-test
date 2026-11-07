import { describe, expect, it } from "vitest";
import { HELLFIST as H } from "../weaponsHellfist";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";
import { hfReach } from "./hellfistKit";

function hellfist(x = 90, ...perks: string[]): RunState {
  const s = createRun(5, "hellfist");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.enemies = [{ ...enemy(1, x, 100, 99999), rootTicks: 99999 }];
  return s;
}
/** 한 박자 (대기 없이 · 적 자리 그대로) */
function hit(s: RunState): void {
  s.player.attackCooldown = 0;
  const x = s.enemies[0]!.x;
  for (const e of s.enemies) e.x = x;
  stepSim(s, FIRE);
}
const foe = (s: RunState) => s.enemies[0]!;

describe("헬피스트", () => {
  it("찌르기 → 내려찍기 → 허공 긁기 세 박자", () => {
    const s = hellfist();
    const seen: number[] = [];
    for (let i = 0; i < 4; i++) {
      hit(s);
      seen.push(s.player.hfLast!.k);
    }
    expect(seen).toEqual([0, 1, 2, 0]);
  });

  it("허공 긁기는 멀리 있는 적도 가리켜 검격", () => {
    const s = hellfist(60 + 150);
    s.player.hfStep = 2;
    const hp = foe(s).hp;
    hit(s);
    expect(foe(s).hp).toBeLessThan(hp);
    expect(s.effects.some((e) => e.kind === "hfClawFx")).toBe(true);
  });

  it("맞힐수록 악마화가 쌓여 사거리가 늘어남 · 한참 안 맞히면 빠짐", () => {
    const s = hellfist();
    const r0 = hfReach(s.player);
    for (let i = 0; i < 6; i++) hit(s);
    expect(s.player.hfRage).toBe(6);
    expect(hfReach(s.player)).toBeGreaterThan(r0);
    s.enemies = [];
    for (let i = 0; i < H.rageHold + H.rageDecay * 2 + 2; i++) stepSim(s, { ...FIRE, attack: false });
    expect(s.player.hfRage).toBeLessThan(6);
  });

  it("성흔이 가득 차면 적혈 각성 · 공격이 빨라지고 맞히면 회복", () => {
    const s = hellfist();
    s.player.sgGauge = 99;
    hit(s);
    expect(s.player.sgAwake ?? 0).toBeGreaterThan(0);
    expect(s.effects.some((e) => e.kind === "hfAwakeFx")).toBe(true);
    s.player.hp = 50;
    hit(s);
    expect(s.player.hp).toBeGreaterThan(50);
  });

  it("같은 시드면 같은 결과", () => {
    const run = () => {
      const s = hellfist();
      for (let i = 0; i < 30; i++) hit(s);
      return foe(s).hp;
    };
    expect(run()).toBe(run());
  });
});
