// 빛의 사도 전용 아이템 10개 + 빛의 조각(빛의 적이 떨굼, 보상·상점에는 안 나옴). 효과는 sim/lux. 수치는 LUX_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const E = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "lux" as const, effect: true as const });
const M = <T extends string>(id: T, mods: StatMod[]) => ({ id, mods, exclusive: "lux" as const });

export const LUX_PASSIVES = {
  /** 빛의 조각: 공격력 +5% · 공격 속도 +3% (치명타·예리함·빛의 검은 sim/lux) · 6개마다 성장 */
  lxShard: { id: "lxShard", mods: [{ stat: "damage", mul: 1.05 }, { stat: "attackSpeed", mul: 1.03 }] as StatMod[], exclusive: "lux" as const, special: true as const },
  /** 빛의 고리: 공격력 +12% */
  lxHalo: M("lxHalo", [{ stat: "damage", mul: 1.12 }]),
  /** 신속의 깃: 공격 속도 +15% */
  lxSwift: M("lxSwift", [{ stat: "attackSpeed", mul: 1.15 }]),
  /** 먼 빛: 사거리 +25 · 발사체 속도 +15% */
  lxReach: M("lxReach", [{ stat: "range", add: 25 }, { stat: "projectileSpeed", mul: 1.15 }]),
  /** 은총의 옷자락: 빛의 검이 더 넓은 곳에 · 한 번에 5개 더 (머리 위 빛의 검 날개 두 개) */
  lxGrace: E("lxGrace"),
  /** 겹친 검날: 적마다 빛의 검 +1 */
  lxMore: E("lxMore"),
  /** 빠른 단죄: 빛의 검이 2번 공격마다 */
  lxQuick: E("lxQuick"),
  /** 넓은 십자: 빛의 검 크기 +40% */
  lxWide: E("lxWide"),
  /** 꿰뚫는 빛: 빛의 검이 생긴 자리에 붉은 빛의 검이 한 번 더 꿰뚫음 */
  lxPierce: E("lxPierce"),
  /** 단죄: 빛의 검 피해 +35% */
  lxJudge: E("lxJudge"),
  /** 빛의 문신: 빛의 조각 하나마다 최대 체력 +4 · 치명타 피해 +3% */
  lxTattoo: E("lxTattoo"),
} as const satisfies Record<string, PassiveDef>;

export const LUX_PERKS = {
  /** 빛의 조각 하나마다 치명타 확률 · 예리함 */
  lxShard: { crit: 0.015, sharp: 0.015 },
  lxMore: { add: 1 },
  lxQuick: { every: 2 },
  lxWide: { mul: 1.4 },
  lxGrace: { reach: 1.5, add: 5 },
  lxPierce: { delay: 8, mul: 0.8 },
  lxJudge: { mul: 1.35 },
  lxTattoo: { hp: 4, critDmg: 0.03 },
};
