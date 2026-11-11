// 베아트리스 공용 도우미: 화염 계수 · 맞히기(물리 + 화염) · 악 · 화상 · 받는 피해 · 회복 불가 · 스킬 대기
import { srcRun } from "./dmgSrc";
import { BEATRICE_PERKS as K } from "../itemsBeatrice";
import { createRng, deriveSeed } from "../rng";
import { BEATRICE as B } from "../weaponsBeatrice";
import type { EnemyKind } from "../content";
import { alive, inCircle, isBoss, strike } from "./s2Kit";
import { heal } from "./heal";
import { statusHit } from "./statusHit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk } from "./util";

export const isBea = (p: PlayerState) => p.characterId === "beatrice";
/** 잃은 체력 비율 (0 = 가득, 1 = 바닥) */
const lost = (p: PlayerState) => Math.max(0, Math.min(1, 1 - p.hp / Math.max(1, p.stats.maxHp)));

/** 화염 계수 (공격력 배율): 체력이 적을수록 높음 · 자애 중에는 한계를 넘어 400%까지 */
export function fireCoef(p: PlayerState): number {
  const top = (p.btGrace ?? 0) > 0 ? B.fireUlt : B.fireMax;
  const add = hasPerk(p, "btCore") ? K.btCore.fire : 0;
  return Math.min(top, B.fireMin + add + (top - B.fireMin) * lost(p));
}

/** 재생력 (체력이 적을수록 높음, 최대 30 · 백은의 갑주로 맞은 뒤 잠깐 더) */
export function btRegen(p: PlayerState): number {
  const max = hasPerk(p, "btUndying") ? K.btUndying.regen : B.regenMax;
  return max * lost(p) + ((p.btSilverT ?? 0) > 0 ? K.btSilver.regen : 0);
}

/** 한 번 맞힘: 물리(공격력 × phys) + 화염(공격력 × 화염 계수 × fire, 불꽃색 숫자) */
export function btHit(s: RunState, e: EnemyState, phys: number, fire: number, push = 0): void {
  const p = s.player;
  const boss = hasPerk(p, "btBreaker") && isBoss(e) ? K.btBreaker.boss : 1;
  if (phys > 0) strike(s, e, p.stats.damage * phys * boss, push);
  if (fire > 0 && e.hp > 0) statusHit(s, e, "burn", p.stats.damage * fireCoef(p) * fire * boss, 0, 0, false);
  flare(s, e);
}

/** 화상 겹 더하기 (최대 5, 불씨 8) */
export function addBurn(e: EnemyState, p: PlayerState, n = 1): void {
  const max = hasPerk(p, "btEmber") ? K.btEmber.max : B.burnMax;
  e.btBurn = Math.min(max, (e.btBurn ?? 0) + n);
  e.btBurnT = B.burnTicks;
}

/** 홍염: 화상이 가득 겹친 적이 쓰러지면 불꽃으로 터짐 */
function flare(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (e.hp > 0 || !hasPerk(p, "btFlare") || (e.btBurn ?? 0) < B.burnMax) return;
  e.btBurn = 0;
  for (const o of inCircle(s, e.x, e.y, K.btFlare.r)) statusHit(s, o, "burn", p.stats.damage * fireCoef(p) * K.btFlare.mul, 0, 0, false);
  addEffect(s, { kind: "btFlare", x: e.x, y: e.y, dirX: 0, dirY: 0, size: K.btFlare.r, maxTicks: 22 });
}

/** 화상 피해 (틱마다) */
export function burnTick(s: RunState): void {
  const p = s.player;
  for (const e of s.enemies) {
    if (!e.btBurnT || e.hp <= 0) continue;
    e.btBurnT--;
    if (e.btBurnT % B.burnEvery === 0) {
      const mul = hasPerk(p, "btScorch") ? K.btScorch.mul : 1;
      statusHit(s, e, "burn", p.stats.damage * fireCoef(p) * B.burnMul * (e.btBurn ?? 0) * mul, 0, 0, false);
      addEffect(s, { kind: "btBurn", x: e.x, y: e.y - e.r, dirX: 0, dirY: 0, size: e.r, maxTicks: 18 });
      flare(s, e);
    }
    if (e.btBurnT <= 0) delete e.btBurn;
  }
}

