// 잔영 전용 아이템 10개. 효과는 sim/remnant. 수치는 REMNANT_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const R = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "remnant" as const, effect: true as const });

export const REMNANT_PASSIVES = {
  /** 그림자 걸음: 순간이동 대기 -40% */
  rmStep: R("rmStep"),
  /** 등 뒤의 칼: 뒤에서 친 피해 +50% */
  rmBackstab: R("rmBackstab"),
  /** 처형: 체력 30% 이하 적에게 피해 +50% */
  rmExecute: R("rmExecute"),
  /** 겹친 잔영: 잔영이 두 번 벰 */
  rmEcho: R("rmEcho"),
  /** 사라짐: 순간이동한 뒤 0.3초 무적 */
  rmVanish: R("rmVanish"),
  /** 피의 칼날: 벨 때 출혈 */
  rmBlood: R("rmBlood"),
  /** 그림자 손놀림: 공격 속도 +15% */
  rmHaste: { id: "rmHaste", mods: [{ stat: "attackSpeed", mul: 1.15 }] as StatMod[], exclusive: "remnant" as const },
  /** 소리 없는 발: 이동 속도 +10% */
  rmSwift: { id: "rmSwift", mods: [{ stat: "moveSpeed", mul: 1.1 }] as StatMod[], exclusive: "remnant" as const },
  /** 연쇄 암살: 적을 쓰러뜨리면 순간이동 대기가 바로 끝남 */
  rmFrenzy: R("rmFrenzy"),
  /** 그림자 숨기: 대시하면 가까운 적 뒤로 순간이동 */
  rmShroud: R("rmShroud"),
} as const satisfies Record<string, PassiveDef>;

/** 잔영 아이템 수치 */
export const REMNANT_PERKS = {
  rmStep: { cd: 0.6 },
  rmBackstab: { add: 0.5 },
  rmExecute: { hp: 0.3, mul: 1.5 },
  rmEcho: { n: 2 },
  rmVanish: { ticks: 18 },
  rmShroud: { reach: 140 },
};
