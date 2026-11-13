// 아슈바르 존 글자 (한·영·일): 무기 1 이름 (패시브 없음 · 공격·스킬 이름은 i18n/text/jauneAttacks)
import type { WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export const JN_WEAPON_NAMES: Record<"jnGrip" & WeaponId, Names> = {
  jnGrip: { ko: "금빛 손아귀", en: "Golden Grip", ja: "金色の掌握" },
};
