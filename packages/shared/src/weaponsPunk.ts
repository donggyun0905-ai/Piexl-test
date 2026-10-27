// 펑크(테라코어, 시즌 2) 무기 10개: 네온과 크롬의 사이버 무기. 계산은 sim/punk
import type { WeaponDef } from "./content";

/** 공격 모양: slash 앞 베기 · wire 긴 채찍 줄 · smart 휘어 쫓는 총알 · mantis 양옆 베기 · shotgun 산탄 · pierce 꿰뚫는 한 줄
 *  hack 가까운 적들 해킹(감전·멈춤) · gorilla 앞을 크게 후려침 · emp 던지면 터져 멈춤 · spin 둘레 회오리 */
export type CyberMove = "slash" | "wire" | "smart" | "mantis" | "shotgun" | "pierce" | "hack" | "gorilla" | "emp" | "spin";

/** 모양 · 닿는 거리 · 수 · 멈춤(틱) · 밀침 */
export interface CyberStyle {
  move: CyberMove;
  reach: number;
  n?: number;
  stun?: number;
  push?: number;
}

const C = (id: string, damageMul: number, attackSpeed: number, range: number, cyber: CyberStyle) =>
  ({ id, kind: "cyber", damageMul, attackSpeed, range, projectileSpeed: 4, cyber, exclusive: "punk" }) as const;

export const PUNK_WEAPONS = {
  /** 열선 카타나 (처음 무기): 빠른 네온 베기 */
  cyKatana: C("cyKatana", 1.1, 2.0, 32, { move: "slash", reach: 32 }),
  /** 모노와이어: 길게 휘둘러 줄 위 모두를 베고 피를 흘리게 함 */
  cyMonowire: C("cyMonowire", 0.9, 1.4, 70, { move: "wire", reach: 70 }),
  /** 스마트 건: 휘어 쫓아가는 총알 셋 */
  cySmartGun: C("cySmartGun", 0.5, 1.6, 140, { move: "smart", reach: 140, n: 3 }),
  /** 맨티스 블레이드: 팔에서 튀어나온 칼날로 양옆을 벰 */
  cyMantis: C("cyMantis", 0.8, 2.4, 30, { move: "mantis", reach: 30 }),
  /** 네온 산탄총: 여섯 발 · 밀어냄 */
  cyShotgun: C("cyShotgun", 0.4, 1.1, 90, { move: "shotgun", reach: 90, n: 6, push: 6 }),
  /** 관통 권총: 모두 꿰뚫는 한 줄 */
  cyRailPistol: C("cyRailPistol", 1.5, 1.2, 170, { move: "pierce", reach: 170 }),
  /** 퀵해킹: 가까운 적 셋을 해킹해 감전시키고 멈춤 */
  cyHack: C("cyHack", 1.0, 1.0, 120, { move: "hack", reach: 120, n: 3, stun: 40 }),
  /** 고릴라 팔: 앞을 크게 후려쳐 멀리 날림 */
  cyGorilla: C("cyGorilla", 1.9, 0.8, 34, { move: "gorilla", reach: 34, push: 16 }),
  /** EMP 수류탄: 던지면 터져 둘레를 멈춤 */
  cyEmp: C("cyEmp", 1.0, 0.8, 110, { move: "emp", reach: 32, stun: 50 }),
  /** 네온 쌍검: 둘레를 휘도는 회오리 */
  cyTwinNeon: C("cyTwinNeon", 0.9, 1.4, 34, { move: "spin", reach: 34 }),
} as const satisfies Record<string, WeaponDef>;

/** 펑크 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const PUNK = {
  /** 신경 가속: 맞힐 때마다 게이지 +1, 이만큼 차면 다음 대시에 켜짐 · 켜진 틱 · 그동안 공격 속도 배율 · 이동 속도 배율 · 적 탄 빠르기 배율
   *  그동안 무적이고, 적은 시간이 느려져 일반 적은 네 틱 중 한 틱만 · 보스는 두 틱 중 한 틱만 움직이고 공격함 */
  gaugeMax: 40,
  accelTicks: 240,
  accelSpeed: 2.6,
  accelMove: 1.7,
  shotSlow: 0.2,
  slowEvery: 4,
  bossEvery: 2,
  /** 기본 이동 속도 배율 (빠른 몸) */
  baseMove: 1.1,
  /** 모노와이어 출혈 · EMP가 터지기까지 틱 */
  bleedMul: 0.4,
  empFuse: 24,
  /** 신경 가속 중 퀵 해킹: 무기 공격과 따로, 공격하는 동안 이 틱마다 가까운 적 몇에게 (닿는 거리 · 공격력 배율 · 멈춤 틱) */
  quickEvery: 18,
  quickN: 2,
  quickReach: 120,
  quickMul: 0.7,
  quickStun: 10,
};
