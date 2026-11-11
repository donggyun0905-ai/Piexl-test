// 시간술사: 본인 공격은 약하고(70%), 잠시 뒤(1초) 공격한 그 자리에서 반투명한 잔상이 더 세게(120%) 한 번 더 함.
// 움직이며 싸우면 지나온 자리마다 공격이 다시 터짐. 무기마다 공격 방식이 다름 (weaponsChrono)
import { srcRun, srcFn } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { ENEMIES } from "../content";
import { CHRONO_PERKS } from "../itemsChrono";
import { createRng, deriveSeed } from "../rng";
import type { Echo } from "./chronoTypes";
import { blastAt as blastAt_, damageEnemy as damageEnemy_, healPlayer } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, shotDirs, weaponOf } from "./util";
const blastAt = srcFn("chrono", () => blastAt_), damageEnemy = srcFn("chrono", () => damageEnemy_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  PARADOX_DEPTH: 2,
  /** 모래시계 둔화 · 스톱워치 멈춤(일반 · 보스) · 시한폭탄 터지는 틱 · 예지 낙뢰가 떨어지는 틱 */
  SAND_SLOW: 60,
  STOP_STUN: 24,
  STOP_STUN_BOSS: 8,
  /** 시간 붕괴: 잔상에 맞을 때마다 시계 표식 1, 이만큼 쌓이면 터짐 (공격력 배율 · 둘레 반경 · 둘레 피해 비율) */
  CLOCK_MAX: 5,
  COLLAPSE_MUL: 4,
  COLLAPSE_R: 24,
  COLLAPSE_SPLASH: 0.5,
};
export { R as CHRONO_RULES };

/** 잔상이 나오는 틱 · 본인 공격 피해 배율 · 잔상 피해 배율 (잔상이 더 셈) · 패러독스는 잔상이 잔상을 남기는 횟수 */
export const ECHO_DELAY = 60;
export const SELF_MUL = 0.7;
export const ECHO_MUL = 1.2;
export const BOMB_FUSE = 60;
export const FUTURE_DELAY = 45;

/** 틱마다 (시간술사 무기를 들었을 때 player에서). want = 공격 키(자동 공격이면 사거리 안에 적) */
export function chronoTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  updateEchoes(s);
  updateForesights(s);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  const precise = hasPerk(p, "precision") && p.attackCount % CHRONO_PERKS.precision.every === 0 ? CHRONO_PERKS.precision.damage : 1;
  const t = nearest(s, p.x, p.y, p.stats.range);
  const d = Math.min(p.stats.range, t ? Math.sqrt(dist2(t, p)) : (p.aimDist ?? p.stats.range));
  const echo: Echo = {
    at: s.tick + (hasPerk(p, "quickEcho") ? CHRONO_PERKS.quickEcho.ticks : ECHO_DELAY),
    born: s.tick,
    x: p.x,
    y: p.y,
    fx: p.faceX,
    fy: p.faceY,
    tx: p.x + p.faceX * d,
    ty: p.y + p.faceY * d,
    target: t?.id ?? 0,
    mul: (hasPerk(p, "longEcho") ? CHRONO_PERKS.longEcho.damage : ECHO_MUL) * precise,
    depth: 1,
  };
  attack(s, echo, SELF_MUL * precise, false);
  (p.echoes ??= []).push(echo);
}

/** 사거리 안 가장 가까운 적 */
function nearest(s: RunState, x: number, y: number, range: number): EnemyState | null {
  let best: EnemyState | null = null;
  let bestD = Infinity;
  for (const e of s.enemies) {
    const d = (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y);
    const rr = range + e.r;
    if (e.hp <= 0 || e.immune || d > rr * rr || d >= bestD) continue;
    best = e;
    bestD = d;
  }
  return best;
}

