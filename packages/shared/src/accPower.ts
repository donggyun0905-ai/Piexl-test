// 투력: 낀 레이드 장신구 능력치를 숫자 하나로 (세계 지도에서 지역마다 권장 투력과 비교 — 몬스터를 쉽게 잡을 수 있는지 보는 눈금, 레벨업 없음)
import type { AccStat } from "./accDefs";
import type { AccTotals } from "./accRules";

/** 수치 (레이드 장신구 수치 ACC_RULES와 같이 이 파일에서 고침) */
export const ACC_POWER_RULES = {
  /** 장비가 하나도 없을 때 투력 */
  base: 100,
  /** 능력치 1(또는 1 = 100%)마다 더하는 투력 — 5성 10강 장신구 하나가 대략 100 안팎이 되게 맞춤 */
  per: {
    atk: 20, atkPct: 1000, aspd: 1500, def: 15, hp: 2, range: 5, rangePct: 300, move: 300, regen: 4, lifesteal: 8000,
    sharp: 400, crit: 600, critDmg: 400, dmg: 1500, dash: 300, itemReset: 250, half: 300, weak: 500, cleanse: 200,
    extra: 600, extra15: 500, revive: 120, undying: 150, heal5: 2500,
    /** 받는 피해 +는 투력이 줄고, -(덜 받음)는 늘어남 */
    taken: -800,
  } as Record<AccStat, number>,
};

/** 장비 능력치 합계 → 투력 (정수, 0 아래로는 안 내려감) */
export function accPower(t: AccTotals | undefined): number {
  let p = ACC_POWER_RULES.base;
  for (const [k, v] of Object.entries(t ?? {}) as [AccStat, number][]) p += (ACC_POWER_RULES.per[k] ?? 0) * v;
  return Math.max(0, Math.round(p));
}
