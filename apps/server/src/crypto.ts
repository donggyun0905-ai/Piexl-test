// 서명(HMAC)·무작위 값. Workers의 Web Crypto만 씀
const enc = new TextEncoder();

export function toB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** 길이가 같은지 먼저 보고, 글자를 끝까지 비교 (시간으로 맞춰 보기 어렵게) */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function hmac(keyB64: string, text: string): Promise<string> {
  const raw = Uint8Array.from(atob(keyB64), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toB64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(text))));
}

/** 0 이상 n 미만 무작위 정수 */
export function randomInt(n: number): number {
  return crypto.getRandomValues(new Uint32Array(1))[0]! % n;
}
