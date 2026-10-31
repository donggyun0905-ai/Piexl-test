import { describe, expect, it } from "vitest";
import { ALL_SKINS, CHARACTER_IDS, GACHA_COUPONS, GACHA_ECOIN_ODDS, GACHA_LIMITED_ODDS, GACHA_ONLY, isKnownSkin, LIMITED_THEMES, limitedSkins, VICTORY_SKINS } from "./skins";

describe("스킨·뽑기 표", () => {
  it("뽑기 확률 합은 1, 쿠폰 상품은 적게(최대 5장)", () => {
    const sum = GACHA_LIMITED_ODDS + GACHA_ECOIN_ODDS + GACHA_COUPONS.reduce((s, [, p]) => s + p, 0);
    expect(sum).toBeCloseTo(1, 6);
    expect(Math.max(...GACHA_COUPONS.map(([n]) => n))).toBeLessThanOrEqual(5);
  });

  it("한정 테마: 범 풍류는 시즌 2 빼고, 여름 파도는 시즌 2만 (모든 캐릭터에 하나씩)", () => {
    expect(LIMITED_THEMES.reduce((n, th) => n + limitedSkins(th).length, 0)).toBe(CHARACTER_IDS.length);
    expect(limitedSkins("summer")).toContain("fly_summer");
    expect(limitedSkins("tiger")).not.toContain("fly_tiger");
    for (const th of LIMITED_THEMES) for (const id of limitedSkins(th)) expect(GACHA_ONLY).toContain(id);
  });

  it("승리 스킨은 5명만 · 상점 테마 스킨은 없앰", () => {
    expect(VICTORY_SKINS).toEqual(["general_victory", "warden_victory", "gunner_victory", "tracker_victory", "forgotten_victory"]);
    expect(isKnownSkin("mage_victory")).toBe(false);
    expect(isKnownSkin("mage_swim")).toBe(false);
    expect(isKnownSkin("mage_tiger")).toBe(true);
    expect(isKnownSkin("mage_my")).toBe(true);
    expect(ALL_SKINS.some((id) => id.endsWith("_xmas"))).toBe(false);
  });
});
