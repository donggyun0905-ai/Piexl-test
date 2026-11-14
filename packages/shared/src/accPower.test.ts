import { describe, expect, it } from "vitest";
import { accPower, ACC_POWER_RULES } from "./accPower";

describe("투력", () => {
  it("장비 없으면 기본값 · 능력치가 오르면 늘고 받는 피해 +면 줄어듦", () => {
    expect(accPower(undefined)).toBe(ACC_POWER_RULES.base);
    expect(accPower({ atk: 5 })).toBe(ACC_POWER_RULES.base + 100);
    expect(accPower({ taken: 0.1 })).toBeLessThan(ACC_POWER_RULES.base);
    expect(accPower({ taken: -10 })).toBeGreaterThan(ACC_POWER_RULES.base);
  });
});
