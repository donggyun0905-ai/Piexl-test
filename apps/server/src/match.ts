// 배틀 방 코드 나눠 주기: 빠른 매칭(모으는 중인 공개 방) · 방 만들기(친구 초대용 코드)
import { BATTLE_MAX_PLAYERS, CARD_GAMES, COOP_MAX_PLAYERS, CARD_QUICK_WAIT_MS, CARD_SEATS, RANK, RANK_SEATS, type CardGame, type RankQueue } from "@pixel-rogue/shared";
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";

/** 빠른 매칭 방은 이만큼 지나면 새 방으로 (이미 시작했을 수 있음) */
const OPEN_MS = 60_000;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

type OpenRoom = { code: string; count: number; createdAt: number } | null;

export interface MatchState {
  /** 사람을 모으는 중인 빠른 매칭 방 코드 (메모리만) */
  open: OpenRoom;
  /** 협동 빠른 매칭 방 (배틀과 따로) */
  openCoop?: OpenRoom;
  /** 패왕전 랭크전: 대결마다 모으는 중인 방 */
  rank?: Partial<Record<RankQueue, NonNullable<OpenRoom>>>;
  /** 로비 카드·타일 게임 빠른 시작: 게임마다 모으는 중인 방 */
  cards?: Partial<Record<CardGame, NonNullable<OpenRoom>>>;
}

export function roomCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
}

export async function handleMatch(ctx: HubContext, action: string, request: Request): Promise<Response> {
  if (request.method !== "POST") return fail("method", 405);
  const body = (await readJson<{ exclude?: unknown; game?: unknown; kind?: unknown }>(request, 1024)) ?? {};
  const now = ctx.now();
  if (action === "quick") {
    const coop = body.kind === "coop";
    const key = coop ? "openCoop" : "open";
    const max = coop ? COOP_MAX_PLAYERS : BATTLE_MAX_PLAYERS;
    let o = ctx.match[key] ?? null;
    if (!o || now - o.createdAt > OPEN_MS || o.count >= max || o.code === body.exclude) {
      o = ctx.match[key] = { code: roomCode(), count: 0, createdAt: now };
    }
    o.count++;
    return json({ ok: true, code: o.code, mode: "quick" });
  }
  if (action === "rank") {
    const queue: RankQueue = body.kind === "team" ? "team" : "solo";
    const rank = (ctx.match.rank ??= {});
    const o = rank[queue];
    // 기다리는 시간이 지났으면(이미 시작) 새 방
    if (!o || now - o.createdAt > RANK.waitMs - 2000 || o.count >= RANK_SEATS[queue] || o.code === body.exclude) rank[queue] = { code: roomCode(), count: 0, createdAt: now };
    rank[queue]!.count++;
    return json({ ok: true, code: rank[queue]!.code, mode: "quick" });
  }
  if (action === "create") return json({ ok: true, code: roomCode(), mode: "private" });
  if (action === "cards") {
    const game = CARD_GAMES.includes(body.game as CardGame) ? (body.game as CardGame) : "blackjack";
    const cards = (ctx.match.cards ??= {});
    const o = cards[game];
    // 모으는 시간이 지났거나 꽉 찼으면 새 방
    if (!o || now - o.createdAt > CARD_QUICK_WAIT_MS - 2000 || o.count >= CARD_SEATS[game]) cards[game] = { code: roomCode(), count: 0, createdAt: now };
    cards[game]!.count++;
    return json({ ok: true, code: cards[game]!.code, mode: "quick" });
  }
  return fail("not_found", 404);
}
