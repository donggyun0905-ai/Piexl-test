// 추적자(아스칼론, 시즌 2): 튜닝한 저격총 하나 + 스킬 셋(1 암습 저격 · 2 강력한 한방 · 3 연발사격). 계산은 sim/tracker
import type { WeaponDef } from "./content";

export const TRACKER_WEAPONS = {
  /** 추적자의 저격총: 느리지만 멀리 꿰뚫는 한 발 */
  trSniper: { id: "trSniper", kind: "snipe", damageMul: 1.7, attackSpeed: 0.9, range: 230, projectileSpeed: 9, exclusive: "tracker" },
} as const satisfies Record<string, WeaponDef>;

/** 추적자 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const TRACKER = {
  /** 평소 저격: 꿰뚫는 적 수 */
  pierce: 1,
  /** 스킬 대기 시간: 1 암습 저격 10초 · 2 강력한 한방 60초 · 3 연발사격 3초 */
  cooldowns: [600, 3600, 180] as readonly number[],
  /** 암습 저격: 발 수 · 제한 시간(이 안에 다 쏴야 함) · 한 발 피해 배율 · 발 사이 틱 · 조준 원 반지름 · 자동 조준 간격 */
  ambushShots: 10,
  ambushTicks: 600,
  ambushMul: 2,
  ambushGap: 12,
  ambushR: 12,
  ambushAuto: 30,
  /** 강력한 한방: 모으는 틱 · 공격력 배율 · 최대 체력 비율 (보스는 그 1/5) · 앞 막는 벽 거리·폭 · 줄 폭 */
  powerCharge: 90,
  powerMul: 10,
  powerHp: 0.2,
  powerBoss: 0.2,
  wallDist: 14,
  wallWidth: 34,
  powerWidth: 10,
  /** 연발사격: 발 수 · 발 사이 틱 · 한 발 피해 배율 · 흔들림(라디안 ±) */
  burstShots: 10,
  burstGap: 3,
  burstMul: 0.7,
  burstSpread: 0.4,
};
