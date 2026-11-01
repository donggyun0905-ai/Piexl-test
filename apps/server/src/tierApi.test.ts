import { describe, expect, it } from "vitest";
import { routeHub, setupHub } from "./hub";
import { call, memorySql } from "./testing";

function setup() {
  const sent: string[] = [];
  const ctx = setupHub(memorySql(), () => Date.UTC(2026, 10, 1), { APP_ENV: "beta", ADMIN_LOGIN_WEBHOOK: "https://discord.test/hook" }, async (_url, body) => {
    sent.push(String((body as { content: string }).content));
    return true;
  });
  return { ctx, sent };
}

async function authed(ctx: ReturnType<typeof setup>["ctx"], path: string, session: string, body?: unknown) {
  const res = await routeHub(ctx, new Request(`https://x${path}`, { method: body === undefined ? "GET" : "POST", headers: { Authorization: `Bearer ${session}` }, body: body === undefined ? undefined : JSON.stringify(body) }));
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
}

async function login(s: ReturnType<typeof setup>): Promise<string> {
  const req = await call(s.ctx, "/api/admin/login/request", {});
  const code = /`(\w{8})`/.exec(s.sent.at(-1)!)![1]!;
  return String((await call(s.ctx, "/api/admin/login/verify", { pending: req.body.pending, code: code.toLowerCase() })).body.session);
}

const TIERS = [
  { id: "god", chars: ["tracker"] },
  { id: "meal", chars: ["warden"] },
  { id: "mid", chars: [] },
  { id: "meh", chars: ["mage"] },
  { id: "trash", chars: [] },
];

describe("티어표·티어 플레잉 기록", () => {
  it("저장 전엔 null · 관리자만 저장 · 누구나 읽음 · 잘못된 표는 거절", async () => {
    const s = setup();
    expect((await call(s.ctx, "/api/tier")).body.tiers).toBeNull();
    expect((await call(s.ctx, "/api/admin/tier", { tiers: TIERS })).status).toBe(401);
    const session = await login(s);
    expect((await authed(s.ctx, "/api/admin/tier", session, { tiers: TIERS })).body.ok).toBe(true);
    expect((await call(s.ctx, "/api/tier")).body.tiers).toEqual(TIERS);
    const twice = TIERS.map((t, i) => (i === 2 ? { ...t, chars: ["warden"] } : t));
    expect((await authed(s.ctx, "/api/admin/tier", session, { tiers: twice })).status).toBe(400);
    expect((await authed(s.ctx, "/api/admin/tier", session, { tiers: [{ id: "god", chars: ["nobody"] }] })).status).toBe(400);
  });

  it("캐릭터마다 기록 하나 (다시 하면 덮어씀)", async () => {
    const s = setup();
    const session = await login(s);
    await authed(s.ctx, "/api/admin/tierplay", session, { character: "warden", record: { deaths: 2, fun: 4 } });
    await authed(s.ctx, "/api/admin/tierplay", session, { character: "warden", record: { deaths: 1, fun: 5 } });
    const rows = (await authed(s.ctx, "/api/admin/tierplay", session)).body.records as { character: string; deaths: number }[];
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ character: "warden", deaths: 1 });
    expect((await authed(s.ctx, "/api/admin/tierplay", session, { character: "nobody", record: {} })).status).toBe(400);
  });
});
