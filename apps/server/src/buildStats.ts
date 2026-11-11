// 빌드 통계 (아카이브 '빌드 통계'·입문 추천 표시): 혼자 하기 한 판이 끝나면 화면이 캐릭터·마지막 무기·가진 패시브·클리어 여부를 한 번 보냄
// 캐릭터마다 한 줄(JSON)에 판 수·클리어 수·무기마다/패시브마다 [고른 판 수, 그중 클리어 수]를 더함 → 저장 쓰기는 한 판에 한 줄
// POST /api/stats/build · GET /api/stats/build?c=캐릭터 (누구나, 요청 나누는 쪽에서 잠깐 저장해 둔 값을 줌)
import { ALL_CHARACTER_IDS, isPlayerId, PASSIVES, WEAPONS, type CharacterId } from "@pixel-rogue/shared";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";

export const BUILD_SCHEMA = [`CREATE TABLE IF NOT EXISTS builds (character TEXT PRIMARY KEY, data TEXT NOT NULL)`];

/** 한 사람이 너무 자주 보내지 못하게 (2분에 한 번) · 한 판에 적는 패시브 종류 수 한도 */
const GAP_MS = 2 * 60_000;
const MAX_PASSIVES = 80;

/** [고른 판 수, 그중 클리어 수] */
type Pair = [number, number];
export interface BuildStats {
  runs: number;
  wins: number;
  weapons: Record<string, Pair>;
  passives: Record<string, Pair>;
}
const EMPTY = (): BuildStats => ({ runs: 0, wins: 0, weapons: {}, passives: {} });

export function buildOf(ctx: HubContext, character: string): BuildStats {
  const row = ctx.sql.exec("SELECT data FROM builds WHERE character = ?", character).toArray()[0];
  if (!row) return EMPTY();
  try {
    return { ...EMPTY(), ...(JSON.parse(String(row.data)) as Partial<BuildStats>) };
  } catch {
    return EMPTY();
  }
}

export async function handleBuild(ctx: HubContext, request: Request): Promise<Response> {
  if (request.method === "GET") {
    const c = new URL(request.url).searchParams.get("c") ?? "";
    if (!ALL_CHARACTER_IDS.includes(c as CharacterId)) return fail("bad_request");
    return json({ ok: true, character: c, ...buildOf(ctx, c) });
  }
  if (request.method !== "POST") return fail("not_found", 404);
  const body = await readJson<{ player?: unknown; character?: unknown; weapon?: unknown; passives?: unknown; won?: unknown }>(request, 8 * 1024);
  const { player, character, weapon, passives } = body ?? {};
  if (!isPlayerId(player) || !ALL_CHARACTER_IDS.includes(character as CharacterId) || typeof weapon !== "string" || !Object.hasOwn(WEAPONS, weapon)) return fail("bad_request");
  if (!Array.isArray(passives) || passives.length > MAX_PASSIVES * 4 || !passives.every((p) => typeof p === "string" && Object.hasOwn(PASSIVES, p))) return fail("bad_request");
  const key = `build:${player}`;
  const now = ctx.now();
  const last = ctx.limits.get(key);
  if (last && last.until > now) return fail("wait", 429);
  ctx.limits.set(key, { count: 1, until: now + GAP_MS });
  if (ctx.limits.size > 5000) ctx.limits.clear();
  const won = body?.won === true ? 1 : 0;
  const st = buildOf(ctx, character as string);
  const bump = (m: Record<string, Pair>, id: string) => {
    const p = (m[id] ??= [0, 0]);
    p[0]++;
    p[1] += won;
  };
  st.runs++;
  st.wins += won;
  bump(st.weapons, weapon);
  for (const id of [...new Set(passives as string[])].slice(0, MAX_PASSIVES)) bump(st.passives, id);
  ctx.sql.exec(`INSERT INTO builds (character, data) VALUES (?, ?) ON CONFLICT(character) DO UPDATE SET data = excluded.data`, character as string, JSON.stringify(st));
  return json({ ok: true });
}
