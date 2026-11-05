// 리바이어(탈라시아, 바다의 나라): 바다의 창 + 고래의 힘. 무기 = 창에 박는 힘의 보석 10개 (창은 바뀌지 않음)
// 누를 때마다 3단 콤보: 1타 앞 휘두르기 → 2타 한 바퀴 돌고 고래 대돌격(큰 고래 투사체) → 3타 앞으로 돌진 + 부채꼴 충격파
// 타마다 확률로 고래가 같이 나옴 (1타 날개 쓸기 · 2타 몸을 감아 한 바퀴 · 3타 같이 돌진). 계산은 sim/levia·leviaWhale
import type { WeaponDef } from "./content";

/** 보석 종류: aqua 아쿠아마린 · sapphire 해류 · topaz 번개 · coral 산호 폭발 · moon 밀물(고래 잘 나옴) · abyss 심해 충격파
 *  ice 빙정 · twin 쌍둥이 고래 · gale 해풍(빠름) · king 리바이어던의 눈(3타 끝 고래 도약) */
export type SeaGem = "aqua" | "sapphire" | "topaz" | "coral" | "moon" | "abyss" | "ice" | "twin" | "gale" | "king";

/** 보석 하나: 종류 · 고래 확률 더함 · 고래 피해 배율 */
export interface GemStyle {
  gem: SeaGem;
  whale?: number;
  power?: number;
}

const W = (id: string, damageMul: number, attackSpeed: number, sea: GemStyle) =>
  ({ id, kind: "whale", damageMul, attackSpeed, range: 60, projectileSpeed: 3.4, sea, exclusive: "levia" }) as const;

export const LEVIA_WEAPONS = {
  /** 아쿠아마린 (처음 무기): 맑은 바다의 기본 보석 · 고래가 조금 더 잘 나옴 */
  lvAqua: W("lvAqua", 1, 0.95, { gem: "aqua", whale: 0.05 }),
  /** 해류 사파이어: 대돌격 고래가 지나간 길에 해류가 남아 적을 휩쓸어 때림 */
  lvSapphire: W("lvSapphire", 1, 0.9, { gem: "sapphire" }),
  /** 뇌명 토파즈: 고래가 나올 때마다 둘레 적에게 번개 */
  lvTopaz: W("lvTopaz", 1, 0.9, { gem: "topaz" }),
  /** 산호석: 대돌격 고래가 끝에서 터져 큰 물보라 */
  lvCoral: W("lvCoral", 1, 0.9, { gem: "coral" }),
  /** 밀물 월장석: 고래가 훨씬 잘 나옴 (고래 피해는 조금 약함) */
  lvMoon: W("lvMoon", 0.95, 0.95, { gem: "moon", whale: 0.2, power: 0.9 }),
  /** 심해석: 3타 충격파가 더 세고 적을 기절시킴 */
  lvAbyss: W("lvAbyss", 1.05, 0.85, { gem: "abyss" }),
  /** 빙정: 맞은 적이 느려지고, 느려진 적은 더 아픔 */
  lvIce: W("lvIce", 1, 0.9, { gem: "ice" }),
  /** 쌍둥이 진주: 대돌격 고래가 두 마리 (한 마리는 조금 약함) */
  lvTwin: W("lvTwin", 0.95, 0.9, { gem: "twin" }),
  /** 해풍석: 콤보가 빠르고 3타 돌진이 멀리 감 (피해는 조금 약함) */
  lvGale: W("lvGale", 0.85, 1.2, { gem: "gale" }),
  /** 리바이어던의 눈: 3타가 끝나면 고래가 반드시 바다에서 솟구쳐 넓게 내리찍음 (느림) */
  lvKing: W("lvKing", 1.1, 0.75, { gem: "king", power: 1.1 }),
} as const satisfies Record<string, WeaponDef>;

/** 리바이어 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀, 부채꼴은 cos: 1 한 줄 · 0 반원 · -1 한 바퀴) */
export const LEVIA = {
  /** 콤보: 다음 타를 이어 칠 수 있는 틱 (멈추면 1타부터) · 3타 뒤 쉬는 배율 */
  comboGap: 70,
  restMul: 1.4,
  /** 고래 확률: 기본 · 안 나올 때마다 더해짐(다음에 나오면 0) · 최대 */
  whaleBase: 0.25,
  whaleMiss: 0.08,
  whaleMax: 0.85,
  /** 1타 창 휘두르기: 닿는 거리 · 부채꼴 · 피해 배율 · 밀침 */
  sweepReach: 48,
  sweepArc: 0.05,
  sweepMul: 2.8,
  sweepPush: 5,
  /** 1타 고래 날개 쓸기 (창보다 넓음) */
  finReach: 78,
  finArc: -0.3,
  finMul: 2.1,
  finPush: 10,
  /** 2타 한 바퀴 휘두르기 */
  spinReach: 44,
  spinMul: 2.1,
  /** 2타 고래 대돌격 (투사체): 몸 크기 · 속도 · 거리 · 피해 배율 */
  chargeR: 13,
  chargeSpeed: 3.4,
  chargeRange: 210,
  chargeMul: 3,
  /** 2타 고래가 몸을 감아 한 바퀴 (더 넓게) */
  orbitReach: 86,
  orbitMul: 1.8,
  /** 3타 돌진: 틱 · 한 틱 거리 · 맞히는 폭 · 피해 배율 */
  rushTicks: 9,
  rushStep: 6.5,
  rushW: 12,
  rushMul: 2,
  /** 3타 충격파 (부채꼴) */
  quakeReach: 74,
  quakeArc: 0.35,
  quakeMul: 3.3,
  quakePush: 12,
  /** 3타 고래가 같이 돌진: 몸 크기 · 피해 배율 */
  rushWhaleR: 15,
  rushWhaleMul: 2.5,
  /** 해류 사파이어: 웅덩이 간격(틱) · 남는 틱 · 반지름 · 때리는 간격 · 피해 배율 · 끌어당김 */
  poolEvery: 5,
  poolTicks: 70,
  poolR: 18,
  poolGap: 14,
  poolMul: 0.22,
  poolPull: 0.35,
  /** 뇌명 토파즈: 번개 수 · 닿는 거리 · 피해 배율 */
  boltN: 3,
  boltReach: 130,
  boltMul: 1.1,
  /** 산호석: 터지는 반지름 · 피해 배율 */
  burstR: 46,
  burstMul: 2.4,
  /** 심해석: 충격파 피해 배율 · 기절 틱 */
  abyssMul: 1.25,
  abyssStun: 40,
  /** 빙정: 느려짐 틱 · 느려진 적 피해 배율 */
  iceSlow: 60,
  iceTaken: 1.2,
  /** 쌍둥이 진주: 두 고래 사이 각도 · 한 마리 피해 배율 */
  twinSpread: 0.28,
  twinMul: 0.7,
  /** 해풍석: 돌진 거리 배율 */
  galeRush: 1.5,
  /** 리바이어던의 눈: 고래 도약 반지름 · 피해 배율 · 기절 틱 */
  breachR: 62,
  breachMul: 2.2,
  breachStun: 30,
};