/** 악 쌓기: 10이 되면 처단 시작 (악을 모두 지움) */
export function addEvil(s: RunState, e: EnemyState, n: number): void {
  const p = s.player;
  if (e.hp <= 0) return;
  if (hasPerk(p, "btGrudge") && createRng(deriveSeed(s.seed, "btGrudge", s.tick, e.id)).nextFloat() < K.btGrudge.chance) n++;
  e.btEvil = Math.min(B.evilMax, (e.btEvil ?? 0) + n);
  addEffect(s, { kind: "btEvil", x: e.x, y: e.y - e.r - 6, dirX: 0, dirY: 0, size: e.btEvil, maxTicks: 20 });
  if (e.btEvil < B.evilMax) return;
  e.btEvil = 0;
  const ex = hasPerk(p, "btExecutor");
  (p.btExecs ??= []).push({ id: e.id, left: B.execN + (ex ? K.btExecutor.more : 0), gap: 0, mul: ex ? K.btExecutor.mul : 1 });
  addPurge(s, B.evilMax);
  if (hasPerk(p, "btOath")) srcRun(s, "btOath", () => heal(s, p.stats.maxHp * K.btOath.heal));
  if (hasPerk(p, "btWitness")) for (const o of inCircle(s, e.x, e.y, K.btWitness.r)) if (o !== e) addEvil(s, o, K.btWitness.evil);
}

/** 지운 악 더하기 (처단·처치): 심판에 필요한 만큼 모이면 심판 예고 */
function addPurge(s: RunState, n: number): void {
  const p = s.player;
  p.btPurged = (p.btPurged ?? 0) + n;
  const at = hasPerk(p, "btVerdict") ? K.btVerdict.at : B.judgeAt;
  if (p.btPurged < at || p.btJudge) return;
  p.btPurged -= at;
  p.btJudge = B.judgeWarn;
  addEffect(s, { kind: "btJudgeWarn", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 1, maxTicks: B.judgeWarn });
}

/** 악이 쌓인 적을 쓰러뜨리면 그 악이 나에게 들어옴 (hiddenPerks.relicKill) */
export function beaKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  const n = e.btEvil ?? 0;
  if (!isBea(p) || n <= 0) return;
  e.btEvil = 0;
  addEffect(s, { kind: "btSoul", x: e.x, y: e.y, toX: p.x, toY: p.y, dirX: 0, dirY: 0, size: n, maxTicks: 26 });
  addPurge(s, n);
}

/** 악이 쌓인 적이 받는 피해 배율 (combat.damageEnemy) */
export function evilTaken(s: RunState, e: EnemyState): number {
  if (!e.btEvil) return 1;
  return 1 + e.btEvil * (hasPerk(s.player, "btSin") ? K.btSin.taken : B.evilTaken);
}

/** 맞은 뒤 (classTaken.afterHurt): 나를 때린 적에게 악 하나 (지형·상태이상 피해는 빼고) */
export function beaHurt(s: RunState, from: EnemyKind | undefined, env: boolean): void {
  const p = s.player;
  if (!isBea(p) || env) return;
  if (hasPerk(p, "btSilver")) p.btSilverT = K.btSilver.ticks;
  let best: EnemyState | null = null;
  let bd = B.blameR ** 2;
  for (const e of alive(s)) {
    if (from && e.kind !== from) continue;
    const d = dist2(e, p);
    if (d < bd || (from && !best)) [best, bd] = [e, d];
  }
  if (best) addEvil(s, best, 1);
}

/** 받는 피해 배율 (classTaken): 자애 중에는 체력이 1에서 줄지 않음 · 서약 · 백은의 갑주 */
export function beaTaken(p: PlayerState): number {
  if (!isBea(p)) return 1;
  if ((p.btGrace ?? 0) > 0) return 0;
  const vow = hasPerk(p, "btVow") && p.hp <= p.stats.maxHp * K.btVow.below ? K.btVow.taken : 1;
  return vow * (hasPerk(p, "btSilver") ? K.btSilver.taken : 1);
}

/** 회복이 막혔는지 (자애 중·자애 뒤 10초, sim/heal) */
export const healBlocked = (p: PlayerState) => isBea(p) && ((p.btGrace ?? 0) > 0 || (p.btNoHeal ?? 0) > 0);

/** 스킬마다 대기 틱 (아이템 반영) */
export function btCooldown(p: PlayerState, i: number): number {
  const base = i === 3 && hasPerk(p, "btMercy") ? K.btMercy.cd : (B.cooldowns[i] ?? 0);
  return Math.round(base * (hasPerk(p, "btSwift") ? K.btSwift.cd : 1));
}

/** 화면용: 스킬마다 남은 대기 0~1 (0 = 쓸 수 있음) */
export function beatriceSkills(p: PlayerState): number[] {
  return [0, 1, 2, 3].map((i) => Math.min(1, (p.btCd?.[i] ?? 0) / Math.max(1, btCooldown(p, i))));
}
