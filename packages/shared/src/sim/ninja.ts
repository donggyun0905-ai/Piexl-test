// 닌자 본인 공격: 수리검·쿠나이·부채 수리검·풍마 수리검·꿰매기 바늘 던지기 · 사슬낫·닌자도 베기 · 연막탄 · 분신술. 그림자는 shades
import { TICK_RATE } from "../constants";
import { NINJA_PERKS } from "../itemsNinja";
import { damageEnemy } from "./combat";
import { addSmoke, markEnemy, updateShades } from "./shades";
import type { EnemyState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, shotDirs, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  CLONE_MUL: 0.6,
  /** 연막탄: 떨어질 때까지 · 구름이 남는 틱 (0.5초마다 피해) */
  SMOKE_FLY: 18,
  SMOKE_LIFE: 180,
  /** 그림자 꿰매기: 묶이는 틱 */
  PIN_TICKS: 30,
};
export { R as NINJA_RULES };

/** 분신술: 분신이 서는 거리(옆으로) · 분신 피해 배율 */
export const CLONE_GAP = 14;

/** 틱마다 (닌자 무기를 들었을 때 player에서). want = 공격 키(자동 공격이면 사거리 안에 적) */
export function ninjaTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  updateShades(s);
  if ((p.kageTicks ?? 0) > 0) p.kageTicks = (p.kageTicks ?? 0) - 1;
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  const w = weaponOf(p);
  const dmg = p.stats.damage;
  if (w.shade === "sickle" || w.shade === "blade") slash(s, dmg, p.stats.range, w.arcCos ?? 0.3, w.shade === "sickle");
  else if (w.shade === "smoke") smokeBomb(s, dmg);
  else {
    for (const [dx, dy] of shotDirs(p.faceX, p.faceY, w.shots ?? 1, w.spread)) star(s, p.x, p.y, dx, dy, dmg);
    // 분신술: 양옆 분신도 같은 곳(가까운 적, 없으면 바라보는 쪽)을 겨눠 던짐
    if (w.shade === "clone") {
      const t = nearest(s, p.stats.range);
      const ax = t ? t.x : p.x + p.faceX * p.stats.range;
      const ay = t ? t.y : p.y + p.faceY * p.stats.range;
      for (const k of [1, -1]) {
        const cx = p.x - p.faceY * CLONE_GAP * k;
        const cy = p.y + p.faceX * CLONE_GAP * k;
        const d = normalize(ax - cx, ay - cy) ?? [p.faceX, p.faceY];
        star(s, cx, cy, d[0], d[1], dmg * R.CLONE_MUL);
      }
    }
  }
}

/** 던지는 무기 하나 (수리검·쿠나이·풍마 수리검·꿰매기 바늘) */
function star(s: RunState, x: number, y: number, dx: number, dy: number, dmg: number): void {
  const p = s.player;
  const w = weaponOf(p);
  const speed = p.stats.projectileSpeed;
  const ticks = Math.ceil(p.stats.range / speed);
  const big = hasPerk(p, "bigStar");
  const fuma = w.shade === "fuma";
  const pierce = (fuma ? 99 : (w.pierce ?? 0)) + (big ? NINJA_PERKS.bigStar.pierce : 0);
  const shot: ProjectileState = {
    id: s.nextId++,
    fromPlayer: true,
    x: x + dx * (p.r + 2),
    y: y + dy * (p.r + 2),
    prevX: x,
    prevY: y,
    r: (fuma ? 5 : w.shade === "kunai" || w.shade === "needle" ? 2 : 2.5) * (big ? 1.5 : 1),
    vx: dx * speed,
    vy: dy * speed,
    damage: dmg,
    ticksLeft: ticks,
    mark: true,
    spirit: fuma ? "fuma" : w.shade === "kunai" ? "kunai" : w.shade === "needle" ? "needle" : "shuriken",
    ...(pierce > 0 ? { pierce, hitIds: [] } : {}),
    // 풍마 수리검: 사거리 끝에서 되돌아옴
    ...(fuma ? { back: true, span: ticks } : {}),
    ...(w.shade === "needle" ? { pin: true } : {}),
    ...(hasPerk(p, "venomStar") ? { venom: dmg * NINJA_PERKS.venomStar.damage } : {}),
  };
  s.projectiles.push(shot);
}

/** 사거리 안 가장 가까운 적 */
function nearest(s: RunState, range: number): EnemyState | null {
  const p = s.player;
  let best: EnemyState | null = null;
  for (const e of s.enemies) {
    const rr = range + e.r;
    if (e.hp <= 0 || e.immune || dist2(e, p) > rr * rr) continue;
    if (!best || dist2(e, p) < dist2(best, p)) best = e;
  }
  return best;
}

/** 던진 무기가 적에게 맞음 (projectiles에서): 독·꿰매기·표식 */
export function starHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  if (pr.venom) {
    e.poisonTicks = Math.max(e.poisonTicks ?? 0, NINJA_PERKS.venomStar.ticks);
    e.poisonDmg = Math.max(e.poisonDmg ?? 0, pr.venom);
  }
  if (pr.pin) e.rootTicks = Math.max(e.rootTicks ?? 0, R.PIN_TICKS);
  markEnemy(s, e);
}

/** 사슬낫(넓게)·닌자도 베기: 맞은 적마다 표식 */
function slash(s: RunState, dmg: number, range: number, arc: number, chain: boolean): void {
  const p = s.player;
  for (const e of [...s.enemies]) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (e.hp <= 0 || d > range + e.r) continue;
    if (d > p.r + e.r && (dx * p.faceX + dy * p.faceY) / d < arc) continue;
    damageEnemy(s, e, dmg, d === 0 ? p.faceX : dx / d, d === 0 ? p.faceY : dy / d);
    markEnemy(s, e);
  }
  addEffect(s, { kind: "swing", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: range, maxTicks: chain ? 10 : 6 });
}

/** 연막탄: 겨눈 곳(가까운 적)에 던져 구름 (0.5초마다 피해·표식·둔화) */
function smokeBomb(s: RunState, dmg: number): void {
  const p = s.player;
  const target = nearest(s, p.stats.range);
  const d = Math.min(p.stats.range, target ? Math.sqrt(dist2(target, p)) : (p.aimDist ?? p.stats.range));
  const x = p.x + p.faceX * d;
  const y = p.y + p.faceY * d;
  addSmoke(s, x, y, dmg, R.SMOKE_FLY, R.SMOKE_LIFE);
  addEffect(s, { kind: "lob", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 6, maxTicks: R.SMOKE_FLY, toX: x, toY: y });
}
