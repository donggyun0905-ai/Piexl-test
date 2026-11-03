import { describe, expect, it } from "vitest";
import "../balanceTables";
import { introNext, introRuns, INTRO_RULES } from "./intro";
import { startFloor } from "./rooms";
import { createRun } from "./run";

const types = (unlocks: string[], floor: number) => {
  const s = createRun(7, "warden", unlocks);
  startFloor(s, floor);
  return s.map.rooms.map((r) => r.type);
};

describe("특별한 방 단계적 열기", () => {
  it("표시가 없으면 모두 열림 (일일 도전·서버 다시 돌리기 그대로)", () => {
    expect(introRuns(createRun(1, "warden"))).toBe(Number.POSITIVE_INFINITY);
    expect(types([], 4)).toContain("trial");
  });
  it("처음 판은 제단·단련·시련이 전투방 · 판 수만큼 차례로 열림", () => {
    for (const f of [3, 4, 5]) {
      const t0 = types(["intro:0"], f);
      for (const k of ["altar", "gym", "trial"]) expect(t0).not.toContain(k);
    }
    expect(types([`intro:${INTRO_RULES.TRIAL}`], 4)).toContain("trial");
    expect(types([`intro:${INTRO_RULES.TRIAL - 1}`], 4)).not.toContain("trial");
    expect(introNext(0)).toEqual({ room: "ALTAR", at: INTRO_RULES.ALTAR });
    expect(introNext(INTRO_RULES.SECRET)).toBeNull();
  });
});
