// 버프 창: 이안 줄 (급소 준비 · 인과율 속박 남은 시간)
import type { PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function ianBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "ian") return [];
  const out: RoomBuff[] = [];
  if (p.iaAmbush) out.push({ key: "iaAmbush", label: t("bfIaAmbush"), tip: t("iaSkillTip2") });
  if ((p.iaLaw ?? 0) > 0) out.push({ key: "iaLaw", label: t("bfIaLaw").replace("{s}", String(Math.ceil(p.iaLaw! / 60))), tip: t("iaSkillTip4") });
  return out;
}
