// 빌드 세트 효과 중 맞힐 때 · 처치할 때 · 틱마다 · 방을 정리할 때 생기는 것 (단계는 buildSets, 수치 buildSetDefs)
// 여기서 낸 피해로는 다시 터지지 않음 (busy)
import { BUILD_SETS as B } from "../buildSetDefs";
import { ENEMIES } from "../enemyDefs";
import { createRng, deriveSeed } from "../rng";
import { tier } from "./buildSets";
import { awakenTick } from "./buildAwaken";
import { blastAt as blastAt_, damageEnemy as damageEnemy_, healPlayer } from "./combat";
import { applyBleed, updateBleed } from "./gunExtras";
import { ignite } from "./status";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2 } from "./util";
import { srcFn } from "./dmgSrc";
const blastAt = srcFn("buildSetFx", () => blastAt_), damageEnemy = srcFn("buildSetFx", () => damageEnemy_);

const roll = (s: RunState, tag: string, id: number) => createRng(deriveSeed(s.seed, "set", tag, s.tick, id)).nextFloat();
const boss = (e: EnemyState) => !!ENEMIES[e.kind].boss;
let busy = false;

/** 가까운 살아 있는 적 (빼는 적, 거리 안) */
function nearest(s: RunState, x: number, y: number, range: number, skip?: EnemyState): EnemyState | null {
  let best: EnemyState | null = null;
  let bd = range * range;
  for (const e of s.enemies) {
    if (e === skip || e.hp <= 0 || e.immune) continue;
    const d = dist2(e, { x, y });
    if (d <= bd) [best, bd] = [e, d];
  }
  return best;
}

/** 번개 한 줄: 위치에서 적까지 */
function zap(s: RunState, x: number, y: number, e: EnemyState, mul: number): void {
  addEffect(s, { kind: "bolt", x, y, dirX: 0, dirY: 0, size: 2, maxTicks: 10, toX: e.x, toY: e.y, width: 2 });
  damageEnemy(s, e, s.player.stats.damage * mul, 0, 0, false);
}

/** 물튐: 맞힌 적 둘레 다른 적에게 작은 피해 (물 6: 둔화) */
function splash(s: RunState, e: EnemyState): void {
  const p = s.player;
  addEffect(s, { kind: "ring", x: e.x, y: e.y, dirX: 0, dirY: 0, size: B.water.splashR, maxTicks: 12 });
  for (const o of s.enemies) {
    if (o === e || o.hp <= 0 || dist2(o, e) > B.water.splashR ** 2) continue;
    damageEnemy(s, o, p.stats.damage * B.water.splash, 0, 0, false);
    if (tier(p, "water") >= 3 && !boss(o)) o.slowTicks = Math.max(o.slowTicks ?? 0, B.water.slow6);
  }
}

/** 맞힐 때 (baseStats.onHitExtra) */
export function setOnHit(s: RunState, e: EnemyState, dmg: number): void {
  const p = s.player;
  if (!p.setTiers || busy || dmg <= 0) return;
  busy = true;
  const t = (tag: Parameters<typeof tier>[1]) => tier(p, tag);
  if (t("fire") >= 3 && (e.burnTicks ?? 0) <= 0 && roll(s, "fire", e.id) < B.fire.ignite6) ignite(e, p.stats.damage);
  if (t("ice") >= 1 && !boss(e) && roll(s, "ice", e.id) < B.ice.slow2) e.slowTicks = Math.max(e.slowTicks ?? 0, B.ice.slowT2);
  if (t("ice") >= 3) {
    const n = p.setFrost?.[0] === e.id ? p.setFrost[1] + 1 : 1;
    p.setFrost = [e.id, n];
    if (n >= B.ice.hits6) {
      p.setFrost = undefined;
      e.stunTicks = Math.max(e.stunTicks ?? 0, boss(e) ? B.ice.bossFreeze6 : B.ice.freeze6);
      addEffect(s, { kind: "ring", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 6, maxTicks: 16 });
    }
  }
  if (t("bolt") >= 1 && roll(s, "bolt", e.id) < (t("bolt") >= 2 ? B.bolt.chance4 : B.bolt.chance2)) {
    const o = nearest(s, e.x, e.y, B.bolt.range2, e);
    if (o) zap(s, e.x, e.y, o, t("bolt") >= 2 ? B.bolt.dmg4 : B.bolt.dmg2);
  }
  if (t("poison") >= 1 && roll(s, "poison", e.id) < B.poison.chance2) {
    e.poisonTicks = Math.max(e.poisonTicks ?? 0, B.poison.ticks2);
    e.poisonDmg = Math.max(e.poisonDmg ?? 0, p.stats.damage * B.poison.dmg2);
  }
  if (t("water") >= 1 && roll(s, "water", e.id) < (t("water") >= 2 ? B.water.chance4 : B.water.chance2)) splash(s, e);
  if (t("blood") >= 2 && roll(s, "blood", e.id) < B.blood.bleed4) applyBleed(e);
  busy = false;
}

