import { describe, expect, it } from "vitest";
import { setupHub } from "./hub";
import { call, memorySql } from "./testing";

const p1 = "eraid000-0000-4000-8000-000000000001";
const p2 = "eraid000-0000-4000-8000-000000000002";
const submit = (player: string, ticks: number, o: Record<string, unknown> = {}) => ({ player, nickname: "레이더", boss: "lucifer", ticks, character: "warden", party: ["warden", "mage"], humans: 1, ...o });

describe("레이드 랭킹 (이벤트 보스)", () => {
  it("이상한 값은 거절 · 빠른 순 · 사람마다 가장 빠른 기록만", async () => {
    const ctx = setupHub(memorySql());
    expect((await call(ctx, "/api/eraid/submit", submit(p1, 10))).body.error).toBe("bad_request");
    expect((await call(ctx, "/api/eraid/submit", submit(p1, 9000, { boss: "dragon" }))).body.error).toBe("bad_request");
    expect((await call(ctx, "/api/eraid/submit", submit(p1, 9000, { humans: 3 }))).body.error).toBe("bad_request");
    expect((await call(ctx, "/api/eraid/submit", submit(p1, 9000))).body.rank).toBe(1);
    expect((await call(ctx, "/api/eraid/submit", submit(p2, 8000, { nickname: "빠름" }))).body.rank).toBe(1);
    const slow = await call(ctx, "/api/eraid/submit", submit(p1, 12000));
    expect(slow.body.improved).toBe(false);
    expect(slow.body.rank).toBe(2);
    const board = (await call(ctx, "/api/eraid/board")).body.boards as Record<string, { nickname: string; ticks: number; party: string[] }[]>;
    expect(board.lucifer!.map((e) => [e.nickname, e.ticks])).toEqual([["빠름", 8000], ["레이더", 9000]]);
    expect(board.lucifer![0]!.party).toEqual(["warden", "mage"]);
  });
});
