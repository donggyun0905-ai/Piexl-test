// 들판을 떠도는 몬스터 무리 (C안 2단계, 수치 shared sim/fieldWander WANDER_RULES): 지도를 받은 뒤 지역 시드로 자리를 정함
// 종류 = 그 나라 사냥터 몬스터(보스 빼고) · 마을·장소 둘레·길 위는 비움 · 처음 자리에서 멀수록 셈 · 무리 하나 = 작은 사냥터 하나(옛 지도 전투 계산을 그대로 씀)
import { createRng, deriveSeed, WANDER_RULES as R, wanderMul } from "@pixel-rogue/shared";
import { TILE_DEFS, WT } from "../worldTiles";
import { tileAt, type WorldMap } from "../worldMap";
import type { Region } from "../worldPlaces";
import { groundsIn, type HuntGround } from "./huntGrounds";

/** 둘레를 비워 둘 장소 (장식은 뺌) */
const SAFE = new Set(["town", "door", "npc", "warp", "pass", "dungeon", "sign", "exit"]);
const open = (t: number) => TILE_DEFS[t]?.solid === false && t !== WT.path && t !== WT.bridge;

export function wanderPacks(regionId: string, region: Region, m: WorldMap): HuntGround[] {
  const grounds = groundsIn(regionId);
  const kinds = grounds.filter((g) => !g.boss && !g.from);
  if (!kinds.length || region.indoor) return [];
  const rng = createRng(deriveSeed(11, "wander", regionId));
  const safe = region.places.filter((p) => SAFE.has(p.kind)).map((p) => [p.tx, p.ty] as const);
  // 걸을 수 있는 빈 땅 (사냥터 원 안 빼고)
  const spots: [number, number][] = [];
  for (let y = 2; y < m.rows - 2; y++)
    for (let x = 2; x < m.cols - 2; x++) {
      if (!open(tileAt(m, x, y))) continue;
      if (safe.some(([a, b]) => Math.abs(a - x) + Math.abs(b - y) < R.SAFE_TILES)) continue;
      if (grounds.some((g) => Math.hypot(g.tx - x, g.ty - y) < g.rad + R.PACK_RAD)) continue;
      spots.push([x, y]);
    }
  const want = Math.round((spots.length / 1000) * R.PACKS_PER_1000);
  const far = Math.max(1, ...spots.map(([x, y]) => Math.hypot(x - region.start.tx, y - region.start.ty)));
  const out: HuntGround[] = [];
  for (let tries = 0; out.length < want && tries < want * 20 && spots.length; tries++) {
    const [x, y] = spots[rng.int(0, spots.length - 1)]!;
    if (out.some((g) => Math.hypot(g.tx - x, g.ty - y) < R.PACK_GAP)) continue;
    const base = kinds[rng.int(0, kinds.length - 1)]!;
    const k = wanderMul(Math.hypot(x - region.start.tx, y - region.start.ty) / far);
    out.push({
      ...base,
      id: `${base.id}~${out.length}`,
      from: base.id,
      tx: x,
      ty: y,
      rad: R.PACK_RAD,
      count: rng.int(R.PACK_MIN, R.PACK_MAX),
      respawn: R.RESPAWN,
      hp: Math.round(base.hp * k),
      dmg: Math.round(base.dmg * k),
      power: Math.round((base.power * k) / 100) * 100,
    });
  }
  return out;
}
