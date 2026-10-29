import { describe, expect, it } from "vitest";
import { CHARACTER_IDS } from "../content";
import { TD_RULES, tdPassivePool } from "../tdDefs";
import { TD_MAPS, TD_PATH, tdTiles } from "../tdMaps";
import { createTd, startRound, stepTd } from "./td";
import { canBuild, mapTiles, nextUpgrade, placeTower, sellTower, towerCost, upgradeTower } from "./tdTowers";
import { mapPaths } from "./tdWaves";
import type { TdState } from "./tdTypes";

/** 길 바로 옆 빈 칸 하나 (위·아래·옆이 길) */
function spotNearPath(td: TdState, skip = 0): [number, number] {
  const tiles = mapTiles(td.mapId);
  let n = 0;
  for (let r = 1; r < tiles.length - 1; r++) {
    for (let c = 1; c < tiles[0]!.length - 1; c++) {
      const near = [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dc, dr]) => tiles[r + dr!]![c + dc!] === TD_PATH);
      if (near && canBuild(td, c, r) && n++ === skip) return [c, r];
    }
  }
  throw new Error("no spot");
}

function runTicks(td: TdState, n: number): void {
  for (let i = 0; i < n; i++) stepTd(td);
}

describe("타워 디펜스", () => {
  it("맵 8개: 길은 테두리에서 들어오고 길이가 있음", () => {
    expect(TD_MAPS).toHaveLength(8);
    for (const m of TD_MAPS) {
      const tiles = tdTiles(m);
      for (const p of m.paths) expect(tiles[p[0]![1]]![p[0]![0]]).toBe(TD_PATH);
      for (const line of mapPaths(m.id)) expect(line.len).toBeGreaterThan(300);
    }
  });

  it("모든 캐릭터가 타워로 서서 적에게 피해를 줌", () => {
    for (const c of CHARACTER_IDS) {
      const td = createTd(7, "meadow");
      const [col, row] = spotNearPath(td, 3);
      expect(placeTower(td, c, col, row)).toBe(true);
      startRound(td);
      runTicks(td, 60 * 40);
      const t = td.towers[0]!;
      expect(t.dmg, c).toBeGreaterThan(0);
      // 타워는 제자리
      expect(t.atk[0]!.p.x).toBe((col + 0.5) * 16);
    }
  });

  it("레벨: 무기 → 패시브(공용·자기 직업) → 두 번째 무기 → 만렙", () => {
    const td = createTd(3, "desert");
    const [col, row] = spotNearPath(td);
    placeTower(td, "drifter", col, row);
    const t = td.towers[0]!;
    td.run.gold = 1e6;
    let up = nextUpgrade(td, t);
    expect(up.kind).toBe("weapon");
    if (up.kind === "weapon") upgradeTower(td, t.id, up.options[1]!);
    const perks = tdPassivePool("drifter").length;
    for (let i = 0; i < perks; i++) {
      up = nextUpgrade(td, t);
      expect(up.kind).toBe("passive");
      if (up.kind === "passive") upgradeTower(td, t.id, up.options[0]!);
    }
    up = nextUpgrade(td, t);
    expect(up.kind).toBe("second");
    if (up.kind === "second") upgradeTower(td, t.id, up.options[0]!);
    expect(t.atk).toHaveLength(2);
    expect(nextUpgrade(td, t).kind).toBe("max");
    expect(t.level).toBe(perks + 3);
    // 체력·회복·대시 아이템은 없음
    expect(tdPassivePool("warden")).not.toContain("lifeLeech");
    expect(tdPassivePool("warden")).not.toContain("sturdyHeart");
    expect(tdPassivePool("warden")).toContain("whetstone");
  });

  it("돈: 세우기·팔기", () => {
    const td = createTd(1, "meadow");
    const [col, row] = spotNearPath(td);
    const cost = towerCost(td);
    placeTower(td, "mage", col, row);
    expect(td.run.gold).toBe(TD_RULES.startGold - cost);
    expect(placeTower(td, "mage", col, row)).toBe(false);
    sellTower(td, td.towers[0]!.id);
    expect(td.towers).toHaveLength(0);
    expect(td.run.gold).toBe(TD_RULES.startGold - cost + Math.floor(cost * 0.7));
  });

  it("타워 없이 두면 적이 빠져나가 목숨을 잃음 · 같은 시드면 같은 결과", () => {
    const play = () => {
      const td = createTd(11, "swamp");
      placeTower(td, "gunner", ...spotNearPath(td, 2));
      startRound(td);
      runTicks(td, 60 * 60);
      return [td.lives, td.run.gold, td.run.kills, td.phase];
    };
    const a = play();
    expect(a).toEqual(play());
    const td = createTd(11, "volcano");
    startRound(td);
    runTicks(td, 60 * 90);
    expect(td.lives).toBeLessThan(20);
  });
});
