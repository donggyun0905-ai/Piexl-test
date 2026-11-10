import { describe, expect, it } from "vitest";
import { INCISION as I } from "../weaponsIncision";
import { STIGMA } from "../weaponsDawn";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

function ic(x = 90, ...perks: string[]): RunState {
  const s = createRun(5, "incision");
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
/** 공격 한 번 할 때까지 */
function swing(s: RunState): void {
  const n = s.player.attackCount;
  for (let i = 0; i < 200 && s.player.attackCount === n; i++) stepSim(s, FIRE);
}

describe("인시전", () => {
  it("네 박자: 오른 베기 → 왼 베기 → 교차 → 회오리 → 다시 처음", () => {
    const s = ic();
    const ks: number[] = [];
    let whirl = false;
    for (let i = 0; i < 5; i++) {
      swing(s);
      ks.push(s.player.icLast!.k);
      whirl ||= s.effects.some((e) => e.kind === "icWhirlFx");
    }
    expect(ks).toEqual([0, 1, 2, 3, 0]);
    expect(whirl).toBe(true);
  });

  it("회오리 베기는 뒤쪽 적도 맞힘", () => {
    const s = ic(40);
    s.player.icStep = 3;
    const hp = foe(s).hp;
    swing(s);
    expect(foe(s).hp).toBeLessThan(hp);
  });

  it("맞힐수록 콤보가 오르고, 단계마다 공격이 빨라짐", () => {
    const slow = ic();
    for (let i = 0; i < 240; i++) {
      foe(slow).x = 90; // 밀려나도 제자리 (계속 붙어 싸우는 것처럼)
      stepSim(slow, FIRE);
    }
    expect(slow.player.icCombo ?? 0).toBeGreaterThan(I.comboStep);
    const fast = ic();
    fast.player.icCombo = I.comboStep * I.tierMax;
    fast.player.icNextLeap = 9999;
    const plain = ic();
    plain.player.icNextLeap = 9999;
    run(fast, 120);
    run(plain, 120);
    expect(fast.player.attackCount).toBeGreaterThan(plain.player.attackCount);
  });

  it("못 맞히면 콤보가 끊기고, 맞으면 반으로", () => {
    const s = ic(500);
    s.player.icCombo = 20;
    run(s, I.comboHold + 2, EMPTY_INPUT);
    expect(s.player.icCombo ?? 0).toBe(0);
    const t = ic(500);
    t.player.icCombo = 20;
    stepSim(t, EMPTY_INPUT);
    t.player.hp -= 5;
    stepSim(t, EMPTY_INPUT);
    expect(t.player.icCombo).toBe(10);
  });

  it("콤보 30이면 다음 공격이 도살 도약 (적에게 뛰어들어 내려찍고 기절)", () => {
    const s = ic(150);
    s.player.icCombo = I.leapEvery - 1;
    s.player.icNextLeap = I.leapEvery;
    s.enemies.push({ ...enemy(2, 75, 100, 99999), rootTicks: 99999 });
    swing(s);
    run(s, I.leapAir + 2, EMPTY_INPUT);
    // 앞 적을 맞혀 콤보 30 → 도약 준비 → 다음 공격이 도약
    if (!s.player.icLeapReady && !s.player.icLeap) {
      swing(s);
      run(s, I.leapAir + 2, EMPTY_INPUT);
    }
    swing(s);
    run(s, I.leapAir + 2, EMPTY_INPUT);
    expect(s.effects.some((e) => e.kind === "icLandFx") || s.player.x > 100).toBe(true);
  });

  it("대시 돌진 연참: 지나가는 적을 두 번 벰", () => {
    const s = ic(80);
    const hp = foe(s).hp;
    stepSim(s, { ...EMPTY_INPUT, moveX: 100, dash: true });
    run(s, 14, { ...EMPTY_INPUT, moveX: 100 });
    expect(foe(s).hp).toBeLessThan(hp);
    expect(s.player.icDashHit?.[1]).toBe(I.dashHits);
  });

  it("성흔이 가득 차면 광란 각성 (콤보가 안 끊김)", () => {
    const s = ic();
    s.player.sgGauge = STIGMA.max - 1;
    swing(s);
    expect(s.player.sgAwake ?? 0).toBeGreaterThan(0);
    expect(s.effects.some((e) => e.kind === "icAwakeFx")).toBe(true);
    s.enemies[0]!.x = 900;
    run(s, I.comboHold + 2, EMPTY_INPUT);
    expect(s.player.icCombo ?? 0).toBeGreaterThan(0);
  });

  it("★ 날아가는 초승달 · 피의 소용돌이 · 도륙 폭발", () => {
    const s = ic(140, "icThrow");
    s.player.icStep = 2;
    swing(s);
    expect(s.player.icWaves?.length).toBe(2);
    const v = ic(40, "icVortex");
    v.player.icStep = 3;
    swing(v);
    expect(v.player.icVortex ?? 0).toBeGreaterThan(0);
    const b = ic(80, "icBurst");
    b.player.icCombo = 9;
    swing(b);
    expect(b.effects.some((e) => e.kind === "icBurstFx")).toBe(true);
  });

  it("전용 아이템 20개를 모두 들고 오래 싸워도 문제없음 (각성·도약·대시 포함)", async () => {
    const { INCISION_PASSIVES } = await import("../itemsIncision");
    const s = ic(90, ...Object.keys(INCISION_PASSIVES));
    s.enemies.push({ ...enemy(2, 120, 130, 400) }, { ...enemy(3, 30, 80, 400) });
    for (let i = 0; i < 900; i++) stepSim(s, i % 120 === 60 ? { ...FIRE, moveX: 100, dash: true } : FIRE);
    expect(s.player.attackCount).toBeGreaterThan(20);
    expect(Number.isFinite(s.player.x) && Number.isFinite(s.player.y)).toBe(true);
  });

  it("다시 시작하면 상태가 지워짐", async () => {
    const { resetIncision } = await import("./incision");
    const s = ic();
    run(s, 60);
    resetIncision(s.player);
    expect(s.player.icCombo).toBeUndefined();
    expect(s.player.icStep).toBeUndefined();
  });
});
