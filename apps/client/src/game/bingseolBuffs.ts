// 버프 창: 빙설 줄 (맵의 얼음가루 수 · 궁극기 빙설창 기 모으는 중)
import { BINGSEOL_PERKS, type PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function bingseolBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "bingseol") return [];
  const out: RoomBuff[] = [];
  if (p.passives.includes("bsDust" as never) || (p.bsDust?.length ?? 0) > 0) {
    const label = t("bfBsDust").replace("{n}", String(p.bsDust?.length ?? 0)).replace("{m}", String(BINGSEOL_PERKS.bsDust.cap));
    out.push({ key: "bsDust", label, tip: t("bfBsDustTip") });
  }
  if (p.bsUlt && p.bsUlt.t < BINGSEOL_PERKS.bsUlt.charge) out.push({ key: "bsUlt", label: t("bfBsUlt"), tip: t("bfBsUltTip") });
  return out;
}
