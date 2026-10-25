// 일일 도전: 오늘 시드·시작표 발급, 기록 제출(진행 기록 검사 → 30위 안이면 판 전체 다시 돌리기), 순위표.
// 서든데스(mode=sudden)는 같은 시드, 같은 검사에 규칙만 다르고 순위표는 따로 (표의 day 칸에 "sd:"를 붙여 저장)
import {
  BOARD_SIZE,
  checkProgress,
  cleanNickname,
  dayKey,
  isPlayerId,
  nextDayStart,
  parseSeed,
  replayRun,
  summarize,
  TICK_MS,
  unpackInputs,
  withBalance,
  type RunSummary,
} from "@pixel-rogue/shared";
import { balanceVersion } from "./balanceApi";
import { hmac, safeEqual } from "./crypto";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";
import { first } from "./sql";

const SEED_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
/** 날이 바뀐 뒤에도 전날 도전을 제출할 수 있는 시간 */
const LATE_MS = 30 * 60_000;
/** 한 판 최대 길이 (입력 기록 크기 제한) */
const MAX_TICKS = 60 * 60 * 60;

/** 그날의 시드 글자 (비밀 값을 섞어 미리 알 수 없게) */
export async function dailySeedText(ctx: HubContext, day: string): Promise<string> {
  const sig = await hmac(ctx.dailySalt, `daily|${day}`);
  let out = "";
  for (let i = 0; i < 8; i++) out += SEED_CHARS[sig.charCodeAt(i) % SEED_CHARS.length];
  return out;
}

export type DailyMode = "normal" | "sudden";

function modeOf(value: unknown): DailyMode {
  return value === "sudden" ? "sudden" : "normal";
}

/** 표에 저장하는 날짜 칸 (서든데스는 따로 모음) */
function boardDay(day: string, mode: DailyMode): string {
  return mode === "sudden" ? `sd:${day}` : day;
}

/** 서명할 글자 (일반은 예전과 같음, 서든데스는 모드를 섞어 일반 표로 바꿔 낼 수 없게) */
function ticketText(user: string, day: string, issued: number, mode: DailyMode): string {
  return mode === "sudden" ? `k|${user}|${day}|${issued}|sd` : `k|${user}|${day}|${issued}`;
}

/** 시작표: 날짜.발급시각.서명[.sd] (일회용이 아니어도 제출 때 실제 걸린 시간과 비교) */
async function makeTicket(ctx: HubContext, user: string, day: string, mode: DailyMode): Promise<string> {
  const issued = ctx.now();
  const sig = await hmac(ctx.key, ticketText(user, day, issued, mode));
  return `${day}.${issued}.${sig}${mode === "sudden" ? ".sd" : ""}`;
}

async function readTicket(
  ctx: HubContext,
  user: string,
  ticket: unknown,
): Promise<{ day: string; issued: number; mode: DailyMode } | null> {
  if (typeof ticket !== "string") return null;
  const [day, issuedText, sig, tag] = ticket.split(".");
  const issued = Number(issuedText);
  if (!day || !sig || !Number.isFinite(issued)) return null;
  const mode: DailyMode = tag === "sd" ? "sudden" : "normal";
  if (!safeEqual(await hmac(ctx.key, ticketText(user, day, issued, mode)), sig)) return null;
  return { day, issued, mode };
}

interface BoardEntry {
  rank: number;
  nickname: string;
  score: number;
  floor: number;
  won: boolean;
  ticks: number;
  character: string;
  verified: boolean;
}

export function board(ctx: HubContext, day: string): BoardEntry[] {
  return ctx.sql
    .exec(
      "SELECT nickname, score, floor, won, ticks, character, verified FROM daily WHERE day = ? ORDER BY score DESC, finished ASC LIMIT ?",
      day,
      BOARD_SIZE,
    )
    .toArray()
    .map((r, i) => ({
      rank: i + 1,
      nickname: String(r.nickname),
      score: Number(r.score),
      floor: Number(r.floor),
      won: Number(r.won) === 1,
      ticks: Number(r.ticks),
      character: String(r.character),
      verified: Number(r.verified) === 1,
    }));
}

/** 이 점수가 몇 위가 되는지 (같은 점수면 먼저 낸 사람이 위 → 지금 내면 같은 점수 뒤) */
function rankFor(ctx: HubContext, day: string, score: number, user: string): number {
  const row = first(ctx.sql, "SELECT COUNT(*) AS n FROM daily WHERE day = ? AND score >= ? AND user != ?", day, score, user);
  return Number(row?.n ?? 0) + 1;
}

function myBest(ctx: HubContext, day: string, user: string) {
  const row = first(ctx.sql, "SELECT score, finished FROM daily WHERE day = ? AND user = ?", day, user);
  if (!row) return null;
  const score = Number(row.score);
  const ahead = first(
    ctx.sql,
    "SELECT COUNT(*) AS n FROM daily WHERE day = ? AND (score > ? OR (score = ? AND finished < ?))",
    day,
    score,
    score,
    Number(row.finished),
  );
  return { score, rank: Number(ahead?.n ?? 0) + 1 };
}

