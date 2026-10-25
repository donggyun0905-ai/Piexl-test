// 사멸 전용 아이템 10개. 효과는 sim/samyeol. 수치는 SAMYEOL_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const S = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "samyeol" as const, effect: true as const });

export const SAMYEOL_PASSIVES = {
  /** 당가 비독: 독 피해 +30% */
  smVenom: S("smVenom"),
  /** 저승 꽃: 죽음 피해 +30% */
  smReaper: S("smReaper"),
  /** 짙은 안개: 독가스가 더 자주 (침 30 → 20개마다) */
  smMist: S("smMist"),
  /** 퍼지는 독무: 독가스 범위 +30%, 50% 오래 */
  smCloud: S("smCloud"),
  /** 소매 속 침: 한 번에 침 +2 */
  smMore: S("smMore"),
  /** 관통침: 침이 적 하나를 더 꿰뚫음 */
  smPierce: S("smPierce"),
  /** 비단 옷: 독가스 안에서 받는 피해 -20% */
  smSilk: S("smSilk"),
  /** 독의 입맞춤: 독·죽음에 걸린 적을 쓰러뜨리면 체력 1 회복 */
  smKiss: S("smKiss"),
  /** 당가의 비전: 공격 속도 +15% */
  smTang: { id: "smTang", mods: [{ stat: "attackSpeed", mul: 1.15 }] as StatMod[], exclusive: "samyeol" as const },
  /** 독꽃: 독에 걸린 적이 쓰러지면 그 자리에 독가스 */
  smBloom: S("smBloom"),
} as const satisfies Record<string, PassiveDef>;

/** 사멸 아이템 수치 */
export const SAMYEOL_PERKS = {
  smVenom: { mul: 1.3 },
  smReaper: { mul: 1.3 },
  smMist: { every: 20 },
  smCloud: { r: 1.3, dur: 1.5 },
  smMore: { n: 2 },
  smPierce: { n: 1 },
  smSilk: { taken: 0.8 },
  smKiss: { heal: 1 },
  smBloom: { r: 0.8 },
};
