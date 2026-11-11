import { describe, expect, it } from "vitest";
import { bossCcGuard, bossSelfStun, CC_GUARD_RULES } from "./ccGuard";
import type { EnemyState, RunState } from "./types";

const run = (tick: number) => ({ tick }) as RunState;

describe("보스 상태이상 쿨타임", () => {
  it("한 번 걸리면 끝까지는 가고, 더 늘지 않으며, 1분 안에는 다시 안 걸림", () => {
    const e = { stunTicks: 30 } as EnemyState;
    bossCcGuard(run(100), e);
    expect(e.stunTicks).toBe(30);
    e.stunTicks = 20;
    e.rootTicks = 90;
    bossCcGuard(run(110), e);
    expect(e.rootTicks).toBe(20);
    e.stunTicks = e.rootTicks = 0;
    e.fearTicks = 40;
    bossCcGuard(run(200), e);
    expect(e.fearTicks).toBe(0);
    e.stunTicks = 40;
    bossCcGuard(run(100 + CC_GUARD_RULES.COOLDOWN), e);
    expect(e.stunTicks).toBe(40);
  });
  it("보스 스스로의 경직은 쿨타임 중에도 걸림", () => {
    const e = { stunTicks: 10 } as EnemyState;
    bossCcGuard(run(0), e);
    e.stunTicks = 0;
    bossSelfStun(run(500), e, 60);
    bossCcGuard(run(501), e);
    expect(e.stunTicks).toBe(60);
  });
});
