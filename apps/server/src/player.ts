// 플레이어(기기 ID)별 닉네임·해금, 기기 연동 코드.
// 로그인이 없으므로 플레이어 ID 자체가 열쇠. 다른 기기와 연동할 때는 5분짜리 숫자 코드로 ID를 넘겨줌 (한 번 쓰면 사라짐).
// 저장은 값이 바뀔 때만 (닉네임을 바꾸거나 해금이 늘 때, 연동 코드를 만들 때)
import { ACHIEVEMENT_IDS, cleanNickname, dayKey, isLinkCode, isPlayerId, LINK_CODE_LENGTH, LINK_CODE_TTL_MS } from "@pixel-rogue/shared";
import { randomInt } from "./crypto";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";
import { first } from "./sql";

/** 코드 맞히기를 막음: IP마다 1분에 10번 */
const LIMIT = 10;
const LIMIT_MS = 60_000;

export function cleanUnlocks(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  return [...new Set(list.filter((x): x is string => typeof x === "string" && ACHIEVEMENT_IDS.includes(x as never)))];
}

export interface Profile {
  nickname: string;
  unlocks: string[];
}

export function loadProfile(ctx: HubContext, player: string): Profile {
  const row = first(ctx.sql, "SELECT nickname, unlocks FROM players WHERE id = ?", player);
  return row ? { nickname: String(row.nickname), unlocks: cleanUnlocks(JSON.parse(String(row.unlocks))) } : { nickname: "", unlocks: [] };
}

/** IP마다 1분에 몇 번까지 (메모리만) */
function allow(ctx: HubContext, kind: string, ip: string): boolean {
  const key = `${kind}|${ip}`;
  const now = ctx.now();
  const r = ctx.limits.get(key);
  if (!r || now >= r.until) {
    ctx.limits.set(key, { count: 1, until: now + LIMIT_MS });
    if (ctx.limits.size > 5000) ctx.limits.clear();
    return true;
  }
  r.count++;
  return r.count <= LIMIT;
}

interface Body {
  player?: unknown;
  nickname?: unknown;
  unlocks?: unknown;
  code?: unknown;
  old?: unknown;
}

export async function handlePlayer(ctx: HubContext, action: string, request: Request): Promise<Response> {
  if (request.method !== "POST") return fail("method", 405);
  const body = await readJson<Body>(request, 8 * 1024);
  if (!body) return fail("bad_request");
  const ip = request.headers.get("CF-Connecting-IP") ?? "local";
  const now = ctx.now();

  // 서버에 저장된 닉네임·해금 (다른 기기에서 바뀌었을 수 있음)
  if (action === "profile") {
    if (!isPlayerId(body.player)) return fail("player");
    return json({ ok: true, ...loadProfile(ctx, body.player) });
  }

  // 닉네임 바꾸기·해금 합치기. 바뀐 게 있을 때만 저장
  if (action === "save") {
    if (!isPlayerId(body.player)) return fail("player");
    const have = loadProfile(ctx, body.player);
    const nickname = typeof body.nickname === "string" ? cleanNickname(body.nickname) : have.nickname;
    const unlocks = cleanUnlocks([...have.unlocks, ...cleanUnlocks(body.unlocks)]);
    if (nickname !== have.nickname || unlocks.length !== have.unlocks.length) {
      ctx.sql.exec(
        `INSERT INTO players (id, nickname, unlocks, created) VALUES (?, ?, ?, ?)
         ON CONFLICT (id) DO UPDATE SET nickname = excluded.nickname, unlocks = excluded.unlocks`,
        body.player,
        nickname,
        JSON.stringify(unlocks),
        now,
      );
    }
    return json({ ok: true, nickname, unlocks });
  }

  // 연동 코드 만들기 (이 기기 → 다른 기기). 한 사람에 코드 하나
  if (action === "link/create") {
    if (!isPlayerId(body.player)) return fail("player");
    if (!allow(ctx, "create", ip)) return fail("too_many", 429);
    ctx.sql.exec("DELETE FROM links WHERE expires < ? OR player = ?", now, body.player);
    let code = "";
    do code = String(randomInt(10 ** LINK_CODE_LENGTH)).padStart(LINK_CODE_LENGTH, "0");
    while (first(ctx.sql, "SELECT code FROM links WHERE code = ?", code));
    const expiresAt = now + LINK_CODE_TTL_MS;
    ctx.sql.exec("INSERT INTO links (code, player, expires) VALUES (?, ?, ?)", code, body.player, expiresAt);
    return json({ ok: true, code, expiresAt });
  }

  // 다른 기기의 코드 입력: 맞으면 그 기기의 ID·닉네임·해금을 줌. 이 기기의 예전 닉네임·오늘 일일 기록은 지움
  if (action === "link/redeem") {
    if (!allow(ctx, "redeem", ip)) return fail("too_many", 429);
    if (!isLinkCode(body.code)) return fail("bad_code");
    const row = first(ctx.sql, "SELECT player, expires FROM links WHERE code = ?", body.code);
    if (!row) return fail("bad_code");
    ctx.sql.exec("DELETE FROM links WHERE code = ?", body.code);
    if (Number(row.expires) < now) return fail("bad_code");
    const player = String(row.player);
    if (isPlayerId(body.old) && body.old !== player) {
      ctx.sql.exec("DELETE FROM players WHERE id = ?", body.old);
      // 이 기기의 상점 백업은 화면이 연동한 ID 쪽에 합쳐 올림
      ctx.sql.exec("DELETE FROM cloud WHERE id = ?", body.old);
      // 일반·서든데스 둘 다
      ctx.sql.exec("DELETE FROM daily WHERE day IN (?, ?) AND user = ?", dayKey(now), `sd:${dayKey(now)}`, body.old);
    }
    return json({ ok: true, player, ...loadProfile(ctx, player) });
  }

  return fail("not_found", 404);
}
