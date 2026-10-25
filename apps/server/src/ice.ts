// 협동 직접 연결(WebRTC)에 쓰는 연결 도우미 주소 목록.
// 기본은 STUN(내 공개 주소 알아내기)만. 직접 연결이 안 될 때만 화면이 /coop/turn으로 중계(TURN) 주소를 따로 받음.
// Cloudflare TURN 열쇠(TURN_KEY_ID·TURN_KEY_TOKEN 비밀 값)가 있어야 하고, 매달 1,000GB까지 무료라
// 실제 사용량(turnUsage)과 한 달에 내주는 횟수(turnBudget, Hub에서 셈)가 한도 안일 때만 줌
import { json } from "./http";
import { turnUsageOk, turnUsageStatus, type UsageEnv } from "./turnUsage";

export interface IceEnv extends UsageEnv {
  TURN_KEY_ID?: string;
  TURN_KEY_TOKEN?: string;
}

const STUN_ONLY = [{ urls: ["stun:stun.cloudflare.com:3478", "stun:stun.l.google.com:19302"] }];
/** 중계 연결 정보 유효 시간. 넘으면 중계가 끊겨 다시 받음 (한 번에 쓸 수 있는 양을 묶어 둠) */
const TTL_SECONDS = 3 * 60 * 60;

export function stunServers(headers: Record<string, string>): Response {
  return json({ ok: true, iceServers: STUN_ONLY }, 200, headers);
}

/** 중계 주소. allowed = 이번 달 한도 안 (Hub가 셈). 못 주면 turn: false와 STUN만 */
export async function turnServers(env: IceEnv, allowed: () => Promise<boolean>, headers: Record<string, string>): Promise<Response> {
  const none = () => json({ ok: true, turn: false, iceServers: STUN_ONLY }, 200, headers);
  if (!env.TURN_KEY_ID || !env.TURN_KEY_TOKEN) return none();
  // 안전장치: 이번 달 실제 사용량(GB) → 횟수 한도 순서로 확인
  if (!(await turnUsageOk(env)) || !(await allowed())) return none();
  try {
    const res = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${env.TURN_KEY_ID}/credentials/generate-ice-servers`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.TURN_KEY_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ttl: TTL_SECONDS }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { iceServers?: { urls: string | string[]; username?: string; credential?: string }[] };
    // 53번 포트 주소는 브라우저가 막아 기다리기만 하므로 뺌
    const list = (data.iceServers ?? []).map((s) => ({
      ...s,
      urls: (Array.isArray(s.urls) ? s.urls : [s.urls]).filter((u) => !/:53\b/.test(u)),
    }));
    return list.length ? json({ ok: true, turn: true, iceServers: list }, 200, headers) : none();
  } catch {
    return none();
  }
}

/** 중계 설정 상태 (브라우저로 열어 확인. 중계를 내주지 않고 횟수도 세지 않음) */
export async function turnStatus(env: IceEnv, headers: Record<string, string>): Promise<Response> {
  let key: boolean | string = !!(env.TURN_KEY_ID && env.TURN_KEY_TOKEN);
  if (key) {
    // 열쇠가 맞는지: 1분짜리 연결 정보를 받아 봄
    try {
      const res = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${env.TURN_KEY_ID}/credentials/generate-ice-servers`, {
        method: "POST",
        headers: { Authorization: `Bearer ${env.TURN_KEY_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ttl: 60 }),
      });
      key = res.ok ? true : `http ${res.status}`;
    } catch (e) {
      key = String(e);
    }
  }
  return json({ ok: true, turnKey: key, ...(await turnUsageStatus(env)) }, 200, headers);
}
