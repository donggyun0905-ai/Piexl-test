// 학살자(헬리오스): 피에 젖은 대낫. 한 번 누르면 5연속 콤보가 매우 빠르게 나가고, 기술마다 체력 5를 씀 (회복약·회복은 듣지 않음)
// 체력이 낮을수록 공격력 ↑ · 맞히면 게이지가 차고 가득 차면 10초 '피의 학살'(흡혈 10% · 공격력·공격 속도 +25% · 이동 속도 +0.5)
// 공용 아이템은 나오지 않음 (sim/loot). 기술은 slayerMoves, 수치는 weaponsSlayer.SLAYER, 아이템은 itemsSlayer
import { trialNoHeal } from "./trialFoes";
import { TICK_RATE } from "../constants";
import { SLAYER_PERKS as K } from "../itemsSlayer";
import { SLAYER as S } from "../weaponsSlayer";
import { blastAt } from "./combat";
import { rushTick, strike } from "./s2Kit";
import { scytheMove } from "./slayerMoves";
import { taintBlocksRage } from "./faction";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, weaponOf } from "./util";

const raging = (p: PlayerState) => (p.slRage ?? 0) > 0;

/** 체력이 낮을수록 공격력 (체력 0에 가까우면 2배, 광전사 2.5배) · 피의 학살 +25% */
export function slayerDmgMul(p: PlayerState): number {
  const max = hasPerk(p, "slBerserk") ? K.slBerserk.max : S.lowHpMax;
  const low = 1 + (1 - Math.max(0, p.hp) / p.stats.maxHp) * (max - 1);
  return low * (raging(p) ? S.rageDmg : 1);
}
const power = (p: PlayerState) => p.stats.damage * slayerDmgMul(p);

/** 맞힐 때마다: 게이지 · 피의 학살 흡혈 · 대학살 */
export function slayerOnHit(s: RunState, e: EnemyState, dmg: number): void {
  const p = s.player;
  if (p.characterId !== "slayer") return;
  // 흡혈: 피의 학살 중에만 입힌 피해의 50% (갈증 +15%) · 평소엔 게이지가 참
  if (raging(p)) p.hp = trialNoHeal(s) ? p.hp : Math.min(p.stats.maxHp, p.hp + dmg * (S.leech + (hasPerk(p, "slThirst") ? K.slThirst.leech : 0)));
  else {
    p.slGauge = Math.min(S.gaugeMax, (p.slGauge ?? 0) + S.gaugePerHit * (hasPerk(p, "slMadness") ? K.slMadness.mul : 1));
  }
  if (e.hp > 0) return;
  if (!raging(p) && hasPerk(p, "slGrin")) p.slGauge = Math.min(S.gaugeMax, (p.slGauge ?? 0) + K.slGrin.gauge);
  if (raging(p) && hasPerk(p, "slMassacre")) blastAt(s, e.x, e.y, K.slMassacre.r, power(p) * K.slMassacre.mul);
}

const hit = (s: RunState) => (e: EnemyState, dmg: number, push = 0) => {
  strike(s, e, dmg, push);
  slayerOnHit(s, e, dmg);
};

/** 받는 피해 +50% (classTaken) */
export const slayerTaken = (p: PlayerState) => (p.characterId === "slayer" ? S.taken : 1);

/** 피의 학살 중 이동 속도 배율 (player 이동) */
export function slayerMoveMul(p: PlayerState): number {
  return raging(p) && p.stats.moveSpeed > 0 ? (p.stats.moveSpeed + S.rageMove) / p.stats.moveSpeed : 1;
}

/** 마지막 숨: 한 판에 한 번 체력 1로 버팀 (run.checkDeath) */
export function slayerSave(s: RunState): void {
  const p = s.player;
  if (p.hp > 0 || p.characterId !== "slayer" || p.slSaved || !hasPerk(p, "slLastBreath")) return;
  p.slSaved = true;
  p.hp = 1;
  p.invulnTicks = Math.max(p.invulnTicks, 60);
  addEffect(s, { kind: "slRage", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 20, maxTicks: 24 });
}

/** 틱마다 (대낫을 들었을 때 player에서) */
export function slayerTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.s2Rush) rushTick(s, (e) => slayerOnHit(s, e, p.s2Rush?.dmg ?? 0));
  // 피의 학살
  if (raging(p)) p.slRage = (p.slRage ?? 0) - 1;
  else if ((p.slGauge ?? 0) >= S.gaugeMax && !taintBlocksRage(p)) {
    p.slGauge = 0;
    p.slRage = S.rageTicks + (hasPerk(p, "slPact") ? K.slPact.ticks : 0);
    addEffect(s, { kind: "slRage", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 30 });
  }
  const rage = raging(p) ? S.rageSpeed : 1;
  // 콤보 진행: 기술 사이 틱마다 다음 기술 (체력 소모)
  const c = p.slCombo;
  if (c) {
    if (--c.t > 0) return;
    const combo = weaponOf(p).combo5 ?? (["slash3", "raid", "line", "wave3", "grand"] as const);
    // 기술마다 체력 소모 (피의 학살 중엔 없음, 체력 20 아래로는 내려가지 않음)
    const cost = raging(p) ? 0 : hasPerk(p, "slNumb") ? K.slNumb.cost : S.hpCost;
    p.hp -= Math.min(cost, Math.max(0, p.hp - S.hpFloor));
    scytheMove(s, combo[c.i]!, power(p), hit(s), c.i);
    c.i++;
    c.t = Math.max(1, Math.round(S.moveGap / rage));
    if (c.i >= combo.length) {
      // 콤보가 끝나면 보통 공격 속도만큼 쉬고 다시 처음부터
      delete p.slCombo;
      p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
    }
    return;
  }
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  p.attackCount++;
  p.slCombo = { i: 0, t: 1, dmg: 0 };
}

/** 연습장 등에서 다시 시작할 때 */
export function resetSlayer(p: PlayerState): void {
  for (const k of ["slCombo", "slGauge", "slRage", "slSaved"] as const) delete p[k];
}
