import { RANK, rankOf, rankSeats } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { setupHub } from "./hub";
import { applyRank } from "./rankApi";
import { newRoom, RoomLogic } from "./roomLogic";
import { call, memorySql } from "./testing";

const P = (n: number) => `rank000${n}-0000-4000-8000-000000000000`;
const room = (queue: "solo" | "team") => new RoomLogic(newRoom("RANKAA", "quick", "coop", queue), () => 1_000_000, () => "SEED");

describe("패왕전 랭크전", () => {
  it("티어: 흙 III에서 시작해 100점마다 한 단계 · 성좌 · 상위 10명은 패왕", () => {
    expect(rankOf(RANK.start)).toEqual({ tier: "stone", div: 3, lp: 0 });
    expect(rankOf(650)).toMatchObject({ tier: "clay", div: 3, lp: 0 });
    expect(rankOf(1295)).toMatchObject({ tier: "stone", div: 1, lp: 95 });
    expect(rankOf(2560)).toMatchObject({ tier: "star", div: 0, lp: 60 });
    expect(rankOf(2560, 3).tier).toBe("overlord");
  });

  it("자리: 사람은 두 편에 번갈아, 빈 자리는 AI", () => {
    expect(rankSeats("solo", ["a"])).toEqual(["a", ""]);
    expect(rankSeats("team", ["a", "b", "c"])).toEqual(["a", "c", "", "b", "", ""]);
  });

  it("혼자면 잠시 뒤 AI와 시작 · 모두 같은 결과를 보내야 반영 · 다르면 반영 안 함", () => {
    const r = room("solo");
    r.join(P(1), "A", "warden");
    expect(r.data.autoStartAt).toBe(1_000_000 + RANK.waitMs);
    r.join(P(2), "B", "mage");
    expect(r.data.phase).toBe("playing");
    expect(r.join(P(3), "C", "mage")).toEqual({ t: "error", error: "started" });
    r.handle(P(1), { t: "rankres", winner: 0 });
    expect(r.rankJob).toBeUndefined();
    r.handle(P(2), { t: "rankres", winner: 0 });
    expect(r.rankJob).toMatchObject({ queue: "solo", winner: 0, ai: [0, 0] });
    const bad = room("solo");
    bad.join(P(1), "A", "warden");
    bad.join(P(2), "B", "mage");
    bad.handle(P(1), { t: "rankres", winner: 0 });
    bad.handle(P(2), { t: "rankres", winner: 1 });
    expect(bad.rankJob).toBeNull();
  });

  it("점수 반영: 이기면 오르고 지면 내림 · 승패 수 · 순위표·내 점수", async () => {
    const ctx = setupHub(memorySql());
    const job = { queue: "solo" as const, entries: [{ pid: P(1), team: 0, left: false }, { pid: P(2), team: 1, left: false }], winner: 0, ai: [0, 0] };
    const changes = applyRank(ctx, job, { [P(1)]: "이긴 사람", [P(2)]: "진 사람" });
    expect(changes[0]!.after).toBeGreaterThan(RANK.start);
    expect(changes[1]!.after).toBeLessThan(RANK.start);
    const board = (await call(ctx, "/api/rank/board?queue=solo")).body.entries as { nickname: string; wins: number }[];
    expect(board.map((e) => e.nickname)).toEqual(["이긴 사람", "진 사람"]);
    const me = (await call(ctx, `/api/rank/me?player=${P(2)}`)).body;
    expect(me.solo).toMatchObject({ wins: 0, losses: 1, place: 2 });
    expect(me.team).toMatchObject({ rating: RANK.start, place: 0 });
  });
});
