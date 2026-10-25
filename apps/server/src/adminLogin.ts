// 관리자 로그인: 디스코드 비공개 채널(웹훅)로 일회용 코드(8자)를 보내고, 맞게 입력하면 12시간 로그인.
// 서버에 저장하지 않으려고 서명한 값으로 처리 (코드 요청 → '대기' 값, 코드 맞히면 → '로그인' 값).
// 웹훅 주소는 서버 Secret ADMIN_LOGIN_WEBHOOK (서버마다 따로). 없으면 관리자 기능이 꺼짐
import type { HubContext } from "./hub";
import { fail, json, readJson } from "./http";
import { hmac, randomInt, safeEqual } from "./crypto";

export const CODE_TTL_MS = 5 * 60_000;
export const SESSION_TTL_MS = 12 * 60 * 60_000;
/** 코드를 다시 보내려면 이만큼 기다림 (디스코드 도배 막기, 서버 전체 기준) */
export const CODE_COOLDOWN_MS = 30_000;
/** 헷갈리는 글자(0 O 1 I)를 뺀 코드 글자 */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;
/** 코드 틀림: 이만큼 틀리면 잠깐 막음 */
const MAX_FAILS = 10;

export interface AdminState {
  /** 코드를 받을 디스코드 웹훅 주소 (없으면 꺼짐) */
  webhook: string;
  /** 서버 이름 (live·beta·test), 디스코드 글에 표시 */
  appEnv: string;
  /** 디스코드로 보내기 (시험에서 바꿔 끼움) */
  send: (url: string, body: unknown) => Promise<boolean>;
  lastCodeAt: number;
  fails: number;
}

export async function postWebhook(url: string, body: unknown): Promise<boolean> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  return !!res?.ok;
}

function newCode(): string {
  let s = "";
  for (let i = 0; i < CODE_LENGTH; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return s;
}

/** 사람이 친 코드 다듬기 (공백·소문자·줄표 허용) */
function cleanCode(raw: unknown): string {
  return typeof raw === "string" ? raw.toUpperCase().replace(/[\s-]/g, "") : "";
}

async function pendingToken(ctx: HubContext, code: string, at: number): Promise<string> {
  return `${at}.${await hmac(ctx.key, `admin-code.${at}.${code}`)}`;
}

async function sessionToken(ctx: HubContext, now: number): Promise<string> {
  const exp = now + SESSION_TTL_MS;
  return `${exp}.${await hmac(ctx.key, `admin-session.${exp}`)}`;
}

/** 요청의 'Authorization: Bearer <로그인 값>'이 맞는지 */
export async function isAdmin(ctx: HubContext, request: Request): Promise<boolean> {
  if (!ctx.admin.webhook) return false;
  const token = /^Bearer (\S+)$/.exec(request.headers.get("Authorization") ?? "")?.[1] ?? "";
  const [expRaw, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < ctx.now() || !sig) return false;
  return safeEqual(sig, await hmac(ctx.key, `admin-session.${exp}`));
}

/** /api/admin/login/<step>: request(코드 보내기) · verify(코드 확인) */
export async function handleLogin(ctx: HubContext, step: string, request: Request): Promise<Response> {
  const a = ctx.admin;
  if (!a.webhook) return fail("not_configured", 503);
  const now = ctx.now();
  if (step === "request") {
    if (now - a.lastCodeAt < CODE_COOLDOWN_MS) return fail("wait", 429);
    a.lastCodeAt = now;
    a.fails = 0;
    const code = newCode();
    const ok = await a.send(a.webhook, {
      username: "픽셀 로그 관리자",
      allowed_mentions: { parse: [] },
      // 코드 칸(`…`)에 넣어 누르면 복사되게
      content: `🔑 [${a.appEnv}] 관리자 로그인 코드 (${CODE_TTL_MS / 60_000}분 안에 입력, 누르면 복사). 본인이 요청한 게 아니면 무시하세요.\n\`${code}\``,
    });
    if (!ok) return fail("send_failed", 502);
    return json({ ok: true, pending: await pendingToken(ctx, code, now) });
  }
  if (step === "verify") {
    const body = await readJson<{ pending?: unknown; code?: unknown }>(request, 4096);
    const [atRaw, sig] = String(body?.pending ?? "").split(".");
    const at = Number(atRaw);
    const code = cleanCode(body?.code);
    if (a.fails >= MAX_FAILS) return fail("too_many", 429);
    const fresh = Number.isFinite(at) && now - at < CODE_TTL_MS && at <= now;
    if (!fresh || !sig || code.length !== CODE_LENGTH || !safeEqual(sig, (await pendingToken(ctx, code, at)).split(".")[1]!)) {
      a.fails++;
      return fail("bad_code", 401);
    }
    a.fails = 0;
    return json({ ok: true, session: await sessionToken(ctx, now), env: a.appEnv });
  }
  return fail("not_found", 404);
}
