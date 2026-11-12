// 악의 사도: 하늘에서 뒤집힌 십자가 (짓누르기 · 일곱 죄는 장판) · 사탄의 가면 · 역천의 베드로 · 쓰러진 적의 영혼을 먹어 회복 (회복약은 오히려 피해)
import { srcRun, srcFn, srcEach } from "./dmgSrc";
import { manualAim } from "./pwBasic";
import { TICK_RATE } from "../constants";
import { CHARACTERS } from "../content";
import { ENEMIES } from "../enemyDefs";
import { APOSTLE_PERKS as K } from "../itemsApostle";
import { APOSTLE, SIN_COLORS } from "../weaponsApostle";
import { fieldTick } from "./apostleFields";
import { addSoul, soulWhere } from "./apostleSouls";
import { blastAt as blastAt_, damageEnemy as damageEnemy_, dotDamage, healPlayer } from "./combat";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, weaponOf } from "./util";
import { recalcStats } from "./items";
import type { StatMod } from "../stats";
import { createRng, deriveSeed } from "../rng";
import { pctHp } from "./pctHp";
const blastAt = srcFn("apostle", () => blastAt_), damageEnemy = srcFn("apostle", () => damageEnemy_);

const roll = (s: RunState, label: string, id = 0) => createRng(deriveSeed(s.seed, label, s.tick, id)).nextFloat();

/** 공격력 (타락한 성배면 더 셈) */
function power(p: PlayerState): number {
  return p.stats.damage * ((p.apGrail ?? 0) > 0 ? K.fallenGrail.damage : 1);
}

/** 틱마다 (악의 사도 무기를 들었을 때 player에서). want = 공격 키 */
export function apostleTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if ((p.apGrail ?? 0) > 0) p.apGrail = (p.apGrail ?? 0) - 1;
  if (p.apMass) p.apMass = Math.min(p.apMass, p.shieldPts ?? 0);
  dropTick(s);
  fieldTick(s);
  doomTick(s);
  hellTick(s);
  soulTick(s);
  if (!want || p.attackCooldown > 0) return;
  const sin = weaponOf(p).sin ?? "cross";
  if (sin === "heresy") return heresy(s, speed);
  if (sin === "mask") {
    const near = s.enemies.filter((e) => e.hp > 0 && dist2(e, p) <= (APOSTLE.mask.radius + e.r) ** 2).sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
    if (near.length === 0) return;
    swing(p, speed);
    for (const e of near.slice(0, APOSTLE.mask.max)) {
      (p.apDooms ??= []).push({ id: e.id, left: APOSTLE.mask.rise, dmg: power(p) });
      addEffect(s, { kind: "apAura", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: APOSTLE.mask.rise + 8, tint: SIN_COLORS.mask });
    }
    return;
  }
  // 십자가: 사거리 안 가장 가까운 적 위 (없으면 앞쪽)
  // 패왕전 사람은 마우스 자리 (자동 조준 없음)
  const aim = manualAim(s, p.stats.range);
  const target = aim ? null : nearest(s, p.stats.range);
  swing(p, speed);
  const x = aim ? aim.x : target ? target.x : p.x + p.faceX * 50;
  const y = aim ? aim.y : target ? target.y : p.y + p.faceY * 50;
  (p.apDrops ??= []).push({ x, y, left: APOSTLE.drop, sin, dmg: power(p) });
  addEffect(s, { kind: "apCross", x, y, dirX: 0, dirY: 0, size: crushR(p), maxTicks: APOSTLE.drop + 12, tint: SIN_COLORS[sin] });
}

function swing(p: PlayerState, speed: number): void {
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
}

function nearest(s: RunState, range: number): EnemyState | null {
  const p = s.player;
  let best: EnemyState | null = null;
  let bd = Infinity;
  for (const e of s.enemies) {
    if (e.hp <= 0 || e.immune) continue;
    const d = dist2(e, p);
    if (d <= (range + e.r) ** 2 && d < bd) {
      bd = d;
      best = e;
    }
  }
  return best;
}

const area = (p: PlayerState) => (hasPerk(p, "sinWeight") ? K.sinWeight.area : 1);
const crushR = (p: PlayerState) => APOSTLE.crushR * area(p);

