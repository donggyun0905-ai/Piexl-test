// 상점 쪽 저장 백업 (쿠폰·스킨·이벤트 코인·효과·펫·칩·미션). 꾸밈 아이템이라 화면이 합친 값을 그대로 받음.
// 차례 번호(rev)가 서버 것과 같을 때만 받고 +1 (다른 기기가 먼저 올렸으면 서버 값을 돌려줘 화면이 합쳐 다시 올림)
// 저장은 받을 때만 (화면이 몇 초 모아 보냄)
import { isPlayerId } from "@pixel-rogue/shared";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";
import { first } from "./sql";

const MAX_BYTES = 64 * 1024;
const KEYS = ["wallet", "eventCoins", "fxShop", "lobbyPets", "chips", "missions"];

export const CLOUD_SCHEMA = [`CREATE TABLE IF NOT EXISTS cloud (id TEXT PRIMARY KEY, rev INTEGER NOT NULL, data TEXT NOT NULL, updated INTEGER NOT NULL)`];

interface Body {
  player?: unknown;
  base?: unknown;
  data?: unknown;
}

function stored(ctx: HubContext, player: string): { rev: number; data: unknown } {
  const row = first(ctx.sql, "SELECT rev, data FROM cloud WHERE id = ?", player);
  return row ? { rev: Number(row.rev), data: JSON.parse(String(row.data)) } : { rev: 0, data: null };
}

/** 정해진 칸의 객체만 남김 */
function clean(data: unknown): Record<string, unknown> | null {
  if (typeof data !== "object" || data === null || Array.isArray(data)) return null;
  const out: Record<string, unknown> = {};
  for (const k of KEYS) {
    const v = (data as Record<string, unknown>)[k];
    if (typeof v === "object" && v !== null) out[k] = v;
  }
  return out;
}

export async function handleCloud(ctx: HubContext, action: string, request: Request): Promise<Response> {
  if (request.method !== "POST") return fail("method", 405);
  const body = await readJson<Body>(request, MAX_BYTES);
  if (!body) return fail("bad_request");
  if (!isPlayerId(body.player)) return fail("player");
  const have = stored(ctx, body.player);

  if (action === "get") return json({ ok: true, ...have });

  if (action === "save") {
    const data = clean(body.data);
    if (!data || typeof body.base !== "number") return fail("bad_request");
    if (body.base !== have.rev) return json({ ok: true, saved: false, ...have });
    const rev = have.rev + 1;
    ctx.sql.exec(
      `INSERT INTO cloud (id, rev, data, updated) VALUES (?, ?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET rev = excluded.rev, data = excluded.data, updated = excluded.updated`,
      body.player,
      rev,
      JSON.stringify(data),
      ctx.now(),
    );
    return json({ ok: true, saved: true, rev });
  }

  return fail("not_found", 404);
}
