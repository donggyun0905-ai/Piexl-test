// 훅(탈라시아, 해적): 커다란 갈고리(빛 갈고리)를 던져 적을 끌어모으고, 품속 더블배럴 산탄총으로 초근접 발사
// 맞은 적은 끌려온 원래 자리 쯤으로 튕겨 날아감 (벽에 부딪히면 난파: 추가 피해 + 기절)
// 아무 적도 안 걸리고 벽에 걸리면 밧줄을 타고 그 벽으로 날아감 (자유로운 이동). 보스에 걸리면 내가 보스에게 끌려가 쏘고 튕겨 돌아옴
// 무기 = 갈고리·총 6가지. 계산은 sim/hook·hookShot
import type { WeaponDef } from "./content";

/** 갈고리 종류: rusty 녹슨 · kraken 크라켄(많이 걸림) · harpoon 작살(멀리·빠름) · storm 폭풍탄(번개) · dragon 용의 숨결탄(불·넓게) · undertow 역조(멀리 튕김·난파 강함) */
export type HookKind = "rusty" | "kraken" | "harpoon" | "storm" | "dragon" | "undertow";

/** 갈고리 하나: 종류 · 걸리는 적 수 더함 · 갈고리 거리 배율 · 갈고리 빠르기 배율 · 산탄 부채꼴 배율 · 튕김 배율 · 난파 피해 배율 · 상태이상 */
export interface HookStyle {
  hook: HookKind;
  catch?: number;
  reach?: number;
  speed?: number;
  spread?: number;
  knock?: number;
  wreck?: number;
  dot?: "shock" | "burn";
}

const W = (id: string, damageMul: number, attackSpeed: number, hook: HookStyle) =>
  ({ id, kind: "grapple", damageMul, attackSpeed, range: 120, projectileSpeed: 9, hook, exclusive: "hook" }) as const;

export const HOOK_WEAPONS = {
  /** 녹슨 갈고리 (처음 무기): 고른 성능 */
  hkRusty: W("hkRusty", 1, 1, { hook: "rusty" }),
  /** 크라켄 갈고리: 한 번에 2마리 더 걸림 (조금 약함) */
  hkKraken: W("hkKraken", 0.85, 1, { hook: "kraken", catch: 2, spread: 1.15 }),
  /** 작살 갈고리: 갈고리가 35% 멀리 · 30% 빠르게 */
  hkHarpoon: W("hkHarpoon", 1, 1.05, { hook: "harpoon", reach: 1.35, speed: 1.3 }),
  /** 폭풍탄 산탄총: 맞은 적에게서 번개가 튐 */
  hkStorm: W("hkStorm", 0.85, 1, { hook: "storm", dot: "shock" }),
  /** 용의 숨결탄: 산탄이 넓게 퍼지고 불탐 */
  hkDragon: W("hkDragon", 1, 0.95, { hook: "dragon", dot: "burn", spread: 1.35 }),
  /** 역조 갈고리: 걸리지 않은 적을 50% 멀리 밀어내고 난파 피해 2배 */
  hkUndertow: W("hkUndertow", 1, 0.95, { hook: "undertow", knock: 1.5, wreck: 2 }),
} as const satisfies Record<string, WeaponDef>;

/** 훅 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀, 부채꼴은 cos: 1 한 줄 · 0 반원) */
export const HOOK = {
  /** 갈고리: 거리 · 나가는 빠르기 · 감아 오는 빠르기 · 걸리는 폭 · 걸리는 적 수 · 지나가며 주는 피해 배율 */
  reach: 120,
  outSpeed: 9,
  reelSpeed: 8,
  catchR: 13,
  catchMax: 3,
  grabMul: 0.3,
  /** 끌려온 적을 세울 거리 (내 앞) */
  holdAt: 20,
  /** 산탄총: 닿는 거리 · 부채꼴 · 피해 배율 · 끌려온 적 피해 배율(초근접) · 기본 튕김 거리(끌려오지 않은 적) */
  shotReach: 58,
  shotArc: 0.55,
  shotMul: 1.5,
  pointBlank: 1.3,
  knockDist: 50,
  /** 튕겨 날아가는 틱 · 난파(벽에 부딪힘) 피해 배율 · 기절 틱 */
  slideTicks: 10,
  wreckMul: 0.8,
  wreckStun: 40,
  /** 밧줄 타기(벽·보스): 한 틱 거리 · 최대 틱 · 보스 앞 멈출 거리 · 보스를 쏜 뒤 튕겨 돌아오는 틱 */
  zipStep: 10,
  zipTicks: 20,
  zipStop: 14,
  bounceTicks: 10,
  /** 약화(캐릭터 능력): 갈고리에 걸릴 때마다 1스택 · 최대 스택 · 스택마다 받는 피해 더함 */
  markMax: 5,
  markTaken: 0.05,
  /** 폭풍탄: 번개 튀는 거리 · 피해 배율 · 용의 숨결: 화상 세기 */
  boltReach: 80,
  boltMul: 0.45,
  burnMul: 0.15,
};
