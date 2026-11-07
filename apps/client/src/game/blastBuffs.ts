// 버프 창: 블래스트 줄 (달빛 각성 남은 시간)
import type { PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function blastBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "blast" || !(p.sgAwake ?? 0)) return [];
  return [{ key: "sgAwake", label: t("bfSgAwake").replace("{s}", String(Math.ceil(p.sgAwake! / 60))), tip: t("sgGaugeTip") }];
}
