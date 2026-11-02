import { blankMap } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { routeHub, setupHub } from "./hub";
import { call, memorySql } from "./testing";

function setup() {
  const sent: string[] = [];
  const ctx = setupHub(memorySql(), () => Date.UTC(2026, 9, 26), { APP_ENV: "test", ADMIN_LOGIN_WEBHOOK: "https://discord.test/hook" }, async (_url, body) => {
    sent.push(String((body as { content: string }).content));
    return true;
  });
  return { ctx, sent };
}

describe("직접 만든 맵", () => {
  it("관리자만 저장하고 누구나 받음 (틀린 맵은 버림)", async () => {
    const s = setup();
    expect((await call(s.ctx, "/api/maps")).body.maps).toEqual([]);
    const req = await call(s.ctx, "/api/admin/login/request", {});
    const code = /`(\w{8})`/.exec(s.sent.at(-1)!)![1]!;
    const session = String((await call(s.ctx, "/api/admin/login/verify", { pending: req.body.pending, code: code.toLowerCase() })).body.session);
    const room = blankMap("room", "pond", "연못 방");
    room.tiles[3] = "...~~~m~~~...";
    const res = await routeHub(
      s.ctx,
      new Request("https://x/api/admin/maps", { method: "POST", headers: { Authorization: `Bearer ${session}` }, body: JSON.stringify({ maps: [room, { id: "BAD", kind: "room", tiles: [] }] }) }),
    );
    expect(res.status).toBe(200);
    const maps = (await call(s.ctx, "/api/maps")).body.maps as { id: string; tiles: string[] }[];
    expect(maps.map((m) => m.id)).toEqual(["pond"]);
    expect(maps[0]!.tiles[3]).toBe("...~~~m~~~...");
    // 로그인 없이는 저장 안 됨
    const no = await routeHub(s.ctx, new Request("https://x/api/admin/maps", { method: "POST", body: JSON.stringify({ maps: [] }) }));
    expect(no.status).toBe(401);
  });
});
