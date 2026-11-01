// 티어표 (관리자 '티어 플레잉'): 관리자가 저장한 티어표를 아카이브 티어표가 그대로 씀 · 관리자가 캐릭터마다 해 본 기록(클리어 시간·별점·비고)
// GET /api/tier (누구나, 없으면 tiers: null → 화면의 기본 표) · 관리자: POST /api/admin/tier · GET·POST /api/admin/tierplay
import { ALL_CHARACTER_IDS, type CharacterId } from "@pixel-rogue/shared";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";

export const TIER_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS tier_list (id INTEGER PRIMARY KEY, data TEXT NOT NULL, at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS tier_play (character TEXT PRIMARY KEY, data TEXT NOT NULL, at INTEGER NOT NULL)`,
];

/** 티어 단계 이름 (화면 archive/tierData의 TierId와 같음) */
const TIER_IDS = ["god", "meal", "mid", "meh", "trash"];
/** 기록 하나 크기 한도 (비고 글 포함) */
const RECORD_BYTES = 6 * 1024;

const isChar = (c: unknown): c is CharacterId => ALL_CHARACTER_IDS.includes(c as CharacterId);

/** 받은 티어표가 맞는지: 단계 5개 · 캐릭터는 아는 것만, 한 번씩만 */
function cleanTiers(raw: unknown): { id: string; chars: CharacterId[] }[] | null {
  if (!Array.isArray(raw) || raw.length !== TIER_IDS.length) return null;
  const seen = new Set<string>();
  const out: { id: string; chars: CharacterId[] }[] = [];
  for (const [i, t] of raw.entries()) {
    const row = t as { id?: unknown; chars?: unknown };
    if (row?.id !== TIER_IDS[i] || !Array.isArray(row.chars)) return null;
    const chars: CharacterId[] = [];
    for (const c of row.chars) {
      if (!isChar(c) || seen.has(c)) return null;
      seen.add(c);
      chars.push(c);
    }
    out.push({ id: TIER_IDS[i]!, chars });
  }
  return out;
}

/** GET /api/tier: 관리자가 저장한 티어표 (없으면 null) */
export function handleTier(ctx: HubContext): Response {
  const row = ctx.sql.exec("SELECT data, at FROM tier_list WHERE id = 1").toArray()[0];
  return json({ ok: true, tiers: row ? JSON.parse(String(row.data)) : null, at: row ? Number(row.at) : 0 });
}

/** 관리자: tier (티어표 저장) · tierplay (기록 보기·하나 저장) — 로그인 확인은 balanceApi.handleAdmin에서 */
export async function handleTierAdmin(ctx: HubContext, action: string, request: Request): Promise<Response | null> {
  if (action === "tier" && request.method === "POST") {
    const body = await readJson<{ tiers?: unknown }>(request, 16 * 1024);
    const tiers = cleanTiers(body?.tiers);
    if (!tiers) return fail("bad_request");
    ctx.sql.exec("INSERT INTO tier_list (id, data, at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, at = excluded.at", JSON.stringify(tiers), ctx.now());
    return json({ ok: true });
  }
  if (action === "tierplay" && request.method === "GET") {
    const rows = ctx.sql.exec("SELECT character, data, at FROM tier_play ORDER BY at ASC").toArray();
    return json({ ok: true, records: rows.map((r) => ({ ...JSON.parse(String(r.data)), character: String(r.character), at: Number(r.at) })) });
  }
  if (action === "tierplay" && request.method === "POST") {
    const body = await readJson<{ character?: unknown; record?: unknown }>(request, RECORD_BYTES + 512);
    if (!body || !isChar(body.character) || typeof body.record !== "object" || body.record === null) return fail("bad_request");
    const data = JSON.stringify(body.record);
    if (data.length > RECORD_BYTES) return fail("bad_request");
    ctx.sql.exec("INSERT INTO tier_play (character, data, at) VALUES (?, ?, ?) ON CONFLICT(character) DO UPDATE SET data = excluded.data, at = excluded.at", body.character, data, ctx.now());
    return json({ ok: true });
  }
  return null;
}
