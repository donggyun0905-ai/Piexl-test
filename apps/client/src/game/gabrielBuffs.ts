// 버프 창: 가브리엘 줄 (철옹 · 불멸의 성벽 남은 시간)
import type { PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function gabrielBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "gabriel") return [];
  const out: RoomBuff[] = [{ key: "gbHalve", label: t("bfGbHalve"), tip: t("gabrielDesc") }];
  if ((p.gbUlt ?? 0) > 0) out.push({ key: "gbUlt", label: t("bfGbUlt").replace("{s}", String(Math.ceil(p.gbUlt! / 60))), tip: t("gbSkillTip4") });
  return out;
}
