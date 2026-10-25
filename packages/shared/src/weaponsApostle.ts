// 악의 사도 전용 무기: 뒤집힌 십자가가 하늘에서 떨어져 적을 짓누름 · 일곱 죄의 십자가는 피해 없이 장판을 남김 · 사탄의 가면 · 역천의 베드로. 계산은 sim/apostle·apostleFields
import type { WeaponDef } from "./content";

/** 무기마다 공격 종류 (일곱 죄는 장판) */
export type SinKind = "cross" | "wrath" | "sloth" | "gluttony" | "envy" | "lust" | "greed" | "pride" | "mask" | "heresy";

const C = (id: string, sin: SinKind, damageMul = 1, attackSpeed = 0.9, range = 130) =>
  ({ id, kind: "cross", damageMul, attackSpeed, range, projectileSpeed: 0, sin, exclusive: "apostle" }) as const;

export const APOSTLE_WEAPONS = {
  /** 뒤집힌 십자가 목걸이 (처음 무기): 하늘에서 큰 십자가가 떨어져 짓누름 */
  invertedCross: C("invertedCross", "cross", 1.5, 1.1),
  /** 분노: 검붉은 십자가 → 화상 장판 */
  wrathCross: C("wrathCross", "wrath"),
  /** 나태: 하늘색 십자가 → 둔화 장판 (쌓이면 깊은 잠 + 큰 피해) */
  slothCross: C("slothCross", "sloth"),
  /** 탐식: 주황 십자가 → 방어력을 깎고 부패시키는 장판 */
  gluttonyCross: C("gluttonyCross", "gluttony"),
  /** 질투: 연두 십자가 → 독 장판 */
  envyCross: C("envyCross", "envy"),
  /** 색욕: 분홍 십자가 → 적끼리 서로 공격하는 장판 (준 피해만큼 조금 회복) */
  lustCross: C("lustCross", "lust"),
  /** 탐욕: 황금 십자가 → 느려지고 가끔 묶이는 장판 (느리지만 센 피해) */
  greedCross: C("greedCross", "greed"),
  /** 교만: 보라 십자가 → 아주 느려지고 가끔 중력에 끌려 짓눌리는 장판 */
  prideCross: C("prideCross", "pride"),
  /** 사탄의 가면: 근처 적 밑에서 검은 오라가 올라와 죽음 */
  satanMask: C("satanMask", "mask", 1, 0.8, 80),
  /** 역천의 베드로: 하늘색 불꽃으로 근접 공격 (내 최대 체력의 10% 더) · 업화 */
  heresyPeter: { id: "heresyPeter", kind: "cross", damageMul: 1, attackSpeed: 1.6, range: 34, projectileSpeed: 0, arcCos: 0.2, sin: "heresy", exclusive: "apostle" },
} as const satisfies Record<string, WeaponDef>;

/** 무기마다 빛깔 (십자가·장판·숫자) */
export const SIN_COLORS: Record<SinKind, string> = {
  cross: "#c8c0d8",
  wrath: "#a8202e",
  sloth: "#7ad0ff",
  gluttony: "#ff9a2a",
  envy: "#9ae84a",
  lust: "#ff6ab8",
  greed: "#ffd040",
  pride: "#9a4aff",
  mask: "#1a1020",
  heresy: "#5ad8ff",
};

/** 악의 사도 수치 (배율은 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const APOSTLE = {
  /** 십자가가 떨어지기까지 틱 · 짓누르는 반경 · 장판 반경·길이·최대 수 */
  drop: 18,
  crushR: 20,
  fieldR: 26,
  fieldTicks: 240,
  maxFields: 4,
  /** 영혼: 회복(최대 체력 비율) · 남는 틱 · 줍는 거리 · 보스를 때릴 때 나올 확률 · 최대 수 */
  soulHeal: 0.1,
  /** 영혼을 먹을 때마다 공격력 + (이번 판 내내, 사탄의 가면을 들면 하나마다 더 많이) */
  soulDamage: 0.01,
  maskSoulDamage: 0.1,
  soulTicks: 600,
  soulPick: 8,
  bossSoul: 0.1,
  maxSouls: 20,
  /** 장판이 안에 있는 적에게 효과를 주는 간격 (틱, 따로 정한 장판 빼고) */
  fieldEvery: 15,
  wrath: { burn: 2.2 },
  sloth: { slow: 40, stacks: 4, sleep: 90, bossSleep: 20, mul: 4 },
  gluttony: { every: 8, def: 0.05, maxDef: 0.3, rot: 0.12 },
  envy: { ticks: 120, mul: 0.6 },
  /** 색욕: 4틱마다 장판 위 적에게 공격력 6% · 준 피해의 10% 회복 */
  lust: { every: 4, mul: 0.06, heal: 0.1 },
  greed: { every: 25, mul: 1, slow: 60, root: 0.3, rootTicks: 60 },
  pride: { sluggish: 40, every: 60, pull: 14, mul: 1.6 },
  /** 사탄의 가면: 반경 · 한 번에 최대 · 올라오기까지 틱 · 최대 체력(보스는 1/4)의 10% + 공격력 60% */
  mask: { radius: 80, max: 5, rise: 24, pct: 0.1, bossDiv: 4, mul: 0.6 },
  /** 역천: 내 최대 체력의 10% 더 · 업화 확률·틱·0.5초마다 피해 */
  heresy: { hpMul: 0.1, chance: 0.3, ticks: 180, mul: 0.2 },
};
