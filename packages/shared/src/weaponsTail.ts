// 테일(탈라시아, 상어 수인): 둘레에 '영역 바다'를 펼치고, 바다 안의 적을 물 상어가 저절로 공격
// 상어 3가지 (확률): 삼키기(바다 밑에서 솟아 집어삼킴) · 돌진(바다에서 튀어나와 꿰뚫고 다시 잠수) · 낙하(솟구쳐 적에게 내리꽂힘)
// 누르면 꼬리 3연타 (위→아래 · 아래→위 · 위→아래 내려치기) · 한 방에 쓰러뜨릴 적이 있으면 물 상어가 되어 번개처럼 돌진해 씹어먹음 (흡혈)
// 무기 = 바다의 종류 10개 (꼬리는 그대로). 계산은 sim/tail·tailSea
import type { WeaponDef } from "./content";

/** 바다 종류: tide 밀물 · hammer 귀상어(낙하) · mako 청상아리(돌진) · great 백상아리(삼키기) · storm 뇌우(번개 튐)
 *  frost 빙해(느려짐) · ocean 대양(넓음) · frenzy 광란(자주) · whirl 소용돌이(끌어당김) · mega 메갈로돈(거대) */
export type SharkSea = "tide" | "hammer" | "mako" | "great" | "storm" | "frost" | "ocean" | "frenzy" | "whirl" | "mega";

/** 바다 하나: 종류 · 상어 비율 [삼키기, 돌진, 낙하] · 상어 간격 배율 · 영역 크기 배율 · 상어 피해 배율 · 상어 크기 배율 */
export interface SeaStyle {
  sea: SharkSea;
  w?: readonly [number, number, number];
  every?: number;
  r?: number;
  power?: number;
  size?: number;
}

const W = (id: string, damageMul: number, attackSpeed: number, shark: SeaStyle) =>
  ({ id, kind: "shark", damageMul, attackSpeed, range: 60, projectileSpeed: 3.4, shark, exclusive: "tail" }) as const;

export const TAIL_WEAPONS = {
  /** 밀물 바다 (처음 무기): 세 상어가 고르게 나옴 */
  tlTide: W("tlTide", 1, 1.1, { sea: "tide" }),
  /** 귀상어 바다: 낙하 상어가 자주 나오고 오래 기절시킴 */
  tlHammer: W("tlHammer", 1, 1, { sea: "hammer", w: [2, 2, 6] }),
  /** 청상아리 바다: 돌진 상어가 자주 · 빠르게 나옴 */
  tlMako: W("tlMako", 0.95, 1.1, { sea: "mako", w: [2, 6, 2], every: 0.85 }),
  /** 백상아리 바다: 삼키기 상어가 자주 나오고 크고 셈 (조금 드물게) */
  tlGreat: W("tlGreat", 1, 1, { sea: "great", w: [6, 2, 2], every: 1.15, power: 1.15, size: 1.2 }),
  /** 뇌우 바다: 상어가 문 적에게서 번개가 튐 */
  tlStorm: W("tlStorm", 1, 1, { sea: "storm" }),
  /** 빙해: 바다 안의 적이 느려짐 (상어는 조금 약함) */
  tlFrost: W("tlFrost", 1, 1, { sea: "frost", power: 0.95 }),
  /** 대양: 영역 바다가 아주 넓음 (상어는 조금 드물게) */
  tlOcean: W("tlOcean", 1, 1, { sea: "ocean", r: 1.45, every: 1.2 }),
  /** 광란의 바다: 상어가 아주 자주 나옴 (상어 피해는 약함) */
  tlFrenzy: W("tlFrenzy", 0.9, 1.15, { sea: "frenzy", every: 0.6, power: 0.7 }),
  /** 소용돌이: 바다 안의 적을 가운데로 끌어당김 */
  tlWhirl: W("tlWhirl", 1, 1, { sea: "whirl", r: 1.1 }),
  /** 메갈로돈: 거대한 상어가 드물게 나와 넓게 짓뭉갬 (느림) */
  tlMega: W("tlMega", 1.1, 0.85, { sea: "mega", w: [3, 1, 6], every: 1.7, power: 1.6, size: 1.6 }),
} as const satisfies Record<string, WeaponDef>;

/** 테일 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀, 부채꼴은 cos: 1 한 줄 · 0 반원 · -1 한 바퀴) */
export const TAIL = {
  /** 꼬리 연타: 다음 타를 이어 칠 수 있는 틱 (멈추면 1타부터) · 3타 뒤 쉬는 배율 */
  comboGap: 60,
  restMul: 1.3,
  /** 1·2타 꼬리 휘두르기 (위→아래 · 아래→위): 닿는 거리 · 부채꼴 · 피해 배율 · 밀침 */
  swipeReach: 46,
  swipeArc: 0.15,
  swipeMul: 1.8,
  swipePush: 4,
  /** 3타 내려치기: 앞쪽 거리 · 반지름 · 피해 배율 · 기절 틱 */
  slamAt: 26,
  slamR: 24,
  slamMul: 2.5,
  slamStun: 18,
  /** 영역 바다: 반지름 · 상어 간격(틱) · 기본 비율 [삼키기, 돌진, 낙하] */
  seaR: 74,
  sharkEvery: 60,
  wMaw: 4,
  wDash: 4,
  wDive: 2,
  /** 삼키기: 솟기까지 틱 · 반지름 · 피해 배율 · 가운데로 당김 */
  mawTicks: 16,
  mawR: 20,
  mawMul: 2.3,
  mawPull: 6,
  /** 돌진: 한 틱 거리 · 몸 폭 · 피해 배율 · 청상아리 빠르기 배율 */
  dashStep: 7,
  dashW: 10,
  dashMul: 1.9,
  makoStep: 1.35,
  /** 낙하: 떨어지기까지 틱 · 반지름 · 피해 배율 · 기절 틱 (귀상어는 기절 배율) */
  diveTicks: 24,
  diveR: 30,
  diveMul: 2.8,
  diveStun: 24,
  hammerStun: 2,
  /** 마무리 물기 (한 방에 쓰러뜨릴 적): 찾는 거리 · 한 틱 거리 · 최대 틱 · 피해 배율 · 흡혈(피해 비율) · 흡혈 최대(최대 체력 비율) · 다시 쓰기까지 틱 */
  biteRange: 150,
  biteStep: 13,
  biteTicks: 14,
  biteMul: 3.4,
  biteLeech: 0.25,
  biteCap: 0.05,
  biteCd: 18,
  /** 뇌우: 번개가 튀는 거리 · 피해 배율 */
  boltReach: 90,
  boltMul: 0.8,
  /** 빙해: 느려짐 틱 · 소용돌이: 한 틱에 끌어당김 */
  frostSlow: 30,
  whirlPull: 0.3,
};
