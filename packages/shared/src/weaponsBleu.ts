// 블뢰(아슈바르, 태초의 색채 악마 7원색 군단의 파랑): 무기는 하얀 마도서 하나 · 패시브 없음
// 기본 공격·추가 공격(1~4단계)·스킬·얼음마녀 수치는 모두 itemsBleu · 적응력은 느아르와 같음(itemsNoir NR_ADAPT) · 계산은 sim/bleu·buSkills
import type { WeaponDef } from "./content";

export const BLEU_WEAPONS = {
  /** 하얀 마도서: 누르면 지금 단계의 기본 공격 (사거리 = 공격 범위 BU_BASE.aim과 같게) */
  buTome: { id: "buTome", kind: "whiteTome", damageMul: 1, attackSpeed: 1, range: 170, projectileSpeed: 6, exclusive: "bleu" },
} as const satisfies Record<string, WeaponDef>;
