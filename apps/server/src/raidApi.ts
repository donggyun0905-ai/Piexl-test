// 레이드 명예의 전당: 라스트 보스(용·갓이터·태초의 빛과 어둠)를 보스방에 들어가 잡기까지 걸린 시간, 보스별 빠른 순.
// 10위 안에 드는 기록만 받고, 받기 전에 판 전체를 입력 기록으로 다시 돌려 확인 (저장은 기록이 줄 때만)
import {
  CHARACTER_IDS,
  cleanNickname,
  isPlayerId,
  parseSeed,
  RAID_BOARD_SIZE,
  RAID_BOSSES,
  replayRaid,
  unpackInputs,
  withBalance,
  type CharacterId,
  type LastBossKind,
} from "@pixel-rogue/shared";
import { balanceVersion } from "./balanceApi";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";
import { cleanUnlocks, loadProfile } from "./player";
import { first } from "./sql";

/** 한 판 최대 길이 (2시간) */
const MAX_TICKS = 60 * 60 * 120;

export interface RaidEntry {
  rank: number;
  nickname: string;
  ticks: number;
  character: string;
  finished: number;
}

export function raidBoard(ctx: HubContext, boss: string): RaidEntry[] {
  return ctx.sql
    .exec("SELECT nickname, ticks, character, finished FROM raid WHERE boss = ? ORDER BY ticks ASC, finished ASC LIMIT ?", boss, RAID_BOARD_SIZE)
    .toArray()
    .map((r, i) => ({ rank: i + 1, nickname: String(r.nickname), ticks: Number(r.ticks), character: String(r.character), finished: Number(r.finished) }));
}

function boards(ctx: HubContext): Record<string, RaidEntry[]> {
  return Object.fromEntries(RAID_BOSSES.map((b) => [b, raidBoard(ctx, b)]));
}

/** 이 시간이 몇 위가 되는지 (같은 시간이면 먼저 낸 사람이 위) */
function rankFor(ctx: HubContext, boss: string, ticks: number, user: string): number {
  const row = first(ctx.sql, "SELECT COUNT(*) AS n FROM raid WHERE boss = ? AND ticks <= ? AND user != ?", boss, ticks, user);
  return Number(row?.n ?? 0) + 1;
}

interface SubmitBody {
  player?: unknown;
  nickname?: unknown;
  seedText?: unknown;
  character?: unknown;
  unlocks?: unknown;
  boss?: unknown;
  ticks?: unknown;
  inputs?: unknown;
  /** 판을 시작할 때 화면에 있던 게임 수치 지문 (없으면 처음 값) */
  balance?: unknown;
}

export async function handleRaid(ctx: HubContext, action: string, request: Request): Promise<Response> {
  if (action === "board" && request.method === "GET") return json({ ok: true, boards: boards(ctx) });
  if (action !== "submit" || request.method !== "POST") return fail("not_found", 404);

  const body = await readJson<SubmitBody>(request, 2 * 1024 * 1024);
  const user = body?.player;
  if (!body || !isPlayerId(user)) return fail("player");
  const boss = body.boss as LastBossKind;
  const character = body.character as CharacterId;
  const ticks = body.ticks;
  if (!RAID_BOSSES.includes(boss) || !CHARACTER_IDS.includes(character)) return fail("bad_request");
  if (typeof ticks !== "number" || !Number.isInteger(ticks) || ticks <= 0 || ticks > MAX_TICKS) return fail("bad_request");
  if (typeof body.seedText !== "string" || body.seedText.length > 32 || typeof body.inputs !== "string") return fail("bad_request");

  const prev = first(ctx.sql, "SELECT ticks FROM raid WHERE boss = ? AND user = ?", boss, user);
  if (prev && Number(prev.ticks) <= ticks) return json({ ok: true, improved: false, rank: rankFor(ctx, boss, Number(prev.ticks), user), boards: boards(ctx) });
  const rank = rankFor(ctx, boss, ticks, user);
  if (rank > RAID_BOARD_SIZE) return json({ ok: true, improved: false, rank: null, boards: boards(ctx) });

  // 판 전체 다시 돌리기: 같은 보스를 같은 시간에 잡아야 함 (확인을 끈 서버는 그대로 받음)
  if (ctx.replay) {
    const problem = await replayProblem(ctx, body, boss, character, ticks);
    if (problem) return fail(problem);
  }

  const nickname = cleanNickname(typeof body.nickname === "string" ? body.nickname : "") || loadProfile(ctx, user).nickname || "???";
  ctx.sql.exec(
    `INSERT INTO raid (boss, user, nickname, ticks, character, finished) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (boss, user) DO UPDATE SET nickname = excluded.nickname, ticks = excluded.ticks, character = excluded.character, finished = excluded.finished`,
    boss,
    user,
    nickname,
    ticks,
    character,
    ctx.now(),
  );
  return json({ ok: true, improved: true, rank, boards: boards(ctx) });
}

/** 판 전체를 다시 돌려 같은 보스를 같은 시간에 잡는지 (문제가 있으면 그 이유) */
async function replayProblem(ctx: HubContext, body: SubmitBody, boss: LastBossKind, character: CharacterId, ticks: number): Promise<string | null> {
  let inputs;
  try {
    inputs = await unpackInputs(String(body.inputs));
  } catch {
    return "bad_inputs";
  }
  if (inputs.length > MAX_TICKS) return "bad_inputs";
  // 그 판을 한 게임 수치로 (관리자 페이지에서 바꾼 수치)
  const balance = balanceVersion(ctx, typeof body.balance === "string" ? body.balance : "default");
  if (!balance) return "balance";
  const seed = parseSeed(String(body.seedText));
  const run = withBalance(balance, () => replayRaid(seed, character, cleanUnlocks(body.unlocks), boss, inputs));
  return !run.won || run.lastBoss !== boss || run.raidTicks !== ticks ? "replay" : null;
}
