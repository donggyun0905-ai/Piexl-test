// 음양사 부적: 쏠 때 붙이는 값 · 적에게 붙은 수 세기·추가 효과 · 음양사 전용 아이템 (마음가짐·옥구슬·반야·사인·영역·흡생) · 수양 도트·땅 주변 피해
// 확률은 시드·틱·적 id로 만든 랜덤 (Math.random 없음)
import { ENEMIES, type CharmKind, type WeaponDef } from "../content";
import { PERKS } from "../perks";
import { createRng, deriveSeed } from "../rng";
import { blastAt, damageEnemy, healPlayer, ignite } from "./combat";
import { seatNo } from "./party";
import type { EnemyState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, markDot, normalize, roomGrid } from "./util";

/** 추가 효과가 터지는 붙은 부적 수 (적마다 따로 셈. 수양은 3장 붙을 때) */
const EVERY: Record<CharmKind, number> = { ramp: 5, smite: 5, seal: 3, spark: 3, blaze: 5, frost: 5, bloom: 5, radiant: 3, shade: 5, quake: 5 };
/** 수제: 맞힐 때마다 +15%, 5번째는 2.5배 */
const RAMP_STEP = 0.15;
const RAMP_FINISH = 2.5;
/** 강력: 맞은 적 둘레 이 거리 안 적 3명에게 같은 피해 */
const SMITE_COUNT = 3;
const SMITE_RANGE = 90;
/** 수양: 최대 장 수, 붙어 있는 틱 (3초), 0.5초마다 한 장이 주는 피해 비율 */
const SEAL_MAX = 3;
const SEAL_TICKS = 180;
const SEAL_MUL = 0.25;
/** 불꽃: 5번째는 3배 + 주변 폭발, 맞으면 불탐 (2초 동안 피해의 50%) */
const BLAZE_FINISH = 3;
const BLAZE_BLAST = 24;
const BLAZE_BURN = 0.5;
/** 얼음: 경직 틱 (1.5초, 보스는 절반) */
const FROST_STUN = 90;
/** 벚꽃: 폭발 범위·피해 비율 */
const BLOOM_RADIUS = 32;
const BLOOM_MUL = 1.5;
/** 벚꽃: 쏠 때마다 번갈아 비껴 나가는 방향 [cos, sin] (0·±12·±24도), 겹쳐 뭉치지 않고 바람에 흩날리듯 */
const BLOOM_DRIFT: readonly (readonly [number, number])[] = [[1, 0], [0.9781, 0.2079], [0.9781, -0.2079], [0.9135, 0.4067], [0.9135, -0.4067]];
/** 벚꽃: 처음엔 보통 탄 빠르기(무기 빠르기의 16배)로 나갔다가 틱마다 0.95배씩 원래 빠르기까지 느려짐 (빠르게 가는 만큼 날아가는 틱을 줄여 사거리는 같게) */
const BLOOM_BURST = 16;
const BLOOM_SAVED_TICKS = 300;
export const BLOOM_EASE = 0.95;
/** 어둠: 등 뒤에서 부채꼴(25도 간격)로 나가 적을 따라가 터지는 부적 5장 (피해 2배, 반경 20 안 모두 같은 피해) */
const SHADE_MISSILES = 5;
const SHADE_TURN: readonly [number, number] = [0.9063, 0.4226];
const SHADE_MUL = 2;
const SHADE_BLAST = 20;
const SHADE_SPEED = 1.6;
const SHADE_TICKS = 150;
/** 빛: 밀어내는 거리 */
const RADIANT_PUSH = 28;
/** 땅: 공격 속도 +50% 3초 · 지나가는 자리 0.25초마다 반경 18 안에 피해 25% */
export const HASTE_MUL = 1.5;
const HASTE_TICKS = 180;
const AURA_EVERY = 15;
const AURA_RADIUS = 18;
const AURA_MUL = 0.25;
/** 전용 아이템 수치 */
const RESOLVE_CHANCE = 0.2;
const RESOLVE_MUL = 0.6;
const ORB_MUL = 0.3;
const DEATH_CHANCE = 0.1;
const DOMAIN_SLOW = 0.7;
const SIPHON_HEAL = 0.03;
const PRAJNA_CHANCE = 0.3;

function roll(s: RunState, ...labels: (string | number)[]): number {
  return createRng(deriveSeed(s.seed, ...labels, s.tick)).nextFloat();
}

/** 부적 무기로 쏘는 탄에 붙이는 값 (번개는 벽 통과, 벚꽃은 큰 꽃, 땅은 주변 피해) */
export function charmFields(w: WeaponDef, dmg: number): Partial<ProjectileState> {
  if (!w.charm) return {};
  return {
    charm: w.charm,
    ...(w.charm === "spark" ? { ghost: true } : {}),
    ...(w.charm === "bloom" ? { r: 8 } : {}),
    ...(w.charm === "quake" ? { r: 4, aura: dmg * AURA_MUL } : {}),
  };
}

