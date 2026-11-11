// 격투가 기술 하나하나: 앞쪽 치기 · 둘레 치기 · 돌진 · 붙잡기·내리꽂기 · 빨아들이기 · 고정·풀기 · 버티기·되받아치기 · 마무리 돌진 · 파동탄
// 콤보 순서·시간 처리는 brawl
import { ENEMIES } from "../content";
import type { ComboMove } from "../combos";
import { createRng, deriveSeed } from "../rng";
import { damageEnemy as damageEnemy_, healPlayer } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, normalize, roomGrid } from "./util";
import { srcFn } from "./dmgSrc";
const damageEnemy = srcFn("brawlMoves", () => damageEnemy_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 위압: 30% 확률로 1.5초 도망 · K.O: 5% 확률로 10초 기절 (보스 1초) */
  FEAR_CHANCE: 0.3,
  FEAR_TICKS: 90,
  KO_CHANCE: 0.05,
  KO_TICKS: 600,
  KO_BOSS_TICKS: 60,
  COUNTER_MUL: 3,
  EXECUTE_HP: 0.2,
  /** 파동탄 사방 난사: 빠르기 배율 0.6~1.4 */
  /** 이만큼 좁은 앞쪽 치기는 찌르기 (효과만 다름) */
  STAB_ARC: 0.8,
  KI_SCATTER_MIN: 0.6,
  KI_SCATTER_ADD: 0.8,
  /** 쌍검 베기 안쪽 칼날 자국 크기 · 보스 앞에서 바위를 들 때 닿는 거리 */
  TWIN_INNER: 0.75,
  ROCK_REACH: 12,
  /** 가라테 마무리: 입힌 피해의 30% 회복 */
  EXECUTE_HEAL: 0.3,
};
export { R as BRAWL_MOVES_RULES };

/** 고정: 3초 동안 0.5초마다 · 버티기 3초 · 받은 피해 되받아치기 배율 · 마무리 기준 체력 */
export const GUARD_TICKS = 180;

const roll = (s: RunState, label: string, id: number) => createRng(deriveSeed(s.seed, label, s.tick, id)).nextFloat();
const isBig = (e: EnemyState) => ENEMIES[e.kind].boss || e.kind === "dummy";
/** 돌진은 적 바로 앞(이만큼 띄워서)에서 멈춤 (몸이 닿아 피해를 받지 않게) */
export const STOP_GAP = 4;

/** 한 적 맞히기: 피해 + 밀침·기절 + 위압·K.O */
export function hit(s: RunState, e: EnemyState, dmg: number, m: ComboMove, dx: number, dy: number): void {
  const p = s.player;
  // 밀침이 없는 기술은 맞아도 밀리지 않음 (콤보가 끊기지 않게)
  const x = e.x;
  const y = e.y;
  p.comboHit = true;
  damageEnemy(s, e, dmg, dx, dy);
  if (!m.push) {
    e.x = x;
    e.y = y;
  } else if (!isBig(e)) {
    e.x += dx * m.push;
    e.y += dy * m.push;
    keepInRoom(e, roomGrid(s));
  }
  if (m.stun && e.kind !== "dummy") e.stunTicks = Math.max(e.stunTicks ?? 0, ENEMIES[e.kind].boss ? m.stun / 2 : m.stun);
  if (hasPerk(p, "intimidate") && !isBig(e) && roll(s, "fear", e.id) < R.FEAR_CHANCE) e.fearTicks = R.FEAR_TICKS;
  if (hasPerk(p, "knockout") && e.kind !== "dummy" && roll(s, "ko", e.id) < R.KO_CHANCE) {
    e.stunTicks = Math.max(e.stunTicks ?? 0, ENEMIES[e.kind].boss ? R.KO_BOSS_TICKS : R.KO_TICKS);
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r * 3, maxTicks: 16 });
  }
}

