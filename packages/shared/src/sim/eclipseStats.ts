// 이클립스 능력치 쪽: 모습마다 공격력·공격 속도·사거리 배율 · 태양 치명타(흑점) · 일식은 치명타 없음
// (공격은 sim/eclipse. 이 파일은 baseStats·classSpeed·novice가 부르므로 가볍게 둠)
import type { ExtraStats } from "../characters";
import { ECLIPSE_PERKS as K } from "../itemsEclipse";
import { ECLIPSE as E } from "../weaponsEclipse";
import type { PlayerState } from "./types";
import { hasPerk } from "./util";

export const isEclipse = (p: PlayerState) => p.characterId === "eclipse";
/** 일식(남자) 모습 */
export const isNight = (p: PlayerState) => isEclipse(p) && !!p.ecNight;

/** 태양 모습 기본 치명타 (baseStats.extraOf) · 흑점 */
export function eclipseExtras(p: PlayerState): Partial<ExtraStats> | null {
  if (!isEclipse(p) || p.ecNight) return null;
  const spot = hasPerk(p, "ecSunspot");
  return { critChance: E.sunCrit + (spot ? K.ecSunspot.crit : 0), critDamage: E.sunCritDmg + (spot ? K.ecSunspot.critDmg : 0) };
}

/** 일식 모습은 치명타가 없음 (novice.rollCrit·critNow) */
export const eclipseNoCrit = (p: PlayerState) => isNight(p);

/** 모습마다 공격력 배율 (헬리오스의 왕관 포함) */
export function eclipseDmgMul(p: PlayerState): number {
  const crown = (p.ecCrownT ?? 0) > 0 ? 1 + K.ecCrown.dmg : 1;
  return (p.ecNight ? E.nightDmg : E.sunDmg) * crown;
}

/** 모습마다 공격 속도 배율 (classSpeed) */
export const eclipseSpeedMul = (p: PlayerState) => (p.ecNight ? E.nightSpeed : E.sunSpeed);

/** 일식 거대한 도끼 사거리 */
export const nightReach = (p: PlayerState) => p.stats.range * E.nightReach * (hasPerk(p, "ecMoonAxe") ? K.ecMoonAxe.reach : 1);

/** 영역 반지름 (코로나) */
export const zoneR = (p: PlayerState) => (p.ecNight ? E.nightR : E.sunR) * (hasPerk(p, "ecCorona") ? K.ecCorona.r : 1);