/** 옥구슬·유도 부적 한 발 */
function spiritShot(s: RunState, out: ProjectileState[], x: number, y: number, dx: number, dy: number, dmg: number, spirit: "orb" | "seek"): void {
  const p = s.player;
  const speed = Math.max(2, p.stats.projectileSpeed);
  out.push({
    id: s.nextId++,
    fromPlayer: true,
    x,
    y,
    prevX: x,
    prevY: y,
    r: 2,
    vx: dx * speed,
    vy: dy * speed,
    damage: dmg,
    ticksLeft: Math.ceil(Math.min(200, p.stats.range * 1.5) / speed),
    spirit,
    ...(spirit === "seek" ? { homing: true } : { pierce: 2, hitIds: [] }),
  });
}

/** 어둠의 부적 미사일: 등 뒤로 퍼져 나갔다가 적에게 휘어져 날아가 범위로 터짐 */
function shadeMissiles(s: RunState, out: ProjectileState[], dmg: number): void {
  const p = s.player;
  const [c, sn] = SHADE_TURN;
  for (let k = 0; k < SHADE_MISSILES; k++) {
    // 뒤쪽 방향을 -2·-1·0·1·2칸 돌림
    let d: [number, number] = [-p.faceX, -p.faceY];
    const turn = k - (SHADE_MISSILES - 1) / 2;
    for (let i = 0; i < Math.abs(turn); i++) d = turn > 0 ? [d[0] * c - d[1] * sn, d[0] * sn + d[1] * c] : [d[0] * c + d[1] * sn, -d[0] * sn + d[1] * c];
    const x = p.x + d[0] * (p.r + 3);
    const y = p.y + d[1] * (p.r + 3);
    out.push({ id: s.nextId++, fromPlayer: true, x, y, prevX: x, prevY: y, r: 2, vx: d[0] * SHADE_SPEED, vy: d[1] * SHADE_SPEED, damage: dmg * SHADE_MUL, ticksLeft: SHADE_TICKS, spirit: "seek", homing: true, blast: SHADE_BLAST, splash: 1 });
  }
}

/** 부적 공격 뒤: 벚꽃 비껴 나감·빠르게 출발 · 반야(첫 장이 바로 터짐) · 마음가짐(유도 부적) · 옥구슬. first = 이번 공격의 첫 탄 자리 */
export function afterCharmAttack(s: RunState, first: number, dmg: number): void {
  const p = s.player;
  const main = s.projectiles[first];
  if (!main?.charm) return;
  if (main.charm === "bloom") {
    const [c, sn] = BLOOM_DRIFT[p.attackCount % BLOOM_DRIFT.length]!;
    [main.vx, main.vy] = [main.vx * c - main.vy * sn, main.vx * sn + main.vy * c];
    main.easeTo = p.stats.projectileSpeed;
    main.vx *= BLOOM_BURST;
    main.vy *= BLOOM_BURST;
    main.ticksLeft = Math.max(60, main.ticksLeft - BLOOM_SAVED_TICKS);
  }
  if (hasPerk(p, "prajna") && roll(s, "prajna") < PRAJNA_CHANCE) main.charged = true;
  const x = p.x + p.faceX * (p.r + 2);
  const y = p.y + p.faceY * (p.r + 2);
  if (hasPerk(p, "resolve") && roll(s, "resolve") < RESOLVE_CHANCE) spiritShot(s, s.projectiles, x, y, p.faceX, p.faceY, dmg * RESOLVE_MUL, "seek");
  if (hasPerk(p, "jadeOrb")) spiritShot(s, s.projectiles, x, y, p.faceX, p.faceY, dmg * ORB_MUL, "orb");
}

/** 부적이 적에게 맞음: 적에게 붙여 세기 → 피해 → 추가 효과. out: 이번 틱에 새로 생기는 탄 */
export function charmHit(s: RunState, pr: ProjectileState, e: EnemyState, dx: number, dy: number, out: ProjectileState[]): void {
  const p = s.player;
  const kind = pr.charm!;
  // 사인: 보스·허수아비 말고 바로 쓰러짐
  if (hasPerk(p, "deathSeal") && !ENEMIES[e.kind].boss && e.kind !== "dummy" && roll(s, "deathSeal", e.id) < DEATH_CHANCE) {
    damageEnemy(s, e, e.hp, dx, dy);
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r * 3, maxTicks: 16 });
    return;
  }
  if (kind === "seal") {
    damageEnemy(s, e, pr.damage, dx, dy);
    const before = (e.sealTicks ?? 0) > 0 ? (e.seal ?? 0) : 0;
    e.seal = pr.charged ? SEAL_MAX : Math.min(SEAL_MAX, before + 1);
    e.sealTicks = SEAL_TICKS;
    e.sealDmg = pr.damage * SEAL_MUL;
    if (pr.charged || (before < SEAL_MAX && e.seal === SEAL_MAX)) triggered(s, e);
    return;
  }
  // 부적이 적에게 붙음 (다른 부적이 붙어 있었으면 떼고 새로). 추가 효과가 터지면 모두 떨어짐
  const hits = (e.charmKind === kind ? (e.charms ?? 0) : 0) + 1;
  const fire = pr.charged === true || hits >= EVERY[kind];
  e.charmKind = kind;
  e.charms = fire ? 0 : hits;
  const mul = kind === "ramp" ? (fire ? RAMP_FINISH : 1 + RAMP_STEP * (hits - 1)) : kind === "blaze" && fire ? BLAZE_FINISH : 1;
  damageEnemy(s, e, pr.damage * mul, dx, dy);
  if (kind === "blaze") ignite(e, pr.damage * BLAZE_BURN);
  if (!fire) return;
  if (kind === "smite") smite(s, e, pr.damage);
  else if (kind === "spark") damageEnemy(s, e, pr.damage, dx, dy);
  else if (kind === "blaze") blastAt(s, e.x, e.y, BLAZE_BLAST, pr.damage * mul * 0.5, { exclude: e });
  else if (kind === "frost") e.stunTicks = ENEMIES[e.kind].boss ? FROST_STUN / 2 : FROST_STUN;
  else if (kind === "bloom") blastAt(s, pr.x, pr.y, BLOOM_RADIUS, pr.damage * BLOOM_MUL, { bloom: true });
  else if (kind === "radiant" && !ENEMIES[e.kind].boss) {
    e.x += dx * RADIANT_PUSH;
    e.y += dy * RADIANT_PUSH;
    keepInRoom(e, roomGrid(s));
  } else if (kind === "shade") shadeMissiles(s, out, pr.damage);
  else if (kind === "quake") p.hasteTicks = HASTE_TICKS;
  triggered(s, e);
}

