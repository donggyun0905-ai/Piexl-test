// 아슈바르 베르 글자 (한·영·일): 무기 1 이름 (패시브 없음 · 공격·스킬 이름은 i18n/text/vertAttacks)
import type { WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export const VT_WEAPON_NAMES: Record<"vtScythe" & WeaponId, Names> = {
  vtScythe: { ko: "덩굴 쌍낫", en: "Twin Vine Scythes", ja: "蔓の双鎌" },
};
