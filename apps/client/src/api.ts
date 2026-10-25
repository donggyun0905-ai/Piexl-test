// 서버 요청 (일일 도전·계정·배틀 매칭). 요청 수 = 비용이라 필요할 때만
import { SERVER_URL } from "./serverStatus";

export interface ApiResult<T> {
  ok: boolean;
  error?: string;
  data?: T;
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  if (!SERVER_URL) return { ok: false, error: "offline" };
  try {
    const res = await fetch(`${SERVER_URL}${path}`, init);
    const body = (await res.json()) as T & { ok: boolean; error?: string };
    return body.ok ? { ok: true, data: body } : { ok: false, error: body.error ?? `http_${res.status}` };
  } catch {
    return { ok: false, error: "offline" };
  }
}

export function apiGet<T>(path: string): Promise<ApiResult<T>> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  return request<T>(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