/** 앞쪽 근접 (fx, fy = 치는 방향) */
export function strike(s: RunState, dmg: number, m: ComboMove, fx: number, fy: number): void {
  const p = s.player;
  const arc = m.arc ?? 0.5;
  for (const e of s.enemies) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (e.hp <= 0 || d > m.range + e.r) continue;
    if (d > p.r + e.r && (dx * fx + dy * fy) / d < arc) continue;
    hit(s, e, dmg, m, d === 0 ? fx : dx / d, d === 0 ? fy : dy / d);
  }
  // 좁은 앞쪽(찌르기)은 뻗는 찌르기 효과, 나머지는 휘두르기
  if (arc >= R.STAB_ARC) addEffect(s, { kind: "stab", x: p.x + fx * p.r, y: p.y + fy * p.r, dirX: fx, dirY: fy, size: m.range, maxTicks: 10, toX: p.x + fx * (m.range + 4), toY: p.y + fy * (m.range + 4), width: 2 });
  else addEffect(s, { kind: "swing", x: p.x, y: p.y, dirX: arc <= -1 ? 0 : fx, dirY: arc <= -1 ? 0 : fy, size: m.range, maxTicks: 8 });
}

/** 둘레 범위 (x, y 기준) */
export function spin(s: RunState, dmg: number, m: ComboMove, x = s.player.x, y = s.player.y, radius = m.range): void {
  for (const e of s.enemies) {
    const rr = radius + e.r;
    if (e.hp <= 0 || (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y) > rr * rr) continue;
    const dir = normalize(e.x - x, e.y - y) ?? [1, 0];
    hit(s, e, dmg, m, dir[0], dir[1]);
  }
  addEffect(s, { kind: "slam", x, y, dirX: 0, dirY: 0, size: radius, maxTicks: 14 });
}

/** 앞으로 돌진 (벽을 뚫지 않게 나눠서 움직임) */
export function lunge(s: RunState, dist: number, dx = s.player.faceX, dy = s.player.faceY): void {
  const p = s.player;
  const g = roomGrid(s);
  for (let i = 0; i < 4; i++) {
    p.x += (dx * dist) / 4;
    p.y += (dy * dist) / 4;
    keepInRoom(p, g);
  }
  addEffect(s, { kind: "streak", x: p.x - dx * dist, y: p.y - dy * dist, dirX: 0, dirY: 0, size: 1, maxTicks: 8, toX: p.x, toY: p.y });
}

/** 가까운 적에게 돌진하되 몸이 닿기 전에 멈춤 (적이 없으면 바라보는 쪽으로 dist만큼) */
export function dashTo(s: RunState, dist: number, reach: number): void {
  const p = s.player;
  const t = nearest(s, reach + dist);
  if (!t) {
    lunge(s, dist);
    return;
  }
  const dir = normalize(t.x - p.x, t.y - p.y) ?? [p.faceX, p.faceY];
  p.faceX = dir[0];
  p.faceY = dir[1];
  lunge(s, Math.max(0, Math.min(dist, Math.sqrt(dist2(t, p)) - p.r - t.r - STOP_GAP)), dir[0], dir[1]);
}

/** 가장 가까운 적 (조건에 맞는 것) */
export function nearest(s: RunState, range: number, ok: (e: EnemyState) => boolean = () => true): EnemyState | null {
  const p = s.player;
  let best: EnemyState | null = null;
  for (const e of s.enemies) {
    const rr = range + e.r;
    if (e.hp <= 0 || e.immune || e.pwHid || dist2(e, p) > rr * rr || !ok(e)) continue;
    if (!best || dist2(e, p) < dist2(best, p)) best = e;
  }
  return best;
}

