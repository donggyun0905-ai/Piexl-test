import { describe, expect, it } from "vitest";
import { setupHub } from "./hub";
import { call, memorySql } from "./testing";

const A = "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa";
const B = "bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb";

describe("플레이어 (가입 없음)", () => {
  it("처음엔 빈 정보, 저장하면 닉네임·해금이 남고 해금은 합쳐서 늘어남", async () => {
    const ctx = setupHub(memorySql());
    expect((await call(ctx, "/api/player/profile", { player: A })).body).toMatchObject({ nickname: "", unlocks: [] });
    await call(ctx, "/api/player/save", { player: A, nickname: "Hero", unlocks: ["firstBoss", "nope"] });
    const res = await call(ctx, "/api/player/save", { player: A, unlocks: ["rich"] });
    expect(res.body).toMatchObject({ nickname: "Hero", unlocks: ["firstBoss", "rich"] });
    expect((await call(ctx, "/api/player/profile", { player: "short" })).body.error).toBe("player");
  });

  it("금칙어 닉네임은 Player로", async () => {
    const ctx = setupHub(memorySql());
    expect((await call(ctx, "/api/player/save", { player: A, nickname: "fuck you" })).body.nickname).toBe("Player");
  });

  it("기기 연동: 코드로 다른 기기의 ID·정보를 받고, 코드는 한 번만", async () => {
    let t = 1_000_000;
    const ctx = setupHub(memorySql(), () => t);
    await call(ctx, "/api/player/save", { player: A, nickname: "Hero", unlocks: ["floor4"] });
    await call(ctx, "/api/player/save", { player: B, nickname: "Old" });
    const made = await call(ctx, "/api/player/link/create", { player: A });
    expect(String(made.body.code)).toMatch(/^\d{6}$/);
    const got = await call(ctx, "/api/player/link/redeem", { code: made.body.code, old: B });
    expect(got.body).toMatchObject({ player: A, nickname: "Hero", unlocks: ["floor4"] });
    // 예전 기기 정보는 지워짐
    expect((await call(ctx, "/api/player/profile", { player: B })).body.nickname).toBe("");
    expect((await call(ctx, "/api/player/link/redeem", { code: made.body.code })).body.error).toBe("bad_code");
    // 5분 지나면 못 씀
    const late = await call(ctx, "/api/player/link/create", { player: A });
    t += 5 * 60_000 + 1;
    expect((await call(ctx, "/api/player/link/redeem", { code: late.body.code })).body.error).toBe("bad_code");
  });

  it("코드 맞히기는 1분에 10번까지", async () => {
    const ctx = setupHub(memorySql());
    for (let i = 0; i < 10; i++) await call(ctx, "/api/player/link/redeem", { code: "000000" });
    expect((await call(ctx, "/api/player/link/redeem", { code: "000000" })).status).toBe(429);
  });
});
