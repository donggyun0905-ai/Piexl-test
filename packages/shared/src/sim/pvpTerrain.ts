// 패왕전 경기장 지형: 맵의 진흙·용암·얕은 물·가시를 던전 지형(s.terrain)으로 깔아 같은 그림을 씀 · 틱마다 느려짐·피해 (패왕전 수치)
import { TILE_SIZE } from "../constants";
import { PW } from "../paewangDefs";
import type { PwArenaDef } from "../paewangMapKit";
import { TERRAIN } from "../terrainDefs";
import { damagePlayer } from "./combat";
import { eachSeat } from "./party";
import { inPlay } from "./pvpWorld";
import { spikeState } from "./terrain";
import type { TerrainRect, TerrainState } from "./terrainTypes";
import type { RunState } from "./types";

/** 칸 네모 → 픽셀 네모 */
const px = (list: PwArenaDef["mud"]): TerrainRect[] => (list ?? []).map(([c, r, w, h]) => [c * TILE_SIZE, r * TILE_SIZE, w * TILE_SIZE, h * TILE_SIZE]);

/** 경기장 지형 (없으면 undefined) */
export function arenaTerrain(a: PwArenaDef): TerrainState | undefined {
  if (!a.mud?.length && !a.lava?.length && !a.water?.length && !a.spikes?.length) return undefined;
  return { room: 0, mud: px(a.mud), lava: px(a.lava), water: px(a.water), spikes: px(a.spikes) };
}

/** 사람마다: 진흙·물에서 느려짐 · 용암 피해 · 솟은 가시 피해 (지형 피해는 받는 피해 줄임과 따로) */
export function updatePvpTerrain(s: RunState): void {
  const t = s.terrain;
  if (!t) return;
  eachSeat(s, (i) => {
    if (!inPlay(s, i)) return;
    const p = s.player;
    const at = (list: readonly TerrainRect[]) => list.some((r) => p.x >= r[0] && p.x < r[0] + r[2] && p.y >= r[1] && p.y < r[1] + r[3]);
    if (p.dashTicks === 0) {
      const slow = at(t.mud) ? TERRAIN.mudSlow : at(t.water) ? TERRAIN.waterSlow : 1;
      if (slow < 1) {
        p.x = p.prevX + (p.x - p.prevX) * slow;
        p.y = p.prevY + (p.y - p.prevY) * slow;
      }
    }
    if (s.tick % TERRAIN.lavaEvery === 0 && at(t.lava)) damagePlayer(s, PW.lavaDmg);
    t.spikes.forEach((r, k) => {
      if (spikeState(s.tick, k) === 2 && (s.tick + k * 37) % 15 === 0 && at([r])) damagePlayer(s, PW.spikeDmg);
    });
  });
}
