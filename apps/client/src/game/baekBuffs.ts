// 버프 창: 백령 줄 (영혼 게이지 칸·쌓인 영혼 · 가장 크게 되면 '가득')
import { maxLv, soulNeed, type PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function baekBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "baekryeong") return [];
  const tip = t("bfBySoulTip");
  const lv = p.byLv ?? 0;
  if (lv >= maxLv()) return [{ key: "bySoul", label: t("bfBySoulMax"), tip }];
  const label = t("bfBySoul").replace("{n}", String(lv)).replace("{s}", String(p.bySouls ?? 0)).replace("{m}", String(soulNeed(p)));
  return [{ key: "bySoul", label, tip }];
}
