// 지도 전투(C안): 지도 조각 → 방 틀 · 본편 계산으로 슬라임을 잡으면 끝남
import { describe, expect, it } from "vitest";
import { setRoomSize, ROOM_COLS } from "@pixel-rogue/shared";
import { parseMap, WTILE } from "../worldMap";
import { TILE_DEFS, WT } from "../worldTiles";
import { HUNT_GROUNDS } from "../hunt/huntGrounds";
import type { Mob } from "../hunt/huntSim";
import { BATTLE_COLS, BATTLE_ROWS, sliceRoom } from "./battleRoom";
import { newPad, readPad } from "./battleInput";
import { battleResult, startBattle, stepBattle } from "./fieldBattle";

const rgba = (keys: number[]) => keys.flatMap((t) => [...TILE_DEFS[t]!.key, 255]);

describe("지도 전투 (본편 판)", () => {
  it("조각: 나무는 벽 · 물은 구덩이 · 지도 끝에서는 안쪽으로", () => {
    const tiles = new Array(40 * 30).fill(WT.grass);
    tiles[5 * 40 + 3] = WT.tree;
    tiles[5 * 40 + 4] = WT.water;
    const m = parseMap(rgba(tiles), 40, 30);
    const r = sliceRoom(m, 2, 2);
    expect([r.ox, r.oy, r.cols, r.rows]).toEqual([0, 0, BATTLE_COLS, BATTLE_ROWS]);
    expect(r.shape).toHaveLength(BATTLE_ROWS - 1);
    expect(r.shape[4]![2]).toBe("#");
    expect(r.shape[4]![3]).toBe("~");
    expect(r.shape[0]![0]).toBe(".");
    expect(sliceRoom(m, 39, 29).ox).toBe(40 - BATTLE_COLS);
  });
  it("슬라임 셋을 본편 계산으로 잡으면 won · 잡은 수만큼 onKill · 끝나면 방 크기를 되돌릴 수 있음", () => {
    const m = parseMap(rgba(new Array(40 * 30).fill(WT.grass)), 40, 30);
    const room = sliceRoom(m, 20, 15);
    const g = HUNT_GROUNDS.find((x) => x.id === "slimeMeadow")!;
    const me: [number, number] = [20 * WTILE, 15 * WTILE];
    const mobs = [-30, 0, 30].map((dx): Mob => ({ g, x: me[0] + dx, y: me[1] - 40, hp: g.hp, st: "chase", t: 0, cd: 0, wx: 0, wy: 0, left: false, flash: 0 }));
    const b = startBattle(room, "warden", 1, me, 1, mobs, g.power);
    expect(b.run.enemies).toHaveLength(3);
    const pad = newPad();
    pad.attack = true;
    let kills = 0;
    let end = null;
    for (let i = 0; i < 60 * 40 && !end; i++) {
      const p = b.run.player;
      const foe = b.run.enemies[0];
      end = stepBattle(b, 1000 / 60, () => readPad(pad, new Set(), foe ? [foe.x - p.x, foe.y - p.y] : [0, -1]), () => kills++, () => {});
    }
    expect(end).toBe("won");
    expect(kills).toBe(3);
    expect(battleResult(b).alive).toHaveLength(0);
    setRoomSize();
    expect(ROOM_COLS).not.toBe(BATTLE_COLS);
  });
  it("사냥터 24곳·필드 보스 12곳 몬스터 모두 본편 판에서 10초 돌아감 (오류 없음)", () => {
    const m = parseMap(rgba(new Array(40 * 30).fill(WT.grass)), 40, 30);
    const room = sliceRoom(m, 20, 15);
    const me: [number, number] = [20 * WTILE, 17 * WTILE];
    for (const g of HUNT_GROUNDS) {
      const mob: Mob = { g, x: me[0], y: me[1] - 60, hp: g.hp, st: "chase", t: 0, cd: 0, wx: 0, wy: 0, left: false, flash: 0 };
      const b = startBattle(room, "warden", 3, me, 1, [mob], g.power);
      const pad = newPad();
      pad.attack = true;
      let end = null;
      for (let i = 0; i < 600 && !end; i++) end = stepBattle(b, 1000 / 60, () => readPad(pad, new Set(), [0, -1]), () => {}, () => {});
      expect(b.run.player.x, g.id).toBeGreaterThan(0);
    }
    setRoomSize();
  });
});

