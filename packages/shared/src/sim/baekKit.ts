// 백령 공용 도우미 (sim/baekryeong·baekSlash·baekSword·baekSoul이 같이 씀): 영혼 게이지 칸·유령팔 크기·베기 크기·범위 피해
// 가벼운 것만 불러옴 (sim/faction이 baekSoul을 거쳐 부르므로 순환 import를 피함)
import { BAEK_PERKS as K } from "../itemsBaekryeong";
import { BAEK_SOUL as S } from "../weaponsBaekryeong";
import { BLUE_FLAME as F } from "../weaponsBlueFlame";
import type { EnemyState, RunState } from "./types";

type P = RunState["player"];

export const isBaek = (p: P) => p.characterId === "baekryeong";
const has = (p: P, id: string) => p.passives.includes(id as never);

/** 유령팔이 가장 커지는 게이지 칸 수 (이 칸이 되면 게이지가 사라짐) */
export const maxLv = () => S.armLv + Math.round((S.maxScale - 1) / S.grow);

/** lv칸 다음 칸을 채우는 데 필요한 영혼 (혼 부름이면 줄어듦) */
export function soulNeed(p: P, lv = p.byLv ?? 0): number {
  const base = lv === 0 ? S.need1 : lv === 1 ? S.need2 : lv === 2 ? S.need3 : S.needAfter;
  return Math.max(1, Math.round(base * (has(p, "byCall") ? K.byCall.need : 1)));
}

/** 유령팔 크기 (유령팔이 없으면 0): 3칸에서 1, 그 뒤 칸마다 grow씩, 가장 크게 maxScale */
export function armScale(p: P): number {
  const lv = p.byLv ?? 0;
  if (lv < S.armLv) return 0;
  return Math.min(S.maxScale, 1 + (lv - S.armLv) * S.grow);
}

/** 공격 크기 (유령팔이 없으면 0): 유령팔 크기가 커지는 만큼의 hitGrow 비율로만 커짐 */
export function hitScale(p: P): number {
  const a = armScale(p);
  return a <= 0 ? 0 : 1 + (a - 1) * S.hitGrow;
}

/** 영혼을 n 쌓음 (가장 큰 크기가 되면 더 쌓지 않음) · 새로 찬 칸 수 */
export function addSouls(p: P, n: number): number {
  let up = 0;
  let lv = p.byLv ?? 0;
  let souls = (p.bySouls ?? 0) + n;
  while (lv < maxLv() && souls >= soulNeed(p, lv)) {
    souls -= soulNeed(p, lv);
    lv++;
    up++;
  }
  p.byLv = lv;
  p.bySouls = lv >= maxLv() ? 0 : souls;
  return up;
}

/** 피해 배율 (원혼: 게이지 칸마다) */
export const hauntMul = (p: P) => 1 + (has(p, "byHaunt") ? (p.byLv ?? 0) * K.byHaunt.per : 0);

/** 청혼불: 맞은 적에게 청염 상태이상 (블루 플레임과 같은 푸른 불꽃 · 지속 다시, 한 번 피해는 센 쪽) */
export function soulFire(p: P, e: EnemyState): void {
  if (!has(p, "byFlame") || e.hp <= 0) return;
  e.bzFlameT = F.flameTicks;
  e.bzFlameDmg = Math.max(e.bzFlameDmg ?? 0, p.stats.damage * K.byFlame.mul);
}
