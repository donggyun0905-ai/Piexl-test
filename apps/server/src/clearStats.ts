// 캐릭터별 클리어 시간 모으기: 혼자 하기에서 6층을 처음 깨면 화면이 걸린 시간(틱)을 보냄 → 캐릭터마다 횟수·합계·가장 빠른 시간만 저장 (한 줄 갱신)
// 관리자 화면에서 평균(합계 ÷ 횟수)을 봄. 금기·무작위 시작 장비·무한·영웅의 길·아레나·서든데스 판은 화면에서 보내지 않음
import { ALL_CHARACTER_IDS, isPlayerId, TICK_RATE, type CharacterId } from "@pixel-rogue/shared";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";

export const CLEAR_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS clears (character TEXT PRIMARY KEY, count INTEGER NOT NULL, total INTEGER NOT NULL, best INTEGER NOT NULL)`,
];

/** 말이 안 되는 시간은 받지 않음 (3분 ~ 3시간) */
const MIN_TICKS = TICK_RATE * 60 * 3;
const MAX_TICKS = TICK_RATE * 60 * 180;
/** 한 사람이 너무 자주 보내지 못하게 (2분에 한 번) */
const GAP_MS = 2 * 60_000;

export interface ClearRow {
  character: string;
  count: number;
  total: number;
  best: number;
}

export async function handleClear(ctx: HubContext, request: Request): Promise<Response> {
  if (request.method !== "POST") return fail("not_found", 404);
  const body = await readJson<{ player?: unknown; character?: unknown; ticks?: unknown }>(request, 1024);
  const player = body?.player;
  const character = body?.character;
  const ticks = Number(body?.ticks);
  if (!isPlayerId(player) || !ALL_CHARACTER_IDS.includes(character as CharacterId) || !Number.isInteger(ticks) || ticks < MIN_TICKS || ticks > MAX_TICKS) return fail("bad_request");
  const key = `clear:${player}`;
  const now = ctx.now();
  const last = ctx.limits.get(key);
  if (last && last.until > now) return fail("wait", 429);
  ctx.limits.set(key, { count: 1, until: now + GAP_MS });
  if (ctx.limits.size > 5000) ctx.limits.clear();
  ctx.sql.exec(
    `INSERT INTO clears (character, count, total, best) VALUES (?, 1, ?, ?)
     ON CONFLICT(character) DO UPDATE SET count = count + 1, total = total + excluded.total, best = MIN(best, excluded.best)`,
    character as string,
    ticks,
    ticks,
  );
  return json({ ok: true });
}

/** 관리자 화면용: 캐릭터마다 횟수·합계·가장 빠른 시간 (많이 깬 순) */
export function clearRows(ctx: HubContext): ClearRow[] {
  return ctx.sql
    .exec("SELECT character, count, total, best FROM clears ORDER BY count DESC, character ASC")
    .toArray()
    .map((r) => ({ character: String(r.character), count: Number(r.count), total: Number(r.total), best: Number(r.best) }));
}
