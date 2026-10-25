// 시즌 2 캐릭터 공용 도우미: 살아 있는 적 · 부채꼴·선·원 안의 적 · 맞히기 · 멈추기 · 탄 쏘기
import { ENEMIES } from "../enemyDefs";
import { damageEnemy } from "./combat";
import type { S2Rush } from "./s2Types";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, keepInRoom, normalize, roomGrid } from "./util";

/** 맞힐 수 있는 적 (상자·차례 아닌 탑 빼고) */
export const alive = (s: RunState) => s.enemies.filter((e) => e.hp > 0 && !e.svBox && !e.immune);
export const isBoss = (e: EnemyState) => ENEMIES[e.kind].boss === true;
/** 지금 방 ("층/방") */
export const roomKey = (s: RunState) => `${s.floor}/${s.roomId}`;

/** 나를 중심으로 바라보는 쪽 부채꼴 (arcCos: 1 = 한 줄, 0 = 반원, -1 = 한 바퀴) */
export function inCone(s: RunState, reach: number, arcCos: number): EnemyState[] {
  const p = s.player;
  return alive(s).filter((e) => {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.hypot(dx, dy);
    if (d > reach + e.r) return false;
    return d < e.r + p.r || (dx * p.faceX + dy * p.faceY) / d >= arcCos;
  });
}

/** 나에게서 바라보는 쪽으로 뻗은 선 (길이 len, 폭 width의 절반 안) */
export function inLine(s: RunState, len: number, width: number, dx = s.player.faceX, dy = s.player.faceY): EnemyState[] {
  const p = s.player;
  return alive(s).filter((e) => {
    const t = (e.x - p.x) * dx + (e.y - p.y) * dy;
    const off = Math.abs((e.x - p.x) * dy - (e.y - p.y) * dx);
    return t > -e.r && t < len + e.r && off < width + e.r;
  });
}

/** (x, y) 둘레 r 안 */
export function inCircle(s: RunState, x: number, y: number, r: number): EnemyState[] {
  return alive(s).filter((e) => dist2(e, { x, y }) <= (r + e.r) ** 2);
}

/** 나에게서 밀어내는 쪽으로 맞힘 (push: 더 밀침, 보스는 안 밀림) */
export function strike(s: RunState, e: EnemyState, dmg: number, push = 0): void {
  const p = s.player;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  damageEnemy(s, e, dmg, d[0], d[1]);
  if (push > 0 && !isBoss(e)) {
    e.x += d[0] * push;
    e.y += d[1] * push;
  }
}

/** 멈춤(기절) · 묶임 (보스·허수아비는 빼고) */
export function stun(e: EnemyState, ticks: number): void {
  if (!isBoss(e) && e.kind !== "dummy") e.stunTicks = Math.max(e.stunTicks ?? 0, ticks);
}
export function root(e: EnemyState, ticks: number): void {
  if (!isBoss(e)) e.rootTicks = Math.max(e.rootTicks ?? 0, ticks);
}

/** 독 (0.5초마다 per) */
export function poison(e: EnemyState, per: number, ticks: number): void {
  e.poisonTicks = Math.max(e.poisonTicks ?? 0, ticks);
  e.poisonDmg = Math.max(e.poisonDmg ?? 0, per);
}

/** 바라보는 쪽에서 a만큼 돌린 방향으로 탄 하나 (range: 날아가는 거리) */
export function shoot(s: RunState, a: number, opt: Pick<ProjectileState, "damage" | "spirit"> & Partial<Pick<ProjectileState, "r" | "pierce" | "slow">> & { range: number; speed?: number }): void {
  const p = s.player;
  const dx = p.faceX * Math.cos(a) - p.faceY * Math.sin(a);
  const dy = p.faceX * Math.sin(a) + p.faceY * Math.cos(a);
  const sp = opt.speed ?? p.stats.projectileSpeed;
  s.projectiles.push({
    id: s.nextId++,
    fromPlayer: true,
    x: p.x + dx * 5,
    y: p.y + dy * 5,
    prevX: p.x,
    prevY: p.y,
    r: opt.r ?? 2.5,
    vx: dx * sp,
    vy: dy * sp,
    damage: opt.damage,
    ticksLeft: Math.ceil(opt.range / sp),
    spirit: opt.spirit,
    ...(opt.pierce ? { pierce: opt.pierce, hitIds: [] } : {}),
    ...(opt.slow ? { slow: opt.slow } : {}),
  });
}

/** 몸으로 내달리기 시작 (변희 멧돼지 돌진 · 플라이 급습) */
export function startRush(p: PlayerState, r: Omit<S2Rush, "hit">): void {
  p.s2Rush = { ...r, hit: [] };
}

/** 내달리는 한 틱: 나아가며 닿은 적을 한 번씩 맞힘 (onHit: 맞힌 적마다 더 할 일). 끝나면 true */
export function rushTick(s: RunState, onHit?: (e: EnemyState) => void): boolean {
  const p = s.player;
  const r = p.s2Rush;
  if (!r) return true;
  r.t--;
  const ax = p.x;
  const ay = p.y;
  p.x += r.dx * r.step;
  p.y += r.dy * r.step;
  keepInRoom(p, roomGrid(s));
  if (r.invuln) p.invulnTicks = Math.max(p.invulnTicks, 2);
  // 한 틱에 멀리 가도 사이의 적을 빠뜨리지 않게 지나온 줄 전체로 맞힘
  for (const e of onSegment(s, ax, ay, p.x, p.y, p.r + 4)) {
    if (r.hit.includes(e.id)) continue;
    r.hit.push(e.id);
    strike(s, e, r.dmg, r.push);
    onHit?.(e);
  }
  addEffect(s, { kind: "streak", x: p.x - r.dx * r.step * 2, y: p.y - r.dy * r.step * 2, dirX: r.dx, dirY: r.dy, size: 4, toX: p.x, toY: p.y, maxTicks: 8, tint: r.tint });
  if (r.t > 0) return false;
  delete p.s2Rush;
  return true;
}

/** 선분 (ax,ay)→(bx,by)에서 w(+적 크기) 안의 적 */
export function onSegment(s: RunState, ax: number, ay: number, bx: number, by: number, w: number): EnemyState[] {
  const vx = bx - ax;
  const vy = by - ay;
  const l2 = vx * vx + vy * vy || 1;
  return alive(s).filter((e) => {
    const t = Math.max(0, Math.min(1, ((e.x - ax) * vx + (e.y - ay) * vy) / l2));
    return Math.hypot(e.x - ax - vx * t, e.y - ay - vy * t) <= w + e.r;
  });
}

/** 여러 발을 고르게 펼쳐 쏨 (n발, 사이 각도 spread) */
export function fan(s: RunState, n: number, spread: number, opt: Parameters<typeof shoot>[2]): void {
  for (let i = 0; i < n; i++) shoot(s, (i - (n - 1) / 2) * spread, opt);
}
