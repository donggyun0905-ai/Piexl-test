// 느아르(아슈바르, 태초의 색채 악마 7원색 군단의 검정): 무기는 공허의 검 하나 · 패시브 없음
// 기본 공격·추가 공격(1~4단계)·스킬·적응력 수치는 모두 itemsNoir (관리자 표 하나로) · 계산은 sim/noir·nrVolley
import type { WeaponDef } from "./content";

export const NOIR_WEAPONS = {
  /** 공허의 검: 누르면 지금 단계의 기본 공격 (사거리 = 베는 거리) */
  nrBlade: { id: "nrBlade", kind: "voidBlade", damageMul: 1, attackSpeed: 1, range: 46, projectileSpeed: 4, exclusive: "noir" },
} as const satisfies Record<string, WeaponDef>;
