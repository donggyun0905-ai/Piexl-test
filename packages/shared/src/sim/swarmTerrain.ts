// 광야의 새벽 맵 땅: 나를 돕는 미사일 타워(가까운 적에게 유도 미사일) · 진흙(느려짐) · 용암(데임). 맵 정의는 swarmMaps
import { TICK_RATE, TILE_SIZE } from "../constants";
import { swarmMapDef, SWARM_TERRAIN as T } from "../swarmMaps";
import { damagePlayer } from "./combat";
import { swarmMinutes } from "./swarmSpawn";
import type { EnemyState, RunState } from "./types";
import { dist2, normalize } from "./util";

const inRect = (x: number, y: number, [c, r, w, h]: readonly [number, number, number, number]) =>
  x >= c * TILE_SIZE && x < (c + w) * TILE_SIZE && y >= r * TILE_SIZE && y < (r + h) * TILE_SIZE;

/** 맵을 처음 놓을 때: 타워 자리 */
export function placeTowers(s: RunState): void {
  const sw = s.swarm!;
  const def = swarmMapDef(sw.map);
  if (def.towers.length) sw.towers = def.towers.map(([c, r], i) => ({ x: (c + 0.5) * TILE_SIZE, y: (r + 0.5) * TILE_SIZE, cd: 20 + i * 11 }));
}

/** 틱마다: 타워 쏘기 · 진흙에서 느려짐 · 용암에서 데임 */
export function updateTerrain(s: RunState): void {
  const sw = s.swarm!;
  const def = swarmMapDef(sw.map);
  for (const tw of sw.towers ?? []) {
    if (--tw.cd > 0) continue;
    let best: EnemyState | null = null;
    for (const e of s.enemies) if (e.hp > 0 && !e.svBox && dist2(e, tw) < T.towerRange ** 2 && (!best || dist2(e, tw) < dist2(best, tw))) best = e;
    if (!best) {
      tw.cd = 10;
      continue;
    }
    tw.cd = T.towerEvery;
    const d = normalize(best.x - tw.x, best.y - tw.y) ?? [1, 0];
    s.projectiles.push({
      id: s.nextId++,
      fromPlayer: true,
      x: tw.x,
      y: tw.y - 10,
      prevX: tw.x,
      prevY: tw.y - 10,
      r: 3,
      vx: d[0] * T.missileSpeed,
      vy: d[1] * T.missileSpeed,
      damage: T.towerDamage * (1 + 0.15 * swarmMinutes(s)),
      ticksLeft: Math.ceil((T.towerRange * 1.4) / T.missileSpeed),
      homing: true,
      blast: T.towerBlast,
      splash: 1,
      ghost: true,
      spirit: "fireball",
      tint: "#ff8a3a",
    });
  }
  const p = s.player;
  // 진흙: 이번 틱 움직인 만큼을 줄임
  if (def.mud.some((m) => inRect(p.x, p.y, m)) && p.dashTicks === 0) {
    p.x = p.prevX + (p.x - p.prevX) * T.mudSlow;
    p.y = p.prevY + (p.y - p.prevY) * T.mudSlow;
  }
  if (s.tick % (TICK_RATE / 2) === 0 && def.lava.some((l) => inRect(p.x, p.y, l))) {
    p.invulnTicks = 0;
    damagePlayer(s, T.lavaDamage * (1 + 0.1 * swarmMinutes(s)));
  }
}
