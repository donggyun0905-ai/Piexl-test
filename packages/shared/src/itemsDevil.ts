// 악마의 방 거래 패시브 6 (비밀의 방, sim/devil): 사탄의 석상 앞에서 최대 체력을 바치고 얻음 (special이라 보상·상점·히든 상점에는 없음)
// 효과는 sim/devilPerks, 수치는 DEVIL_PERKS (관리자 페이지에서 바꿀 수 있음)
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const D = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, special: true as const });

export const DEVIL_PASSIVES = {
  /** 악마의 피: 공격력 +6 · 공격력 +30% · 방어력 +20 */
  devilBlood: D("devilBlood", [{ stat: "damage", add: 6 }, { stat: "damage", mul: 1.3 }]),
  /** 사탄의 가면: 악의 사도 '사탄의 가면'처럼 가까운 적에게 죽음의 오라 */
  devilMask: D("devilMask"),
  /** 붉은 반점: 방어력 +30 · 공격력을 올리는 패시브 하나마다 방어력 + (검은 오라) */
  devilSpots: D("devilSpots"),
  /** 누군가의 절규: 공격 속도 +30% · 모든 공격에 범위 피해 50% (푸른 오라) */
  devilScream: D("devilScream", [{ stat: "attackSpeed", mul: 1.3 }]),
  /** 뒤집어진 십자가: 보스에게 주는 피해 +66% (붉은 오라) */
  devilCross: D("devilCross"),
  /** 그림 리퍼: 모든 공격에 적 방어력 -30 (받는 피해 +30%) · 검은 낫 */
  devilReaper: D("devilReaper"),
} as const satisfies Record<string, PassiveDef>;

export type DevilId = keyof typeof DEVIL_PASSIVES;
export const DEVIL_IDS = Object.keys(DEVIL_PASSIVES) as DevilId[];

/** 악마의 거래 수치 (배율 1 = 100%, 시간은 틱) */
export const DEVIL_PERKS = {
  /** 거래 조건: 바치는 최대 체력 */
  devilBlood: { cost: 40, defense: 20 },
  /** 오라 주기 (오라 크기·대상 수·피해는 악의 사도 사탄의 가면과 같음) */
  devilMask: { cost: 55, every: 60 },
  /** 방어력 · 공격력을 올리는 패시브 하나마다 방어력 */
  devilSpots: { cost: 55, defense: 30, per: 5 },
  /** 범위 반지름 · 피해 배율 */
  devilScream: { cost: 40, r: 26, mul: 0.5 },
  /** 보스에게 주는 피해 배율 */
  devilCross: { cost: 50, boss: 1.66 },
  /** 적 방어력 깎기 (받는 피해 +) · 낫이 보일 확률 */
  devilReaper: { cost: 45, taken: 0.3, fx: 0.25 },
};

/** 악마의 방 수치: 석상 앞에 놓이는 거래 수 · 거래 뒤 남아야 하는 최대 체력 · 이미 한 거래 하나마다 더 바치는 최대 체력 */
export const DEVIL_ROOM = { offers: 3, minHp: 10, more: 20 };
