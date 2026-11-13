// 블랑(아슈바르, 태초의 색채 악마 7원색 군단의 하양): 무기는 순백의 부채 하나 · 패시브 없음
// 기본 공격·추가 공격(1~4단계)·스킬·백무 수치는 모두 itemsBlanc · 적응력은 느아르와 같음(itemsNoir NR_ADAPT) · 계산은 sim/blanc·bcSkills·bcPossess·bcMinds
import type { WeaponDef } from "./content";

export const BLANC_WEAPONS = {
  /** 순백의 부채: 누르면 지금 단계의 기본 공격 (사거리 = 공격 범위 BC_BASE.aim과 같게) */
  bcFan: { id: "bcFan", kind: "whiteFan", damageMul: 1, attackSpeed: 1, range: 160, projectileSpeed: 6, exclusive: "blanc" },
} as const satisfies Record<string, WeaponDef>;
