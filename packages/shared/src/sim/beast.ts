// 야수 본인 공격: 할퀴기 · 덮치기 · 털실(벽에 튕김) · 헤어볼(끈적) · 캣닢 구름 · 방울 · 고양이 낮잠. 고양이는 pets
import { TICK_RATE } from "../constants";
import { ENEMIES } from "../content";
import { TIGER } from "../weaponsBeast";
import { lunge } from "./brawlMoves";
import { damageEnemy, healPlayer } from "./combat";
import { instinct, updatePets } from "./pets";
import type { EnemyState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 덮치기: 뛰어드는 최대 거리 · 털실 튕김 횟수 · 캣닢 구름(0.5초마다 6번, 범위) · 방울 기절 · 낮잠(1초 뒤 초당 1 회복) */
  POUNCE_LEAP: 40,
  YARN_BOUNCES: 3,
  CATNIP_PULSES: 6,
  CATNIP_EVERY: 30,
  BELL_STUN: 30,
  NAP_TICKS: 60,
  NAP_HEAL: 1,
};
export { R as BEAST_RULES };

export const CATNIP_RADIUS = 26;

/** 틱마다 (야수 무기를 들었을 때 player에서) */
export function beastTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  updatePets(s);
  // 호랑이 변신이 끝남: 추가 체력이 남아 있으면 체력이 가득 참 (다 깎였으면 깎인 체력 그대로)
  if ((p.tigerTicks ?? 0) > 0 && --p.tigerTicks! === 0) {
    const left = Math.min(p.shieldPts ?? 0, TIGER.hp);
    p.shieldPts = (p.shieldPts ?? 0) - left;
    if (left > 0) p.hp = p.stats.maxHp;
  }
  // 고양이 낮잠: 가만히 있으면 조금씩 회복
  if (hasPerk(p, "catNap") && p.stillTicks >= R.NAP_TICKS) healPlayer(s, R.NAP_HEAL / TICK_RATE);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  const w = weaponOf(p);
  const dmg = p.stats.damage;
  if (w.beast === "swipe") swipe(s, dmg, p.stats.range, w.arcCos ?? 0.3, w.range, w.id === "tigerclaw");
  else if (w.beast === "pounce") pounce(s, dmg);
  else if (w.beast === "yarn") shot(s, dmg, { bounces: R.YARN_BOUNCES, spirit: "yarn", r: 2.5 });
  else if (w.beast === "hairball") shot(s, dmg, { sticky: true, spirit: "hairball", r: 2.5 });
  else if (w.beast === "catnip") catnip(s, dmg);
  else if (w.beast === "bell") bell(s, dmg);
}

/** 앞쪽 할퀴기 (사냥 본능 반영). 맞힌 적 수.
 * 자국은 무기 기본 사거리 크기로 사거리 끝에 (사거리가 늘어도 몸에서 늘어나지 않음) · tiger: 호랑이 발톱 자국 */
function swipe(s: RunState, dmg: number, range: number, arc: number, base: number, tiger = false): number {
  const p = s.player;
  let hits = 0;
  for (const e of s.enemies) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (e.hp <= 0 || d > range + e.r) continue;
    if (d > p.r + e.r && (dx * p.faceX + dy * p.faceY) / d < arc) continue;
    damageEnemy(s, e, dmg * instinct(p, e), d === 0 ? p.faceX : dx / d, d === 0 ? p.faceY : dy / d);
    hits++;
  }
  const size = Math.min(range, base) * 0.5;
  const at = range - size * 0.9;
  addEffect(s, { kind: tiger ? "tigerScratch" : "scratch", x: p.x + p.faceX * at, y: p.y + p.faceY * at, dirX: p.faceX, dirY: p.faceY, size, maxTicks: tiger ? 12 : 8 });
  return hits;
}

function nearest(s: RunState, range: number): EnemyState | null {
  const p = s.player;
  let best: EnemyState | null = null;
  for (const e of s.enemies) {
    const rr = range + e.r;
    if (e.hp <= 0 || dist2(e, p) > rr * rr) continue;
    if (!best || dist2(e, p) < dist2(best, p)) best = e;
  }
  return best;
}

