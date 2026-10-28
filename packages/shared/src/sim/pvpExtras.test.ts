import { describe, expect, it } from "vitest";
import { PW } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { TILE_SIZE } from "../constants";
import { TILE_FLOOR } from "./layout";
import { pwGrid } from "./paewangGrid";
import { allPlayers } from "./party";
import { createPvp, stepPvp } from "./pvp";
import { EMPTY_INPUT } from "./types";

const still = [EMPTY_INPUT, EMPTY_INPUT];

describe("패왕전 경기장 물건·시작", () => {
  it("시작 3초는 아무도 못 움직이고 처음 보호막은 없음", () => {
    const s = createPvp(5, "duel", [{ characterId: "warden" }, { characterId: "drifter" }]);
    const p = allPlayers(s)[0]!;
    expect(p.shieldPts ?? 0).toBe(0);
    const x = p.x;
    for (let i = 0; i < PW.ready; i++) stepPvp(s, [{ ...EMPTY_INPUT, moveX: 100 }, EMPTY_INPUT]);
    expect(allPlayers(s)[0]!.x).toBe(x);
    stepPvp(s, [{ ...EMPTY_INPUT, moveX: 100 }, EMPTY_INPUT]);
    expect(allPlayers(s)[0]!.x).toBeGreaterThan(x);
  });

  it("얼음 시계: 누른 곳으로 날아가 범위 안 상대를 얼림 (내 편·나는 안 얼음)", () => {
    const s = createPvp(5, "duel", [{ characterId: "warden" }, { characterId: "drifter" }]);
    s.tick = PW.ready;
    const [me, foe] = allPlayers(s);
    me!.useSlots = ["frost", null];
    foe!.x = me!.x + 96;
    foe!.y = me!.y;
    // 오른쪽 96px (거리 단계 8 × 12)
    stepPvp(s, [{ ...EMPTY_INPUT, useSlot: 1, aimX: 800, aimY: 0 }, EMPTY_INPUT]);
    for (let i = 0; i < PW.iceFly + 1; i++) stepPvp(s, still);
    expect(s.pvp!.seats[1]!.stun).toBeGreaterThan(0);
    expect(s.pvp!.seats[0]!.stun).toBe(0);
    expect(s.freezeTicks).toBe(0);
  });

  it("모든 모드에서 바닥에 사용 아이템·강화 구슬이 떨어지고(막힌 칸 아님), 구슬을 주우면 효과", () => {
    const s = createPvp(9, "trio", [{ characterId: "warden" }]);
    const def = PW_ARENAS[s.pvp!.arena];
    const grid = pwGrid(s.pvp!.arena);
    s.tick = PW.ready;
    for (const p of allPlayers(s)) p.hp = p.stats.maxHp = 1e9;
    let seen = 0;
    for (let i = 0; i < PW.dropEvery * 6; i++) {
      for (const p of allPlayers(s)) p.hp = p.stats.maxHp;
      stepPvp(s, [EMPTY_INPUT]);
      seen = Math.max(seen, (s.pvp!.orbs?.length ?? 0) + s.rooms[s.roomId]!.pickups.length);
    }
    expect(seen).toBeGreaterThan(0);
    const spots = [...(s.pvp!.orbs ?? []), ...s.rooms[s.roomId]!.pickups];
    for (const o of spots) expect(grid[Math.floor(o.y / TILE_SIZE) * def.cols + Math.floor(o.x / TILE_SIZE)]).toBe(TILE_FLOOR);
    // 이동 속도 구슬을 내 발밑에
    const me = allPlayers(s)[0]!;
    s.pvp!.orbs = [{ id: 1, kind: 2, x: me.x, y: me.y }];
    stepPvp(s, [EMPTY_INPUT]);
    expect(s.pvp!.orbs.length).toBe(0);
    expect(allPlayers(s)[0]!.pwFast).toBeGreaterThan(0);
  });
});
