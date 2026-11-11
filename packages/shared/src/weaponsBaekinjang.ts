// 백인장(실베르, 기계 날개와 미니 창 드론을 부리는 쌍검의 기사): 무기는 쌍단검 하나. 누르면 앞을 X자로 벰 (혈월 쌍검격)
// 늘 미니 창 드론 5기가 적을 쫓아가 찌르고 지나갔다가 돌아와 다시 찌름 · 전용 패시브는 itemsBaekinjang · 계산은 sim/baekinjang·bj*
import type { WeaponDef } from "./content";

export const BAEKINJANG_WEAPONS = {
  /** 혈월 쌍검: 앞을 붉은 초승달 검격 둘로 교차해 벰 (사거리 = 베는 거리) */
  bjBlades: { id: "bjBlades", kind: "bloodBlades", damageMul: 1, attackSpeed: 1, range: 44, projectileSpeed: 4, exclusive: "baekinjang" },
} as const satisfies Record<string, WeaponDef>;

/** 기본 공격 혈월 쌍검격 수치 (시간은 틱(60 = 1초), 거리는 픽셀, 피해 배율은 공격력 × 배율) */
export const BJ_BLADES = {
  /** 베는 자리까지 거리 · 맞히는 반지름 (사거리 증가만큼 늘어남) */
  reach: 24,
  r: 30,
  /** 검격 하나의 피해 배율 (둘이 교차해 2번 맞음) · 다시 베기까지 틱 (공격 속도로 짧아짐) */
  mul: 0.55,
  cd: 26,
  /** 콤보가 이어지는 틱 (이 안에 다시 누르면 다음 기술) */
  chain: 70,
};

/** 기본 패시브 미니 창 드론 수치 */
export const BJ_DRONE = {
  /** 드론 수 */
  n: 5,
  /** 한 번 찌르는 피해 배율 · 같은 드론이 다시 찌르기까지 틱 · 찌른 뒤 곧게 지나가는 틱 */
  mul: 0.12,
  cd: 30,
  pass: 12,
  /** 가장 빠른 속도 · 방향을 트는 힘 (틱마다) · 적을 찾는 거리 (플레이어에서) */
  speed: 5.5,
  turn: 0.55,
  seek: 260,
  /** 쉴 때 몸 둘레에 떠 있는 거리 */
  rest: 22,
};
