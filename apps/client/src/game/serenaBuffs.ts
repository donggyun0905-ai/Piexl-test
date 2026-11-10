// 버프 창: 세레나 줄 (무희 치명타·빛 피해 · 환혹의 무도 남은 시간)
import type { PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function serenaBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "serena") return [];
  const out: RoomBuff[] = [{ key: "snCrit", label: t("bfSnCrit"), tip: t("serenaDesc") }];
  if ((p.snUlt ?? 0) > 0) out.push({ key: "snUlt", label: t("bfSnUlt").replace("{s}", String(Math.ceil(p.snUlt! / 60))), tip: t("snSkillTip4") });
  return out;
}
