// 상태이상 소리를 언제 내는지: 종류별 지속 피해 · 냉기 뒤 경직 = 빙결 → 풀리면 얼음 깨짐 · 그냥 경직 · 느려짐 · 얼음 시계
import type { RunState } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import type { Sfx } from "./sound";
import { statusSounds } from "./statusSounds";

type Foe = { id: number; dotTick?: number; dotAmt?: Record<string, number>; stunTicks?: number; slowTicks?: number };
const runOf = (foes: Foe[]) => ({ floor: 1, roomId: 0, tick: 0, freezeTicks: 0, enemies: foes }) as unknown as RunState;
const step = (run: RunState, ticks = 20): Sfx[] => {
  (run as { tick: number }).tick += ticks;
  const fx: Sfx[] = [];
  statusSounds(run, fx);
  return fx;
};

describe("상태이상 소리", () => {
  it("지속 피해 종류마다 다른 소리 (그 틱에 가장 많이 들어간 것 하나)", () => {
    const e: Foe = { id: 1 };
    const run = runOf([e]);
    step(run);
    Object.assign(e, { dotTick: 1, dotAmt: { burn: 3, poison: 1 } });
    expect(step(run)).toEqual(["stBurn"]);
    Object.assign(e, { dotTick: 2, dotAmt: { bleed: 2 } });
    expect(step(run)).toEqual(["stBleed"]);
    expect(step(run)).toEqual([]);
  });
  it("냉기 직후 경직은 빙결, 풀리면 얼음 깨짐 · 그냥 경직은 띠잉", () => {
    const e: Foe = { id: 1 };
    const run = runOf([e]);
    step(run);
    Object.assign(e, { dotTick: 1, dotAmt: { frost: 1 } });
    expect(step(run, 1)).toEqual(["stFrost"]);
    e.stunTicks = 30;
    expect(step(run)).toEqual(["stFreeze"]);
    e.stunTicks = 0;
    expect(step(run)).toEqual(["stShatter"]);
    e.stunTicks = 30;
    expect(step(run, 100)).toEqual(["stStun"]);
    e.stunTicks = 0;
    expect(step(run)).toEqual([]);
  });
  it("느려짐 · 얼음 시계", () => {
    const e: Foe = { id: 1 };
    const run = runOf([e]);
    step(run);
    e.slowTicks = 10;
    expect(step(run)).toEqual(["stSlow"]);
    (run as { freezeTicks: number }).freezeTicks = 60;
    expect(step(run, 100)).toEqual(["stFreeze"]);
    (run as { freezeTicks: number }).freezeTicks = 0;
    expect(step(run, 100)).toEqual(["stShatter"]);
  });
});