/** 공격 하나 (본인 또는 잔상). e = 자리·방향·노리는 곳 · mul 피해 배율 · echo 잔상인지 */
function attack(s: RunState, e: Echo, mul: number, echo: boolean): void {
  const p = s.player;
  const w = weaponOf(p);
  const dmg = p.stats.damage * mul;
  const slow = hasPerk(p, "timeSlow") ? CHRONO_PERKS.timeSlow.ticks : 0;
  switch (w.chrono) {
    case "hands":
    case "pendulum":
      return sweep(s, e, dmg, p.stats.range, w.arcCos ?? 0.2, slow, echo);
    case "stop":
      return stopPulse(s, e, dmg, slow, echo);
    case "bomb":
      s.pendingBlasts.push({ tick: s.tick + BOMB_FUSE, x: e.tx, y: e.ty, radius: w.blast ?? 28, damage: dmg });
      addEffect(s, { kind: "lob", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 5, maxTicks: 18, toX: e.tx, toY: e.ty });
      addEffect(s, { kind: "mark", x: e.tx, y: e.ty, dirX: 0, dirY: 0, size: w.blast ?? 28, maxTicks: BOMB_FUSE });
      if (echo) markArea(s, e.tx, e.ty, w.blast ?? 28);
      return;
    case "future": {
      const t = s.enemies.find((x) => x.id === e.target && x.hp > 0) ?? nearest(s, e.x, e.y, p.stats.range);
      if (t) (p.foresights ??= []).push({ at: s.tick + FUTURE_DELAY, target: t.id, x: t.x, y: t.y, dmg, ...(echo ? { echo: true } : {}) });
      return;
    }
    default:
      bolts(s, e, dmg, slow, echo);
  }
}

/** 탄 쏘기 (시간탄·모래·원반·톱니·패러독스) */
function bolts(s: RunState, e: Echo, dmg: number, slow: number, echo: boolean): void {
  const p = s.player;
  const w = weaponOf(p);
  const speed = p.stats.projectileSpeed;
  const ticks = Math.ceil(p.stats.range / speed);
  const disc = w.chrono === "disc";
  const spirit = disc ? "disc" : w.chrono === "gears" ? "gear" : w.chrono === "sand" ? "sand" : "chrono";
  for (const [dx, dy] of shotDirs(e.fx, e.fy, w.shots ?? 1, w.spread)) {
    s.projectiles.push({
      id: s.nextId++,
      fromPlayer: true,
      x: e.x + dx * (p.r + 2),
      y: e.y + dy * (p.r + 2),
      prevX: e.x,
      prevY: e.y,
      r: disc ? 4 : 2.5,
      vx: dx * speed,
      vy: dy * speed,
      damage: dmg,
      ticksLeft: ticks,
      spirit,
      ...(echo ? { echo: true } : {}),
      ...(disc ? { back: true, span: ticks, pierce: 99, hitIds: [] } : w.pierce ? { pierce: w.pierce, hitIds: [] } : {}),
      ...(w.chrono === "sand" || slow ? { slow: Math.max(slow, w.chrono === "sand" ? R.SAND_SLOW : 0) } : {}),
    });
  }
}

/** 시곗바늘·진자: 앞쪽(진자는 아주 넓게) 휘두르기 */
function sweep(s: RunState, e: Echo, dmg: number, range: number, arc: number, slow: number, echo: boolean): void {
  for (const t of s.enemies) {
    const dx = t.x - e.x;
    const dy = t.y - e.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (t.hp <= 0 || d > range + t.r) continue;
    if (d > 6 + t.r && (dx * e.fx + dy * e.fy) / d < arc) continue;
    hit(s, t, dmg, d === 0 ? e.fx : dx / d, d === 0 ? e.fy : dy / d, slow, echo);
  }
  addEffect(s, { kind: "swing", x: e.x, y: e.y, dirX: arc <= -0.2 ? 0 : e.fx, dirY: arc <= -0.2 ? 0 : e.fy, size: range, maxTicks: 8, width: echo ? 1 : 0 });
}

/** 스톱워치: 둘레 피해 + 잠깐 멈춤 */
function stopPulse(s: RunState, e: Echo, dmg: number, slow: number, echo: boolean): void {
  const p = s.player;
  const r = p.stats.range;
  for (const t of s.enemies) {
    const rr = r + t.r;
    if (t.hp <= 0 || (t.x - e.x) * (t.x - e.x) + (t.y - e.y) * (t.y - e.y) > rr * rr) continue;
    const dir = normalize(t.x - e.x, t.y - e.y) ?? [1, 0];
    hit(s, t, dmg, dir[0], dir[1], slow, echo);
    if (t.kind !== "dummy") t.stunTicks = Math.max(t.stunTicks ?? 0, ENEMIES[t.kind].boss ? R.STOP_STUN_BOSS : R.STOP_STUN);
  }
  addEffect(s, { kind: "ring", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: 16, width: 1 });
}

