import { EMPTY_INPUT, packInputs } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { setupHub } from "./hub";
import { call, memorySql } from "./testing";

const player = "arena000-0000-4000-8000-000000000000";
const submit = (level: number, ticks: number, inputs: string) => ({ player, nickname: "아레나", seedText: "ABCD1234", character: "warden", unlocks: [], level, ticks, inputs });

describe("레이드 아레나 순위표", () => {
  it("잘못된 레벨·시간은 거절 · 다시 돌려서 맞지 않으면 거절", async () => {
    const ctx = setupHub(memorySql());
    expect((await call(ctx, "/api/arena/submit", submit(0, 100, ""))).body.error).toBe("bad_request");
    expect((await call(ctx, "/api/arena/submit", submit(16, 100, ""))).body.error).toBe("bad_request");
    const inputs = await packInputs(Array.from({ length: 300 }, () => EMPTY_INPUT));
    expect((await call(ctx, "/api/arena/submit", submit(5, 300, inputs))).body.error).toBe("replay");
  });

  it("높은 레벨이 위, 같으면 빠른 시간 · 30위 안에 못 들면 확인 없이 돌려줌", async () => {
    const ctx = setupHub(memorySql());
    for (let i = 0; i < 30; i++) {
      ctx.sql.exec("INSERT INTO arena (user, nickname, level, ticks, character, finished) VALUES (?, ?, ?, ?, ?, ?)", `u${i}`, `p${i}`, 5 + (i % 3), 9000 - i * 10, "warden", i);
    }
    const res = await call(ctx, "/api/arena/submit", submit(2, 50000, "x"));
    expect(res.body.rank).toBeNull();
    const board = res.body.entries as { level: number; ticks: number }[];
    expect(board).toHaveLength(30);
    for (let i = 1; i < board.length; i++) {
      const a = board[i - 1]!;
      const b = board[i]!;
      expect(a.level > b.level || (a.level === b.level && a.ticks <= b.ticks)).toBe(true);
    }
  });
});
