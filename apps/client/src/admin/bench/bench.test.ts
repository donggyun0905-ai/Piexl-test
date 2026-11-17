import { CHARACTER_IDS, createRun } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { botInput, newMem } from "./benchBot";
import { startBench } from "./benchRun";
import { averageRows } from "./benchScore";

describe("관리자 AI 측정", () => {
  it("봇 입력: 이동은 본편처럼 -100~100 · 첫 방에서 출구 쪽으로 걸음", () => {
    const s = createRun(7, "warden");
    const inp = botInput(s, newMem());
    expect(Math.round(Math.hypot(inp.moveX, inp.moveY))).toBe(100);
  });
  it("한 판: 잠깐 돌려도 오류 없이 방을 넘어가며 피해를 줌 (히든 아닌 캐릭터 몇)", () => {
    for (const c of [CHARACTER_IDS[0]!, CHARACTER_IDS[2]!, CHARACTER_IDS[CHARACTER_IDS.length - 1]!]) {
      const job = startBench(c, 10007);
      for (let i = 0; i < 4 && !job.step(150); i++);
      expect(job.run.tick).toBeGreaterThan(600);
      expect(job.row.dealt).toBeGreaterThan(0);
    }
  });
  it("평균·점수: 빨리 깬 쪽이 점수가 높고 등급이 붙음", () => {
    const base = { floor: 6, deaths: 2, dealt: 1000, fightTicks: 600, taken: 100, healed: 10, skips: 0, bossCleared: true, bossDeaths: 1, bossTicks: 6000, bossPct: 100, bossDealt: 500, bossTaken: 50 };
    const rows = averageRows([{ ...base, character: "warden", clearTicks: 30000 }, { ...base, character: "mage", clearTicks: 60000 }, { ...base, character: "mage", clearTicks: 0, floor: 3, bossCleared: false, bossTicks: 0, bossPct: 0 }]);
    expect(rows[0]!.character).toBe("warden");
    expect(rows[0]!.score).toBeGreaterThan(rows[1]!.score);
    expect(rows[1]!.runs).toBe(2);
    expect(rows[1]!.cleared).toBe(1);
  });
});
