import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, GACHA_COUPONS, GACHA_LIMITED_ODDS, GACHA_ONLY, GACHA_SKIN_ODDS, LIMITED_THEMES, limitedSkins, SHOP_SKINS } from "./skins";

describe("스킨·뽑기 표", () => {
  it("뽑기 확률 합은 1, 쿠폰 상품은 적게(최대 5장)", () => {
    const sum = GACHA_LIMITED_ODDS + GACHA_SKIN_ODDS + GACHA_COUPONS.reduce((s, [, p]) => s + p, 0);
    expect(sum).toBeCloseTo(1, 6);
    expect(Math.max(...GACHA_COUPONS.map(([n]) => n))).toBeLessThanOrEqual(5);
  });

  it("한정 테마: 범 풍류는 시즌 2 빼고, 여름 파도는 시즌 2만 (모든 캐릭터에 하나씩) · 상점에서는 안 팖", () => {
    expect(LIMITED_THEMES.reduce((n, th) => n + limitedSkins(th).length, 0)).toBe(CHARACTER_IDS.length);
    expect(limitedSkins("summer")).toContain("fly_summer");
    expect(limitedSkins("tiger")).not.toContain("fly_tiger");
    for (const th of LIMITED_THEMES) {
      for (const id of limitedSkins(th)) {
        expect(GACHA_ONLY).toContain(id);
        expect(SHOP_SKINS).not.toContain(id);
      }
    }
  });
});
