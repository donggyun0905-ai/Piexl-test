// 아슈바르 블랑 글자 (한·영·일): 무기 1 이름 (패시브 없음 · 공격·스킬 이름은 i18n/text/blancAttacks)
import type { WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export const BC_WEAPON_NAMES: Record<"bcFan" & WeaponId, Names> = {
  bcFan: { ko: "순백의 부채", en: "Pure White Fan", ja: "純白の扇" },
};
