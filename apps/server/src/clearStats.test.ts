import { describe, expect, it } from "vitest";
import { clearRows } from "./clearStats";
import { setupHub } from "./hub";
import { call, memorySql } from "./testing";

describe("캐릭터별 클리어 시간", () => {
  it("캐릭터마다 횟수·합계·가장 빠른 시간 · 말이 안 되는 시간·너무 잦은 제출은 막음", async () => {
    let t = 1_000_000;
    const ctx = setupHub(memorySql(), () => t);
    const p1 = "runner00-0000-4000-8000-000000000001";
    const p2 = "runner00-0000-4000-8000-000000000002";
    const min = 60 * 60;
    expect((await call(ctx, "/api/stats/clear", { player: p1, character: "warden", ticks: 20 * min })).body.ok).toBe(true);
    expect((await call(ctx, "/api/stats/clear", { player: p1, character: "warden", ticks: 10 * min })).body.error).toBe("wait");
    expect((await call(ctx, "/api/stats/clear", { player: p2, character: "warden", ticks: 10 * min })).body.ok).toBe(true);
    expect((await call(ctx, "/api/stats/clear", { player: p2, character: "warden", ticks: 60 })).body.error).toBe("bad_request");
    expect((await call(ctx, "/api/stats/clear", { player: p2, character: "nope", ticks: 10 * min })).body.error).toBe("bad_request");
    t += 3 * 60_000;
    expect((await call(ctx, "/api/stats/clear", { player: p1, character: "duck", ticks: 15 * min })).body.ok).toBe(true);
    expect(clearRows(ctx)).toEqual([
      { character: "warden", count: 2, total: 30 * min, best: 10 * min },
      { character: "duck", count: 1, total: 15 * min, best: 15 * min },
    ]);
    // 영웅의 길은 따로 (hero:캐릭터)
    t += 3 * 60_000;
    expect((await call(ctx, "/api/stats/clear", { player: p1, character: "warden", ticks: 200 * min, mode: "hero" })).body.ok).toBe(true);
    expect(clearRows(ctx)).toContainEqual({ character: "hero:warden", count: 1, total: 200 * min, best: 200 * min });
    expect((await call(ctx, "/api/stats/clear", { player: p2, character: "warden", ticks: 20 * min, mode: "x" })).body.error).toBe("bad_request");
  });
});
