// 장수 전용 무기(창·검·월도): 누를 때마다 콤보가 끊기지 않고 그냥 이어짐. 묶음이 끝날 때마다 조금 쉼(pause).
// 기본: 찌르기 3번 → 휘두르기 2번 → 몸을 살짝 돌며 앞으로 내리꽂는 돌진 찌르기(끝에서 폭발). 계산은 sim/general·generalMoves
// 숨겨진 힘(아이템): 콤보 마지막에 그 무기 주인의 필살기 (sim/generalLegends)
import type { WeaponDef } from "./content";

/**
 * thrust 찌르기(앞으로 길게) · swing 휘두르기(앞쪽 부채꼴) · lunge 돌진 내리꽂기(앞으로 살짝 나가며 찌르고 끝에서 폭발, 기본 창만)
 * spin 한 바퀴 베기 · wave 검기를 날림(관통) · double 두 갈래 찌르기
 * cleave 크게 내려베기(넓고 묵직한 앞쪽 반원) · rush 돌진 베기(앞으로 멀리 달려가며 길 위의 적을 모두 벰)
 * flurry 연속 찌르기(5번 빠르게, 살짝 퍼짐) · shock 발 구르기(내 둘레 충격파) · fan 부채꼴 검기 셋 · cross X자 베기
 */
export type SpearMoveKind = "thrust" | "swing" | "lunge" | "spin" | "wave" | "double" | "cleave" | "rush" | "flurry" | "shock" | "fan" | "cross";

export interface SpearMove {
  kind: SpearMoveKind;
  mul: number;
  /** 사거리 배율 (1 = 무기 사거리) */
  reach?: number;
  /** 이 기술 뒤에 조금 쉼 (묶음 끝) */
  pause?: true;
}

/** 필살기: 광풍난무 · 청룡참 · 장판교 호령 · 패도 · 인덕 · 삼한일통 · 일기당천 · 칠진칠출 · 학익진 · 황산벌 결사 · (훈련용 창) 돌격 */
export type LegendKind = "frenzy" | "dragonCleave" | "roar" | "hegemon" | "benevolence" | "unify" | "loneHero" | "sevenCharge" | "craneWing" | "lastStand" | "charge";

const T = (mul = 1, pause?: true): SpearMove => ({ kind: "thrust", mul, ...(pause ? { pause } : {}) });
const S = (mul = 1, pause?: true): SpearMove => ({ kind: "swing", mul, ...(pause ? { pause } : {}) });
const L = (mul = 1.8): SpearMove => ({ kind: "lunge", mul, pause: true });
const P = true as const;

const M = (kind: SpearMoveKind, mul: number, pause?: true, reach?: number): SpearMove => ({ kind, mul, ...(pause ? { pause } : {}), ...(reach ? { reach } : {}) });

/** 무기마다 콤보 (마지막 기술 뒤 처음으로). 기본 창만 내리꽂기로 끝나고, 명장 무기는 저마다 다른 마무리 */
export const SPEAR_COMBOS: Record<string, readonly SpearMove[]> = {
  /** 훈련용 창: 찌르기 3 → 휘두르기 2 → 돌진 내리꽂기 */
  basic: [T(), T(), T(1.1, P), S(), S(1.1, P), L()],
  /** 방천화극(여포): 크게 휘두르고 → 한 바퀴 두 번 → 돌진 베기로 휩쓸며 빠져나감 (무쌍의 난무) */
  halberd: [S(1.1), T(), S(1.2, P), M("spin", 1.1), M("spin", 1.3, P), M("rush", 2)],
  /** 청룡언월도(관우): 크게 내려베기 → 휘두르기 → 검기 → 크게 내려베기 → 거대한 검기 (언월도의 무게) */
  glaive: [M("cleave", 1.3), S(1.1), M("wave", 1.3, P), M("cleave", 1.5), M("wave", 2.2, P, 1.4)],
  /** 장팔사모(장비): 아주 긴 찌르기 셋 → 연속 찌르기 → 발 구르기 충격파 (장판교의 호통) */
  serpent: [M("thrust", 1, undefined, 1.3), M("thrust", 1, undefined, 1.3), M("thrust", 1.1, P, 1.3), M("flurry", 1.6, P, 1.2), M("shock", 2)],
  /** 의천검(조조): 빠른 베기 넷 → X자 베기 → 돌진 베기 (패자의 날렵한 검) */
  sword: [S(0.8), S(0.8), S(0.85), S(0.9, P), M("cross", 1.4), M("rush", 1.6)],
  /** 쌍고검(유비): 두 갈래 찌르기 → 엇갈려 휘두르기 → X자 베기 → 두 칼로 한 바퀴 */
  twin: [M("double", 0.75), S(0.8), M("double", 0.8, P), M("cross", 1.1), M("spin", 1.6)],
  /** 화랑 보검(김유신): 찌르기 → 휘두르기 → 검기 → 부채꼴 검기 셋 (화랑의 기개) */
  hwarang: [T(), S(), M("wave", 1.1, P), T(1.1), M("fan", 1.9)],
  /** 고려 대도(척준경): 크게 내려베기 둘 → 한 바퀴 → 돌진 베기 → 크게 내려베기 (혼자서 적진을 가름) */
  lone: [M("cleave", 1.4), M("cleave", 1.5, P), M("spin", 1.3), M("rush", 1.8, P), M("cleave", 2.3)],
  /** 애각창(조운): 찌르기·휘두르기 → 연속 찌르기 → 찌르기 → 돌진 베기 → 한 바퀴 (칠진칠출: 적진을 뚫고 돌아 나옴) */
  cliff: [T(), S(), M("flurry", 1.2, P), T(1.1), M("rush", 1.7, P), M("spin", 1.6)],
  /** 쌍룡검(이순신): 휘두르기 둘 → 검기 → 부채꼴 검기 → 발 구르기 충격파 (학익진처럼 펼침) */
  twinDragon: [S(), S(1.1, P), M("wave", 1.2), M("fan", 1.5, P), M("shock", 1.8)],
  /** 결사의 장검(계백): 베기·찌르기·베기 → 크게 내려베기 → 발 구르기 충격파 (황산벌의 결사) */
  gyebaek: [S(1.1), T(1.1), S(1.2, P), M("cleave", 1.6, P), M("shock", 2.2)],
};

