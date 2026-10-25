import { createRng, createRun, EMPTY_INPUT, packInputs, parseSeed, stepSim, summarize, type TickInput } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { setupHub } from "./hub";
import { call, memorySql } from "./testing";

function randomInputs(seed: number, ticks: number): TickInput[] {
  const rng = createRng(seed);
  const out: TickInput[] = [];
  let cur = EMPTY_INPUT;
  for (let i = 0; i < ticks; i++) {
    if (i % 30 === 0) cur = { ...EMPTY_INPUT, moveX: rng.int(-100, 100), moveY: rng.int(-100, 100), autoAim: true };
    out.push({ ...cur, dash: rng.nextFloat() < 0.02 });
  }
  return out;
}

async function setup() {
  let t = Date.UTC(2026, 9, 15, 3, 0, 0);
  const ctx = setupHub(memorySql(), () => t);
  const player = "runner00-0000-4000-8000-000000000000";
  const start = await call(ctx, "/api/daily/start", { player });
  const inputs = randomInputs(7, 1800);
  const run = createRun(parseSeed(String(start.body.seedText)), "warden");
  for (const i of inputs) if (!run.over) stepSim(run, i);
  const used = inputs.slice(0, run.tick);
  return {
    ctx,
    player,
    start,
    summary: summarize(run),
    packed: await packInputs(used),
    later: (ms: number) => (t += ms),
  };
}

describe("일일 도전", () => {
  it("오늘 시드·시작표, 기기 ID가 없으면 참여 불가", async () => {
    const { ctx, start } = await setup();
    expect(start.body.day).toBe("2026-10-15");
    expect(String(start.body.seedText)).toHaveLength(8);
    expect((await call(ctx, "/api/daily/start", { player: "x" })).body.error).toBe("player");
  });

  it("제출 → 다시 돌려 확인하고 순위표에 오름. 더 낮은 기록은 바꾸지 않음", async () => {
    const s = await setup();
    s.later(40_000);
    const res = await call(s.ctx, "/api/daily/submit", {
      player: s.player,
      ticket: s.start.body.ticket,
      nickname: "Tester",
      summary: s.summary,
      inputs: s.packed,
    });
    expect(res.body).toMatchObject({ ok: true, improved: true });
    const entries = res.body.entries as { nickname: string; score: number; verified: boolean }[];
    expect(entries[0]).toMatchObject({ nickname: "Tester", score: s.summary.score, verified: true });
    const again = await call(s.ctx, "/api/daily/submit", {
      player: s.player,
      ticket: s.start.body.ticket,
      summary: s.summary,
      inputs: s.packed,
    });
    expect(again.body.improved).toBe(false);
  });

  it("금칙어 닉네임은 Player로", async () => {
    const s = await setup();
    s.later(40_000);
    const res = await call(s.ctx, "/api/daily/submit", {
      player: s.player,
      ticket: s.start.body.ticket,
      nickname: "fuck you",
      summary: s.summary,
      inputs: s.packed,
    });
    expect((res.body.entries as { nickname: string }[])[0]!.nickname).toBe("Player");
  });

  it("너무 빨리 낸 기록·고친 기록은 거절", async () => {
    const s = await setup();
    const quick = await call(s.ctx, "/api/daily/submit", { player: s.player, ticket: s.start.body.ticket, summary: s.summary, inputs: s.packed });
    expect(quick.body.error).toBe("time");
    s.later(40_000);
    // 처치 수를 늘리고 점수도 맞춰 고침 → 진행 기록 검사는 통과해도 다시 돌리면 다름
    const forged = { ...s.summary, kills: s.summary.kills + 5, score: s.summary.score + 50 };
    const res = await call(s.ctx, "/api/daily/submit", { player: s.player, ticket: s.start.body.ticket, summary: forged, inputs: s.packed });
    expect(res.body.error).toBe("replay");
    // 점수만 고치면 진행 기록 검사에서 걸림
    const bad = await call(s.ctx, "/api/daily/submit", {
      player: s.player,
      ticket: s.start.body.ticket,
      summary: { ...s.summary, score: 99999 },
      inputs: s.packed,
    });
    expect(bad.body.error).toBe("check:score");
  });

  it("다른 사람의 시작표는 쓸 수 없음", async () => {
    const s = await setup();
    s.later(40_000);
    const res = await call(s.ctx, "/api/daily/submit", { player: "other000-0000-4000-8000-000000000000", ticket: s.start.body.ticket, summary: s.summary, inputs: s.packed });
    expect(res.body.error).toBe("ticket");
  });

  it("서든데스: 같은 시드, 순위표 따로, 일반 판·모드를 뗀 시작표는 거절", async () => {
    const s = await setup();
    const sd = await call(s.ctx, "/api/daily/start", { player: s.player, mode: "sudden" });
    expect(sd.body).toMatchObject({ mode: "sudden", seedText: s.start.body.seedText });
    const inputs = randomInputs(7, 1800);
    const run = createRun(parseSeed(String(sd.body.seedText)), "warden", [], true);
    for (const i of inputs) if (!run.over) stepSim(run, i);
    const packed = await packInputs(inputs.slice(0, run.tick));
    s.later(40_000);
    // 일반 판 기록을 서든데스 시작표로 내면 다시 돌렸을 때 다름
    if (s.summary.ticks !== run.tick) {
      const wrong = await call(s.ctx, "/api/daily/submit", { player: s.player, ticket: sd.body.ticket, summary: s.summary, inputs: s.packed });
      expect(wrong.body.error).toBe("replay");
    }
    // 모드 표시를 떼면 서명이 맞지 않음
    const stripped = String(sd.body.ticket).replace(/\.sd$/, "");
    const forged = await call(s.ctx, "/api/daily/submit", { player: s.player, ticket: stripped, summary: summarize(run), inputs: packed });
    expect(forged.body.error).toBe("ticket");
    const res = await call(s.ctx, "/api/daily/submit", { player: s.player, ticket: sd.body.ticket, nickname: "Sudden", summary: summarize(run), inputs: packed });
    expect(res.body).toMatchObject({ ok: true, improved: true });
    expect((res.body.entries as { nickname: string; verified: boolean }[])[0]).toMatchObject({ nickname: "Sudden", verified: true });
    expect((await call(s.ctx, "/api/daily/board?mode=sudden")).body.entries).toHaveLength(1);
    expect((await call(s.ctx, "/api/daily/board")).body.entries).toHaveLength(0);
    const me = await call(s.ctx, "/api/daily/me", { player: s.player, mode: "sudden" });
    expect(me.body.best).toMatchObject({ rank: 1 });
    expect((await call(s.ctx, "/api/daily/me", { player: s.player })).body.best).toBeNull();
  });
});
