// 광야의 새벽 무기·패시브 덧붙임 글 (레벨 업 카드·위쪽 칸 말풍선이 같이 씀): 조합 짝 · 각성 기술
import { evoPassive, evoSkill, type CharacterId, type PassiveId, type RunState, type WeaponId } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";

type T = (k: TextKey) => string;

/** 각성 기술 한 줄 */
export function skillLine(id: WeaponId, c: CharacterId, t: T): string {
  const k = evoSkill(id, c);
  return t("swarmEvoSkill").replace("{name}", t(`swarmSkill_${k}` as TextKey)).replace("{desc}", t(`swarmSkillDesc_${k}` as TextKey));
}

/** 조합 안내: 무기는 짝 패시브, 패시브는 가진 무기 중 짝인 것 */
export function comboLine(run: RunState, kind: "weapon" | "passive", id: WeaponId | PassiveId, lang: Lang, t: T): string {
  const who = run.player.characterId;
  if (kind === "weapon") return t("swarmCombo").replace("{name}", itemName("passive", evoPassive(who, id as WeaponId), lang));
  const w = run.swarm?.weapons.find((x) => evoPassive(who, x.id) === id);
  return w ? t("swarmComboFor").replace("{name}", itemName("weapon", w.id, lang)) : "";
}

/** 레벨 점 (●●●○○) */
export const pips = (lv: number, max: number) => "●".repeat(Math.min(lv, max)) + "○".repeat(Math.max(0, max - lv));
