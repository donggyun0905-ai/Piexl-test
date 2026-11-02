// 관리자 페이지의 서버 요청. 서버(라이브·디벨롭·테스트)마다 따로 로그인 (로그인 값은 이 브라우저에만 12시간)
import type { BalanceValues, CustomMap } from "@pixel-rogue/shared";
import { SERVER_URL } from "../serverStatus";
import { loadText, saveText } from "../storage";

export interface ServerInfo {
  id: string;
  label: string;
  url: string;
}

export const SERVERS: ServerInfo[] = [
  { id: "live", label: "라이브 (main)", url: "https://pixel-rogue.numgame.workers.dev" },
  { id: "beta", label: "디벨롭 (develop)", url: "https://pixel-rogue-beta.numgame.workers.dev" },
  { id: "test", label: "테스트 (test)", url: "https://pixel-rogue-test.donggyun0905.workers.dev" },
];
// 내 컴퓨터에서 띄운 서버 (npm run dev)
if (SERVER_URL && !SERVERS.some((s) => s.url === SERVER_URL)) SERVERS.push({ id: "local", label: "이 컴퓨터", url: SERVER_URL });

/** 이 화면이 붙어 있는 게임의 서버 (관리자 페이지는 이 서버만 다룸. 다른 서버는 수치 가져오기에만) */
export function homeServer(): ServerInfo {
  return SERVERS.find((s) => s.url === SERVER_URL) ?? SERVERS[1]!;
}

export interface Result<T> {
  ok: boolean;
  status: number;
  error?: string;
  data?: T;
}

const tokenKey = (s: ServerInfo) => `admin:${s.id}`;

export function session(s: ServerInfo): string {
  return loadText(tokenKey(s)) ?? "";
}

export function logout(s: ServerInfo): void {
  saveText(tokenKey(s), "");
}

async function call<T>(s: ServerInfo, path: string, body?: unknown, auth = true): Promise<Result<T>> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && session(s)) headers.Authorization = `Bearer ${session(s)}`;
  try {
    const res = await fetch(`${s.url}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = (await res.json()) as T & { ok: boolean; error?: string };
    return data.ok ? { ok: true, status: res.status, data } : { ok: false, status: res.status, error: data.error ?? `http_${res.status}` };
  } catch {
    return { ok: false, status: 0, error: "offline" };
  }
}

export interface BalanceRes {
  hash: string;
  values: BalanceValues;
}

export interface LogEntry {
  at: number;
  hash: string;
  note: string;
}

/** 캐릭터별 클리어 시간 (횟수·합계·가장 빠른 시간, 틱) */
export interface ClearRow {
  character: string;
  count: number;
  total: number;
  best: number;
}

/** 수치 세트: 던전(기본) · 타워 디펜스 · 패왕전 */
export type SetKind = "dungeon" | "td" | "pw";
const q = (kind: SetKind, more = "") => (kind !== "dungeon" ? `?set=${kind}${more ? `&${more}` : ""}` : more ? `?${more}` : "");

export const adminApi = {
  requestCode: (s: ServerInfo) => call<{ pending: string }>(s, "/api/admin/login/request", {}, false),
  async verify(s: ServerInfo, pending: string, code: string) {
    const res = await call<{ session: string }>(s, "/api/admin/login/verify", { pending, code }, false);
    if (res.ok && res.data) saveText(tokenKey(s), res.data.session);
    return res;
  },
  check: (s: ServerInfo) => call<{ env: string }>(s, "/api/admin/check"),
  /** 로그인한 서버의 바로 지금 수치 */
  balance: (s: ServerInfo, kind: SetKind) => call<BalanceRes>(s, `/api/admin/balance${q(kind)}`),
  /** 로그인 없이 보는 수치 (다른 서버와 비교할 때. 30초 늦을 수 있음) */
  publicBalance: (s: ServerInfo, kind: SetKind) => call<BalanceRes>(s, `/api/balance${q(kind)}`, undefined, false),
  version: (s: ServerInfo, kind: SetKind, hash: string) => call<BalanceRes>(s, `/api/balance${q(kind, `v=${encodeURIComponent(hash)}`)}`, undefined, false),
  save: (s: ServerInfo, kind: SetKind, values: BalanceValues, note: string) => call<BalanceRes>(s, `/api/admin/balance${q(kind)}`, { values, note }),
  clears: (s: ServerInfo) => call<{ rows: ClearRow[] }>(s, "/api/admin/clears"),
  /** 티어표 (관리자 저장 → 아카이브 티어표) · 티어 플레잉 기록 (캐릭터마다 하나) */
  tierSave: (s: ServerInfo, tiers: unknown) => call<{ ok: true }>(s, "/api/admin/tier", { tiers }),
  tierPublic: (s: ServerInfo) => call<{ tiers: unknown }>(s, "/api/tier", undefined, false),
  tierPlays: (s: ServerInfo) => call<{ records: unknown[] }>(s, "/api/admin/tierplay"),
  tierPlaySave: (s: ServerInfo, character: string, record: unknown) => call<{ ok: true }>(s, "/api/admin/tierplay", { character, record }),
  /** 직접 만든 맵: 받기 · 모두 저장 */
  maps: (s: ServerInfo) => call<{ maps: CustomMap[] }>(s, "/api/admin/maps"),
  saveMaps: (s: ServerInfo, maps: CustomMap[]) => call<{ maps: CustomMap[] }>(s, "/api/admin/maps", { maps }),
  history: (s: ServerInfo, kind: SetKind) => call<{ entries: LogEntry[] }>(s, `/api/admin/history${q(kind)}`),
};

/** 오류 코드 → 안내 글 */
export function errorText(error: string | undefined): string {
  switch (error) {
    case "offline":
      return "서버에 닿지 않습니다 (주소·인터넷 확인, 아직 이 기능이 배포되지 않은 서버일 수도 있음).";
    case "not_found":
      return "이 서버에는 아직 관리자 기능이 없습니다 (배포 전).";
    case "not_configured":
      return "이 서버에 디스코드 웹훅(ADMIN_LOGIN_WEBHOOK)이 없습니다. Cloudflare에서 Secret으로 넣어 주세요.";
    case "wait":
      return "방금 보냈습니다. 30초 뒤에 다시 받아 주세요.";
    case "send_failed":
      return "디스코드로 보내지 못했습니다. 웹훅 주소를 확인해 주세요.";
    case "bad_code":
      return "코드가 맞지 않거나 5분이 지났습니다.";
    case "too_many":
      return "너무 많이 틀렸습니다. 코드를 다시 받아 주세요.";
    case "login":
      return "로그인이 끝났습니다. 다시 로그인해 주세요.";
    default:
      return `실패했습니다 (${error ?? "?"}).`;
  }
}
