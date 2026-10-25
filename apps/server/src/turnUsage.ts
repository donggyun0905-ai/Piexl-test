// 협동 중계(TURN) 안전장치 2: 이번 달 실제로 쓴 양(GB)을 Cloudflare 통계에서 읽어 와서 한도 근처면 중계를 더 내주지 않음.
// 비밀 값 CF_ACCOUNT_ID·CF_ANALYTICS_TOKEN(권한: Account Analytics 읽기)이 있을 때만. 없으면 횟수 한도(turnBudget)만 씀.
// 통계는 10분 동안 저장해 두고 씀 (요청 수 줄이기). 통계를 못 읽으면 안전하게 중계를 내주지 않음

export interface UsageEnv {
  CF_ACCOUNT_ID?: string;
  CF_ANALYTICS_TOKEN?: string;
}

/** 이만큼 쓰면 멈춤 (무료 1,000GB. 이미 내준 연결이 최대 3시간 더 쓸 수 있어 여유를 둠) */
export const TURN_STOP_GB = 900;
const CACHE_SECONDS = 600;

const QUERY = `query($account: string!, $from: Date!, $to: Date!) {
  viewer { accounts(filter: { accountTag: $account }) {
    callsTurnUsageAdaptiveGroups(filter: { date_geq: $from, date_leq: $to }, limit: 1) { sum { egressBytes ingressBytes } }
  } }
}`;

/** 이번 달(UTC) 중계로 오간 양, GB (나가는 양 + 들어오는 양을 모두 셈) */
async function fetchUsageGB(env: Required<UsageEnv>, now: Date): Promise<number> {
  const from = `${now.toISOString().slice(0, 7)}-01`;
  const to = now.toISOString().slice(0, 10);
  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.CF_ANALYTICS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { account: env.CF_ACCOUNT_ID, from, to } }),
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  type Row = { sum?: { egressBytes?: number; ingressBytes?: number } };
  const data = (await res.json()) as { data?: { viewer?: { accounts?: { callsTurnUsageAdaptiveGroups?: Row[] }[] } }; errors?: unknown[] };
  if (data.errors?.length) throw new Error(`graphql ${JSON.stringify(data.errors).slice(0, 250)}`);
  const rows = data.data?.viewer?.accounts?.[0]?.callsTurnUsageAdaptiveGroups ?? [];
  const bytes = rows.reduce((n, r) => n + (r.sum?.egressBytes ?? 0) + (r.sum?.ingressBytes ?? 0), 0);
  return bytes / 1e9;
}

/** 상태 보기용: 통계 설정 여부와 이번 달 사용량(GB) 또는 읽기 실패 이유 */
export async function turnUsageStatus(env: UsageEnv, now = new Date()): Promise<{ analytics: boolean; usageGB?: number; error?: string }> {
  if (!env.CF_ACCOUNT_ID || !env.CF_ANALYTICS_TOKEN) return { analytics: false };
  try {
    return { analytics: true, usageGB: Math.round((await fetchUsageGB(env as Required<UsageEnv>, now)) * 1000) / 1000 };
  } catch (e) {
    return { analytics: true, error: String(e instanceof Error ? e.message : e).slice(0, 300) };
  }
}

/** 실제 사용량이 한도 아래면 true. 통계 설정이 없으면 true (횟수 한도만), 읽기 실패면 false */
export async function turnUsageOk(env: UsageEnv, now = new Date()): Promise<boolean> {
  if (!env.CF_ACCOUNT_ID || !env.CF_ANALYTICS_TOKEN) return true;
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  const key = new Request(`https://turn-usage.internal/${now.toISOString().slice(0, 7)}`);
  let gb: number;
  const hit = await cache?.match(key);
  if (hit) gb = Number(await hit.text());
  else {
    try {
      gb = await fetchUsageGB(env as Required<UsageEnv>, now);
    } catch {
      return false;
    }
    await cache?.put(key, new Response(String(gb), { headers: { "Cache-Control": `max-age=${CACHE_SECONDS}` } }));
  }
  return gb < TURN_STOP_GB;
}
