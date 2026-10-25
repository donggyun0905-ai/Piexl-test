// 역병의사 전용 아이템 10개. 효과는 sim/plague. 수치는 PLAGUE_PERKS
import type { PassiveDef } from "./items";

export const PLAGUE_PASSIVES = {
  /** 독샘: 독·불·죽음 피해 +30% */
  plGland: { id: "plGland", mods: [], exclusive: "plague", effect: true },
  /** 굶주린 모기: 모기떼 반경 +35% */
  plHive: { id: "plHive", mods: [], exclusive: "plague", effect: true },
  /** 짙은 연기: 연기 구역이 50% 오래, 하나 더 */
  plSmog: { id: "plSmog", mods: [], exclusive: "plague", effect: true },
  /** 쥐구멍: 쥐가 4마리 더 */
  plBurrow: { id: "plBurrow", mods: [], exclusive: "plague", effect: true },
  /** 검은 죽음: 흑사병 확률 20% → 30% */
  plBlackDeath: { id: "plBlackDeath", mods: [], exclusive: "plague", effect: true },
  /** 녹: 부식이 받는 피해 +5% → +10% */
  plRust: { id: "plRust", mods: [], exclusive: "plague", effect: true },
  /** 새부리 가면: 받는 피해 -15% */
  plMask: { id: "plMask", mods: [], exclusive: "plague", effect: true },
  /** 사혈: 상태이상에 걸린 적을 쓰러뜨리면 체력 2 회복 */
  plBloodlet: { id: "plBloodlet", mods: [], exclusive: "plague", effect: true },
  /** 전염: 흑사병에 걸린 적이 쓰러지면 가까운 적에게 옮음 */
  plContagion: { id: "plContagion", mods: [], exclusive: "plague", effect: true },
  /** 사신의 손: 죽음의 손아귀 즉사 확률 +10% */
  plReaper: { id: "plReaper", mods: [], exclusive: "plague", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 역병의사 아이템 수치 */
export const PLAGUE_PERKS = {
  plGland: { mul: 1.3 },
  plHive: { r: 1.35 },
  plSmog: { dur: 1.5, more: 1 },
  plBurrow: { rats: 4 },
  plBlackDeath: { chance: 0.3 },
  plRust: { corrode: 0.1 },
  plMask: { taken: 0.85 },
  plBloodlet: { heal: 2 },
  plContagion: { r: 50 },
  plReaper: { chance: 0.1 },
};
