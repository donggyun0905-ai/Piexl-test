// 히든 아이템 동료(sim/allies) 움직임·판단: 사람처럼 벽·기둥·구덩이에 막히고 길을 찾아 감 · 지형(용암·가시·독가스·감전된 물) 피해 · 진흙·물에서 느려짐
// 똑똑하게: 터질 위험 표시·날아오는 적 탄을 피함 · 적 몸에 닿지 않을 거리에서 때림 · 체력이 낮으면 내 뒤로 물러남
import { inHazard } from "./hazards";
import { depth } from "./hero";
import type { AllyState } from "./hiddenTypes";
import { distanceField, walkToward } from "./layout";
import { inRect, spikeState, terrainIdle } from "./terrain";
import { TERRAIN } from "../terrainDefs";
import type { EnemyState, RunState } from "./types";
import { keepInRoom, normalize, roomGrid } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 몸 반지름 · 적 몸과 띄우는 거리 · 둘레 적을 밀어내 보는 거리 */
  r: 5,
  gap: 4,
  avoid: 10,
  /** 이 체력 비율 아래면 내 뒤로 물러남 (원거리는 물러나며 쏨) */
  lowHp: 0.35,
  /** 날아오는 적 탄을 보는 거리(px) · 이만큼 앞을 봄(틱) */
  dodgeSight: 40,
  dodgeAhead: 12,
};
export { R as ALLY_MOVE_RULES };

type Vec = [number, number];

/** 가고 싶은 자리 (적이 있으면 거리 맞추기, 없거나 다쳤으면 내 곁) */
export function allyGoal(s: RunState, a: AllyState, e: EnemyState | null, follow: Vec, shooter: boolean): Vec {
  if (!e || a.hp < a.maxHp * R.lowHp) return follow;
  const d = Math.hypot(e.x - a.x, e.y - a.y) || 1;
  const touch = e.r + R.r + R.gap;
  const want = shooter ? Math.max(touch + 10, a.range * 0.7) : Math.max(touch, Math.min(a.range * 0.8, touch + 6));
  // 너무 가까우면 적 반대쪽으로 물러남 · 멀면 그 거리까지 다가감 · 알맞으면 그대로
  if (d < want - 4) return [e.x - ((e.x - a.x) / d) * want, e.y - ((e.y - a.y) / d) * want];
  if (d > want + 2) return [e.x, e.y];
  return [a.x, a.y];
}

/** 위험: 곧 터질 표시 안이면 그 가운데 반대쪽 · 날아오는 적 탄이면 옆으로 · 적 몸에 너무 붙으면 밀려남 → 더할 방향 (없으면 null) */
function danger(s: RunState, a: AllyState): Vec | null {
  let vx = 0;
  let vy = 0;
  for (const h of s.hazards ?? []) {
    if ((h.damage <= 0 && !h.hold) || (h.tick < s.tick && !h.hold) || !inHazard(h, a.x, a.y, R.r + 3)) continue;
    const away = normalize(a.x - h.x, a.y - h.y) ?? [1, 0];
    vx += away[0] * 2;
    vy += away[1] * 2;
  }
  for (const pr of s.projectiles) {
    if (pr.fromPlayer || pr.ticksLeft <= 0) continue;
    const dx = a.x - pr.x;
    const dy = a.y - pr.y;
    if (dx * dx + dy * dy > R.dodgeSight ** 2 || dx * pr.vx + dy * pr.vy <= 0) continue;
    // 탄이 지나갈 길에서 가장 가까운 자리가 몸에 닿으면 옆으로
    const v2 = pr.vx * pr.vx + pr.vy * pr.vy || 1;
    const t = Math.min(R.dodgeAhead, (dx * pr.vx + dy * pr.vy) / v2);
    const cx = pr.x + pr.vx * t - a.x;
    const cy = pr.y + pr.vy * t - a.y;
    if (cx * cx + cy * cy > (R.r + pr.r + 3) ** 2) continue;
    const side = cx * -pr.vy + cy * pr.vx > 0 ? -1 : 1;
    const n = normalize(-pr.vy * side, pr.vx * side) ?? [0, 1];
    vx += n[0] * 1.5;
    vy += n[1] * 1.5;
  }
  for (const e of s.enemies) {
    if (e.hp <= 0 || e.air) continue;
    const dx = a.x - e.x;
    const dy = a.y - e.y;
    const near = e.r + R.r + R.avoid;
    const d2 = dx * dx + dy * dy;
    if (d2 >= near * near) continue;
    const d = Math.sqrt(d2) || 1;
    vx += (dx / d) * (1 - d / near);
    vy += (dy / d) * (1 - d / near);
  }
  return vx || vy ? normalize(vx, vy) : null;
}

/** 한 틱 움직임: 위험을 먼저 피하고, 아니면 길을 따라 목표로 · 진흙·물에서 느려짐 · 벽·기둥·구덩이에 막힘 */
export function allyStep(s: RunState, a: AllyState, tx: number, ty: number): void {
  const g = roomGrid(s);
  const body = { x: a.x, y: a.y, prevX: a.prevX, prevY: a.prevY, r: R.r };
  const far = Math.hypot(tx - a.x, ty - a.y) > 6;
  const field = g && far ? distanceField(g, tx, ty) : null;
  let mv: Vec | null = far ? (g && field ? walkToward(g, field, body, tx, ty) : normalize(tx - a.x, ty - a.y)) : null;
  const run = danger(s, a);
  if (run) mv = normalize((mv?.[0] ?? 0) * 0.6 + run[0] * 1.4, (mv?.[1] ?? 0) * 0.6 + run[1] * 1.4);
  a.moving = !!mv;
  if (!mv) return;
  const t = s.terrain?.room === s.roomId && !terrainIdle(s) ? s.terrain : undefined;
  const slow = t && t.mud.some((r) => inRect(a.x, a.y, r)) ? TERRAIN.mudSlow : t && t.water.some((r) => inRect(a.x, a.y, r)) ? TERRAIN.waterSlow : 1;
  body.x += mv[0] * a.speed * slow;
  body.y += mv[1] * a.speed * slow;
  keepInRoom(body, g);
  a.x = body.x;
  a.y = body.y;
}

/** 지형 피해 (사람과 같은 간격·세기): 용암 · 솟은 가시 · 감전된 물 · 독가스 */
export function allyTerrain(s: RunState, a: AllyState): void {
  const t = s.terrain;
  if (!t || t.room !== s.roomId || terrainIdle(s)) return;
  const d = depth(s);
  const at = (list: readonly (readonly number[])[]) => list.some((r) => inRect(a.x, a.y, r));
  if (s.tick % TERRAIN.lavaEvery === 0 && at(t.lava)) a.hp -= TERRAIN.lavaDamage + d;
  if ((t.shock ?? 0) > 0 && s.tick >= (t.shockAt ?? 0) && s.tick % TERRAIN.shockEvery === 0 && at(t.water)) a.hp -= TERRAIN.shockDamage + d;
  t.spikes.forEach((r, i) => {
    if (spikeState(s.tick, i) === 2 && (s.tick + i * 37) % 15 === 0 && inRect(a.x, a.y, r)) a.hp -= TERRAIN.spikeDamage + d;
  });
  if (s.tick % TERRAIN.gasEvery === 0 && t.gas?.some((g) => (a.x - g.x) ** 2 + (a.y - g.y) ** 2 < g.r * g.r)) a.hp -= TERRAIN.gasDamage + Math.floor(d / 2);
}
