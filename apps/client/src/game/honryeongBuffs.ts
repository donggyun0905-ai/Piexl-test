// 버프 창: 혼령 줄 (은신 중 · 방의 구름 수)
import { HR_CLOUD, type PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function honryeongBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "honryeong") return [];
  const out: RoomBuff[] = [];
  if (p.hrHidden) out.push({ key: "hrHidden", label: t("bfHrHidden"), tip: t("bfHrHiddenTip") });
  const n = p.hrClouds?.length ?? 0;
  if (n > 0) out.push({ key: "hrCloud", label: t("bfHrCloud").replace("{n}", String(n)).replace("{m}", String(HR_CLOUD.cap)), tip: t("bfHrCloudTip") });
  return out;
}
