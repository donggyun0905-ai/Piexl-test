// 소환술사 전용 아이템 (채찍일 때 효과). 효과는 sim/summon·summons. 수치는 SUMMON_PERKS (관리자 페이지에서 바꿈)
import type { PassiveDef } from "./items";

export const SUMMON_PASSIVES = {
  /** 소환수 최대 수 +2 */
  horde: { id: "horde", mods: [], exclusive: "summoner", effect: true },
  /** 소환수가 50% 더 오래 남음 */
  oldPact: { id: "oldPact", mods: [], exclusive: "summoner", effect: true },
  /** 채찍으로 맞힐 때마다 2초 동안 소환수 공격이 50% 빨라짐 */
  lash: { id: "lash", mods: [], exclusive: "summoner", effect: true },
  /** 소환수가 적을 쓰러뜨리면 소환 게이지 +1 */
  soulHarvest: { id: "soulHarvest", mods: [], exclusive: "summoner", effect: true },
  /** 소환수 피해 +40% */
  empower: { id: "empower", mods: [], exclusive: "summoner", effect: true },
  /** 채찍 사거리 +20% */
  longWhip: { id: "longWhip", mods: [{ stat: "range", mul: 1.2 }], exclusive: "summoner" },
  /** 소환수가 사라질 때 터짐 (공격력 150%) */
  sacrifice: { id: "sacrifice", mods: [], exclusive: "summoner", effect: true },
  /** 내 둘레 60 안 소환수 피해 +30% */
  command: { id: "command", mods: [], exclusive: "summoner", effect: true },
  /** 소환수 하나마다 받는 피해 -5% (최대 -25%) */
  bondShield: { id: "bondShield", mods: [], exclusive: "summoner", effect: true },
  /** 소환할 때 25% 확률로 하나 더 */
  twinSummon: { id: "twinSummon", mods: [], exclusive: "summoner", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 소환술사 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱) */
export const SUMMON_PERKS = {
  horde: { stacks: 2 },
  oldPact: { mul: 1.5 },
  lash: { speed: 0.5, ticks: 120 },
  empower: { damage: 1.4 },
  sacrifice: { damage: 1.5, radius: 24 },
  command: { damage: 1.3, radius: 60 },
  bondShield: { taken: 0.05, below: 0.25 },
  twinSummon: { chance: 0.25 },
};
