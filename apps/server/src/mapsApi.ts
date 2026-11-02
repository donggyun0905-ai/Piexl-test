// 관리자가 직접 만든 맵 (관리자 '맵 만들기'). 서버마다 따로 저장 (meta 키 하나에 JSON). 판을 시작할 때 화면이 받아 씀
import { cleanMaps } from "@pixel-rogue/shared";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";
import { first } from "./sql";

const KEY = "customMaps";

export function loadMaps(ctx: HubContext): ReturnType<typeof cleanMaps> {
  const row = first(ctx.sql, "SELECT v FROM meta WHERE k = ?", KEY);
  return row ? cleanMaps(JSON.parse(String(row.v))) : [];
}

/** GET /api/maps — 누구나 */
export function handleMaps(ctx: HubContext): Response {
  return json({ ok: true, maps: loadMaps(ctx) });
}

/** GET·POST /api/admin/maps — 관리자 (로그인은 handleAdmin에서 확인) */
export async function handleAdminMaps(ctx: HubContext, request: Request): Promise<Response> {
  if (request.method === "GET") return handleMaps(ctx);
  const body = await readJson<{ maps?: unknown }>(request, 512 * 1024);
  if (!body || !Array.isArray(body.maps)) return fail("bad_request");
  const maps = cleanMaps(body.maps);
  ctx.sql.exec("INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT (k) DO UPDATE SET v = excluded.v", KEY, JSON.stringify(maps));
  return json({ ok: true, maps });
}
