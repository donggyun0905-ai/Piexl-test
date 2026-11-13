// 존(아슈바르, 태초의 색채 악마 7원색 군단의 노랑): 무기는 금빛 손아귀 하나 · 패시브 없음
// 기본 공격·추가 공격(1~4단계)·스킬·황금 번개 수치는 모두 itemsJaune · 적응력은 느아르와 같음(itemsNoir NR_ADAPT) · 계산은 sim/jaune·jnSkills
import type { WeaponDef } from "./content";

export const JAUNE_WEAPONS = {
  /** 금빛 손아귀: 누르면 지금 단계의 기본 공격 (사거리 = 공격 범위 JN_BASE.aim과 같게) */
  jnGrip: { id: "jnGrip", kind: "goldGrip", damageMul: 1, attackSpeed: 1, range: 170, projectileSpeed: 6, exclusive: "jaune" },
} as const satisfies Record<string, WeaponDef>;