/** 추가 효과가 터짐: 표시 · 흡생 회복 */
function triggered(s: RunState, e: EnemyState): void {
  addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r * 2 + 4, maxTicks: 12 });
  if (hasPerk(s.player, "lifeSiphon")) healPlayer(s, s.player.stats.maxHp * SIPHON_HEAL);
}

/** 강력: 맞은 적과 가까운 다른 적 3명 (거리가 같으면 먼저 나온 적) */
function smite(s: RunState, hit: EnemyState, dmg: number): void {
  const near = s.enemies
    .map((e, i) => ({ e, i, d: dist2(e, hit) }))
    .filter(({ e, d }) => e !== hit && e.hp > 0 && d <= SMITE_RANGE * SMITE_RANGE)
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .slice(0, SMITE_COUNT);
  for (const { e } of near) {
    const dir = normalize(e.x - hit.x, e.y - hit.y) ?? [0, 0];
    damageEnemy(s, e, dmg, dir[0], dir[1]);
    addEffect(s, { kind: "blast", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 8, maxTicks: 10 });
  }
}

/** 영역: 사거리 안 일반 적의 이동을 줄임 (x0·y0 = 이번 틱 움직이기 전 자리) */
export function domainSlow(s: RunState, e: EnemyState, x0: number, y0: number): void {
  const p = s.player;
  // 시간 왜곡장(시간술사)도 같은 방식
  const mul = hasPerk(p, "domain") ? DOMAIN_SLOW : hasPerk(p, "warpField") ? PERKS.warpField.speed : 1;
  if (mul === 1 || ENEMIES[e.kind].boss) return;
  const reach = p.stats.range + e.r;
  if (dist2(e, p) > reach * reach) return;
  e.x = x0 + (e.x - x0) * mul;
  e.y = y0 + (e.y - y0) * mul;
}

/** 틱마다: 수양 도트 (0.5초마다 붙은 장 수만큼) */
export function updateSeals(s: RunState): void {
  const pulse = s.tick % 30 === 0;
  for (const e of s.enemies) {
    if ((e.sealTicks ?? 0) <= 0) continue;
    if (pulse && e.hp > 0 && !e.immune) {
      e.hp -= (e.sealDmg ?? 0) * (e.seal ?? 0);
      e.hitFlash = 3;
      markDot(s, e, "curse", (e.sealDmg ?? 0) * (e.seal ?? 0));
    }
    e.sealTicks = (e.sealTicks ?? 0) - 1;
    if (e.sealTicks === 0) e.seal = 0;
  }
}

/** 틱마다: 땅 부적 빨라짐 시간 · 수양 도트(0.5초마다) · 땅 부적이 지나가는 자리 피해 */
export function updateCharms(s: RunState): void {
  const p = s.player;
  if ((p.hasteTicks ?? 0) > 0) p.hasteTicks = (p.hasteTicks ?? 0) - 1;
  if (!s.tdShared) updateSeals(s);
  if (s.tick % AURA_EVERY !== 0) return;
  for (const pr of s.projectiles) {
    // 협동: 그 사람이 쏜 부적만
    if (!pr.fromPlayer || !pr.aura || (pr.shooter !== undefined && pr.shooter !== seatNo(s))) continue;
    for (const e of s.enemies) {
      const rr = AURA_RADIUS + e.r;
      if (e.hp <= 0 || dist2(e, pr) >= rr * rr) continue;
      const dir = normalize(e.x - pr.x, e.y - pr.y) ?? [0, 0];
      damageEnemy(s, e, pr.aura, dir[0], dir[1]);
    }
  }
}
