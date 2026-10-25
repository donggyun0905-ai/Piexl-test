// 시간술사 전용 무기: 공격 방식(chrono)이 무기마다 다르고, 본인 공격(70%) 뒤 잠시 뒤 공격한 그 자리에서 잔상이 더 세게(120%) 한 번 더 함 (sim/chrono)
import type { WeaponDef } from "./content";

/**
 * bolt 시간탄 · hands 시곗바늘(앞쪽 베기) · sand 모래시계(맞으면 느려짐) · pendulum 진자(아주 넓게 휘두름) · bomb 시한폭탄(1초 뒤 폭발)
 * disc 되감기 원반(뚫고 되돌아옴) · stop 스톱워치(둘레 피해 + 잠깐 멈춤) · gears 톱니 폭풍(3발) · future 예지(잠시 뒤 그 적 자리에 낙뢰)
 * paradox 패러독스(잔상이 또 잔상을 남김)
 */
export type ChronoStyle = "bolt" | "hands" | "sand" | "pendulum" | "bomb" | "disc" | "stop" | "gears" | "future" | "paradox";

export const CHRONO_WEAPONS = {
  pocketwatch: { id: "pocketwatch", kind: "chrono", damageMul: 0.63, attackSpeed: 2.4, range: 110, projectileSpeed: 3.2, chrono: "bolt", exclusive: "chronomancer" },
  clockhands: { id: "clockhands", kind: "chrono", damageMul: 0.67, attackSpeed: 2.2, range: 34, projectileSpeed: 0, arcCos: 0.2, chrono: "hands", exclusive: "chronomancer" },
  hourglass: { id: "hourglass", kind: "chrono", damageMul: 0.67, attackSpeed: 2.2, range: 105, projectileSpeed: 2.8, chrono: "sand", exclusive: "chronomancer" },
  pendulum: { id: "pendulum", kind: "chrono", damageMul: 1.03, attackSpeed: 1.3, range: 42, projectileSpeed: 0, arcCos: -0.3, chrono: "pendulum", exclusive: "chronomancer" },
  timebomb: { id: "timebomb", kind: "chrono", damageMul: 1.54, attackSpeed: 0.9, range: 100, projectileSpeed: 0, blast: 28, chrono: "bomb", exclusive: "chronomancer" },
  rewinddisc: { id: "rewinddisc", kind: "chrono", damageMul: 0.67, attackSpeed: 1.4, range: 100, projectileSpeed: 2.6, chrono: "disc", exclusive: "chronomancer" },
  stopwatch: { id: "stopwatch", kind: "chrono", damageMul: 0.95, attackSpeed: 1.2, range: 36, projectileSpeed: 0, chrono: "stop", exclusive: "chronomancer" },
  gearstorm: { id: "gearstorm", kind: "chrono", damageMul: 0.28, attackSpeed: 2, range: 95, projectileSpeed: 3.2, shots: 3, spread: [0.9659, 0.2588], pierce: 1, chrono: "gears", exclusive: "chronomancer" },
  futuresight: { id: "futuresight", kind: "chrono", damageMul: 0.99, attackSpeed: 1.3, range: 130, projectileSpeed: 0, blast: 14, chrono: "future", exclusive: "chronomancer" },
  paradox: { id: "paradox", kind: "chrono", damageMul: 0.42, attackSpeed: 2.2, range: 105, projectileSpeed: 3.4, chrono: "paradox", exclusive: "chronomancer" },
} as const satisfies Record<string, WeaponDef>;
