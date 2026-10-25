import { describe, expect, it } from "vitest";
import { setupHub } from "./hub";
import { memorySql } from "./testing";
import { takeTurn, TURN_DAILY_PER_IP, TURN_MONTHLY_MAX } from "./turnBudget";

describe("중계(TURN) 안전장치", () => {
  it("한 사람은 하루 한도까지, 전체는 한 달 한도까지만 내주고 다음 달에 다시", () => {
    let now = Date.UTC(2026, 9, 1);
    const ctx = setupHub(memorySql(), () => now);
    for (let i = 0; i < TURN_DAILY_PER_IP; i++) expect(takeTurn(ctx, "a")).toBe(true);
    expect(takeTurn(ctx, "a")).toBe(false);
    for (let i = TURN_DAILY_PER_IP; i < TURN_MONTHLY_MAX; i++) expect(takeTurn(ctx, `ip${i}`)).toBe(true);
    expect(takeTurn(ctx, "new")).toBe(false);
    now = Date.UTC(2026, 10, 1);
    expect(takeTurn(ctx, "new")).toBe(true);
  });
});
