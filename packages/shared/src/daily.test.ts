import { describe, expect, it } from "vitest";
import { checkProgress, dayKey, decodeInputs, encodeInputs, nextDayStart, packInputs, replayRun, summarize, unpackInputs } from "./daily";
import { createRng } from "./rng";
import { createRun, EMPTY_INPUT, stepSim, type TickInput } from "./sim/index";

function inputs(n: number): TickInput[] {
  const rng = createRng(3);
  const out: TickInput[] = [];
  let cur = EMPTY_INPUT;
  for (let i = 0; i < n; i++) {
    if (i % 25 === 0) cur = { ...EMPTY_INPUT, moveX: rng.int(-100, 100), moveY: rng.int(-100, 100), aimX: rng.int(-100, 100), aimY: 50, attack: true };
    out.push({ ...cur, dash: rng.nextFloat() < 0.03, useSlot: rng.nextFloat() < 0.01 ? 2 : 0, pickChoice: rng.nextFloat() < 0.01 ? 3 : 0, autoAim: i > n / 2 });
  }
  return out;
}

describe("일일 도전 공용", () => {
  it("하루는 UTC 0시(한국 오전 9시)에 바뀜", () => {
    expect(dayKey(Date.UTC(2026, 9, 15, 23, 59))).toBe("2026-10-15");
    expect(dayKey(Date.UTC(2026, 9, 16, 0, 0))).toBe("2026-10-16");
    expect(nextDayStart(Date.UTC(2026, 9, 15, 5))).toBe(Date.UTC(2026, 9, 16));
  });

  it("입력 기록 묶기·풀기·압축이 그대로 돌아옴", async () => {
    const list = inputs(3000);
    expect(decodeInputs(encodeInputs(list))).toEqual(list);
    expect(await unpackInputs(await packInputs(list))).toEqual(list);
  });

  it("다시 돌리면 같은 결과, 진행 기록 검사 통과", () => {
    const list = inputs(2400);
    const run = createRun(99, "drifter");
    for (const i of list) stepSim(run, i);
    const again = replayRun(99, "drifter", list);
    expect(summarize(again)).toEqual(summarize(run));
    expect(checkProgress(99, summarize(run))).toBeNull();
  });

  it("진행 기록이 이상하면 걸림", () => {
    const run = createRun(5, "warden");
    for (let i = 0; i < 60; i++) stepSim(run, EMPTY_INPUT);
    const s = summarize(run);
    expect(checkProgress(5, { ...s, floor: 2, score: s.score + 500 })).toBe("floorLog");
    expect(checkProgress(5, { ...s, goldSpent: 10 })).toBe("gold");
    expect(checkProgress(5, { ...s, goldEarned: 20, goldSpent: 10, buys: [{ floor: 1, roomId: 0, kind: "use", itemId: "potion", price: 10 }] })).toBe(
      "buy",
    );
    expect(checkProgress(5, { ...s, won: true, score: s.score + 2000 + Math.floor((15 * 3600 - s.ticks) / 60) * 3 })).not.toBeNull();
  });
});
