// 루나틱 약점 공격 (sim/moonlight에서 부름 · 가벼운 파일: 순환 import 없게 수치·타입만 씀)
// 달빛이 없어도 기본 약점 확률 · 월광 표적(만월 각성 중엔 모든 적)에 약점이 터지면 확정 치명타 + 달빛 베기 예약 · 그냥 공격으로 맞히면 표적이 사라짐
import { LUNATIC_PERKS as K } from "../itemsLunatic";
import { LUNATIC as L } from "../weaponsLunatic";
import { isAwake } from "./stigma";
import type { EnemyState, PlayerState, RunState } from "./types";
import { hasPerk, markCrit } from "./util";

export const isLunatic = (p: PlayerState) => p.characterId === "lunatic";

/** 달빛 베기가 맞히는 중 (그 피해로 또 베기가 생기지 않게) */
let slashing = false;
export const setSlashing = (v: boolean) => {
  slashing = v;
};

/** 약점 확률: 기본 + 달빛 스택 확률 */
export const lnWeakChance = (p: PlayerState, moon: number) => L.weakBase + (hasPerk(p, "lnEye") ? K.lnEye.add : 0) + moon;

/** 이 적이 표적인지 (만월 각성 중엔 모든 적, 같은 적은 간격을 둠) */
function marked(s: RunState, e: EnemyState): boolean {
  if ((e.lnMark ?? 0) > 0) return true;
  return isAwake(s.player) && s.tick - (e.lnSlashAt ?? -9999) >= L.awakeSlashGap;
}

/** 약점이 아닌 그냥 공격으로 표적을 맞히면 표적이 사라짐 (다음 표적을 기다림) */
export function lnMiss(e: EnemyState): void {
  if (!slashing) delete e.lnMark;
}

/** 약점 공격이 터짐: 추가 피해 (급소·처형 · 표적이면 확정 치명타) · 표적이면 달빛 베기 예약 */
export function lnWeak(s: RunState, e: EnemyState, dmg: number, base: number): number {
  const p = s.player;
  let extra = dmg * (hasPerk(p, "lnDeep") ? K.lnDeep.extra : base);
  if (hasPerk(p, "lnExecute") && e.hp <= e.maxHp * K.lnExecute.hp) extra *= K.lnExecute.mul;
  if (slashing || !marked(s, e)) return extra;
  markCrit(s, e);
  delete e.lnMark;
  e.lnSlashAt = s.tick;
  const mul = L.slashMul * (hasPerk(p, "lnSlashPow") ? K.lnSlashPow.mul : 1);
  const r = L.slashR * (hasPerk(p, "lnSlashBig") ? K.lnSlashBig.r : 1);
  (p.lnStrikes ??= []).push({ k: 0, x0: e.x, y0: e.y, x: e.x, y: e.y, t: L.slashDelay, mul, r, tg: e.id });
  return extra * L.markCrit;
}
