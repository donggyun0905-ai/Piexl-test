// Hub Durable Object (하나만 씀): 플레이어(기기 ID)별 닉네임·해금 · 기기 연동 · 일일 도전 순위표 · 레이드 명예의 전당 · 레이드 아레나 순위표 · 배틀 빠른 매칭 · 패왕전 랭크 점수.
// 저장은 값이 바뀔 때만 (닉네임을 바꾸거나 해금이 늘 때, 내 최고 기록이 오를 때)
import { postWebhook, type AdminState } from "./adminLogin";
import { BALANCE_SCHEMA, handleAdmin, handleBalance } from "./balanceApi";
import { handleDaily } from "./dailyApi";
import { fail } from "./http";
import { handleMatch, type MatchState } from "./match";
import { handlePlayer } from "./player";
import { CLOUD_SCHEMA, handleCloud } from "./cloudSave";
import { handleRaid } from "./raidApi";
import { handleArena } from "./arenaApi";
import { CLEAR_SCHEMA, handleClear } from "./clearStats";
import { handleRank, handleRankApply, RANK_SCHEMA } from "./rankApi";
import { first, type SqlLike } from "./sql";
import { takeTurn } from "./turnBudget";

export interface HubContext {
  sql: SqlLike;
  /** 서명 열쇠 (처음 한 번 만들어 저장) */
  key: string;
  /** 일일 시드용 비밀 값 (미리 내일 시드를 알 수 없게) */
  dailySalt: string;
  now: () => number;
  /** IP별 요청 횟수 (메모리만, 연동 코드 맞히기 막기) */
  limits: Map<string, { count: number; until: number }>;
  match: MatchState;
  /** 관리자 로그인 (게임 수치 바꾸기) */
  admin: AdminState;
  /** 기록을 판 전체 다시 돌려 확인할지 (무료 플랜은 요청 하나의 계산 시간이 짧아 끔: REPLAY_CHECK = "off") */
  replay: boolean;
}

/** 서버 설정 중 Hub가 쓰는 값 */
export interface HubEnv {
  APP_ENV?: string;
  /** 관리자 로그인 코드를 받을 디스코드 웹훅 (Secret) */
  ADMIN_LOGIN_WEBHOOK?: string;
  /** "off"면 일일 도전·레이드·아레나 기록을 다시 돌려 확인하지 않음 (Workers 무료 플랜용) */
  REPLAY_CHECK?: string;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL)`,
  // 예전 가입 계정 표 (0.11.0에서 가입을 없앰. 비밀번호 해시가 남지 않게 지움)
  `DROP TABLE IF EXISTS users`,
  `CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY, nickname TEXT NOT NULL DEFAULT '', unlocks TEXT NOT NULL DEFAULT '[]', created INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS links (code TEXT PRIMARY KEY, player TEXT NOT NULL, expires INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS daily (
    day TEXT NOT NULL, user TEXT NOT NULL, nickname TEXT NOT NULL, score INTEGER NOT NULL,
    floor INTEGER NOT NULL, won INTEGER NOT NULL, ticks INTEGER NOT NULL, character TEXT NOT NULL,
    finished INTEGER NOT NULL, verified INTEGER NOT NULL, PRIMARY KEY (day, user))`,
  `CREATE INDEX IF NOT EXISTS daily_rank ON daily (day, score DESC, finished ASC)`,
  // 레이드 명예의 전당: 보스별 사람마다 가장 빠른 시간 (틱)
  `CREATE TABLE IF NOT EXISTS raid (
    boss TEXT NOT NULL, user TEXT NOT NULL, nickname TEXT NOT NULL, ticks INTEGER NOT NULL, character TEXT NOT NULL,
    finished INTEGER NOT NULL, PRIMARY KEY (boss, user))`,
  `CREATE INDEX IF NOT EXISTS raid_rank ON raid (boss, ticks ASC, finished ASC)`,
  // 레이드 아레나 (전체 기간): 사람마다 가장 좋은 기록 (깬 레벨 · 틱)
  `CREATE TABLE IF NOT EXISTS arena (
    user TEXT PRIMARY KEY, nickname TEXT NOT NULL, level INTEGER NOT NULL, ticks INTEGER NOT NULL, character TEXT NOT NULL, finished INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS arena_rank ON arena (level DESC, ticks ASC, finished ASC)`,
  ...BALANCE_SCHEMA,
  // 캐릭터별 클리어 시간 (횟수·합계·가장 빠른 시간)
  ...CLEAR_SCHEMA,
  // 패왕전 랭크전 점수
  ...RANK_SCHEMA,
  // 상점 쪽 저장 백업
  ...CLOUD_SCHEMA,
];

function randomKey(): string {
  return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
}

/** 처음 한 번 표 만들기·열쇠 준비 */
export function setupHub(sql: SqlLike, now: () => number = Date.now, env: HubEnv = {}, send = postWebhook): HubContext {
  for (const q of SCHEMA) sql.exec(q);
  const meta = (k: string): string => {
    const row = first(sql, "SELECT v FROM meta WHERE k = ?", k);
    if (row) return String(row.v);
    const v = randomKey();
    sql.exec("INSERT INTO meta (k, v) VALUES (?, ?)", k, v);
    return v;
  };
  return {
    sql,
    key: meta("hmac"),
    dailySalt: meta("dailySalt"),
    now,
    limits: new Map(),
    match: { open: null },
    admin: { webhook: env.ADMIN_LOGIN_WEBHOOK?.trim() ?? "", appEnv: env.APP_ENV ?? "local", send, lastCodeAt: 0, fails: 0 },
    replay: env.REPLAY_CHECK !== "off",
  };
}

/** 요청 나누기 */
export async function routeHub(ctx: HubContext, request: Request): Promise<Response> {
  const path = new URL(request.url).pathname;
  if (path.startsWith("/api/player/")) return handlePlayer(ctx, path.slice("/api/player/".length), request);
  if (path.startsWith("/api/cloud/")) return handleCloud(ctx, path.slice("/api/cloud/".length), request);
  if (path.startsWith("/api/daily/")) return handleDaily(ctx, path.slice("/api/daily/".length), request);
  if (path.startsWith("/api/raid/")) return handleRaid(ctx, path.slice("/api/raid/".length), request);
  if (path.startsWith("/api/arena/")) return handleArena(ctx, path.slice("/api/arena/".length), request);
  if (path === "/api/balance" && request.method === "GET") return handleBalance(ctx, request);
  if (path === "/api/stats/clear") return handleClear(ctx, request);
  if (path.startsWith("/api/admin/")) return handleAdmin(ctx, path.slice("/api/admin/".length), request);
  if (path.startsWith("/api/match/")) return handleMatch(ctx, path.slice("/api/match/".length), request);
  if (path.startsWith("/api/rank/")) return handleRank(ctx, path.slice("/api/rank/".length), request);
  if (path === "/internal/rank" && request.method === "POST") return handleRankApply(ctx, request);
  // 안에서만 부름 (밖에서 오는 요청은 /api/만 여기로 옴)
  if (path === "/internal/turn") return Response.json({ ok: takeTurn(ctx, request.headers.get("x-ip") ?? "") });
  return fail("not_found", 404);
}

/** Durable Object 클래스 */
export class Hub {
  private ctx: HubContext;
  constructor(state: { storage: { sql: SqlLike } }, env: HubEnv) {
    this.ctx = setupHub(state.storage.sql, Date.now, env);
  }
  fetch(request: Request): Promise<Response> {
    return routeHub(this.ctx, request);
  }
}
