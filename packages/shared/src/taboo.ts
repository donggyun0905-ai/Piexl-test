// 금기의 서: 혼자 하기에서 스스로 거는 어려움 30가지. 같은 금기를 여러 번 걸 수 있고(최대 max) 걸 때마다 금기 점수(pts)가 더해짐.
// 라스트 보스를 깨면 그 점수가 훈장에 새겨짐 (순위표에는 안 남음). 계산은 sim/taboo. v = 한 번 걸 때마다 바뀌는 양
export const TABOO_IDS = [
  // 적
  "fleshHp", "bossHp", "horde", "eliteMore", "haste", "fury", "bulletSpeed", "deathBurst", "fangs",
  // 받는 피해
  "frail", "shortInvuln",
  // 돈·상점·보상
  "poverty", "inflation", "emptyShelf", "rerollTax", "noUseDrop", "fewChoices", "poorTreasure", "lessLuck",
  // 내 몸
  "weakBody", "dullBlade", "heavyFeet", "slowHands", "shortReach", "slowDash", "bitterPotion", "dryWell", "lessHeal", "bloodToll", "fleeCost",
] as const;
export type TabooId = (typeof TABOO_IDS)[number];

export interface TabooDef {
  /** 한 번 걸 때 더해지는 점수 · 최대로 걸 수 있는 수 · 한 번마다 바뀌는 양 */
  pts: number;
  max: number;
  v: number;
}

export const TABOOS: Record<TabooId, TabooDef> = {
  /** 일반 적 체력 +20% */
  fleshHp: { pts: 1, max: 5, v: 0.2 },
  /** 보스 체력 +20% */
  bossHp: { pts: 2, max: 5, v: 0.2 },
  /** 전투방 적 +1 */
  horde: { pts: 2, max: 3, v: 1 },
  /** 강한 적 방 적 +2 */
  eliteMore: { pts: 1, max: 2, v: 2 },
  /** 적 이동 속도 +10% */
  haste: { pts: 2, max: 3, v: 0.1 },
  /** 적 공격 속도 +15% (공격 준비 시간이 빨리 줄어듦) */
  fury: { pts: 2, max: 3, v: 0.15 },
  /** 적 탄 속도 +15% */
  bulletSpeed: { pts: 1, max: 3, v: 0.15 },
  /** 쓰러진 적 자리에 잠시 뒤 폭발 (몸 닿는 피해만큼) */
  deathBurst: { pts: 3, max: 1, v: 1 },
  /** 적 몸에 닿는 피해 +25% */
  fangs: { pts: 1, max: 4, v: 0.25 },
  /** 받는 모든 피해 +15% */
  frail: { pts: 2, max: 5, v: 0.15 },
  /** 맞은 뒤 무적 시간 -30% */
  shortInvuln: { pts: 2, max: 2, v: 0.3 },
  /** 얻는 돈 -20% */
  poverty: { pts: 1, max: 3, v: 0.2 },
  /** 상점 가격 +25% */
  inflation: { pts: 1, max: 4, v: 0.25 },
  /** 상점 진열 1칸 줄어듦 (사용 아이템 → 무기 순) */
  emptyShelf: { pts: 2, max: 2, v: 1 },
  /** 상점 새로고침 가격 2배 */
  rerollTax: { pts: 1, max: 2, v: 2 },
  /** 방을 정리해도 사용 아이템이 나오지 않음 */
  noUseDrop: { pts: 2, max: 1, v: 1 },
  /** 층 보상(보스) 고를 수 있는 패시브 -1 */
  fewChoices: { pts: 2, max: 2, v: 1 },
  /** 보물방에 무기만 */
  poorTreasure: { pts: 1, max: 1, v: 1 },
  /** 행운 -1 */
  lessLuck: { pts: 1, max: 3, v: 1 },
  /** 최대 체력 -10% */
  weakBody: { pts: 2, max: 5, v: 0.1 },
  /** 공격력 -10% */
  dullBlade: { pts: 2, max: 5, v: 0.1 },
  /** 이동 속도 -10% */
  heavyFeet: { pts: 1, max: 3, v: 0.1 },
  /** 공격 속도 -10% */
  slowHands: { pts: 2, max: 3, v: 0.1 },
  /** 사거리 -10% */
  shortReach: { pts: 1, max: 3, v: 0.1 },
  /** 대시 재사용 시간 +25% */
  slowDash: { pts: 1, max: 3, v: 0.25 },
  /** 회복약 회복량 -25% */
  bitterPotion: { pts: 1, max: 3, v: 0.25 },
  /** 쉼터 회복 -50% */
  dryWell: { pts: 1, max: 2, v: 0.5 },
  /** 모든 회복 -20% */
  lessHeal: { pts: 2, max: 3, v: 0.2 },
  /** 방에 들어갈 때마다 체력 -2 (1 아래로는 안 내려감) */
  bloodToll: { pts: 2, max: 3, v: 2 },
  /** 잠긴 출구로 억지로 나갈 때 내는 체력 +10%p (최대 체력 비율) */
  fleeCost: { pts: 1, max: 2, v: 0.1 },
};

/** 걸린 금기 (금기 → 건 수) */
export type TabooSet = Partial<Record<TabooId, number>>;

/** 금기 점수 합 */
export function tabooPoints(t: TabooSet | undefined): number {
  if (!t) return 0;
  return TABOO_IDS.reduce((sum, id) => sum + TABOOS[id].pts * Math.min(TABOOS[id].max, t[id] ?? 0), 0);
}

/** 모든 금기를 끝까지 걸었을 때 점수 */
export const TABOO_MAX_POINTS = TABOO_IDS.reduce((sum, id) => sum + TABOOS[id].pts * TABOOS[id].max, 0);

/** 저장된 값 정리 (모르는 금기·범위 밖은 버림). 하나도 없으면 undefined */
export function cleanTaboo(raw: unknown): TabooSet | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const out: TabooSet = {};
  for (const id of TABOO_IDS) {
    const n = Math.floor(Number((raw as Record<string, unknown>)[id] ?? 0));
    if (n > 0) out[id] = Math.min(TABOOS[id].max, n);
  }
  return Object.keys(out).length ? out : undefined;
}