/** 붙잡기: 일반 적만 (보스·허수아비는 못 잡고 대신 가볍게 침) */
export function grab(s: RunState, dmg: number, m: ComboMove): void {
  const p = s.player;
  if (m.dash) dashTo(s, m.dash, m.range);
  const e = nearest(s, m.range, (o) => !isBig(o));
  if (e) {
    p.grabId = e.id;
    p.comboHit = true;
  } else if (nearest(s, m.range + R.ROCK_REACH)) {
    // 보스·허수아비는 못 드니 바위를 만들어 듦 (던질 때까지 무적)
    p.rock = true;
    p.comboHit = true;
    addEffect(s, { kind: "burst", x: p.x, y: p.y + p.r, dirX: 0, dirY: 0, size: 6, maxTicks: 10 });
  }
  else strike(s, dmg * 0.5, { ...m, kind: "strike", mul: 0.5 }, p.faceX, p.faceY);
}

/** 붙잡은 적을 앞쪽 땅에 내리꽂음 (범위). 잡은 적이 없으면 가볍게 둘레 치기 */
export function slamHeld(s: RunState, dmg: number, m: ComboMove): void {
  const p = s.player;
  const held = s.enemies.find((e) => e.id === p.grabId && e.hp > 0);
  p.grabId = undefined;
  if (p.rock) {
    // 바위를 가장 가까운 적에게 던져 내리꽂음
    p.rock = false;
    const t = nearest(s, m.range + R.ROCK_REACH * 3);
    const x = t ? t.x : p.x + p.faceX * m.range;
    const y = t ? t.y : p.y + p.faceY * m.range;
    addEffect(s, { kind: "burst", x, y, dirX: 0, dirY: 0, size: 10, maxTicks: 14 });
    spin(s, dmg, m, x, y);
    return;
  }
  if (m.dash) lunge(s, m.dash);
  if (!held) {
    spin(s, dmg * 0.4, m, p.x, p.y, m.range * 0.7);
    return;
  }
  held.x = p.x + p.faceX * (p.r + held.r + 2);
  held.y = p.y + p.faceY * (p.r + held.r + 2);
  keepInRoom(held, roomGrid(s));
  spin(s, dmg, m, held.x, held.y);
}

/** 빨아들이기 (가까운 쪽으로 당김, 보스 제외) + 피해 */
export function pull(s: RunState, dmg: number, m: ComboMove): void {
  const p = s.player;
  for (const e of s.enemies) {
    const rr = m.range + e.r;
    if (e.hp <= 0 || dist2(e, p) > rr * rr) continue;
    const dir = normalize(p.x - e.x, p.y - e.y) ?? [0, 0];
    if (dmg > 0) damageEnemy(s, e, dmg, 0, 0);
    if (isBig(e)) continue;
    const d = Math.sqrt(dist2(e, p));
    const step = Math.min(m.push ?? 0, Math.max(0, d - p.r - e.r - 1));
    e.x += dir[0] * step;
    e.y += dir[1] * step;
    keepInRoom(e, roomGrid(s));
  }
  addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: m.range, maxTicks: 14, width: 1 });
}

/** 쌍검 베기: 같은 범위를 동시에 두 번 (칼날 자국은 바깥·조금 안쪽 두 겹) */
export function twinSlash(s: RunState, dmg: number, m: ComboMove): void {
  const p = s.player;
  const arc = m.arc ?? 0.3;
  for (let k = 0; k < 2; k++) {
    for (const e of s.enemies) {
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (e.hp <= 0 || d > m.range + e.r) continue;
      if (arc > -1 && d > p.r + e.r && (dx * p.faceX + dy * p.faceY) / d < arc) continue;
      hit(s, e, dmg, m, d === 0 ? p.faceX : dx / d, d === 0 ? p.faceY : dy / d);
    }
  }
  for (const r of [m.range, m.range * R.TWIN_INNER]) {
    addEffect(s, { kind: "swing", x: p.x, y: p.y, dirX: arc <= -1 ? 0 : p.faceX, dirY: arc <= -1 ? 0 : p.faceY, size: r, maxTicks: r === m.range ? 8 : 10 });
  }
}

