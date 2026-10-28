// 서버 백업 합치기 (cloudSave가 부름): 지난번 맞춘 값(base) · 이 기기(local) · 서버(server) 셋을 비교
// - 목록(가진 스킨·펫·깬 맵 등): 둘을 합침 (가진 것은 사라지지 않음)
// - 숫자(쓴 쿠폰·코인·칩 등): 서버 값 + 이 기기에서 늘거나 준 만큼 (두 기기에서 한 일이 다 남음)
// - 나머지(입은 스킨·날짜 등): 이 기기에서 바꿨으면 이 기기 것, 아니면 서버 것

export type Json = unknown;

const isObject = (v: Json): v is Record<string, Json> => typeof v === "object" && v !== null && !Array.isArray(v);

export function merge3(base: Json, local: Json, server: Json): Json {
  if (local === undefined) return server;
  if (server === undefined) return local;
  if (Array.isArray(local) && Array.isArray(server)) return [...new Set([...server, ...local])];
  if (typeof local === "number" && typeof server === "number") {
    return Math.max(0, server + local - (typeof base === "number" ? base : 0));
  }
  if (isObject(local) && isObject(server)) {
    const b = isObject(base) ? base : {};
    const out: Record<string, Json> = {};
    for (const k of new Set([...Object.keys(server), ...Object.keys(local)])) {
      const v = merge3(b[k], local[k], server[k]);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  return JSON.stringify(local) !== JSON.stringify(base) ? local : server;
}
