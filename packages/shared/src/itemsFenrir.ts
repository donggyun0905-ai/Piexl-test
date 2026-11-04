// 펜리르 전용 아이템 10개. 효과는 sim/fenrir·fenrirStats. 수치는 FENRIR_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "fenrir" as const, effect: true as const });

export const FENRIR_PASSIVES = {
  /** 늙은 늑대의 지혜: 피해를 피할 때마다 잠시 공격력 + */
  fnWisdom: P("fnWisdom"),
  /** 선왕의 광륜: 쓰러질 피해를 층마다 한 번 견딤 (체력 1 · 무적) */
  fnHalo: P("fnHalo"),
  /** 벼린 송곳니: 예리함 + · 예리함이 걸린 적에게 피해 + */
  fnFang: P("fnFang"),
  /** 질풍: 이동 속도 + · 대시 대기 시간 - */
  fnGale: P("fnGale", [{ stat: "moveSpeed", add: 0.15 }]),
  /** 늑대의 울부짖음: 천랑 낙인 착지 때 둘레 적 기절 */
  fnHowl: P("fnHowl"),
  /** 천랑성: 착지 검기 갈래 + · 검기가 더 멀리 */
  fnStar: P("fnStar"),
  /** 월광 난무: 난도 베기 수 + · 범위 + */
  fnMoon: P("fnMoon"),
  /** 대지 가르기: 지면 검기가 지나간 자리에 잠시 균열 (계속 피해) */
  fnRift: P("fnRift"),
  /** 노장의 투혼: 체력이 적을 때 회피 + */
  fnVeteran: P("fnVeteran"),
  /** 사냥 본능: 적을 쓰러뜨리면 콤보 쉬는 시간이 끝나고 잠시 이동 속도 + */
  fnHunt: P("fnHunt"),
} as const satisfies Record<string, PassiveDef>;

/** 펜리르 아이템 수치 */
export const FENRIR_PERKS = {
  /** 늙은 늑대의 지혜: 공격력 + · 그 시간(틱) */
  fnWisdom: { dmg: 0.3, ticks: 120 },
  /** 선왕의 광륜: 견딘 뒤 무적 틱 */
  fnHalo: { invuln: 120 },
  /** 벼린 송곳니: 예리함 + · 예리함이 걸린 적에게 피해 + */
  fnFang: { sharp: 0.15, dmg: 0.2 },
  /** 질풍: 대시 대기 시간 배율 (이동 속도 +0.15는 아이템 능력치) */
  fnGale: { dash: 0.8 },
  /** 늑대의 울부짖음: 반지름 · 기절 틱 */
  fnHowl: { r: 60, stun: 90 },
  /** 천랑성: 착지 검기 갈래 수 · 남는 틱 배율 */
  fnStar: { n: 12, reach: 1.3 },
  /** 월광 난무: 난도 베기 수 · 반지름 배율 */
  fnMoon: { n: 10, r: 1.25 },
  /** 대지 가르기: 균열을 놓는 틱 간격 · 남는 틱 · 반지름 · 때리는 틱 간격 · 한 번 피해(공격력 배율) */
  fnRift: { every: 6, ticks: 120, r: 10, gap: 30, mul: 0.25 },
  /** 노장의 투혼: 체력이 이 비율 아래면 · 회피 + */
  fnVeteran: { hp: 0.3, dodge: 0.2 },
  /** 사냥 본능: 이동 속도 + · 그 시간(틱) */
  fnHunt: { move: 0.3, ticks: 120 },
};
