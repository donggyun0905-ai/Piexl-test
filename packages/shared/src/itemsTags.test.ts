import { describe, expect, it } from "vitest";
import { PASSIVE_IDS } from "./items";
import { ITEM_TAGS, passiveTag, taggedPassiveIds } from "./itemsTags";

describe("패시브 꼬리표", () => {
  it("모든 패시브에 꼬리표가 하나씩 있다", () => {
    const missing = PASSIVE_IDS.filter((id) => !passiveTag(id));
    expect(missing).toEqual([]);
  });
  it("꼬리표 표에 없는 패시브 id가 없고 겹치지 않는다", () => {
    const ids = taggedPassiveIds();
    const known = new Set<string>(PASSIVE_IDS);
    expect(ids.filter((id) => !known.has(id))).toEqual([]);
    expect(ids.length).toBe(PASSIVE_IDS.length);
  });
  it("꼬리표는 15종이고 종류마다 하나 이상", () => {
    expect(ITEM_TAGS.length).toBe(15);
    for (const tag of ITEM_TAGS) expect(PASSIVE_IDS.some((id) => passiveTag(id) === tag)).toBe(true);
  });
});
