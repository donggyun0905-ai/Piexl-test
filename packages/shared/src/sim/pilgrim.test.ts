import { describe, expect, it } from "vitest";
import { HIDDEN_STOCK } from "../itemsHidden";
import { usePool } from "./loot";
import { extraOf } from "./baseStats";
import { damageEnemy, removeDead } from "./combat";
import { recalcStats } from "./items";
import { enemy } from "./perkTestUtil";
import { meetPilgrim, pilgrimRoom, pilgrimTick } from "./pilgrim";
import { createRun } from "./run";
import { startFloor } from "./rooms";
import { hiddenUse } from "./hiddenUse";
import type { RunState } from "./types";

/** 순례자가 나오는 시드·층 찾기 */
function withPilgrim(): RunState {
  for (let seed = 1; seed < 400; seed++) {
    const s = createRun(seed, "warden");
    s.pilgrim = true;
    startFloor(s, 2);
    if (pilgrimRoom(s) >= 0) return s;
  }
  throw new Error("없음");
}

describe("차원의 순례자 · 히든 아이템", () => {
  it("켜진 판에서만 가끔 나오고 (8%쯤), 그 방은 몬스터가 없음", () => {
    let n = 0;
    for (let seed = 1; seed <= 500; seed++) {
      const s = createRun(seed, "warden");
      expect(pilgrimRoom(s)).toBe(-1);
      s.pilgrim = true;
      // 1층에는 안 나옴 (돈이 없어 못 삼)
      expect(pilgrimRoom(s)).toBe(-1);
      startFloor(s, 2);
      if (pilgrimRoom(s) >= 0) n++;
    }
    expect(n).toBeGreaterThan(15);
    expect(n).toBeLessThan(80);
    const s = withPilgrim();
    expect(s.map.rooms[pilgrimRoom(s)]!.type).toBe("combat");
  });

  it("걸어와서 가운데 오면 히든 물건 3개를 골드로 진열 · 보통 사용 아이템 목록에는 없음", () => {
    const s = withPilgrim();
    s.roomId = pilgrimRoom(s);
    s.rooms[s.roomId] = { visited: true, cleared: true, pickups: [], enemies: [] };
    meetPilgrim(s, s.roomId);
    pilgrimTick(s);
    expect(s.rooms[s.roomId]!.pickups).toHaveLength(0);
    s.tick += 200;
    pilgrimTick(s);
    const pk = s.rooms[s.roomId]!.pickups;
    expect(pk).toHaveLength(3);
    for (const p of pk) {
      expect(p.price).toBeGreaterThan(100);
      expect(HIDDEN_STOCK.some((x) => x.id === p.itemId)).toBe(true);
    }
    pilgrimTick(s);
    expect(s.rooms[s.roomId]!.pickups).toHaveLength(3);
    expect(usePool(s).some((id) => id === "aetherBomb")).toBe(false);
  });

  it("금기된 아티팩트: 처치마다 쌓여 능력치가 오름", () => {
    const s = createRun(1, "warden");
    s.player.passives = ["relicRed", "relicSilver", "relicGreen"];
    recalcStats(s);
    const dmg = s.player.stats.damage;
    for (let i = 0; i < 50; i++) {
      s.enemies = [enemy(i, s.player.x + 10, s.player.y, 1)];
      damageEnemy(s, s.enemies[0]!, 10, 1, 0);
      removeDead(s);
    }
    expect(s.player.relics).toMatchObject({ relicRed: 50, relicSilver: 50, relicGreen: 50 });
    expect(s.player.stats.damage).toBeCloseTo(dmg + 1);
    expect(extraOf(s.player).defense).toBeCloseTo(1);
    expect(extraOf(s.player).regen).toBeCloseTo(5);
  });

  it("에테르 폭탄은 폭탄보다 세고 · 차원이동문은 다음 층으로", () => {
    const s = createRun(1, "warden");
    s.enemies = [enemy(1, s.player.x + 30, s.player.y, 500)];
    hiddenUse(s, "aetherBomb", 0);
    expect(s.enemies[0]!.hp).toBeLessThanOrEqual(500 - 135);
    hiddenUse(s, "dimensionGate", 0);
    expect(s.floor).toBe(2);
  });
});
