// 버프 창: 라파엘 줄 (초장거리·표적 · 에테르 스코프 남은 시간)
import type { PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function rafaelBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "rafael") return [];
  const out: RoomBuff[] = [{ key: "rfFar", label: t("bfRfFar"), tip: t("rafaelDesc") }];
  if ((p.rfScope ?? 0) > 0) out.push({ key: "rfScope", label: t("bfRfScope").replace("{s}", String(Math.ceil(p.rfScope! / 60))), tip: t("rfSkillTip3") });
  return out;
}
