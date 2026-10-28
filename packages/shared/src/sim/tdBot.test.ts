// 타워 디펜스 밸런스 확인: 단순한 봇(길 가까운 자리에 캐릭터를 돌아가며 세우고 남는 돈으로 레벨)이 쉬운 맵은 깸
import { describe, expect, it } from "vitest";
import { CHARACTER_IDS } from "../content";
import { createTd, startRound, stepTd } from "./td";
import { canBuild, mapTiles, nextUpgrade, placeTower, towerCost, upgradeCost, upgradeTower } from "./tdTowers";
import { mapPaths, pathPoint } from "./tdWaves";
import type { TdMapId } from "../tdMaps";
import type { TdState } from "./tdTypes";
import { charFree, repairCost, repairTower } from "./tdHealth";

/** 길이 가장 많이 지나가는 빈 칸 */
function bestSpot(td: TdState): [number, number] | null {
  const pts = mapPaths(td.mapId).flatMap((line) => Array.from({ length: Math.floor(line.len / 4) }, (_, i) => pathPoint(line, i * 4)));
  const tiles = mapTiles(td.mapId);
  let best: [number, number] | null = null;
  let bestScore = -1;
  for (let r = 1; r < tiles.length - 1; r++) {
    for (let c = 1; c < tiles[0]!.length - 1; c++) {
      if (!canBuild(td, c, r)) continue;
      const x = (c + 0.5) * 16;
      const y = (r + 0.5) * 16;
      const score = pts.filter(([px, py]) => (px - x) ** 2 + (py - y) ** 2 < 40 * 40).length;
      if (score > bestScore) [best, bestScore] = [[c, r], score];
    }
  }
  return best;
}

function botPlay(mapId: TdMapId, seed: number): TdState {
  const td = createTd(seed, mapId);
  let k = 0;
  for (let tick = 0; tick < 60 * 60 * 30 && td.phase !== "won" && td.phase !== "lost"; tick++) {
    if (td.phase === "build" || (td.phase === "break" && td.breakTicks < 600)) startRound(td);
    if (tick % 20 === 0) {
      // 반 넘게 깎인 타워는 먼저 수리
      const broken = td.towers.find((t) => t.hp < t.maxHp * 0.5 && td.run.gold >= repairCost(t));
      if (broken) repairTower(td, broken.id);
      const ups = td.towers.filter((t) => nextUpgrade(td, t).kind !== "max").sort((a, b) => upgradeCost(a) - upgradeCost(b));
      if (td.towers.length < Math.min(16, 3 + Math.floor(td.round * 0.7)) && td.run.gold >= towerCost(td)) {
        const spot = bestSpot(td);
        // 캐릭터마다 하나만 (부서져 재건축 중인 캐릭터는 건너뜀)
        const n = CHARACTER_IDS.length;
        let c: (typeof CHARACTER_IDS)[number] | undefined;
        for (let j = 0; j < n && !c; j++) {
          const id = CHARACTER_IDS[(k + j) % n]!;
          if (charFree(td, id)) [c, k] = [id, k + j + 1];
        }
        if (spot && c) placeTower(td, c, ...spot);
      } else if (ups[0] && td.run.gold >= upgradeCost(ups[0])) {
        const up = nextUpgrade(td, ups[0]);
        // 무기는 타워마다 아무거나 (처음 하는 사람처럼), 패시브는 첫 후보
        if (up.kind !== "max") upgradeTower(td, ups[0].id, up.options[up.kind === "passive" ? 0 : (ups[0].id * 3) % up.options.length]!);
      }
    }
    stepTd(td);
  }
  return td;
}

describe("타워 디펜스 밸런스 (봇)", () => {
  it("단순한 봇도 초록 들판을 20라운드까지 막음", () => {
    const td = botPlay("meadow", 7);
    expect(td.phase).toBe("won");
    expect(td.round).toBe(20);
  }, 60000);
});
