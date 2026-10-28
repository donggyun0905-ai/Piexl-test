import { describe, expect, it } from "vitest";
import { TD_RULES } from "../tdDefs";
import { createTd } from "./td";
import { charFree, finalQuake, hitTowers, rebuildLeft, repairCost, repairTower } from "./tdHealth";
import { canBuild, mapTiles, placeTower, tileCenter } from "./tdTowers";
import { spawnTd } from "./tdWaves";

/** 세울 수 있는 칸 n개 */
function spots(td: ReturnType<typeof createTd>, n: number): [number, number][] {
  const out: [number, number][] = [];
  const tiles = mapTiles(td.mapId);
  for (let r = 0; r < tiles.length && out.length < n; r++) for (let c = 0; c < tiles[0]!.length && out.length < n; c++) if (canBuild(td, c, r)) out.push([c, r]);
  return out;
}

describe("타워 디펜스 타워 체력", () => {
  it("캐릭터마다 타워 하나 · 적이 가까운 타워를 때림 · 수리 · 부서지면 재건축 중엔 못 세움", () => {
    const td = createTd(1, "meadow");
    td.run.gold = 1e6;
    const [a, b] = spots(td, 2);
    expect(placeTower(td, "warden", ...a!)).toBe(true);
    expect(placeTower(td, "warden", ...b!)).toBe(false);
    const t = td.towers[0]!;
    expect(t.hp).toBe(TD_RULES.towerHp);
    const e = spawnTd(td, "slime", 0, 1);
    [e.x, e.y] = [tileCenter(t.col) + 4, tileCenter(t.row)];
    hitTowers(td);
    expect(t.hp).toBeLessThan(t.maxHp);
    expect(repairCost(t)).toBeGreaterThan(0);
    expect(repairTower(td, t.id)).toBe(true);
    expect(t.hp).toBe(t.maxHp);
    // 최종 보스 파동 · 부서짐
    finalQuake(td, 0, 0);
    expect(t.hp).toBeCloseTo(t.maxHp * (1 - TD_RULES.finalQuake));
    t.hp = 1;
    e.tdHitCd = 0;
    hitTowers(td);
    expect(td.towers).toHaveLength(0);
    expect(rebuildLeft(td, "warden")).toBe(TD_RULES.rebuildSec);
    expect(charFree(td, "warden")).toBe(false);
    expect(placeTower(td, "warden", ...a!)).toBe(false);
    td.run.tick += TD_RULES.rebuildSec * 60;
    expect(placeTower(td, "warden", ...a!)).toBe(true);
  });
});
