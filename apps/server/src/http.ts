// 응답 도우미
export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
}

export function fail(error: string, status = 400): Response {
  return json({ ok: false, error }, status);
}

/** 요청 본문 JSON (최대 크기 넘으면 null) */
export async function readJson<T>(request: Request, maxBytes = 512 * 1024): Promise<T | null> {
  const text = await request.text();
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
