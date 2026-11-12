// 아슈바르 느아르 글자 (한·영·일): 무기 1 이름 (패시브 없음 · 공격·스킬 이름은 i18n/text/noirAttacks)
import type { WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export const NR_WEAPON_NAMES: Record<"nrBlade" & WeaponId, Names> = {
  nrBlade: { ko: "공허의 손톱", en: "Void Claw", ja: "虚無の爪" },
};
