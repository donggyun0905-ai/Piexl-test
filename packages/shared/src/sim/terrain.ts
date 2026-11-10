// 던전 지형: 층 보스에 맞게 전투방·강한 적 방·보스방에 진흙(느려짐) · 용암(데임) · 얕은 물(조금 느려짐, 감전되면 데임) · 가시 함정(주기적으로 솟음).
// 방에 들어갈 때 층·방 번호 시드로 정함 (화면·서버 같음). 사람만 영향 (적은 그대로). 수치는 terrainDefs
import { TILE_SIZE, ROOM_COLS, ROOM_ROWS, SHAPE_DX, SHAPE_DY } from "../constants";
import { tileRuns } from "../customMaps";
import { bossForFloor, type BossKind } from "../content";
import { createRng, deriveSeed } from "../rng";
import { TERRAIN, TERRAIN_BY_BOSS, type TerrainKind } from "../terrainDefs";
import { envDamage } from "./combat";
import { depth } from "./hero";
import { shapeGrid, tileAt, TILE_FLOOR } from "./layout";
import { eachSeat } from "./party";
import { statusImmune } from "./remnant";
import { tickFoeStatus } from "./foeStatus";
import type { TerrainRect, TerrainState } from "./terrainTypes";
import type { RunState } from "./types";

const KINDS: readonly TerrainKind[] = ["mud", "lava", "water", "spikes"];

/** 지형이 생기는 판인지 (보통 던전·무한·협동. 레이드·영웅의 길·아레나·패왕전·광야·타워 디펜스는 없음) */
function terrainRun(s: RunState): boolean {
  return !s.arenaLv && !s.raidBoss && !s.hero && !s.pvp && !s.swarm && !s.lastBoss && s.floor <= 6;
}

/** 함정(가시·용암)에 다침: 피해 + 판 기록 (캐릭터 해금 '함정에 1000번') */
function trap(s: RunState, dmg: number): void {
  envDamage(s, dmg);
  s.trapHits = (s.trapHits ?? 0) + 1;
}

export const inRect = (x: number, y: number, [rx, ry, w, h]: readonly number[]): boolean => x >= rx! && x < rx! + w! && y >= ry! && y < ry! + h!;

/** 방에 들어갈 때: 지형 정하기 (없으면 undefined) */
export function makeTerrain(s: RunState, roomId: number, boss?: BossKind): TerrainState | undefined {
  const info = s.map.rooms[roomId];
  if (!info || !terrainRun(s) || !["combat", "elite", "exit"].includes(info.type)) return undefined;
  if (info.shape.rows) return terrainFromRows(roomId, info.shape.rows);
  const kind = boss ?? bossForFloor(s.floor, s.seed);
  const plan = TERRAIN_BY_BOSS[kind];
  if (!plan) return undefined;
  const rng = createRng(deriveSeed(s.seed, "terrain", s.floor, roomId));
  const g = shapeGrid(info.shape);
  const t: TerrainState = { room: roomId, mud: [], lava: [], water: [], spikes: [] };
  const taken: TerrainRect[] = [];
  const mid = Math.floor(ROOM_COLS / 2);
  for (const k of KINDS) {
    for (let n = 0; n < (plan[k] ?? 0); n++) {
      for (let tries = 0; tries < 24; tries++) {
        const w = rng.int(TERRAIN.minW, TERRAIN.maxW);
        const h = rng.int(TERRAIN.minH, TERRAIN.maxH);
        // 위 출구 앞 두 줄 · 아래 입구 세 줄 · 가운데 세 칸 길은 비움
        const c = rng.int(1, ROOM_COLS - 1 - w);
        const r = rng.int(3, ROOM_ROWS - 4 - h);
        if (c + w > mid - 1 && c < mid + 2) continue;
        let ok = true;
        for (let y = r; y < r + h && ok; y++) for (let x = c; x < c + w && ok; x++) if (g && tileAt(g, x, y) !== TILE_FLOOR) ok = false;
        const rect: TerrainRect = [c * TILE_SIZE, r * TILE_SIZE, w * TILE_SIZE, h * TILE_SIZE];
        if (!ok || taken.some((o) => rect[0] < o[0] + o[2] + TILE_SIZE && o[0] < rect[0] + rect[2] + TILE_SIZE && rect[1] < o[1] + o[3] + TILE_SIZE && o[1] < rect[1] + rect[3] + TILE_SIZE)) continue;
        taken.push(rect);
        t[k].push(rect);
        break;
      }
    }
  }
  return t;
}

