// 베르(아슈바르, 태초의 색채 악마 7원색 군단의 초록): 무기는 덩굴 쌍낫 하나 · 패시브 없음
// 기본 공격·추가 공격(1~4단계)·스킬·녹독 수치는 모두 itemsVert · 적응력은 느아르와 같음(itemsNoir NR_ADAPT) · 계산은 sim/vert·vtSkills·vtRot·vtPlants
import type { WeaponDef } from "./content";

export const VERT_WEAPONS = {
  /** 덩굴 쌍낫: 누르면 지금 단계의 기본 공격 (사거리 = 공격 범위 VT_BASE.aim과 같게) */
  vtScythe: { id: "vtScythe", kind: "rotScythe", damageMul: 1, attackSpeed: 1, range: 160, projectileSpeed: 6, exclusive: "vert" },
} as const satisfies Record<string, WeaponDef>;
