// 사멸(헬리오스, 사천 당가) 무기 10개: 모두 독침. 모든 침에 독 + 죽음 (계산은 sim/samyeol)
import type { WeaponDef } from "./content";

/** 침 던지는 모양: fan 부채꼴 · ring 사방 · rain 흩뿌림 · volley 잇따라 · line 한 줄 꿰뚫기 */
export type NeedlePattern = "fan" | "ring" | "rain" | "volley" | "line";

/** 침 수 · 모양 · 사이 각도 · 꿰뚫는 수 · 독·죽음 배율 · 맞히면 느려짐 · 던질 때 그 자리에 독가스 */
export interface NeedleStyle {
  n: number;
  pattern: NeedlePattern;
  spread: number;
  pierce?: number;
  venom?: number;
  doom?: number;
  slow?: number;
  mist?: boolean;
  /** 사방 침과 함께 앞쪽 부채꼴도 (만천화우) */
  plusFan?: number;
}

const N = (id: string, damageMul: number, attackSpeed: number, range: number, needle: NeedleStyle) =>
  ({ id, kind: "needle", damageMul, attackSpeed, range, projectileSpeed: 3.8, needle, exclusive: "samyeol" }) as const;

export const SAMYEOL_WEAPONS = {
  /** 당가 독침 (처음 무기): 세 갈래 */
  tangNeedle: N("tangNeedle", 0.6, 2.1, 120, { n: 3, pattern: "fan", spread: 0.15 }),
  /** 폭우침: 앞쪽으로 넓게 흩뿌림 */
  stormNeedles: N("stormNeedles", 0.45, 1.4, 110, { n: 8, pattern: "rain", spread: 0.8 }),
  /** 연화침: 연꽃처럼 사방으로 */
  lotusNeedles: N("lotusNeedles", 0.45, 1.2, 100, { n: 12, pattern: "ring", spread: 0 }),
  /** 실침: 한 줄로 모두 꿰뚫음 */
  threadNeedle: N("threadNeedle", 1.6, 1.6, 180, { n: 1, pattern: "line", spread: 0, pierce: 99 }),
  /** 부채침: 일곱 갈래 */
  fanNeedles: N("fanNeedles", 0.45, 1.5, 110, { n: 7, pattern: "fan", spread: 0.12 }),
  /** 연사침: 다섯 발을 잇따라 */
  chainNeedles: N("chainNeedles", 0.55, 1.4, 140, { n: 5, pattern: "volley", spread: 0.04 }),
  /** 안개침: 던질 때 겨눈 곳에 독가스가 피어남 */
  mistNeedles: N("mistNeedles", 0.5, 1.3, 110, { n: 4, pattern: "fan", spread: 0.2, mist: true }),
  /** 혼침: 죽음이 두 배 */
  soulNeedle: N("soulNeedle", 0.8, 1.7, 130, { n: 2, pattern: "fan", spread: 0.1, doom: 2 }),
  /** 전갈침: 독이 두 배, 맞으면 느려짐 */
  scorpionNeedles: N("scorpionNeedles", 0.55, 1.6, 120, { n: 4, pattern: "fan", spread: 0.14, venom: 2, slow: 45 }),
  /** 만천화우: 사방으로 스물넷 + 앞으로 다섯 (느림) */
  thousandNeedles: N("thousandNeedles", 0.4, 0.9, 120, { n: 24, pattern: "ring", spread: 0, plusFan: 5 }),
} as const satisfies Record<string, WeaponDef>;

/** 사멸 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const SAMYEOL = {
  /** 맞히면 독(0.5초마다 피해의 venom배) · 죽음(1초마다 피해의 doom배)이 이 틱 동안 */
  venom: 0.25,
  venomTicks: 180,
  doom: 0.3,
  doomTicks: 240,
  /** 던진 침이 이만큼 쌓일 때마다 독가스 하나 (최대 수 · 반경 · 남는 틱 · 맥박 · 피해는 공격력 배율) */
  gasEvery: 30,
  gasMax: 6,
  gasR: 30,
  gasTicks: 360,
  pulse: 30,
  gasMul: 0.4,
  /** 치명타 (독·죽음 같은 상태이상에도 뜸) */
  critChance: 0.2,
  critMul: 1.5,
  dotCritMul: 2,
  /** 연사침 사이 틱 · 침 크기 */
  volleyGap: 4,
  needleR: 2.5,
};
