// 마젠타(아슈바르, 태초의 색채 악마 7원색 군단의 자홍): 무기는 욕망의 부채 하나 · 패시브 없음
// 기본 공격·추가 공격(1~4단계)·스킬·저주·매료의 향기 수치는 모두 itemsMagenta · 적응력은 느아르와 같음(itemsNoir NR_ADAPT) · 계산은 sim/magenta·mzSkills·mzHex
import type { WeaponDef } from "./content";

export const MAGENTA_WEAPONS = {
  /** 욕망의 부채: 누르면 지금 단계의 기본 공격 (사거리 = 공격 범위 MZ_BASE.aim과 같게) */
  mzFan: { id: "mzFan", kind: "desireFan", damageMul: 1, attackSpeed: 1, range: 170, projectileSpeed: 6, exclusive: "magenta" },
} as const satisfies Record<string, WeaponDef>;
