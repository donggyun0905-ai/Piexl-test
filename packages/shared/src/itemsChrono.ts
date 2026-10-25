// 시간술사 전용 아이템 (시간술사 무기일 때 효과). 효과는 sim/chrono. 수치는 CHRONO_PERKS (관리자 페이지에서 바꿈)
import type { PassiveDef } from "./items";

export const CHRONO_PASSIVES = {
  /** 잔상 피해 120% → 150% */
  longEcho: { id: "longEcho", mods: [], exclusive: "chronomancer", effect: true },
  /** 잔상이 1초 → 0.6초 만에 나옴 */
  quickEcho: { id: "quickEcho", mods: [], exclusive: "chronomancer", effect: true },
  /** 잔상이 30% 확률로 잔상을 하나 더 남김 */
  doubleEcho: { id: "doubleEcho", mods: [], exclusive: "chronomancer", effect: true },
  /** 맞은 적이 0.75초 느려짐 */
  timeSlow: { id: "timeSlow", mods: [], exclusive: "chronomancer", effect: true },
  /** 공격 속도 +15%, 탄 속도 +15% */
  haste: { id: "haste", mods: [{ stat: "attackSpeed", mul: 1.15 }, { stat: "projectileSpeed", mul: 1.15 }], exclusive: "chronomancer" },
  /** 사거리 안 적의 이동 속도 -20% (보스 제외) */
  warpField: { id: "warpField", mods: [], exclusive: "chronomancer", effect: true },
  /** 잔상이 나타날 때 그 자리에서 작은 폭발 (공격력 40%) */
  echoBurst: { id: "echoBurst", mods: [], exclusive: "chronomancer", effect: true },
  /** 5번째 공격마다 피해 2배 (잔상도) */
  precision: { id: "precision", mods: [], exclusive: "chronomancer", effect: true },
  /** 이동 속도 +0.1, 대시 대기 시간 20% 감소 */
  clockwork: { id: "clockwork", mods: [{ stat: "moveSpeed", add: 0.1 }], exclusive: "chronomancer", effect: true },
  /** 최대 체력 +25, 잔상이 적을 맞힐 때마다 체력 0.5 회복 */
  eternity: { id: "eternity", mods: [{ stat: "maxHp", add: 25 }], exclusive: "chronomancer", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 시간술사 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱) */
export const CHRONO_PERKS = {
  longEcho: { damage: 1.5 },
  quickEcho: { ticks: 36 },
  doubleEcho: { chance: 0.3 },
  timeSlow: { ticks: 45 },
  warpField: { speed: 0.8 },
  echoBurst: { damage: 0.4, radius: 18 },
  precision: { every: 5, damage: 2 },
  clockwork: { cooldown: 0.8 },
  eternity: { heal: 0.5 },
};
