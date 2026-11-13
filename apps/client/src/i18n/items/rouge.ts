// 아슈바르 루주 글자 (한·영·일): 무기 1 이름 (패시브 없음 · 공격·스킬 이름은 i18n/text/rougeAttacks)
import type { WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export const RG_WEAPON_NAMES: Record<"rgBlades" & WeaponId, Names> = {
  rgBlades: { ko: "장미쌍검", en: "Twin Rose Blades", ja: "薔薇の双剣" },
};