/** 관리자가 만든 방 틀의 지형 칸 (w 얕은 물 · m 진흙 · l 용암 · x 가시 함정). 틀은 방 안쪽(테두리 다음 칸)부터, 큰 방이면 가운데로 밀림 */
export function terrainFromRows(roomId: number, rows: readonly string[]): TerrainState {
  const px = (ch: string): TerrainRect[] =>
    tileRuns(rows, ch).map(([c, r, w, h]) => [(c + 1 + SHAPE_DX) * TILE_SIZE, (r + 1 + SHAPE_DY) * TILE_SIZE, w * TILE_SIZE, h * TILE_SIZE]);
  return { room: roomId, mud: px("m"), lava: px("l"), water: px("w"), spikes: px("x") };
}

/** 가시 함정 상태: 0 들어감 · 1 예고(솟기 직전) · 2 솟음. 함정마다 때가 조금씩 다름 */
export function spikeState(tick: number, i: number): 0 | 1 | 2 {
  const ph = (tick + i * 37) % TERRAIN.spikeCycle;
  const up = TERRAIN.spikeCycle - TERRAIN.spikeUp;
  return ph >= up ? 2 : ph >= up - TERRAIN.spikeWarn ? 1 : 0;
}

/** 방의 적을 다 잡으면 지형은 멈춤 (느려짐·피해·감전·독가스 없음, 가시는 들어간 채) · 패왕전 경기장 지형은 늘 움직임 */
export const terrainIdle = (s: RunState): boolean => !s.pvp && !!s.rooms[s.roomId]?.cleared;

/** 틱마다 (플레이어가 움직인 뒤): 진흙·물에서 느려짐 · 용암 · 가시 · 감전된 물 */
export function updateTerrain(s: RunState): void {
  // 치유감소·독·적이 건 상태이상(foeStatus)은 방을 나가도·방을 정리해도 끝까지 (독은 0.5초마다 피해)
  eachSeat(s, () => {
    const p = s.player;
    const hurt = tickFoeStatus(p, depth(s));
    if (hurt > 0) envDamage(s, hurt);
    if ((p.corrode ?? 0) > 0) p.corrode = (p.corrode ?? 0) - 1;
    if ((p.poison ?? 0) > 0) {
      p.poison = (p.poison ?? 0) - 1;
      if (p.poison % TERRAIN.gasEvery === 0) envDamage(s, TERRAIN.gasDamage + Math.floor(depth(s) / 2));
    }
  }, !!s.party);
  const t = s.terrain;
  if (!t || t.room !== s.roomId) return;
  if (terrainIdle(s)) {
    t.gas = undefined;
    t.shock = 0;
    return;
  }
  if (t.gas?.length) t.gas = t.gas.filter((g) => g.until > s.tick);
  if ((t.shock ?? 0) > 0) t.shock = (t.shock ?? 0) - 1;
  const d = depth(s);
  eachSeat(
    s,
    () => {
      const p = s.player;
      const at = (list: readonly TerrainRect[]) => list.some((r) => inRect(p.x, p.y, r));
      if (p.dashTicks === 0) {
        const slow = at(t.mud) ? TERRAIN.mudSlow : at(t.water) ? TERRAIN.waterSlow : 1;
        if (slow < 1) {
          p.x = p.prevX + (p.x - p.prevX) * slow;
          p.y = p.prevY + (p.y - p.prevY) * slow;
        }
      }
      if (s.tick % TERRAIN.lavaEvery === 0 && at(t.lava)) trap(s, TERRAIN.lavaDamage + d);
      if ((t.shock ?? 0) > 0 && s.tick >= (t.shockAt ?? 0) && s.tick % TERRAIN.shockEvery === 0 && at(t.water)) envDamage(s, TERRAIN.shockDamage + d);
      // 독가스를 밟으면: 치유감소 + 독 상태이상 3초 (밟고 있는 동안 계속 새로)
      if (t.gas?.some((g) => (p.x - g.x) ** 2 + (p.y - g.y) ** 2 < g.r * g.r)) {
        p.corrode = TERRAIN.corrodeTicks;
        if (!statusImmune(p)) p.poison = Math.max(p.poison ?? 0, TERRAIN.poisonTicks);
      }
      t.spikes.forEach((r, i) => {
        if (spikeState(s.tick, i) === 2 && (s.tick + i * 37) % 15 === 0 && inRect(p.x, p.y, r)) trap(s, TERRAIN.spikeDamage + d);
      });
    },
    !!s.party,
  );
}
