// 버프 창: 기어스 줄 (구체 · 천상의 수호자 남은 초 · 반격 태세)
import type { PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function gearsBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "gears") return [];
  const out: RoomBuff[] = [];
  if (p.geBall) out.push({ key: "geBall", label: t("bfGeBall"), tip: t("bfGeBallTip") });
  if ((p.geGuard ?? 0) > 0) out.push({ key: "geGuard", label: t("bfGeGuard").replace("{n}", String(Math.ceil((p.geGuard ?? 0) / 60))), tip: t("bfGeGuardTip") });
  if ((p.geRage ?? 0) > 0) out.push({ key: "geRage", label: t("bfGeRage"), tip: t("bfGeRageTip") });
  return out;
}
