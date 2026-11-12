// 아리아(실베르, 영혼 팔이 맨 큰 악기와 노래로 싸우는 지휘자 소녀): 무기 10개 모두 음표(songNote)
// 누르면 음표가 느리게 둥실둥실 앞으로 날아가 방 끝까지 감 (뚫고 지나가며 적마다 한 번씩) · 음표는 8종(AR_NOTE.kinds)
// 기본 패시브: 방에 서로 다른 음표 8개가 모이면 8개가 저마다 다른 색으로 크게 터짐 (sim/arBurst)
// 악보 완성: 피아노·하프·호른·클라리넷이 모두 놓여 있을 때 음표 8개가 모이면 10초 동안 방 전체에 폭죽 (sim/arFinale)
// 전용 패시브 10개(악기 4·바이올린·화음·돌림노래·포르티시모·앙코르·마에스트로)는 itemsAria · 계산은 sim/aria·arKit·arBurst·arFinale·arInstruments
import type { WeaponDef } from "./content";

const W = <T extends string>(id: T, attackSpeed: number, range: number) =>
  ({ id, kind: "songNote", damageMul: 1, attackSpeed, range, projectileSpeed: 1.2, exclusive: "aria" }) as const;

export const ARIA_WEAPONS = {
  /** 황금 지휘봉: 음표 하나 (기본) */
  arBaton: W("arBaton", 1.2, 200),
  /** 은빛 플루트: 작고 빠른 음표를 자주 */
  arFlute: W("arFlute", 1.9, 200),
  /** 첼로 활: 크고 무거운 음표 · 느림 */
  arCello: W("arCello", 0.75, 200),
  /** 금빛 트럼펫: 음표 셋을 부채꼴로 */
  arTrumpet: W("arTrumpet", 1, 200),
  /** 종 지휘봉: 맞은 적이 확률로 기절 */
  arBell: W("arBell", 1.1, 200),
  /** 서정의 리라: 음표가 가까운 적에게 휘어 감 */
  arLyre: W("arLyre", 1.15, 200),
  /** 작은 북: 맞은 자리에 울림이 퍼져 둘레 적도 맞음 */
  arDrum: W("arDrum", 1, 200),
  /** 겨울 오르골: 맞은 적이 느려짐 */
  arMusicBox: W("arMusicBox", 1.15, 200),
  /** 불꽃 탬버린: 맞은 적이 불탐 */
  arTambourine: W("arTambourine", 1.2, 200),
  /** 진혼곡 악보: 맞은 적이 출혈 · 크게 출렁이는 음표 */
  arRequiem: W("arRequiem", 1, 200),
} as const satisfies Record<string, WeaponDef>;

export type AriaWeaponId = keyof typeof ARIA_WEAPONS;

/**
 * 무기마다 음표 (speed 날아가는 빠르기(틱마다 픽셀, 사거리 증가만큼 늘어남) · r 맞는 반지름 · mul 피해 배율 · cd 다시 공격까지 틱 · n 한 번에 음표 수 · spread 음표 사이 각도(라디안)
 * bob 둥실거리는 폭 · home 적에게 휘는 정도(0 = 곧게) · status 속성: 0 없음 · 1 화상 · 2 느려짐 · 3 기절 · 4 출혈 · 5 울림(둘레 피해) · chance 걸릴 확률 · ticks 지속 틱(울림은 반지름))
 * burst 여덟 음표 터짐 피해 배율 (음표가 자주 모이는 무기는 약하게, 드문 무기는 세게)
 */
export const AR_STYLE: Record<AriaWeaponId, { speed: number; r: number; mul: number; cd: number; n: number; spread: number; bob: number; home: number; status: number; chance: number; ticks: number; burst: number }> = {
  arBaton: { speed: 1.25, r: 10, mul: 1, cd: 26, n: 1, spread: 0, bob: 7, home: 0, status: 0, chance: 0, ticks: 0, burst: 1 },
  arFlute: { speed: 1.7, r: 7, mul: 0.6, cd: 15, n: 1, spread: 0, bob: 5, home: 0, status: 0, chance: 0, ticks: 0, burst: 0.3 },
  arCello: { speed: 0.6, r: 15, mul: 1.9, cd: 38, n: 1, spread: 0, bob: 9, home: 0, status: 0, chance: 0, ticks: 0, burst: 2 },
  arTrumpet: { speed: 1.3, r: 9, mul: 0.55, cd: 30, n: 3, spread: 0.32, bob: 6, home: 0, status: 0, chance: 0, ticks: 0, burst: 0.35 },
  arBell: { speed: 1.2, r: 10, mul: 0.9, cd: 28, n: 1, spread: 0, bob: 7, home: 0, status: 3, chance: 0.15, ticks: 40, burst: 1 },
  arLyre: { speed: 1.3, r: 10, mul: 0.9, cd: 27, n: 1, spread: 0, bob: 6, home: 0.06, status: 0, chance: 0, ticks: 0, burst: 1 },
  arDrum: { speed: 1.15, r: 10, mul: 0.8, cd: 30, n: 1, spread: 0, bob: 7, home: 0, status: 5, chance: 1, ticks: 30, burst: 1.3 },
  arMusicBox: { speed: 1.2, r: 10, mul: 0.9, cd: 27, n: 1, spread: 0, bob: 7, home: 0, status: 2, chance: 1, ticks: 90, burst: 1 },
  arTambourine: { speed: 1.25, r: 10, mul: 0.85, cd: 26, n: 1, spread: 0, bob: 7, home: 0, status: 1, chance: 1, ticks: 0, burst: 1 },
  arRequiem: { speed: 0.95, r: 12, mul: 0.9, cd: 28, n: 1, spread: 0, bob: 13, home: 0, status: 4, chance: 1, ticks: 0, burst: 1.5 },
};

/**
 * 음표 공통: 종류 수 · 둥실거리는 빠르기(라디안/틱) · 없는 종류를 먼저 고를 확률 · 사는 틱(방 끝에 닿지 못해도 사라짐) · 방에 가장 많이
 * 여덟 음표 터짐: 반지름 · 피해 배율(음표 하나마다) · 울림 피해 배율(작은 북)
 * 리라가 적을 찾는 거리 · 악기 음표가 사는 틱 · 악기 음표가 쫓는 적에게 휘는 정도
 */
export const AR_NOTE = {
  kinds: 8,
  bobSpeed: 0.11,
  prefer: 0.5,
  life: 900,
  cap: 24,
  burstR: 58,
  burstMul: 2.2,
  echoMul: 0.5,
  lyreSight: 140,
  shotLife: 150,
  shotHome: 0.12,
};

/** 악보 완성: 지속 틱(10초) · 몇 틱마다 · 한 번에 폭죽 수 · 폭죽 반지름 · 피해 배율 · 적을 노리는 폭죽 비율 · 끝난 뒤 다시 될 때까지 틱 */
export const AR_FINALE = {
  ticks: 600,
  every: 4,
  n: 2,
  r: 34,
  mul: 0.75,
  aim: 0.6,
  rest: 300,
};
