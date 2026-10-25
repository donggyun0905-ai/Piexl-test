// 장로(비르디아) 무기: 진법 10개. 공격하면 적 자리에 네모난 진을 깔고, 잠시 뒤 진이 발동해 공격 (계산은 sim/elder)
import type { WeaponDef } from "./content";

/**
 * 진 종류: vine 덩굴문(초록 문에서 큰 덩굴이 솟아 강타) · daggers 오검진(단검 다섯을 꽂아 그 위에 불기둥) · walls 협벽진(벽 둘이 양쪽에서 짓뭉갬)
 * pit 함정진(구멍이 열려 혼란·기절 + 피해) · swords 낙검진(강철 검이 하늘에서 떨어짐) · thunder 뇌인진(번개가 내리침) · frost 빙결진(얼려 멈춤)
 * wind 풍뢰진(가운데로 빨아들임) · fist 암권진(바위 주먹이 솟아 날려 버림) · heaven 천원진(네 기둥의 빛 + 마지막 큰 폭발)
 */
export type FormationKind = "vine" | "daggers" | "walls" | "pit" | "swords" | "thunder" | "frost" | "wind" | "fist" | "heaven";

const E = (id: string, formation: FormationKind, damageMul: number, attackSpeed: number, range: number) =>
  ({ id, kind: "formation", damageMul, attackSpeed, range, projectileSpeed: 0, formation, exclusive: "elder" }) as const;

export const ELDER_WEAPONS = {
  /** 덩굴문 (처음 무기) */
  vineGate: E("vineGate", "vine", 1, 0.9, 110),
  /** 오검진 */
  fiveDaggers: E("fiveDaggers", "daggers", 1, 0.7, 110),
  /** 협벽진 */
  crushWalls: E("crushWalls", "walls", 1, 0.8, 100),
  /** 함정진 */
  pitTrap: E("pitTrap", "pit", 1, 0.8, 110),
  /** 낙검진 */
  swordRain: E("swordRain", "swords", 1, 0.7, 120),
  /** 뇌인진 */
  thunderSeal: E("thunderSeal", "thunder", 1, 0.75, 120),
  /** 빙결진 */
  frostSquare: E("frostSquare", "frost", 1, 0.8, 110),
  /** 풍뢰진 */
  windCage: E("windCage", "wind", 1, 0.75, 110),
  /** 암권진 */
  stoneFist: E("stoneFist", "fist", 1, 0.8, 100),
  /** 천원진 */
  heavenPalace: E("heavenPalace", "heaven", 1.1, 0.55, 130),
} as const satisfies Record<string, WeaponDef>;

/** 진마다: 반지름 · 발동까지 틱 · 발동 뒤 남는 틱(0이면 한 번) · 맥박 사이 틱 · 피해 배율 · 기절 · 밀침 */
export const FORMATIONS: Record<FormationKind, { r: number; arm: number; dur: number; every: number; mul: number; stun?: number; push?: number }> = {
  vine: { r: 24, arm: 30, dur: 0, every: 0, mul: 2.4, push: 12 },
  daggers: { r: 26, arm: 40, dur: 60, every: 15, mul: 0.9 },
  walls: { r: 26, arm: 30, dur: 0, every: 0, mul: 2.8, stun: 40 },
  pit: { r: 24, arm: 24, dur: 120, every: 30, mul: 0.7, stun: 25 },
  swords: { r: 32, arm: 30, dur: 90, every: 15, mul: 0.8 },
  thunder: { r: 32, arm: 30, dur: 90, every: 20, mul: 1.1 },
  frost: { r: 28, arm: 30, dur: 0, every: 0, mul: 1.6, stun: 60 },
  wind: { r: 34, arm: 20, dur: 90, every: 10, mul: 0.25 },
  fist: { r: 22, arm: 36, dur: 0, every: 0, mul: 3.2, push: 22 },
  heaven: { r: 40, arm: 45, dur: 120, every: 20, mul: 1.2 },
};

/** 장로 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const ELDER = {
  /** 한 번에 깔려 있을 수 있는 진 수 */
  maxSeals: 3,
  /** 낙검진 한 맥박의 검 수·반경 · 풍뢰진이 한 틱에 끄는 거리 · 천원진 마지막 폭발 배율 */
  swords: 2,
  swordR: 10,
  pull: 2.5,
  heavenFinal: 3,
} as const;
