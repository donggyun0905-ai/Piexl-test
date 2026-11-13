import { describe, expect, it } from "vitest";
import { FACTIONS } from "../story/storyData";
import { charInStory, FACTION_STAGE, FEATURE_STAGE, featureOpen, LAST_STAGE, STAGE_GOALS, storyStage } from "./storyStage";

describe("스토리 진행 단계", () => {
  it("장마다 조건 하나 · 진영·모드는 마지막 장 안에서 열림", () => {
    expect(STAGE_GOALS.length).toBe(LAST_STAGE);
    for (const f of FACTIONS) expect(FACTION_STAGE[f.id]).toBeLessThanOrEqual(LAST_STAGE);
    for (const n of Object.values(FEATURE_STAGE)) expect(n).toBeLessThanOrEqual(LAST_STAGE);
  });
  it("처음 온 사람: 프롤로그 · 처음 열린 셋은 보임 · 다른 모드·진영은 숨김", () => {
    expect(storyStage()).toBe(0);
    for (const c of ["warden", "drifter", "mage"] as const) expect(charInStory(c)).toBe(true);
    expect(charInStory("gunner")).toBe(false);
    expect(featureOpen("daily")).toBe(false);
    expect(featureOpen("daily", 1)).toBe(true);
  });
});
