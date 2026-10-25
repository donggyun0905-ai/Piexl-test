import { afterEach, describe, expect, it, vi } from "vitest";
import { TURN_STOP_GB, turnUsageOk } from "./turnUsage";

const env = { CF_ACCOUNT_ID: "acc", CF_ANALYTICS_TOKEN: "tok" };
const usage = (bytes: number) =>
  vi.fn(async () => Response.json({ data: { viewer: { accounts: [{ callsTurnUsageAdaptiveGroups: [{ sum: { egressBytes: bytes / 2, ingressBytes: bytes / 2 } }] }] } } }));

afterEach(() => vi.unstubAllGlobals());

describe("중계 실제 사용량 안전장치", () => {
  it("통계 설정이 없으면 막지 않음 (횟수 한도만)", async () => {
    expect(await turnUsageOk({})).toBe(true);
  });
  it("이번 달 사용량이 한도 아래면 내주고, 넘으면 막음", async () => {
    vi.stubGlobal("fetch", usage((TURN_STOP_GB - 1) * 1e9));
    expect(await turnUsageOk(env)).toBe(true);
    vi.stubGlobal("fetch", usage(TURN_STOP_GB * 1e9));
    expect(await turnUsageOk(env)).toBe(false);
  });
  it("통계를 못 읽으면 안전하게 막음", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("no", { status: 403 })));
    expect(await turnUsageOk(env)).toBe(false);
  });
});
