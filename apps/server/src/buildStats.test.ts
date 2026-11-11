import { describe, expect, it } from "vitest";
import { buildOf } from "./buildStats";
import { setupHub } from "./hub";
import { call, memorySql } from "./testing";

describe("빌드 통계", () => {
  it("캐릭터마다 판 수·클리어 수·무기/패시브 고른 판 수를 더함 · 모르는 값·너무 잦은 제출은 막음", async () => {
    let t = 1_000_000;
    const ctx = setupHub(memorySql(), () => t);
    const p1 = "builder0-0000-4000-8000-000000000001";
    const p2 = "builder0-0000-4000-8000-000000000002";
    const run = (player: string, won: boolean, passives: string[]) => call(ctx, "/api/stats/build", { player, character: "drifter", weapon: "crossbow", passives, won });
    expect((await run(p1, true, ["secondWind", "secondWind", "malice"])).body.ok).toBe(true);
    expect((await run(p1, true, [])).body.error).toBe("wait");
    expect((await run(p2, false, ["malice"])).body.ok).toBe(true);
    t += 3 * 60_000;
    expect((await run(p2, false, ["nope"])).body.error).toBe("bad_request");
    expect((await call(ctx, "/api/stats/build", { player: p2, character: "drifter", weapon: "nope", passives: [], won: true })).body.error).toBe("bad_request");
    expect(buildOf(ctx, "drifter")).toEqual({ runs: 2, wins: 1, weapons: { crossbow: [2, 1] }, passives: { secondWind: [1, 1], malice: [2, 1] } });
    expect(buildOf(ctx, "warden").runs).toBe(0);
  });
});
