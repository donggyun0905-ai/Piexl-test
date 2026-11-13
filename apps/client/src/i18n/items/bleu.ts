// 아슈바르 블뢰 글자 (한·영·일): 무기 1 이름 (패시브 없음 · 공격·스킬 이름은 i18n/text/bleuAttacks)
import type { WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export const BU_WEAPON_NAMES: Record<"buTome" & WeaponId, Names> = {
  buTome: { ko: "하얀 마도서", en: "White Grimoire", ja: "白の魔導書" },
};
