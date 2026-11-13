// 아슈바르 마젠타 글자 (한·영·일): 무기 1 이름 (패시브 없음 · 공격·스킬 이름은 i18n/text/magentaAttacks)
import type { WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export const MZ_WEAPON_NAMES: Record<"mzFan" & WeaponId, Names> = {
  mzFan: { ko: "욕망의 부채", en: "Fan of Desire", ja: "欲望の扇" },
};
