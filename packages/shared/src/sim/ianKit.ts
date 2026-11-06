// 이안 공용 도우미: 맞히기(급소·인과율 되돌림 쌓기) · 기록 · 속박 · 받는 피해 · 맞음·처치 · 스킬 대기
import { IAN_PERKS as K } from "../itemsIan";
import { createRng, deriveSeed } from "../rng";
import { IAN as I } from "../weaponsIan";
import { inCircle, isBoss, stun, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

export const isIan = (p: PlayerState) => p.characterId === "ian";

/** 급소 피해 배율 */
const vitalMul = (p: PlayerState) => (hasPerk(p, "iaVital") ? K.iaVital.mul : I.vitalMul);

/** 한 번 맞힘: 속박된 적이나 force면 급소 · 인과율 속박 중이면 준 피해 일부를 쌓아 둠 · push 음수면 끌어당김 */
export function iaHit(s: RunState, e: EnemyState, mul: number, push = 0, force = false): void {
  const p = s.player;
  if (e.hp <= 0) return;
  const vital = force || (e.iaBind ?? 0) > 0;
  let dmg = p.stats.damage * mul * (vital ? vitalMul(p) : 1);
  if (vital) {
    addEffect(s, { kind: "iaVital", x: e.x, y: e.y - 4, dirX: p.faceX, dirY: p.faceY, size: e.r + 6, maxTicks: 18 });
    // 마지막 문장: 급소로 체력이 조금 남은 적을 바로 끝냄
    if (hasPerk(p, "iaReaper") && !isBoss(e) && e.hp - dmg <= e.maxHp * K.iaReaper.below) dmg = Math.max(dmg, e.hp * 4);
  }
  if ((p.iaLaw ?? 0) > 0) e.iaDebt = (e.iaDebt ?? 0) + dmg * (hasPerk(p, "iaLaw") ? K.iaLaw.debt : I.lawDebt);
  if (push < 0 && !isBoss(e)) {
    // 실로 끌어당김 (나에게 너무 붙지 않게)
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(-push, Math.max(0, d - p.r - e.r - 4));
    e.x += (dx / d) * k;
    e.y += (dy / d) * k;
  }
  strike(s, e, dmg, Math.max(0, push));
}

/** 속박: 멈춤(보스는 멈추지 않고 짧게) · 받는 피해 증가 */
export function bind(s: RunState, e: EnemyState, ticks: number): void {
  const p = s.player;
  const t = Math.round(ticks * (hasPerk(p, "iaLedger") ? K.iaLedger.mul : 1) * (isBoss(e) ? I.bindBoss : 1));
  e.iaBind = Math.max(e.iaBind ?? 0, t);
  stun(e, t);
  addEffect(s, { kind: "iaBind", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r, maxTicks: 24 });
}

/** 기록 쌓기: 5가 되면 속박 (기록을 모두 지움) */
export function addRec(s: RunState, e: EnemyState, n: number, chain = true): void {
  const p = s.player;
  if (e.hp <= 0) return;
  if (hasPerk(p, "iaQuill") && createRng(deriveSeed(s.seed, "iaQuill", s.tick, e.id)).nextFloat() < K.iaQuill.chance) n++;
  e.iaRec = Math.min(I.recMax, (e.iaRec ?? 0) + n);
  addEffect(s, { kind: "iaRec", x: e.x, y: e.y - e.r - 6, dirX: 0, dirY: 0, size: e.iaRec, maxTicks: 18 });
  if (e.iaRec < I.recMax) return;
  e.iaRec = 0;
  bind(s, e, I.bindTicks);
  if (chain && hasPerk(p, "iaChain")) for (const o of inCircle(s, e.x, e.y, K.iaChain.r)) if (o !== e) addRec(s, o, K.iaChain.rec, false);
}

/** 속박된 적이 받는 피해 배율 (combat.damageEnemy) */
export function ianTaken(s: RunState, e: EnemyState): number {
  if (!e.iaBind) return 1;
  return 1 + (hasPerk(s.player, "iaClause") ? K.iaClause.taken : I.bindTaken);
}

/** 맞은 뒤 (classTaken.afterHurt): 침묵의 서약 시계를 처음으로 */
export function ianHurt(s: RunState, env: boolean): void {
  if (isIan(s.player) && !env) s.player.iaCalm = 0;
}

/** 처치할 때 (hiddenPerks.relicKill): 봉인 낙관 · 신의 부름 */
export function ianKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (!isIan(p)) return;
  if (hasPerk(p, "iaSeal") && (e.iaBind ?? 0) > 0) {
    for (const o of inCircle(s, e.x, e.y, K.iaSeal.r)) if (o !== e) addRec(s, o, K.iaSeal.rec);
  }
  if (hasPerk(p, "iaCall") && p.iaCd) p.iaCd = p.iaCd.map((c) => Math.max(0, c - K.iaCall.cut));
}

/** 스킬마다 대기 틱 (아이템 반영) */
export function iaCooldown(p: PlayerState, i: number): number {
  let base = I.cooldowns[i] ?? 0;
  if (i === 1 && hasPerk(p, "iaShadow")) base *= K.iaShadow.cd;
  if (i === 3 && hasPerk(p, "iaAbsolute")) base = K.iaAbsolute.cd;
  return Math.round(base * (hasPerk(p, "iaVerse") ? K.iaVerse.cd : 1));
}

/** 화면용: 스킬마다 남은 대기 0~1 (0 = 쓸 수 있음) */
export function ianSkills(p: PlayerState): number[] {
  return [0, 1, 2, 3].map((i) => Math.min(1, (p.iaCd?.[i] ?? 0) / Math.max(1, iaCooldown(p, i))));
}
