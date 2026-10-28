import { createRun, EMPTY_INPUT, packInputs, parseSeed, stepSim, summarize } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { setupHub } from "./hub";
import { queueReplay, runReplayChunk } from "./replayQueue";
import { first } from "./sql";
import { drainReplays, memorySql } from "./testing";

const user = "replay00-0000-4000-8000-000000000000";

async function setup() {
  const sql = memorySql();
  const wakes: number[] = [];
  const ctx = setupHub(sql, () => 1000, {}, undefined, (at) => wakes.push(at));
  const inputs = Array.from({ length: 1500 }, (_, i) => ({ ...EMPTY_INPUT, moveX: i % 120 < 60 ? 100 : -100, attack: true, autoAim: true }));
  const run = createRun(parseSeed("ABCD1234"), "warden");
  for (const i of inputs) if (!run.over) stepSim(run, i);
  const s = summarize(run);
  ctx.sql.exec("INSERT INTO daily (day, user, nickname, score, floor, won, ticks, character, finished, verified) VALUES ('d', ?, 'n', ?, ?, 0, ?, 'warden', 1, 0)", user, s.score, s.floor, s.ticks);
  const job = { kind: "daily" as const, board: "d", user, seedText: "ABCD1234", character: "warden" as const, sudden: false, balance: "default", score: s.score, floor: s.floor, kills: s.kills, won: s.won, ticks: s.ticks };
  queueReplay(ctx, job, await packInputs(inputs.slice(0, run.tick)));
  return { sql, ctx, wakes };
}

const verified = (ctx: ReturnType<typeof setupHub>) => Number(first(ctx.sql, "SELECT verified FROM daily WHERE user = ?", user)?.verified);

describe("1~3위 나눠 다시 돌리기", () => {
  it("넣으면 알람, 조금씩 돌려 결과가 같으면 확인됨 · 대기열이 비면 끝", async () => {
    const { ctx, wakes } = await setup();
    expect(wakes).toEqual([1000]);
    expect(await runReplayChunk(ctx)).toBe(true);
    expect(verified(ctx)).toBe(0);
    await drainReplays(ctx);
    expect(verified(ctx)).toBe(1);
    expect(await runReplayChunk(ctx)).toBe(false);
  });

  it("돌리던 중 서버가 다시 켜지면(메모리 사라짐) 한 번에 돌리는 양을 줄여 처음부터", async () => {
    const { sql, ctx } = await setup();
    await runReplayChunk(ctx);
    const again = setupHub(sql, () => 1000);
    await runReplayChunk(again);
    expect(first(again.sql, "SELECT v FROM meta WHERE k = 'replayChunk'")?.v).toBe("150");
    await drainReplays(again);
    expect(verified(again)).toBe(1);
  });
});
