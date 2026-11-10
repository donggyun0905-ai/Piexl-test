// 레이드(이벤트 보스) 랭킹: 보스를 잡기까지 걸린 시간(컷신 빼고 싸운 틱), 빠른 순 · 사람마다 가장 빠른 기록 하나
// 같이 하기는 판을 여러 사람이 함께 돌려(입력이 나뉨) 다시 돌려 확인하지 않음 → 너무 짧은 시간·이상한 값만 막음
import { CHARACTER_IDS, cleanNickname, isPlayerId, RAID_EVENT_BOSSES, type CharacterId } from "@pixel-rogue/shared";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";
import { loadProfile } from "./player";
import { first } from "./sql";

/** 순위표 크기 */
export const ERAID_BOARD_SIZE = 50;
/** 받는 시간 범위 (틱): 30초 ~ 제한 시간보다 넉넉히 30분 */
const MIN_TICKS = 60 * 30;
const MAX_TICKS = 60 * 60 * 30;

export const ERAID_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS eraid (
    boss TEXT NOT NULL, user TEXT NOT NULL, nickname TEXT NOT NULL, ticks INTEGER NOT NULL, character TEXT NOT NULL,
    party TEXT NOT NULL, humans INTEGER NOT NULL, finished INTEGER NOT NULL, PRIMARY KEY (boss, user))`,
  `CREATE INDEX IF NOT EXISTS eraid_rank ON eraid (boss, ticks ASC, finished ASC)`,
];

export interface EraidEntry {
  rank: number;
  nickname: string;
  ticks: number;
  character: string;
  /** 같이 싸운 캐릭터들 (자리 순서) */
  party: string[];
  /** 사람 수 (나머지는 AI) */
  humans: number;
}

function board(ctx: HubContext, boss: string): EraidEntry[] {
  return ctx.sql
    .exec("SELECT nickname, ticks, character, party, humans FROM eraid WHERE boss = ? ORDER BY ticks ASC, finished ASC LIMIT ?", boss, ERAID_BOARD_SIZE)
    .toArray()
    .map((r, i) => ({ rank: i + 1, nickname: String(r.nickname), ticks: Number(r.ticks), character: String(r.character), party: String(r.party).split(",").filter(Boolean), humans: Number(r.humans) }));
}

const boards = (ctx: HubContext) => Object.fromEntries(RAID_EVENT_BOSSES.map((b) => [b, board(ctx, b)]));

/** 이 시간이 몇 위인지 (같은 시간이면 먼저 낸 사람이 위) */
function rankFor(ctx: HubContext, boss: string, ticks: number, user: string): number {
  const row = first(ctx.sql, "SELECT COUNT(*) AS n FROM eraid WHERE boss = ? AND ticks <= ? AND user != ?", boss, ticks, user);
  return Number(row?.n ?? 0) + 1;
}

interface Body {
  player?: unknown;
  nickname?: unknown;
  boss?: unknown;
  ticks?: unknown;
  character?: unknown;
  party?: unknown;
  humans?: unknown;
}

export async function handleEraid(ctx: HubContext, action: string, request: Request): Promise<Response> {
  if (action === "board" && request.method === "GET") return json({ ok: true, boards: boards(ctx) });
  if (action !== "submit" || request.method !== "POST") return fail("not_found", 404);
  const body = await readJson<Body>(request, 4 * 1024);
  const user = body?.player;
  if (!body || !isPlayerId(user)) return fail("player");
  const boss = String(body.boss);
  const character = body.character as CharacterId;
  const ticks = body.ticks;
  const party = Array.isArray(body.party) ? body.party : [];
  const humans = body.humans;
  if (!(RAID_EVENT_BOSSES as readonly string[]).includes(boss) || !CHARACTER_IDS.includes(character)) return fail("bad_request");
  if (typeof ticks !== "number" || !Number.isInteger(ticks) || ticks < MIN_TICKS || ticks > MAX_TICKS) return fail("bad_request");
  if (party.length < 1 || party.length > 5 || !party.every((c) => CHARACTER_IDS.includes(c as CharacterId))) return fail("bad_request");
  if (typeof humans !== "number" || !Number.isInteger(humans) || humans < 1 || humans > party.length) return fail("bad_request");

  const prev = first(ctx.sql, "SELECT ticks FROM eraid WHERE boss = ? AND user = ?", boss, user);
  if (prev && Number(prev.ticks) <= ticks) return json({ ok: true, improved: false, rank: rankFor(ctx, boss, ticks, user), boards: boards(ctx) });
  const nickname = cleanNickname(typeof body.nickname === "string" ? body.nickname : "") || loadProfile(ctx, user).nickname || "???";
  ctx.sql.exec(
    `INSERT INTO eraid (boss, user, nickname, ticks, character, party, humans, finished) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (boss, user) DO UPDATE SET nickname = excluded.nickname, ticks = excluded.ticks, character = excluded.character,
       party = excluded.party, humans = excluded.humans, finished = excluded.finished`,
    boss,
    user,
    nickname,
    ticks,
    character,
    party.join(","),
    humans,
    ctx.now(),
  );
  return json({ ok: true, improved: true, rank: rankFor(ctx, boss, ticks, user), boards: boards(ctx) });
}
