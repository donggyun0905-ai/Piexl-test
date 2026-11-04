import { describe, expect, it } from "vitest";
import "../balanceTables";
import { PASSIVE_IDS } from "../items";
import { ITEM_TAGS, passiveTag, type ItemTag } from "../itemsTags";
import { awakened, awakenTick } from "./buildAwaken";
import { tier } from "./buildSets";
import { recalcStats } from "./items";
import { enemy } from "./perkTestUtil";
import { createRun } from "./run";

/** 이 꼬리표 패시브 8개 + 가까운 적 둘 (물은 패시브가 적어 같은 것을 겹쳐 가짐) */
function awake(tag: ItemTag) {
  const s = createRun(11, "warden");
  const ids = PASSIVE_IDS.filter((id) => passiveTag(id) === tag);
  for (let i = 0; i < 8; i++) s.player.passives.push(ids[i % ids.length]!);
  recalcStats(s);
  const p = s.player;
  const a = enemy(1, p.x + 30, p.y, 5000);
  const b = enemy(2, p.x + 50, p.y + 10, 5000);
  s.enemies.push(a, b);
  return { s, a, b };
}

describe("각성 증강 (꼬리표 8개)", () => {
  it("7개는 각성 아님 · 8개는 단계 4", () => {
    const { s } = awake("fire");
    expect(tier(s.player, "fire")).toBe(4);
    expect(awakened(s.player.setTiers)).toEqual(["fire"]);
    s.player.passives.pop();
    recalcStats(s);
    expect(awakened(s.player.setTiers)).toEqual([]);
  });

  for (const tag of ITEM_TAGS) {
    it(`${tag}: 적을 다치게 하고 그림을 남김`, () => {
      const { s, a, b } = awake(tag);
      let drew = false;
      for (let i = 0; i < 120; i++) {
        s.tick++;
        awakenTick(s);
        drew ||= s.effects.some((f) => f.kind === "awaken" && f.motif === tag);
      }
      expect(drew).toBe(true);
      expect(a.hp + b.hp).toBeLessThan(10000);
    });
  }
});