/** 버티기: 빨아들이고 3초 제자리 (받는 피해 절반, 받은 피해를 모음) */
export function guard(s: RunState, m: ComboMove): void {
  const p = s.player;
  pull(s, 0, m);
  p.guardTicks = GUARD_TICKS;
  p.rootTicks = GUARD_TICKS;
  p.guardTaken = 0;
}

/** 되받아치기: 공격력 + 버티는 동안 받은 피해 ×3 범위 일격, 기절 */
export function counter(s: RunState, dmg: number, m: ComboMove): void {
  const p = s.player;
  spin(s, dmg + (p.guardTaken ?? 0) * R.COUNTER_MUL, m);
  p.guardTicks = p.rootTicks = p.guardTaken = 0;
}

/** 마무리: 체력 20% 이하 적에게 돌진해 쓰러뜨리고 제자리로 (보스는 공격력 배율 피해) */
export function execute(s: RunState, dmg: number, m: ComboMove): void {
  const p = s.player;
  let any = false;
  const before = s.enemies.reduce((sum, e) => sum + Math.max(0, e.hp), 0);
  for (const e of s.enemies) {
    const rr = m.range + e.r;
    if (e.hp <= 0 || dist2(e, p) > rr * rr || e.hp > e.maxHp * R.EXECUTE_HP || e.kind === "dummy") continue;
    any = true;
    const dir = normalize(e.x - p.x, e.y - p.y) ?? [1, 0];
    hit(s, e, ENEMIES[e.kind].boss ? dmg : e.hp, m, dir[0], dir[1]);
    addEffect(s, { kind: "streak", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 1, maxTicks: 10, toX: e.x, toY: e.y });
  }
  if (!any) spin(s, dmg * 0.3, m, p.x, p.y, 26);
  // 입힌 피해의 30% 회복
  const dealt = before - s.enemies.reduce((sum, e) => sum + Math.max(0, e.hp), 0);
  if (dealt > 0) healPlayer(s, dealt * R.EXECUTE_HEAL);
}

/** 파동탄: 바라보는 쪽으로 hits발 (spread면 부채꼴), scatter면 사방으로 빠르기도 제각각 */
export function kiShots(s: RunState, dmg: number, m: ComboMove): void {
  const p = s.player;
  const n = m.hits ?? 1;
  const base = p.stats.projectileSpeed;
  const dirs: [number, number][] = [[p.faceX, p.faceY]];
  if (m.spread) {
    const [c, sn] = m.spread;
    let l: [number, number] = [p.faceX, p.faceY];
    let r: [number, number] = [p.faceX, p.faceY];
    while (dirs.length < n) {
      l = [l[0] * c - l[1] * sn, l[0] * sn + l[1] * c];
      r = [r[0] * c + r[1] * sn, -r[0] * sn + r[1] * c];
      dirs.push(l, r);
    }
  }
  for (let i = 0; i < n; i++) {
    const rng = createRng(deriveSeed(s.seed, "ki", s.tick, i));
    const d = m.scatter ? (normalize(rng.nextFloat() - 0.5, rng.nextFloat() - 0.5) ?? [1, 0]) : dirs[i % dirs.length]!;
    const speed = base * (m.scatter ? R.KI_SCATTER_MIN + rng.nextFloat() * R.KI_SCATTER_ADD : 1);
    s.projectiles.push({
      id: s.nextId++,
      fromPlayer: true,
      x: p.x + d[0] * (p.r + 2),
      y: p.y + d[1] * (p.r + 2),
      prevX: p.x,
      prevY: p.y,
      r: 2.5,
      vx: d[0] * speed,
      vy: d[1] * speed,
      damage: dmg,
      ticksLeft: Math.ceil(m.range / speed),
      spirit: "ki",
    });
  }
  if (m.scatter) addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 24, maxTicks: 14, width: 2 });
}
