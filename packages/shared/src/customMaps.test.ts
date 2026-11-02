import { afterEach, describe, expect, it } from "vitest";
import { blankMap, cleanMaps, customMaps, setCustomMaps } from "./customMaps";
import { tdFromTiles } from "./customMapUse";
import { createRng } from "./rng";
import { CUSTOM_SWARM, swarmMapDef } from "./swarmMaps";
import { CUSTOM_TD, tdMapDef, tdTiles, TD_DECOR } from "./tdMaps";
import { createRun, practiceShape, useCustomRooms } from "./sim/index";
import { generateFloor } from "./sim/floor";
import { pickShape, shapeGrid, TILE_PILLAR } from "./sim/layout";

const ROOM = [".............", ".............", "...o..mm.....", "...o..ll.....", "......ww.....", "......xx.....", "............."];

afterEach(() => setCustomMaps([]));

describe("관리자가 만든 맵", () => {
  it("크기·이름표가 틀린 맵은 버리고, 그 종류에 없는 칸은 바닥으로", () => {
    const td = blankMap("td", "t1", "길");
    td.tiles[1] = "#" + td.tiles[1]!.slice(1);
    const out = cleanMaps([td, { ...blankMap("room", "BAD ID", "x") }, { id: "r1", kind: "room", name: "a", tiles: ["."] }]);
    expect(out).toHaveLength(1);
    expect(out[0]!.tiles[1]![0]).toBe(".");
  });

  it("방 틀이 없으면 방 모양 고르기는 예전과 같고, 있으면 섞여 나옴", () => {
    for (let i = 0; i < 20; i++) expect(pickShape(createRng(i), [])).toEqual(pickShape(createRng(i)));
    expect(generateFloor(7, 2)).toEqual(generateFloor(7, 2, []));
    const picks = Array.from({ length: 200 }, (_, i) => pickShape(createRng(i), [ROOM]));
    const mine = picks.find((p) => p.rows);
    expect(mine?.id).toBe(-2);
    const g = shapeGrid(mine!)!;
    expect(g.includes(TILE_PILLAR)).toBe(true);
    expect(g.filter((t) => t === TILE_PILLAR)).toHaveLength(2);
  });

  it("혼자 하기 판에 방 틀을 넣으면 첫 층부터 쓰이고, 연습장은 지금 방을 그 틀(지형 포함)로", () => {
    setCustomMaps([{ ...blankMap("room", "r1", "방"), tiles: ROOM }]);
    expect(customMaps("room")).toHaveLength(1);
    const run = createRun(5, "warden");
    useCustomRooms(run);
    expect(run.customRooms).toHaveLength(1);
    const p = createRun(9, "warden");
    practiceShape(p, ROOM);
    expect(p.map.rooms[p.roomId]!.shape.rows).toBe(ROOM);
    expect(p.terrain?.mud).toHaveLength(1);
    expect(p.terrain?.lava[0]![2]).toBe(32);
    expect(p.terrain?.water).toHaveLength(1);
    expect(p.terrain?.spikes).toHaveLength(1);
    practiceShape(p, null);
    expect(p.terrain).toBeUndefined();
  });

  it("광야의 새벽·타워 디펜스 맵으로 바뀌어 목록에 들어감", () => {
    const sw = blankMap("swarm", "s1", "늪");
    sw.tiles[3] = "...####" + sw.tiles[3]!.slice(7);
    sw.tiles[5] = ".T" + sw.tiles[5]!.slice(2);
    const td = blankMap("td", "t1", "외길");
    td.tiles[4] = "pppppppppg" + td.tiles[4]!.slice(10);
    td.tiles[2] = "....o" + td.tiles[2]!.slice(5);
    setCustomMaps([sw, td, blankMap("td", "t2", "길 없음")]);
    expect(CUSTOM_SWARM.get("c-s1")?.name).toBe("늪");
    expect(swarmMapDef("c-s1").walls).toEqual([[3, 3, 4, 1]]);
    expect(swarmMapDef("c-s1").towers).toEqual([[1, 5]]);
    expect(swarmMapDef("c-none")).toBe(swarmMapDef("plains"));
    expect(CUSTOM_TD).toHaveLength(1);
    const def = tdMapDef("c-t1");
    expect(def.paths).toEqual([[[0, 4], [9, 4]]]);
    expect(tdTiles(def)[2]![4]).toBe(TD_DECOR);
    expect(tdFromTiles("t2", "x", blankMap("td", "t2", "x").tiles)).toBeNull();
  });
});
