// 잔영 전용 아이템 10개. 효과는 sim/remnant. 수치는 REMNANT_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const R = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "remnant" as const, effect: true as const });

export const REMNANT_PASSIVES = {
  /** 그림자 걸음: 슬로우모션 +0.5초 */
  rmStep: R("rmStep"),
  /** 등 뒤의 칼: 연속 베기 피해 +50% */
  rmBackstab: R("rmBackstab"),
  /** 처형: 체력 30% 이하 적에게 피해 +50% */
  rmExecute: R("rmExecute"),
  /** 겹친 칼: 연속 베기 +1번 */
  rmEcho: R("rmEcho"),
  /** 사라짐: 회피에 성공하면 체력 3 회복 */
  rmVanish: R("rmVanish"),
  /** 피의 칼날: 벨 때 출혈 */
  rmBlood: R("rmBlood"),
  /** 그림자 손놀림: 공격력 +15% */
  rmHaste: { id: "rmHaste", mods: [{ stat: "damage", mul: 1.15 }] as StatMod[], exclusive: "remnant" as const },
  /** 소리 없는 발: 이동 속도 +10% */
  rmSwift: { id: "rmSwift", mods: [{ stat: "moveSpeed", mul: 1.1 }] as StatMod[], exclusive: "remnant" as const },
  /** 연쇄 처형: 연속 베기로 적을 쓰러뜨리면 대시 대기가 바로 끝남 */
  rmFrenzy: R("rmFrenzy"),
  /** 그림자 장막: 회피에 성공하면 둘레 적이 1초 멈춤 */
  rmShroud: R("rmShroud"),
} as const satisfies Record<string, PassiveDef>;

/** 잔영 아이템 수치 */
export const REMNANT_PERKS = {
  rmStep: { ticks: 30 },
  rmBackstab: { add: 0.5 },
  rmExecute: { hp: 0.3, mul: 1.5 },
  rmEcho: { n: 1 },
  rmVanish: { heal: 3 },
  rmShroud: { reach: 60, ticks: 60 },
};
