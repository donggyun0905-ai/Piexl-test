// 몰락한 왕(히든): 옛 제국의 왕이 모은 영혼 10,000개로 다시 일어남 · 무기는 거대한 투핸디드 대검(츠바이핸더) 하나 (콤보는 sim/kingBlade, 영혼은 sim/fallenKing)
import type { WeaponDef } from "./content";

export const FALLEN_KING_WEAPONS = {
  /** 몰락한 왕의 츠바이핸더: X자 두 번 베기 → 길어지는 검기 → 내리꽂아 푸른 불꽃 선 → 불기둥 */
  fkZwei: { id: "fkZwei", kind: "zwei", damageMul: 1, attackSpeed: 1.15, range: 52, projectileSpeed: 4, exclusive: "fallenKing" },
} as const satisfies Record<string, WeaponDef>;

/** 영혼 수치: 영혼 하나마다 공격력 + · 최대 체력 + · 조각이 날아와 몸에 닿는 틱 */
export const FALLEN_KING = {
  soulDamage: 0.012,
  soulHp: 0.05,
  fly: 26,
};
