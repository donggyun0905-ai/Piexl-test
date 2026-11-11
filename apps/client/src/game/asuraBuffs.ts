// 버프 창: 아수라 줄 (아수라 각성 남은 초 · 수라장 쌓임)
import type { PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function asuraBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "asura") return [];
  const out: RoomBuff[] = [];
  if ((p.asAwake ?? 0) > 0) out.push({ key: "asAwake", label: t("bfAsAwake").replace("{n}", String(Math.ceil((p.asAwake ?? 0) / 60))), tip: t("bfAsAwakeTip") });
  if ((p.asFury ?? 0) > 0) out.push({ key: "asFury", label: t("bfAsFury").replace("{n}", String(p.asFury)), tip: t("bfAsFuryTip") });
  return out;
}
