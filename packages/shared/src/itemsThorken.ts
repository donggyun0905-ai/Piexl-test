// 토르켄 전용 아이템 10개. 효과는 sim/thorken·thorkenBall·thorkenStorm. 수치는 THORKEN_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "thorken" as const, effect: true as const });

export const THORKEN_PASSIVES = {
  /** 순풍의 돛: 이동 속도 + · 대시가 끝나면 잠깐 휘두르기가 빨라짐 */
  tkSail: P("tkSail", [{ stat: "moveSpeed", add: 0.12 }]),
  /** 갈매기 깃털: 폭풍 게이지가 더 빨리 참 */
  tkGull: P("tkGull"),
  /** 심해 진주: 태풍 때 천둥이 더 많이 내리침 */
  tkPearl: P("tkPearl"),
  /** 해방의 나침반: 철구공 한 번에 적을 여럿 맞히면 체력 회복 */
  tkCompass: P("tkCompass"),
  /** 해방의 종: 태풍이 불면 잠깐 무적 + 둘레 적 탄을 지움 */
  tkBell: P("tkBell"),
  /** 따개비 사슬: 사슬이 길어짐 */
  tkBarnacle: P("tkBarnacle"),
  /** 고래의 노래: 던진 철구공의 천둥이 더 넓고 셈 */
  tkWhale: P("tkWhale"),
  /** 바다의 삼지창: 닻을 휘두르면 앞으로 물살 세 줄기 */
  tkTrident: P("tkTrident"),
  /** 산호 갑옷: 최대 체력 + · 철구공이 나가 있는 동안 받는 피해 줄어듦 */
  tkCoral: P("tkCoral", [{ stat: "maxHp", add: 20 }]),
  /** 등대: 태풍이 더 오래 불고 더 세게 끌어당김 */
  tkLighthouse: P("tkLighthouse"),
} as const satisfies Record<string, PassiveDef>;

/** 토르켄 아이템 수치 */
export const THORKEN_PERKS = {
  /** 순풍의 돛: 대시 뒤 빨라지는 틱 · 공격 속도 배율 */
  tkSail: { ticks: 60, speed: 1.35 },
  /** 갈매기 깃털: 게이지 배율 */
  tkGull: { mul: 1.5 },
  /** 심해 진주: 천둥 + */
  tkPearl: { bolts: 3 },
  /** 해방의 나침반: 이만큼 이상 맞히면 · 회복(최대 체력 비율) */
  tkCompass: { need: 3, heal: 0.02 },
  /** 해방의 종: 무적 틱 · 탄 지우는 반지름 */
  tkBell: { invuln: 60, r: 90 },
  /** 따개비 사슬: 사슬 길이 배율 */
  tkBarnacle: { chain: 1.25 },
  /** 고래의 노래: 천둥 반지름 배율 · 피해 배율 */
  tkWhale: { r: 1.5, mul: 1.6 },
  /** 바다의 삼지창: 물살 수 · 사이 각도 · 피해 배율 · 날아가는 거리 */
  tkTrident: { n: 3, spread: 0.25, mul: 0.6, range: 120 },
  /** 산호 갑옷: 받는 피해 배율 (철구공이 나가 있을 때) */
  tkCoral: { taken: 0.85 },
  /** 등대: 태풍 시간 배율 · 끌어당김 배율 */
  tkLighthouse: { ticks: 1.5, pull: 1.5 },
};
