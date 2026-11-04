import { describe, expect, it } from "vitest";
import "../balanceTables";
import { BUILD_SETS as B } from "../buildSetDefs";
import { PASSIVE_IDS, type PassiveId } from "../items";
import { passiveTag, type ItemTag } from "../itemsTags";
import { altarOf } from "./altar";
import { extraOf } from "./baseStats";
import { setDmgMul, tagCounts, tier } from "./buildSets";
import { setKill, setOnHit } from "./buildSetFx";
import { recalcStats } from "./items";
import { enemy } from "./perkTestUtil";
import { goThrough, startFloor } from "./rooms";
import { createRun, stepSim } from "./run";
import { menuCode } from "./station";
import { ALTAR_OP } from "./altar";
import { EMPTY_INPUT, type RunState } from "./types";

/** 이 꼬리표 패시브 n개 */
const of = (tag: ItemTag, n: number): PassiveId[] => PASSIVE_IDS.filter((id) => passiveTag(id) === tag).slice(0, n);

function withTags(tag: ItemTag, n: number): RunState {
  const s = createRun(7, "warden");
  s.player.passives.push(...of(tag, n));
  recalcStats(s);
  return s;
}

describe("빌드 세트 효과", () => {
  it("같은 꼬리표 2·4·6개마다 단계가 오름", () => {
    expect(tier(withTags("fire", 1).player, "fire")).toBe(0);
    expect(tier(withTags("fire", 2).player, "fire")).toBe(1);
    expect(tier(withTags("fire", 5).player, "fire")).toBe(2);
    expect(tier(withTags("fire", 6).player, "fire")).toBe(3);
  });

  it("단단함 2·4: 방어력·피해 감소 · 날카로움 2: 치명타 확률", () => {
    const base = extraOf(createRun(7, "warden").player);
    const s = withTags("tough", 4);
    expect(extraOf(s.player).defense).toBeCloseTo(base.defense + B.tough.def2);
    expect(extraOf(s.player).reduction).toBeCloseTo(base.reduction + B.tough.cut4);
    expect(extraOf(withTags("sharp", 2).player).critChance).toBeCloseTo(base.critChance + B.sharp.crit2);
  });

  it("빛 6: 체력이 가득하면 피해 + · 죽음 2: 체력 낮은 적에게 피해 +", () => {
    const s = withTags("light", 6);
    const e = enemy(1, 200, 200);
    s.player.hp = s.player.stats.maxHp;
    expect(setDmgMul(s, e)).toBeCloseTo(1 + B.light.full6);
    const d = withTags("death", 2);
    const low = enemy(2, 200, 200, 100);
    low.hp = 10;
    expect(setDmgMul(d, low)).toBeCloseTo(1 + B.death.dmg2);
  });

  it("불 4: 화상 걸린 적이 쓰러지면 둘레 적이 다침", () => {
    const s = withTags("fire", 4);
    const dead = enemy(1, 200, 200, 100);
    const near = enemy(2, 210, 200, 1000);
    s.enemies.push(dead, near);
    dead.burnTicks = 60;
    dead.hp = 0;
    setKill(s, dead);
    expect(near.hp).toBeLessThan(1000);
  });

  it("얼음 6: 같은 적을 잇따라 3번 맞히면 빙결", () => {
    const s = withTags("ice", 6);
    const e = enemy(1, 200, 200);
    s.enemies.push(e);
    for (let i = 0; i < B.ice.hits6; i++) setOnHit(s, e, 10);
    expect(e.stunTicks).toBeGreaterThan(0);
  });

  it("꼬리표 없는 판은 아무것도 바뀌지 않음", () => {
    const s = createRun(7, "warden");
    recalcStats(s);
    expect(setDmgMul(s, enemy(1, 0, 0))).toBe(1);
    expect(Object.values(tagCounts(s.player)).every((n) => n === 0)).toBe(true);
  });

  it("제단 증강: 성좌 꼬리표 둘이 각각 +1 · 알 수 없는 성좌는 행운 + 고른 꼬리표", () => {
    const seen = new Set<string>();
    for (let seed = 1; seed < 60 && seen.size < 2; seed++) {
      const s = createRun(seed, "warden");
      s.player.passives.push("sturdyHeart", "ironSkin", "whetstone", "lightGloves");
      startFloor(s, 3);
      const room = s.map.rooms.find((r) => r.type === "altar")!;
      const id = altarOf(s, room.id);
      if (id !== "whale" && id !== "unknown") continue;
      if (seen.has(id)) continue;
      const from = s.map.rooms.find((r) => r.exits.includes(room.id))!;
      s.roomId = from.id;
      s.rooms[from.id]!.cleared = true;
      goThrough(s, from.exits.indexOf(room.id));
      const before = tagCounts(s.player);
      // 알 수 없는 성좌: 독(4번째 꼬리표)을 고름
      stepSim(s, { ...EMPTY_INPUT, menu: menuCode(ALTAR_OP, 1, 4) });
      const after = tagCounts(s.player);
      seen.add(id);
      // 증강이 붙은 패시브는 남고 둘을 바치므로, 성좌 꼬리표만 비교 (바친 패시브 꼬리표는 줄 수 있음)
      const kept = s.player.augments![0]!.passive;
      expect(s.player.passives).toContain(kept);
      if (id === "whale") {
        expect(after.water).toBeGreaterThanOrEqual(before.water + 1);
        expect(after.ice).toBeGreaterThanOrEqual(1);
      } else {
        expect(after.luck).toBeGreaterThanOrEqual(1);
        expect(after.poison).toBeGreaterThanOrEqual(1);
      }
    }
    expect(seen.size).toBe(2);
  });
});
