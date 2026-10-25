import { describe, expect, it } from "vitest";
import { routeHub, setupHub } from "./hub";
import worker, { type Env } from "./index";
import { memorySql } from "./testing";

function fakeEnv(): Env {
  const ctx = setupHub(memorySql());
  const stub = { fetch: (req: Request) => routeHub(ctx, req) };
  return {
    APP_ENV: "beta",
    ALLOWED_ORIGINS: "https://develop.pixel-rogue.pages.dev",
    HUB: { idFromName: () => ({}), get: () => stub } as unknown as DurableObjectNamespace,
    BATTLE: {} as DurableObjectNamespace,
    CARDS: {} as DurableObjectNamespace,
  };
}

describe("서버 기본", () => {
  const env = fakeEnv();
  it("/health는 상태와 버전을 알려 줌", async () => {
    const res = await worker.fetch(new Request("https://x/health"), env);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; env: string };
    expect(body).toMatchObject({ ok: true, env: "beta" });
  });

  it("허용된 주소에만 CORS 허용", async () => {
    const ok = await worker.fetch(
      new Request("https://x/health", { headers: { Origin: "https://develop.pixel-rogue.pages.dev" } }),
      env,
    );
    expect(ok.headers.get("Access-Control-Allow-Origin")).toBe("https://develop.pixel-rogue.pages.dev");
    const no = await worker.fetch(new Request("https://x/health", { headers: { Origin: "https://evil.example" } }), env);
    expect(no.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("없는 주소는 404", async () => {
    const res = await worker.fetch(new Request("https://x/nope"), env);
    expect(res.status).toBe(404);
  });

  it("/api는 Hub로 전달 (CORS 붙음)", async () => {
    const res = await worker.fetch(
      new Request("https://x/api/daily/board", { headers: { Origin: "https://develop.pixel-rogue.pages.dev" } }),
      env,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://develop.pixel-rogue.pages.dev");
    expect(((await res.json()) as { entries: unknown[] }).entries).toEqual([]);
  });

  it("카드·타일 게임 빠른 시작: 같은 게임은 같은 방, 다른 게임은 다른 방", async () => {
    const post = async (game: string) => {
      const res = await worker.fetch(new Request("https://x/api/match/cards", { method: "POST", body: JSON.stringify({ game }), headers: { "Content-Type": "application/json" } }), env);
      return ((await res.json()) as { code: string; mode: string });
    };
    const a = await post("tiles");
    const b = await post("tiles");
    const c = await post("joker");
    expect(a.mode).toBe("quick");
    expect(b.code).toBe(a.code);
    expect(c.code).not.toBe(a.code);
  });
});
