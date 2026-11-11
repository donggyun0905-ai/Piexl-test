// 혼령(실베르, 곰방대 연기로 싸우는 여인): 무기 10개 모두 곰방대(smokePipe) · 앞으로 보랏빛 연기용을 내뿜음 · 무기마다 길이·빠르기·속성(상태이상)이 다름 (HR_STYLE)
// 공격할 때마다 방 어딘가에 연기 구름(HR_CLOUD) → 구름 안에 들어가면 은신 (적이 쫓아오지만 내 자리를 정확히 겨누지 못함)
// 전용 패시브 10개(혼-랑·범·효·룡·영, 혼령사냥 등)는 itemsHonryeong · 계산은 sim/honryeong·hrKit·hrBeasts·hrSpirits
import type { WeaponDef } from "./content";

const W = <T extends string>(id: T, attackSpeed: number, range: number) =>
  ({ id, kind: "smokePipe", damageMul: 1, attackSpeed, range, projectileSpeed: 4, exclusive: "honryeong" }) as const;

export const HONRYEONG_WEAPONS = {
  /** 곰방대: 앞으로 연기용을 내뿜음 (기본) */
  hrPipe: W("hrPipe", 1.2, 70),
  /** 불씨 곰방대: 맞은 적이 불탐 */
  hrEmber: W("hrEmber", 1.2, 66),
  /** 서리 곰방대: 맞은 적이 느려짐 */
  hrFrost: W("hrFrost", 1.1, 66),
  /** 독초 곰방대: 맞은 적이 중독 */
  hrVenom: W("hrVenom", 1.2, 66),
  /** 약초 곰방대: 적을 맞히면 확률로 체력 회복 */
  hrHerb: W("hrHerb", 1.2, 60),
  /** 뇌전 곰방대: 맞은 적이 확률로 기절 */
  hrBolt: W("hrBolt", 1.1, 72),
  /** 혈연초 곰방대: 맞은 적이 출혈 */
  hrBlood: W("hrBlood", 1.2, 62),
  /** 장죽: 길고 세게 · 느림 */
  hrLong: W("hrLong", 0.7, 110),
  /** 단죽: 짧고 아주 빠름 */
  hrShort: W("hrShort", 2, 44),
  /** 몽환 곰방대: 공격마다 구름 둘 */
  hrDream: W("hrDream", 1.1, 64),
} as const satisfies Record<string, WeaponDef>;

export type HonryeongWeaponId = keyof typeof HONRYEONG_WEAPONS;

/**
 * 무기마다 연기용 (reach 뻗는 길이(사거리 증가만큼 늘어남) · half 폭의 절반 · mul 피해 배율 · cd 다시 공격까지 틱 · clouds 공격마다 구름 수)
 * status 속성: 0 없음 · 1 화상 · 2 느려짐 · 3 중독 · 4 회복 · 5 기절 · 6 출혈 · chance 걸릴 확률 · ticks 지속 틱(회복은 회복량)
 */
export const HR_STYLE: Record<HonryeongWeaponId, { reach: number; half: number; mul: number; cd: number; clouds: number; status: number; chance: number; ticks: number }> = {
  hrPipe: { reach: 70, half: 14, mul: 1, cd: 24, clouds: 1, status: 0, chance: 0, ticks: 0 },
  hrEmber: { reach: 66, half: 14, mul: 0.9, cd: 24, clouds: 1, status: 1, chance: 1, ticks: 0 },
  hrFrost: { reach: 66, half: 16, mul: 0.9, cd: 26, clouds: 1, status: 2, chance: 1, ticks: 90 },
  hrVenom: { reach: 66, half: 14, mul: 0.85, cd: 24, clouds: 1, status: 3, chance: 1, ticks: 180 },
  hrHerb: { reach: 60, half: 14, mul: 0.9, cd: 24, clouds: 1, status: 4, chance: 0.1, ticks: 1 },
  hrBolt: { reach: 72, half: 12, mul: 0.95, cd: 26, clouds: 1, status: 5, chance: 0.15, ticks: 40 },
  hrBlood: { reach: 62, half: 14, mul: 0.9, cd: 24, clouds: 1, status: 6, chance: 1, ticks: 0 },
  hrLong: { reach: 110, half: 12, mul: 1.5, cd: 40, clouds: 1, status: 0, chance: 0, ticks: 0 },
  hrShort: { reach: 44, half: 16, mul: 0.6, cd: 14, clouds: 1, status: 0, chance: 0, ticks: 0 },
  hrDream: { reach: 64, half: 14, mul: 0.85, cd: 26, clouds: 2, status: 0, chance: 0, ticks: 0 },
};

/**
 * 연기 구름: 방에 가장 많이 · 사는 틱(10초) · 놓을 자리를 찾는 횟수(가장 덜 겹치는 자리) · 크기 배율(다 차면 방을 덮을 만큼)
 * 은신 동안 적이 겨누는 자리가 내 몸에서 어긋나는 거리 · 중독 피해 배율(독초 곰방대)
 */
export const HR_CLOUD = {
  cap: 30,
  life: 600,
  tries: 14,
  cover: 1.1,
  lure: 46,
  poison: 0.2,
};
