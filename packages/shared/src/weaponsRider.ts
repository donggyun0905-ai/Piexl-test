// 라이더(테라코어, 시즌 2) 무기 10개: 오토바이를 탄 폭주족. 빠를수록 피해가 커지고, 달린 거리만큼 게이지가 차면 범위 펄스. 계산은 sim/rider
import type { WeaponDef } from "./content";

/** 공격 모양: smash 앞 부채꼴 · stab 짧은 찌르기 · shot 탄 · spread 산탄 · rail 꿰뚫는 한 줄 · flame 불꽃 · wheel 돌아오는 톱날 · lance 긴 찌르기 · spin 한 바퀴 · nitro 앞으로 내달림 */
export type RideMove = "smash" | "stab" | "shot" | "spread" | "rail" | "flame" | "wheel" | "lance" | "spin" | "nitro";

/** 공격 모양 · 닿는 거리 · 수 · 밀침 · 멈춤(틱) */
export interface RideStyle {
  move: RideMove;
  reach: number;
  n?: number;
  push?: number;
  stun?: number;
  /** 이 무기를 들면 이동 속도 + · 대시하면 목 베기 공격 */
  fast?: number;
  cut?: boolean;
}

const R = (id: string, damageMul: number, attackSpeed: number, range: number, ride: RideStyle) =>
  ({ id, kind: "ride", damageMul, attackSpeed, range, projectileSpeed: 4.2, ride, exclusive: "rider" }) as const;

export const RIDER_WEAPONS = {
  /** 기계 망치 (처음 무기): 앞을 크게 내려쳐 밀어냄 */
  rdHammer: R("rdHammer", 1.4, 1.0, 34, { move: "smash", reach: 34, push: 10 }),
  /** 펄스건: 빠른 에너지탄 */
  rdPulse: R("rdPulse", 0.8, 2.2, 150, { move: "shot", reach: 150 }),
  /** 암살 단검: 아주 빠른 찌르기 · 훨씬 빠르게 달림 · 대시하면 지나가며 목을 벰 */
  rdDagger: R("rdDagger", 0.6, 3.2, 32, { move: "stab", reach: 32, fast: 0.4, cut: true }),
  /** 레일건: 모두 꿰뚫는 한 줄 (느림) */
  rdRail: R("rdRail", 2.3, 0.6, 190, { move: "rail", reach: 190 }),
  /** 산탄 펄스: 다섯 발 */
  rdScatter: R("rdScatter", 0.5, 1.3, 100, { move: "spread", reach: 100, n: 5 }),
  /** 화염 배기: 앞으로 푸른 불을 뿜어 불태움 (불꽃 스택 x1~x5) */
  rdExhaust: R("rdExhaust", 0.55, 2.4, 40, { move: "flame", reach: 40 }),
  /** 톱날 휠: 던지면 꿰뚫고 돌아옴 */
  rdWheel: R("rdWheel", 1.1, 1.1, 120, { move: "wheel", reach: 120 }),
  /** 전기 랜스: 길게 찔러 감전 (잠깐 멈춤) */
  rdLance: R("rdLance", 1.3, 1.1, 60, { move: "lance", reach: 60, stun: 20 }),
  /** 체인 휘두르기: 둘레 한 바퀴 */
  rdChain: R("rdChain", 0.9, 1.3, 62, { move: "spin", reach: 62, push: 6 }),
  /** 니트로 부스터: 앞으로 내달려 길 위의 적을 들이받음 */
  rdNitro: R("rdNitro", 1.5, 0.8, 110, { move: "nitro", reach: 110, push: 12 }),
} as const satisfies Record<string, WeaponDef>;

/** 라이더 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const RIDER = {
  /** 빠를수록 피해: 지금 한 틱에 움직인 거리 1마다 +이만큼 (이동 속도 능력치에도 비례해 더함) */
  speedMul: 0.35,
  statMul: 0.25,
  /** 게이지: 이만큼 달리면 가득 → 둘레 펄스 (반경 · 공격력 배율 · 밀침) */
  gaugeMax: 1000,
  pulseR: 80,
  pulseMul: 3,
  /** 패왕전: 펄스가 터질 때 나도 받는 피해 (펄스 피해 × 이 값) */
  pvpSelf: 0.35,
  pulsePush: 14,
  /** 공격 한 번마다 게이지 + · 공격할 때마다 빨라짐(쌓이는 수 · 하나마다 이동 속도 · 공격이 없으면 이 틱 뒤 사라짐) */
  hitGauge: 20,
  heatMax: 10,
  heatSpeed: 0.04,
  heatTicks: 90,
  /** 단검 대시 목 베기: 닿는 거리 · 피해 배율 · 최대 적 수 */
  cutReach: 60,
  cutMul: 1.6,
  cutN: 3,
  /** 암살 단검: 빠를수록 붙는 피해는 최대 +이만큼 (빠른 이동·대시 거리로 끝없이 커지지 않게) */
  daggerSpeedCap: 0.4,
  /** 오토바이는 위험함: 받는 피해 배율 */
  taken: 1.2,
  /** 불꽃 자국: 남는 틱 · 반경 · 0.5초마다 공격력 배율 */
  fireTicks: 90,
  fireR: 10,
  fireMul: 0.3,
  /** 니트로: 내달리는 틱 · 맞히는 폭 (거리는 무기 닿는 거리) */
  nitroTicks: 10,
  nitroW: 14,
};
