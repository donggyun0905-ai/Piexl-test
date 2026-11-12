// 기어스 공용 도우미 (sim/gears·geBall·geProcs·classTaken·items가 같이 씀): 확률 · 받는 피해 · 이동 속도 · 공격력 아이템 반만 (한 대 맞히기는 geHit)
// 가벼운 것만 불러옴 (classTaken·items가 부름)
import { GE_PERKS as K } from "../itemsGears";
import { createRng, deriveSeed } from "../rng";
import type { StatMod } from "../stats";
import { GE_ATTACK as A, GE_BALL as B } from "../weaponsGears";
import type { RunState } from "./types";
import { reachOf } from "./util";

type P = RunState["player"];

export const isGears = (p: P) => p.characterId === "gears";
export const hasGe = (p: P, id: string) => p.passives.includes(id as never);

/** 시드 확률 (굴릴 때마다 다른 값) */
export function geRoll(s: RunState, tag: string): number {
  const p = s.player;
  p.geRolls = (p.geRolls ?? 0) + 1;
  return createRng(deriveSeed(s.seed, tag, s.tick, p.geRolls)).nextFloat();
}

/** 크기 배율 (사거리 증가) */
export const geSize = (p: P) => reachOf(p);

/** 주는 피해 배율 (철옹성: 보호막이 있을 때) */
export const geDmgMul = (p: P) => (hasGe(p, "geFortress") && (p.shieldPts ?? 0) > 0 ? K.geFortress.mul : 1);

/** 기어스가 받는 피해 배율: 기본 방어력 · 구체(중갑 돌진이면 더) · 은빛 갑주 · 불굴 */
export function gearsHurtMul(p: P): number {
  if (!isGears(p)) return 1;
  let m = A.taken;
  if (p.geBall) m *= hasGe(p, "geHeavy") ? K.geHeavy.taken : B.taken;
  if (hasGe(p, "geArmor")) m *= K.geArmor.taken;
  if (hasGe(p, "geResolve") && p.hp < p.stats.maxHp * K.geResolve.below) m *= K.geResolve.taken;
  return m;
}

/** 이동 속도 배율: 구체는 따로 굴러가서 0 · 천상의 수호자 동안 느림 */
export function gearsMoveMul(p: P): number {
  if (!isGears(p)) return 1;
  if (p.geBall) return 0;
  return (p.geGuard ?? 0) > 0 ? K.geGuardian.move : 1;
}

/** 공격력 증가 아이템은 반만 (더하기·곱하기 모두) */
export function gearsHalf(p: P, mods: StatMod[]): StatMod[] {
  if (!isGears(p)) return mods;
  const k = A.dmgItem;
  return mods.map((m) => (m.stat !== "damage" ? m : { stat: "damage", ...(m.add !== undefined ? { add: m.add * k } : {}), ...(m.mul !== undefined ? { mul: 1 + (m.mul - 1) * k } : {}) }));
}
