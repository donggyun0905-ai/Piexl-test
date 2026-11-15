// 퀘스트 표 (progress/quests): 장소가 실제로 있는지 · 장이 차례로 열리는지 · 모드가 빠짐없이 열리는지 · 글자
import { describe, expect, it } from "vitest";
import { QUEST_TEXT } from "../i18n/text/quest";
import { advanceQuests, questStage } from "../progress/quest";
import { QUESTS } from "../progress/quests";
import { FEATURE_STAGE, LAST_STAGE, type Feature } from "../progress/storyStage";
import { REGIONS } from "./worldPlaces";

describe("메인 퀘스트", () => {
  it("가야 할 장소는 그 지역에 있음 · 열어 주는 지역도 있음", () => {
    for (const q of QUESTS) {
      for (const c of q.need) if ("visit" in c) expect(REGIONS[c.region]?.places.some((p) => p.id === c.visit), c.visit).toBe(true);
      for (const f of q.fields ?? []) expect(REGIONS[f], f).toBeDefined();
    }
  });
  it("장은 차례로 열리고 마지막 퀘스트가 마지막 장 · 상점·레이드 말고 모든 모드를 엶", () => {
    const stages = QUESTS.flatMap((q) => (q.stage ? [q.stage] : []));
    expect(stages).toEqual([...stages].sort((a, b) => a - b));
    expect(stages.at(-1)).toBe(LAST_STAGE);
    const opened = new Set(QUESTS.flatMap((q) => q.opens ?? []));
    for (const f of Object.keys(FEATURE_STAGE) as Feature[]) if (f !== "shop" && f !== "raid") expect(opened.has(f), f).toBe(true);
  });
  it("퀘스트마다 이름·끝냄 글자 (한·영·일)", () => {
    const text = QUEST_TEXT as Record<string, { ko: string; en: string; ja: string }>;
    QUESTS.forEach((_, i) => {
      for (const k of [`q${i}Title`, `q${i}Done`]) expect(text[k]?.ja, k).toBeTruthy();
    });
  });
  it("처음: 아무 퀘스트도 안 끝남 (아지트 밖으로 나가야 첫 퀘스트)", () => {
    expect(advanceQuests()).toEqual([]);
    expect(questStage()).toBe(0);
  });
});
