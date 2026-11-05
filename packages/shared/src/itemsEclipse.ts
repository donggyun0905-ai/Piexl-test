// 이클립스 전용 아이템 10개. 효과는 sim/eclipse·eclipseZone·eclipseStats. 수치는 ECLIPSE_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "eclipse" as const, effect: true as const });

export const ECLIPSE_PASSIVES = {
  /** 여명의 손길: 태양의 치유의 빛 회복 + */
  ecDawn: P("ecDawn"),
  /** 코로나: 이글거리는 영역·죽음의 영역 반지름 + */
  ecCorona: P("ecCorona"),
  /** 태양 플레어: 태양 5타 깊은 찌르기가 더 길게 */
  ecFlare: P("ecFlare"),
  /** 흑점: 태양 모습 치명타 확률 · 치명타 피해 + */
  ecSunspot: P("ecSunspot"),
  /** 본영: 죽음의 영역 피해 + · 둔화 더 길게 */
  ecUmbra: P("ecUmbra"),
  /** 사건의 지평선: 블랙홀 크기·끌어당김·남는 시간 + */
  ecHorizon: P("ecHorizon"),
  /** 개기일식: 모습이 바뀌는 순간 둘레 적에게 큰 피해 */
  ecTotality: P("ecTotality"),
  /** 황혼: 게이지가 더 빨리 참 */
  ecTwilight: P("ecTwilight"),
  /** 헬리오스의 왕관: 모습이 바뀐 뒤 잠시 공격력 + · 최대 체력 + */
  ecCrown: P("ecCrown", [{ stat: "maxHp", add: 20 }]),
  /** 월식의 대도끼: 일식 도끼 사거리 + · 일식 낙하 반지름 + */
  ecMoonAxe: P("ecMoonAxe"),
} as const satisfies Record<string, PassiveDef>;

/** 이클립스 아이템 수치 */
export const ECLIPSE_PERKS = {
  /** 여명의 손길: 치유의 빛 회복 배율 */
  ecDawn: { heal: 1.6 },
  /** 코로나: 영역 반지름 배율 */
  ecCorona: { r: 1.25 },
  /** 태양 플레어: 5타 반지름 배율 */
  ecFlare: { size: 1.25 },
  /** 흑점: 치명타 확률 + · 치명타 피해 + (태양 모습만) */
  ecSunspot: { crit: 0.15, critDmg: 0.4 },
  /** 본영: 죽음의 영역 피해 배율 · 둔화 틱 배율 */
  ecUmbra: { dmg: 1.6, slow: 1.5 },
  /** 사건의 지평선: 블랙홀 반지름·끌어당김·남는 틱 배율 */
  ecHorizon: { size: 1.4 },
  /** 개기일식: 반지름 · 피해(새 모습 공격력 배율) · 기절 틱 */
  ecTotality: { r: 84, mul: 2.4, stun: 40 },
  /** 황혼: 게이지 배율 */
  ecTwilight: { gain: 1.35 },
  /** 헬리오스의 왕관: 공격력 + · 그 시간(틱) (최대 체력 +20은 아이템 능력치) */
  ecCrown: { dmg: 0.35, ticks: 240 },
  /** 월식의 대도끼: 일식 사거리 배율 · 낙하 반지름 배율 */
  ecMoonAxe: { reach: 1.2, slam: 1.2 },
};
