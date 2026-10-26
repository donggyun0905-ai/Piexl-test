// 아티팩터(테라코어, 시즌 2): 팔에 푸른빛 문신이 가득한 제작자. 무기는 리펄스 총 하나 (맞은 자리를 터뜨리며 밀어냄)
// 제작 게이지: 쓰러뜨린 적이 쌓이면 아이템 하나를 만듦 (보통 아이템, 가끔 제작으로만 나오는 숨겨진 아이템 5개 중 하나)
// 수치는 weaponsArtifacter.ARTIFACTER, 아이템은 itemsArtifacter
import { TICK_RATE } from "../constants";
import { ARTIFACTER_HIDDEN, ARTIFACTER_PERKS as K } from "../itemsArtifacter";
import type { PassiveId } from "../items";
import { createRng, deriveSeed } from "../rng";
import { ARTIFACTER as A } from "../weaponsArtifacter";
import { nearest } from "./brawlMoves";
import { blastAt } from "./combat";
import { recalcStats } from "./items";
import { passivePool } from "./loot";
import { inCircle, isBoss, shoot, stun } from "./s2Kit";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 반발 보호막 · 수호 골렘 문신: 받는 피해 (classTaken) */
export function artifacterTaken(p: PlayerState): number {
  if (p.characterId !== "artifacter") return 1;
  return (hasPerk(p, "afShield") ? K.afShield.taken : 1) * (hasPerk(p, "afGolem") ? K.afGolem.taken : 1);
}

/** 불사의 문신: 한 번 되살아남 (run.checkDeath) */
export function artifacterRevive(s: RunState): void {
  const p = s.player;
  if (p.hp > 0 || p.characterId !== "artifacter" || !hasPerk(p, "afPhoenix") || p.afRevived || s.sudden) return;
  p.afRevived = true;
  p.hp = Math.ceil(p.stats.maxHp * K.afPhoenix.hp);
  p.invulnTicks = 120;
  addEffect(s, { kind: "afCraft", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 40, tint: "#ff8a3a" });
}

/** 아이템 하나 만들기 (숨겨진 아이템 확률 · 이미 가진 숨겨진 아이템은 빼고) */
function craftOne(s: RunState): void {
  const p = s.player;
  const n = (p.afMade = (p.afMade ?? 0) + 1);
  const rng = createRng(deriveSeed(s.seed, "afCraft", n));
  const chance = A.hiddenChance * (hasPerk(p, "afLucky") ? K.afLucky.mul : 1);
  const hidden = ARTIFACTER_HIDDEN.filter((id) => !p.passives.includes(id));
  let id: PassiveId | undefined;
  let secret = false;
  if (hidden.length && rng.nextFloat() < chance) {
    id = rng.pick(hidden);
    secret = true;
  } else {
    const pool = passivePool(s);
    if (pool.length) id = rng.pick(pool);
  }
  if (!id) return;
  p.passives.push(id);
  addEffect(s, { kind: "afCraft", x: p.x, y: p.y - 10, dirX: 0, dirY: 0, size: secret ? 26 : 16, maxTicks: 60, tint: secret ? "#ffd040" : "#6ab8ff", width: secret ? 1 : 0 });
}

/** 제작 게이지: 쓰러뜨린 적마다 (가득이면 만듦) */
function gain(s: RunState, kills: number): void {
  const p = s.player;
  if (kills <= 0) return;
  const mul = (hasPerk(p, "afCrafter") ? K.afCrafter.mul : 1) * (hasPerk(p, "afInfinity") ? K.afInfinity.mul : 1);
  p.afGauge = (p.afGauge ?? 0) + kills * mul;
  let made = false;
  while (p.afGauge >= A.craftEvery) {
    p.afGauge -= A.craftEvery;
    for (let i = 0; i < (hasPerk(p, "afBlueprint") ? K.afBlueprint.n : 1); i++) craftOne(s);
    made = true;
  }
  if (!made) return;
  recalcStats(s);
  if (hasPerk(p, "afSurge")) p.afSurge = K.afSurge.ticks;
}

/** 반발탄이 맞았을 때 (s2Hits): 둘레를 터뜨리며 밀어냄 (특이점: 먼저 끌어당김) */
export function repulsorHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  const p = s.player;
  if (p.characterId !== "artifacter") return;
  const sing = hasPerk(p, "afSingularity");
  const r = A.blastR * (hasPerk(p, "afWide") ? K.afWide.r : 1) * (sing ? K.afSingularity.r : 1);
  const around = inCircle(s, e.x, e.y, r);
  if (sing) for (const o of around) if (!isBoss(o)) {
    o.x += (e.x - o.x) * K.afSingularity.pull;
    o.y += (e.y - o.y) * K.afSingularity.pull;
  }
  const push = A.push * (hasPerk(p, "afPush") ? K.afPush.push : 1);
  blastAt(s, e.x, e.y, r, pr.damage * 0.6, { exclude: e, push });
  if (hasPerk(p, "afPush")) for (const o of around) stun(o, K.afPush.stun);
  addEffect(s, { kind: "afBlast", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: 14, width: sing ? 1 : 0 });
  gain(s, [e, ...around].filter((o, i, all) => o.hp <= 0 && all.indexOf(o) === i).length);
}

/** 틱마다 (리펄스 총을 들었을 때 player에서) */
export function artifacterTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if ((p.afSurge ?? 0) > 0) p.afSurge!--;
  if (!want || p.attackCooldown > 0) return;
  const surge = (p.afSurge ?? 0) > 0 ? K.afSurge.speed : 1;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / (speed * surge)));
  p.attackCount++;
  const t = nearest(s, p.stats.range * 1.2);
  if (t) {
    const d = Math.hypot(t.x - p.x, t.y - p.y) || 1;
    p.faceX = (t.x - p.x) / d;
    p.faceY = (t.y - p.y) / d;
  }
  const dmg = p.stats.damage * (hasPerk(p, "afFocus") ? K.afFocus.mul : 1);
  const n = hasPerk(p, "afDouble") ? 2 : 1;
  for (let i = 0; i < n; i++) shoot(s, (i - (n - 1) / 2) * 0.12, { damage: dmg, spirit: "afBlast", r: 4, range: p.stats.range });
  addEffect(s, { kind: "afMuzzle", x: p.x + p.faceX * 6, y: p.y - 4 + p.faceY * 6, dirX: p.faceX, dirY: p.faceY, size: 6, maxTicks: 8 });
}

/** 연습장 등에서 다시 시작할 때 */
export function resetArtifacter(p: PlayerState): void {
  for (const k of ["afGauge", "afSurge"] as const) delete p[k];
}

/** 제작 게이지 0~1 (화면용) */
export const artifacterGauge = (p: PlayerState) => Math.min(1, (p.afGauge ?? 0) / A.craftEvery);
