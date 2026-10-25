// 서기관(히든, 아카식 레코드) 전용 무기: 깃펜으로 잉크 탄을 쏘아 적에게 기록(잉크)을 새기고,
// 몇 번째 공격마다 그 무기의 글자(문장)가 써지며 발동. 계산은 sim/scribe
import type { WeaponDef } from "./content";

/**
 * 글자: blade 검(나와 적 사이를 가르는 잉크 칼날) · burst 폭(겨눈 곳 폭발) · seal 봉(둘레 적 기절) · bolt 뢰(기록된 적에게 연쇄 번개)
 * frost 빙(둘레 피해 + 멈춤) · flame 염(둘레 불태움) · recall 재(기록된 적마다 새긴 만큼 피해) · star 성(별똥별 다섯)
 * void 멸(가장 약한 적 하나를 크게) · origin 원본(모든 글자를 차례로)
 */
export type ScribeWord = "blade" | "burst" | "seal" | "bolt" | "frost" | "flame" | "recall" | "star" | "void" | "origin";

const Q = (id: string, word: ScribeWord, damageMul: number, attackSpeed: number, range: number, extra: Partial<WeaponDef> = {}) =>
  ({ id, kind: "quill", damageMul, attackSpeed, range, projectileSpeed: 3.6, word, exclusive: "scribe", ...extra }) as const;

export const SCRIBE_WEAPONS = {
  /** 깃펜 (처음 무기): 검 */
  quillPen: Q("quillPen", "blade", 1, 2.2, 110),
  /** 먹붓: 폭 */
  inkBrush: Q("inkBrush", "burst", 1.1, 1.8, 100),
  /** 봉인서: 봉 */
  sealScroll: Q("sealScroll", "seal", 0.9, 2, 100),
  /** 뇌전 문서: 뢰 */
  thunderTome: Q("thunderTome", "bolt", 0.9, 2.2, 120),
  /** 빙결 문서: 빙 */
  frostCodex: Q("frostCodex", "frost", 0.9, 2, 100),
  /** 화염 서판: 염 */
  flameTablet: Q("flameTablet", "flame", 1, 2, 100),
  /** 기록의 서: 재 */
  chronicle: Q("chronicle", "recall", 0.8, 2.4, 120),
  /** 별의 성서: 성 */
  starScripture: Q("starScripture", "star", 1, 1.9, 130),
  /** 망각의 페이지: 멸 */
  oblivionPage: Q("oblivionPage", "void", 1.2, 1.6, 110),
  /** 아카식 원본: 원본 (모든 글자를 차례로) */
  akashicOrigin: Q("akashicOrigin", "origin", 1.1, 2.2, 130),
} as const satisfies Record<string, WeaponDef>;

/** 서기관 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const SCRIBE = {
  /** 몇 번째 공격마다 글자가 써짐 · 적 하나에 새길 수 있는 기록 수 · 글자 피해 배율(공격력) */
  every: 5,
  maxInk: 9,
  wordMul: 2.2,
  /** 글자마다: 범위 · 수 · 멈춤(틱) · 불탐 */
  bladeWidth: 12,
  burstR: 40,
  sealR: 70,
  sealStun: 70,
  boltChain: 6,
  frostR: 60,
  frostStun: 45,
  flameR: 60,
  recallPer: 0.5,
  stars: 5,
  starR: 26,
  voidMul: 3,
} as const;
