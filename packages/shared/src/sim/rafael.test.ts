import { describe, expect, it } from "vitest";
import { RAFAEL as F } from "../weaponsRafael";
import { RAFAEL_PERKS as K } from "../itemsRafael";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";
import { farMul, rfCooldown } from "./rafaelKit";

const IDLE = { ...FIRE, attack: false };

function rafael(...perks: string[]): RunState {
  const s = createRun(5, "rafael");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 40;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.rfRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [{ ...enemy(1, 120, 100, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
function run(s: RunState, n: number, input = IDLE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
const key = (s: RunState, n: number) => stepSim(s, { ...IDLE, skill: n });
function hit(s: RunState): void {
  s.player.attackCooldown = 0;
  stepSim(s, FIRE);
}

describe("라파엘", () => {
  it("멀수록 피해 증가 (초장거리)", () => {
    const s = rafael();
    const p = s.player;
    expect(farMul(p, { ...s.enemies[0]!, x: 50, y: 100 })).toBe(1);
    expect(farMul(p, { ...s.enemies[0]!, x: 40 + F.farD, y: 100 })).toBeCloseTo(1 + F.farBonus);
  });

  it("가장 강한 적에 표적 · 화살 둘 → 저격", () => {
    const s = rafael();
    s.enemies.push({ ...enemy(2, 160, 100, 500), rootTicks: 99999 });
    hit(s);
    expect(s.player.rfMarks).toEqual([1]);
    hit(s);
    hit(s);
    const fx = s.effects.filter((f) => f.kind === "rfArrowFx");
    expect(fx.map((f) => f.style)).toEqual([0, 0, 1]);
    // 저격은 꿰뚫어 둘 다 맞힘
    expect(s.enemies.every((e) => e.hp < e.maxHp)).toBe(true);
  });

  it("1·2타 화살은 처음 닿은 적만 (관통 화살촉이면 하나 더)", () => {
    const s = rafael();
    s.enemies.push({ ...enemy(2, 160, 100, 99999), rootTicks: 99999 });
    hit(s);
    expect(s.enemies[1]!.hp).toBe(s.enemies[1]!.maxHp);
    const t = rafael("rfPierce");
    t.enemies.push({ ...enemy(2, 160, 100, 99999), rootTicks: 99999 });
    hit(t);
    expect(t.enemies[1]!.hp).toBeLessThan(t.enemies[1]!.maxHp);
  });

  it("표적을 쓰러뜨리면 스킬 대기 감소", () => {
    const s = rafael();
    s.enemies[0]!.hp = s.enemies[0]!.maxHp = 1;
    s.player.rfCd = [100, 100, 100, 100];
    hit(s);
    expect(s.player.rfCd![0]).toBeLessThan(100 * (1 - F.markRefund) + 2);
  });

  it("스킬: 바람 걸음(뒤로·다음 저격) · 화살비 · 스코프 · 천공의 빛 화살", () => {
    const s = rafael();
    key(s, 1);
    expect(s.player.rfEmp).toBe(true);
    run(s, F.stepTicks + 2);
    expect(s.player.x).toBeLessThan(40);
    s.player.x = s.player.prevX = 40;
    key(s, 2);
    run(s, F.stormDelay + F.stormGap * F.stormN);
    expect(lost(s)).toBeGreaterThan(0);
    key(s, 3);
    expect(s.player.rfScope).toBeGreaterThan(0);
    const before = lost(s);
    key(s, 4);
    run(s, F.ultCharge + 2);
    expect(s.effects.some((f) => f.kind === "rfHeavenFx")).toBe(true);
    expect(lost(s) - before).toBeGreaterThan(s.player.stats.damage * F.ultMul);
  });

  it("바람의 기도: 스킬 대기 감소", () => {
    const s = rafael("rfPrayer");
    expect(rfCooldown(s.player, 3)).toBe(Math.round(F.cooldowns[3]! * K.rfPrayer.cd));
  });
});