interface SubmitBody {
  player?: unknown;
  ticket?: unknown;
  nickname?: unknown;
  summary?: RunSummary;
  inputs?: unknown;
  /** 판을 시작할 때 화면에 있던 게임 수치 지문 (없으면 처음 값) */
  balance?: unknown;
}

export async function handleDaily(ctx: HubContext, action: string, request: Request): Promise<Response> {
  const now = ctx.now();
  const today = dayKey(now);

  if (action === "board" && request.method === "GET") {
    const params = new URL(request.url).searchParams;
    const day = params.get("day") ?? today;
    if (!/^\d{4}-\d\d-\d\d$/.test(day)) return fail("bad_day");
    const mode = modeOf(params.get("mode"));
    return json({ ok: true, day, mode, resetAt: nextDayStart(now), entries: board(ctx, boardDay(day, mode)) });
  }
  if (request.method !== "POST") return fail("method", 405);

  if (action === "start") {
    const body = await readJson<{ player?: unknown; mode?: unknown }>(request, 4096);
    const user = body?.player;
    if (!isPlayerId(user)) return fail("player");
    const mode = modeOf(body?.mode);
    return json({
      ok: true,
      day: today,
      mode,
      seedText: await dailySeedText(ctx, today),
      ticket: await makeTicket(ctx, user, today, mode),
      resetAt: nextDayStart(now),
      best: myBest(ctx, boardDay(today, mode), user),
    });
  }

  if (action === "me") {
    const body = await readJson<{ player?: unknown; mode?: unknown }>(request, 4096);
    const user = body?.player;
    if (!isPlayerId(user)) return fail("player");
    return json({ ok: true, day: today, best: myBest(ctx, boardDay(today, modeOf(body?.mode)), user) });
  }

  if (action === "submit") {
    const body = await readJson<SubmitBody>(request, 2 * 1024 * 1024);
    if (!body?.summary || typeof body.inputs !== "string") return fail("bad_request");
    const user = body.player;
    if (!isPlayerId(user)) return fail("player");
    const ticket = await readTicket(ctx, user, body.ticket);
    if (!ticket) return fail("ticket");
    const dayStart = Date.parse(`${ticket.day}T00:00:00Z`);
    if (now > dayStart + 86_400_000 + LATE_MS || now < ticket.issued) return fail("expired");
    const s = body.summary;
    if (!Number.isInteger(s.ticks) || s.ticks > MAX_TICKS) return fail("check");
    // 1. 진행 기록 검사 (모든 기록)
    const seed = parseSeed(await dailySeedText(ctx, ticket.day));
    const sudden = ticket.mode === "sudden";
    const day = boardDay(ticket.day, ticket.mode);
    // 그 판을 한 수치로 검사 (관리자 페이지에서 바꾼 수치)
    const balance = balanceVersion(ctx, typeof body.balance === "string" ? body.balance : "default");
    if (!balance) return fail("balance");
    const problem = withBalance(balance, () => checkProgress(seed, s, sudden));
    if (problem) return fail(`check:${problem}`);
    // 실제 걸린 시간이 기록상 시간보다 짧으면 안 됨 (약간의 여유)
    if (now - ticket.issued < s.ticks * TICK_MS * 0.95 - 3000) return fail("time");

    const prev = myBest(ctx, day, user);
    if (prev && prev.score >= s.score) {
      return json({ ok: true, improved: false, best: prev, entries: board(ctx, day) });
    }
    // 2. 30위 안에 드는 기록만 판 전체 다시 돌리기
    const rank = rankFor(ctx, day, s.score, user);
    let verified = false;
    // (확인을 끈 서버는 다시 돌리지 않고 확인 안 된 기록으로 받음)
    if (rank <= BOARD_SIZE && ctx.replay) {
      let inputs;
      try {
        inputs = await unpackInputs(body.inputs);
      } catch {
        return fail("bad_inputs");
      }
      if (inputs.length > MAX_TICKS) return fail("bad_inputs");
      const replayed = withBalance(balance, () => summarize(replayRun(seed, s.characterId, inputs, sudden)));
      const same =
        replayed.score === s.score &&
        replayed.floor === s.floor &&
        replayed.kills === s.kills &&
        replayed.won === s.won &&
        replayed.ticks === s.ticks;
      if (!same) return fail("replay");
      verified = true;
    }
    const nickname = cleanNickname(typeof body.nickname === "string" ? body.nickname : "");
    ctx.sql.exec(
      `INSERT INTO daily (day, user, nickname, score, floor, won, ticks, character, finished, verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (day, user) DO UPDATE SET nickname = excluded.nickname, score = excluded.score, floor = excluded.floor,
         won = excluded.won, ticks = excluded.ticks, character = excluded.character, finished = excluded.finished,
         verified = excluded.verified`,
      day,
      user,
      nickname,
      s.score,
      s.floor,
      s.won ? 1 : 0,
      s.ticks,
      s.characterId,
      now,
      verified ? 1 : 0,
    );
    return json({ ok: true, improved: true, best: myBest(ctx, day, user), entries: board(ctx, day) });
  }

  return fail("not_found", 404);
}
