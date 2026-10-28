// 게임 수치 (관리자 페이지에서 바꿈). 서버마다 따로 저장. 바꿀 때마다 그 수치를 지문(hash)으로 남겨 둠
// → 일일 도전 기록은 그 판을 한 수치로 다시 돌려 확인할 수 있음
// 수치 세트는 셋: 던전(기본) · 타워 디펜스(?set=td) · 패왕전(?set=pw). 표·지금 수치·바꾼 기록 모두 따로
import { clearRows } from "./clearStats";
import { DEFAULT_BALANCE_HASH, DUNGEON_BALANCE, PW_BALANCE, TD_BALANCE, type BalanceSet, type BalanceValues } from "@pixel-rogue/shared";
import { handleLogin, isAdmin } from "./adminLogin";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";
import { first } from "./sql";

/** 수치 세트 하나를 저장하는 곳: 지문별 수치 표 · 바꾼 기록 표 · 지금 지문(meta 키) */
interface Store {
  set: BalanceSet;
  versions: string;
  log: string;
  meta: string;
}

const DUNGEON: Store = { set: DUNGEON_BALANCE, versions: "balance_versions", log: "balance_log", meta: "balance" };
const TD: Store = { set: TD_BALANCE, versions: "td_balance_versions", log: "td_balance_log", meta: "tdBalance" };
const PW: Store = { set: PW_BALANCE, versions: "pw_balance_versions", log: "pw_balance_log", meta: "pwBalance" };

export const BALANCE_SCHEMA = [DUNGEON, TD, PW].flatMap((s) => [
  `CREATE TABLE IF NOT EXISTS ${s.versions} (hash TEXT PRIMARY KEY, data TEXT NOT NULL, created INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS ${s.log} (at INTEGER NOT NULL, hash TEXT NOT NULL, note TEXT NOT NULL)`,
]);
/** 바꾼 기록은 최근 이만큼만 보여 줌 */
const LOG_SIZE = 30;

/** 주소의 ?set=td 이면 타워 디펜스 수치 · ?set=pw 이면 패왕전 수치 */
const storeOf = (request: Request): Store => ({ td: TD, pw: PW })[new URL(request.url).searchParams.get("set") ?? ""] ?? DUNGEON;

function versionIn(ctx: HubContext, store: Store, hash: string): BalanceValues | null {
  if (hash === DEFAULT_BALANCE_HASH) return {};
  const row = first(ctx.sql, `SELECT data FROM ${store.versions} WHERE hash = ?`, hash);
  return row ? (JSON.parse(String(row.data)) as BalanceValues) : null;
}

function liveIn(ctx: HubContext, store: Store): { hash: string; values: BalanceValues } {
  const row = first(ctx.sql, "SELECT v FROM meta WHERE k = ?", store.meta);
  const hash = row ? String(row.v) : DEFAULT_BALANCE_HASH;
  return { hash, values: versionIn(ctx, store, hash) ?? {} };
}

/** 지문 → 던전 수치 (모르는 지문이면 null) */
export const balanceVersion = (ctx: HubContext, hash: string) => versionIn(ctx, DUNGEON, hash);

/** 지금 쓰는 던전 수치 */
export const liveBalance = (ctx: HubContext) => liveIn(ctx, DUNGEON);

function saveBalance(ctx: HubContext, store: Store, raw: unknown, note: string): { hash: string; values: BalanceValues } {
  const values = store.set.cleanBalance(raw);
  const hash = store.set.balanceHash(values);
  const now = ctx.now();
  if (hash !== DEFAULT_BALANCE_HASH) {
    ctx.sql.exec(`INSERT OR IGNORE INTO ${store.versions} (hash, data, created) VALUES (?, ?, ?)`, hash, JSON.stringify(values), now);
  }
  if (hash === liveIn(ctx, store).hash) return { hash, values };
  ctx.sql.exec("INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT (k) DO UPDATE SET v = excluded.v", store.meta, hash);
  ctx.sql.exec(`INSERT INTO ${store.log} (at, hash, note) VALUES (?, ?, ?)`, now, hash, note.slice(0, 80));
  ctx.sql.exec(`DELETE FROM ${store.log} WHERE at < (SELECT at FROM ${store.log} ORDER BY at DESC LIMIT 1 OFFSET ?)`, LOG_SIZE - 1);
  return { hash, values };
}

/** GET /api/balance (지금 수치) · /api/balance?v=<지문> (그 수치) · &set=td 타워 디펜스 — 누구나 */
export function handleBalance(ctx: HubContext, request: Request): Response {
  const store = storeOf(request);
  const v = new URL(request.url).searchParams.get("v");
  if (!v) return json({ ok: true, ...liveIn(ctx, store) });
  const values = versionIn(ctx, store, v);
  return values ? json({ ok: true, hash: v, values }) : fail("not_found", 404);
}

/** /api/admin/...: 로그인 · 확인 · 수치 저장 · 바꾼 기록 (수치·기록은 ?set=td 이면 타워 디펜스) */
export async function handleAdmin(ctx: HubContext, action: string, request: Request): Promise<Response> {
  if (action.startsWith("login/") && request.method === "POST") return handleLogin(ctx, action.slice(6), request);
  if (!ctx.admin.webhook) return fail("not_configured", 503);
  if (!(await isAdmin(ctx, request))) return fail("login", 401);
  if (action === "check") return json({ ok: true, env: ctx.admin.appEnv });
  const store = storeOf(request);
  // 관리자 화면은 저장해 둔 값(30초)이 아니라 바로 지금 값을 봄
  if (action === "balance" && request.method === "GET") return json({ ok: true, ...liveIn(ctx, store) });
  if (action === "balance" && request.method === "POST") {
    const body = await readJson<{ values?: unknown; note?: unknown }>(request, 256 * 1024);
    if (!body || typeof body.values !== "object") return fail("bad_request");
    return json({ ok: true, ...saveBalance(ctx, store, body.values, typeof body.note === "string" ? body.note : "") });
  }
  if (action === "clears" && request.method === "GET") return json({ ok: true, rows: clearRows(ctx) });
  if (action === "history" && request.method === "GET") {
    const rows = ctx.sql.exec(`SELECT at, hash, note FROM ${store.log} ORDER BY at DESC, rowid DESC LIMIT ?`, LOG_SIZE).toArray();
    return json({ ok: true, entries: rows });
  }
  return fail("not_found", 404);
}
