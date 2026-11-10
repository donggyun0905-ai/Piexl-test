import { describe, expect, it } from "vitest";
import { FACTION_HEAT } from "../factionDefs";
import { SPIRIT_GROW } from "../spiritDefs";
import { createPracticeRun } from "./practice";
import { practiceFactionFill, practiceSkillReset, practiceSpirit, practiceSpiritCards, practiceSpiritStage } from "./practiceFaction";
import { spiritStage } from "./factionSpirit";

describe("연습장 진영 도구", () => {
  it("정령 카드 다시 뽑기는 누를 때마다 다를 수 있음 · 바로 고르기 · 단계", () => {
    const s = createPracticeRun("beast");
    const seen = new Set<string>();
    for (let i = 0; i < 6; i++) {
      s.tick += 7;
      practiceSpiritCards(s);
      seen.add(s.player.fcSpPick!.join());
    }
    expect(seen.size).toBeGreaterThan(1);
    practiceSpirit(s, "owl");
    practiceSpiritStage(s, 2);
    expect(s.player.fcSp).toBe("owl");
    expect(s.player.fcSpKills).toBe(SPIRIT_GROW.grow2);
    expect(spiritStage(s.player)).toBe(2);
  });

  it("게이지 가득 · 스킬 대기 초기화", () => {
    const s = createPracticeRun("gunner");
    practiceFactionFill(s);
    expect(s.player.fcHeat).toBe(FACTION_HEAT.max);
    const b = createPracticeRun("beatrice");
    b.player.btCd = [50, 60, 70, 80];
    practiceSkillReset(b);
    expect(b.player.btCd).toEqual([0, 0, 0, 0]);
    const d = createPracticeRun("blast");
    practiceFactionFill(d);
    expect(d.player.sgAwake).toBeGreaterThan(0);
  });
});
