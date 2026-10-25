// 능력치. 캐릭터·무기 기본값에 패시브 아이템 효과(더하기 먼저, 곱하기 나중)를 적용해 계산한다.

export type StatKey = "maxHp" | "damage" | "attackSpeed" | "range" | "moveSpeed" | "projectileSpeed" | "luck";
export type Stats = Record<StatKey, number>;

export const STAT_KEYS: readonly StatKey[] = [
  "maxHp",
  "damage",
  "attackSpeed",
  "range",
  "moveSpeed",
  "projectileSpeed",
  "luck",
];

/** 능력치 변화 하나 (패시브 아이템 등). add는 더하기, mul은 곱하기 (1.2 = 20% 증가) */
export interface StatMod {
  stat: StatKey;
  add?: number;
  mul?: number;
}

/** 상한·하한. 공격 속도·이동 속도는 상한, 공격력·사거리는 하한 */
export const STAT_LIMITS: Partial<Record<StatKey, { min?: number; max?: number }>> = {
  maxHp: { min: 1 },
  damage: { min: 1 },
  attackSpeed: { min: 0.5, max: 10 },
  range: { min: 12 },
  moveSpeed: { min: 0.5, max: 2.6 },
  projectileSpeed: { min: 0.1 },
  luck: { min: 0 },
};

export function computeStats(base: Stats, mods: readonly StatMod[]): Stats {
  const out = { ...base };
  for (const key of STAT_KEYS) {
    let add = 0;
    let mul = 1;
    for (const m of mods) {
      if (m.stat !== key) continue;
      if (m.add !== undefined) add += m.add;
      if (m.mul !== undefined) mul *= m.mul;
    }
    let v = (base[key] + add) * mul;
    const lim = STAT_LIMITS[key];
    if (lim?.min !== undefined && v < lim.min) v = lim.min;
    if (lim?.max !== undefined && v > lim.max) v = lim.max;
    out[key] = v;
  }
  return out;
}
