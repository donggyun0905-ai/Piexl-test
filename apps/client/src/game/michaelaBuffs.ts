// 버프 창: 미카엘라 줄 (든 무기 속성·종류 · 콤보 · 무한의 무기고 남은 시간)
import { MICHAELA, type PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function michaelaBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "michaela") return [];
  const n = p.mcCombo ?? 0;
  const e = `mcElem${p.mcElem ?? 0}` as TextKey;
  const k = `mcKind${p.mcHeld ?? 0}` as TextKey;
  const out: RoomBuff[] = [{ key: "mcHeld", label: t("bfMcHeld").replace("{e}", t(e)).replace("{k}", t(k)), tip: t("mcElemTip") }];
  if (n > 0) out.push({ key: "mcCombo", label: t("bfMcCombo").replace("{n}", String(n)).replace("{p}", String(Math.round(n * MICHAELA.comboStep * 100))), tip: t("michaelaDesc") });
  if ((p.mcUlt ?? 0) > 0) out.push({ key: "mcUlt", label: t("bfMcUlt").replace("{s}", String(Math.ceil(p.mcUlt! / 60))), tip: t("mcSkillTip4") });
  return out;
}
