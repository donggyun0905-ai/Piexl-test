import { describe, expect, it } from "vitest";
import { BLUE_FLAME as F } from "../weaponsBlueFlame";
import { STIGMA } from "../weaponsDawn";
import { bzRings } from "./blueFlameKit";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

function bz(x = 140, ...perks: string[]): RunState {
  const s = createRun(5, "blueFlame");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.enemies = [{ ...enemy(1, x, 100, 99999), rootTicks: 99999 }];
  return s;
}
const foe = (s: RunState) => s.enemies[0]!;
const run = (s: RunState, n: number, input = FIRE) => {
  for (let i = 0; i < n; i++) stepSim(s, input);
};

describe("블루 플레임", () => {
  it("세 겹 범위: 안쪽 < 가운데 < 바깥 = 사거리", () => {
    const s = bz();
    const [a, b, c] = bzRings(s.player);
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
    expect(c).toBe(s.player.stats.range);
  });

  it("안쪽 적에게 불꽃 감옥: 조금 뒤 피해 · 가둠 · 청염", () => {
    const s = bz(60 + 20);
    foe(s).rootTicks = 0;
    const hp = foe(s).hp;
    stepSim(s, FIRE);
    expect(s.player.bzStrikes?.[0]?.k).toBe(0);
    expect(s.effects.some((e) => e.kind === "bzPrisonFx")).toBe(true);
    run(s, F.prisonDelay, { ...FIRE, attack: false });
    expect(foe(s).hp).toBeLessThan(hp);
    expect(foe(s).rootTicks ?? 0).toBeGreaterThan(0);
    expect(foe(s).bzFlameT ?? 0).toBeGreaterThan(0);
  });

  it("가운데 적에게 불꽃 기둥 · 바깥 적에게 화살", () => {
    const mid = bz(60 + 75);
    stepSim(mid, FIRE);
    expect(mid.player.bzStrikes?.[0]?.k).toBe(1);
    expect(mid.effects.some((e) => e.kind === "bzPillarFx")).toBe(true);
    const far = bz(60 + 130);
    const hp = foe(far).hp;
    stepSim(far, FIRE);
    expect(far.player.bzStrikes?.[0]?.k).toBe(2);
    run(far, 30, { ...FIRE, attack: false });
    expect(foe(far).hp).toBeLessThan(hp);
    expect(far.effects.some((e) => e.kind === "bzArrowFx")).toBe(true);
  });

  it("범위에 적이 없으면 조준한 쪽으로 화살만", () => {
    const s = bz(400);
    stepSim(s, FIRE);
    const b = s.player.bzStrikes?.[0];
    expect(b?.k).toBe(2);
    expect(b?.tg).toBeUndefined();
  });

  it("청염은 공격을 멈춰도 조금씩 타들어 감 (보통 화상보다 셈)", () => {
    const s = bz(60 + 20);
    run(s, F.prisonDelay + 1);
    const hp = foe(s).hp;
    run(s, 61, { ...FIRE, attack: false, aimX: 0 });
    expect(foe(s).hp).toBeLessThan(hp);
    expect(F.flameMul).toBeGreaterThan(0.25);
  });

  it("성흔이 가득 차면 열화상 각성: 몸 고정·무적 · 누른 곳에 거대한 화살 폭격 · 끝나면 돌아옴", () => {
    const s = bz(60 + 20);
    s.player.sgGauge = STIGMA.max - 0.5;
    run(s, F.prisonDelay + 2);
    expect(s.player.bzUlt).toBe(true);
    const x = s.player.x;
    run(s, 50, { ...FIRE, attack: false, moveX: 100 });
    expect(s.player.x).toBe(x);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    stepSim(s, { ...FIRE, moveX: 100 });
    expect(s.player.bzStrikes?.some((b) => b.k === 4 && b.x > x + 100)).toBe(true);
    run(s, F.ultFly, { ...FIRE, attack: false });
    expect(s.effects.some((e) => e.kind === "bzBombFx")).toBe(true);
    run(s, STIGMA.awakeTicks, { ...FIRE, attack: false });
    expect(s.player.bzUlt).toBeUndefined();
  });

  it("푸른 날개: 머리 위에서 앞쪽 바닥으로 화살비", () => {
    const s = bz(60 + 80, "bzWing");
    stepSim(s, { ...FIRE, attack: false });
    s.player.bzWing = F.wingTicks;
    s.player.bzRain = F.rainCount;
    const hp = foe(s).hp;
    run(s, F.rainWait + 1, { ...FIRE, attack: false });
    const r = s.player.bzStrikes?.find((b) => b.k === 3);
    expect(r).toBeDefined();
    expect(r!.y0).toBeLessThan(s.player.y);
    expect(r!.x).toBeGreaterThan(s.player.x);
    run(s, F.wingTicks, { ...FIRE, attack: false });
    expect(s.player.bzWing).toBeUndefined();
    expect(foe(s).hp).toBeLessThanOrEqual(hp);
  });
});
