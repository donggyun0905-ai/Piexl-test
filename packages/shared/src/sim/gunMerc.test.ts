import { describe, expect, it } from "vitest";
import { mercGuardOpen } from "./gunExtras";
import { EMPTY_INPUT, stepSim } from "./index";
import { enemy } from "./perkTestUtil";
import { gunner, hold } from "./gunTestUtil";

describe("거너 특수용병", () => {
  it("특수용병: 쏘며 돌진 → 찌르기 → 샷건 반동으로 물러남 → 수류탄", () => {
    const s = gunner("mercenary");
    const x0 = s.player.x;
    hold(s, 1);
    expect(s.player.x).toBeGreaterThan(x0 + 20);
    let step = s.player.gunStep;
    expect(step).toBe(1);
    for (let k = 0; k < 2 && step !== 3; k++) {
      const before = s.player.attackCount;
      while (s.player.attackCount === before) hold(s, 1);
      step = s.player.gunStep;
    }
    expect(s.player.x).toBeLessThan(x0 + 20);
    const before = s.player.attackCount;
    while (s.player.attackCount === before) hold(s, 1);
    expect(s.pendingBlasts.length).toBe(1);
  });

  it("특수용병: 다음 단계 직전 0.3초(NOW!)에 스페이스를 누르면 대시 대신 보호막 20, NOW!가 아닐 때 누르면 대시 + 보호막·기회 날아감", () => {
    const s = gunner("mercenary");
    const tap = () => {
      stepSim(s, { ...EMPTY_INPUT, dash: true });
      stepSim(s, EMPTY_INPUT);
    };
    const untilNow = () => {
      for (let i = 0; i < 60 && !mercGuardOpen(s); i++) stepSim(s, EMPTY_INPUT);
    };
    // 콤보를 쓰기 전에는 눌러도 없음
    tap();
    expect(s.player.shieldPts ?? 0).toBe(0);
    for (let i = 0; i < 60; i++) stepSim(s, EMPTY_INPUT);
    hold(s, 1);
    // 단계를 쓴 바로 뒤는 아직 NOW!가 아님 → 다음 단계 직전에 열림
    expect(mercGuardOpen(s)).toBe(false);
    untilNow();
    expect(mercGuardOpen(s)).toBe(true);
    expect(s.player.attackCooldown).toBeLessThanOrEqual(18);
    // NOW! 동안 누르면 대시는 나가지 않음 (누르고 있어도)
    stepSim(s, { ...EMPTY_INPUT, dash: true });
    stepSim(s, { ...EMPTY_INPUT, dash: true });
    expect(s.player.dashTicks).toBe(0);
    stepSim(s, EMPTY_INPUT);
    expect(s.player.shieldPts).toBe(20);
    expect(mercGuardOpen(s)).toBe(false);
    // 소리용: 첫 콤보 뒤 성공 (다음 단계 1 → 팅)
    expect(s.player.mercGuards).toBe(1);
    expect(s.player.mercGuardStep).toBe(1);
    // NOW!가 아닐 때 또 누르면 대시가 나가고 보호막이 바로 사라짐
    for (let i = 0; i < 50; i++) stepSim(s, EMPTY_INPUT);
    stepSim(s, { ...EMPTY_INPUT, dash: true });
    expect(s.player.dashTicks).toBeGreaterThan(0);
    expect(s.player.shieldPts).toBe(0);
    // 다음 단계를 쓰고, NOW! 전에 미리 누르면 그 텀은 기회가 날아감
    for (let i = 0; i < 60; i++) stepSim(s, EMPTY_INPUT);
    hold(s, 1);
    tap();
    untilNow();
    expect(mercGuardOpen(s)).toBe(false);
    // 보호막은 1초 뒤 사라짐
    hold(s, 1);
    untilNow();
    tap();
    expect(s.player.shieldPts).toBe(20);
    for (let i = 0; i < 60; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.shieldPts).toBe(0);
  });

  it("특수용병: 돌진은 적 바로 앞에서 멈춤 (몸이 닿지 않음)", () => {
    const s = gunner("mercenary");
    const e = enemy(1, 140, 72);
    s.enemies = [e];
    hold(s, 1);
    expect(s.player.x).toBeGreaterThan(120);
    expect(e.x - s.player.x).toBeGreaterThan(s.player.r + e.r);
  });
});
