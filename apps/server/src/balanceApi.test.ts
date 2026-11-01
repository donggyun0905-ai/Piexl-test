import {
  applyBalance,
  CHARACTERS,
  createRng,
  createRun,
  EMPTY_INPUT,
  packInputs,
  parseSeed,
  stepSim,
  summarize,
  type TickInput,
} from "@pixel-rogue/shared";
import { afterEach, describe, expect, it } from "vitest";
import { routeHub, setupHub } from "./hub";
import { call, drainReplays, memorySql } from "./testing";

afterEach(() => {
  applyBalance({});
});

function setup(webhook = "https://discord.test/hook") {
  let t = Date.UTC(2026, 9, 21, 3, 0, 0);
  const sent: string[] = [];
  const ctx = setupHub(memorySql(), () => t, { APP_ENV: "beta", ADMIN_LOGIN_WEBHOOK: webhook }, async (_url, body) => {
    sent.push(String((body as { content: string }).content));
    return true;
  });
  return { ctx, sent, later: (ms: number) => (t += ms) };
}

async function authed(ctx: ReturnType<typeof setup>["ctx"], path: string, session: string, body?: unknown) {
  const res = await routeHub(
    ctx,
    new Request(`https://x${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { Authorization: `Bearer ${session}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  );
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
}

async function login(s: ReturnType<typeof setup>): Promise<string> {
  const req = await call(s.ctx, "/api/admin/login/request", {});
  const code = /`(\w{8})`/.exec(s.sent.at(-1)!)![1]!;
  const res = await call(s.ctx, "/api/admin/login/verify", { pending: req.body.pending, code: code.toLowerCase() });
  return String(res.body.session);
}

describe("관리자 로그인", () => {
  it("웹훅이 없으면 꺼짐", async () => {
    const s = setup("");
    expect((await call(s.ctx, "/api/admin/login/request", {})).status).toBe(503);
  });

  it("디스코드로 받은 코드로 로그인, 틀린 코드·잦은 요청은 거절", async () => {
    const s = setup();
    const req = await call(s.ctx, "/api/admin/login/request", {});
    expect(s.sent[0]).toContain("[beta]");
    expect((await call(s.ctx, "/api/admin/login/request", {})).body.error).toBe("wait");
    const bad = await call(s.ctx, "/api/admin/login/verify", { pending: req.body.pending, code: "AAAA-AAAA" });
    expect(bad.status).toBe(401);
    s.later(31_000);
    const session = await login(s);
    expect((await authed(s.ctx, "/api/admin/check", session)).body.ok).toBe(true);
    expect((await authed(s.ctx, "/api/admin/check", "1.bad")).status).toBe(401);
    s.later(13 * 60 * 60_000);
    expect((await authed(s.ctx, "/api/admin/check", session)).status).toBe(401);
  });
});

describe("게임 수치 저장", () => {
  it("로그인해야 저장, 저장하면 지금 수치·지문으로 찾기 가능, 기록 남음", async () => {
    const s = setup();
    expect((await call(s.ctx, "/api/admin/balance", { values: {} })).status).toBe(401);
    const session = await login(s);
    const saved = await authed(s.ctx, "/api/admin/balance", session, {
      values: { characters: { warden: { maxHp: 150 } } },
      note: "파수꾼 체력",
    });
    const hash = String(saved.body.hash);
    expect(hash).toHaveLength(8);
    const now = await call(s.ctx, "/api/balance");
    expect(now.body).toMatchObject({ hash, values: { characters: { warden: { maxHp: 150 } } } });
    // 처음 값으로 돌려도 예전 지문은 남아 있음
    await authed(s.ctx, "/api/admin/balance", session, { values: {} });
    expect((await call(s.ctx, "/api/balance")).body.hash).toBe("default");
    expect((await call(s.ctx, `/api/balance?v=${hash}`)).body.values).toEqual({ characters: { warden: { maxHp: 150 } } });
    expect((await call(s.ctx, "/api/balance?v=zzzz")).status).toBe(404);
    const log = await authed(s.ctx, "/api/admin/history", session);
    expect((log.body.entries as { note: string }[]).map((e) => e.note)).toEqual(["", "파수꾼 체력"]);
    // 서버 쪽 게임 표는 건드리지 않음
    expect(CHARACTERS.warden.maxHp).toBe(120);
  });
  it("타워 디펜스 수치는 따로 저장 (던전 수치·기록과 섞이지 않음)", async () => {
    const s = setup();
    const session = await login(s);
    await authed(s.ctx, "/api/admin/balance", session, { values: { characters: { warden: { maxHp: 150 } } }, note: "던전" });
    const td = await authed(s.ctx, "/api/admin/balance?set=td", session, { values: { tdRules: { rules: { startGold: 500 } }, characters: { warden: { maxHp: 1 } } }, note: "TD 돈" });
    // 타워 디펜스 세트에 없는 묶음(던전 캐릭터)은 버려짐
    expect(td.body.values).toEqual({ tdRules: { rules: { startGold: 500 } } });
    expect((await call(s.ctx, "/api/balance?set=td")).body.values).toEqual({ tdRules: { rules: { startGold: 500 } } });
    expect((await call(s.ctx, "/api/balance")).body.values).toEqual({ characters: { warden: { maxHp: 150 } } });
    const log = await authed(s.ctx, "/api/admin/history?set=td", session);
    expect((log.body.entries as { note: string }[]).map((e) => e.note)).toEqual(["TD 돈"]);
  });
  it("패왕전 수치(?set=pw)도 따로 저장 (역할군 옮기기 포함)", async () => {
    const s = setup();
    const session = await login(s);
    const pw = await authed(s.ctx, "/api/admin/balance?set=pw", session, { values: { pwRoles: { warden: { role: 4 } }, pwChars: { mage: { hp: 1.2 } }, tdRules: { rules: { startGold: 1 } } }, note: "패왕전" });
    expect(pw.body.values).toEqual({ pwRoles: { warden: { role: 4 } }, pwChars: { mage: { hp: 1.2 } } });
    expect((await call(s.ctx, "/api/balance?set=pw")).body.values).toEqual({ pwRoles: { warden: { role: 4 } }, pwChars: { mage: { hp: 1.2 } } });
    expect((await call(s.ctx, "/api/balance")).body.values).toEqual({});
  });
});

describe("일일 도전 기록은 그 판의 수치로 확인", () => {
  it("수치 지문을 함께 내면 그 수치로 다시 돌림", async () => {
    const s = setup();
    const session = await login(s);
    // 적을 잡으면 받는 돈을 크게: 처음 값으로 검사하면 '돈이 너무 많음'
    const values = { rules: { LOOT_RULES: { gold: 999 } } };
    const hash = String((await authed(s.ctx, "/api/admin/balance", session, { values })).body.hash);
    // 시드를 고정 (처치가 나오는 시드)
    s.ctx.dailySalt = btoa("pixel-rogue-balance-test-salt-01");
    const player = "runner00-0000-4000-8000-000000000000";
    const start = await call(s.ctx, "/api/daily/start", { player });
    applyBalance(values);
    const run = createRun(parseSeed(String(start.body.seedText)), "warden");
    const rng = createRng(1);
    const inputs: TickInput[] = [];
    let cur = EMPTY_INPUT;
    while (!run.over && run.tick < 3600) {
      if (run.tick % 30 === 0) cur = { ...EMPTY_INPUT, moveX: rng.int(-100, 100), moveY: rng.int(-100, 100), autoAim: true };
      inputs.push(cur);
      stepSim(run, cur);
    }
    applyBalance({});
    expect(run.kills).toBeGreaterThan(0);
    const body = { player, ticket: start.body.ticket, summary: summarize(run), inputs: await packInputs(inputs) };
    s.later(80_000);
    expect((await call(s.ctx, "/api/daily/submit", body)).body.error).toBe("check:gold");
    expect((await call(s.ctx, "/api/daily/submit", { ...body, balance: "nope" })).body.error).toBe("balance");
    const ok = await call(s.ctx, "/api/daily/submit", { ...body, balance: hash });
    expect(ok.body).toMatchObject({ ok: true, improved: true });
    await drainReplays(s.ctx);
    expect((await call(s.ctx, "/api/daily/board")).body.entries).toMatchObject([{ verified: true }]);
  });
});
