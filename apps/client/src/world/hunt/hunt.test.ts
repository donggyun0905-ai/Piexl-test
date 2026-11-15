// 지도 몬스터: 나고 · 쫓아오고 · 다시 남 · 장신구가 체력에 들어감 (싸움은 battle/battle.test)
import { describe, expect, it } from "vitest";
import { createWalker } from "../../lobby/walker";
import { WTILE } from "../worldMap";
import { groundById, HUNT_GROUNDS } from "./huntGrounds";
import { createHunt, stepHunt } from "./huntSim";
import { huntStats } from "./huntStats";
import { TEXT } from "../../i18n/text";
import { BOSS_GATES } from "../bossGates";
import { REGIONS } from "../worldPlaces";
import { SUB_QUESTS } from "../../progress/subQuests";
import { dailyList } from "../../progress/dailyQuests";

describe("지도 사냥", () => {
  it("사냥터 지역에 몬스터가 나고, 가까이 가면 쫓아옴(→ 본편 판), 잡힌 뒤 시간이 지나면 다시 남", () => {
    const g = groundById("slimeMeadow")!;
    const h = createHunt("ascalon", "warden");
    const me = createWalker((g.tx + 0.5) * WTILE, (g.ty + 0.5) * WTILE);
    stepHunt(h, me, 0.016, () => true);
    expect(h.mobs.filter((m) => m.st !== "dead" && m.g === g)).toHaveLength(g.count);
    const m = h.mobs[0]!;
    [m.x, m.y] = [me.x, me.y + 20];
    stepHunt(h, me, 0.016, () => true);
    expect(m.st).toBe("chase");
    [m.st, m.t] = ["dead", g.respawn];
    for (let k = 0; k < (g.respawn + 1) * 10; k++) stepHunt(h, me, 0.1, () => true);
    expect(m.st).not.toBe("dead");
  });
  it("사냥터 없는 지역은 몬스터 없음 · 표 id는 겹치지 않음", () => {
    expect(createHunt("ascalonKeep", "warden").mobs).toHaveLength(0);
    expect(new Set(HUNT_GROUNDS.map((g) => g.id)).size).toBe(HUNT_GROUNDS.length);
  });
  it("장신구 체력이 지도 체력에 들어감 (본편 계산 값)", () => {
    const base = huntStats("warden", undefined);
    const geared = huntStats("warden", { hp: 50 });
    expect(geared.maxHp).toBeGreaterThan(base.maxHp);
  });
  it("사냥터·필드 보스·최종보스 입구: 나라 필드에 있고, 표지판·입구 장소가 생기고, 이름 글자가 있음 · 몬스터 종류는 사냥터마다 다름", () => {
    const text = TEXT as Record<string, unknown>;
    for (const g of HUNT_GROUNDS) {
      expect(REGIONS[g.region]?.places.some((p) => p.id === g.id), g.id).toBe(true);
      expect(text[g.name], g.name).toBeTruthy();
      expect(g.hp > 0 && g.dmg > 0 && g.speed > 0, g.id).toBe(true);
    }
    const kinds = HUNT_GROUNDS.filter((g) => !g.boss).map((g) => g.kind);
    expect(new Set(kinds).size).toBe(kinds.length);
    expect(HUNT_GROUNDS.filter((g) => g.boss).length).toBe(12);
    for (const b of BOSS_GATES) expect(REGIONS[b.region]?.places.some((p) => p.id === `boss_${b.boss}` && p.gate === "boss"), b.boss).toBe(true);
  });
  it("서브 퀘스트 id가 겹치지 않음 · 긴급 퀘스트는 날마다 3개 (같은 날은 같은 목록)", () => {
    expect(new Set(SUB_QUESTS.map((q) => q.id)).size).toBe(SUB_QUESTS.length);
    expect(dailyList("2026-11-15")).toHaveLength(3);
    expect(dailyList("2026-11-15")).toEqual(dailyList("2026-11-15"));
  });
});

describe("들판 떠돌이 무리", () => {
  it("나라마다 시드로 같은 자리 · 길·장소 둘레는 비움 · 멀수록 셈 · 잡은 수는 원래 사냥터로", async () => {
    const { wanderPacks } = await import("./huntWander");
    const { parseMap } = await import("../worldMap");
    const { TILE_DEFS, WT } = await import("../worldTiles");
    const { REGIONS } = await import("../worldPlaces");
    const { WANDER_RULES } = await import("@pixel-rogue/shared");
    const [cols, rows] = [120, 80];
    const tiles = Array.from({ length: cols * rows }, (_, i) => (i % cols === 60 ? WT.path : WT.grass));
    const m = parseMap(tiles.flatMap((t) => [...TILE_DEFS[t]!.key, 255]), cols, rows);
    const r = { ...REGIONS.ascalon!, places: [{ id: "town", kind: "town" as const, tx: 10, ty: 10, name: REGIONS.ascalon!.places[0]!.name }], start: { tx: 10, ty: 10 } };
    const a = wanderPacks("ascalon", r, m);
    expect(a.length).toBeGreaterThan(3);
    expect(wanderPacks("ascalon", r, m)).toEqual(a);
    for (const g of a) {
      expect(g.tx).not.toBe(60);
      expect(Math.abs(g.tx - 10) + Math.abs(g.ty - 10)).toBeGreaterThanOrEqual(WANDER_RULES.SAFE_TILES);
      expect(g.from && g.id.startsWith(`${g.from}~`)).toBe(true);
    }
    const near = a.reduce((x, y) => (Math.hypot(x.tx - 10, x.ty - 10) < Math.hypot(y.tx - 10, y.ty - 10) ? x : y));
    const far = a.reduce((x, y) => (Math.hypot(x.tx - 10, x.ty - 10) > Math.hypot(y.tx - 10, y.ty - 10) ? x : y));
    if (near.from === far.from) expect(far.hp).toBeGreaterThan(near.hp);
    expect(wanderPacks("attic", { ...r, indoor: true }, m)).toEqual([]);
  });
});
