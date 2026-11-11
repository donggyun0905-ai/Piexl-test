// 오리(히든): 꽥 음파(부채꼴·물보라)·깃털 부채·황금알·거품 · 몇 번째마다 둘레 전체 큰 꽥(기절) · 새끼 오리는 ducklings
import { TICK_RATE } from "../constants";
import { ENEMIES } from "../enemyDefs";
import { DUCK_PERKS as K } from "../itemsDuck";
import { DUCK } from "../weaponsDuck";
import { damageEnemy as damageEnemy_ } from "./combat";
import { echoQuack, updateDucklings } from "./ducklings";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, normalize, roomGrid, shotDirs, weaponOf } from "./util";
import { raiseShield } from "./imugiMods";
import { srcFn } from "./dmgSrc";
const damageEnemy = srcFn("duck", () => damageEnemy_);

/** 공격력 (오리 가족: 새끼 오리 수만큼 더 셈 · 백조의 노래: 잃은 체력만큼 더 셈) */
export function duckPower(p: PlayerState): number {
  let mul = 1;
  if (hasPerk(p, "duckFamily")) mul += K.duckFamily.per * (p.ducklings?.length ?? 0);
  if (weaponOf(p).quack === "swan") mul *= 1 + (DUCK.swanMax - 1) * Math.max(0, 1 - p.hp / p.stats.maxHp);
  return p.stats.damage * mul;
}

/** 큰 꽥 주기 (큰 꽥 연습이면 한 번 더 자주, 최소 2) */
export function bigEvery(p: PlayerState): number {
  const n = weaponOf(p).bigEvery ?? DUCK.big.every;
  return Math.max(2, n - (hasPerk(p, "bigQuack") ? K.bigQuack.every : 0));
}

/** 틱마다 (오리 무기를 들었을 때 player에서) */
export function duckTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  updateDucklings(s);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  p.quacks = (p.quacks ?? 0) + 1;
  const w = weaponOf(p);
  const dmg = duckPower(p);
  if (w.quack === "feather") feathers(s, dmg);
  else if (w.quack === "bubble") shot(s, dmg, p.faceX, p.faceY, { spirit: "bubble", r: 3, blast: w.blast, splash: 1 });
  else if (w.quack === "egg") egg(s, dmg);
  else cone(s, dmg, p.stats.range, w.arcCos ?? 0.5, w.quack === "splash");
  if (p.quacks % bigEvery(p) === 0) bigQuack(s, dmg);
  echoQuack(s, dmg);
}

/** 맞은 적 밀어내기 (보스 제외) */
function push(s: RunState, e: EnemyState, dx: number, dy: number, dist: number): void {
  if (ENEMIES[e.kind].boss) return;
  e.x += dx * dist;
  e.y += dy * dist;
  keepInRoom(e, roomGrid(s));
}

/** 부채꼴 꽥 (arc = -1이면 둘레 전체). 물보라면 맞은 적이 느려짐 */
function cone(s: RunState, dmg: number, range: number, arc: number, splash: boolean): void {
  const p = s.player;
  for (const e of s.enemies) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (e.hp <= 0 || d > range + e.r) continue;
    if (d > p.r + e.r && (dx * p.faceX + dy * p.faceY) / d < arc) continue;
    const ux = d === 0 ? p.faceX : dx / d;
    const uy = d === 0 ? p.faceY : dy / d;
    damageEnemy(s, e, dmg, ux, uy);
    push(s, e, ux, uy, DUCK.push);
    if (splash) e.slowTicks = Math.max(e.slowTicks ?? 0, DUCK.splashSlow);
  }
  addEffect(s, { kind: splash ? "splash" : "quack", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: range, maxTicks: 12, width: arc, follow: true });
}

/** 큰 꽥: 둘레 전체에 세게, 기절(보스는 절반)·밀침 · 깃털 방패면 보호막 */
function bigQuack(s: RunState, dmg: number): void {
  const p = s.player;
  const radius = Math.max(DUCK.big.minRange, p.stats.range * DUCK.big.rangeMul);
  const hit = dmg * DUCK.big.damage * (hasPerk(p, "bigQuack") ? K.bigQuack.damage : 1);
  for (const e of s.enemies) {
    if (e.hp <= 0 || dist2(e, p) > (radius + e.r) ** 2) continue;
    const dir = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
    damageEnemy(s, e, hit, dir[0], dir[1]);
    push(s, e, dir[0], dir[1], DUCK.big.push);
    if (e.kind !== "dummy") e.stunTicks = Math.max(e.stunTicks ?? 0, ENEMIES[e.kind].boss ? DUCK.big.stun / 2 : DUCK.big.stun);
  }
  if (hasPerk(p, "featherShield")) raiseShield(p, K.featherShield.shield, p.stats.maxHp * K.featherShield.max);
  addEffect(s, { kind: "bigQuack", x: p.x, y: p.y, dirX: 0, dirY: 0, size: radius, maxTicks: 18, follow: true });
}

/** 플레이어 탄 하나 (깃털·거품) */
function shot(s: RunState, dmg: number, dx: number, dy: number, extra: Partial<ProjectileState>): void {
  const p = s.player;
  const speed = p.stats.projectileSpeed;
  s.projectiles.push({
    id: s.nextId++,
    fromPlayer: true,
    x: p.x + dx * (p.r + 2),
    y: p.y + dy * (p.r + 2),
    prevX: p.x,
    prevY: p.y,
    r: 2,
    vx: dx * speed,
    vy: dy * speed,
    damage: dmg,
    ticksLeft: Math.ceil(p.stats.range / speed),
    ...extra,
  });
}

/** 깃털 부채: 여러 갈래, 적을 뚫음 */
function feathers(s: RunState, dmg: number): void {
  const p = s.player;
  const w = weaponOf(p);
  for (const [dx, dy] of shotDirs(p.faceX, p.faceY, w.shots ?? 1, w.spread)) shot(s, dmg, dx, dy, { spirit: "feather", pierce: w.pierce, hitIds: [] });
}

/** 황금알: 사거리 안 가장 가까운 적(없으면 앞쪽)에 던져 잠시 뒤 터짐 */
function egg(s: RunState, dmg: number): void {
  const p = s.player;
  const range = p.stats.range;
  let target: EnemyState | null = null;
  for (const e of s.enemies) {
    if (e.hp <= 0 || dist2(e, p) > (range + e.r) ** 2) continue;
    if (!target || dist2(e, p) < dist2(target, p)) target = e;
  }
  const x = target ? target.x : p.x + p.faceX * range * 0.7;
  const y = target ? target.y : p.y + p.faceY * range * 0.7;
  const radius = weaponOf(p).blast ?? 30;
  s.pendingBlasts.push({ tick: s.tick + DUCK.eggTicks, x, y, radius, damage: dmg });
  addEffect(s, { kind: "duckEgg", x: p.x, y: p.y, dirX: 0, dirY: 0, size: radius, maxTicks: DUCK.eggTicks, toX: x, toY: y });
}

/** 연습장 다시 시작 */
export function resetDuck(p: PlayerState): void {
  p.ducklings = undefined;
  p.quacks = 0;
}
