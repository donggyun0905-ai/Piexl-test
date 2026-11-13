// 생성기 파일을 글자로 읽음 (vite ?raw)
import py from "../../../../scripts/art/world_map.py?raw";
import { describe, expect, it } from "vitest";
import { chunksInView, CHUNK } from "./worldChunks";
import { canStandWorld, parseMap, tileAt, WTILE } from "./worldMap";
import { REGIONS } from "./worldPlaces";
import { TILE_DEFS, tileFromRgb, WT } from "./worldTiles";

const rgba = (keys: number[]) => keys.flatMap((t) => [...TILE_DEFS[t]!.key, 255]);

describe("세계 지도", () => {
  it("지도 그림 생성기 색표가 땅 종류 표와 같음", () => {
    for (const [name, id] of Object.entries(WT)) {
      if (name === "none") continue;
      const m = py.match(new RegExp(`"${name}": \\((\\d+), (\\d+), (\\d+)\\)`));
      expect(m, name).not.toBeNull();
      expect(tileFromRgb(+m![1]!, +m![2]!, +m![3]!)).toBe(id);
    }
  });
  it("픽셀 → 칸 · 지도 밖·나무·벽은 막힘", () => {
    const m = parseMap(rgba([WT.grass, WT.tree, WT.path, WT.wall]), 2, 2);
    expect(tileAt(m, 0, 0)).toBe(WT.grass);
    expect(tileAt(m, 1, 1)).toBe(WT.wall);
    expect(tileAt(m, 5, 0)).toBe(WT.none);
    expect(canStandWorld(m, WTILE * 0.5, WTILE * 0.5, 5)).toBe(true);
    expect(canStandWorld(m, WTILE * 1.5, WTILE * 0.5, 5)).toBe(false);
    expect(canStandWorld(m, -4, 4, 5)).toBe(false);
  });
  it("보이는 영역에 걸친 덩어리만", () => {
    const m = parseMap(rgba(new Array(100 * 70).fill(WT.grass)), 100, 70);
    expect(chunksInView(m, { x: 0, y: 0, w: 300, h: 180 })).toEqual([[0, 0]]);
    const edge = CHUNK * WTILE - 10;
    expect(chunksInView(m, { x: edge, y: edge, w: 300, h: 180 })).toHaveLength(4);
    expect(chunksInView(m, { x: 99999, y: 0, w: 300, h: 180 })).toEqual([]);
  });
  it("장소는 지도 안", () => {
    for (const r of Object.values(REGIONS)) for (const p of r!.places) expect(p.tx >= 0 && p.ty >= 0).toBe(true);
  });
});
