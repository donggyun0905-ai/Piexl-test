// 묵인 전용 아이템 10개. 효과는 sim/mukin. 수치는 MUKIN_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const M = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "mukin" as const, effect: true as const });

export const MUKIN_PASSIVES = {
  /** 철판: 방어력 +10 */
  mkPlate: M("mkPlate"),
  /** 거대한 몸: 최대 체력 +40 */
  mkBulk: { id: "mkBulk", mods: [{ stat: "maxHp", add: 40 }] as StatMod[], exclusive: "mukin" as const },
  /** 가시 갑옷: 맞으면 둘레 적에게 방어력만큼 피해 (0.5초에 한 번) */
  mkSpikes: M("mkSpikes"),
  /** 바위 심장: 재생력 +10 */
  mkRegen: M("mkRegen"),
  /** 가속: 돌진 거리 +30% */
  mkMomentum: M("mkMomentum"),
  /** 충격: 돌진에 맞은 적이 0.5초 기절 */
  mkShock: M("mkShock"),
  /** 묵상: 가만히 서 있으면 방어력 +10 */
  mkMeditate: M("mkMeditate"),
  /** 약초 주머니: 회복약이 50% 더 차오름 */
  mkPotion: M("mkPotion"),
  /** 짓밟기: 돌진이 끝나면 둘레에 충격파 */
  mkTrample: M("mkTrample"),
  /** 무쇠 의지: 돌진 피해가 방어력의 300% → 350% */
  mkIron: M("mkIron"),
} as const satisfies Record<string, PassiveDef>;

/** 묵인 아이템 수치 */
export const MUKIN_PERKS = {
  mkPlate: { def: 10 },
  mkSpikes: { r: 26, cd: 30 },
  mkRegen: { regen: 10 },
  mkMomentum: { mul: 1.3 },
  mkShock: { ticks: 30 },
  mkMeditate: { def: 10 },
  mkPotion: { mul: 1.5 },
  mkTrample: { r: 28 },
  mkIron: { mul: 3.5 },
};