export const GENERAL_WEAPONS = {
  /** 훈련용 창 (처음 무기) */
  trainingSpear: { id: "trainingSpear", kind: "spear", damageMul: 1, attackSpeed: 2.4, range: 56, projectileSpeed: 0, arcCos: 0.4, spear: "basic", legend: "charge", exclusive: "general" },
  /** 방천화극 (여포) */
  skyHalberd: { id: "skyHalberd", kind: "spear", damageMul: 1.25, attackSpeed: 2.2, range: 60, projectileSpeed: 0, arcCos: 0.2, spear: "halberd", legend: "frenzy", exclusive: "general" },
  /** 청룡언월도 (관우) */
  greenDragonBlade: { id: "greenDragonBlade", kind: "spear", damageMul: 1.4, attackSpeed: 1.8, range: 58, projectileSpeed: 3.5, arcCos: 0.2, spear: "glaive", legend: "dragonCleave", exclusive: "general" },
  /** 장팔사모 (장비) */
  serpentSpear: { id: "serpentSpear", kind: "spear", damageMul: 1.15, attackSpeed: 2.3, range: 72, projectileSpeed: 0, arcCos: 0.4, spear: "serpent", legend: "roar", exclusive: "general" },
  /** 의천검 (조조) */
  heavenSword: { id: "heavenSword", kind: "spear", damageMul: 1.1, attackSpeed: 2.8, range: 44, projectileSpeed: 0, arcCos: 0.1, spear: "sword", legend: "hegemon", exclusive: "general" },
  /** 쌍고검 (유비) */
  twinSwords: { id: "twinSwords", kind: "spear", damageMul: 0.95, attackSpeed: 3, range: 44, projectileSpeed: 0, arcCos: 0.2, spear: "twin", legend: "benevolence", exclusive: "general" },
  /** 화랑 보검 (김유신) */
  hwarangSword: { id: "hwarangSword", kind: "spear", damageMul: 1.15, attackSpeed: 2.5, range: 50, projectileSpeed: 0, arcCos: 0.2, spear: "hwarang", legend: "unify", exclusive: "general" },
  /** 대도 (척준경) */
  loneBlade: { id: "loneBlade", kind: "spear", damageMul: 1.35, attackSpeed: 2, range: 54, projectileSpeed: 0, arcCos: 0.1, spear: "lone", legend: "loneHero", exclusive: "general" },
  /** 애각창 (조운) */
  cliffSpear: { id: "cliffSpear", kind: "spear", damageMul: 1.05, attackSpeed: 2.7, range: 64, projectileSpeed: 0, arcCos: 0.4, spear: "cliff", legend: "sevenCharge", exclusive: "general" },
  /** 쌍룡검 (이순신) */
  twinDragonSword: { id: "twinDragonSword", kind: "spear", damageMul: 1.2, attackSpeed: 2.3, range: 50, projectileSpeed: 3.5, arcCos: 0.2, spear: "twinDragon", legend: "craneWing", exclusive: "general" },
  /** 장검 (계백) */
  gyebaekBlade: { id: "gyebaekBlade", kind: "spear", damageMul: 1.3, attackSpeed: 2.1, range: 52, projectileSpeed: 0, arcCos: 0.1, spear: "gyebaek", legend: "lastStand", exclusive: "general" },
} as const satisfies Record<string, WeaponDef>;

/** 필살기마다 빛깔 (효과·검기·이름) */
export const LEGEND_COLORS: Record<LegendKind, string> = {
  charge: "#e8ecf4",
  frenzy: "#ff3a3a",
  dragonCleave: "#3ae08a",
  roar: "#ff9a2a",
  hegemon: "#a05aff",
  benevolence: "#ffd860",
  unify: "#5ac8ff",
  loneHero: "#ff4a6a",
  sevenCharge: "#c8f0ff",
  craneWing: "#3a7aff",
  lastStand: "#ff6a1a",
};

/** 장수 공격 수치 */
export const GENERAL = {
  /** 묶음 끝에서 쉬는 배율 (공격 간격 × 이만큼) */
  pause: 1.8,
  /** 찌르기 굵기(반) · 돌진 거리 · 돌진 끝 폭발 반경 · 휘두르기 반경 배율 */
  width: 6,
  lungeDist: 14,
  lungeBlast: 22,
  swingReach: 0.85,
  /** 돌진 베기 거리 · 발 구르기 반경 배율 */
  rushDist: 34,
  shockReach: 0.9,
  /** 적에게 뛰어드는 기술(돌진 내리꽂기·돌진 베기)마다 보호막 · 남는 틱 */
  dashShield: 10,
  dashShieldTicks: 120,
};
