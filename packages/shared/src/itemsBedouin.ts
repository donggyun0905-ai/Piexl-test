// 베두인 전용 아이템 20개 (차크람일 때 효과). 효과는 sim/bedouin·bedouinPerks. 수치는 BEDOUIN_PERKS (관리자 페이지에서 바꿈)
import type { PassiveDef } from "./items";

export const BEDOUIN_PASSIVES = {
  /** 회귀 바람: 30% 확률로 떨어진 차크람이 혼자 돌아옴 */
  returnWind: { id: "returnWind", mods: [], exclusive: "bedouin", effect: true },
  /** 신기루 걸음: 대시 대기 시간 -40%, 대시를 3번까지 모아 연속으로 씀 */
  mirageStep: { id: "mirageStep", mods: [], exclusive: "bedouin", effect: true },
  /** 사막 환영: 던질 때 환영 차크람 2개가 부채꼴로 같이 날아감 (공격력 30%) */
  desertMirage: { id: "desertMirage", mods: [], exclusive: "bedouin", effect: true },
  /** 태양 전사: 공격력 +30%, 던지는 거리 +100%, 모아 둔 대시 하나마다 피해 +5% */
  sunWarrior: { id: "sunWarrior", mods: [{ stat: "damage", mul: 1.3 }, { stat: "range", mul: 2 }], exclusive: "bedouin", effect: true },
  /** 축적: 대시를 1번 더 모아 둘 수 있음 (계속 나옴, 겹칠수록 더 많이) */
  accumulate: { id: "accumulate", mods: [], exclusive: "bedouin" },
  /** 모래 폭풍: 주울 때 모래 베기 범위 +50%, 그 자리에 2초 동안 모래 회오리 (0.5초마다 공격력 30%) */
  sandstorm: { id: "sandstorm", mods: [], exclusive: "bedouin", effect: true },
  /** 작열 칼날: 던진 차크람에 맞은 적이 2초 동안 불탐 (총 공격력 60%) */
  scorchBlade: { id: "scorchBlade", mods: [], exclusive: "bedouin", effect: true },
  /** 무희의 춤: 대시하며 빙글 돌아, 지나간 적을 한 번이 아니라 연달아 3번 벰 (한 번에 공격력 20%) */
  duneRush: { id: "duneRush", mods: [], exclusive: "bedouin", effect: true },
  /** 오아시스: 차크람을 주울 때마다 최대 체력의 3% 회복 */
  oasis: { id: "oasis", mods: [], exclusive: "bedouin", effect: true },
  /** 아지랑이: 차크람을 주운 뒤 0.75초 무적 */
  heatHaze: { id: "heatHaze", mods: [], exclusive: "bedouin", effect: true },
  /** 풍뎅이 부적: 행운 +2, 보스에게 주는 피해 +30% */
  scarabCharm: { id: "scarabCharm", mods: [{ stat: "luck", add: 2 }], exclusive: "bedouin", effect: true },
  /** 잔상 고리: 날아가는 차크람이 지나간 자리에 잔상을 남김. 잔상은 3초 동안 돌며 닿은 적을 0.5초마다 공격력 30%로 벰 */
  whirlRing: { id: "whirlRing", mods: [], exclusive: "bedouin", effect: true },
  /** 회전의 달인: 회전 베기 범위 +40%, 피해 +30% */
  spinMaster: { id: "spinMaster", mods: [], exclusive: "bedouin", effect: true },
  /** 멀리 던지기: 던지는 속도 +40%, 던진 차크람 피해 +20% */
  farThrow: { id: "farThrow", mods: [{ stat: "projectileSpeed", mul: 1.4 }], exclusive: "bedouin", effect: true },
  /** 되튕김: 날아가는 동안 벽에 닿을 때마다 계속 튕김 */
  reboundRing: { id: "reboundRing", mods: [], exclusive: "bedouin", effect: true },
  /** 모래 장막: 차크람을 던져 손이 비어 있는 동안 받는 피해 -20% */
  sandVeil: { id: "sandVeil", mods: [], exclusive: "bedouin", effect: true },
  /** 날랜 손: 차크람을 주우면 대시 1번을 바로 돌려받음 */
  quickCatch: { id: "quickCatch", mods: [], exclusive: "bedouin", effect: true },
  /** 신기루 분신: 주울 때 모래 베기 피해 +80% */
  mirageDouble: { id: "mirageDouble", mods: [], exclusive: "bedouin", effect: true },
  /** 유목민의 혼: 이동 속도 +0.15, 공격 속도 +10% */
  nomadSpirit: { id: "nomadSpirit", mods: [{ stat: "moveSpeed", add: 0.15 }, { stat: "attackSpeed", mul: 1.1 }], exclusive: "bedouin" },
  /** 사막의 왕: 3번째로 던질 때마다 두 배 크기의 거대 차크람 (피해 2배) */
  desertKing: { id: "desertKing", mods: [], exclusive: "bedouin", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 베두인 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const BEDOUIN_PERKS = {
  returnWind: { chance: 0.3 },
  mirageStep: { cooldown: 0.6, charges: 3 },
  desertMirage: { damage: 0.3, angle: 0.35 },
  sunWarrior: { perDash: 0.05 },
  sandstorm: { area: 1.5, ticks: 120, damage: 0.3, radius: 30 },
  scorchBlade: { damage: 0.6 },
  scarabCharm: { boss: 1.3 },
  duneRush: { damage: 0.2, hits: 3, gap: 5 },
  oasis: { heal: 0.03 },
  heatHaze: { ticks: 45 },
  whirlRing: { damage: 0.3, ticks: 180, every: 5 },
  spinMaster: { area: 1.4, damage: 1.3 },
  farThrow: { damage: 1.2 },
  reboundRing: { bounces: 99 },
  sandVeil: { taken: 0.8 },
  mirageDouble: { damage: 1.8 },
  desertKing: { every: 3, size: 2, damage: 2 },
};
