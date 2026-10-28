// 회복: 모든 체력 회복이 지나는 길 (combat.healPlayer). 의사는 체력이 가득 차면 넘친 회복이 보호막이 됨 (초과 치료).
// 의사 공격 회복(직접 피해의 일부)은 1초마다 상한이 있음
import { roleHealMul } from "./pwMatchup";
import { seatNo } from "./party";
import { recapHeal } from "./pvpRecap";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk, weaponOf } from "./util";
import { tabooDown } from "./taboo";
import { TERRAIN } from "../terrainDefs";
import { PW } from "../paewangDefs";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 보호막 최대치 (최대 체력 비율), 체력 관리면 */
  SHIELD_CAP: 0.35,
  CARE_CAP: 0.6,
  /** 공격 회복률 (직접 피해 비율), 상처 봉합이면 */
  LEECH_RATE: 0.04,
  SUTURE_RATE: 0.09,
  /** 공격 회복 초당 상한 (수혈 튜브는 더 높음) */
  LEECH_CAP: 3,
  TUBE_CAP: 4,
  LEECH_WINDOW: 60,
  /** 회복 + 표시 최소 간격 (틱) */
  PLUS_EVERY: 20,
  /** 과잉 진료: 보호막이 가득이면 공격 속도 배율 · 의사 가운: 맞은 뒤 이동 속도 배율 */
  OVERTREAT_MUL: 1.25,
  GOWN_MOVE_MUL: 1.25,
};
export { R as HEAL_RULES };

export function shieldCap(p: PlayerState): number {
  return p.stats.maxHp * (hasPerk(p, "healthCare") ? R.CARE_CAP : R.SHIELD_CAP);
}

/** 초과 치료가 켜져 있는지 (의사, 서든데스 아님) */
export function overheals(s: RunState): boolean {
  return s.player.characterId === "doctor" && !s.sudden;
}

/** 체력 회복. 의사는 체력을 먼저 채우고 남는 양을 보호막으로 */
export function heal(s: RunState, amount: number): void {
  const p = s.player;
  // 학살자: 회복이 듣지 않음 (피의 학살 흡혈만)
  if (p.characterId === "slayer") return;
  // 금기: 메마른 몸 (모든 회복 감소)
  amount *= tabooDown(s, "lessHeal");
  // 부식독 (베놈 독가스): 회복·재생 감소
  if ((p.corrode ?? 0) > 0) amount *= 1 - TERRAIN.corrodeCut;
  // 패왕전: 받는 피해를 줄인 만큼 회복도 줄임 (회복 캐릭터가 끝없이 버티지 않게)
  if (s.pvp) amount *= PW.heal * roleHealMul(s);
  if (amount <= 0) return;
  const room = Math.max(0, p.stats.maxHp - p.hp);
  // 의사: 회복하면 초록 +, 보호막이 차면 파란 + (너무 자주 띄우지 않게)
  if (p.characterId === "doctor" && s.tick - (p.plusTick ?? -R.PLUS_EVERY) >= R.PLUS_EVERY) {
    p.plusTick = s.tick;
    addEffect(s, { kind: "plus", x: p.x, y: p.y - p.r, dirX: 0, dirY: 0, size: 3, maxTicks: 30, width: overheals(s) && amount > room ? 1 : 0 });
  }
  if (s.pvp) recapHeal(s, seatNo(s), Math.min(amount, room));
  if (overheals(s) && amount > room) {
    p.hp = p.stats.maxHp;
    p.shieldPts = Math.max(p.shieldPts ?? 0, Math.min(shieldCap(p), (p.shieldPts ?? 0) + amount - room));
  } else {
    p.hp = Math.min(p.stats.maxHp, p.hp + amount);
  }
}

/** 공격 회복률 (mul: 메스 2배·수혈 3배) */
export function leechRate(p: PlayerState, mul = 1): number {
  return (hasPerk(p, "woundSuture") ? R.SUTURE_RATE : R.LEECH_RATE) * mul;
}

/** 공격 회복: 1초마다 상한까지만 (처치 회복도 같은 상한) */
export function leechHeal(s: RunState, amount: number): void {
  const p = s.player;
  if (amount <= 0) return;
  if (s.tick - (p.leechTick ?? -R.LEECH_WINDOW) >= R.LEECH_WINDOW) {
    p.leechTick = s.tick;
    p.leechSum = 0;
  }
  const cap = weaponOf(p).medic === "transfusion" ? R.TUBE_CAP : R.LEECH_CAP;
  const a = Math.min(amount, cap - (p.leechSum ?? 0));
  if (a <= 0) return;
  p.leechSum = (p.leechSum ?? 0) + a;
  heal(s, a);
}

export function medicSpeedMul(p: PlayerState): number {
  return hasPerk(p, "overtreat") && (p.shieldPts ?? 0) >= shieldCap(p) - 0.01 ? R.OVERTREAT_MUL : 1;
}

export function medicMoveMul(p: PlayerState): number {
  return (p.gownTicks ?? 0) > 0 ? R.GOWN_MOVE_MUL : 1;
}