/** 피해 + 시간 감속 + 잔상이면 시계 표식·영원 */
export function hit(s: RunState, t: EnemyState, dmg: number, dx: number, dy: number, slow: number, echo: boolean): void {
  damageEnemy(s, t, dmg, dx, dy);
  if (slow > 0 && !ENEMIES[t.kind].boss) t.slowTicks = Math.max(t.slowTicks ?? 0, slow);
  if (echo) echoHit(s, t);
}

/** 잔상(또는 잔상의 탄)이 맞힘: 영원(회복) · 시계 표식, 다 차면 시간 붕괴 */
export function echoHit(s: RunState, t: EnemyState): void {
  const p = s.player;
  if (hasPerk(p, "eternity")) healPlayer(s, CHRONO_PERKS.eternity.heal);
  if (t.hp <= 0) return;
  t.clock = (t.clock ?? 0) + 1;
  if (t.clock < R.CLOCK_MAX) return;
  t.clock = 0;
  // 시간 붕괴: 시계가 깨지며 그 적에게 큰 피해, 둘레에도 조금
  const dmg = p.stats.damage * R.COLLAPSE_MUL;
  damageEnemy(s, t, dmg, 0, 0, false);
  blastAt(s, t.x, t.y, R.COLLAPSE_R, dmg * R.COLLAPSE_SPLASH, { exclude: t, still: true });
  addEffect(s, { kind: "chCollapse", x: t.x, y: t.y, dirX: 0, dirY: 0, size: t.r + 10, maxTicks: 36 });
}

/** 잔상 시한폭탄·낙뢰: 그 자리 적들에게 시계 표식 */
function markArea(s: RunState, x: number, y: number, r: number): void {
  for (const t of s.enemies) if (t.hp > 0 && (t.x - x) ** 2 + (t.y - y) ** 2 <= (r + t.r) ** 2) echoHit(s, t);
}

/** 때가 된 잔상이 공격 (패러독스·겹잔상이면 잔상을 또 남김) */
function updateEchoes(s: RunState): void {
  const p = s.player;
  if (!p.echoes?.length) return;
  const due = p.echoes.filter((e) => e.at <= s.tick);
  if (due.length === 0) return;
  p.echoes = p.echoes.filter((e) => e.at > s.tick);
  const w = weaponOf(p);
  for (const e of due) {
    attack(s, e, e.mul, true);
    if (hasPerk(p, "echoBurst")) srcRun(s, "echoBurst", () => blastAt(s, e.x, e.y, CHRONO_PERKS.echoBurst.radius, p.stats.damage * CHRONO_PERKS.echoBurst.damage));
    const again =
      (w.chrono === "paradox" && e.depth < R.PARADOX_DEPTH) ||
      (hasPerk(p, "doubleEcho") && createRng(deriveSeed(s.seed, "echo", s.tick, e.depth, e.x)).nextFloat() < CHRONO_PERKS.doubleEcho.chance);
    if (again) p.echoes.push({ ...e, at: s.tick + (e.at - e.born), born: s.tick, depth: e.depth + 1 });
  }
}

/** 예지 낙뢰: 그 적이 아직 있으면 그 자리, 없으면 처음 자리에 */
function updateForesights(s: RunState): void {
  const p = s.player;
  if (!p.foresights?.length) return;
  for (const f of p.foresights) {
    const t = s.enemies.find((e) => e.id === f.target && e.hp > 0);
    if (t) {
      f.x = t.x;
      f.y = t.y;
    }
    if (f.at === s.tick) {
      const r = weaponOf(p).blast ?? 14;
      blastAt(s, f.x, f.y, r, f.dmg);
      if (f.echo) markArea(s, f.x, f.y, r);
      addEffect(s, { kind: "bolt", x: f.x, y: f.y - 40, dirX: 0, dirY: 0, size: 2, maxTicks: 10, toX: f.x, toY: f.y, width: 2 });
    }
  }
  p.foresights = p.foresights.filter((f) => f.at > s.tick);
}