/** 떨어지는 십자가: 땅에 닿으면 짓누르기 또는 장판 */
function dropTick(s: RunState): void {
  const p = s.player;
  if (!p.apDrops?.length) return;
  for (const d of srcEach(p.apDrops)) {
    if (--d.left > 0) continue;
    if (d.sin === "cross") {
      for (const e of [...s.enemies]) if (e.hp > 0 && dist2(e, d) <= (crushR(p) + e.r) ** 2) hitAndSoul(s, e, d.dmg);
      addEffect(s, { kind: "blast", x: d.x, y: d.y, dirX: 0, dirY: 0, size: crushR(p), maxTicks: 12, tint: SIN_COLORS.cross });
      continue;
    }
    const fields = (p.apFields ??= []);
    fields.push({ x: d.x, y: d.y, r: APOSTLE.fieldR * area(p), left: Math.round(APOSTLE.fieldTicks * (hasPerk(p, "longCurse") ? K.longCurse.ticks : 1)), t: 0, sin: d.sin, dmg: d.dmg });
    if (fields.length > APOSTLE.maxFields) fields.shift();
  }
  p.apDrops = p.apDrops.filter((d) => d.left > 0);
}

/** 직접 때림: 보스면 확률로 둘레에 영혼 */
function hitAndSoul(s: RunState, e: EnemyState, dmg: number, dx = 0, dy = 0): void {
  damageEnemy(s, e, dmg, dx, dy);
  if (ENEMIES[e.kind].boss && roll(s, "bossSoul", e.id) < APOSTLE.bossSoul) {
    const a = roll(s, "soulAt", e.id) * Math.PI * 2;
    addSoul(s, e.x + Math.cos(a) * (e.r + 14), e.y + Math.sin(a) * (e.r + 14));
  }
}

/** 영혼: 닿으면 먹어 회복 (영혼 끌림이면 멀리서 끌려옴) · 다른 방이면 사라짐 */
function soulTick(s: RunState): void {
  const p = s.player;
  if (!p.apSouls?.length) return;
  const here = soulWhere(s);
  const magnet = hasPerk(p, "soulMagnet");
  const pick = p.r + APOSTLE.soulPick + (magnet ? K.soulMagnet.pick : 0);
  p.apSouls = p.apSouls.filter((o) => {
    if (o.where !== here || --o.left <= 0) return false;
    const d = Math.sqrt(dist2(o, p));
    if (magnet && d < pick * 2 && d > 0) {
      o.x += ((p.x - o.x) / d) * K.soulMagnet.pull;
      o.y += ((p.y - o.y) / d) * K.soulMagnet.pull;
    }
    if (d > pick) return true;
    eatSoul(s, o.x, o.y, o.light);
    return false;
  });
}

function eatSoul(s: RunState, x: number, y: number, light?: boolean): void {
  const p = s.player;
  healPlayer(s, p.stats.maxHp * (hasPerk(p, "soulFeast") ? K.soulFeast.heal : APOSTLE.soulHeal));
  // 먹은 영혼만큼 공격력이 쌓임 (보스가 부른 적의 옅은 영혼은 회복만)
  if (!light) {
    p.apEaten = (p.apEaten ?? 0) + 1;
    recalcStats(s);
  }
  if (hasPerk(p, "bloodPact")) p.hasteTicks = Math.max(p.hasteTicks ?? 0, K.bloodPact.ticks);
  if (hasPerk(p, "soulBurst")) srcRun(s, "soulBurst", () => blastAt(s, x, y, K.soulBurst.radius, power(p) * K.soulBurst.mul));
  addEffect(s, { kind: "apSoul", x, y, dirX: 0, dirY: 0, size: 8, maxTicks: 18 });
}

