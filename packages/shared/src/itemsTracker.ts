// 추적자 전용 아이템 10개. 효과는 sim/tracker. 수치는 TRACKER_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const S = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "tracker" as const, effect: true as const });

export const TRACKER_PASSIVES = {
  /** 고배율 조준경: 사거리 +25% · 암습 저격 조준 원 +50% */
  trScope: { id: "trScope", mods: [{ stat: "range", mul: 1.25 }] as StatMod[], exclusive: "tracker" as const, effect: true as const },
  /** 할로 포인트탄: 평소 저격 피해 +25% */
  trHollow: S("trHollow"),
  /** 소음기: 암습 저격 대기 시간 -30% */
  trSilencer: S("trSilencer"),
  /** 양각대: 1초 이상 가만히 있으면 피해 +30% */
  trBipod: S("trBipod"),
  /** 사냥감 표식: 맞힌 적은 3초 동안 받는 피해 +15% */
  trMark: S("trMark"),
  /** 도탄: 평소 저격이 맞은 뒤 가까운 적에게 한 번 튕김 (절반 피해) */
  trRicochet: S("trRicochet"),
  /** 확장 탄창: 연발사격 10발 → 15발 */
  trDrum: S("trDrum"),
  /** 고압 장약: 강력한 한방 대기 시간 60초 → 40초 */
  trCharge: S("trCharge"),
  /** 위장복: 대시한 뒤 1초 동안 받는 피해 -40% */
  trCamo: S("trCamo"),
  /** 헤드샷: 15% 확률로 치명타 (2배) */
  trHeadshot: S("trHeadshot"),
} as const satisfies Record<string, PassiveDef>;

/** 추적자 아이템 수치 */
export const TRACKER_PERKS = {
  trScope: { ring: 1.5 },
  trHollow: { mul: 1.25 },
  trSilencer: { cd: 0.7 },
  trBipod: { still: 60, mul: 1.3 },
  trMark: { ticks: 180, taken: 1.15 },
  trRicochet: { mul: 0.5, reach: 90 },
  trDrum: { shots: 15 },
  trCharge: { cd: 2400 },
  trCamo: { ticks: 60, taken: 0.6 },
  trHeadshot: { chance: 0.15, mul: 2 },
};
