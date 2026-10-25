import { GAME_VERSION } from "@pixel-rogue/shared";
import { json } from "./http";
import { stunServers, turnServers, turnStatus, type IceEnv } from "./ice";

export { BattleRoom } from "./battleRoom";
export { CardRoom } from "./cardRoom";
export { Hub } from "./hub";

export interface Env extends IceEnv {
  APP_ENV: string;
  /** 쉼표로 구분한 허용 주소 */
  ALLOWED_ORIGINS: string;
  /** 관리자 로그인 코드를 받을 디스코드 웹훅 (Secret, 서버마다 따로) */
  ADMIN_LOGIN_WEBHOOK?: string;
  HUB: DurableObjectNamespace;
  BATTLE: DurableObjectNamespace;
  CARDS: DurableObjectNamespace;
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin");
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  if (!origin || !allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

/**
 * 지금 게임 수치(공개 값)는 어느 주소에서든 읽을 수 있음: 다른 서버의 관리자 페이지가 비교·가져오기에 씀.
 * 관리자 요청은 그 서버의 화면 주소에서만 (관리자 페이지는 자기 서버만 다룸)
 */
function openCors(request: Request): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": request.headers.get("Origin") ?? "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function withHeaders(res: Response, headers: Record<string, string>): Response {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(headers)) out.headers.set(k, v);
  return out;
}

/** 한국·일본 이용자 기준: 아시아·태평양에 두기 */
function hub(env: Env): DurableObjectStub {
  return env.HUB.get(env.HUB.idFromName("main"), { locationHint: "apac" });
}

/** 순위표·지금 게임 수치는 30초 동안 저장해 두고 그대로 돌려줌 (요청 수 = 비용). 지문으로 찾는 수치는 바뀌지 않으니 하루 */
const BOARD_CACHE_SECONDS = 30;
const VERSION_CACHE_SECONDS = 86_400;

async function cachedBoard(request: Request, env: Env, seconds = BOARD_CACHE_SECONDS): Promise<Response> {
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  const key = new Request(new URL(request.url).toString(), { method: "GET" });
  const hit = await cache?.match(key);
  if (hit) return hit;
  const res = await hub(env).fetch(request);
  if (res.ok && cache) {
    const copy = withHeaders(res.clone(), { "Cache-Control": `public, max-age=${seconds}` });
    await cache.put(key, copy);
  }
  return res;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const cors = url.pathname === "/api/balance" ? openCors(request) : corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    if (url.pathname === "/health" && request.method === "GET") {
      return json({ ok: true, env: env.APP_ENV, version: GAME_VERSION }, 200, cors);
    }
    // 협동: 직접 연결 도우미 주소 (Durable Object를 거치지 않음)
    if (url.pathname === "/coop/ice" && request.method === "GET") return stunServers(cors);
    if (url.pathname === "/coop/turn-status" && request.method === "GET") return turnStatus(env, cors);
    // 직접 연결이 안 될 때만: 중계 주소 (한 달 한도 안에서)
    if (url.pathname === "/coop/turn" && request.method === "POST") {
      const ip = request.headers.get("CF-Connecting-IP") ?? "";
      const allowed = async () => {
        const res = await hub(env).fetch(new Request("https://hub/internal/turn", { method: "POST", headers: { "x-ip": ip } }));
        return ((await res.json()) as { ok?: boolean }).ok === true;
      };
      return turnServers(env, allowed, cors);
    }
    if (url.pathname === "/api/balance" && request.method === "GET") {
      const seconds = url.searchParams.has("v") ? VERSION_CACHE_SECONDS : BOARD_CACHE_SECONDS;
      return withHeaders(await cachedBoard(request, env, seconds), cors);
    }
    if ((url.pathname === "/api/daily/board" || url.pathname === "/api/raid/board" || url.pathname === "/api/arena/board") && request.method === "GET") {
      return withHeaders(await cachedBoard(request, env), cors);
    }
    // 배틀 방 웹소켓: /battle/<코드>?mode=quick|private
    const battle = /^\/battle\/([A-Z2-9]{6})$/.exec(url.pathname);
    if (battle && request.headers.get("Upgrade") === "websocket") {
      const origin = request.headers.get("Origin");
      if (origin && !env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).includes(origin)) {
        return json({ ok: false, error: "origin" }, 403);
      }
      const stub = env.BATTLE.get(env.BATTLE.idFromName(battle[1]!), { locationHint: "apac" });
      return stub.fetch(request);
    }
    // 로비 카드·타일 게임 방 웹소켓: /cards/<코드>?game=blackjack|tiles|joker&mode=quick|private
    const cards = /^\/cards\/([A-Z2-9]{6})$/.exec(url.pathname);
    if (cards && request.headers.get("Upgrade") === "websocket") {
      const origin = request.headers.get("Origin");
      if (origin && !env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).includes(origin)) {
        return json({ ok: false, error: "origin" }, 403);
      }
      const stub = env.CARDS.get(env.CARDS.idFromName(cards[1]!), { locationHint: "apac" });
      return stub.fetch(request);
    }
    if (url.pathname.startsWith("/api/")) {
      // Hub에서 오류(계산 시간 초과 등)가 나도 화면이 '연결 안 됨'이 아니라 오류 이름을 보게 접속 허용 정보를 붙여 돌려줌
      try {
        return withHeaders(await hub(env).fetch(request), cors);
      } catch (e) {
        const error = /cpu|exceeded/i.test(String(e)) ? "server_busy" : "server_error";
        return json({ ok: false, error }, 503, cors);
      }
    }
    return json({ ok: false, error: "not_found" }, 404, cors);
  },
} satisfies ExportedHandler<Env>;
