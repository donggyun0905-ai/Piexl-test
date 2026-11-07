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
    for (let i = 0; i < 40 && !s.player.sgAwake; i++) {
      s.player.blAmmo = B.mag;
      shot(s);
    }
    expect(stigmaGauge(s.player)!.awake).toBe(true);
    expect(s.effects.some((f) => f.kind === "blAwakeFx")).toBe(true);
    shot(s);
    expect(s.enemies[0]!.moon).toBeGreaterThan(0);
    for (let i = 0; i < STIGMA.awakeTicks + 5; i++) stepSim(s, { ...FIRE, attack: false });
    expect(s.player.sgAwake).toBeUndefined();
    expect(s.player.sgGauge).toBe(0);
  });

  it("탄창 5발 · 5번째 발은 확정 치명타 · 다 쓰면 못 쏨 → 한 발씩 장전", () => {
    const s = blast();
    s.enemies = [{ ...enemy(1, 120, 100, 9999999), rootTicks: 99999 }];
    for (let i = 0; i < B.mag; i++) shot(s);
    expect(s.player.blAmmo).toBe(0);
    const fx = s.effects.filter((f) => f.kind === "blShotFx");
    expect(fx.map((f) => ((f.style ?? 0) & 2) === 2)).toEqual([false, false, false, false, true]);
    const n = s.effects.filter((f) => f.kind === "blShotFx").length;
    shot(s);
    expect(s.effects.filter((f) => f.kind === "blShotFx").length).toBe(n);
    for (let i = 0; i < B.loadTicks + 2; i++) stepSim(s, FIRE);
    expect(s.effects.some((f) => f.kind === "blLoadFx")).toBe(true);
    // 한 발 장전되면 바로 쏨 (누르고 있으면) · 치명타 탄은 다시 5번째 발에서
    expect(s.player.blAmmo).toBe(0);
    expect(s.player.blShots).toBe(1);
  });

  it("대시: 긴 슬라이딩 슬로우모션 · 탄창이 파란 탄 4발로 바뀌어 미끄러지는 동안 다 쏨 · 다시 쓰기 대기", () => {
    const s = blast();
    s.enemies = [{ ...enemy(1, 160, 100, 9999999), rootTicks: 99999 }];
    stepSim(s, { ...FIRE, attack: false, dash: true });
    expect(s.player.blSlow).toBeGreaterThan(0);
    expect(s.player.dashTicks).toBeGreaterThan(B.slowTicks - 3);
    expect(s.player.blBlue).toBe(B.blueN);
    const x0 = s.player.x;
    let ticks = 0;
    while ((s.player.blSlow ?? 0) > 0 && ticks < 300) {
      stepSim(s, FIRE);
      ticks++;
      if (s.player.blSlow) expect(s.player.blBlue).toBeGreaterThanOrEqual(0);
    }
    expect(ticks).toBeGreaterThan(B.blueN);
    expect(s.player.blBlue).toBeUndefined();
    // 슬로우모션 중엔 파란 탄만 쓰고, 끝나면 원래 탄창 그대로 (끝난 틱에 바로 한 발 쏠 수 있음)
    expect(s.player.blAmmo ?? B.mag).toBeGreaterThanOrEqual(B.mag - 1);
    expect(s.player.x).toBeGreaterThan(x0);
    expect(s.player.dashTicks).toBeLessThanOrEqual(1);
    expect(s.player.blSlowCd).toBeGreaterThan(0);
  });

  it("슬라이딩 중엔 누르는 방향으로 방향을 바꿔 움직임", () => {
    const s = blast();
    stepSim(s, { ...FIRE, attack: false, dash: true, moveX: 1 });
    expect(s.player.blSlow).toBeGreaterThan(0);
    const y0 = s.player.y;
    for (let i = 0; i < 10; i++) stepSim(s, { ...FIRE, attack: false, moveY: 1 });
    expect(s.player.dashDirY).toBe(1);
    expect(s.player.y).toBeGreaterThan(y0 + 5);
  });

  it("아이템: 남은 달빛은 각성 뒤 성흔이 남음", () => {
    const s = blast("blRemain");
    s.player.sgAwake = s.player.sgAwakeMax = 2;
    stepSim(s, { ...FIRE, attack: false });
    stepSim(s, { ...FIRE, attack: false });
    expect(s.player.sgGauge).toBeCloseTo(STIGMA.max * 0.3);
  });
});
