// 버프 창: 유리엘 줄 (단죄 · 수호 결계 · 성녀 강림 남은 시간)
import type { PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function yurielBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "yuriel") return [];
  const out: RoomBuff[] = [{ key: "yrSin", label: t("bfYrSin"), tip: t("yurielDesc") }];
  if (p.yrWard) out.push({ key: "yrWard", label: t("bfYrWard").replace("{s}", String(Math.ceil(p.yrWard.t / 60))), tip: t("yrSkillTip3") });
  if ((p.yrSaint ?? 0) > 0) out.push({ key: "yrSaint", label: t("bfYrSaint").replace("{s}", String(Math.ceil(p.yrSaint! / 60))), tip: t("yrSkillTip4") });
  return out;
}