/** 덮치기: 가까운 적에게 뛰어들어 할큄. 맞힐 때마다 게이지가 차고, 다 차면 거대한 호랑이 (더 멀리 뛰어 둘레를 크게 할큄) */
function pounce(s: RunState, dmg: number): void {
  const p = s.player;
  const tiger = (p.tigerTicks ?? 0) > 0;
  const leap = tiger ? TIGER.leap : R.POUNCE_LEAP;
  const e = nearest(s, leap + 10);
  if (e) {
    const dir = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
    p.faceX = dir[0];
    p.faceY = dir[1];
    lunge(s, Math.max(0, Math.min(leap, Math.sqrt(dist2(e, p)) - p.r - e.r - 1)), dir[0], dir[1]);
  }
  if (tiger) {
    swipe(s, dmg * TIGER.mul, TIGER.reach, -1, TIGER.reach, true);
    return;
  }
  const hits = swipe(s, dmg, 22, 0.2, 22);
  p.tigerGauge = Math.min(TIGER.full, (p.tigerGauge ?? 0) + hits * TIGER.perHit);
  if (p.tigerGauge >= TIGER.full) becomeTiger(s);
}

/** 거대한 호랑이로 변신: 10초 · 추가 체력 50 (받는 피해는 추가 체력에서 먼저 깎임) */
function becomeTiger(s: RunState): void {
  const p = s.player;
  p.tigerGauge = 0;
  p.tigerTicks = TIGER.ticks;
  p.shieldPts = (p.shieldPts ?? 0) + TIGER.hp;
  addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: TIGER.reach, maxTicks: 20, width: 2 });
  addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 18, maxTicks: 16 });
}

/** 털실·헤어볼 던지기 */
function shot(s: RunState, dmg: number, extra: Partial<ProjectileState>): void {
  const p = s.player;
  const speed = p.stats.projectileSpeed;
  s.projectiles.push({
    id: s.nextId++,
    fromPlayer: true,
    x: p.x + p.faceX * (p.r + 2),
    y: p.y + p.faceY * (p.r + 2),
    prevX: p.x,
    prevY: p.y,
    r: 2,
    vx: p.faceX * speed,
    vy: p.faceY * speed,
    damage: dmg,
    ticksLeft: Math.ceil((p.stats.range * 1.5) / speed),
    ...extra,
  });
}

/** 캣닢 구름: 겨눈 곳(자동 공격이면 가까운 적)에 3초 동안 0.5초마다 피해 */
function catnip(s: RunState, dmg: number): void {
  const p = s.player;
  const e = nearest(s, p.stats.range);
  const d = Math.min(p.stats.range, e ? Math.sqrt(dist2(e, p)) : (p.aimDist ?? p.stats.range));
  const x = p.x + p.faceX * d;
  const y = p.y + p.faceY * d;
  for (let i = 0; i < R.CATNIP_PULSES; i++) s.pendingBlasts.push({ tick: s.tick + 10 + i * R.CATNIP_EVERY, x, y, radius: CATNIP_RADIUS, damage: dmg });
  addEffect(s, { kind: "catnip", x, y, dirX: 0, dirY: 0, size: CATNIP_RADIUS, maxTicks: 10 + R.CATNIP_PULSES * R.CATNIP_EVERY });
}

/** 방울: 둘레 적에게 피해 + 짧게 기절 */
function bell(s: RunState, dmg: number): void {
  const p = s.player;
  for (const e of s.enemies) {
    const rr = p.stats.range + e.r;
    if (e.hp <= 0 || dist2(e, p) > rr * rr) continue;
    const dir = normalize(e.x - p.x, e.y - p.y) ?? [1, 0];
    damageEnemy(s, e, dmg * instinct(p, e), dir[0], dir[1]);
    if (e.kind !== "dummy") e.stunTicks = Math.max(e.stunTicks ?? 0, ENEMIES[e.kind].boss ? R.BELL_STUN / 2 : R.BELL_STUN);
  }
  addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: p.stats.range, maxTicks: 14, width: 1 });
}
