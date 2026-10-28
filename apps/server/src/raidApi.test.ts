import { createRng, EMPTY_INPUT, packInputs, type TickInput } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { setupHub } from "./hub";
import { call, drainReplays, memorySql } from "./testing";

const player = "raider00-0000-4000-8000-000000000000";

function randomInputs(ticks: number): TickInput[] {
  const rng = createRng(3);
  return Array.from({ length: ticks }, (_, i) => ({ ...EMPTY_INPUT, moveX: i % 60 < 30 ? rng.int(-100, 100) : 0, autoAim: true }));
}

function submit(ticks: number, inputs: string, boss = "dragon") {
  return { player, nickname: "빠른손", seedText: "ABCD1234", character: "warden", unlocks: [], boss, ticks, inputs };
}

describe("레이드 명예의 전당", () => {
  it("보스별 빈 순위표 · 잘못된 보스·시간은 거절", async () => {
    const ctx = setupHub(memorySql());
    const res = await call(ctx, "/api/raid/board");
    expect(Object.keys(res.body.boards as object).sort()).toEqual(["dragon", "godeater", "plight"]);
    expect((await call(ctx, "/api/raid/submit", submit(100, "", "hulk"))).body.error).toBe("bad_request");
    expect((await call(ctx, "/api/raid/submit", submit(-5, ""))).body.error).toBe("bad_request");
  });

  it("1~3위는 받아 둔 뒤 나눠 다시 돌려서 보스를 그 시간에 잡지 못하면 순위표에서 숨김", async () => {
    const ctx = setupHub(memorySql());
    const res = await call(ctx, "/api/raid/submit", submit(3000, await packInputs(randomInputs(600))));
    expect(res.body).toMatchObject({ improved: true, rank: 1 });
    expect((await call(ctx, "/api/raid/submit", submit(2000, "x"))).body.error).toBe("bad_inputs");
    await drainReplays(ctx);
    expect(((await call(ctx, "/api/raid/board")).body.boards as Record<string, unknown[]>).dragon).toEqual([]);
  });

  it("10위 안에 못 들면 확인 없이 그냥 돌려줌 · 순위표는 빠른 순", async () => {
    const ctx = setupHub(memorySql());
    for (let i = 0; i < 10; i++) {
      ctx.sql.exec("INSERT INTO raid (boss, user, nickname, ticks, character, finished) VALUES (?, ?, ?, ?, ?, ?)", "dragon", `u${i}`, `p${i}`, 5000 - i * 100, "warden", i);
    }
    const res = await call(ctx, "/api/raid/submit", submit(9000, "x"));
    expect(res.body.improved).toBe(false);
    expect(res.body.rank).toBeNull();
    const board = (res.body.boards as Record<string, { nickname: string; ticks: number }[]>).dragon!;
    expect(board).toHaveLength(10);
    expect(board[0]!.ticks).toBe(4100);
    expect(board.map((e) => e.ticks)).toEqual([...board.map((e) => e.ticks)].sort((a, b) => a - b));
  });
});
