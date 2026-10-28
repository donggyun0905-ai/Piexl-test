import { describe, expect, it } from "vitest";
import { setupHub } from "./hub";
import { call, memorySql } from "./testing";

const A = "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa";
const B = "bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb";

describe("상점 저장 백업", () => {
  it("차례 번호가 맞을 때만 저장, 어긋나면 서버 값을 돌려줌", async () => {
    const ctx = setupHub(memorySql());
    expect((await call(ctx, "/api/cloud/get", { player: A })).body).toMatchObject({ rev: 0, data: null });
    const wallet = { spent: 10, owned: ["a"] };
    expect((await call(ctx, "/api/cloud/save", { player: A, base: 0, data: { wallet, nope: { x: 1 } } })).body).toMatchObject({ saved: true, rev: 1 });
    expect((await call(ctx, "/api/cloud/get", { player: A })).body).toMatchObject({ rev: 1, data: { wallet } });
    // 다른 기기가 예전 번호로 보내면 받지 않고 서버 값을 줌
    expect((await call(ctx, "/api/cloud/save", { player: A, base: 0, data: { wallet: { spent: 3 } } })).body).toMatchObject({ saved: false, rev: 1, data: { wallet } });
    expect((await call(ctx, "/api/cloud/save", { player: "x", base: 0, data: {} })).body.error).toBe("player");
  });

  it("기기 연동하면 새 기기의 예전 백업은 지움", async () => {
    const ctx = setupHub(memorySql());
    await call(ctx, "/api/cloud/save", { player: B, base: 0, data: { wallet: { spent: 1 } } });
    const made = await call(ctx, "/api/player/link/create", { player: A });
    await call(ctx, "/api/player/link/redeem", { code: made.body.code, old: B });
    expect((await call(ctx, "/api/cloud/get", { player: B })).body).toMatchObject({ rev: 0, data: null });
  });
});