/** 처치할 때 (hiddenPerks.relicKill, 보스가 부른 적은 빼고) */
export function setKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (!p.setTiers || busy) return;
  busy = true;
  const t = (tag: Parameters<typeof tier>[1]) => tier(p, tag);
  if (t("fire") >= 2 && (e.burnTicks ?? 0) > 0) blastAt(s, e.x, e.y, B.fire.boomR4, p.stats.damage * B.fire.boom4, { exclude: e });
  if (t("poison") >= 3 && (e.poisonTicks ?? 0) > 0) {
    addEffect(s, { kind: "puff", x: e.x, y: e.y, dirX: 0, dirY: 0, size: B.poison.cloudR6, maxTicks: 30 });
    for (const o of s.enemies) {
      if (o === e || o.hp <= 0 || dist2(o, e) > B.poison.cloudR6 ** 2) continue;
      o.poisonTicks = Math.max(o.poisonTicks ?? 0, B.poison.ticks2);
      o.poisonDmg = Math.max(o.poisonDmg ?? 0, p.stats.damage * B.poison.dmg2);
    }
  }
  if (t("death") >= 2 && roll(s, "death", e.id) < B.death.reap4) {
    const o = nearest(s, e.x, e.y, B.death.range4, e);
    if (o && !boss(o) && o.kind !== "dummy") {
      o.hp = 0;
      addEffect(s, { kind: "burst", x: o.x, y: o.y, dirX: 0, dirY: 0, size: o.r * 2, maxTicks: 14 });
    }
  }
  if (t("death") >= 3) {
    p.setSouls = (p.setSoulT ?? 0) > s.tick ? Math.min(B.death.max6, (p.setSouls ?? 0) + 1) : 1;
    p.setSoulT = s.tick + B.death.ticks6;
  }
  if (t("dark") >= 3) {
    const o = nearest(s, e.x, e.y, B.dark.range6, e);
    if (o) {
      addEffect(s, { kind: "slash", x: o.x, y: o.y, dirX: 1, dirY: 0, size: o.r + 8, maxTicks: 10 });
      damageEnemy(s, o, p.stats.damage * B.dark.cut6, 0, 0, false);
    }
  }
  busy = false;
}

/** 틱마다 (baseStats.extraTick): 보호막 대기 · 대시 끝 (대지 충격파·바람) · 번개 6 · 소환 정령탄 · 피 출혈 (bleedRuns: 이미 출혈을 세는 중) */
export function setTick(s: RunState, bleedRuns: boolean): void {
  const p = s.player;
  if (!p.setTiers) return;
  const t = (tag: Parameters<typeof tier>[1]) => tier(p, tag);
  if ((p.setShieldCd ?? 0) > 0) p.setShieldCd = (p.setShieldCd ?? 0) - 1;
  const dashing = p.dashTicks > 0;
  if (p.setWasDash && !dashing) {
    p.setDashEnd = s.tick;
    if (t("earth") >= 2) blastAt(s, p.x, p.y, B.earth.quakeR4, p.stats.damage * B.earth.quake4);
  }
  p.setWasDash = dashing;
  // 각성 증강 (꼬리표 8개, sim/buildAwaken)
  awakenTick(s);
  if (s.enemies.length === 0) return;
  if (t("bolt") >= 3 && s.tick % B.bolt.every6 === 0) {
    const near = s.enemies.filter((e) => e.hp > 0 && !e.immune && dist2(e, p) <= B.bolt.range6 ** 2);
    near.sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
    for (const e of near.slice(0, B.bolt.count6)) zap(s, e.x, e.y - 40, e, B.bolt.dmg6);
  }
  if (t("summon") >= 1 && s.tick % (t("summon") >= 2 ? B.summon.every4 : B.summon.every2) === 0) {
    const e = nearest(s, p.x, p.y, B.summon.range2);
    if (e) {
      busy = true;
      zap(s, p.x, p.y - 14, e, B.summon.dmg2);
      busy = false;
      if (t("summon") >= 3) healPlayer(s, B.summon.heal6);
    }
  }
  if (t("blood") >= 2 && !bleedRuns) updateBleed(s);
}

/** 전투방을 정리했을 때 (loot.onRoomCleared): 빛 4 회복 */
export function setRoomClear(s: RunState): void {
  if (tier(s.player, "light") >= 2) healPlayer(s, s.player.stats.maxHp * B.light.clear4);
}
