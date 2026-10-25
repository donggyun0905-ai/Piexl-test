// 레이드 아레나 순위표 (전체 기간): 깬 레벨이 높은 순, 같으면 빠른 시간 순. 사람마다 가장 좋은 기록 하나.
// 30위 안에 드는 기록만 받고, 받기 전에 판 전체를 입력 기록으로 다시 돌려 확인 (저장은 기록이 좋아질 때만)
import { ARENA_BOARD_SIZE, ARENA_LEVELS, arenaCleared, CHARACTER_IDS, cleanNickname, isPlayerId, parseSeed, replayArena, unpackInputs, withBalance, type CharacterId } from "@pixel-rogue/shared";
import { balanceVersion } from "./balanceApi";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";
import { cleanUnlocks, loadProfile } from "./player";
import { first } from "./sql";

/** 한 판 최대 길이 (3시간) */
const MAX_TICKS = 60 * 60 * 180;

export interface ArenaEntry {
  rank: number;
  nickname: string;
  level: number;
  ticks: number;
  character: string;
}

export function arenaBoard(ctx: HubContext): ArenaEntry[] {
  return ctx.sql
    .exec("SELECT nickname, level, ticks, character FROM arena ORDER BY level DESC, ticks ASC, finished ASC LIMIT ?", ARENA_BOARD_SIZE)
    .toArray()
    .map((r, i) => ({ rank: i + 1, nickname: String(r.nickname), level: Number(r.level), ticks: Number(r.ticks), character: String(r.character) }));
}

/** 이 기록이 몇 위가 되는지 (같으면 먼저 낸 사람이 위) */
function rankFor(ctx: HubContext, level: number, ticks: number, user: string): number {
  const row = first(ctx.sql, "SELECT COUNT(*) AS n FROM arena WHERE user != ? AND (level > ? OR (level = ? AND ticks <= ?))", user, level, level, ticks);
  return Number(row?.n ?? 0) + 1;
}

interface SubmitBody {
  player?: unknown;
  nickname?: unknown;
  seedText?: unknown;
  character?: unknown;
  unlocks?: unknown;
  level?: unknown;
  ticks?: unknown;
  inputs?: unknown;
  /** 판을 시작할 때 화면에 있던 게임 수치 지문 (없으면 처음 값) */
  balance?: unknown;
}

export async function handleArena(ctx: HubContext, action: string, request: Request): Promise<Response> {
  if (action === "board" && request.method === "GET") return json({ ok: true, entries: arenaBoard(ctx) });
  if (action !== "submit" || request.method !== "POST") return fail("not_found", 404);

  const body = await readJson<SubmitBody>(request, 3 * 1024 * 1024);
  const user = body?.player;
  if (!body || !isPlayerId(user)) return fail("player");
  const character = body.character as CharacterId;
  const { level, ticks } = body;
  if (!CHARACTER_IDS.includes(character)) return fail("bad_request");
  if (typeof level !== "number" || !Number.isInteger(level) || level < 1 || level > ARENA_LEVELS) return fail("bad_request");
  if (typeof ticks !== "number" || !Number.isInteger(ticks) || ticks <= 0 || ticks > MAX_TICKS) return fail("bad_request");
  if (typeof body.seedText !== "string" || body.seedText.length > 32 || typeof body.inputs !== "string") return fail("bad_request");

  const prev = first(ctx.sql, "SELECT level, ticks FROM arena WHERE user = ?", user);
  const better = !prev || level > Number(prev.level) || (level === Number(prev.level) && ticks < Number(prev.ticks));
  if (!better) return json({ ok: true, improved: false, rank: rankFor(ctx, Number(prev!.level), Number(prev!.ticks), user), entries: arenaBoard(ctx) });
  const rank = rankFor(ctx, level, ticks, user);
  if (rank > ARENA_BOARD_SIZE) return json({ ok: true, improved: false, rank: null, entries: arenaBoard(ctx) });

  // 판 전체 다시 돌리기: 같은 레벨까지 같은 시간에 끝나야 함 (확인을 끈 서버는 그대로 받음)
  if (ctx.replay) {
    let inputs;
    try {
      inputs = await unpackInputs(body.inputs);
    } catch {
      return fail("bad_inputs");
    }
    if (inputs.length > MAX_TICKS) return fail("bad_inputs");
    // 그 판을 한 게임 수치로 (관리자 페이지에서 바꾼 수치)
    const balance = balanceVersion(ctx, typeof body.balance === "string" ? body.balance : "default");
    if (!balance) return fail("balance");
    const seed = parseSeed(body.seedText);
    const run = withBalance(balance, () => replayArena(seed, character, cleanUnlocks(body.unlocks), inputs));
    if (!run.over || arenaCleared(run) !== level || run.tick !== ticks) return fail("replay");
  }

  const nickname = cleanNickname(typeof body.nickname === "string" ? body.nickname : "") || loadProfile(ctx, user).nickname || "???";
  ctx.sql.exec(
    `INSERT INTO arena (user, nickname, level, ticks, character, finished) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (user) DO UPDATE SET nickname = excluded.nickname, level = excluded.level, ticks = excluded.ticks, character = excluded.character, finished = excluded.finished`,
    user,
    nickname,
    level,
    ticks,
    character,
    ctx.now(),
  );
  return json({ ok: true, improved: true, rank, entries: arenaBoard(ctx) });
}
