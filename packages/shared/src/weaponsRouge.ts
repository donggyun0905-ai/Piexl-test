// 루주(아슈바르, 태초의 색채 악마 7원색 군단의 빨강): 무기는 장미쌍검 하나 · 패시브 없음
// 기본 공격·추가 공격(1~4단계)·스킬·혈장미 수치는 모두 itemsRouge · 적응력은 느아르와 같음(itemsNoir NR_ADAPT) · 계산은 sim/rouge·rgSkills
import type { WeaponDef } from "./content";

export const ROUGE_WEAPONS = {
  /** 장미쌍검: 누르면 지금 단계의 기본 공격 (사거리 = 베는 거리) */
  rgBlades: { id: "rgBlades", kind: "roseBlades", damageMul: 1, attackSpeed: 1, range: 46, projectileSpeed: 4, exclusive: "rouge" },
} as const satisfies Record<string, WeaponDef>;
