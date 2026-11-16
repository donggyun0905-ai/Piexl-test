import { describe, expect, it } from "vitest";
import { skinBaseSheet } from "./skinBase";
import { CHARACTER_SHEETS } from "./spriteSheets";

describe("시즌 스킨 그림 크기", () => {
  it("기본 캐릭터·변신 모습 그림 크기를 따름", () => {
    expect(skinBaseSheet("eclipse_cyber")).toBe("eclipse");
    expect(skinBaseSheet("novice_tiger_lv10")).toBe("novice10");
    expect(skinBaseSheet("abandoned_tiger_p2")).toBe("abandoned2");
    expect(skinBaseSheet("slayer_summer_rage")).toBe("slayer_rage");
    expect(skinBaseSheet("automata_summer_doll")).toBe("automataDoll");
    expect(skinBaseSheet("eclipse_cyber_night")).toBe("eclipseNight");
    expect(CHARACTER_SHEETS.eclipse_cyber?.size).toBe(CHARACTER_SHEETS.eclipse?.size);
  });
});