/** 사탄의 가면: 오라가 다 올라오면 죽음 (최대 체력의 5%, 보스는 1/5의 5% + 공격력 10%) */
export function doomTick(s: RunState): void {
  const p = s.player;
  if (!p.apDooms?.length) return;
  for (const d of srcEach(p.apDooms)) {
    if (--d.left > 0) continue;
    const e = s.enemies.find((x) => x.id === d.id && x.hp > 0);
    if (!e) continue;
    // 보스는 최대 체력의 1/5 기준 (연습장 허수아비는 체력 1000인 보스처럼)
    const base = e.kind === "dummy" ? 1000 / APOSTLE.mask.bossDiv : ENEMIES[e.kind].boss ? pctHp(e) / APOSTLE.mask.bossDiv : pctHp(e);
    dotDamage(s, e, "death", base * APOSTLE.mask.pct + d.dmg * APOSTLE.mask.mul);
    if (ENEMIES[e.kind].boss && roll(s, "bossSoul", e.id) < APOSTLE.bossSoul) addSoul(s, e.x + e.r + 10, e.y);
  }
  p.apDooms = p.apDooms.filter((d) => d.left > 0);
}

/** 역천의 베드로: 앞쪽을 하늘색 불꽃으로 (공격력 + 내 최대 체력의 10%), 30% 업화 */
function heresy(s: RunState, speed: number): void {
  const p = s.player;
  swing(p, speed);
  const r = p.stats.range;
  const arc = weaponOf(p).arcCos ?? 0.2;
  const dmg = power(p) + p.stats.maxHp * APOSTLE.heresy.hpMul;
  for (const e of [...s.enemies]) {
    if (e.hp <= 0) continue;
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.hypot(dx, dy);
    if (d > r + e.r || (d > 1 && (dx * p.faceX + dy * p.faceY) / d < arc)) continue;
    hitAndSoul(s, e, dmg, p.faceX, p.faceY);
    if (roll(s, "hellfire", e.id) < APOSTLE.heresy.chance) {
      e.apHell = APOSTLE.heresy.ticks;
      e.apHellDmg = power(p) * APOSTLE.heresy.mul;
    }
  }
  addEffect(s, { kind: "swing", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 10, width: 3, tint: SIN_COLORS.heresy });
  addEffect(s, { kind: "apFlame", x: p.x + p.faceX * r * 0.6, y: p.y + p.faceY * r * 0.6, dirX: p.faceX, dirY: p.faceY, size: r * 0.6, maxTicks: 14, tint: SIN_COLORS.heresy });
}

/** 업화: 0.5초마다 하늘색 불꽃 피해 */
function hellTick(s: RunState): void {
  for (const e of s.enemies) {
    if ((e.apHell ?? 0) <= 0 || e.hp <= 0) continue;
    e.apHell = (e.apHell ?? 0) - 1;
    if (e.apHell % 30 === 0) dotDamage(s, e, "hellfire", e.apHellDmg ?? 0);
  }
}

/** 회복약: 악의 사도는 회복 대신 그만큼 피해 (쓰러지지는 않음) · 타락한 성배면 피해 없이 공격력 */
export function apostlePotion(s: RunState, amount: number): void {
  const p = s.player;
  if (hasPerk(p, "fallenGrail")) {
    p.apGrail = K.fallenGrail.ticks;
    return;
  }
  p.hp = Math.max(1, p.hp - amount);
  addEffect(s, { kind: "hit", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 6, maxTicks: 10 });
}

/** 먹은 영혼으로 오른 공격력 (사탄의 가면을 들면 하나마다 더 많이) */
export function soulAttack(p: PlayerState): number {
  if (p.characterId !== "apostle") return 0;
  return (p.apEaten ?? 0) * (weaponOf(p).sin === "mask" ? APOSTLE.maskSoulDamage : APOSTLE.soulDamage);
}

/** 먹은 영혼만큼 공격력 + (sim/items.recalcStats에서 더함). 사탄의 가면은 같은 비율로 공격 속도도 오름 */
export function apostleMods(p: PlayerState): StatMod[] {
  const add = soulAttack(p);
  if (add <= 0) return [];
  const mods: StatMod[] = [{ stat: "damage", add }];
  if (weaponOf(p).sin === "mask") mods.push({ stat: "attackSpeed", mul: 1 + add / CHARACTERS.apostle.damage });
  return mods;
}

/** 연습장 초기화 */
export function resetApostle(p: PlayerState): void {
  p.apFields = p.apDrops = p.apSouls = p.apDooms = p.apGrail = p.apMass = p.apEaten = undefined;
}

