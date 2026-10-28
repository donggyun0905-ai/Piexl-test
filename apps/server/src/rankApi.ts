// 패왕전 랭크전 점수 (Hub): 대결(1대1·3대3)마다 사람별 점수·승·패. 순위표 · 내 점수 · 한 판 결과 반영(랭크전 방이 부름)
// 저장은 판이 끝나 점수가 바뀔 때만
import { isPlayerId, RANK, RANK_QUEUES, rankResults, type RankChange, type RankQueue } from "@pixel-rogue/shared";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";
import type { RankJob } from "./rankRoom";
import { first } from "./sql";

export const RANK_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS rank (
    user TEXT NOT NULL, queue TEXT NOT NULL, nickname TEXT NOT NULL, rating INTEGER NOT NULL,
    wins INTEGER NOT NULL, losses INTEGER NOT NULL, updated INTEGER NOT NULL, PRIMARY KEY (user, queue))`,
  `CREATE INDEX IF NOT EXISTS rank_board ON rank (queue, rating DESC, updated ASC)`,
];

export interface RankBoardEntry {
  rank: number;
  nickname: string;
  rating: number;
  wins: number;
  losses: number;
}

export interface RankMine {
  rating: number;
  wins: number;
  losses: number;
  /** 순위 (판을 한 적이 없으면 0) */
  place: number;
}

const queueOf = (v: unknown): RankQueue => (RANK_QUEUES.includes(v as RankQueue) ? (v as RankQueue) : "solo");

export function rankBoard(ctx: HubContext, queue: RankQueue): RankBoardEntry[] {
  return ctx.sql
    .exec("SELECT nickname, rating, wins, losses FROM rank WHERE queue = ? ORDER BY rating DESC, updated ASC LIMIT ?", queue, RANK.board)
    .toArray()
    .map((r, i) => ({ rank: i + 1, nickname: String(r.nickname), rating: Number(r.rating), wins: Number(r.wins), losses: Number(r.losses) }));
}

function mine(ctx: HubContext, user: string, queue: RankQueue): RankMine {
  const row = first(ctx.sql, "SELECT rating, wins, losses, updated FROM rank WHERE user = ? AND queue = ?", user, queue);
  if (!row) return { rating: RANK.start, wins: 0, losses: 0, place: 0 };
  const rating = Number(row.rating);
  const ahead = first(ctx.sql, "SELECT COUNT(*) AS n FROM rank WHERE queue = ? AND (rating > ? OR (rating = ? AND updated < ?))", queue, rating, rating, Number(row.updated));
  return { rating, wins: Number(row.wins), losses: Number(row.losses), place: Number(ahead?.n ?? 0) + 1 };
}

/** 한 판 결과 반영 (같은 사람이 두 번 들어 있으면 처음 것만) */
export function applyRank(ctx: HubContext, job: RankJob, names: Record<string, string>): RankChange[] {
  const entries = job.entries.filter((e, i, all) => isPlayerId(e.pid) && all.findIndex((x) => x.pid === e.pid) === i);
  const ratings = new Map(entries.map((e) => [e.pid, mine(ctx, e.pid, job.queue).rating]));
  const changes = rankResults(entries, ratings, job.winner, job.ai);
  const now = ctx.now();
  for (const c of changes) {
    ctx.sql.exec(
      `INSERT INTO rank (user, queue, nickname, rating, wins, losses, updated) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (user, queue) DO UPDATE SET nickname = excluded.nickname, rating = excluded.rating,
       wins = wins + excluded.wins, losses = losses + excluded.losses, updated = excluded.updated`,
      c.pid, job.queue, String(names[c.pid] ?? "").slice(0, 24), c.after, c.won ? 1 : 0, c.won ? 0 : 1, now,
    );
  }
  return changes;
}

export async function handleRank(ctx: HubContext, action: string, request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (action === "board" && request.method === "GET") return json({ ok: true, entries: rankBoard(ctx, queueOf(url.searchParams.get("queue"))) });
  if (action === "me" && request.method === "GET") {
    const user = url.searchParams.get("player");
    if (!isPlayerId(user)) return fail("player");
    return json({ ok: true, solo: mine(ctx, user, "solo"), team: mine(ctx, user, "team") });
  }
  return fail("not_found", 404);
}

/** 랭크전 방에서만 부름 (밖에서 오는 /internal 요청은 Hub까지 오지 않음) */
export async function handleRankApply(ctx: HubContext, request: Request): Promise<Response> {
  const body = await readJson<{ job?: RankJob; names?: Record<string, string> }>(request, 16 * 1024);
  if (!body?.job || !Array.isArray(body.job.entries) || !RANK_QUEUES.includes(body.job.queue)) return fail("bad_request");
  return json({ ok: true, changes: applyRank(ctx, body.job, body.names ?? {}) });
}
